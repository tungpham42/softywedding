import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type LegalPageProps = {
  title: string;
  description: string;
  updatedAt?: string;
  children: ReactNode;
};

export function LegalPage({
  title,
  description,
  updatedAt = "October 21, 2026",
  children,
}: LegalPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[60vh] pb-16 pt-8 sm:pb-24 sm:pt-12">
        <div className="container-wide max-w-5xl">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-xs text-muted"
          >
            <Link href="/" className="transition-colors hover:text-terra">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{title}</span>
          </nav>

          <header className="relative mb-8 overflow-hidden rounded-[28px] border border-line bg-paper px-6 py-9 shadow-sm sm:px-10 sm:py-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border border-[#e8ddd2] sm:h-64 sm:w-64"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-2 -top-5 h-32 w-32 rounded-full border border-[#e8ddd2]/80 sm:h-44 sm:w-44"
            />
            <div className="relative max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-[#e6d5c8] bg-[#f5e7dd] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-terra">
                Softy Wedding · Legal
              </span>
              <h1 className="font-display mt-5 text-4xl leading-[1.03] tracking-[-.045em] sm:text-6xl">
                {title}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base sm:leading-8">
                {description}
              </p>
              <p className="mt-5 text-xs font-semibold text-muted">
                Last updated: {updatedAt}
              </p>
            </div>
          </header>

          <article className="editorial-card space-y-8 px-6 py-8 sm:px-10 sm:py-10">
            {children}
          </article>

          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-line bg-white/55 p-5 text-sm leading-6 text-muted sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p>
              Questions about this page? Contact the Softy Wedding service
              operator using the contact details made available for this
              deployment.
            </p>
            <Link
              href="/"
              className="inline-flex shrink-0 items-center font-semibold text-pine transition-colors hover:text-terra"
            >
              Back to Softy Wedding <span className="ml-2" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-line pb-8 last:border-b-0 last:pb-0">
      <h2 className="font-display text-2xl leading-tight tracking-[-.025em] sm:text-[28px]">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-muted sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}

export const legalListClassName =
  "list-disc space-y-2 pl-5 marker:text-terra";
