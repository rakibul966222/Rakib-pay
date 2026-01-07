
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  Bell,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, Transaction } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'transactions'),
      where('participants', 'array-contains', profile.uid),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      setRecentTransactions(txs);
    });

    return () => unsubscribe();
  }, [profile.uid]);

  const data = [
    { name: 'Mon', income: 4000, expense: 2400 },
    { name: 'Tue', income: 3000, expense: 1398 },
    { name: 'Wed', income: 2000, expense: 9800 },
    { name: 'Thu', income: 2780, expense: 3908 },
    { name: 'Fri', income: 1890, expense: 4800 },
    { name: 'Sat', income: 2390, expense: 3800 },
    { name: 'Sun', income: 3490, expense: 4300 },
  ];

  return (
    <main className="md:ml-64 p-6 pb-24 md:pb-6 min-h-screen bg-slate-950">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Hello, {profile.name}</h1>
          <p className="text-slate-400">Welcome back to your dashboard</p>
        </div>
        <div className="flex gap-4">
          <button className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-all">
            <Search size={20} />
          </button>
          <button className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full"></span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <div className="lg:col-span-2 glass p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <span className="text-slate-400 font-medium">Available Balance</span>
              <button 
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                className="text-xs text-indigo-400 font-medium hover:underline"
              >
                {isBalanceVisible ? 'Hide Balance' : 'Show Balance'}
              </button>
            </div>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-bold text-white">
                {isBalanceVisible ? `$${profile.balance.toLocaleString()}` : '••••••'}
              </span>
              <span className="text-slate-500 text-lg">USD</span>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-950 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">
                <Plus size={20} />
                Add Money
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 glass text-white py-3 rounded-xl font-bold hover:bg-white/10 transition-all">
                <ArrowUpRight size={20} />
                Send Money
              </button>
            </div>
          </div>
        </div>

        {/* Mini Analytics */}
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-white font-bold mb-6">Expenses this month</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Income</p>
                <p className="text-lg font-bold text-white">+$4,250.00</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                <TrendingDown size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Spending</p>
                <p className="text-lg font-bold text-white">-$1,120.50</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="glass p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-lg font-bold text-white">Analytics</h3>
            <select className="bg-transparent text-slate-400 text-sm focus:outline-none">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="income" stroke="#6366f1" fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions */}
        <div className="glass p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
            <button className="text-indigo-400 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${tx.type === 'receive' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.type === 'receive' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-white">{tx.type === 'receive' ? tx.fromName : tx.toName}</p>
                      <p className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${tx.type === 'receive' ? 'text-green-500' : 'text-slate-200'}`}>
                    {tx.type === 'receive' ? '+' : '-'}${tx.amount}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-500">No transactions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
