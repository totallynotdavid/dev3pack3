"use client";

import { useState, useRef, useEffect, type KeyboardEvent, type FormEvent, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL: Message[] = [
  {
    id: "init",
    role: "assistant",
    content:
      "Hi, I'm Sentinel AI. I can help you analyze contracts, assess risk profiles, and find the best investment opportunities. What would you like to know?",
  },
];

const QUICK_QUESTIONS = [
  "Lowest risk contracts?",
  "Average yield today?",
  "How does escrow work?",
];

function mockResponse(msg: string): string {
  const q = msg.toLowerCase();
  if (q.includes("risk") || q.includes("safe") || q.includes("low"))
    return "Category A contracts (federal ministries with zero default history) are your safest choice. They yield ~6.1% annualized — modest, but escrow-protected and typically settled within 30 days.";
  if (q.includes("yield") || q.includes("return") || q.includes("average"))
    return "Current weighted average yield across active contracts: 8.2% annualized. Category A averages 6.1%, B sits at 9.4%, C reaches 14.3%. Higher yield always carries higher settlement risk.";
  if (q.includes("escrow") || q.includes("work") || q.includes("how"))
    return "Sentinel holds all funds in escrow until the government entity confirms payment. Once you open an offer, capital is locked until the debtor settles. This eliminates counterparty risk on both sides.";
  if (q.includes("best") || q.includes("recommend"))
    return "For balanced exposure: 60% in Category A federal contracts, 30% in Category B provincial contracts, 10% in Category C. Blended yield ~8.5% with manageable risk.";
  if (q.includes("government") || q.includes("debtor"))
    return "All debtors in Sentinel are verified government entities — ministries, provinces, or municipalities with active payment obligations. We verify each contract against official records before listing.";
  return "Based on current marketplace data, I recommend focusing on government receivables with maturities under 60 days and A or B risk ratings. They offer the best risk-adjusted returns in the current cycle.";
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function send(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setTimeout(() => {
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: mockResponse(text),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 750 + Math.random() * 400);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function handleInput(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 80)}px`;
  }

  const showQuickQuestions = messages.length === 1 && !loading;

  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              className="h-4 w-4"
              aria-hidden
            >
              <path
                d="M14.856 2.871c.4-.93-.604-1.747-1.42-1.155a37 37 0 0 0-9.014 9.642C3.756 12.67 4.604 14 6 14h4.5l-1.356 7.129c-.4.93.605 1.747 1.42 1.155a37 37 0 0 0 9.014-9.642C20.244 11.33 19.396 10 18 10h-4.5l1.356-7.129Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold leading-none text-foreground">
              Sentinel AI
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Investment advisor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="text-[11px] font-medium text-muted-foreground">
            Online
          </span>
        </div>
      </div>

      {/* ── Messages ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2.5",
                msg.role === "user" ? "flex-row-reverse" : "flex-row",
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[10px] font-bold tracking-widest",
                  msg.role === "assistant"
                    ? "bg-foreground text-white"
                    : "bg-brand text-white",
                )}
                aria-hidden
              >
                {msg.role === "assistant" ? "S" : "U"}
              </div>
              <div
                className={cn(
                  "max-w-[78%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
                  msg.role === "assistant"
                    ? "rounded-tl-xs bg-muted text-foreground"
                    : "rounded-tr-xs bg-foreground text-white",
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-foreground text-[10px] font-bold tracking-widest text-white">
                S
              </div>
              <div className="flex items-center gap-1 rounded-lg rounded-tl-xs bg-muted px-3.5 py-3">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Quick questions ─────────────────────────────────── */}
      {showQuickQuestions && (
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="rounded-full border border-border-strong bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-150 hover:border-foreground hover:bg-muted"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* ── Input ───────────────────────────────────────────── */}
      <div className="border-t border-border p-3">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKey}
            placeholder="Ask about contracts, risk, yields…"
            rows={1}
            className="flex-1 resize-none rounded-md border border-border-strong bg-background px-3 py-2.5 text-sm leading-snug text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus:border-foreground focus:outline-none"
            style={{ maxHeight: 80 }}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-brand text-white transition-colors duration-150 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M22 2L15 22L11 13L2 9L22 2Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Sentinel AI · For informational purposes only
        </p>
      </div>
    </div>
  );
}
