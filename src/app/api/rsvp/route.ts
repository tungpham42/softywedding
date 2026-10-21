import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Please send a valid RSVP response." }, { status: 400 });
  }
  if (!isRecord(body)) return Response.json({ error: "Invalid RSVP response." }, { status: 400 });

  const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
  const attending = body.attending;
  const guestCount = typeof body.guestCount === "number" ? Math.floor(body.guestCount) : NaN;
  const mealPreference = typeof body.mealPreference === "string" ? body.mealPreference : "No preference";
  const allowedMeals = new Set(["No preference", "Vegetarian", "Vegan", "Gluten-free", "Other dietary needs"]);

  if (!/^[A-Z0-9-]{4,80}$/.test(code)) return Response.json({ error: "This invitation code is not valid." }, { status: 400 });
  if (name.length < 2 || name.length > 100) return Response.json({ error: "Please enter a name between 2 and 100 characters." }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (typeof attending !== "boolean") return Response.json({ error: "Please choose whether you can attend." }, { status: 400 });
  if (!allowedMeals.has(mealPreference)) return Response.json({ error: "Please choose a valid meal preference." }, { status: 400 });
  if (attending && (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 8)) return Response.json({ error: "Guest count must be between 1 and 8." }, { status: 400 });
  if (!attending && guestCount !== 0) return Response.json({ error: "A declined invitation must have zero attendees." }, { status: 400 });

  const db = getAdminDb();
  if (!db) return Response.json({ error: "RSVP saving is not configured yet. Please contact the couple directly." }, { status: 503 });

  try {
    const invitationSnap = await db.collection("inviteCodes").doc(code).get();
    if (!invitationSnap.exists) return Response.json({ error: "We couldn’t find that invitation code. Please check the code and try again." }, { status: 404 });

    const invitation = invitationSnap.data() ?? {};
    if (invitation.active === false) return Response.json({ error: "This invitation is no longer active. Please contact the hosts." }, { status: 410 });
    const weddingSlug = typeof invitation.weddingSlug === "string" ? invitation.weddingSlug : "";
    if (!/^[a-z0-9-]{1,70}$/.test(weddingSlug)) return Response.json({ error: "This invitation is not connected to a wedding." }, { status: 409 });
    const weddingSnap = await db.collection("weddings").doc(weddingSlug).get();
    if (!weddingSnap.exists) return Response.json({ error: "The wedding associated with this invitation could not be found." }, { status: 404 });
    const maxGuests = typeof invitation.maxGuests === "number" ? Math.max(1, Math.min(8, Math.floor(invitation.maxGuests))) : 1;
    if (attending && guestCount > maxGuests) return Response.json({ error: `This invitation includes up to ${maxGuests} ${maxGuests === 1 ? "guest" : "guests"}.` }, { status: 400 });

    const rawGuestId = typeof invitation.guestId === "string" ? invitation.guestId : code;
    const guestId = rawGuestId.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 100) || code;
    const guestRef = db.collection("weddings").doc(weddingSlug).collection("guests").doc(guestId);
    await guestRef.set({
      name,
      email: email || null,
      attending,
      guestCount,
      mealPreference: attending ? mealPreference : null,
      invitationCode: code,
      respondedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("RSVP save failed", error);
    return Response.json({ error: "We couldn’t save your response right now. Please try again shortly." }, { status: 500 });
  }
}
