import type { Metadata } from "next";
import { WeddingDesignWorkspace } from "@/components/dashboard/wedding-design-workspace";

export const metadata: Metadata = {
  title: "Couple Design workspace",
  description: "Couple Design workspace",
  openGraph: {
    title: "Couple Design workspace",
    description: "Couple Design workspace",
    images: [
      {
        url: "/couple-design.jpg",
      },
    ],
  },
};

export default function CoupleDesignPage() {
  return <WeddingDesignWorkspace />;
}
