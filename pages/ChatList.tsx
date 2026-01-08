
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Message } from '../types';
import { Send, Sparkles, Bot, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { sendNotification } from '../utils/notifications';

interface ChatProps {
  profile: UserProfile;
}

const ChatList: React.FC<ChatProps> = ({ profile }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: 'ai', text: `Hello ${profile.name}! I'm your ZenWallet AI assistant. How can I help you today?`, timestamp: Date.now(), isAI: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: profile.uid,
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a helpful financial AI assistant for ZenWallet. User balance is $${profile.balance}. User name is ${profile.name}. Answer this: ${currentInput}`,
      });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'ai',
        text: response.text || "I'm sorry, I couldn't process that. Can you try again?",
        timestamp: Date.now(),
        isAI: true,
      };
      
      setMessages(prev => [...prev, aiMsg]);
      
      // Send notification for AI response
      sendNotification("🤖 AI Assistant", {
        body: aiMsg.text.length > 50 ? aiMsg.text.substring(0, 50) + "..." : aiMsg.text,
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="md:ml-64 p-0 h-screen bg-slate-950 flex flex-col">
      <header className="p-4 glass border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Smart Assistant</h1>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
            </p>
          </div>
        </div>
        <div className="p-2 glass rounded-lg text-indigo-400">
          <Sparkles size={20} />
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.isAI 
              ? 'bg-slate-900 border border-white/5 text-slate-200' 
              : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <p className={`text-[9px] mt-2 opacity-50 ${msg.isAI ? 'text-left' : 'text-right'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-indigo-400" />
              <span className="text-xs text-slate-500">AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="relative max-w-4xl mx-auto">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your balance or saving tips..."
            className="w-full glass py-4 pl-6 pr-14 rounded-2xl text-white focus:outline-none focus:border-indigo-500/50 transition-all"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white hover:bg-indigo-500 disabled:opacity-50 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </main>
  );
};

export default ChatList;
