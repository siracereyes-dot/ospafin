import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative flex flex-col items-center text-center px-6 animate-in fade-in zoom-in duration-1000 ease-out">
        {/* Logo with Pulse */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-2xl animate-ping opacity-20"></div>
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9A5rNpllgwPRmxnmivFoeU4z-9XGBm8yK5Q&s" 
            alt="DepEd Logo" 
            referrerPolicy="no-referrer"
            className="h-32 w-auto object-contain relative z-10"
          />
        </div>

        {/* Branding */}
        <div className="space-y-2">
          <h2 className="text-sm font-black text-indigo-600 tracking-[0.3em] uppercase">DepEd National Capital Region</h2>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            OSPA <span className="text-indigo-600 font-medium">Scorer</span>
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider max-w-xs mx-auto leading-relaxed mt-4">
            Search for Outstanding School Paper Advisers
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-12 w-48 h-1 bg-slate-200 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-indigo-600 animate-[loading_2.5s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; left: 0%; }
          50% { width: 100%; left: 0%; }
          100% { width: 0%; left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;