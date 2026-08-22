'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, Flower2, HeartHandshake } from 'lucide-react';
import { bloomGardenChat } from '@/ai/flows/bloom-garden-chat';
import { useAuth } from '@/hooks/use-auth';
import type { BloomChatMessage, BloomGardenContext, BloomState } from '../types/garden.types';

interface BloomChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  gardenContext: BloomGardenContext;
  onBloomStateChange: (state: BloomState) => void;
}

const QUICK_PROMPTS = [
  'How do I find calm right now?',
  'What does this garden represent?',
  'Tell me about taking a mindful pause',
  'I feel a bit overwhelmed today',
];

export function BloomChatPanel({
  isOpen,
  onClose,
  gardenContext,
  onBloomStateChange,
}: BloomChatPanelProps) {
  const { user } = useAuth();
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Friend';

  const [messages, setMessages] = useState<BloomChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${userName}! Welcome to ${gardenContext.zoneName}. Take a slow breath and feel the earth beneath us. What is on your mind?`,
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: BloomChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);
    onBloomStateChange('thinking');

    try {
      const res = await bloomGardenChat({
        message: trimmed,
        userName: userName,
        userEmail: user?.email || undefined,
        zoneName: gardenContext.zoneName,
        isSitting: gardenContext.isSitting,
        flowersPickedCount: gardenContext.flowersPickedCount,
        recentAction: gardenContext.recentAction,
        history: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const assistantMsg: BloomChatMessage = {
        id: `bloom-${Date.now()}`,
        role: 'assistant',
        content: res.response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      onBloomStateChange('speaking');
      // Return to idle after a few seconds of speaking animation
      setTimeout(() => {
        onBloomStateChange('idle');
      }, 4500);
    } catch (err) {
      console.error('Failed to chat with Bloom:', err);
      const fallbackMsg: BloomChatMessage = {
        id: `bloom-err-${Date.now()}`,
        role: 'assistant',
        content: `I am here with you, ${userName}. Let the quiet serenity of the garden soothe your thoughts.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      onBloomStateChange('idle');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="pointer-events-auto absolute right-4 bottom-4 top-20 w-full max-w-sm md:max-w-md z-40 flex flex-col rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 text-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right-6 duration-200"
      role="dialog"
      aria-label="Conversation with Bloom"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-600/60 border border-emerald-400/40 shadow-inner">
            <Bot className="h-5 w-5 text-emerald-100" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-black" />
          </div>
          <div>
            <h3 className="font-display font-medium text-sm text-white tracking-wide flex items-center gap-1.5">
              Bloom <span className="font-body text-[10px] text-emerald-300 font-normal px-1.5 py-0.5 rounded-full bg-emerald-500/20">Companion</span>
            </h3>
            <p className="font-body text-xs text-white/60">
              {gardenContext.zoneName} · {gardenContext.isSitting ? 'Resting on bench' : 'Exploring'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close conversation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-0 text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-600/70 text-white rounded-br-none border border-emerald-400/30'
                  : 'bg-white/10 text-white/95 rounded-bl-none border border-white/15'
              }`}
            >
              <p className="font-body text-xs sm:text-sm">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/40 px-3.5 py-2 rounded-2xl border border-emerald-500/20 w-fit animate-pulse">
            <Sparkles className="h-3.5 w-3.5 animate-spin text-emerald-400" />
            <span>Bloom is pondering in the garden...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-white/5 bg-black/20">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="text-left text-[11px] font-body text-white/80 bg-white/10 hover:bg-white/20 hover:text-white px-2.5 py-1 rounded-full border border-white/10 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Message Input Footer */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Talk with Bloom..."
            disabled={isLoading}
            className="flex-1 bg-black/30 text-white placeholder-white/40 text-xs sm:text-sm rounded-full px-4 py-2.5 border border-white/20 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white transition-all shadow-md"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
