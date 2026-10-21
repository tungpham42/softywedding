"use client";

import Link from "next/link";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { Icon } from "@/components/ui/icon";
import { CloudinaryUpload } from "@/components/dashboard/cloudinary-upload";
import { WeddingInvitations } from "@/components/dashboard/wedding-invitations";
import type {
  Wedding,
  WeddingTask,
  WeddingScheduleItem,
  WeddingStoryPhoto,
} from "@/lib/wedding";
import Image from "next/image";

function formatDate(value: string) {
  if (!value) return "Date not set";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

const SLUG_MIN_LENGTH = 3;
const SLUG_MAX_LENGTH = 60;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Public sites live at /{slug}, so a slug must never shadow a real route.
// Keep this in sync with the server-side check.
const RESERVED_SLUGS = new Set([
  "api",
  "couple",
  "guest",
  "invite",
  "login",
  "planner",
  "w",
  "admin",
  "dashboard",
  "settings",
]);

/** Live-typing normaliser: keeps a trailing hyphen so "anh-nam" can be typed. */
function slugifyInput(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .slice(0, SLUG_MAX_LENGTH);
}

function finalizeSlug(value: string) {
  return slugifyInput(value).replace(/-+$/, "");
}

function getSlugError(slug: string) {
  if (slug.length < SLUG_MIN_LENGTH)
    return `The address must be at least ${SLUG_MIN_LENGTH} characters.`;
  if (!SLUG_PATTERN.test(slug))
    return "Use only lowercase letters, numbers and single hyphens.";
  if (RESERVED_SLUGS.has(slug))
    return "That address is reserved. Please choose another one.";
  return "";
}

function WeddingCreateForm({
  user,
  onCreated,
}: {
  user: User;
  onCreated: (slug: string) => void;
}) {
  const [partnerOne, setPartnerOne] = useState("");
  const [partnerTwo, setPartnerTwo] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/weddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ partnerOne, partnerTwo, date, venue, location }),
      });
      const payload = (await response.json()) as {
        error?: string;
        slug?: string;
      };
      if (!response.ok || !payload.slug)
        throw new Error(payload.error || "Could not create your wedding.");
      onCreated(payload.slug);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not create your wedding.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mt-5 grid gap-4 rounded-2xl border border-line bg-paper p-5 sm:grid-cols-2 sm:p-7"
    >
      <div className="sm:col-span-2">
        <p className="eyebrow text-terra">Start with the essentials</p>
        <h2 className="font-display mt-2 text-3xl">
          Create your wedding workspace
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          These details will be saved to your Firestore account. You can add
          your story, schedule and photos later.
        </p>
      </div>
      <div>
        <label
          htmlFor="partner-one"
          className="mb-1.5 block text-xs font-semibold"
        >
          First partner’s name
        </label>
        <input
          id="partner-one"
          required
          maxLength={80}
          value={partnerOne}
          onChange={(event) => setPartnerOne(event.target.value)}
          className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-pine"
        />
      </div>
      <div>
        <label
          htmlFor="partner-two"
          className="mb-1.5 block text-xs font-semibold"
        >
          Second partner’s name
        </label>
        <input
          id="partner-two"
          required
          maxLength={80}
          value={partnerTwo}
          onChange={(event) => setPartnerTwo(event.target.value)}
          className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-pine"
        />
      </div>
      <div>
        <label
          htmlFor="wedding-date"
          className="mb-1.5 block text-xs font-semibold"
        >
          Wedding date
        </label>
        <input
          id="wedding-date"
          type="date"
          required
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-pine"
        />
      </div>
      <div>
        <label htmlFor="venue" className="mb-1.5 block text-xs font-semibold">
          Venue <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="venue"
          maxLength={160}
          value={venue}
          onChange={(event) => setVenue(event.target.value)}
          className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-pine"
        />
      </div>
      <div className="sm:col-span-2">
        <label
          htmlFor="location"
          className="mb-1.5 block text-xs font-semibold"
        >
          City or address{" "}
          <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="location"
          maxLength={200}
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-pine"
        />
      </div>
      {error && (
        <p
          role="alert"
          className="sm:col-span-2 rounded-xl bg-[#fbebe7] px-3 py-2 text-xs text-[#8c4937]"
        >
          {error}
        </p>
      )}
      <div className="sm:col-span-2">
        <button
          disabled={busy}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-pine px-5 text-sm font-semibold text-white hover:bg-pine-dark disabled:opacity-60"
        >
          {busy ? "Creating…" : "Create wedding workspace"}
          <Icon name="arrow-right" size={15} />
        </button>
      </div>
    </form>
  );
}

export function CoupleWorkspace() {
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [activeSlug, setActiveSlug] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [taskBusy, setTaskBusy] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [notice, setNotice] = useState("");
  const [headline, setHeadline] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [detailsPartnerOne, setDetailsPartnerOne] = useState("");
  const [detailsPartnerTwo, setDetailsPartnerTwo] = useState("");
  const [story, setStory] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [ceremonyTime, setCeremonyTime] = useState("");
  const [receptionTime, setReceptionTime] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleDescription, setScheduleDescription] = useState("");
  const [scheduleBusy, setScheduleBusy] = useState(false);
  const [storyPhotoDrafts, setStoryPhotoDrafts] = useState<
    Record<string, { caption: string; altText: string }>
  >({});
  const [storyPhotoBusy, setStoryPhotoBusy] = useState(false);
  const [slugDraft, setSlugDraft] = useState("");
  const [slugEditing, setSlugEditing] = useState(false);
  const [slugBusy, setSlugBusy] = useState(false);
  // Carries the success message across the render-phase reset below, which
  // would otherwise clear it when the slug (part of the reset key) changes.
  const [pendingNotice, setPendingNotice] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setCurrentTime(Date.now()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const loadWeddings = useCallback(
    async (currentUser: User, selectSlug?: string) => {
      setLoading(true);
      setError("");
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch("/api/weddings", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const payload = (await response.json()) as {
          error?: string;
          weddings?: Wedding[];
        };
        if (!response.ok)
          throw new Error(payload.error || "Could not load your wedding data.");
        const rows = payload.weddings ?? [];
        setWeddings(rows);
        setActiveSlug((current) => {
          if (selectSlug && rows.some((row) => row.slug === selectSlug))
            return selectSlug;
          if (rows.some((row) => row.slug === current)) return current;
          return rows[0]?.slug ?? "";
        });
        if (rows.length === 0) setShowCreate(true);
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not load your wedding data.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      const timer = window.setTimeout(() => {
        setAuthLoading(false);
        setError(
          "Firebase client settings are missing. Configure the NEXT_PUBLIC_FIREBASE_* values to sign in and load wedding records.",
        );
      }, 0);
      return () => window.clearTimeout(timer);
    }
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) void loadWeddings(currentUser);
      else setWeddings([]);
    });
  }, [loadWeddings]);

  const activeWedding = useMemo(
    () => weddings.find((wedding) => wedding.slug === activeSlug) ?? null,
    [weddings, activeSlug],
  );
  const storyPhotoDraftsKey = JSON.stringify([
    activeWedding?.slug,
    activeWedding?.storyPhotos,
  ]);
  const [previousStoryPhotoDraftsKey, setPreviousStoryPhotoDraftsKey] =
    useState(storyPhotoDraftsKey);
  if (storyPhotoDraftsKey !== previousStoryPhotoDraftsKey) {
    setPreviousStoryPhotoDraftsKey(storyPhotoDraftsKey);
    setStoryPhotoDrafts(
      Object.fromEntries(
        (activeWedding?.storyPhotos ?? []).map((photo) => [
          photo.id,
          { caption: photo.caption ?? "", altText: photo.altText ?? "" },
        ]),
      ),
    );
  }
  const weddingDetailsKey = JSON.stringify([
    activeWedding?.slug,
    activeWedding?.partnerOne,
    activeWedding?.partnerTwo,
    activeWedding?.date,
    activeWedding?.headline,
    activeWedding?.story,
    activeWedding?.venue,
    activeWedding?.location,
    activeWedding?.ceremonyTime,
    activeWedding?.receptionTime,
  ]);
  const [previousWeddingDetailsKey, setPreviousWeddingDetailsKey] =
    useState(weddingDetailsKey);
  if (weddingDetailsKey !== previousWeddingDetailsKey) {
    setPreviousWeddingDetailsKey(weddingDetailsKey);
    setDetailsPartnerOne(activeWedding?.partnerOne ?? "");
    setDetailsPartnerTwo(activeWedding?.partnerTwo ?? "");
    setWeddingDate(activeWedding?.date ?? "");
    setHeadline(activeWedding?.headline ?? "");
    setStory(activeWedding?.story ?? "");
    setVenue(activeWedding?.venue ?? "");
    setLocation(activeWedding?.location ?? "");
    setCeremonyTime(activeWedding?.ceremonyTime ?? "");
    setReceptionTime(activeWedding?.receptionTime ?? "");
    setSlugDraft(activeWedding?.slug ?? "");
    setSlugEditing(false);
    setNotice(pendingNotice);
    setPendingNotice("");
  }

  async function updateWedding(changes: Partial<Wedding>) {
    if (!user || !activeWedding)
      throw new Error("Choose a wedding and sign in before saving changes.");
    const token = await user.getIdToken();
    const response = await fetch(
      `/api/weddings/${encodeURIComponent(activeWedding.slug)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(changes),
      },
    );
    const payload = (await response.json()) as { error?: string };
    if (!response.ok)
      throw new Error(payload.error || "Could not save your changes.");
    setWeddings((rows) =>
      rows.map((row) =>
        row.slug === activeWedding.slug ? { ...row, ...changes } : row,
      ),
    );
  }

  async function saveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingDetails(true);
    setNotice("");
    setError("");
    const nextPartnerOne = detailsPartnerOne.trim();
    const nextPartnerTwo = detailsPartnerTwo.trim();
    if (!nextPartnerOne || !nextPartnerTwo) {
      setError("Please enter both partners’ names.");
      setSavingDetails(false);
      return;
    }
    if (!weddingDate) {
      setError("Please choose a wedding date.");
      setSavingDetails(false);
      return;
    }
    try {
      await updateWedding({
        partnerOne: nextPartnerOne,
        partnerTwo: nextPartnerTwo,
        date: weddingDate,
        headline,
        story,
        venue,
        location,
        ceremonyTime,
        receptionTime,
      });
      setNotice("Wedding details saved.");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save your details.",
      );
    } finally {
      setSavingDetails(false);
    }
  }

  async function saveStoryPhoto(photoId: string) {
    if (!activeWedding) return;
    const draft = storyPhotoDrafts[photoId];
    if (!draft) return;
    setStoryPhotoBusy(true);
    setError("");
    setNotice("");
    try {
      const storyPhotos = (activeWedding.storyPhotos ?? []).map((photo) =>
        photo.id === photoId
          ? {
              ...photo,
              caption: draft.caption.trim(),
              altText: draft.altText.trim(),
            }
          : photo,
      );
      await updateWedding({ storyPhotos });
      setNotice("Story photo details saved.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not save the story photo details.",
      );
    } finally {
      setStoryPhotoBusy(false);
    }
  }

  async function removeStoryPhoto(photoId: string) {
    if (!activeWedding) return;
    if (!window.confirm("Remove this photo from your wedding story?")) return;
    setStoryPhotoBusy(true);
    setError("");
    setNotice("");
    try {
      const storyPhotos = (activeWedding.storyPhotos ?? []).filter(
        (photo) => photo.id !== photoId,
      );
      await updateWedding({ storyPhotos });
      setNotice("Photo removed from your wedding story.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not remove the story photo.",
      );
    } finally {
      setStoryPhotoBusy(false);
    }
  }

  function addStoryPhoto(url: string) {
    if (!activeWedding) return;
    const existingPhotos = activeWedding.storyPhotos ?? [];
    if (existingPhotos.length >= 30) {
      setError("You can add up to 30 photos to your wedding story.");
      return;
    }
    const photo: WeddingStoryPhoto = {
      id: crypto.randomUUID(),
      url,
      caption: "",
      altText: `${activeWedding.partnerOne} and ${activeWedding.partnerTwo}`,
    };
    setError("");
    setNotice("");
    void updateWedding({ storyPhotos: [...existingPhotos, photo] })
      .then(() => setNotice("Photo added to your wedding story."))
      .catch((cause) =>
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not save the uploaded story photo.",
        ),
      );
  }

  async function toggleTask(task: WeddingTask) {
    if (!activeWedding) return;
    const tasks = activeWedding.tasks.map((item) =>
      item.id === task.id ? { ...item, done: !item.done } : item,
    );
    setTaskBusy(true);
    setError("");
    try {
      await updateWedding({ tasks });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not save your checklist.",
      );
    } finally {
      setTaskBusy(false);
    }
  }

  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeWedding || !newTaskTitle.trim()) return;
    const task: WeddingTask = {
      id: crypto.randomUUID(),
      category: "GENERAL",
      title: newTaskTitle.trim(),
      detail: "",
      due: "",
      done: false,
    };
    setTaskBusy(true);
    setError("");
    try {
      await updateWedding({ tasks: [...activeWedding.tasks, task] });
      setNewTaskTitle("");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not add the task.",
      );
    } finally {
      setTaskBusy(false);
    }
  }

  async function addScheduleItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeWedding || !scheduleTitle.trim()) return;
    const item: WeddingScheduleItem = {
      time: scheduleTime.trim(),
      title: scheduleTitle.trim(),
      description: scheduleDescription.trim(),
    };
    setScheduleBusy(true);
    setError("");
    try {
      await updateWedding({ schedule: [...activeWedding.schedule, item] });
      setScheduleTime("");
      setScheduleTitle("");
      setScheduleDescription("");
      setNotice("Schedule item saved.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not save the schedule item.",
      );
    } finally {
      setScheduleBusy(false);
    }
  }

  async function removeScheduleItem(index: number) {
    if (!activeWedding) return;
    setScheduleBusy(true);
    setError("");
    try {
      await updateWedding({
        schedule: activeWedding.schedule.filter(
          (_, itemIndex) => itemIndex !== index,
        ),
      });
      setNotice("Schedule item removed.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not remove the schedule item.",
      );
    } finally {
      setScheduleBusy(false);
    }
  }

  function startSlugEdit() {
    if (!activeWedding) return;
    setSlugDraft(activeWedding.slug);
    setSlugEditing(true);
    setError("");
    setNotice("");
  }

  function cancelSlugEdit() {
    setSlugDraft(activeWedding?.slug ?? "");
    setSlugEditing(false);
    setError("");
  }

  async function renameSlug(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !activeWedding) return;
    const previousSlug = activeWedding.slug;
    const nextSlug = finalizeSlug(slugDraft);
    setError("");
    setNotice("");
    if (nextSlug === previousSlug) {
      setSlugEditing(false);
      return;
    }
    const validationError = getSlugError(nextSlug);
    if (validationError) {
      setError(validationError);
      return;
    }
    const consequence = activeWedding.published
      ? "Your published website will move to the new address, and the old link will stop working."
      : "Your website address will change.";
    if (
      !window.confirm(
        `Change the address from /${previousSlug} to /${nextSlug}?\n\n${consequence} Invitation links keep working.`,
      )
    )
      return;

    setSlugBusy(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(
        `/api/weddings/${encodeURIComponent(previousSlug)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ slug: nextSlug }),
        },
      );
      const payload = (await response.json()) as {
        error?: string;
        slug?: string;
      };
      if (!response.ok)
        throw new Error(
          payload.error ||
            (response.status === 409
              ? "That address is already taken."
              : "Could not change your website address."),
        );
      // Never assume success: a server that ignores unknown fields would
      // answer 200 without moving the wedding.
      if (payload.slug !== nextSlug)
        throw new Error("The server did not confirm the new address.");

      setPendingNotice(`Your website address is now /${payload.slug}.`);
      setWeddings((rows) =>
        rows.map((row) =>
          row.slug === previousSlug ? { ...row, slug: nextSlug } : row,
        ),
      );
      setActiveSlug(nextSlug);
      setSlugEditing(false);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not change your website address.",
      );
    } finally {
      setSlugBusy(false);
    }
  }

  async function copyWeddingUrl() {
    if (!activeWedding) return;
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/${activeWedding.slug}`,
      );
      setNotice("Wedding website URL copied.");
      setError("");
    } catch {
      setError("Could not copy the wedding website URL in this browser.");
    }
  }

  async function togglePublish() {
    if (!activeWedding) return;
    setError("");
    try {
      await updateWedding({ published: !activeWedding.published });
      setNotice(
        activeWedding.published
          ? "Wedding website is now private."
          : "Wedding website published.",
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not update publication status.",
      );
    }
  }

  if (authLoading || loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-5">
        <p className="text-sm text-muted">Loading your wedding data…</p>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen bg-cream">
        <main className="container-wide flex min-h-[70vh] max-w-[740px] flex-col items-start justify-center py-16">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-soft text-pine">
            <Icon name="shield" size={22} />
          </span>
          <p className="eyebrow mt-6 text-terra">Your private workspace</p>
          <h1 className="font-display mt-3 text-[44px] leading-tight">
            Your wedding details belong to you.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            Sign in with the Google account that owns or has been assigned your
            wedding. Your dashboard will show only records connected to that
            account.
          </p>
          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl bg-[#fbebe7] px-4 py-3 text-xs leading-5 text-[#8c4937]"
            >
              {error}
            </p>
          )}
          <Link
            href="/login"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-pine px-6 text-sm font-semibold text-white hover:bg-pine-dark"
          >
            Sign in <Icon name="arrow-right" size={16} />
          </Link>
        </main>
      </div>
    );

  const completedTasks =
    activeWedding?.tasks.filter((task) => task.done).length ?? 0;
  const totalTasks = activeWedding?.tasks.length ?? 0;
  const progress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;
  const responseRate = activeWedding?.invitedCount
    ? Math.round(
        (activeWedding.respondedCount / activeWedding.invitedCount) * 100,
      )
    : 0;

  return (
    <div className="min-h-screen bg-cream">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[244px] flex-col border-r border-line bg-paper px-5 py-6 lg:flex">
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pine text-white">
            <Icon name="flower" size={18} />
          </span>
          <span className="font-display text-[25px]">
            Softy<span className="text-terra">Wedding</span>
          </span>
        </Link>
        <div className="mt-10 px-2">
          <p className="eyebrow text-muted">YOUR WORKSPACE</p>
          {weddings.length > 1 && (
            <label
              className="mt-3 block text-[10px] text-muted"
              htmlFor="active-wedding"
            >
              Choose wedding
            </label>
          )}
          <div className="mt-4 rounded-xl bg-sage-soft p-3">
            {weddings.length > 0 ? (
              <select
                id="active-wedding"
                aria-label="Select a wedding"
                value={activeSlug}
                onChange={(event) => setActiveSlug(event.target.value)}
                className="w-full bg-transparent text-sm font-semibold outline-none"
              >
                {weddings.map((wedding) => (
                  <option key={wedding.slug} value={wedding.slug}>
                    {wedding.partnerOne} & {wedding.partnerTwo}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm font-semibold">No wedding selected</p>
            )}
            <p className="mt-1 text-[11px] text-muted">
              {activeWedding
                ? formatDate(activeWedding.date)
                : "Create a wedding to begin"}
            </p>
          </div>
        </div>
        <nav className="mt-8 space-y-1" aria-label="Workspace navigation">
          <Link
            href="/couple"
            className="flex items-center gap-3 rounded-xl bg-pine px-3 py-3 text-[13px] font-medium text-white"
          >
            <Icon name="layout" size={17} />
            Overview
          </Link>
          <Link
            href={
              activeWedding?.published ? `/${activeWedding.slug}` : "/couple"
            }
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-muted hover:bg-sage-soft hover:text-pine"
          >
            <Icon name="globe" size={17} />
            Wedding website
          </Link>
          <Link
            href="/couple/design"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-muted hover:bg-sage-soft hover:text-pine"
          >
            <Icon name="settings" size={17} />
            Design studio
          </Link>
          <Link
            href="/guest"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-muted hover:bg-sage-soft hover:text-pine"
          >
            <Icon name="users" size={17} />
            Guest list & RSVPs
          </Link>
          <Link
            href="/planner"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-muted hover:bg-sage-soft hover:text-pine"
          >
            <Icon name="wallet" size={17} />
            Planner workspace
          </Link>
        </nav>
        <div className="mt-auto rounded-2xl bg-[#f1e5db] p-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/65 text-terra">
            <Icon name="sparkles" size={18} />
          </span>
          <p className="mt-3 text-sm font-semibold">A little reminder</p>
          <p className="mt-1 text-xs leading-5 text-[#76685e]">
            You don’t have to do it all today. One lovely thing at a time.
          </p>
          {activeWedding?.published && (
            <Link
              href={`/${activeWedding.slug}`}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-pine"
            >
              See your website <Icon name="arrow-right" size={13} />
            </Link>
          )}
        </div>
        <Link
          href="/"
          className="mt-5 flex items-center gap-2 px-2 text-xs text-muted hover:text-pine"
        >
          <Icon name="arrow-right" size={14} className="rotate-180" />
          Back to Softy
        </Link>
      </aside>

      <main className="lg:pl-[244px]">
        <header className="sticky top-0 z-10 border-b border-line/80 bg-cream/90 backdrop-blur">
          <div className="flex min-h-[68px] items-center justify-between gap-3 px-4 sm:px-8 lg:px-10">
            <div>
              <p className="text-[11px] font-medium text-muted">
                {activeWedding
                  ? formatDate(activeWedding.date).toUpperCase()
                  : "YOUR WEDDING PLANS"}
              </p>
              <p className="font-display text-xl">Your wedding, at a glance</p>
            </div>
            <div className="flex items-center gap-3">
              {activeWedding && (
                <button
                  type="button"
                  onClick={() => setShowCreate((value) => !value)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-paper px-4 text-xs font-semibold hover:border-pine"
                >
                  <Icon name="plus" size={14} />
                  New wedding
                </button>
              )}
              <Link
                href="/login"
                aria-label="Account"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e4d4c8] text-sm font-bold text-pine"
              >
                {user.displayName
                  ?.split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase() || "U"}
              </Link>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
            {[
              { label: "Overview", href: "/couple" },
              {
                label: "Wedding website",
                href: activeWedding?.published
                  ? `/${activeWedding.slug}`
                  : "/couple",
              },
              { label: "Design studio", href: "/couple/design" },
              { label: "Guest list & RSVPs", href: "/guest" },
              { label: "Planner", href: "/planner" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="shrink-0 rounded-full border border-line bg-paper px-3 py-2 text-[11px] font-semibold text-muted"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </header>
        <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl bg-[#fbebe7] px-4 py-3 text-xs leading-5 text-[#8c4937]"
            >
              {error}
            </div>
          )}
          {notice && (
            <div
              role="status"
              className="mb-5 rounded-xl bg-sage-soft px-4 py-3 text-xs leading-5 text-pine"
            >
              {notice}
            </div>
          )}
          {showCreate && (
            <div className="mb-6">
              <WeddingCreateForm
                user={user}
                onCreated={async (slug) => {
                  setShowCreate(false);
                  await loadWeddings(user, slug);
                }}
              />
            </div>
          )}
          {!activeWedding && !showCreate && (
            <section className="rounded-2xl border border-line bg-paper p-8">
              <p className="eyebrow text-terra">Your plans start here</p>
              <h1 className="font-display mt-3 text-4xl">
                No wedding workspace yet.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
                There are no wedding records associated with this account.
                Create a workspace to start saving real details and inviting
                your guests.
              </p>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-pine px-5 text-sm font-semibold text-white"
              >
                <Icon name="plus" size={15} />
                Create wedding
              </button>
            </section>
          )}
          {activeWedding && (
            <>
              <section
                className={`relative isolate overflow-hidden rounded-[28px] border border-line px-6 py-7 sm:px-8 sm:py-9 ${activeWedding.heroImage ? "bg-cover bg-center text-white" : "warm-panel text-ink"}`}
                style={
                  activeWedding.heroImage
                    ? { backgroundImage: `url('${activeWedding.heroImage}')` }
                    : undefined
                }
              >
                {activeWedding.heroImage ? (
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#213328]/90 via-[#213328]/65 to-[#213328]/25" />
                ) : (
                  <>
                    <div className="pointer-events-none absolute -right-10 -top-12 z-0 h-48 w-48 rounded-full border border-[#d9c8b7]" />
                    <div className="pointer-events-none absolute -right-1 top-0 z-0 h-28 w-28 rounded-full border border-[#d9c8b7]" />
                  </>
                )}
                <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                  <div>
                    <p
                      className={`eyebrow ${activeWedding.heroImage ? "text-white/70" : "text-terra"}`}
                    >
                      Your story is taking shape
                    </p>
                    <h1 className="font-display mt-3 text-[37px] leading-[1.02] sm:text-[49px]">
                      {activeWedding.partnerOne}{" "}
                      <span
                        className={`italic ${activeWedding.heroImage ? "text-[#f0c7b4]" : "text-terra"}`}
                      >
                        &
                      </span>{" "}
                      {activeWedding.partnerTwo}
                    </h1>
                    <p
                      className={`mt-3 text-sm ${activeWedding.heroImage ? "text-white/80" : "text-muted"}`}
                    >
                      {activeWedding.venue ||
                        "Your venue is waiting to be added."}
                      {activeWedding.location
                        ? ` · ${activeWedding.location}`
                        : ""}
                    </p>
                    <div
                      className={`mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium ${activeWedding.heroImage ? "text-white/75" : "text-muted"}`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="calendar" size={14} />
                        {formatDate(activeWedding.date)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="check-circle" size={14} />
                        {progress}% of the plan complete
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={togglePublish}
                      className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-xs font-bold transition-colors ${activeWedding.published ? (activeWedding.heroImage ? "border border-white/40 bg-white/10 text-white hover:bg-white/20" : "border border-line bg-paper text-ink") : "bg-pine text-white hover:bg-pine-dark"}`}
                    >
                      <Icon
                        name={activeWedding.published ? "eye-off" : "globe"}
                        size={15}
                      />
                      {activeWedding.published
                        ? "Unpublish website"
                        : "Publish website"}
                    </button>
                    {activeWedding.published && (
                      <Link
                        href={`/${activeWedding.slug}`}
                        target="_blank"
                        className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-xs font-bold transition-colors ${activeWedding.heroImage ? "border border-white/40 bg-white/10 text-white hover:bg-white/20" : "border border-line bg-paper text-ink hover:border-pine"}`}
                      >
                        View website <Icon name="arrow-up-right" size={15} />
                      </Link>
                    )}
                  </div>
                </div>
              </section>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-line bg-paper p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted">
                      Planning progress
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-soft text-pine">
                      <Icon name="check-circle" size={16} />
                    </span>
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="font-display text-[34px]">
                      {progress}%
                    </span>
                    <span className="pb-1 text-xs text-muted">
                      of your checklist
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e9e9df]">
                    <div
                      className="h-full rounded-full bg-pine transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-muted">
                    {completedTasks} of {totalTasks} tasks completed
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-paper p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted">
                      Guest responses
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2e5dd] text-terra">
                      <Icon name="users" size={16} />
                    </span>
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="font-display text-[34px]">
                      {activeWedding.respondedCount}{" "}
                      <span className="text-[20px] text-muted">
                        / {activeWedding.invitedCount}
                      </span>
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-muted">
                    {activeWedding.invitedCount
                      ? `${responseRate}% of invitations answered`
                      : "No invitation codes have been created yet."}
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-paper p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted">
                      Days until the wedding
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eee7d8] text-[#8b7448]">
                      <Icon name="calendar" size={16} />
                    </span>
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="font-display text-[34px]">
                      {activeWedding.date &&
                      currentTime !== null &&
                      new Date(`${activeWedding.date}T23:59:59`).getTime() >=
                        currentTime
                        ? Math.ceil(
                            (new Date(
                              `${activeWedding.date}T23:59:59`,
                            ).getTime() -
                              currentTime) /
                              86400000,
                          )
                        : "—"}
                    </span>
                    <span className="pb-1 text-xs text-muted">days to go</span>
                  </div>
                  <p className="mt-3 text-xs text-muted">
                    {formatDate(activeWedding.date)}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-5 xl:grid-cols-[1.12fr_.88fr]">
                <section className="overflow-hidden rounded-2xl border border-line bg-paper">
                  <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
                    <div>
                      <p className="eyebrow text-muted">
                        Your next lovely things
                      </p>
                      <h2 className="font-display mt-1 text-[25px]">
                        The planning checklist
                      </h2>
                    </div>
                    <span className="rounded-full bg-sage-soft px-3 py-1.5 text-[11px] font-semibold text-pine">
                      {completedTasks} of {totalTasks} done
                    </span>
                  </div>
                  {activeWedding.tasks.length ? (
                    <div className="divide-y divide-line/80">
                      {activeWedding.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-3 px-5 py-4 sm:px-6"
                        >
                          <button
                            type="button"
                            disabled={taskBusy}
                            onClick={() => void toggleTask(task)}
                            aria-label={`${task.done ? "Mark incomplete" : "Complete"}: ${task.title}`}
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${task.done ? "border-pine bg-pine text-white" : "border-[#c9cfc3] bg-white text-transparent hover:border-pine"}`}
                          >
                            <Icon name="check" size={13} />
                          </button>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[9px] font-bold tracking-[.15em] text-terra">
                                {task.category || "GENERAL"}
                              </span>
                              {task.done && (
                                <span className="rounded-full bg-sage-soft px-2 py-0.5 text-[9px] font-semibold text-pine">
                                  Done
                                </span>
                              )}
                            </div>
                            <p
                              className={`mt-1 text-sm font-semibold ${task.done ? "text-muted line-through decoration-[#a6b2a2]" : "text-ink"}`}
                            >
                              {task.title}
                            </p>
                            {task.detail && (
                              <p className="mt-1 text-xs text-muted">
                                {task.detail}
                              </p>
                            )}
                          </div>
                          {task.due && (
                            <span className="hidden shrink-0 pt-1 text-[10px] text-muted sm:block">
                              {task.due}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-5 py-8 text-sm text-muted sm:px-6">
                      Your checklist is empty. Add a task to start tracking the
                      things you want to get done.
                    </div>
                  )}
                  <form
                    onSubmit={addTask}
                    className="flex flex-col gap-2 border-t border-line px-5 py-4 sm:flex-row sm:px-6"
                  >
                    <input
                      value={newTaskTitle}
                      onChange={(event) => setNewTaskTitle(event.target.value)}
                      maxLength={160}
                      placeholder="Add a planning task"
                      aria-label="New task title"
                      className="h-10 min-w-0 flex-1 rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-pine"
                    />
                    <button
                      type="submit"
                      disabled={taskBusy || !newTaskTitle.trim()}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-pine px-4 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      <Icon name="plus" size={14} />
                      Add task
                    </button>
                  </form>
                </section>
                <div className="space-y-5">
                  <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="eyebrow text-muted">
                          Your wedding website
                        </p>
                        <h2 className="font-display mt-1 text-[24px]">
                          Share the details
                        </h2>
                      </div>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-soft text-pine">
                        <Icon name="globe" size={17} />
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-muted">
                      {activeWedding.published
                        ? "Your page is published and available to guests."
                        : "Your website is private until you publish it."}{" "}
                      All displayed information comes from this wedding record.
                    </p>
                    <div className="mt-4 rounded-xl bg-[#f4f3eb] p-3">
                      <p className="text-[10px] text-muted">Website URL</p>
                      {slugEditing ? (
                        <form onSubmit={renameSlug} className="mt-1.5">
                          <label
                            htmlFor="wedding-slug"
                            className="sr-only"
                          >
                            Website address
                          </label>
                          <div className="flex items-center rounded-lg border border-line bg-white focus-within:border-pine">
                            <span className="pl-2.5 text-xs text-muted">/</span>
                            <input
                              id="wedding-slug"
                              required
                              autoFocus
                              autoCapitalize="none"
                              autoCorrect="off"
                              spellCheck={false}
                              minLength={SLUG_MIN_LENGTH}
                              maxLength={SLUG_MAX_LENGTH}
                              value={slugDraft}
                              onChange={(event) =>
                                setSlugDraft(slugifyInput(event.target.value))
                              }
                              aria-describedby="wedding-slug-hint"
                              className="h-9 min-w-0 flex-1 bg-transparent px-1.5 text-xs font-semibold text-pine outline-none"
                            />
                          </div>
                          <p
                            id="wedding-slug-hint"
                            className="mt-1.5 text-[10px] leading-4 text-muted"
                          >
                            Lowercase letters, numbers and hyphens, 3–60
                            characters. Accents are removed automatically.
                          </p>
                          <div className="mt-2.5 flex items-center gap-2">
                            <button
                              type="submit"
                              disabled={slugBusy}
                              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-pine px-3 text-[11px] font-semibold text-white disabled:opacity-60"
                            >
                              <Icon name="check" size={12} />
                              {slugBusy ? "Changing…" : "Change address"}
                            </button>
                            <button
                              type="button"
                              disabled={slugBusy}
                              onClick={cancelSlugEdit}
                              className="inline-flex h-8 items-center rounded-full border border-line px-3 text-[11px] font-semibold text-muted disabled:opacity-60"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="mt-1 flex items-center justify-between gap-3">
                          <p className="break-all text-xs font-semibold text-pine">
                            /{activeWedding.slug}
                          </p>
                          <button
                            type="button"
                            onClick={startSlugEdit}
                            className="shrink-0 text-[11px] font-semibold text-terra hover:underline"
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => void copyWeddingUrl()}
                      className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-pine"
                    >
                      <Icon name="clipboard" size={14} />
                      Copy website URL
                    </button>
                  </section>
                  <form
                    onSubmit={saveDetails}
                    className="rounded-2xl border border-line bg-paper p-5 sm:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="eyebrow text-muted">Wedding details</p>
                        <h2 className="font-display mt-1 text-[24px]">
                          Make it yours
                        </h2>
                      </div>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2e5dd] text-terra">
                        <Icon name="settings" size={17} />
                      </span>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="wedding-details-partner-one"
                            className="mb-1 block text-[11px] font-semibold"
                          >
                            First partner’s name
                          </label>
                          <input
                            id="wedding-details-partner-one"
                            required
                            maxLength={80}
                            value={detailsPartnerOne}
                            onChange={(event) =>
                              setDetailsPartnerOne(event.target.value)
                            }
                            className="h-10 w-full rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-pine"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="wedding-details-partner-two"
                            className="mb-1 block text-[11px] font-semibold"
                          >
                            Second partner’s name
                          </label>
                          <input
                            id="wedding-details-partner-two"
                            required
                            maxLength={80}
                            value={detailsPartnerTwo}
                            onChange={(event) =>
                              setDetailsPartnerTwo(event.target.value)
                            }
                            className="h-10 w-full rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-pine"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="wedding-details-date"
                          className="mb-1 block text-[11px] font-semibold"
                        >
                          Wedding date
                        </label>
                        <input
                          id="wedding-details-date"
                          type="date"
                          required
                          value={weddingDate}
                          onChange={(event) =>
                            setWeddingDate(event.target.value)
                          }
                          className="h-10 w-full rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-pine"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="wedding-headline"
                          className="mb-1 block text-[11px] font-semibold"
                        >
                          Headline
                        </label>
                        <input
                          id="wedding-headline"
                          maxLength={180}
                          value={headline}
                          onChange={(event) => setHeadline(event.target.value)}
                          className="h-10 w-full rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-pine"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="wedding-story"
                          className="mb-1 block text-[11px] font-semibold"
                        >
                          Your story
                        </label>
                        <textarea
                          id="wedding-story"
                          maxLength={5000}
                          rows={4}
                          value={story}
                          onChange={(event) => setStory(event.target.value)}
                          className="w-full rounded-xl border border-line bg-white px-3 py-2 text-xs leading-5 outline-none focus:border-pine"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="wedding-venue"
                          className="mb-1 block text-[11px] font-semibold"
                        >
                          Venue
                        </label>
                        <input
                          id="wedding-venue"
                          maxLength={160}
                          value={venue}
                          onChange={(event) => setVenue(event.target.value)}
                          className="h-10 w-full rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-pine"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="wedding-location"
                          className="mb-1 block text-[11px] font-semibold"
                        >
                          Address or location
                        </label>
                        <input
                          id="wedding-location"
                          maxLength={200}
                          value={location}
                          onChange={(event) => setLocation(event.target.value)}
                          className="h-10 w-full rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-pine"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="wedding-time"
                          className="mb-1 block text-[11px] font-semibold"
                        >
                          Ceremony time
                        </label>
                        <input
                          id="wedding-time"
                          maxLength={80}
                          value={ceremonyTime}
                          onChange={(event) =>
                            setCeremonyTime(event.target.value)
                          }
                          placeholder="e.g. 4:00 PM"
                          className="h-10 w-full rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-pine"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="reception-time"
                          className="mb-1 block text-[11px] font-semibold"
                        >
                          Reception time
                        </label>
                        <input
                          id="reception-time"
                          maxLength={80}
                          value={receptionTime}
                          onChange={(event) =>
                            setReceptionTime(event.target.value)
                          }
                          placeholder="e.g. 6:00 PM"
                          className="h-10 w-full rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-pine"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={savingDetails}
                      className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-pine px-4 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {savingDetails ? "Saving…" : "Save details"}
                      <Icon name="arrow-right" size={14} />
                    </button>
                  </form>
                </div>
              </div>
              <section className="mt-5 rounded-2xl border border-line bg-paper p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="eyebrow text-muted">
                      Wedding website content
                    </p>
                    <h2 className="font-display mt-1 text-[24px]">
                      Day-of schedule
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      Schedule items save to this wedding and appear on its
                      public page after publishing.
                    </p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-soft text-pine">
                    <Icon name="calendar" size={17} />
                  </span>
                </div>
                {activeWedding.schedule.length ? (
                  <div className="mt-4 divide-y divide-line border-t border-line">
                    {activeWedding.schedule.map((item, index) => (
                      <div
                        key={`${item.title}-${index}`}
                        className="flex items-start justify-between gap-3 py-3"
                      >
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-terra">
                            {item.time || "Time not set"}
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="mt-1 whitespace-pre-line text-xs leading-5 text-muted">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          disabled={scheduleBusy}
                          onClick={() => void removeScheduleItem(index)}
                          className="shrink-0 text-[11px] font-semibold text-terra underline underline-offset-4 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 rounded-xl bg-[#f4f3eb] px-4 py-4 text-xs leading-5 text-muted">
                    No schedule items have been added yet.
                  </p>
                )}
                <form
                  onSubmit={addScheduleItem}
                  className="mt-4 grid gap-3 border-t border-line pt-4"
                >
                  <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
                    <div>
                      <label
                        htmlFor="schedule-time"
                        className="mb-1 block text-[11px] font-semibold"
                      >
                        Time
                      </label>
                      <input
                        id="schedule-time"
                        value={scheduleTime}
                        onChange={(event) =>
                          setScheduleTime(event.target.value)
                        }
                        maxLength={80}
                        placeholder="e.g. 4:00 PM"
                        className="h-10 w-full rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-pine"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="schedule-title"
                        className="mb-1 block text-[11px] font-semibold"
                      >
                        Event title
                      </label>
                      <input
                        id="schedule-title"
                        required
                        value={scheduleTitle}
                        onChange={(event) =>
                          setScheduleTitle(event.target.value)
                        }
                        maxLength={120}
                        placeholder="Ceremony, dinner, speeches…"
                        className="h-10 w-full rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-pine"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="schedule-description"
                      className="mb-1 block text-[11px] font-semibold"
                    >
                      Details{" "}
                      <span className="font-normal text-muted">(optional)</span>
                    </label>
                    <input
                      id="schedule-description"
                      value={scheduleDescription}
                      onChange={(event) =>
                        setScheduleDescription(event.target.value)
                      }
                      maxLength={500}
                      placeholder="Helpful notes for your guests"
                      className="h-10 w-full rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-pine"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={
                        scheduleBusy ||
                        !scheduleTitle.trim() ||
                        activeWedding.schedule.length >= 30
                      }
                      className="inline-flex h-10 items-center gap-2 rounded-full bg-pine px-4 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      <Icon name="plus" size={14} />
                      {scheduleBusy ? "Saving…" : "Add schedule item"}
                    </button>
                  </div>
                </form>
              </section>
              <div className="mt-5">
                <WeddingInvitations
                  user={user}
                  slug={activeWedding.slug}
                  onUpdated={() => void loadWeddings(user, activeWedding.slug)}
                />
              </div>
              <section className="mt-5 rounded-2xl border border-line bg-paper p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="eyebrow text-muted">
                      Wedding website content
                    </p>
                    <h2 className="font-display mt-1 text-[24px]">
                      Photos to your story
                    </h2>
                    <p className="mt-1 max-w-2xl text-xs leading-5 text-muted">
                      Add moments from your journey, write captions and
                      accessible image descriptions, or remove photos. Photos
                      appear on your public wedding website after publishing.
                    </p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f2e5dd] text-terra">
                    <Icon name="camera" size={17} />
                  </span>
                </div>
                <div className="mt-4">
                  {(activeWedding.storyPhotos ?? []).length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {(activeWedding.storyPhotos ?? []).map((photo) => {
                        const draft = storyPhotoDrafts[photo.id] ?? {
                          caption: photo.caption ?? "",
                          altText: photo.altText ?? "",
                        };
                        return (
                          <article
                            key={photo.id}
                            className="overflow-hidden rounded-xl border border-line bg-white"
                          >
                            <Image
                              src={photo.url}
                              alt={
                                draft.altText ||
                                photo.caption ||
                                "Wedding story photo"
                              }
                              loading="lazy"
                              className="h-48 w-full object-cover"
                            />
                            <div className="space-y-3 p-3">
                              <div>
                                <label
                                  htmlFor={`story-caption-${photo.id}`}
                                  className="mb-1 block text-[11px] font-semibold"
                                >
                                  Caption
                                </label>
                                <input
                                  id={`story-caption-${photo.id}`}
                                  maxLength={240}
                                  value={draft.caption}
                                  onChange={(event) =>
                                    setStoryPhotoDrafts((current) => ({
                                      ...current,
                                      [photo.id]: {
                                        ...draft,
                                        caption: event.target.value,
                                      },
                                    }))
                                  }
                                  placeholder="A little moment worth remembering"
                                  className="h-9 w-full rounded-lg border border-line bg-white px-2.5 text-xs outline-none focus:border-pine"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor={`story-alt-${photo.id}`}
                                  className="mb-1 block text-[11px] font-semibold"
                                >
                                  Image description
                                </label>
                                <input
                                  id={`story-alt-${photo.id}`}
                                  maxLength={160}
                                  value={draft.altText}
                                  onChange={(event) =>
                                    setStoryPhotoDrafts((current) => ({
                                      ...current,
                                      [photo.id]: {
                                        ...draft,
                                        altText: event.target.value,
                                      },
                                    }))
                                  }
                                  placeholder="Describe the photo for screen readers"
                                  className="h-9 w-full rounded-lg border border-line bg-white px-2.5 text-xs outline-none focus:border-pine"
                                />
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
                                <button
                                  type="button"
                                  disabled={storyPhotoBusy}
                                  onClick={() => void saveStoryPhoto(photo.id)}
                                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-pine px-3 text-xs font-semibold text-white disabled:opacity-50"
                                >
                                  <Icon name="check" size={13} /> Save photo
                                </button>
                                <button
                                  type="button"
                                  disabled={storyPhotoBusy}
                                  onClick={() =>
                                    void removeStoryPhoto(photo.id)
                                  }
                                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-terra hover:border-terra disabled:opacity-50"
                                >
                                  <Icon name="close" size={13} /> Remove
                                </button>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="rounded-xl bg-[#f4f3eb] px-4 py-5 text-xs leading-5 text-muted">
                      Your story gallery is empty. Upload a photo below to
                      begin.
                    </p>
                  )}
                </div>
                {(activeWedding.storyPhotos ?? []).length < 30 ? (
                  <div className="mt-4">
                    <CloudinaryUpload
                      eyebrow="Your love story"
                      heading="Add a photo to the story"
                      description="Upload a JPG, PNG, WebP or AVIF image. Once saved, it will appear in the story gallery on your wedding website."
                      buttonLabel="Upload story photo"
                      onImageUploaded={addStoryPhoto}
                    />
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-muted">
                    You have reached the 30-photo limit for this story.
                  </p>
                )}
              </section>
              <div className="mt-5">
                <CloudinaryUpload
                  key={activeWedding.slug}
                  eyebrow="Wedding website"
                  heading={
                    activeWedding.heroImage
                      ? "Change your cover photo"
                      : "Choose a cover photo"
                  }
                  description={
                    activeWedding.heroImage
                      ? "Your current cover is shown below. Upload a new image to replace it on your public wedding website."
                      : "Choose a beautiful image for the hero section at the top of your public wedding website."
                  }
                  buttonLabel={
                    activeWedding.heroImage
                      ? "Replace cover photo"
                      : "Upload cover photo"
                  }
                  currentImageUrl={activeWedding.heroImage}
                  currentImageAlt={`${activeWedding.partnerOne} and ${activeWedding.partnerTwo} wedding cover photo`}
                  onImageUploaded={async (url) => {
                    await updateWedding({ heroImage: url });
                    setError("");
                    setNotice("Your wedding cover photo was saved.");
                  }}
                  onImageRemoved={async () => {
                    await updateWedding({ heroImage: "" });
                    setError("");
                    setNotice("Your wedding cover photo was removed.");
                  }}
                />
              </div>
              <p className="mt-6 text-center text-[10px] text-muted">
                All dashboard numbers are calculated from Firestore records
                linked to this wedding.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
