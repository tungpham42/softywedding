import type { ReactNode, SVGProps } from "react";

type IconName =
  | "arrow-right" | "arrow-up-right" | "heart" | "calendar" | "users"
  | "check" | "plus" | "menu" | "close" | "sparkles" | "clipboard"
  | "mail" | "camera" | "globe" | "clock" | "map-pin" | "chevron-down"
  | "chevron-right" | "external" | "leaf" | "layout" | "wallet" | "settings"
  | "search" | "check-circle" | "message" | "shield" | "flower" | "party" | "eye-off";

const paths: Record<IconName, ReactNode> = {
  "arrow-right": <><path d="M4.5 12h15"/><path d="m13 5.5 6.5 6.5-6.5 6.5"/></>,
  "arrow-up-right": <><path d="M7 17 17 7"/><path d="M8 7h9v9"/></>,
  heart: <path d="M20.4 4.8a5.4 5.4 0 0 0-7.6 0L12 5.6l-.8-.8a5.4 5.4 0 0 0-7.6 7.6l.8.8L12 20.4l7.6-7.2.8-.8a5.4 5.4 0 0 0 0-7.6Z"/>,
  calendar: <><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M7.5 3v4M16.5 3v4M3.5 9.5h17"/></>,
  users: <><path d="M16 20v-1.5a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4V20"/><circle cx="10" cy="7.5" r="3.5"/><path d="M20 20v-1.5a4 4 0 0 0-3-3.87M15 4.2a3.5 3.5 0 0 1 0 6.7"/></>,
  check: <path d="m5 12 4.2 4.2L19.5 6"/>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  sparkles: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15ZM5 2l.7 1.8L7.5 4.5l-1.8.7L5 7l-.7-1.8-1.8-.7 1.8-.7L5 2Z"/></>,
  clipboard: <><rect x="5" y="4.5" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M8.5 10h7M8.5 14h7M8.5 18h4"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
  camera: <><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10H3V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.2"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3.5 12h17M12 3c2.4 2.5 3.5 5.5 3.5 9s-1.1 6.5-3.5 9c-2.4-2.5-3.5-5.5-3.5-9S9.6 5.5 12 3Z"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>,
  "map-pin": <><path d="M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  "chevron-down": <path d="m6 9 6 6 6-6"/>,
  "chevron-right": <path d="m9 18 6-6-6-6"/>,
  external: <><path d="M13 5h6v6M19 5l-9 9"/><path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></>,
  leaf: <><path d="M20.5 3.5c-9.8-.4-16 4.2-16 10.1a6.9 6.9 0 0 0 7.1 6.9c6.1 0 9.3-7.2 8.9-17Z"/><path d="M3.5 21c3.2-5.5 7.6-9.3 13-12"/></>,
  layout: <><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/></>,
  wallet: <><rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 8h18M16 14h.01"/><path d="M6 5V3h12v2"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.9 1.1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.9-1.1l-1.7.6-1.4-2.4L7 15a8 8 0 0 1 0-2l-1.5-1.1L7 9.5l1.7.6a8 8 0 0 1 1.9-1.1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.9 1.1l1.7-.6 1.4 2.4L19.5 13a8 8 0 0 1-.1 2Z"/></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></>,
  "check-circle": <><circle cx="12" cy="12" r="9"/><path d="m7.5 12 3 3 6-6"/></>,
  message: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.3 8.3 0 0 1-3.4-.7L4 20l1.4-3.6A7 7 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/><path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01"/></>,
  shield: <><path d="M12 21s8-3.8 8-10V5l-8-3-8 3v6c0 6.2 8 10 8 10Z"/><path d="m8.5 11.5 2.2 2.2 4.8-4.8"/></>,
  flower: <><path d="M12 12c-4.5 0-6.5-2.2-6.5-4.7A3.3 3.3 0 0 1 8.8 4c1.4 0 2.6 1 3.2 2.7C12.6 5 13.8 4 15.2 4a3.3 3.3 0 0 1 3.3 3.3C18.5 9.8 16.5 12 12 12Z"/><path d="M12 12c0 4.5-2.2 6.5-4.7 6.5A3.3 3.3 0 0 1 4 15.2c0-1.4 1-2.6 2.7-3.2C5 11.4 4 10.2 4 8.8"/><path d="M12 12c4.5 0 6.5 2.2 6.5 4.7a3.3 3.3 0 0 1-3.3 3.3c-1.4 0-2.6-1-3.2-2.7C11.4 19 10.2 20 8.8 20"/><circle cx="12" cy="12" r="2"/></>,
  party: <><path d="m4 20 7-16 3 8 6 3-16 5Z"/><path d="m15 4 .5-2M20 8l2-.5M18 2l-.5 2"/></>,
  "eye-off": <><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.2 0 8.8 4.2 9.7 6-.4.8-1.5 2.3-3.5 3.6"/><path d="M6.2 6.2C3.9 7.6 2.6 9.6 2.3 11c.9 1.8 4.5 6 9.7 6 1.1 0 2.1-.2 3-.6"/></>,
};

export function Icon({ name, size = 20, className, ...props }: { name: IconName; size?: number; className?: string } & Omit<SVGProps<SVGSVGElement>, "name" | "color">) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
