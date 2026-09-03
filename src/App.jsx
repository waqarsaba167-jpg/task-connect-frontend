import React, { useState } from 'react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [points, setPoints] = useState(0);
  const [pkrBalance, setPkrBalance] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20">
      {/* Top Banner */}
      <div className="bg-emerald-600 text-white py-1.5 px-4 text-xs font-bold text-center">
        ONLINE CONNECTED - TASK CONNECT GLOBAL
      </div>

      {/* Header */}
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center font-black text-slate-950 text-lg">
            TC
          </div>
          <div>
            <h1 className="font-extrabold text-base text-cyan-400">Task Connect Global</h1>
            <p className="text-[10px] text-slate-400">Cyberpunk Earning App</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-md w-full mx-auto space-y-4">
        {/* User Card */}
        <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-4 shadow-xl">
          <p className="text-xs text-cyan-400 font-medium">Hello, Demo User</p>
          <h2 className="text-xl font-black mt-0.5">Welcome Back</h2>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Points</div>
              <div className="text-sm font-extrabold text-amber-400 mt-0.5">🟡 {points}</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">PKR Balance</div>
              <div className="text-sm font-extrabold text-emerald-400 mt-0.5">{pkrBalance} PKR</div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Available Tasks</h3>
          <div className="space-y-2">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-white">Watch Cyber Video</p>
                <p className="text-[10px] text-slate-400">+50 Points Reward</p>
              </div>
              <button 
                onClick={() => { setPoints(points + 50); alert('Task completed! +50 points added.'); }}
                className="bg-cyan-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                Start
              </button>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-white">Join Telegram Channel</p>
                <p className="text-[10px] text-slate-400">+30 Points Reward</p>
              </div>
              <button 
                onClick={() => { setPoints(points + 30); alert('Task completed! +30 points added.'); }}
                className="bg-cyan-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                Start
              </button>
            </div>
          </div>
        </div>

        {/* Admin Panel Box */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-cyan-500/20">
          <h3 className="text-xs font-bold text-cyan-400 mb-2">Admin Control Panel</h3>
          <p className="text-xs text-slate-300 mb-3">Aap yahan se tasks manage aur approve kar sakte hain.</p>
          <button 
            onClick={() => alert('Admin features active!')}
            className="w-full bg-slate-800 border border-cyan-500 text-cyan-400 font-bold py-2 rounded-xl text-xs"
          >
            Open Admin Center
          </button>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-3 flex justify-around items-center">
        <button onClick={() => setCurrentTab('home')} className={`text-xs font-bold ${currentTab === 'home' ? 'text-cyan-400' : 'text-slate-400'}`}>Home</button>
        <button onClick={() => setCurrentTab('tasks')} className={`text-xs font-bold ${currentTab === 'tasks' ? 'text-cyan-400' : 'text-slate-400'}`}>Tasks</button>
        <button onClick={() => setCurrentTab('wallet')} className={`text-xs font-bold ${currentTab === 'wallet' ? 'text-cyan-400' : 'text-slate-400'}`}>Wallet</button>
        <button onClick={() => setCurrentTab('admin')} className={`text-xs font-bold ${currentTab === 'admin' ? 'text-cyan-400' : 'text-slate-400'}`}>Admin</button>
      </nav>
    </div>
  );
}
