"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";

export function GuestCodeLookup() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setError("Enter the invitation code from your message.");
      return;
    }
    if (!/^[A-Z0-9-]{4,80}$/.test(normalized)) {
      setError("That code format doesn’t look quite right. Check the invitation and try again.");
      return;
    }
    router.push(`/invite/${encodeURIComponent(normalized)}`);
  }

  return (
    <form onSubmit={submit} className="mt-6">
      <label htmlFor="invite-code" className="mb-2 block text-xs font-semibold text-ink">Your invitation code</label>
      <div className="flex flex-col gap-2 sm:flex-row"><input id="invite-code" autoComplete="off" value={code} onChange={(event) => { setCode(event.target.value); setError(""); }} placeholder="Enter your invitation code" className="h-12 min-w-0 flex-1 rounded-full border border-line bg-white px-5 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-sage"/><button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-pine px-5 text-sm font-semibold text-white transition-colors hover:bg-pine-dark">Find my invite <Icon name="arrow-right" size={16}/></button></div>
      {error && <p role="alert" className="mt-2 text-xs text-terra">{error}</p>}

    </form>
  );
}
