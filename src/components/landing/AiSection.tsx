"use client";

import AiContentGenerator from "@/components/ai/AiContentGenerator";

export default function AiSection() {
  return (
    <section id="ai-features" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">AI-Powered</span>
          <h2 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">Smart Features Powered by AI</h2>
          <p className="mt-3 text-lg text-zinc-500">Leverage Google Gemini AI for smarter farm management</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <AiContentGenerator />
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xl">{"\uD83E\uDD16"}</span>
              <h3 className="text-lg font-semibold text-zinc-900">AI Chat Assistant</h3>
            </div>
            <p className="text-sm text-zinc-500">Get instant answers about cow health, breeding, feeding schedules, and farm management. Our AI assistant is trained specifically for Bangladeshi livestock farming.</p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600">
              <li className="flex items-start gap-2"><span className="mt-0.5 text-emerald-500">{"\u2713"}</span> Ask about cow diseases and treatments</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-emerald-500">{"\u2713"}</span> Get feeding and nutrition advice</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-emerald-500">{"\u2713"}</span> Learn about breeding cycles and calving</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-emerald-500">{"\u2713"}</span> Calculate costs and estimate profits</li>
            </ul>
            <p className="mt-4 text-sm text-zinc-400 italic">Click the AI button in the bottom-right corner to start chatting!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
