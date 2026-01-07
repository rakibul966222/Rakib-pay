
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Lock, Fingerprint } from 'lucide-react';

interface PINLockProps {
  profile: UserProfile;
  onAuthorized: () => void;
}

const PINLock: React.FC<PINLockProps> = ({ profile, onAuthorized }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === profile.pinHash) {
          onAuthorized();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-md text-center">
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl shadow-2xl shadow-indigo-600/20 mb-6">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Hello, {profile.name}</h1>
          <p className="text-slate-400">Enter your PIN to unlock</p>
        </div>

        <div className="flex justify-center gap-4 mb-16">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                error ? 'bg-red-500 animate-bounce' :
                pin.length > i ? 'bg-indigo-500 scale-125' : 'bg-slate-800'
              }`}
            ></div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-[300px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, <Fingerprint className="text-indigo-400" />, 0, 'del'].map((val, i) => (
            <button
              key={i}
              onClick={() => val === 'del' ? handleBackspace() : typeof val === 'number' ? handleDigit(val.toString()) : null}
              className="h-16 w-16 mx-auto rounded-full flex items-center justify-center text-2xl font-medium text-white hover:bg-white/5 transition-all"
            >
              {val === 'del' ? '⌫' : val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PINLock;
