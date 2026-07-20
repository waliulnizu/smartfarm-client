"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/services/api";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function AiChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello! I'm SmartKhamar AI. Ask me anything about cow farming, health, breeding, or farm management!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);
    try {
      const history = messages.slice(1).map((m) => ({ role: m.role, text: m.text }));
      const { data } = await api.post("/ai/chat", { message: userMsg, history });
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-emerald-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{"\uD83E\uDD16"}</span>
              <span className="font-semibold text-white">SmartKhamar AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-800"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-zinc-100 px-4 py-2.5 text-sm text-zinc-500">
                  <span className="inline-flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-zinc-200 p-3">
            <input
              type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about cow farming..."
              className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="rounded-xl bg-emerald-600 p-2.5 text-white hover:bg-emerald-700 disabled:opacity-40">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" /></svg>
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-2xl text-white shadow-lg transition hover:bg-emerald-700 hover:scale-105"
      >
        {isOpen ? "\u2716" : "\uD83E\uDD16"}
      </button>
    </>
  );
}
