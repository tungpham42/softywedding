import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function SiteFooter() {
  return (
    <footer className="bg-pine-dark text-white">
      <div className="container-wide grid gap-12 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:py-16">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25">
              <Icon name="flower" size={19} />
            </span>
            <span className="font-display text-[27px]">
              Softy<span className="text-[#d89b83]">Wedding</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">
            A little less planning stress. A lot more room for the moments that
            matter.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[.16em] text-white/50">
            <Icon name="heart" size={13} /> Made for your kind of forever
          </div>
        </div>
        <div>
          <p className="eyebrow text-white/45">The platform</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            <Link href="/planner" className="hover:text-white">
              Wedding planners
            </Link>
            <Link href="/couple" className="hover:text-white">
              Couples
            </Link>
            <Link href="/guest" className="hover:text-white">
              Wedding guests
            </Link>
          </div>
        </div>
        <div>
          <p className="eyebrow text-white/45">Explore</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            <Link href="/login" className="hover:text-white">
              Your account
            </Link>
            <Link href="/couple" className="hover:text-white">
              Wedding workspace
            </Link>
          </div>
        </div>
        <div>
          <p className="eyebrow text-white/45">Begin here</p>
          <p className="mt-4 text-sm leading-6 text-white/65">
            Create a wedding workspace, organize your plans, and bring your
            guests into the celebration.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#e3b6a4]"
          >
            Get started <Icon name="arrow-up-right" size={15} />
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col justify-between gap-2 py-5 text-[11px] text-white/45 sm:flex-row">
          <span>
            © {new Date().getFullYear()} Everafter. All the best things,
            together.
          </span>
          <span>Made with care, for your once-upon-a-time.</span>
        </div>
      </div>
    </footer>
  );
}
