
import React from 'react';
import { UserProfile } from '../types';
import { Camera, Shield, Mail, Phone, Calendar, BadgeCheck } from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  return (
    <main className="md:ml-64 p-6 pb-24 md:pb-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-3xl overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
            <div className="absolute -bottom-16 left-8 flex items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 bg-slate-900 border-4 border-slate-950 rounded-3xl flex items-center justify-center text-4xl font-bold text-indigo-500 overflow-hidden">
                  {profile.name.charAt(0)}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 rounded-xl text-white shadow-lg">
                  <Camera size={16} />
                </button>
              </div>
              <div className="pb-4">
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  {profile.name}
                  <BadgeCheck size={24} className="text-indigo-400" />
                </h1>
                <p className="text-slate-400">Account ID: {profile.uid.slice(0,12)}...</p>
              </div>
            </div>
          </div>
          <div className="pt-20 pb-8 px-8 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] glass p-4 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500">KYC Status</p>
                <p className="text-sm font-bold text-white uppercase">{profile.kycStatus}</p>
              </div>
            </div>
            <div className="flex-1 min-w-[200px] glass p-4 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Member Since</p>
                <p className="text-sm font-bold text-white">{new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-6">Personal Information</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="text-slate-500" size={20} />
                <div>
                  <p className="text-xs text-slate-500">Email Address</p>
                  <p className="text-white font-medium">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-slate-500" size={20} />
                <div>
                  <p className="text-xs text-slate-500">Phone Number</p>
                  <p className="text-white font-medium">{profile.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-10 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all font-bold">
              Edit Profile
            </button>
          </div>

          <div className="glass p-8 rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-6">Security Overview</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl flex justify-between items-center">
                <span className="text-slate-300">Biometric Login</span>
                <div className="w-12 h-6 bg-indigo-600 rounded-full relative">
                  <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-md"></div>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl flex justify-between items-center">
                <span className="text-slate-300">2FA Security</span>
                <div className="w-12 h-6 bg-slate-700 rounded-full relative">
                  <div className="absolute top-1 left-1 w-4 h-4 bg-slate-400 rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-6 leading-relaxed">
              Your account security is our top priority. Last login was from London, UK on May 12, 2024.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
