
import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface PINSetupProps {
  uid: string;
  onComplete: () => void;
}

const PINSetup: React.FC<PINSetupProps> = ({ uid, onComplete }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = async () => {
    if (pin !== confirmPin) {
      setError("PINs don't match");
      return;
    }
    setLoading(true);
    try {
      // In a real app, hash this PIN on server or client properly
      await updateDoc(doc(db, 'users', uid), {
        pinHash: pin 
      });
      onComplete();
    } catch (err) {
      setError("Failed to set PIN");
    } finally {
      setLoading(false);
    }
  };

  const handleDigit = (digit: string) => {
    if (step === 1) {
      if (pin.length < 4) setPin(prev => prev + digit);
    } else {
      if (confirmPin.length < 4) setConfirmPin(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    if (step === 1) setPin(prev => prev.slice(0, -1));
    else setConfirmPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-md glass p-10 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 text-green-500 rounded-full mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Secure Your Wallet</h1>
          <p className="text-slate-400">
            {step === 1 ? 'Create a 4-digit security PIN' : 'Confirm your security PIN'}
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-10">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className={`w-12 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                (step === 1 ? pin.length : confirmPin.length) > i 
                ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                : 'border-white/10 text-slate-700'
              }`}
            >
              {(step === 1 ? pin : confirmPin)[i] ? '•' : ''}
            </div>
          ))}
        </div>

        {error && <p className="text-red-400 text-center mb-6 text-sm">{error}</p>}

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((val, i) => (
            <button
              key={i}
              onClick={() => val === 'del' ? handleBackspace() : handleDigit(val.toString())}
              disabled={val === '' || loading}
              className={`h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-all ${
                val === '' ? 'opacity-0 cursor-default' : 'glass hover:bg-white/10 text-white'
              }`}
            >
              {val === 'del' ? '⌫' : val}
            </button>
          ))}
        </div>

        {step === 1 ? (
          <button 
            disabled={pin.length < 4}
            onClick={() => setStep(2)}
            className="w-full bg-indigo-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl"
          >
            Next Step
          </button>
        ) : (
          <button 
            disabled={confirmPin.length < 4 || loading}
            onClick={handleComplete}
            className="w-full bg-indigo-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Secure Wallet'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PINSetup;
