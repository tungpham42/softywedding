import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function hasAdminCredentials() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY,
  );
}

export function getAdminApp(): App | null {
  if (!hasAdminCredentials()) return null;
  const appName = "softy-admin";
  const existing = getApps().find((app) => app.name === appName);
  if (existing) return existing;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) return null;

  return initializeApp(
    { credential: cert({ projectId, clientEmail, privateKey }) },
    appName,
  );
}

export function getAdminDb(): Firestore | null {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}

export function getAdminAuth(): Auth | null {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}

export async function verifyBearerToken(
  request: Request,
): Promise<{ uid: string } | null> {
  const auth = getAdminAuth();
  const header = request.headers.get("authorization");
  if (!auth || !header?.startsWith("Bearer ")) return null;

  try {
    const decoded = await auth.verifyIdToken(header.slice("Bearer ".length));
    return { uid: decoded.uid };
  } catch {
    return null;
  }
}
