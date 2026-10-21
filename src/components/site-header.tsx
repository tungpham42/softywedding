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
    <header className="relative z-40 border-b border-line/80 bg-cream/95 backdrop-blur">
      <div className="container-wide flex h-[78px] items-center justify-between gap-5">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="Everafter home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pine text-cream transition-transform group-hover:rotate-[-8deg]">
            <Icon name="flower" size={20} />
          </span>
          <span className="font-display text-[26px] leading-none">
            Softy<span className="text-terra">Wedding</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium text-muted transition-colors hover:text-pine"
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
            className="inline-flex h-11 items-center gap-2 rounded-full bg-pine px-5 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-pine-dark"
          >
            Start planning <Icon name="arrow-right" size={16} />
          </Link>
        </div>

        <button
          type="button"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink md:hidden"
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
                className="border-b border-line/70 py-4 text-sm font-medium"
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
