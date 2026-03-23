'use client';

import { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';
import api from '@/lib/axios';
import { useAuth } from '@/store/useAuth';

export default function AIWidget({ context }: { context?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Hi! I am your AI learning assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // All hooks must be called before any early return
  if (!isAuthenticated) return null;

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: userMsg, context: context || 'General platform' });
      setMessages((prev) => [...prev, { role: 'ai', content: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', content: 'Sorry, I encountered an error connecting to the AI service.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${isOpen ? 'hidden' : 'flex'} fixed bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition transform hover:scale-105 z-50`}
      >
        <Bot className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-96 bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 font-medium">
              <Bot className="h-5 w-5" />
              AI Assistant
            </div>
            <button onClick={() => setIsOpen(false)} className="text-indigo-100 hover:text-white transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-500 px-4 py-2 rounded-2xl rounded-tl-sm text-sm shadow-sm flex gap-1 items-center">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t border-slate-200 p-3 bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-slate-100 text-sm px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              disabled={loading || !input.trim()}
              type="submit"
              className="flex items-center justify-center p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
