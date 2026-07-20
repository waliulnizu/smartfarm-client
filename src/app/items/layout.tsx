import { Suspense } from "react";

export default function ItemsLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-zinc-50" />}>{children}</Suspense>;
}
