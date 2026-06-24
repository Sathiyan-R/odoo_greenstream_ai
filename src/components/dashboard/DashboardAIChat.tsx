import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Trash2, Sparkles } from "lucide-react";
import { useAIChat } from "@/hooks/useAIChat";
import type { DashboardState } from "@/lib/api";
import ReactMarkdown from "react-markdown";

const SUGGESTIONS = [
  "Why did emissions increase?",
  "What will happen tomorrow?",
  "Is there abnormal activity?",
  "Give sustainability suggestions.",
];

const DashboardAIChat = ({ dashboardState }: { dashboardState: DashboardState }) => {
  const { messages, isLoading, send, clear } = useAIChat(dashboardState);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    send(input.trim());
    setInput("");
  };

  return (
    <div className="glass-panel glow-blue flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-heading font-semibold">AI Assistant</p>
            <p className="text-[10px] text-primary">● Live — Analyzing dashboard data</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clear} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
            <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <Sparkles className="w-8 h-8 text-secondary/40" />
            <p className="text-sm text-muted-foreground text-center">Ask about energy, emissions, or anomalies</p>
            <div className="flex flex-wrap gap-2 justify-center max-w-sm">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-secondary/40 hover:text-secondary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${m.role === "user" ? "" : ""}`}
            >
              <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${m.role === "user" ? "bg-muted" : "bg-secondary/10"
                }`}>
                {m.role === "user" ? (
                  <User className="w-3 h-3 text-muted-foreground" />
                ) : (
                  <Bot className="w-3 h-3 text-secondary" />
                )}
              </div>
              <div className={`rounded-xl px-3 py-2 max-w-[85%] text-sm ${m.role === "user"
                  ? "bg-muted/50 rounded-tl-sm"
                  : "bg-secondary/5 border border-secondary/10 rounded-tl-sm"
                }`}>
                {m.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{m.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-md bg-secondary/10 flex items-center justify-center shrink-0">
              <Bot className="w-3 h-3 text-secondary" />
            </div>
            <div className="flex gap-1 px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about energy, emissions..."
          className="flex-1 bg-muted/30 rounded-lg px-3 py-2 text-sm outline-none border border-border focus:border-secondary/40 transition-colors"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors disabled:opacity-40"
        >
          <Send className="w-4 h-4 text-secondary" />
        </button>
      </div>
    </div>
  );
};

export default DashboardAIChat;
