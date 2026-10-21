import type { Metadata } from "next";
import { CoupleWorkspace } from "@/components/dashboard/couple-workspace";

export const metadata: Metadata = { title: "Couple workspace" };

export default function CouplePage() {
  return <CoupleWorkspace />;
}
