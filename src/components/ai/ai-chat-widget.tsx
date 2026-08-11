'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, Loader2, Minimize2 } from 'lucide-react';
import { askAiAssistantAction } from '@/app/actions/ai-assistant';
import { AiChatMessage } from '@/lib/ai/openrouter';

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: 'assistant',
      content: 'Bonjour ! 👋 Je suis votre assistant IA dédié à l\'organisation de votre mariage. Comment puis-je vous aider aujourd\'hui ?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: AiChatMessage = { role: 'user', content: query };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await askAiAssistantAction(updatedMessages);
      if (res.success && res.reply) {
        setMessages([...updatedMessages, { role: 'assistant', content: res.reply }]);
      } else {
        setMessages([...updatedMessages, { role: 'assistant', content: "Désolé, une erreur s'est produite." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages([...updatedMessages, { role: 'assistant', content: "Impossible de joindre le serveur d'assistant." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Où en est mon budget ?",
    "Que devrais-je faire ce mois-ci ?",
    "Conseils pour mes invitations"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-medium group cursor-pointer"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span>Assistant IA</span>
        </button>
      ) : (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-rose-100 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Assistant Wedding IA</h3>
                <p className="text-xs text-rose-100">Alimenté par DeepSeek</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer text-white"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-rose-500 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/50 dark:border-slate-700/50'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5 justify-start items-center text-slate-400">
                <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-2.5 text-xs flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                  L'IA réfléchit...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length < 3 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="text-xs bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-slate-700 border border-rose-200/60 dark:border-slate-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question sur le mariage..."
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
