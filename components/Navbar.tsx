
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Send, 
  History, 
  MessageSquare, 
  User, 
  Settings,
  LogOut
} from 'lucide-react';
import { auth } from '../firebase';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/send-money', icon: Send, label: 'Send' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 glass-dark border-r border-white/10 p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-xl">Z</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">ZenWallet</span>
        </div>

        <div className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <button 
          onClick={() => auth.signOut()}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all mt-auto"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-dark border-t border-white/10 flex justify-around items-center px-4 z-50">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`p-2 rounded-xl transition-all ${
                isActive ? 'text-indigo-400' : 'text-slate-500'
              }`}
            >
              <Icon size={24} />
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
