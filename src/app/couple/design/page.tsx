import type { Metadata } from "next";
import { WeddingDesignWorkspace } from "@/components/dashboard/wedding-design-workspace";

export const metadata: Metadata = { title: "Couple Design workspace" };

export default function CoupleDesignPage() {
  return <WeddingDesignWorkspace />;
}
