"use client";

import { useState, useRef, useEffect, type KeyboardEvent, type FormEvent, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

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
      "Hola, soy FactorBridge AI. Puedo ayudarte a validar RUCs, evaluar riesgos crediticios, analizar facturas y conectarte con factores. ¿En qué puedo ayudarte?",
  },
];

const QUICK_QUESTIONS = [
  "¿Qué contratos de bajo riesgo hay?",
  "Evalúa el RUC 20512345678",
  "¿Cómo funciona el factoraje?",
];

async function queryAgent(message: string, sessionId: string): Promise<string> {
  try {
    // Use Next.js API route as proxy to avoid CORS issues
    console.log("Querying agent via proxy...");
    const response = await fetch("/api/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        message: message,
        session_id: sessionId,
        user_id: "marketplace-user"
      }),
    });

    console.log("Agent response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Agent error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Agent response data:", data);
    return data.response || "Lo siento, no pude procesar tu consulta.";
  } catch (error) {
    console.error("Error querying agent:", error);
    return "Lo siento, hubo un error al conectar con el agente. Por favor intenta nuevamente.";
  }
}

export function Chatbot() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Generate a unique session ID for this user's chatbot session
    const newSessionId = user?.id
      ? `user-${user.id}-${Date.now()}`
      : `anon-${Date.now()}`;
    setSessionId(newSessionId);
  }, [user?.id]);

  async function send(text: string) {
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

    try {
      const response = await queryAgent(text.trim(), sessionId);
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: "Lo siento, hubo un error. Por favor intenta nuevamente.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
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
    <div className="flex h-[480px] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card sm:h-[540px] lg:h-[600px]">
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
