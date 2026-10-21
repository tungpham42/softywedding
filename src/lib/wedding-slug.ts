import { FieldValue, type Firestore } from "firebase-admin/firestore";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Public sites live at /{slug}; keep in sync with RESERVED_SLUGS in couple-workspace.tsx.
const RESERVED_SLUGS = new Set([
  "api", "couple", "guest", "invite", "login", "planner", "w",
  "admin", "dashboard", "settings",
]);

export class SlugError extends Error {
  constructor(message: string, public status: 400 | 409) {
    super(message);
  }
}

/**
 * The slug is the Firestore document ID, so renaming copies the wedding and
 * its subcollections to the new ID, repoints inviteCodes.weddingSlug, and
 * deletes the old data last so a mid-way failure leaves the old wedding intact.
 * The caller must already have verified ownership and that `oldSlug` exists.
 */
export async function renameWeddingSlug(db: Firestore, oldSlug: string, newSlug: string): Promise<string> {
  if (newSlug.length < 3 || newSlug.length > 60 || !SLUG_PATTERN.test(newSlug) || RESERVED_SLUGS.has(newSlug)) {
    throw new SlugError("That website address is not allowed.", 400);
  }
  if (newSlug === oldSlug) return oldSlug;

  const oldRef = db.collection("weddings").doc(oldSlug);
  const newRef = db.collection("weddings").doc(newSlug);
  const oldSnap = await oldRef.get();

  // create() fails if the target exists, which also settles two people racing for one slug.
  try {
    await newRef.create({ ...oldSnap.data(), slug: newSlug, updatedAt: FieldValue.serverTimestamp() });
  } catch {
    throw new SlugError("That address is already taken.", 409);
  }

  const writer = db.bulkWriter();
  for (const collection of await oldRef.listCollections()) {
    const docs = await collection.get();
    for (const doc of docs.docs) void writer.set(newRef.collection(collection.id).doc(doc.id), doc.data());
  }
  const invites = await db.collection("inviteCodes").where("weddingSlug", "==", oldSlug).get();
  for (const invite of invites.docs) void writer.update(invite.ref, { weddingSlug: newSlug });
  await writer.close();

  await db.recursiveDelete(oldRef);
  return newSlug;
}
