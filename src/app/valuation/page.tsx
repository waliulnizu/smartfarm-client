"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OldValuationPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard/valuation"); }, [router]);
  return null;
}
