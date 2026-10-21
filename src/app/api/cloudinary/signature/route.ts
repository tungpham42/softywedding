import { v2 as cloudinary } from "cloudinary";
import { verifyBearerToken } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const identity = await verifyBearerToken(request);
  if (!identity)
    return Response.json(
      { error: "Sign in before uploading wedding media." },
      { status: 401 },
    );

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json(
      { error: "Cloudinary is not configured on the server." },
      { status: 503 },
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "softy/weddings";
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    apiSecret,
  );

  return Response.json({ cloudName, apiKey, timestamp, folder, signature });
}
