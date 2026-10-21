import { randomBytes } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, verifyBearerToken } from "@/lib/firebase/admin";

export const runtime = "nodejs";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function authorize(request: Request, slug: string) {
  const identity = await verifyBearerToken(request);
  if (!identity) return { error: "Sign in to manage invitations.", status: 401 as const };
  const db = getAdminDb();
  if (!db) return { error: "Firebase Admin is not configured on the server.", status: 503 as const };
  const weddingRef = db.collection("weddings").doc(slug);
  const weddingSnap = await weddingRef.get();
  if (!weddingSnap.exists) return { error: "Wedding not found.", status: 404 as const };
  const wedding = weddingSnap.data() ?? {};
  if (wedding.ownerUid !== identity.uid && wedding.plannerUid !== identity.uid) {
    return { error: "You don’t have permission to manage invitations for this wedding.", status: 403 as const };
  }
  return { db, weddingRef };
}

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const access = await authorize(request, slug);
  if ("error" in access) return Response.json({ error: access.error }, { status: access.status });

  try {
    const invitationSnap = await access.db.collection("inviteCodes").where("weddingSlug", "==", slug).get();
    const invitations = await Promise.all(invitationSnap.docs.map(async (doc) => {
      const data = doc.data();
      const guestId = typeof data.guestId === "string" ? data.guestId : doc.id;
      const guestSnap = await access.db.collection("weddings").doc(slug).collection("guests").doc(guestId).get();
      const guest = guestSnap.data() ?? {};
      const responded = guestSnap.exists && guest.respondedAt != null;
      return {
        code: doc.id,
        guestName: typeof data.guestName === "string" ? data.guestName : "",
        maxGuests: typeof data.maxGuests === "number" ? Math.max(1, Math.min(8, Math.floor(data.maxGuests))) : 1,
        active: data.active !== false,
        responded,
        attending: typeof guest.attending === "boolean" ? guest.attending : null,
        guestCount: typeof guest.guestCount === "number" ? guest.guestCount : 0,
      };
    }));
    invitations.sort((a, b) => a.guestName.localeCompare(b.guestName));
    return Response.json({ invitations });
  } catch (error) {
    console.error("Invitation list read failed", error);
    return Response.json({ error: "Could not load invitation records." }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const access = await authorize(request, slug);
  if ("error" in access) return Response.json({ error: access.error }, { status: access.status });

  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Send valid invitation details." }, { status: 400 }); }
  if (!isRecord(body)) return Response.json({ error: "Invalid invitation details." }, { status: 400 });
  const guestName = typeof body.guestName === "string" ? body.guestName.trim().slice(0, 100) : "";
  const maxGuests = typeof body.maxGuests === "number" ? Math.floor(body.maxGuests) : NaN;
  if (guestName.length < 2) return Response.json({ error: "Enter a guest or household name with at least two characters." }, { status: 400 });
  if (!Number.isInteger(maxGuests) || maxGuests < 1 || maxGuests > 8) return Response.json({ error: "Each invitation may include between 1 and 8 guests." }, { status: 400 });

  const db = access.db;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const code = `EA-${randomBytes(5).toString("hex").toUpperCase()}`;
    try {
      await db.collection("inviteCodes").doc(code).create({
        code,
        weddingSlug: slug,
        guestId: code,
        guestName,
        maxGuests,
        active: true,
        createdAt: FieldValue.serverTimestamp(),
      });
      return Response.json({ ok: true, code, url: `/invite/${code}` }, { status: 201 });
    } catch (error) {
      const errorCode = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
      if (errorCode === "6" || errorCode === "already-exists") continue;
      console.error("Invitation creation failed", error);
      return Response.json({ error: "Could not create this invitation." }, { status: 500 });
    }
  }
  return Response.json({ error: "Could not generate a unique invitation code. Please try again." }, { status: 503 });
}
