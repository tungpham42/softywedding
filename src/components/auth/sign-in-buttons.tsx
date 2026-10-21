"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

type Method = "google" | "facebook" | "anonymous";

class ConfigError extends Error {}

function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ConfigError) return error.message;

  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

  switch (code) {
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled in Firebase Authentication.";
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in popup. Allow popups and try again.";
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

const buttonClass =
  "flex h-12 w-full items-center justify-center gap-3 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink transition-colors hover:bg-sage-soft disabled:cursor-not-allowed disabled:opacity-60";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.15A11 11 0 0 0 1 12c0 1.78.42 3.46 1.15 4.95l3.69-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.36c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.85 6.05l3.69 2.84C6.71 7.29 9.14 5.36 12 5.36Z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#1877F2"
        d="M24 12a12 12 0 1 0-13.875 11.85v-8.38H7.078V12h3.047V9.356c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.926-1.956 1.876V12h3.328l-.532 3.47h-2.796v8.38A12.002 12.002 0 0 0 24 12Z"
      />
    </svg>
  );
}

function GuestIcon() {
  return (
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
  );
}

const METHODS: {
  id: Method;
  icon: ReactNode;
  label: string;
  busyLabel: string;
}[] = [
  {
    id: "google",
    icon: <GoogleIcon />,
    label: "Continue with Google",
    busyLabel: "Connecting to Google…",
  },
  {
    id: "facebook",
    icon: <FacebookIcon />,
    label: "Continue with Facebook",
    busyLabel: "Connecting to Facebook…",
  },
  {
    id: "anonymous",
    icon: <GuestIcon />,
    label: "Continue as a guest",
    busyLabel: "Creating a guest session…",
  },
];

export function SignInButtons() {
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
        throw new ConfigError(
          "Firebase client settings are missing. Add the NEXT_PUBLIC_FIREBASE_* values to .env.local first.",
        );
      }

      if (method === "google") {
        await signInWithPopup(auth, new GoogleAuthProvider());
      } else if (method === "facebook") {
        const provider = new FacebookAuthProvider();
        provider.addScope("email");
        await signInWithPopup(auth, provider);
      } else {
        await signInAnonymously(auth);
      }

      router.push("/couple");
      router.refresh();
    } catch (cause) {
      setError(getAuthErrorMessage(cause));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      {METHODS.map(({ id, icon, label, busyLabel }) => (
        <button
          key={id}
          type="button"
          onClick={() => void handleSignIn(id)}
          disabled={loading !== null}
          className={buttonClass}
        >
          {icon}
          {loading === id ? busyLabel : label}
        </button>
      ))}

      {error ? (
        <p
          role="alert"
          className="rounded-xl bg-[#fbebe7] px-3 py-2 text-xs leading-5 text-[#8c4937]"
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
