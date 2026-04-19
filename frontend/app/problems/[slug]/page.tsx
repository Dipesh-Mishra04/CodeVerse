"use client";

import { useParams } from "next/navigation";
import { ProblemWorkspace } from "@/components/problems/ProblemWorkspace";

export default function ProblemDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  return <ProblemWorkspace slug={slug} />;
}
