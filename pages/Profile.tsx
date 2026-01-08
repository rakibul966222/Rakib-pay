
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Camera, Shield, Mail, Phone, Calendar, BadgeCheck, QrCode, X } from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  const [showQR, setShowQR] = useState(false);

  return (
    <main className="md:ml-64 p-4 md:p-6 pb-24 md:pb-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-3xl overflow-hidden mb-8 relative">
          <div className="h-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 relative z-10">
              <div className="relative">
                <div className="w-32 h-32 bg-slate-900 border-4 border-slate-950 rounded-3xl flex items-center justify-center text-5xl font-bold text-indigo-500 shadow-2xl">
                  {profile.name.charAt(0)}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2.5 bg-indigo-600 rounded-xl text-white shadow-xl hover:scale-110 transition-all">
                  <Camera size={18} />
                </button>
              </div>
              <div className="flex-1 mb-2">
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  {profile.name}
                  <BadgeCheck size={24} className="text-indigo-400" />
                </h1>
                <p className="text-slate-400 text-sm">{profile.email}</p>
              </div>
              <button 
                onClick={() => setShowQR(true)}
                className="flex items-center gap-2 bg-white text-slate-950 px-6 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all shadow-xl"
              >
                <QrCode size={20} /> My QR
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-6">Account Details</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400"><Mail size={18} /></div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Verified Email</p>
                  <p className="text-white font-medium text-sm">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400"><Shield size={18} /></div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Security Level</p>
                  <p className="text-white font-medium text-sm">Level 2 (High)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={80} /></div>
             <h3 className="text-lg font-bold text-white mb-6">Security Settings</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                   <span className="text-slate-300 text-sm">2FA Authentication</span>
                   <div className="w-10 h-5 bg-indigo-600 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                   <span className="text-slate-300 text-sm">Auto-lock App</span>
                   <div className="w-10 h-5 bg-slate-700 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white/50 rounded-full"></div></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/40 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[40px] max-w-sm w-full text-center relative shadow-2xl">
            <button onClick={() => setShowQR(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={24} /></button>
            <div className="mb-6 inline-block p-4 bg-indigo-600 rounded-3xl text-white">
              <QrCode size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{profile.name}</h2>
            <p className="text-slate-500 text-sm mb-8">Scan this code to send money instantly</p>
            <div className="bg-slate-100 p-6 rounded-3xl mb-8 flex items-center justify-center aspect-square">
              {/* Simulated QR Code */}
              <div className="grid grid-cols-4 gap-2 opacity-80">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className={`w-8 h-8 rounded-md ${Math.random() > 0.4 ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
                ))}
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {profile.uid.slice(0,16)}</p>
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;
