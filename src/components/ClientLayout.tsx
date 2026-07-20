"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";

const AiChatAssistant = dynamic(() => import("@/components/ai/AiChatAssistant"), { ssr: false });

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AiChatAssistant />
    </>
  );
}
