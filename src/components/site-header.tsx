"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";

const navItems = [
  { label: "For planners", href: "/planner" },
  { label: "For couples", href: "/couple" },
  { label: "For guests", href: "/guest" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container-wide flex h-[76px] items-center justify-between gap-5">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label="Softy home"
          onClick={() => setMenuOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-pine text-cream shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <Icon name="flower" size={21} />
          </span>
          <span className="font-display text-[29px] leading-none tracking-[-.055em]">
            Softy<span className="text-terra">Wedding</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 rounded-full border border-line/80 bg-paper/65 p-1.5 md:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2.5 text-[12px] font-semibold text-muted transition-colors hover:bg-white hover:text-pine"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/login"
            className="text-[13px] font-semibold text-ink transition-colors hover:text-terra"
          >
            Log in
          </Link>
          <Link
            href="/couple"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-pine px-5 text-[12px] font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-pine-dark hover:shadow-md"
          >
            Start planning <Icon name="arrow-right" size={15} />
          </Link>
        </div>

        <button
          type="button"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink md:hidden"
        >
          <Icon name={menuOpen ? "close" : "menu"} size={20} />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute inset-x-0 top-full border-b border-line bg-paper px-5 pb-5 pt-2 shadow-lg md:hidden">
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-line/70 py-4 text-sm font-semibold text-ink"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-5">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold"
              >
                Log in
              </Link>
              <Link
                href="/couple"
                onClick={() => setMenuOpen(false)}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-pine px-4 text-sm font-semibold text-white"
              >
                Start planning <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
