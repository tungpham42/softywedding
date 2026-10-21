import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Softy — Make room for the magic",
    template: "%s | Softy",
  },
  description:
    "A thoughtful wedding planning platform for planners, couples, and the people celebrating with them.",
  applicationName: "Softy",
  openGraph: {
    title: "Softy — Make room for the magic",
    description: "Plan the details. Share the joy. Keep the moments.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f5ef",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
