import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminDb } from "@/lib/firebase/admin";
import {
  readString,
  readWeddingSchedule,
  type WeddingScheduleItem,
} from "@/lib/wedding";
import { formatWeddingDate } from "@/lib/utils";
import { SiteFooter } from "@/components/site-footer";
import { Icon } from "@/components/ui/icon";

export const dynamic = "force-dynamic";

type PublicWedding = {
  slug: string;
  partnerOne: string;
  partnerTwo: string;
  headline: string;
  date: string;
  venue: string;
  location: string;
  ceremonyTime: string;
  story: string;
  heroImage: string;
  schedule: WeddingScheduleItem[];
};

async function getWedding(slug: string): Promise<PublicWedding | null> {
  const db = getAdminDb();
  if (!db) return null;
  const snap = await db.collection("weddings").doc(slug).get();
  if (!snap.exists) return null;
  const data = snap.data() ?? {};
  if (data.published !== true) return null;
  return {
    slug,
    partnerOne: readString(data.partnerOne),
    partnerTwo: readString(data.partnerTwo),
    headline: readString(data.headline),
    date: readString(data.date),
    venue: readString(data.venue),
    location: readString(data.location),
    ceremonyTime: readString(data.ceremonyTime),
    story: readString(data.story),
    heroImage: readString(data.heroImage),
    schedule: readWeddingSchedule(data.schedule),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const wedding = await getWedding(slug);
  return wedding
    ? {
        title: `${wedding.partnerOne} & ${wedding.partnerTwo} — Wedding website`,
        description:
          wedding.headline ||
          `Wedding details for ${wedding.partnerOne} and ${wedding.partnerTwo}.`,
      }
    : { title: "Wedding website not found" };
}

export default async function WeddingWebsitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const wedding = await getWedding(slug);
  if (!wedding || !wedding.partnerOne || !wedding.partnerTwo || !wedding.date)
    notFound();
  const names = `${wedding.partnerOne} & ${wedding.partnerTwo}`;
  const hasVenue = Boolean(
    wedding.venue || wedding.location || wedding.ceremonyTime,
  );

  return (
    <main className="bg-[#fbf8f2]">
      <header className="absolute inset-x-0 top-0 z-10 flex h-[72px] items-center justify-between px-5 text-white sm:px-9">
        <Link href="/" className="font-display text-[24px]">
          Softy<span className="text-[#e8b8a3]">Wedding</span>
        </Link>
        <Link
          href="/guest"
          className="inline-flex h-9 items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 text-xs font-semibold backdrop-blur hover:bg-white/20"
        >
          Guest details <Icon name="arrow-up-right" size={14} />
        </Link>
      </header>
      <section
        className={`relative flex min-h-[650px] items-center justify-center overflow-hidden px-5 py-24 text-center text-white sm:min-h-[750px] sm:py-28 ${wedding.heroImage ? "bg-cover bg-center" : "bg-pine"}`}
        style={
          wedding.heroImage
            ? { backgroundImage: `url('${wedding.heroImage}')` }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-[#182e25]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b3529]/65 via-transparent to-[#1b3529]/25" />
        <div className="relative max-w-[820px]">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/35 text-[#efd0c1]">
            <Icon name="flower" size={23} />
          </span>
          <p className="eyebrow mt-6 text-white/70">
            Together with our favorite people
          </p>
          <h1 className="font-display mt-5 text-[62px] leading-[.94] sm:text-[88px] lg:text-[104px]">
            {wedding.partnerOne}
            <br />
            <span className="italic text-[#edc6b5]">&</span>{" "}
            {wedding.partnerTwo}
          </h1>
          <div className="mx-auto my-7 h-px w-24 bg-white/50" />
          <p className="text-sm font-medium tracking-[.13em] text-white/85 sm:text-base">
            {formatWeddingDate(wedding.date)}
          </p>
          {hasVenue && (
            <p className="mt-2 text-xs tracking-wide text-white/70">
              {[wedding.venue, wedding.location].filter(Boolean).join(" · ")}
            </p>
          )}
          {wedding.schedule.length > 0 && (
            <a
              href="#our-day"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#fbf8f2] px-6 text-sm font-semibold text-pine transition-colors hover:bg-white"
            >
              Our day, together <Icon name="arrow-right" size={16} />
            </a>
          )}
        </div>
      </section>

      {(wedding.headline || wedding.story) && (
        <section className="px-5 py-20 text-center sm:py-28">
          <div className="mx-auto max-w-[700px]">
            <p className="eyebrow text-terra">A note from us</p>
            {wedding.headline && (
              <h2 className="font-display mt-4 text-[42px] leading-tight sm:text-[58px]">
                {wedding.headline}
              </h2>
            )}
            {wedding.story && (
              <p className="mx-auto mt-6 max-w-[560px] whitespace-pre-line text-sm leading-7 text-muted sm:text-base">
                {wedding.story}
              </p>
            )}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold text-pine">
              <Icon name="heart" size={15} /> We can’t wait to celebrate with
              you.
            </div>
          </div>
        </section>
      )}

      {wedding.schedule.length > 0 && (
        <section id="our-day" className="bg-[#ebece3] px-5 py-20 sm:py-24">
          <div className="mx-auto max-w-[1000px]">
            <div className="text-center">
              <p className="eyebrow text-terra">The day at a glance</p>
              <h2 className="font-display mt-3 text-[42px] sm:text-[54px]">
                Here’s how it unfolds.
              </h2>
              <p className="mt-3 text-sm text-muted">
                The details shared by the hosts.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {wedding.schedule.map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="flex gap-4 rounded-2xl border border-white/75 bg-paper p-5 sm:p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-soft font-display text-lg text-pine">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    {item.time && (
                      <p className="text-[10px] font-bold uppercase tracking-[.15em] text-terra">
                        {item.time}
                      </p>
                    )}
                    <h3 className="font-display mt-1 text-[24px]">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted">
                        {item.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasVenue && (
        <section className="px-5 py-20 sm:py-28">
          <div className="mx-auto grid max-w-[980px] items-center gap-10 md:grid-cols-[.95fr_1.05fr]">
            <div
              className={`relative min-h-[300px] overflow-hidden rounded-t-[42%] rounded-b-2xl sm:min-h-[400px] ${wedding.heroImage ? "bg-cover bg-center" : "bg-sage"}`}
              style={
                wedding.heroImage
                  ? { backgroundImage: `url('${wedding.heroImage}')` }
                  : undefined
              }
            />
            <div>
              <p className="eyebrow text-terra">Meet us there</p>
              <h2 className="font-display mt-3 text-[42px] leading-tight sm:text-[53px]">
                A place we love.
                <br />
                <span className="italic text-pine">With people we love.</span>
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted">
                The location and timing shared by the hosts.
              </p>
              <div className="mt-6 rounded-2xl border border-line bg-paper p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-soft text-pine">
                    <Icon name="map-pin" size={18} />
                  </span>
                  <div>
                    {wedding.venue && (
                      <p className="text-sm font-semibold">{wedding.venue}</p>
                    )}
                    {wedding.location && (
                      <p className="mt-1 text-xs text-muted">
                        {wedding.location}
                      </p>
                    )}
                    {wedding.ceremonyTime && (
                      <p className="mt-2 text-xs text-muted">
                        Ceremony begins at {wedding.ceremonyTime}.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-5 pb-20 sm:pb-28">
        <div className="mx-auto max-w-[860px] rounded-[26px] bg-pine px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <p className="eyebrow text-white/55">Save the date</p>
          <h2 className="font-display mt-4 text-[42px] leading-tight sm:text-[58px]">
            See you on the dance floor.
          </h2>
          <p className="mt-4 text-sm text-white/70">
            {formatWeddingDate(wedding.date)}
            {wedding.venue ? ` · ${wedding.venue}` : ""}
          </p>
          <Link
            href="/guest"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-paper px-6 text-sm font-semibold text-pine hover:bg-[#f0e7da]"
          >
            Find your invitation <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
