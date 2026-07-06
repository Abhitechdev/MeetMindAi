"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { askQuestion } from "@/lib/api";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

interface ChatBotProps {
  meetingId: string;
  transcript: string;
  summary: string;
}

const QUICK_ACTIONS = [
  "Key Decisions",
  "Action Items",
  "Deadlines",
  "Risks",
  "Next Steps",
  "Assigned Tasks",
];

const INITIAL_MESSAGE: Message = {
  id: "initial",
  role: "assistant",
  content: "Hello 👋\n\nI can answer questions about this meeting.\n\nTry asking:\n• What decisions were made?\n• What action items were assigned?\n• What are the next steps?",
};

// SVG Icons
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

export default function ChatBot({ meetingId, transcript, summary }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const { answer } = await askQuestion(meetingId, text, transcript, summary);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: answer,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputValue);
  };

  const handleQuickAction = (action: string) => {
    handleSend(`What were the ${action.toLowerCase()}?`);
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
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-white shadow-lg hover:shadow-xl transition-shadow font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
            className="fixed bottom-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[400px] h-[85vh] sm:h-[600px] glass-card flex flex-col shadow-2xl overflow-hidden border border-glass-border sm:rounded-2xl rounded-t-2xl rounded-b-none"
            style={{ backgroundColor: "var(--surface)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-glass-border bg-foreground/5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm text-white">
                  <ChatIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">MeetMind AI</h3>
                  <p className="text-xs text-muted flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse block" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-muted hover:bg-white/10 hover:text-foreground transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 scroll-smooth">
              <div className="space-y-6">
                
                {/* Lottie Animation on open */}
                {messages.length === 1 && (
                  <motion.div 
                    className="flex justify-center mb-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* @ts-ignore */}
                    <dotlottie-wc src="https://lottie.host/de3c229a-8178-4113-9937-1d2b03ad4444/e9RdggEUwX.lottie" style={{ width: "200px", height: "200px" }} autoplay loop></dotlottie-wc>
                  </motion.div>
                )}

                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-sm"
                          : "bg-white/5 text-foreground border border-glass-border rounded-tl-sm shadow-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/5 border border-glass-border rounded-2xl rounded-tl-sm px-4 py-4 max-w-[85%] shadow-sm">
                      <div className="flex gap-1.5">
                        <motion.div className="h-2 w-2 rounded-full bg-purple-400" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                        <motion.div className="h-2 w-2 rounded-full bg-purple-400" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                        <motion.div className="h-2 w-2 rounded-full bg-purple-400" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Actions (only show if no messages besides initial or empty input) */}
            {messages.length < 3 && !inputValue && !isLoading && (
               <div className="px-5 pb-3">
                 <div className="flex flex-wrap gap-2">
                   {QUICK_ACTIONS.map((action) => (
                     <button
                       key={action}
                       onClick={() => handleQuickAction(action)}
                       className="rounded-full border border-glass-border bg-white/5 px-3 py-1.5 text-xs text-muted hover:bg-white/10 hover:text-foreground transition-colors"
                     >
                       {action}
                     </button>
                   ))}
                 </div>
               </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-glass-border bg-foreground/5">
              <form
                onSubmit={handleSubmit}
                className="relative flex items-center rounded-xl border border-glass-border bg-foreground/10 overflow-hidden shadow-inner focus-within:border-purple-500/50 transition-colors"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="pr-4 pl-2 text-muted hover:text-purple-400 disabled:opacity-50 disabled:hover:text-muted transition-colors"
                >
                  <SendIcon />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
