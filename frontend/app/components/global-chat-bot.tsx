"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { askCrossMeetingQuestion } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  isError?: boolean;
}

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

export default function GlobalChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInputValue("");
    setIsLoading(false);
  };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMessage: Message = { id: `usr-${messages.length + 1}`, role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const validHistory = messages.filter(m => m.role === "user" || m.role === "assistant").slice(-8).map(m => ({
        role: m.role,
        content: m.content.substring(0, 4000)
      }));

      const { answer } = await askCrossMeetingQuestion(trimmed, validHistory);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: answer }]);
    } catch {
      setMessages((prev) => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: "I'm sorry, I encountered an error while searching your past meetings.",
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open Global Search"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-background shadow-xl hover:shadow-2xl transition-all font-semibold hover:bg-foreground/90 hover:scale-[1.04] active:scale-[0.96]"
          >
            <SearchIcon />
            <span>Search All Meetings</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[430px] h-full sm:h-[620px] max-h-full sm:max-h-[85vh] bg-surface flex flex-col shadow-2xl overflow-hidden border border-card-border sm:rounded-2xl rounded-none"
            >
              <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-card-border bg-surface shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background shadow-sm">
                    <SearchIcon />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">MeetMind Global Search</h3>
                    <p className="text-[11px] text-muted flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Cross-meeting intelligence
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={clearChat}
                    className="rounded-lg p-2 text-muted hover:bg-surface hover:text-foreground transition-colors border border-transparent hover:border-card-border cursor-pointer"
                  >
                    <TrashIcon />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface hover:bg-muted/20 text-foreground border border-card-border hover:border-foreground/30 transition-all shadow-sm active:scale-95 ml-1 cursor-pointer"
                  >
                    <CloseIcon />
                    <span>Close</span>
                  </button>
                </div>
              </div>

            <div className="flex-1 overflow-y-auto p-5 scroll-smooth bg-surface/30">
              <div className="space-y-6">
                
                {messages.length === 0 && (
                  <div className="text-center pt-8 pb-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background mb-4 shadow-sm">
                      <SearchIcon />
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-2">Search Across Meetings</h4>
                    <p className="text-sm text-muted mb-6 px-4">
                      Ask a question about past decisions, people, action items, or topics from any of your recorded meetings.
                    </p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-foreground text-background rounded-tr-sm font-medium"
                          : "bg-surface text-foreground border border-card-border rounded-tl-sm prose prose-sm prose-invert"
                      } ${msg.isError ? "border-red-500/30 bg-red-500/10" : ""}`}
                    >
                      {msg.role === "assistant" ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <span className="whitespace-pre-wrap">{msg.content}</span>
                      )}
                      
                      {msg.isError && (
                        <button 
                          onClick={() => {
                            setMessages(prev => prev.slice(0, -1));
                            handleSend(messages[i-1].content);
                          }}
                          className="mt-3 text-xs font-semibold text-foreground bg-surface hover:bg-background border border-card-border px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Retry
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-surface border border-card-border rounded-2xl rounded-tl-sm px-4 py-4 max-w-[85%] shadow-sm">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted">
                        <span>Searching past meetings</span>
                        <span className="flex gap-1 pt-1">
                          <motion.div className="h-1 w-1 rounded-full bg-muted" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                          <motion.div className="h-1 w-1 rounded-full bg-muted" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                          <motion.div className="h-1 w-1 rounded-full bg-muted" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="p-4 border-t border-card-border bg-surface shrink-0">
              <div className="relative flex items-end rounded-xl border border-card-border bg-surface shadow-inner focus-within:border-foreground/30 transition-colors">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    handleInput();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="E.g., What did we decide about marketing?"
                  className="flex-1 max-h-32 bg-transparent px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:outline-none resize-none"
                  disabled={isLoading}
                  rows={1}
                />
                <button
                  onClick={() => handleSend(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-3 mb-0.5 mr-0.5 text-muted hover:text-foreground disabled:opacity-30 disabled:hover:text-muted transition-colors"
                >
                  <SendIcon />
                </button>
              </div>
              <div className="text-[10px] text-muted text-center mt-2 font-medium">
                MeetMind AI uses summaries, entities, and actions to search across meetings.
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
