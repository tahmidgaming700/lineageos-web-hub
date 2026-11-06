import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { puterService } from '../../lib/puter';

interface Message {
  role: 'assistant' | 'user';
  text: string;
}

interface RomAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDeviceCodename?: string;
}

export const RomAssistantModal: React.FC<RomAssistantModalProps> = ({
  isOpen,
  onClose,
  activeDeviceCodename,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Hello! I'm ROM Assistant for LineageOS Web Hub. I can help explain partition structures, GSI variant codes (like arm64_bgN), fastbootd instructions, checksum verification, or troubleshooting steps. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const context = activeDeviceCodename
        ? `Currently viewed device: ${activeDeviceCodename}`
        : undefined;
      const reply = await puterService.askAssistant(textToSend, context);
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Unable to reach the assistant right now. Please check your network connection or consult the official LineageOS Wiki.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ROM Technical Assistant"
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md h-full sm:h-[90vh] bg-white dark:bg-[#1B2122] sm:rounded-3xl shadow-2xl border-l sm:border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-1.5">
                <span>ROM Assistant</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-mono">
                  AI Powered
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {activeDeviceCodename ? `Device context: ${activeDeviceCodename}` : 'Android firmware guidance'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-xs'
                    : 'bg-slate-100 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/50 dark:border-slate-700/50'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/70 text-slate-500 rounded-tl-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                <span>Consulting firmware documentation...</span>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 overflow-x-auto flex gap-1.5 text-[11px]">
          {[
            'What does arm64_bgN mean?',
            'How to flash GSI with fastbootd?',
            'Why verify SHA-256 before flashing?',
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-500 whitespace-nowrap cursor-pointer transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-[#1B2122]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about ROMs, GSIs, or flashing..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden focus:border-teal-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
