import type { Metadata } from "next";
import { PlannerWorkspace } from "@/components/dashboard/planner-workspace";

export const metadata: Metadata = {
  title: "Planner workspace",
  description: "Planner workspace",
  openGraph: {
    title: "Planner workspace",
    description: "Planner workspace",
    images: [
      {
        url: "/planner.jpg",
      },
    ],
  },
};

export default function PlannerPage() {
  return <PlannerWorkspace />;
}
