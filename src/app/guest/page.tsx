import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GuestCodeLookup } from "@/components/dashboard/guest-code-lookup";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = { title: "Find your wedding invitation" };

export default function GuestPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-wide grid min-h-[620px] items-center gap-10 py-12 lg:grid-cols-[1fr_.92fr] lg:gap-20 lg:py-16">
        <div className="mx-auto w-full max-w-[510px]">
          <p className="eyebrow text-terra">You’re on the guest list</p>
          <h1 className="font-display mt-4 text-[47px] leading-[1.02] sm:text-[62px]">The details are here.<br /><span className="italic text-pine">The joy is yours.</span></h1>
          <p className="mt-5 max-w-[450px] text-sm leading-7 text-muted sm:text-base">Enter the invitation code from your email or message to find the wedding details, share your RSVP, and get ready to celebrate.</p>
          <GuestCodeLookup />
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-line bg-paper p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-soft text-pine"><Icon name="shield" size={17}/></span><div><p className="text-sm font-semibold">Your response stays with the couple.</p><p className="mt-1 text-xs leading-5 text-muted">Invitation codes connect you to the right event. Please keep yours private.</p></div></div>
        </div>
        <div className="relative mx-auto w-full max-w-[530px]">
          <div className="absolute -left-5 -top-5 h-32 w-32 rounded-full border border-[#d8d8c8]"/>
          <div className="relative h-[450px] overflow-hidden rounded-t-[42%] rounded-b-[18px] bg-sage sm:h-[530px]"><div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1100&q=90')" }}/><div className="photo-wash absolute inset-0"/><div className="absolute bottom-8 left-8 right-8 text-white"><p className="eyebrow text-white/70">A day with your favorite people</p><p className="font-display mt-3 text-[38px] leading-tight sm:text-[46px]">Show up.<br />Feel everything.</p></div></div>
          <div className="soft-shadow absolute -bottom-5 right-0 rounded-2xl border border-line bg-paper p-4 sm:right-[-16px] sm:p-5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0e1d8] text-terra"><Icon name="mail" size={18}/></span><div><p className="text-sm font-semibold">Good news, all in one place</p><p className="mt-1 text-xs text-muted">When · Where · What to wear · RSVP</p></div></div></div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
