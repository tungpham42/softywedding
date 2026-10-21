import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, verifyBearerToken } from "@/lib/firebase/admin";
import { readWeddingSchedule, readWeddingTasks } from "@/lib/wedding";

export const runtime = "nodejs";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function getAccessibleWedding(slug: string, uid: string) {
  const db = getAdminDb();
  if (!db) return { error: "Firebase Admin is not configured on the server.", status: 503 as const };
  const ref = db.collection("weddings").doc(slug);
  const snap = await ref.get();
  if (!snap.exists) return { error: "Wedding not found.", status: 404 as const };
  const data = snap.data() ?? {};
  if (data.ownerUid !== uid && data.plannerUid !== uid) return { error: "You don’t have permission to access this wedding.", status: 403 as const };
  return { db, ref, data };
}

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const identity = await verifyBearerToken(request);
  if (!identity) return Response.json({ error: "Sign in to view this wedding." }, { status: 401 });
  const { slug } = await context.params;
  try {
    const result = await getAccessibleWedding(slug, identity.uid);
    if ("error" in result) return Response.json({ error: result.error }, { status: result.status });
    const [guestSnap, inviteSnap] = await Promise.all([
      result.db.collection("weddings").doc(slug).collection("guests").get(),
      result.db.collection("inviteCodes").where("weddingSlug", "==", slug).get(),
    ]);
    const guests = guestSnap.docs.map((doc) => doc.data());
    const respondedGuests = guests.filter((guest) => guest.respondedAt != null);
    const respondedCount = respondedGuests.length;
    const attendingCount = respondedGuests.reduce((sum, guest) => sum + (guest.attending === true ? (typeof guest.guestCount === "number" ? guest.guestCount : 1) : 0), 0);
    return Response.json({ wedding: {
      slug,
      ...result.data,
      date: typeof result.data.date === "string" ? result.data.date : "",
      schedule: readWeddingSchedule(result.data.schedule),
      tasks: readWeddingTasks(result.data.tasks),
      published: result.data.published === true,
      invitedCount: inviteSnap.size,
      guestCount: guestSnap.size,
      respondedCount,
      attendingCount,
    } });
  } catch (error) {
    console.error("Wedding detail read failed", error);
    return Response.json({ error: "We couldn’t load this wedding." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ slug: string }> }) {
  const identity = await verifyBearerToken(request);
  if (!identity) return Response.json({ error: "Sign in to update this wedding." }, { status: 401 });
  const db = getAdminDb();
  if (!db) return Response.json({ error: "Firebase Admin is not configured on the server." }, { status: 503 });
  const { slug } = await context.params;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Send valid wedding changes." }, { status: 400 }); }
  if (!isRecord(body)) return Response.json({ error: "Invalid wedding changes." }, { status: 400 });

  const ref = db.collection("weddings").doc(slug);
  const snap = await ref.get();
  if (!snap.exists) return Response.json({ error: "Wedding not found." }, { status: 404 });
  const current = snap.data() ?? {};
  if (current.ownerUid !== identity.uid && current.plannerUid !== identity.uid) return Response.json({ error: "You don’t have permission to update this wedding." }, { status: 403 });

  const updates: Record<string, unknown> = {};
  const stringFields: Record<string, number> = {
    partnerOne: 80, partnerTwo: 80, date: 10, venue: 160, location: 200,
    headline: 180, story: 5000, ceremonyTime: 80, receptionTime: 80, heroImage: 2000,
  };
  for (const [field, maxLength] of Object.entries(stringFields)) {
    if (!(field in body)) continue;
    if (typeof body[field] !== "string") return Response.json({ error: `${field} must be text.` }, { status: 400 });
    const value = (body[field] as string).trim();
    if (field === "date" && value) {
      const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00Z`) : null;
      if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== value) {
        return Response.json({ error: "Please choose a valid wedding date." }, { status: 400 });
      }
    }
    updates[field] = value.slice(0, maxLength);
  }
  if ("published" in body) {
    if (typeof body.published !== "boolean") return Response.json({ error: "published must be a boolean." }, { status: 400 });
    if (body.published) {
      const partnerOne = typeof updates.partnerOne === "string" ? updates.partnerOne : current.partnerOne;
      const partnerTwo = typeof updates.partnerTwo === "string" ? updates.partnerTwo : current.partnerTwo;
      const date = typeof updates.date === "string" ? updates.date : current.date;
      if (![partnerOne, partnerTwo, date].every((value) => typeof value === "string" && value.trim())) {
        return Response.json({ error: "Add both partner names and a wedding date before publishing." }, { status: 400 });
      }
    }
    updates.published = body.published;
  }
  if ("schedule" in body) {
    if (!Array.isArray(body.schedule) || body.schedule.length > 30) return Response.json({ error: "Schedule must contain at most 30 items." }, { status: 400 });
    const schedule = body.schedule.filter(isRecord).map((item) => ({
      time: typeof item.time === "string" ? item.time.trim().slice(0, 80) : "",
      title: typeof item.title === "string" ? item.title.trim().slice(0, 120) : "",
      description: typeof item.description === "string" ? item.description.trim().slice(0, 500) : "",
    }));
    if (schedule.some((item) => !item.title)) return Response.json({ error: "Every schedule item needs a title." }, { status: 400 });
    updates.schedule = schedule;
  }
  if ("tasks" in body) {
    if (!Array.isArray(body.tasks) || body.tasks.length > 100) return Response.json({ error: "Checklist must contain at most 100 tasks." }, { status: 400 });
    const tasks = body.tasks.filter(isRecord).map((task, index) => ({
      id: typeof task.id === "string" && task.id ? task.id.slice(0, 100) : `task-${index + 1}`,
      category: typeof task.category === "string" ? task.category.trim().slice(0, 40) : "GENERAL",
      title: typeof task.title === "string" ? task.title.trim().slice(0, 160) : "",
      detail: typeof task.detail === "string" ? task.detail.trim().slice(0, 300) : "",
      due: typeof task.due === "string" ? task.due.trim().slice(0, 80) : "",
      done: task.done === true,
    }));
    if (tasks.some((task) => !task.title)) return Response.json({ error: "Every checklist task needs a title." }, { status: 400 });
    updates.tasks = tasks;
  }
  if (!Object.keys(updates).length) return Response.json({ error: "No supported fields were supplied." }, { status: 400 });

  updates.updatedAt = FieldValue.serverTimestamp();
  await ref.update(updates);
  return Response.json({ ok: true, updated: Object.keys(updates).filter((field) => field !== "updatedAt") });
}
