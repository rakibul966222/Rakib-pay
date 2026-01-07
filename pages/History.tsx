
import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, Transaction } from '../types';
import { ArrowUpRight, ArrowDownLeft, Filter, Download, Search } from 'lucide-react';

interface HistoryProps {
  profile: UserProfile;
}

const History: React.FC<HistoryProps> = ({ profile }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'send' | 'receive'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(
      collection(db, 'transactions'),
      where('participants', 'array-contains', profile.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(txs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile.uid]);

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'send') return tx.from === profile.uid;
    if (filter === 'receive') return tx.to === profile.uid;
    return true;
  });

  return (
    <main className="md:ml-64 p-6 pb-24 md:pb-6 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
          <p className="text-slate-400">Keep track of all your financial activities</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition-all">
            <Download size={18} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition-all">
            <Filter size={18} />
            Filters
          </button>
        </div>
      </header>

      <div className="mb-8 flex gap-2">
        {['all', 'send', 'receive'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              filter === f ? 'bg-indigo-600 text-white' : 'glass text-slate-400 hover:text-white'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-slate-500 font-medium text-sm">Recipient / Sender</th>
                <th className="px-6 py-4 text-slate-500 font-medium text-sm">Date</th>
                <th className="px-6 py-4 text-slate-500 font-medium text-sm">Type</th>
                <th className="px-6 py-4 text-slate-500 font-medium text-sm">Note</th>
                <th className="px-6 py-4 text-slate-500 font-medium text-sm text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">Loading transactions...</td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">No transactions found</td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isSent = tx.from === profile.uid;
                  return (
                    <tr key={tx.id} className="hover:bg-white/5 transition-all group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${isSent ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                            {(isSent ? tx.toName : tx.fromName).charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-white">{isSent ? tx.toName : tx.fromName}</p>
                            <p className="text-xs text-slate-500">ID: {tx.id.slice(0,8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-slate-400 text-sm">
                        {new Date(tx.timestamp).toLocaleDateString()}
                        <br />
                        <span className="text-xs opacity-50">{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${isSent ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                          {isSent ? 'Outgoing' : 'Incoming'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-400 text-sm max-w-[200px] truncate">
                        {tx.note || '-'}
                      </td>
                      <td className={`px-6 py-5 text-right font-bold text-lg ${isSent ? 'text-slate-200' : 'text-green-500'}`}>
                        {isSent ? '-' : '+'}${tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default History;
