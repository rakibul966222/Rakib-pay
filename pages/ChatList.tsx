
import React from 'react';
import { UserProfile } from '../types';
import { MessageSquare, Search, Plus } from 'lucide-react';

interface ChatListProps {
  profile: UserProfile;
}

const ChatList: React.FC<ChatListProps> = ({ profile }) => {
  return (
    <main className="md:ml-64 p-6 pb-24 md:pb-6 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
          <p className="text-slate-400">Instant support and user-to-user chat</p>
        </div>
        <button className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500">
          <Plus size={24} />
        </button>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            placeholder="Search conversations..."
            className="w-full glass py-4 pl-12 pr-4 rounded-2xl text-white focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        <div className="glass rounded-3xl p-4 divide-y divide-white/5">
          <div className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all cursor-pointer">
            <div className="relative">
              <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center font-bold text-xl text-white">S</div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-slate-900 rounded-full"></span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <p className="font-bold text-white">Support Team</p>
                <span className="text-xs text-slate-500">12:45 PM</span>
              </div>
              <p className="text-sm text-slate-400 truncate">Your transaction was successful! Let us know if you need anything else.</p>
            </div>
            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">2</div>
          </div>

          {[1,2,3].map(i => (
            <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all cursor-pointer">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-xl text-slate-400">
                U{i}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <p className="font-bold text-white">User {i}</p>
                  <span className="text-xs text-slate-500">Yesterday</span>
                </div>
                <p className="text-sm text-slate-500 truncate">Sent you a money request for $50</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 text-slate-600 rounded-full mb-4">
            <MessageSquare size={32} />
          </div>
          <p className="text-slate-500">No other active conversations</p>
        </div>
      </div>
    </main>
  );
};

export default ChatList;
