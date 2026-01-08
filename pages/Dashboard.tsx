
import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  Bell,
  Sparkles
} from 'lucide-react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, Transaction } from '../types';
import { AreaChart, Area, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { sendNotification } from '../utils/notifications';

interface DashboardProps {
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [aiInsight, setAiInsight] = useState<string>("Analyzing your spending...");
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const firstLoad = useRef(true);

  useEffect(() => {
    const q = query(
      collection(db, 'transactions'),
      where('participants', 'array-contains', profile.uid),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      
      // Notify on new INCOMING transaction
      if (!firstLoad.current && snapshot.docChanges().length > 0) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const newTx = change.doc.data() as Transaction;
            if (newTx.to === profile.uid) {
              sendNotification("💰 Payment Received!", {
                body: `You received $${newTx.amount} from ${newTx.fromName}`,
              });
            }
          }
        });
      }

      setRecentTransactions(txs);
      generateAIInsight(txs);
      firstLoad.current = false;
    });

    return () => unsubscribe();
  }, [profile.uid]);

  const generateAIInsight = async (txs: Transaction[]) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Based on these last ${txs.length} transactions for a user named ${profile.name}, give a very short (15 words max) financial tip or insight. Transactions: ${txs.map(t => t.type + ' ' + t.amount).join(', ')}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiInsight(response.text || "Keep track of your small expenses to save more!");
    } catch (e) {
      setAiInsight("Save 20% of your income this month to reach your goals.");
    }
  };

  const categoryData = [
    { name: 'Food', value: 400, color: '#6366f1' },
    { name: 'Travel', value: 300, color: '#a855f7' },
    { name: 'Bills', value: 300, color: '#ec4899' },
  ];

  return (
    <main className="md:ml-64 p-4 md:p-6 pb-24 md:pb-6 min-h-screen bg-slate-950">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Hi, {profile.name} 👋</h1>
          <p className="text-slate-400 text-sm">Your financial summary is ready</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 glass rounded-xl text-slate-400 hover:text-white"><Bell size={20} /></button>
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
            {profile.name.charAt(0)}
          </div>
        </div>
      </header>

      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 flex items-start gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10"><Sparkles size={48} /></div>
        <div className="bg-indigo-500 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/20">
          <Sparkles size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Smart Insight</h4>
          <p className="text-sm text-slate-200 font-medium italic">"{aiInsight}"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 glass p-6 md:p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400 text-sm font-medium">ZenWallet Balance</span>
              <button onClick={() => setIsBalanceVisible(!isBalanceVisible)} className="text-indigo-400 text-xs font-bold">
                {isBalanceVisible ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                {isBalanceVisible ? `$${profile.balance.toLocaleString()}` : '••••••'}
              </span>
              <span className="text-slate-500 text-sm">USD</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => window.location.hash = '#/send-money'} className="flex-1 bg-white text-slate-950 py-3.5 rounded-2xl font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                <ArrowUpRight size={18} /> Send
              </button>
              <button className="flex-1 glass text-white py-3.5 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Plus size={18} /> Add
              </button>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl flex flex-col items-center justify-center text-center">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest text-slate-400">
             Spending Pattern
          </h3>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-white mb-6">Activity</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{n: '1', v: 400}, {n: '2', v: 700}, {n: '3', v: 500}, {n: '4', v: 900}, {n: '5', v: 600}]}>
                <defs>
                  <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorV)" />
                <Tooltip contentStyle={{background: '#1e293b', border: 'none', borderRadius: '12px'}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Recent Activities</h3>
            <button onClick={() => window.location.hash = '#/history'} className="text-indigo-400 text-sm font-medium">See all</button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${tx.type === 'receive' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {tx.type === 'receive' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{tx.type === 'receive' ? tx.fromName : tx.toName}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{tx.category || 'General'}</p>
                  </div>
                </div>
                <p className={`font-bold ${tx.type === 'receive' ? 'text-emerald-500' : 'text-slate-200'}`}>
                  {tx.type === 'receive' ? '+' : '-'}${tx.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
