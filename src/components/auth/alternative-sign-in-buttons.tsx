"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FacebookAuthProvider,
  signInAnonymously,
  signInWithPopup,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

type Method = "facebook" | "anonymous";

function getAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

  switch (code) {
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled in Firebase Authentication.";
    case "auth/popup-blocked":
      return "Your browser blocked the Facebook sign-in popup. Allow popups and try again.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled. Please try again when you're ready.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using another sign-in method. Sign in with that method first.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase Authentication.";
    case "auth/network-request-failed":
      return "A network error occurred. Check your connection and try again.";
    default:
      return "We couldn't sign you in right now. Please try again.";
  }
}

export function AlternativeSignInButtons() {
  const router = useRouter();
  const [loading, setLoading] = useState<Method | null>(null);
  const [error, setError] = useState("");

  async function handleSignIn(method: Method) {
    if (loading) return;

    setError("");
    setLoading(method);

    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        throw new Error(
          "Firebase is not configured. Check your NEXT_PUBLIC_FIREBASE_* environment variables.",
        );
      }

      if (method === "facebook") {
        const provider = new FacebookAuthProvider();
        provider.addScope("email");
        await signInWithPopup(auth, provider);
      } else {
        await signInAnonymously(auth);
      }

      router.push("/couple");
    } catch (cause) {
      if (
        cause instanceof Error &&
        cause.message.startsWith("Firebase is not configured")
      ) {
        setError(cause.message);
      } else {
        setError(getAuthErrorMessage(cause));
      }
    } finally {
      setLoading(null);
    }
  }

  const buttonClass =
    "flex w-full items-center justify-center gap-3 rounded-full border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:bg-sage-soft disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="mt-3 space-y-3">
      <button
        type="button"
        onClick={() => void handleSignIn("facebook")}
        disabled={loading !== null}
        className={buttonClass}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
          <path
            fill="#1877F2"
            d="M24 12a12 12 0 1 0-13.875 11.85v-8.38H7.078V12h3.047V9.356c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.926-1.956 1.876V12h3.328l-.532 3.47h-2.796v8.38A12.002 12.002 0 0 0 24 12Z"
          />
        </svg>
        {loading === "facebook"
          ? "Connecting to Facebook…"
          : "Continue with Facebook"}
      </button>

      <button
        type="button"
        onClick={() => void handleSignIn("anonymous")}
        disabled={loading !== null}
        className={buttonClass}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-5 w-5"
        >
          <circle cx="12" cy="8" r="4" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 20a7.5 7.5 0 0 1 15 0"
          />
        </svg>
        {loading === "anonymous"
          ? "Creating a guest session…"
          : "Continue as a guest"}
      </button>

      {error ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-3 py-2 text-xs leading-5 text-red-700"
        >
          {error}
        </p>
      ) : null}

      <p className="px-1 text-[11px] leading-5 text-muted">
        Guest access uses a temporary anonymous account. Link it to a permanent
        sign-in method before relying on it to keep important wedding details.
      </p>
    </div>
  );
}
