import type { Metadata } from "next";
import { PlannerWorkspace } from "@/components/dashboard/planner-workspace";

export const metadata: Metadata = { title: "Planner workspace" };

export default function PlannerPage() {
  return <PlannerWorkspace />;
}
