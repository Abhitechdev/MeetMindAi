"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { askQuestion } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  isError?: boolean;
}

interface ChatBotProps {
  meetingId: string;
  transcript: string;
  summary: string;
  segments?: { speaker?: string; text: string; start: number; end: number }[];
  diarizationUnavailable?: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
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

export default function ChatBot({ meetingId, transcript, summary, segments = [], diarizationUnavailable = false }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Parse structured data safely
  const summaryData = useMemo(() => {
    try {
      return JSON.parse(summary);
    } catch {
      return {};
    }
  }, [summary]);

  const uniqueSpeakers = useMemo(() => {
    if (diarizationUnavailable) return [];
    return Array.from(new Set(segments.filter(s => s.speaker).map(s => s.speaker)));
  }, [segments, diarizationUnavailable]);

  const initialSuggestions = useMemo(() => {
    const suggs: string[] = ["Summarize this meeting"];
    if (summaryData.decisions && summaryData.decisions.length > 0) suggs.push("What decisions were made?");
    if (summaryData.actionItems && summaryData.actionItems.length > 0) suggs.push("What are the action items?");
    if (uniqueSpeakers.length > 0) suggs.push("How many speakers were detected?");
    if (transcript.match(/\b(Monday|Tuesday|Wednesday|Thursday|Friday|tomorrow|next week|\d{1,2}\/\d{1,2})\b/i)) {
      if (suggs.length < 4) suggs.push("What deadlines were mentioned?");
    }
    return suggs.slice(0, 4);
  }, [summaryData, uniqueSpeakers, transcript]);

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
    setCurrentSuggestions(initialSuggestions);
    setInputValue("");
    setIsLoading(false);
  };

  const getFollowUpSuggestions = (userQ: string): string[] => {
    const q = userQ.toLowerCase();
    if (q.includes("action items") || q.includes("tasks")) {
      return ["Who owns these tasks?", "Were deadlines mentioned?", "What are the next steps?"];
    }
    if (q.includes("decisions")) {
      return ["Why were these decisions made?", "Who was involved?", "What actions resulted from them?"];
    }
    if (q.includes("speaker") || q.includes("who spoke")) {
      if (uniqueSpeakers.length > 0) {
        return [`What did ${uniqueSpeakers[0]} discuss?`, "Summarize this meeting", "Were any deadlines mentioned?"];
      }
    }
    return ["What are the next steps?", "What decisions were made?"];
  };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMessage: Message = { id: `usr-${messages.length + 1}`, role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setCurrentSuggestions([]);

    const q = trimmed.toLowerCase();
    
    // Deterministic Routing for conservative queries
    let deterministicAnswer = "";
    
    if (q === "summarize this meeting" || q === "give me the summary") {
      deterministicAnswer = summaryData.executiveSummary || "No summary is available for this meeting.";
    } 
    else if (q === "what are the action items?" || q === "what tasks were assigned?" || q === "are there any action items?") {
      if (summaryData.actionItems && summaryData.actionItems.length > 0) {
        deterministicAnswer = `${summaryData.actionItems.length} action items were identified:\n\n${summaryData.actionItems.map((a: string, i: number) => `${i + 1}. ${a}`).join('\n')}`;
      } else {
        deterministicAnswer = "No action items were identified in this meeting.";
      }
    }
    else if (q === "what decisions were made?" || q === "decisions") {
      if (summaryData.decisions && summaryData.decisions.length > 0) {
        deterministicAnswer = `${summaryData.decisions.length} key decisions were identified:\n\n${summaryData.decisions.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n')}`;
      } else {
        deterministicAnswer = "No key decisions were identified in this meeting.";
      }
    }
    else if (q === "how many speakers" || q === "who spoke" || q === "number of speakers" || q === "speakers in this meeting" || q === "how many speakers were detected?") {
      if (diarizationUnavailable || uniqueSpeakers.length === 0) {
        deterministicAnswer = "Speaker detection wasn't available for this recording, so I can't reliably determine how many people spoke.";
      } else {
        deterministicAnswer = `${uniqueSpeakers.length} speakers were detected.\n\n${uniqueSpeakers.map((s) => `- ${s}`).join('\n')}\n\nTheir identities weren't determined from speaker diarization alone.`;
      }
    }

    if (deterministicAnswer) {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: deterministicAnswer }]);
        setCurrentSuggestions(getFollowUpSuggestions(trimmed));
        setIsLoading(false);
      }, 300);
      return;
    }

    // Semantic backend LLM routing
    try {
      // 1. Prepare history limit (max 8, enforce length)
      const validHistory = messages.filter(m => m.role === "user" || m.role === "assistant").slice(-8).map(m => ({
        role: m.role,
        content: m.content.substring(0, 4000)
      }));

      // 2. Format transcript with speakers AND timestamps for strict grounding
      let chatTranscript = transcript;
      const hasSpeakers = segments && segments.some(s => s.speaker);
      
      if (segments && segments.length > 0) {
        let currentSpeaker = segments[0].speaker || "Unknown";
        const parts: string[] = [];
        let currentText: string[] = [];
        let startTime = segments[0].start;
        
        for (const seg of segments) {
          const spk = seg.speaker || "Unknown";
          if (spk !== currentSpeaker) {
            // Flush previous speaker
            const timeTag = `[${formatTime(startTime)}]`;
            parts.push(`${hasSpeakers ? `[${currentSpeaker}] ` : ''}${timeTag}: ${currentText.join(" ")}`);
            
            currentSpeaker = spk;
            currentText = [seg.text];
            startTime = seg.start;
          } else {
            currentText.push(seg.text);
          }
        }
        if (currentText.length > 0) {
          const timeTag = `[${formatTime(startTime)}]`;
          parts.push(`${hasSpeakers ? `[${currentSpeaker}] ` : ''}${timeTag}: ${currentText.join(" ")}`);
        }
        chatTranscript = parts.join("\n\n");
      }

      const { answer } = await askQuestion(meetingId, trimmed, chatTranscript, summary, validHistory);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: answer }]);
      setCurrentSuggestions(getFollowUpSuggestions(trimmed));
    } catch {
      setMessages((prev) => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: "MeetMind is temporarily unavailable or I couldn't answer that right now. Your meeting data is still safe.",
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      // Refocus input
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
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open MeetMind AI Chat"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-background shadow-lg hover:shadow-xl transition-all font-semibold hover:bg-foreground/90 hover:scale-[1.05] active:scale-[0.95]"
          >
            <ChatIcon />
            Ask MeetMind AI
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[420px] h-full sm:h-[650px] glass-card flex flex-col shadow-2xl overflow-hidden border border-glass-border sm:rounded-2xl rounded-none bg-surface"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-glass-border bg-background/50 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background shadow-sm">
                  <ChatIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">MeetMind Assistant</h3>
                  <p className="text-xs text-muted flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Meeting context active
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  aria-label="Clear chat history"
                  title="Clear Chat"
                  className="rounded-lg p-2 text-muted hover:bg-surface hover:text-foreground transition-colors border border-transparent hover:border-card-border"
                >
                  <TrashIcon />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="rounded-lg p-2 text-muted hover:bg-surface hover:text-foreground transition-colors border border-transparent hover:border-card-border"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 scroll-smooth bg-surface/30">
              <div className="space-y-6">
                
                {messages.length === 0 && (
                  <div className="text-center pt-8 pb-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background mb-4 shadow-sm">
                      <ChatIcon />
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-2">Ask MeetMind</h4>
                    <p className="text-sm text-muted mb-6 px-4">
                      Get answers from this meeting&apos;s transcript, decisions, and action items.
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
                        <span>MeetMind is thinking</span>
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

            {/* Suggestions Area */}
            {(() => {
              const activeSuggestions = currentSuggestions.length > 0 ? currentSuggestions : (messages.length === 0 ? initialSuggestions : []);
              if (activeSuggestions.length === 0 || isLoading) return null;
              return (
                <div className="px-4 pb-3 bg-surface/30">
                  <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2">
                    {activeSuggestions.map((action) => (
                      <button
                        key={action}
                        onClick={() => handleSend(action)}
                        className="rounded-xl border border-card-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:bg-background transition-colors text-left"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Input Area */}
            <div className="p-4 border-t border-glass-border bg-background/50 backdrop-blur-md shrink-0">
              <div className="relative flex items-end rounded-xl border border-card-border bg-surface shadow-inner focus-within:border-foreground/30 transition-colors">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    handleInput();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about this meeting..."
                  className="flex-1 max-h-32 bg-transparent px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:outline-none resize-none"
                  disabled={isLoading}
                  rows={1}
                  aria-label="Chat input"
                />
                <button
                  onClick={() => handleSend(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  aria-label="Send message"
                  className="p-3 mb-0.5 mr-0.5 text-muted hover:text-foreground disabled:opacity-30 disabled:hover:text-muted transition-colors"
                >
                  <SendIcon />
                </button>
              </div>
              <div className="text-[10px] text-muted text-center mt-2 font-medium">
                MeetMind AI can make mistakes. Check important info.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
