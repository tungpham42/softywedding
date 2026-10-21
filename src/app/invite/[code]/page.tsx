import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminDb } from "@/lib/firebase/admin";
import { readString, readWeddingSchedule } from "@/lib/wedding";
import { formatWeddingDate } from "@/lib/utils";
import { RsvpForm } from "@/components/dashboard/rsvp-form";
import { Icon } from "@/components/ui/icon";

export const dynamic = "force-dynamic";

async function getInvitation(code: string) {
  const db = getAdminDb();
  if (!db) return null;
  const invitationSnap = await db.collection("inviteCodes").doc(code).get();
  if (!invitationSnap.exists) return null;
  const invite = invitationSnap.data() ?? {};
  const weddingSlug = readString(invite.weddingSlug);
  if (!/^[a-z0-9-]{1,70}$/.test(weddingSlug)) return null;
  const weddingSnap = await db.collection("weddings").doc(weddingSlug).get();
  if (!weddingSnap.exists) return null;
  const data = weddingSnap.data() ?? {};
  if (invite.active === false) return null;
  return {
    code,
    wedding: {
      slug: weddingSlug,
      partnerOne: readString(data.partnerOne),
      partnerTwo: readString(data.partnerTwo),
      date: readString(data.date),
      venue: readString(data.venue),
      location: readString(data.location),
      heroImage: readString(data.heroImage),
      headline: readString(data.headline),
      story: readString(data.story),
      ceremonyTime: readString(data.ceremonyTime),
      schedule: readWeddingSchedule(data.schedule),
    },
    guestName: readString(invite.guestName),
    maxGuests:
      typeof invite.maxGuests === "number"
        ? Math.max(1, Math.min(8, Math.floor(invite.maxGuests)))
        : 1,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code: rawCode } = await params;
  const data = await getInvitation(decodeURIComponent(rawCode).toUpperCase());
  return data
    ? {
        title: `Invitation to ${data.wedding.partnerOne} & ${data.wedding.partnerTwo}`,
      }
    : { title: "Wedding invitation not found" };
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode).toUpperCase();
  const invitation = await getInvitation(code);
  if (
    !invitation ||
    !invitation.wedding.partnerOne ||
    !invitation.wedding.partnerTwo ||
    !invitation.guestName
  )
    notFound();
  const { wedding, guestName, maxGuests } = invitation;
  const coupleNames = `${wedding.partnerOne} & ${wedding.partnerTwo}`;

  return (
    <main className="min-h-screen bg-cream">
      <header className="container-wide flex h-[72px] items-center justify-between">
        <Link href="/" className="font-display text-[25px]">
          Softy<span className="text-terra">Wedding</span>
        </Link>
        <Link
          href="/guest"
          className="text-xs font-semibold text-muted hover:text-pine"
        >
          Invitation help{" "}
          <Icon name="arrow-up-right" size={13} className="inline" />
        </Link>
      </header>
      <section className="container-wide grid max-w-[1060px] items-start gap-8 pb-12 pt-4 lg:grid-cols-[1.02fr_.98fr] lg:gap-10 lg:pb-16">
        <div>
          <div
            className={`relative h-[340px] overflow-hidden rounded-t-[42%] rounded-b-[16px] sm:h-[430px] ${wedding.heroImage ? "bg-cover bg-center" : "bg-pine"}`}
            style={
              wedding.heroImage
                ? { backgroundImage: `url('${wedding.heroImage}')` }
                : undefined
            }
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#203b2e]/65 to-transparent" />
            <div className="absolute bottom-7 left-6 right-6 text-center text-white sm:bottom-9">
              <p className="eyebrow text-white/70">
                With full hearts, we invite you
              </p>
              <h1 className="font-display mt-2 text-[40px] leading-[1.03] sm:text-[52px]">
                {coupleNames}
              </h1>
              <p className="mt-3 text-xs font-medium tracking-wide text-white/85">
                {formatWeddingDate(wedding.date)}
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-line bg-paper p-5 sm:p-6">
            {(wedding.headline || wedding.story) && (
              <>
                <p className="eyebrow text-terra">A note for you</p>
                {wedding.headline && (
                  <p className="font-display mt-3 text-[25px] leading-snug">
                    “{wedding.headline}”
                  </p>
                )}
                {wedding.story && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted">
                    {wedding.story}
                  </p>
                )}
              </>
            )}
            <div className="mt-5 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-soft text-pine">
                  <Icon name="calendar" size={16} />
                </span>
                <div>
                  <p className="text-xs font-semibold">
                    {formatWeddingDate(wedding.date)}
                  </p>
                  {wedding.ceremonyTime && (
                    <p className="mt-1 text-[11px] text-muted">
                      Ceremony at {wedding.ceremonyTime}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0e5dc] text-terra">
                  <Icon name="map-pin" size={16} />
                </span>
                <div>
                  {wedding.venue && (
                    <p className="text-xs font-semibold">{wedding.venue}</p>
                  )}
                  {wedding.location && (
                    <p className="mt-1 text-[11px] text-muted">
                      {wedding.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage text-pine">
              <Icon name="mail" size={18} />
            </span>
            <div>
              <p className="eyebrow text-terra">Dear {guestName}</p>
              <h2 className="font-display mt-0.5 text-[26px]">
                You’re on our list.
              </h2>
            </div>
          </div>
          <RsvpForm
            code={code}
            guestName={guestName}
            maxGuests={maxGuests}
            coupleNames={coupleNames}
          />
          <p className="mt-4 text-center text-[10px] leading-5 text-muted">
            Invitation code: {code} · Please don’t share this page publicly.
          </p>
        </div>
      </section>
      <footer className="border-t border-line py-5 text-center text-[10px] text-muted">
        A little home for a very happy day ·{" "}
        <Link href="/" className="font-semibold text-pine">
          Everafter
        </Link>
      </footer>
    </main>
  );
}
