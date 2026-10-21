"use client";

import Link from "next/link";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { Icon } from "@/components/ui/icon";
import {
  DEFAULT_WEDDING_DESIGN,
  WEDDING_PALETTES,
  type WeddingDesign,
  type WeddingPalette,
  type WeddingTypography,
  type WeddingLayout,
  type WeddingHeroStyle,
  type WeddingCoverPosition,
} from "@/lib/wedding-design";

type WeddingOption = {
  slug: string;
  partnerOne: string;
  partnerTwo: string;
  date: string;
  heroImage: string;
  published: boolean;
  design: WeddingDesign;
};

const paletteNames = Object.keys(WEDDING_PALETTES) as WeddingPalette[];
const typographyOptions: {
  value: WeddingTypography;
  label: string;
  description: string;
}[] = [
  {
    value: "editorial",
    label: "Editorial serif",
    description: "Elegant, timeless, magazine-inspired",
  },
  {
    value: "modern",
    label: "Modern sans",
    description: "Clean, confident, contemporary",
  },
  {
    value: "romantic",
    label: "Romantic script feel",
    description: "Soft, expressive, intimate",
  },
];
const layoutOptions: {
  value: WeddingLayout;
  label: string;
  description: string;
}[] = [
  {
    value: "classic",
    label: "Classic centered",
    description: "A traditional, balanced welcome",
  },
  {
    value: "editorial",
    label: "Editorial alignment",
    description: "A more dramatic, left-aligned hero",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "A quieter layout with more breathing room",
  },
];

function formatDate(value: string) {
  if (!value) return "Date to be announced";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(date);
}

export function WeddingDesignWorkspace() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [weddings, setWeddings] = useState<WeddingOption[]>([]);
  const [activeSlug, setActiveSlug] = useState("");
  const [draft, setDraft] = useState<WeddingDesign>(DEFAULT_WEDDING_DESIGN);

  const loadWeddings = useCallback(async (currentUser: User) => {
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
        weddings?: WeddingOption[];
      };
      if (!response.ok)
        throw new Error(payload.error || "Could not load your weddings.");
      const rows = (payload.weddings ?? []).map((wedding) => ({
        ...wedding,
        design: wedding.design ?? DEFAULT_WEDDING_DESIGN,
      }));
      setWeddings(rows);
      setActiveSlug((current) => {
        const nextSlug = rows.some((row) => row.slug === current)
          ? current
          : (rows[0]?.slug ?? "");
        const nextWedding = rows.find((row) => row.slug === nextSlug);
        setDraft(nextWedding?.design ?? DEFAULT_WEDDING_DESIGN);
        return nextSlug;
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load your weddings.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      queueMicrotask(() => {
        setAuthLoading(false);
        setError(
          "Firebase client settings are missing. Configure the NEXT_PUBLIC_FIREBASE_* values to use the design studio.",
        );
      });
      return;
    }
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) void loadWeddings(currentUser);
      else {
        setWeddings([]);
        setActiveSlug("");
        setDraft(DEFAULT_WEDDING_DESIGN);
        setNotice("");
      }
    });
  }, [loadWeddings]);

  const activeWedding = useMemo(
    () => weddings.find((wedding) => wedding.slug === activeSlug) ?? null,
    [weddings, activeSlug],
  );

  const selectWedding = useCallback(
    (nextSlug: string, nextWeddings: WeddingOption[] = weddings) => {
      const nextWedding =
        nextWeddings.find((wedding) => wedding.slug === nextSlug) ?? null;
      setActiveSlug(nextSlug);
      setDraft(nextWedding?.design ?? DEFAULT_WEDDING_DESIGN);
      setNotice("");
    },
    [weddings],
  );

  function updateDraft<K extends keyof WeddingDesign>(
    key: K,
    value: WeddingDesign[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
    setNotice("");
  }

  async function saveDesign() {
    if (!user || !activeWedding) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const token = await user.getIdToken();
      const response = await fetch(
        `/api/weddings/${encodeURIComponent(activeWedding.slug)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ design: draft }),
        },
      );
      const payload = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(payload.error || "Could not save the design.");
      setWeddings((rows) =>
        rows.map((row) =>
          row.slug === activeWedding.slug ? { ...row, design: draft } : row,
        ),
      );
      setNotice("Your design preferences have been saved.");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save the design.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-5">
        <p className="text-sm text-muted">Loading your design studio…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-cream">
        <div className="container-wide flex min-h-[75vh] max-w-[720px] flex-col items-start justify-center py-16">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-soft text-pine">
            <Icon name="settings" size={22} />
          </span>
          <p className="eyebrow mt-6 text-terra">
            Wedding website design studio
          </p>
          <h1 className="font-display mt-3 text-4xl sm:text-5xl">
            Make the website feel like you.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            Sign in to customize the colors, type, layout, cover treatment, and
            sections of a wedding website you own or manage.
          </p>
          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl bg-[#fbebe7] px-4 py-3 text-xs text-[#8c4937]"
            >
              {error}
            </p>
          )}
          <Link
            href="/login"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-pine px-6 text-sm font-semibold text-white"
          >
            Sign in <Icon name="arrow-right" size={15} />
          </Link>
        </div>
      </main>
    );
  }

  const palette = WEDDING_PALETTES[draft.palette];
  const hasChanges =
    JSON.stringify(draft) !==
    JSON.stringify(activeWedding?.design ?? DEFAULT_WEDDING_DESIGN);

  return (
    <main className="min-h-screen bg-cream">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
        <div className="container-wide flex min-h-[76px] flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/couple"
              aria-label="Back to couple workspace"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-pine hover:border-pine"
            >
              <Icon name="arrow-right" size={16} className="rotate-180" />
            </Link>
            <div>
              <p className="eyebrow text-terra">Softy Wedding</p>
              <h1 className="font-display text-2xl sm:text-[28px]">
                Design studio
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeWedding?.published && (
              <Link
                href={`/${activeWedding.slug}`}
                target="_blank"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-xs font-semibold hover:border-pine"
              >
                View live page <Icon name="arrow-up-right" size={14} />
              </Link>
            )}
            <button
              type="button"
              onClick={() => void saveDesign()}
              disabled={!activeWedding || saving || !hasChanges}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-pine px-5 text-xs font-bold text-white hover:bg-pine-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="check" size={14} />
              {saving ? "Saving…" : "Save design"}
            </button>
          </div>
        </div>
      </header>

      <div className="container-wide grid gap-7 py-7 lg:grid-cols-[minmax(0,1fr)_minmax(320px,.84fr)] lg:py-10">
        <section className="min-w-0 space-y-6">
          {error && (
            <div
              role="alert"
              className="rounded-xl bg-[#fbebe7] px-4 py-3 text-sm text-[#8c4937]"
            >
              {error}
            </div>
          )}
          {notice && (
            <div
              role="status"
              className="rounded-xl bg-sage-soft px-4 py-3 text-sm text-pine"
            >
              {notice}
            </div>
          )}
          {!weddings.length ? (
            <div className="editorial-card p-7 sm:p-9">
              <p className="eyebrow text-terra">Start with your story</p>
              <h2 className="font-display mt-3 text-3xl">
                Create a wedding first.
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Once you have a wedding workspace, you can personalize its
                public website here.
              </p>
              <Link
                href="/couple"
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-pine px-5 text-sm font-semibold text-white"
              >
                Open workspace <Icon name="arrow-right" size={15} />
              </Link>
            </div>
          ) : (
            <>
              <section className="editorial-card p-5 sm:p-6">
                <label htmlFor="design-wedding" className="eyebrow text-muted">
                  Choose a wedding
                </label>
                <select
                  id="design-wedding"
                  value={activeSlug}
                  onChange={(event) => selectWedding(event.target.value)}
                  className="form-field mt-2"
                >
                  {weddings.map((wedding) => (
                    <option key={wedding.slug} value={wedding.slug}>
                      {wedding.partnerOne} &amp; {wedding.partnerTwo}
                    </option>
                  ))}
                </select>
                {activeWedding && (
                  <p className="mt-2 text-xs text-muted">
                    {formatDate(activeWedding.date)} ·{" "}
                    {activeWedding.published
                      ? "Website published"
                      : "Website not published yet"}
                  </p>
                )}
              </section>

              <section className="editorial-card p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow text-terra">01 / Color story</p>
                    <h2 className="font-display mt-2 text-2xl">
                      Choose your palette
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      Five coordinated palettes recolor the page, buttons,
                      details and accents.
                    </p>
                  </div>
                  <Icon name="settings" size={22} className="text-terra" />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {paletteNames.map((name) => {
                    const option = WEDDING_PALETTES[name];
                    const selected = draft.palette === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => updateDraft("palette", name)}
                        aria-pressed={selected}
                        className={`rounded-2xl border p-3 text-left transition-all ${selected ? "border-pine bg-sage-soft ring-2 ring-pine/15" : "border-line bg-white hover:border-pine/50"}`}
                      >
                        <span className="flex h-10 overflow-hidden rounded-xl border border-black/5">
                          <span
                            className="flex-1"
                            style={{ background: option.paper }}
                          />
                          <span
                            className="flex-1"
                            style={{ background: option.soft }}
                          />
                          <span
                            className="flex-1"
                            style={{ background: option.accent }}
                          />
                          <span
                            className="flex-1"
                            style={{ background: option.highlight }}
                          />
                        </span>
                        <span className="mt-2 flex items-center justify-between gap-2 text-xs font-semibold">
                          {option.label}
                          {selected && (
                            <Icon
                              name="check-circle"
                              size={15}
                              className="text-pine"
                            />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="editorial-card p-5 sm:p-6">
                <p className="eyebrow text-terra">02 / Typography</p>
                <h2 className="font-display mt-2 text-2xl">Set the tone</h2>
                <div className="mt-4 grid gap-3">
                  {typographyOptions.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => updateDraft("typography", option.value)}
                      aria-pressed={draft.typography === option.value}
                      className={`flex items-start justify-between gap-4 rounded-xl border p-4 text-left ${draft.typography === option.value ? "border-pine bg-sage-soft" : "border-line bg-white hover:border-pine/50"}`}
                    >
                      <span>
                        <span
                          className={`block text-sm font-semibold ${option.value === "editorial" ? "font-display" : option.value === "romantic" ? "font-display italic" : "font-sans"}`}
                        >
                          {option.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted">
                          {option.description}
                        </span>
                      </span>
                      {draft.typography === option.value && (
                        <Icon
                          name="check-circle"
                          size={17}
                          className="shrink-0 text-pine"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </section>

              <section className="editorial-card p-5 sm:p-6">
                <p className="eyebrow text-terra">03 / Composition</p>
                <h2 className="font-display mt-2 text-2xl">Pick a layout</h2>
                <div className="mt-4 grid gap-3">
                  {layoutOptions.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => updateDraft("layout", option.value)}
                      aria-pressed={draft.layout === option.value}
                      className={`flex items-start justify-between gap-4 rounded-xl border p-4 text-left ${draft.layout === option.value ? "border-pine bg-sage-soft" : "border-line bg-white hover:border-pine/50"}`}
                    >
                      <span>
                        <span className="block text-sm font-semibold">
                          {option.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted">
                          {option.description}
                        </span>
                      </span>
                      {draft.layout === option.value && (
                        <Icon
                          name="check-circle"
                          size={17}
                          className="shrink-0 text-pine"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </section>

              <section className="editorial-card p-5 sm:p-6">
                <p className="eyebrow text-terra">04 / Cover image</p>
                <h2 className="font-display mt-2 text-2xl">
                  Style the first impression
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-semibold">
                    Hero treatment
                    <select
                      value={draft.heroStyle}
                      onChange={(event) =>
                        updateDraft(
                          "heroStyle",
                          event.target.value as WeddingHeroStyle,
                        )
                      }
                      className="form-field mt-2"
                    >
                      <option value="photo">Photo with overlay</option>
                      <option value="solid">Solid color cover</option>
                    </select>
                  </label>
                  <label className="text-xs font-semibold">
                    Photo focal point
                    <select
                      value={draft.coverPosition}
                      onChange={(event) =>
                        updateDraft(
                          "coverPosition",
                          event.target.value as WeddingCoverPosition,
                        )
                      }
                      disabled={draft.heroStyle === "solid"}
                      className="form-field mt-2"
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </label>
                </div>
                <p className="mt-3 text-xs leading-5 text-muted">
                  The photo treatment uses the cover image you have already
                  saved. The solid option creates a color-led cover without
                  removing that image from your wedding record.
                </p>
              </section>

              <section className="editorial-card p-5 sm:p-6">
                <p className="eyebrow text-terra">05 / Page sections</p>
                <h2 className="font-display mt-2 text-2xl">
                  Share what matters
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Turn sections on or off to keep the guest experience focused.
                </p>
                <div className="mt-4 divide-y divide-line">
                  {(
                    [
                      [
                        "showStory",
                        "Our story",
                        "A personal note and headline",
                      ],
                      [
                        "showSchedule",
                        "Wedding day schedule",
                        "Times and the plan for the day",
                      ],
                      [
                        "showVenue",
                        "Venue and location",
                        "Where to meet and ceremony time",
                      ],
                      [
                        "showRsvpButton",
                        "Guest invitation links",
                        "Links guests to the invitation lookup and RSVP flow",
                      ],
                    ] as const
                  ).map(([key, label, description]) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-start gap-3 py-4"
                    >
                      <input
                        type="checkbox"
                        checked={draft[key]}
                        onChange={(event) =>
                          updateDraft(key, event.target.checked)
                        }
                        className="mt-1 h-4 w-4 rounded border-line"
                      />
                      <span>
                        <span className="block text-sm font-semibold">
                          {label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted">
                          {description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              <section className="editorial-card p-5 sm:p-6">
                <p className="eyebrow text-terra">06 / Your words</p>
                <h2 className="font-display mt-2 text-2xl">
                  Make the copy personal
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Small wording choices help the whole page sound like the two
                  of you.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-semibold sm:col-span-2">
                    Welcome line
                    <input
                      value={draft.welcomeMessage}
                      maxLength={100}
                      onChange={(event) =>
                        updateDraft("welcomeMessage", event.target.value)
                      }
                      className="form-field mt-2"
                    />
                  </label>
                  <label className="text-xs font-semibold">
                    Story section label
                    <input
                      value={draft.storyLabel}
                      maxLength={60}
                      onChange={(event) =>
                        updateDraft("storyLabel", event.target.value)
                      }
                      className="form-field mt-2"
                    />
                  </label>
                  <label className="text-xs font-semibold">
                    Schedule section label
                    <input
                      value={draft.scheduleLabel}
                      maxLength={60}
                      onChange={(event) =>
                        updateDraft("scheduleLabel", event.target.value)
                      }
                      className="form-field mt-2"
                    />
                  </label>
                  <label className="text-xs font-semibold">
                    Invitation button label
                    <input
                      value={draft.rsvpLabel}
                      maxLength={60}
                      onChange={(event) =>
                        updateDraft("rsvpLabel", event.target.value)
                      }
                      className="form-field mt-2"
                    />
                  </label>
                  <label className="text-xs font-semibold">
                    Closing message
                    <input
                      value={draft.closingMessage}
                      maxLength={120}
                      onChange={(event) =>
                        updateDraft("closingMessage", event.target.value)
                      }
                      className="form-field mt-2"
                    />
                  </label>
                </div>
              </section>
            </>
          )}
        </section>

        <aside className="min-w-0 lg:sticky lg:top-[100px] lg:self-start">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow text-muted">Live preview</p>
              <h2 className="font-display mt-1 text-2xl">
                A little look ahead
              </h2>
            </div>
            <span className="rounded-full border border-line bg-paper px-3 py-1.5 text-[10px] font-semibold text-muted">
              Illustrative
            </span>
          </div>
          <div
            className="overflow-hidden rounded-[26px] border border-line bg-white shadow-xl"
            style={{ backgroundColor: palette.paper, color: palette.ink }}
          >
            <div
              className="relative flex min-h-[330px] items-end overflow-hidden p-6 sm:min-h-[400px] sm:p-8"
              style={{
                backgroundColor: palette.accent,
                backgroundImage:
                  draft.heroStyle === "photo" && activeWedding?.heroImage
                    ? `linear-gradient(180deg, transparent 10%, ${palette.accent}dd 100%), url('${activeWedding.heroImage}')`
                    : undefined,
                backgroundSize: "cover",
                backgroundPosition: draft.coverPosition,
              }}
            >
              <div
                className={`relative w-full ${draft.layout === "editorial" ? "text-left" : "text-center"}`}
              >
                <p className="text-[9px] font-bold uppercase tracking-[.2em] text-white/70">
                  {draft.welcomeMessage}
                </p>
                <h3
                  className={`mt-5 text-white ${draft.typography === "modern" ? "font-sans font-semibold tracking-tight" : "font-display"} ${draft.typography === "romantic" ? "italic" : ""} ${draft.layout === "minimal" ? "text-4xl" : "text-5xl"}`}
                >
                  {activeWedding?.partnerOne || "Your names"}
                  <br />
                  <span style={{ color: palette.highlight }}>&amp;</span>{" "}
                  {activeWedding?.partnerTwo || "Your person"}
                </h3>
                <div
                  className={`mt-5 text-xs tracking-wide text-white/80 ${draft.layout === "editorial" ? "text-left" : "text-center"}`}
                >
                  {formatDate(activeWedding?.date ?? "")}
                </div>
                {draft.showRsvpButton && (
                  <span
                    className="mt-6 inline-flex rounded-full px-4 py-2 text-[10px] font-bold"
                    style={{
                      backgroundColor: palette.paper,
                      color: palette.accent,
                    }}
                  >
                    {draft.rsvpLabel}
                  </span>
                )}
              </div>
            </div>
            {draft.showStory && (
              <div className="px-6 py-8 text-center">
                <p
                  className="text-[9px] font-bold uppercase tracking-[.18em]"
                  style={{ color: palette.highlight }}
                >
                  {draft.storyLabel}
                </p>
                <p
                  className={`mt-3 text-2xl ${draft.typography === "modern" ? "font-sans" : "font-display"}`}
                >
                  A day full of meaning.
                </p>
                <p className="mx-auto mt-3 max-w-[280px] text-xs leading-5 opacity-70">
                  Your personal story will appear here when you add it to your
                  wedding details.
                </p>
              </div>
            )}
            {draft.showSchedule && (
              <div className="px-6 pb-7">
                <div
                  className="rounded-2xl p-4"
                  style={{ backgroundColor: palette.soft }}
                >
                  <p
                    className="text-[9px] font-bold uppercase tracking-[.16em]"
                    style={{ color: palette.highlight }}
                  >
                    {draft.scheduleLabel}
                  </p>
                  <p
                    className={`mt-2 text-xl ${draft.typography === "modern" ? "font-sans" : "font-display"}`}
                  >
                    Here’s how it unfolds.
                  </p>
                  <div
                    className="mt-4 h-2 w-3/4 rounded-full"
                    style={{ backgroundColor: `${palette.accent}33` }}
                  />
                  <div
                    className="mt-2 h-2 w-1/2 rounded-full"
                    style={{ backgroundColor: `${palette.accent}22` }}
                  />
                </div>
              </div>
            )}
            {draft.showRsvpButton && (
              <div className="px-6 pb-7 text-center">
                <p
                  className={`text-lg ${draft.typography === "modern" ? "font-sans" : "font-display"}`}
                >
                  {draft.closingMessage}
                </p>
                <span
                  className="mt-3 inline-flex rounded-full px-4 py-2 text-[10px] font-bold"
                  style={{ backgroundColor: palette.accent, color: "#fff" }}
                >
                  {draft.rsvpLabel}
                </span>
              </div>
            )}
          </div>
          <p className="mt-3 text-xs leading-5 text-muted">
            Preview is a visual guide. Save your design, then open the published
            wedding website to review the complete page and its real content.
          </p>
          {activeWedding && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/couple"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-paper px-4 text-xs font-semibold hover:border-pine"
              >
                Back to workspace{" "}
                <Icon name="arrow-right" size={13} className="rotate-180" />
              </Link>
              {activeWedding.published && (
                <Link
                  href={`/${activeWedding.slug}`}
                  target="_blank"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-pine px-4 text-xs font-semibold text-white"
                >
                  Open live website <Icon name="arrow-up-right" size={13} />
                </Link>
              )}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
