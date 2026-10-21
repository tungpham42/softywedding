"use client";

import { useState, type FormEvent } from "react";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { Icon } from "@/components/ui/icon";

type Props = { code: string; guestName: string; maxGuests: number; coupleNames: string };

export function RsvpForm({ code, guestName, maxGuests, coupleNames }: Props) {
  const [name, setName] = useState(guestName);
  const [email, setEmail] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guestCount, setGuestCount] = useState(1);
  const [mealPreference, setMealPreference] = useState("No preference");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(false);
    if (name.trim().length < 2) {
      setError("Please enter the name on your invitation.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please check the email address, or leave it blank.");
      return;
    }

    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      const user = auth?.currentUser;
      const token = user ? await user.getIdToken() : null;
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ code, name: name.trim(), email: email.trim(), attending: attending === "yes", guestCount: attending === "yes" ? guestCount : 0, mealPreference }),
      });
      const payload = await response.json() as { error?: string; ok?: boolean };
      if (!response.ok) throw new Error(payload.error || "We couldn’t save your RSVP. Please try again.");
      setResult(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn’t save your RSVP. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-pine"><Icon name="check-circle" size={24}/></span>
        <h2 className="font-display mt-5 text-[30px]">{attending === "yes" ? "We’ll save you a seat." : "Thank you for letting us know."}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">Your RSVP for {coupleNames} has been saved. We can’t wait to celebrate together.</p>
        <button type="button" onClick={() => setResult(false)} className="mt-5 text-xs font-semibold text-pine underline underline-offset-4">Edit my response</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-paper p-5 sm:p-7">
      <p className="eyebrow text-terra">Kindly reply</p>
      <h2 className="font-display mt-2 text-[29px]">Will you join us?</h2>
      <p className="mt-2 text-xs leading-5 text-muted">Please reply for everyone included in your invitation.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><label htmlFor="rsvp-name" className="mb-1.5 block text-xs font-semibold">Name on invitation</label><input id="rsvp-name" required minLength={2} maxLength={100} value={name} onChange={event => setName(event.target.value)} className="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none focus:border-pine focus:ring-2 focus:ring-sage"/></div>
        <div className="sm:col-span-2"><label htmlFor="rsvp-email" className="mb-1.5 block text-xs font-semibold">Email <span className="font-normal text-muted">(optional)</span></label><input id="rsvp-email" type="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" className="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none focus:border-pine focus:ring-2 focus:ring-sage"/></div>
      </div>

      <fieldset className="mt-5"><legend className="mb-2 text-xs font-semibold">Your reply</legend><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setAttending("yes")} className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${attending === "yes" ? "border-pine bg-sage-soft text-pine" : "border-line bg-white text-muted hover:border-pine"}`}>Joyfully accepts</button><button type="button" onClick={() => setAttending("no")} className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${attending === "no" ? "border-pine bg-sage-soft text-pine" : "border-line bg-white text-muted hover:border-pine"}`}>Regretfully declines</button></div></fieldset>

      {attending === "yes" && <div className="mt-4 grid gap-4 sm:grid-cols-2"><div><label htmlFor="rsvp-guests" className="mb-1.5 block text-xs font-semibold">Number attending</label><select id="rsvp-guests" value={guestCount} onChange={event => setGuestCount(Number(event.target.value))} className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-pine">{Array.from({ length: Math.max(1, Math.min(maxGuests, 8)) }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}</select><p className="mt-1 text-[10px] text-muted">This invitation includes up to {maxGuests} {maxGuests === 1 ? "person" : "people"}.</p></div><div><label htmlFor="rsvp-meal" className="mb-1.5 block text-xs font-semibold">Meal preference</label><select id="rsvp-meal" value={mealPreference} onChange={event => setMealPreference(event.target.value)} className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-pine"><option>No preference</option><option>Vegetarian</option><option>Vegan</option><option>Gluten-free</option><option>Other dietary needs</option></select></div></div>}

      {error && <p role="alert" className="mt-4 rounded-xl bg-[#fbebe7] px-3 py-2.5 text-xs leading-5 text-[#8c4937]">{error}</p>}
      <button type="submit" disabled={busy} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-pine px-5 text-sm font-semibold text-white transition-colors hover:bg-pine-dark disabled:cursor-wait disabled:opacity-60">{busy ? "Sending your reply…" : "Send my RSVP"}{!busy && <Icon name="arrow-right" size={16}/>}</button>
      <p className="mt-3 text-center text-[10px] leading-5 text-muted">Your details are shared only with the hosts for event planning.</p>
    </form>
  );
}
