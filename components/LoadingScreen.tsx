
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950 z-[9999]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <div className="mt-4 text-center font-medium text-slate-400">ZenWallet</div>
      </div>
    </div>
  );
};

export default LoadingScreen;
