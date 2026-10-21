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

type InvitationPayload = {
  error?: string;
  code?: string;
  invitations?: Invitation[];
};

export function WeddingInvitations({
  user,
  slug,
  onUpdated,
}: {
  user: User;
  slug: string;
  onUpdated?: () => void;
}) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [guestName, setGuestName] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingMaxGuests, setEditingMaxGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [busyCode, setBusyCode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const endpoint = `/api/weddings/${encodeURIComponent(slug)}/invitations`;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = await user.getIdToken();
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const payload = (await response.json()) as InvitationPayload;
      if (!response.ok)
        throw new Error(payload.error || "Could not load invitation records.");
      setInvitations(payload.invitations ?? []);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load invitation records.",
      );
    } finally {
      setLoading(false);
    }
  }, [endpoint, user]);

  useEffect(() => {
    void load();
  }, [load]);

  async function createInvitation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const token = await user.getIdToken();
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ guestName: guestName.trim(), maxGuests }),
      });
      const payload = (await response.json()) as InvitationPayload;
      if (!response.ok || !payload.code) {
        throw new Error(payload.error || "Could not create invitation.");
      }
      setGuestName("");
      setMaxGuests(1);
      await load();
      onUpdated?.();
      setNotice(`Invitation created. Code: ${payload.code}`);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not create invitation.",
      );
    } finally {
      setBusy(false);
    }
  }

  function startEditing(invitation: Invitation) {
    setEditingCode(invitation.code);
    setEditingName(invitation.guestName);
    setEditingMaxGuests(invitation.maxGuests);
    setError("");
    setNotice("");
  }

  async function saveInvitation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingCode) return;
    setBusyCode(editingCode);
    setError("");
    setNotice("");
    try {
      const token = await user.getIdToken();
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: editingCode,
          guestName: editingName.trim(),
          maxGuests: editingMaxGuests,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(payload.error || "Could not update invitation.");
      const code = editingCode;
      setEditingCode(null);
      await load();
      onUpdated?.();
      setNotice(`Invitation ${code} updated.`);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not update invitation.",
      );
    } finally {
      setBusyCode(null);
    }
  }

  async function setInvitationActive(invitation: Invitation) {
    setBusyCode(invitation.code);
    setError("");
    setNotice("");
    try {
      const token = await user.getIdToken();
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: invitation.code,
          active: !invitation.active,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(payload.error || "Could not change invitation status.");
      await load();
      onUpdated?.();
      setNotice(
        invitation.active ? "Invitation deactivated." : "Invitation activated.",
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not change invitation status.",
      );
    } finally {
      setBusyCode(null);
    }
  }

  async function deleteInvitation(invitation: Invitation) {
    const accepted = window.confirm(
      `Delete the invitation for ${invitation.guestName}? This also removes its saved RSVP record.`,
    );
    if (!accepted) return;
    setBusyCode(invitation.code);
    setError("");
    setNotice("");
    try {
      const token = await user.getIdToken();
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: invitation.code }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(payload.error || "Could not delete invitation.");
      if (editingCode === invitation.code) setEditingCode(null);
      await load();
      onUpdated?.();
      setNotice(`Invitation for ${invitation.guestName} deleted.`);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not delete invitation.",
      );
    } finally {
      setBusyCode(null);
    }
  }

  async function copyInvite(code: string) {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/invite/${code}`,
      );
      setNotice(`Invitation link for ${code} copied.`);
      setError("");
    } catch {
      setError("Could not copy the invitation link in this browser.");
    }
  }

  return (
    <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow text-muted">Guest list</p>
          <h2 className="font-display mt-1 text-[24px]">
            Invitations &amp; RSVPs
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted">
            Create a unique invitation code for each guest or household, update
            guest allowances, pause access, or delete a record. RSVP responses
            remain linked to each invitation.
          </p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-soft text-pine">
          <Icon name="users" size={17} />
        </span>
      </div>

      <form
        onSubmit={createInvitation}
        className="mt-5 grid gap-3 sm:grid-cols-[1fr_130px_auto]"
      >
        <div>
          <label
            htmlFor="invite-guest-name"
            className="mb-1 block text-[11px] font-semibold"
          >
            Guest or household name
          </label>
          <input
            id="invite-guest-name"
            required
            minLength={2}
            maxLength={100}
            value={guestName}
            onChange={(event) => setGuestName(event.target.value)}
            placeholder="Name on invitation"
            className="h-10 w-full rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-pine"
          />
        </div>
        <div>
          <label
            htmlFor="invite-max-guests"
            className="mb-1 block text-[11px] font-semibold"
          >
            Guest allowance
          </label>
          <select
            id="invite-max-guests"
            value={maxGuests}
            onChange={(event) => setMaxGuests(Number(event.target.value))}
            className="h-10 w-full rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-pine"
          >
            {Array.from({ length: 8 }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "person" : "people"}
              </option>
            ))}
          </select>
        </div>
        <div className="self-end">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-pine px-4 text-xs font-semibold text-white disabled:opacity-50"
          >
            <Icon name="plus" size={14} />
            {busy ? "Creating…" : "Create invite"}
          </button>
        </div>
      </form>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-[#fbebe7] px-3 py-2 text-xs leading-5 text-[#8c4937]"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="mt-4 rounded-xl bg-sage-soft px-3 py-2 text-xs leading-5 text-pine"
        >
          {notice}
        </p>
      )}

      {loading ? (
        <p className="mt-5 text-xs text-muted">Loading invitation records…</p>
      ) : invitations.length ? (
        <div className="mt-5 divide-y divide-line border-t border-line">
          {invitations.map((invitation) => (
            <div key={invitation.code} className="py-4">
              {editingCode === invitation.code ? (
                <form
                  onSubmit={saveInvitation}
                  className="grid gap-3 rounded-xl bg-[#f4f3eb] p-3 sm:grid-cols-[1fr_150px_auto] sm:items-end"
                >
                  <div>
                    <label
                      htmlFor={`edit-name-${invitation.code}`}
                      className="mb-1 block text-[11px] font-semibold"
                    >
                      Guest or household name
                    </label>
                    <input
                      id={`edit-name-${invitation.code}`}
                      required
                      minLength={2}
                      maxLength={100}
                      value={editingName}
                      onChange={(event) => setEditingName(event.target.value)}
                      className="h-10 w-full rounded-lg border border-line bg-white px-3 text-xs outline-none focus:border-pine"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`edit-count-${invitation.code}`}
                      className="mb-1 block text-[11px] font-semibold"
                    >
                      Guest allowance
                    </label>
                    <select
                      id={`edit-count-${invitation.code}`}
                      value={editingMaxGuests}
                      onChange={(event) =>
                        setEditingMaxGuests(Number(event.target.value))
                      }
                      className="h-10 w-full rounded-lg border border-line bg-white px-3 text-xs outline-none focus:border-pine"
                    >
                      {Array.from({ length: 8 }, (_, index) => index + 1).map(
                        (count) => (
                          <option key={count} value={count}>
                            {count} {count === 1 ? "person" : "people"}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={
                        busyCode === invitation.code || !editingName.trim()
                      }
                      className="inline-flex h-10 items-center gap-1 rounded-full bg-pine px-3 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      <Icon name="check" size={13} />
                      {busyCode === invitation.code ? "Saving…" : "Save"}
                    </button>
                    <button
                      type="button"
                      disabled={busyCode === invitation.code}
                      onClick={() => setEditingCode(null)}
                      className="inline-flex h-10 items-center rounded-full border border-line bg-white px-3 text-xs font-semibold disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">
                        {invitation.guestName}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${invitation.active ? "bg-sage-soft text-pine" : "bg-[#f2e5dd] text-terra"}`}
                      >
                        {invitation.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="mt-1 break-words text-[11px] text-muted">
                      Code: {invitation.code} · Up to {invitation.maxGuests}{" "}
                      {invitation.maxGuests === 1 ? "person" : "people"}
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-pine">
                      {!invitation.active
                        ? "Invite link disabled"
                        : !invitation.responded
                          ? "Awaiting response"
                          : invitation.attending
                            ? `Accepted · ${invitation.guestCount} attending`
                            : "Declined"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <a
                      href={`/invite/${invitation.code}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold hover:border-pine"
                    >
                      Open <Icon name="arrow-up-right" size={12} />
                    </a>
                    <button
                      type="button"
                      onClick={() => void copyInvite(invitation.code)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold hover:border-pine"
                    >
                      <Icon name="clipboard" size={13} />
                      Copy link
                    </button>
                    <button
                      type="button"
                      disabled={busyCode === invitation.code}
                      onClick={() => startEditing(invitation)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold hover:border-pine disabled:opacity-50"
                    >
                      <Icon name="settings" size={13} />
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={busyCode === invitation.code}
                      onClick={() => void setInvitationActive(invitation)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold hover:border-pine disabled:opacity-50"
                    >
                      <Icon
                        name={invitation.active ? "eye-off" : "check-circle"}
                        size={13}
                      />
                      {invitation.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      type="button"
                      disabled={busyCode === invitation.code}
                      onClick={() => void deleteInvitation(invitation)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#e6c4b9] px-3 text-xs font-semibold text-terra hover:bg-[#fbebe7] disabled:opacity-50"
                    >
                      <Icon name="close" size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl bg-[#f4f3eb] px-4 py-5">
          <p className="text-sm font-semibold">No invitation records yet</p>
          <p className="mt-1 text-xs leading-5 text-muted">
            Create your first invitation above. Its unique code and RSVP page
            will be stored in Firestore.
          </p>
        </div>
      )}
    </section>
  );
}
