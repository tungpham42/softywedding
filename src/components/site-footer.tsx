import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#2d3d30] text-white">
      <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/[.09]" />
      <div className="pointer-events-none absolute -right-4 -top-12 h-48 w-48 rounded-full border border-white/[.08]" />
      <div className="container-wide relative grid gap-10 py-12 md:grid-cols-[1.5fr_.8fr_.8fr_1.1fr] md:gap-12 md:py-16">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[15px] border border-white/20 bg-white/[.06] text-[#f0d2c2]">
              <Icon name="flower" size={20} />
            </span>
            <span className="font-display text-[29px] tracking-[-.055em]">
              Softy<span className="text-[#e3a58b]">Wedding</span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-7 text-white/65">
            A little less planning stress. A lot more room for the moments that
            matter.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-white/45">
            <Icon name="heart" size={13} /> Made for your kind of forever
          </div>
        </div>
        <div>
          <p className="eyebrow text-white/45">Your corner</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            <Link
              href="/planner"
              className="transition-colors hover:text-white"
            >
              Wedding planners
            </Link>
            <Link href="/couple" className="transition-colors hover:text-white">
              Couples
            </Link>
            <Link href="/guest" className="transition-colors hover:text-white">
              Wedding guests
            </Link>
          </div>
        </div>
        <div>
          <p className="eyebrow text-white/45">Explore</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            <Link href="/login" className="transition-colors hover:text-white">
              Your account
            </Link>
            <Link href="/couple" className="transition-colors hover:text-white">
              Wedding workspace
            </Link>
            <Link href="/guest" className="transition-colors hover:text-white">
              Find an invitation
            </Link>
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="transition-colors hover:text-white"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-white/[.05] p-5">
          <p className="font-display text-[25px] leading-tight">
            The day is yours.
            <br />
            <span className="italic text-[#e8baa6]">
              We’ll help with the details.
            </span>
          </p>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Create a calm home for your plans, your people, and the little
            things that make it personal.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#e8baa6]"
          >
            Get started <Icon name="arrow-up-right" size={15} />
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col justify-between gap-2 py-5 text-[11px] text-white/40 sm:flex-row">
          <span>
            © {new Date().getFullYear()} Softy. All the best things, together.
          </span>
          <span>Made with care, for your once-upon-a-time.</span>
        </div>
      </div>
    </footer>
  );
}
