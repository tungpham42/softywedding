import {
  FieldValue,
  type DocumentSnapshot,
  type Firestore,
} from "firebase-admin/firestore";
import { getAdminDb, verifyBearerToken } from "@/lib/firebase/admin";
import {
  readWeddingSchedule,
  readWeddingStoryPhotos,
  readWeddingTasks,
} from "@/lib/wedding";
import { safeSlug } from "@/lib/utils";

export const runtime = "nodejs";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function weddingSummary(
  db: Firestore,
  id: string,
  data: Record<string, unknown>,
) {
  const guestsRef = db.collection("weddings").doc(id).collection("guests");
  const [guests, invitations] = await Promise.all([
    guestsRef.get(),
    db.collection("inviteCodes").where("weddingSlug", "==", id).get(),
  ]);
  const invitedCount = invitations.size;
  const respondedDocs = guests.docs.filter(
    (guest) => guest.data().respondedAt != null,
  );
  const respondedCount = respondedDocs.length;
  const attendingCount = respondedDocs.reduce((sum, guest) => {
    const guestData = guest.data();
    return (
      sum +
      (guestData.attending === true
        ? typeof guestData.guestCount === "number"
          ? guestData.guestCount
          : 1
        : 0)
    );
  }, 0);
  return {
    slug: id,
    partnerOne: typeof data.partnerOne === "string" ? data.partnerOne : "",
    partnerTwo: typeof data.partnerTwo === "string" ? data.partnerTwo : "",
    date: typeof data.date === "string" ? data.date : "",
    venue: typeof data.venue === "string" ? data.venue : "",
    location: typeof data.location === "string" ? data.location : "",
    headline: typeof data.headline === "string" ? data.headline : "",
    story: typeof data.story === "string" ? data.story : "",
    ceremonyTime:
      typeof data.ceremonyTime === "string" ? data.ceremonyTime : "",
    receptionTime:
      typeof data.receptionTime === "string" ? data.receptionTime : "",
    heroImage: typeof data.heroImage === "string" ? data.heroImage : "",
    storyPhotos: readWeddingStoryPhotos(data.storyPhotos),
    schedule: readWeddingSchedule(data.schedule),
    tasks: readWeddingTasks(data.tasks),
    published: data.published === true,
    ownerUid: typeof data.ownerUid === "string" ? data.ownerUid : "",
    plannerUid:
      typeof data.plannerUid === "string" ? data.plannerUid : undefined,
    guestCount: guests.size,
    invitedCount,
    respondedCount,
    attendingCount,
  };
}

export async function GET(request: Request) {
  const identity = await verifyBearerToken(request);
  if (!identity)
    return Response.json(
      { error: "Sign in to view your wedding data." },
      { status: 401 },
    );
  const db = getAdminDb();
  if (!db)
    return Response.json(
      { error: "Firebase Admin is not configured on the server." },
      { status: 503 },
    );

  try {
    const [owned, assigned] = await Promise.all([
      db.collection("weddings").where("ownerUid", "==", identity.uid).get(),
      db.collection("weddings").where("plannerUid", "==", identity.uid).get(),
    ]);
    const docs = new Map<string, DocumentSnapshot>();
    [...owned.docs, ...assigned.docs].forEach((doc) => docs.set(doc.id, doc));
    const weddings = await Promise.all(
      [...docs.values()].map((doc) =>
        weddingSummary(db, doc.id, doc.data() ?? {}),
      ),
    );
    weddings.sort((a, b) => a.date.localeCompare(b.date));
    return Response.json({ weddings });
  } catch (error) {
    console.error("Wedding list read failed", error);
    return Response.json(
      { error: "We couldn’t load your wedding data. Please try again." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const identity = await verifyBearerToken(request);
  if (!identity) {
    return Response.json(
      {
        error:
          "Sign in with a configured Firebase account before creating a wedding.",
      },
      { status: 401 },
    );
  }
  const db = getAdminDb();
  if (!db)
    return Response.json(
      { error: "Firebase Admin is not configured on the server." },
      { status: 503 },
    );

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Please send valid wedding details." },
      { status: 400 },
    );
  }
  if (!isRecord(body))
    return Response.json(
      { error: "Invalid wedding details." },
      { status: 400 },
    );

  const partnerOne =
    typeof body.partnerOne === "string"
      ? body.partnerOne.trim().slice(0, 80)
      : "";
  const partnerTwo =
    typeof body.partnerTwo === "string"
      ? body.partnerTwo.trim().slice(0, 80)
      : "";
  const date = typeof body.date === "string" ? body.date.trim() : "";
  const venue =
    typeof body.venue === "string" ? body.venue.trim().slice(0, 160) : "";
  const location =
    typeof body.location === "string" ? body.location.trim().slice(0, 200) : "";
  const requestedSlug =
    typeof body.slug === "string" ? safeSlug(body.slug) : "";

  if (!partnerOne || !partnerTwo)
    return Response.json(
      { error: "Please enter both partners’ names." },
      { status: 400 },
    );
  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(`${date}T00:00:00.000Z`)
    : null;
  if (
    !parsedDate ||
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    return Response.json(
      { error: "Please choose a valid wedding date." },
      { status: 400 },
    );
  }
  const slug = (
    requestedSlug || safeSlug(`${partnerOne}-and-${partnerTwo}`)
  ).slice(0, 70);
  if (!slug)
    return Response.json(
      { error: "Could not create a page URL from those names." },
      { status: 400 },
    );

  try {
    await db.collection("weddings").doc(slug).create({
      slug,
      partnerOne,
      partnerTwo,
      date,
      venue,
      location,
      headline: "",
      story: "",
      ceremonyTime: "",
      receptionTime: "",
      heroImage: "",
      storyPhotos: [],
      schedule: [],
      tasks: [],
      published: false,
      ownerUid: identity.uid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return Response.json({ ok: true, slug, url: `/${slug}` }, { status: 201 });
  } catch (error) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String(error.code)
        : "";
    if (code === "6" || code === "already-exists")
      return Response.json(
        {
          error:
            "That wedding URL is already in use. Try adding a city or year to make it unique.",
        },
        { status: 409 },
      );
    console.error("Wedding creation failed", error);
    return Response.json(
      { error: "We couldn’t create the wedding page. Please try again." },
      { status: 500 },
    );
  }
}
