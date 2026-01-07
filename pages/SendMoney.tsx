
import React, { useState } from 'react';
import { collection, addDoc, doc, updateDoc, runTransaction, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { Search, Loader2, CheckCircle, Send, AlertTriangle } from 'lucide-react';

interface SendMoneyProps {
  profile: UserProfile;
}

const SendMoney: React.FC<SendMoneyProps> = ({ profile }) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [recipient, setRecipient] = useState<any>(null);

  const searchRecipient = async () => {
    if (!recipientEmail) return;
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'users'), where('email', '==', recipientEmail.toLowerCase()));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError('User not found');
        setRecipient(null);
      } else {
        const data = querySnapshot.docs[0].data();
        if (data.uid === profile.uid) {
          setError("You cannot send money to yourself");
          setRecipient(null);
        } else {
          setRecipient(data);
        }
      }
    } catch (err) {
      setError('Error searching for user');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Invalid amount');
      return;
    }
    if (amountNum > profile.balance) {
      setError('Insufficient balance');
      return;
    }

    setLoading(true);
    try {
      await runTransaction(db, async (transaction) => {
        const senderRef = doc(db, 'users', profile.uid);
        const receiverRef = doc(db, 'users', recipient.uid);
        
        const senderDoc = await transaction.get(senderRef);
        const receiverDoc = await transaction.get(receiverRef);

        if (!senderDoc.exists() || !receiverDoc.exists()) throw "User does not exist";

        const newSenderBalance = senderDoc.data().balance - amountNum;
        const newReceiverBalance = receiverDoc.data().balance + amountNum;

        transaction.update(senderRef, { balance: newSenderBalance });
        transaction.update(receiverRef, { balance: newReceiverBalance });

        const txRef = doc(collection(db, 'transactions'));
        transaction.set(txRef, {
          from: profile.uid,
          to: recipient.uid,
          fromName: profile.name,
          toName: recipient.name,
          amount: amountNum,
          charge: 0,
          type: 'send',
          note: note,
          timestamp: Date.now(),
          participants: [profile.uid, recipient.uid]
        });
      });
      setSuccess(true);
    } catch (err) {
      setError('Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="md:ml-64 p-6 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md glass p-10 rounded-3xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 text-green-500 rounded-full mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
          <p className="text-slate-400 mb-8">
            You have sent <span className="text-white font-bold">${amount}</span> to <span className="text-white font-bold">{recipient.name}</span>
          </p>
          <button 
            onClick={() => window.location.href = '#/'}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="md:ml-64 p-6 pb-24 md:pb-6 min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Send Money</h1>
        <p className="text-slate-400">Transfer funds instantly to any ZenWallet user</p>
      </header>

      <div className="max-w-xl mx-auto space-y-8">
        {/* Recipient Search */}
        <div className="glass p-8 rounded-3xl">
          <label className="text-sm font-medium text-slate-300 block mb-3">Recipient Email</label>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="email"
                value={recipientEmail}
                onChange={(e) => {
                  setRecipientEmail(e.target.value);
                  setRecipient(null);
                }}
                placeholder="search by email..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <button 
              onClick={searchRecipient}
              disabled={loading}
              className="bg-indigo-600 px-6 rounded-xl text-white font-bold hover:bg-indigo-500 transition-all flex items-center justify-center"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Search'}
            </button>
          </div>

          {error && <p className="text-red-400 mt-4 text-sm flex items-center gap-2"><AlertTriangle size={16} />{error}</p>}

          {recipient && (
            <div className="mt-8 p-6 bg-white/5 rounded-2xl flex items-center gap-4 border border-white/10 animate-in fade-in slide-in-from-top-4">
              <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white">
                {recipient.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white">{recipient.name}</p>
                <p className="text-sm text-slate-400">{recipient.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className={`glass p-8 rounded-3xl transition-all ${!recipient ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-3">Amount to Send (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-500">$</span>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-12 pr-4 text-4xl font-bold text-white focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 ml-1">Current Balance: ${profile.balance.toLocaleString()}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-3">Note (Optional)</label>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this for?"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-indigo-500/50 h-24 resize-none"
              />
            </div>

            <button 
              onClick={handleSend}
              disabled={loading || !amount}
              className="w-full bg-indigo-600 py-5 rounded-2xl text-white font-bold text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <><Send size={24} /> Send Now</>}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SendMoney;
