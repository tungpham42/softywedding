"use client";

import Link from "next/link";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase/client";
import type { Wedding } from "@/lib/wedding";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Icon } from "@/components/ui/icon";

function formatDate(value: string) {
  if (!value) return "Date not set";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function PlannerWorkspace() {
  const auth = getFirebaseAuth();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(() => Boolean(auth));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weddings, setWeddings] = useState<Wedding[]>([]);

  const load = useCallback(async (currentUser: User) => {
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
        throw new Error(payload.error || "Could not load your portfolio.");
      setWeddings(payload.weddings ?? []);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load your portfolio.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      return;
    }
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) void load(currentUser);
      else setWeddings([]);
    });
  }, [auth, load]);

  const now = new Date();
  const upcoming = weddings
    .filter(
      (wedding) =>
        wedding.date &&
        new Date(`${wedding.date}T23:59:59`).getTime() >= now.getTime(),
    )
    .sort((a, b) => a.date.localeCompare(b.date));
  const invitationCount = weddings.reduce(
    (sum, wedding) => sum + wedding.invitedCount,
    0,
  );
  const responseCount = weddings.reduce(
    (sum, wedding) => sum + wedding.respondedCount,
    0,
  );
  const responseRate = invitationCount
    ? Math.round((responseCount / invitationCount) * 100)
    : 0;
  const attendingCount = weddings.reduce(
    (sum, wedding) => sum + wedding.attendingCount,
    0,
  );

  if (authLoading || loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-sm text-muted">Loading your wedding portfolio…</p>
      </div>
    );

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-78px)] bg-cream py-10 sm:py-14">
        <div className="container-wide">
          <section className="warm-panel relative isolate overflow-hidden rounded-[28px] border border-white/80 px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <div className="pointer-events-none absolute right-[-38px] top-[-54px] z-0 h-56 w-56 rounded-full border border-[#d8c8b7]" />
            <div className="pointer-events-none absolute right-[28px] top-[12px] z-0 h-32 w-32 rounded-full border border-[#d8c8b7]" />
            <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-terra">The planner’s room</p>
                <h1 className="font-display mt-3 text-[40px] leading-[1.02] sm:text-[54px]">
                  A little more flow.
                  <br />
                  <span className="italic text-pine">
                    A lot less follow-up.
                  </span>
                </h1>
                <p className="mt-4 max-w-[550px] text-sm leading-6 text-muted sm:text-base">
                  A calmer overview of the wedding projects connected to your
                  account, with guest responses and planning progress in one
                  place.
                </p>
              </div>
              {user ? (
                <Link
                  href="/couple"
                  className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-full bg-pine px-5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-pine-dark sm:self-auto"
                >
                  <Icon name="plus" size={16} />
                  Set up a wedding
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-full bg-pine px-5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-pine-dark sm:self-auto"
                >
                  Sign in to your portfolio{" "}
                  <Icon name="arrow-right" size={15} />
                </Link>
              )}
            </div>
          </section>

          {(error ||
            (!auth &&
              "Firebase client settings are missing. Configure NEXT_PUBLIC_FIREBASE_* to load real wedding records.")) && (
            <p
              role="alert"
              className="mt-6 rounded-xl bg-[#fbebe7] px-4 py-3 text-xs leading-5 text-[#8c4937]"
            >
              {error ||
                "Firebase client settings are missing. Configure NEXT_PUBLIC_FIREBASE_* to load real wedding records."}
            </p>
          )}
          {!user ? (
            <section className="mt-8 rounded-2xl border border-line bg-paper p-8">
              <h2 className="font-display text-3xl">
                Your projects, in one place.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
                Sign in with the account that owns or has been assigned your
                wedding projects. No sample events are shown here.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-pine px-5 text-sm font-semibold text-white"
              >
                Sign in <Icon name="arrow-right" size={15} />
              </Link>
            </section>
          ) : (
            <>
              <div className="mt-9 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    label: "Wedding projects",
                    value: String(weddings.length),
                    hint: `${upcoming.length} with upcoming dates`,
                    icon: "heart" as const,
                    color: "bg-[#f0e1d8] text-terra",
                  },
                  {
                    label: "Invited guests",
                    value: String(invitationCount),
                    hint: `${responseCount} invitation responses`,
                    icon: "users" as const,
                    color: "bg-sage-soft text-pine",
                  },
                  {
                    label: "RSVP rate",
                    value: `${responseRate}%`,
                    hint: `${attendingCount} guests currently attending`,
                    icon: "calendar" as const,
                    color: "bg-[#eee7d8] text-[#8b7448]",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-line bg-paper p-5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted">
                        {item.label}
                      </p>
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${item.color}`}
                      >
                        <Icon name={item.icon} size={17} />
                      </span>
                    </div>
                    <p className="font-display mt-3 text-[36px]">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs text-muted">{item.hint}</p>
                  </div>
                ))}
              </div>
              <section className="mt-7 overflow-hidden rounded-2xl border border-line bg-paper">
                <div className="flex flex-col justify-between gap-3 border-b border-line px-5 py-5 sm:flex-row sm:items-center sm:px-7">
                  <div>
                    <p className="eyebrow text-muted">Your portfolio</p>
                    <h2 className="font-display mt-1 text-[28px]">
                      Wedding projects
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => user && void load(user)}
                    className="inline-flex items-center gap-2 self-start rounded-full border border-line px-3 py-2 text-xs font-semibold text-muted hover:border-pine"
                  >
                    <Icon name="clock" size={13} />
                    Refresh data
                  </button>
                </div>
                {weddings.length ? (
                  <div className="divide-y divide-line">
                    {weddings.map((wedding) => {
                      const taskCount = wedding.tasks.length;
                      const done = wedding.tasks.filter(
                        (task) => task.done,
                      ).length;
                      const progress = taskCount
                        ? Math.round((done / taskCount) * 100)
                        : 0;
                      return (
                        <article
                          key={wedding.slug}
                          className="grid gap-4 px-5 py-5 sm:grid-cols-[1.4fr_.8fr_.7fr_auto] sm:items-center sm:px-7"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage-soft text-xs font-bold text-pine">
                              {`${wedding.partnerOne?.[0] ?? ""}${wedding.partnerTwo?.[0] ?? ""}` || (
                                <Icon name="heart" size={16} />
                              )}
                            </span>
                            <div>
                              <h3 className="text-sm font-semibold">
                                {wedding.partnerOne} & {wedding.partnerTwo}
                              </h3>
                              <p className="mt-1 text-xs text-muted">
                                {wedding.venue ||
                                  wedding.location ||
                                  "Venue details not added"}
                              </p>
                              <p className="mt-1 text-[10px] text-muted">
                                {wedding.published
                                  ? "Website published"
                                  : "Website is private"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="eyebrow text-muted">Wedding date</p>
                            <p className="mt-1 text-xs font-semibold">
                              {formatDate(wedding.date)}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs text-muted">
                                Planning
                              </span>
                              <span className="text-xs font-semibold">
                                {progress}%
                              </span>
                            </div>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e8e8df]">
                              <div
                                className="h-full rounded-full bg-pine"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="mt-2 text-[10px] text-muted">
                              {wedding.respondedCount} / {wedding.invitedCount}{" "}
                              replied
                            </p>
                          </div>
                          <Link
                            href={`/couple`}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-line px-4 text-xs font-semibold hover:border-pine hover:text-pine"
                          >
                            Open workspace{" "}
                            <Icon name="arrow-up-right" size={13} />
                          </Link>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-5 py-10 sm:px-7">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-soft text-pine">
                      <Icon name="calendar" size={20} />
                    </div>
                    <h3 className="font-display mt-4 text-2xl">
                      No wedding projects found
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                      This account is not listed as an owner or planner on any
                      wedding record. Create a workspace or ask a project owner
                      to assign your account as its planner.
                    </p>
                    <Link
                      href="/couple"
                      className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-pine px-4 text-xs font-semibold text-white"
                    >
                      <Icon name="plus" size={14} />
                      Create a wedding workspace
                    </Link>
                  </div>
                )}
              </section>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <section className="rounded-2xl border border-line bg-paper p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-soft text-pine">
                      <Icon name="clipboard" size={19} />
                    </span>
                    <div>
                      <p className="eyebrow text-muted">Coming up</p>
                      <h2 className="font-display mt-0.5 text-[23px]">
                        Upcoming weddings
                      </h2>
                    </div>
                  </div>
                  {upcoming.length ? (
                    <div className="mt-5 space-y-4">
                      {upcoming.slice(0, 5).map((wedding) => (
                        <div key={wedding.slug} className="flex gap-3">
                          <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-terra" />
                          <div>
                            <p className="text-[9px] font-bold tracking-[.14em] text-terra">
                              {formatDate(wedding.date).toUpperCase()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                              {wedding.partnerOne} & {wedding.partnerTwo}
                            </p>
                            <p className="mt-1 text-xs text-muted">
                              {wedding.venue ||
                                wedding.location ||
                                "Venue not set"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-5 text-sm leading-6 text-muted">
                      No upcoming wedding dates are set for your connected
                      projects.
                    </p>
                  )}
                </section>
                <section className="relative overflow-hidden rounded-2xl bg-pine p-6 text-white sm:p-7">
                  <div className="absolute -right-9 -top-10 h-44 w-44 rounded-full border border-white/15" />
                  <div className="relative">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[#e9c4b3]">
                      <Icon name="sparkles" size={19} />
                    </span>
                    <p className="eyebrow mt-5 text-white/55">
                      A calmer workflow
                    </p>
                    <h2 className="font-display mt-2 max-w-sm text-[30px] leading-tight">
                      Every next step, in its place.
                    </h2>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
                      Wedding projects, real RSVP counts, and planning checklist
                      completion are pulled from the records tied to your
                      account.
                    </p>
                    <Link
                      href="/couple"
                      className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-paper px-4 text-xs font-semibold text-pine hover:bg-[#f0e7da]"
                    >
                      Open workspace <Icon name="arrow-right" size={14} />
                    </Link>
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
