"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Loader2, Bot, User } from "lucide-react";
import api from "@/services/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/meetings/chat/", { query: input });
      const assistantMessage: Message = { role: "assistant", content: res.data.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-zinc-800">
        <MessageSquare className="h-5 w-5 text-zinc-400" />
        <h3 className="text-sm font-semibold text-zinc-100">Meeting Chat</h3>
        <span className="text-xs text-zinc-500 ml-auto">Ask anything about your meetings</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-sm gap-2">
            <Bot className="h-10 w-10 text-zinc-700" />
            <p>Ask a question about your meetings</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="h-4 w-4 text-zinc-400" />
              </div>
            )}
            <div
              className={`rounded-xl px-4 py-2.5 text-sm max-w-[80%] ${
                msg.role === "user"
                  ? "bg-zinc-100 text-zinc-900"
                  : "bg-zinc-800 text-zinc-200"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="h-7 w-7 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="h-4 w-4 text-zinc-300" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="bg-zinc-800 rounded-xl px-4 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about your meetings..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
