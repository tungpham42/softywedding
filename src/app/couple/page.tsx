import type { Metadata } from "next";
import { CoupleWorkspace } from "@/components/dashboard/couple-workspace";

export const metadata: Metadata = {
  title: "Couple workspace",
  description: "Couple workspace",
  openGraph: {
    title: "Couple workspace",
    description: "Couple workspace",
    images: [
      {
        url: "/couple.jpg",
      },
    ],
  },
};

export default function CouplePage() {
  return <CoupleWorkspace />;
}
