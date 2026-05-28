"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Trash2, ArrowRight } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
}

export default function ChatTab() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hello! I am your Antigravity AI companion. How can I help you construct or document your project today?",
      timestamp: new Date(Date.now() - 60000 * 5),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(Math.random().toString(36).substring(7));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const promptText = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionId.current,
          chatInput: promptText,
        }),
      });

if (!response.ok) {
  // Handle non-OK response gracefully
  const errorMsg = `Network error: ${response.status} ${response.statusText}`;
  setIsTyping(false);
  setMessages((prev) => [
    ...prev,
    {
      id: Math.random().toString(),
      sender: "bot",
      text: errorMsg,
      timestamp: new Date(),
    },
  ]);
  return; // exit early on error
}

let replyText = "Message received successfully.";
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (typeof data === 'string') {
          replyText = data;
        } else if (Array.isArray(data) && data.length > 0) {
           const first = data[0];
           replyText = first.output || first.text || first.message || first.response || JSON.stringify(first);
        } else if (typeof data === 'object') {
          replyText = data.output || data.text || data.message || data.response || JSON.stringify(data);
        }
      } else {
        replyText = await response.text();
      }

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "bot",
          text: replyText,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error calling webhook:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "bot",
          text: "Sorry, I encountered an error communicating with the server.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "default",
        sender: "bot",
        text: "Conversation cleared. Ready for a new discussion!",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col rounded-xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-200/80 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-md shadow-indigo-500/20">
            <Bot className="h-5 w-5" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-900"></span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              Antigravity Assistant <Sparkles className="h-3.5 w-3.5 fill-amber-400 text-amber-400 animate-pulse" />
            </h3>
            <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">AI Companion • Online</p>
          </div>
        </div>
        
        <button
          onClick={handleClear}
          title="Clear Conversation"
          className="p-2 rounded-lg text-zinc-400 hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-zinc-50/30 dark:bg-zinc-950/20">
        {messages.map((message) => {
          const isBot = message.sender === "bot";
          return (
            <div
              key={message.id}
              className={`flex gap-3 max-w-[85%] ${
                isBot ? "self-start" : "self-end flex-row-reverse ml-auto"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg shadow-sm text-xs font-semibold ${
                  isBot
                    ? "bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                    : "bg-indigo-600 text-white"
                }`}
              >
                {isBot ? <Bot className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
              </div>
              
              <div
                className={`relative rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all ${
                  isBot
                    ? "bg-white border border-zinc-200/60 text-zinc-800 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
                    : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                }`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
                <span
                  className={`block text-[9px] mt-1.5 font-medium ${
                    isBot ? "text-zinc-400" : "text-white/60"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-[80%] self-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300">
              <Bot className="h-4.5 w-4.5" />
            </div>
            <div className="bg-white border border-zinc-200/60 rounded-2xl px-4 py-3 flex items-center gap-1.5 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
              <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce duration-1000"></span>
              <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s] duration-1000"></span>
              <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s] duration-1000"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-zinc-200/80 p-4 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message or ask a question..."
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-400"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/10 transition-all hover:bg-indigo-500 hover:scale-[1.04] active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
