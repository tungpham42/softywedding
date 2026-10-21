"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Return to the top when navigating to a different route.
 * Keep the initial page load and in-page hash navigation untouched.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    previousPathname.current = pathname;
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}
