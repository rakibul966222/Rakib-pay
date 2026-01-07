
import React from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Mail, ArrowRight } from 'lucide-react';

interface VerificationProps {
  user: User;
}

const Verification: React.FC<VerificationProps> = ({ user }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-md glass p-10 rounded-3xl shadow-2xl text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600/10 text-indigo-500 rounded-full mb-8">
          <Mail size={40} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Verify Your Email</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          We've sent a verification link to <span className="text-white font-medium">{user.email}</span>. 
          Please click the link in your inbox to secure your account.
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
          >
            I've Verified My Email
            <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => signOut(auth)}
            className="w-full glass text-slate-300 font-medium py-4 rounded-xl"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verification;
