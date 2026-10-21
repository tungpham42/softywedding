"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { User } from "firebase/auth";
import { Icon } from "@/components/ui/icon";

type Invitation = {
  code: string;
  guestName: string;
  maxGuests: number;
  active: boolean;
  responded: boolean;
  attending: boolean | null;
  guestCount: number;
};

export function WeddingInvitations({ user, slug, onUpdated }: { user: User; slug: string; onUpdated?: () => void }) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [guestName, setGuestName] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/weddings/${encodeURIComponent(slug)}/invitations`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const payload = await response.json() as { error?: string; invitations?: Invitation[] };
      if (!response.ok) throw new Error(payload.error || "Could not load invitation records.");
      setInvitations(payload.invitations ?? []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load invitation records.");
    } finally { setLoading(false); }
  }, [slug, user]);

  useEffect(() => { void load(); }, [load]);

  async function createInvitation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/weddings/${encodeURIComponent(slug)}/invitations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ guestName: guestName.trim(), maxGuests }),
      });
      const payload = await response.json() as { error?: string; code?: string };
      if (!response.ok || !payload.code) throw new Error(payload.error || "Could not create invitation.");
      setGuestName("");
      setMaxGuests(1);
      await load();
      onUpdated?.();
      setNotice(`Invitation created. Code: ${payload.code}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create invitation.");
    } finally { setBusy(false); }
  }

  async function copyInvite(code: string) {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/invite/${code}`);
      setNotice(`Invitation link for ${code} copied.`);
    } catch {
      setError("Could not copy the invitation link in this browser.");
    }
  }

  return <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
    <div className="flex items-center justify-between gap-4"><div><p className="eyebrow text-muted">Guest list</p><h2 className="font-display mt-1 text-[24px]">Invitations & RSVPs</h2><p className="mt-1 text-xs leading-5 text-muted">Create a unique invitation code for each guest or household. Responses are saved to Firestore.</p></div><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-soft text-pine"><Icon name="users" size={17}/></span></div>
    <form onSubmit={createInvitation} className="mt-5 grid gap-3 sm:grid-cols-[1fr_130px_auto]"><div><label htmlFor="invite-guest-name" className="mb-1 block text-[11px] font-semibold">Guest or household name</label><input id="invite-guest-name" required minLength={2} maxLength={100} value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Name on invitation" className="h-10 w-full rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-pine"/></div><div><label htmlFor="invite-max-guests" className="mb-1 block text-[11px] font-semibold">Guest allowance</label><select id="invite-max-guests" value={maxGuests} onChange={(event) => setMaxGuests(Number(event.target.value))} className="h-10 w-full rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-pine">{Array.from({ length: 8 }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count} {count === 1 ? "person" : "people"}</option>)}</select></div><div className="self-end"><button disabled={busy} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-pine px-4 text-xs font-semibold text-white disabled:opacity-50"><Icon name="plus" size={14}/>{busy ? "Creating…" : "Create invite"}</button></div></form>
    {error && <p role="alert" className="mt-4 rounded-xl bg-[#fbebe7] px-3 py-2 text-xs leading-5 text-[#8c4937]">{error}</p>}
    {notice && <p role="status" className="mt-4 rounded-xl bg-sage-soft px-3 py-2 text-xs leading-5 text-pine">{notice}</p>}
    {loading ? <p className="mt-5 text-xs text-muted">Loading invitation records…</p> : invitations.length ? <div className="mt-5 divide-y divide-line border-t border-line">{invitations.map((invitation) => <div key={invitation.code} className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"><div className="min-w-0"><p className="text-sm font-semibold">{invitation.guestName}</p><p className="mt-1 text-[11px] text-muted">Code: {invitation.code} · Up to {invitation.maxGuests} {invitation.maxGuests === 1 ? "person" : "people"}</p><p className="mt-1 text-[11px] font-medium text-pine">{!invitation.active ? "Inactive" : !invitation.responded ? "Awaiting response" : invitation.attending ? `Accepted · ${invitation.guestCount} attending` : "Declined"}</p></div><div className="flex shrink-0 items-center gap-3"><a href={`/invite/${invitation.code}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-pine underline underline-offset-4">Open invite</a><button type="button" onClick={() => void copyInvite(invitation.code)} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold hover:border-pine"><Icon name="clipboard" size={13}/>Copy link</button></div></div>)}</div> : <div className="mt-5 rounded-xl bg-[#f4f3eb] px-4 py-5"><p className="text-sm font-semibold">No invitation records yet</p><p className="mt-1 text-xs leading-5 text-muted">Create your first invitation above. Its code and RSVP page will be stored in Firestore.</p></div>}
  </section>;
}
