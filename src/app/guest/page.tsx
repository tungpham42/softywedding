import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GuestCodeLookup } from "@/components/dashboard/guest-code-lookup";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = { title: "Find your wedding invitation" };

export default function GuestPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-wide grid min-h-[650px] items-center gap-12 py-12 sm:py-16 lg:grid-cols-[.9fr_1.1fr] lg:gap-16 lg:py-20">
        <div className="mx-auto w-full max-w-[500px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.14em] text-pine"><Icon name="mail" size={14} className="text-terra" /> A little note just for you</span>
          <p className="eyebrow mt-8 text-terra">You’re on the guest list</p>
          <h1 className="font-display display-balance mt-4 text-[48px] leading-[.99] sm:text-[63px]">The details are here.<br /><span className="italic text-pine">The joy is yours.</span></h1>
          <p className="mt-5 max-w-[440px] text-sm leading-7 text-muted sm:text-base">Your invitation is the key to the celebration. Enter the code from your email or message to find the schedule, share your RSVP, and get ready to be part of the day.</p>
          <GuestCodeLookup />
          <div className="mt-7 flex items-start gap-3.5 rounded-[20px] border border-[#e7d7c9] bg-[#f3e5db]/70 p-4 sm:p-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-paper text-terra"><Icon name="shield" size={18}/></span><div><p className="text-[13px] font-bold">Your reply stays with the hosts.</p><p className="mt-1 text-xs leading-5 text-muted">Invitation codes connect you to the right event. Keep yours private, and let the hosts know if you need help.</p></div></div>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-medium text-muted"><span className="inline-flex items-center gap-1.5"><Icon name="calendar" size={14} className="text-pine"/> When</span><span className="inline-flex items-center gap-1.5"><Icon name="map-pin" size={14} className="text-pine"/> Where</span><span className="inline-flex items-center gap-1.5"><Icon name="check-circle" size={14} className="text-pine"/> RSVP</span></div>
        </div>

        <div className="relative mx-auto w-full max-w-[590px]">
          <div className="absolute -left-4 -top-5 h-32 w-32 rounded-full border border-[#d8c6b6] sm:-left-6 sm:-top-7 sm:h-40 sm:w-40"/>
          <div className="relative h-[420px] overflow-hidden rounded-t-[43%] rounded-b-[22px] bg-sage shadow-[0_24px_65px_rgba(63,47,35,.16)] sm:h-[555px]">
            <div className="image-hover absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=90')" }}/>
            <div className="photo-wash absolute inset-0"/>
            <div className="absolute left-6 top-6 rounded-full border border-white/35 bg-white/15 px-3 py-2 text-[9px] font-bold uppercase tracking-[.16em] text-white backdrop-blur sm:left-8 sm:top-8 sm:text-[10px]">A day with your favorite people</div>
            <div className="absolute bottom-8 left-6 right-6 text-white sm:bottom-10 sm:left-9 sm:right-9"><p className="eyebrow text-white/70">Show up. Feel everything.</p><p className="font-display mt-3 text-[39px] leading-[1.02] sm:text-[51px]">Be there for<br /><span className="italic text-[#f0cbb9]">the happy bits.</span></p></div>
          </div>
          <div className="surface-shadow absolute -bottom-6 right-0 rounded-[20px] border border-white bg-paper p-4 sm:right-[-18px] sm:p-5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-sage-soft text-pine"><Icon name="mail" size={18}/></span><div><p className="font-display text-[20px]">Good news, all in one place</p><p className="mt-1 text-[10px] text-muted">When · Where · What to know · RSVP</p></div></div></div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
