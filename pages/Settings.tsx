
import React from 'react';
import { UserProfile } from '../types';
import { auth } from '../firebase';
import { LogOut, ChevronRight, Moon, Globe, Bell, Lock, UserX } from 'lucide-react';

interface SettingsProps {
  profile: UserProfile;
}

const Settings: React.FC<SettingsProps> = ({ profile }) => {
  const settingGroups = [
    {
      title: 'General',
      items: [
        { icon: Moon, label: 'Dark Mode', extra: 'On' },
        { icon: Globe, label: 'Language', extra: 'English' },
        { icon: Bell, label: 'Notifications', extra: 'Enabled' },
      ]
    },
    {
      title: 'Security',
      items: [
        { icon: Lock, label: 'Change PIN', extra: '' },
        { icon: Lock, label: 'Change Password', extra: '' },
      ]
    }
  ];

  return (
    <main className="md:ml-64 p-6 pb-24 md:pb-6 min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Customize your wallet experience</p>
      </header>

      <div className="max-w-2xl mx-auto space-y-8">
        {settingGroups.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">{group.title}</h3>
            <div className="glass rounded-3xl overflow-hidden divide-y divide-white/5">
              {group.items.map((item, i) => (
                <button 
                  key={i} 
                  className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 glass text-indigo-400 rounded-lg">
                      <item.icon size={20} />
                    </div>
                    <span className="font-medium text-white">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">{item.extra}</span>
                    <ChevronRight size={18} className="text-slate-700" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-4 pt-4">
          <button 
            onClick={() => auth.signOut()}
            className="w-full glass p-5 rounded-3xl flex items-center gap-4 text-red-400 hover:bg-red-500/10 transition-all"
          >
            <div className="p-2 bg-red-500/10 rounded-lg">
              <LogOut size={20} />
            </div>
            <span className="font-bold flex-1 text-left">Logout Account</span>
            <ChevronRight size={18} />
          </button>

          <button className="w-full flex items-center gap-4 p-5 text-slate-600 hover:text-red-500 transition-all text-sm group">
            <UserX size={20} />
            <span className="font-medium">Deactivate Account</span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-700 pt-10">
          ZenWallet Version 2.4.0 (Build 992)
          <br />
          © 2024 Zen Technologies Ltd.
        </p>
      </div>
    </main>
  );
};

export default Settings;
