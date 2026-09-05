import React from 'react';

export default function Home({ setActiveTab }) {
  return (
    <div className="min-h-screen pb-24 text-white" style={{ background: 'var(--bg-gradient)' }}>
      {/* Top Header */}
      <div className="p-6 flex justify-between items-center glass-panel border-b border-white/10">
        <div>
          <p className="text-xs text-cyan-300 uppercase tracking-wider">Welcome back,</p>
          <h1 className="text-xl font-bold">Hello, User! 👋</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300">
          U
        </div>
      </div>

      {/* Main Content Dashboard */}
      <div className="p-4 space-y-6">
        {/* Total Balance Card */}
        <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
          <p className="text-xs text-cyan-200 uppercase tracking-widest font-medium">Total Balance / Points</p>
          <h2 className="text-3xl font-extrabold mt-1 text-white">12,450 <span className="text-sm font-normal text-cyan-300">Points</span></h2>
          
          <div className="flex gap-3 mt-5">
            <button 
              onClick={() => setActiveTab && setActiveTab('wallet')}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-sm shadow-lg hover:opacity-90 transition-all"
            >
              Deposit
            </button>
            <button 
              onClick={() => setActiveTab && setActiveTab('wallet')}
              className="flex-1 py-2.5 rounded-xl bg-white/10 border border-white/20 font-semibold text-sm hover:bg-white/20 transition-all"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300 mb-3">Quick Access</h3>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div onClick={() => setActiveTab && setActiveTab('tasks')} className="glass-panel p-3 rounded-2xl cursor-pointer hover:border-cyan-400/50 transition-all">
              <span className="text-xl">📋</span>
              <p className="text-[10px] mt-1 text-gray-300 font-medium">Tasks</p>
            </div>
            <div onClick={() => setActiveTab && setActiveTab('wallet')} className="glass-panel p-3 rounded-2xl cursor-pointer hover:border-cyan-400/50 transition-all">
              <span className="text-xl">💰</span>
              <p className="text-[10px] mt-1 text-gray-300 font-medium">Wallet</p>
            </div>
            <div onClick={() => setActiveTab && setActiveTab('chat')} className="glass-panel p-3 rounded-2xl cursor-pointer hover:border-cyan-400/50 transition-all">
              <span className="text-xl">💬</span>
              <p className="text-[10px] mt-1 text-gray-300 font-medium">Group Chat</p>
            </div>
            <div className="glass-panel p-3 rounded-2xl cursor-pointer hover:border-cyan-400/50 transition-all">
              <span className="text-xl">🎁</span>
              <p className="text-[10px] mt-1 text-gray-300 font-medium">Refer & Earn</p>
            </div>
          </div>
        </div>

        {/* Recommended Tasks Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Recommended Tasks</h3>
            <span className="text-xs text-cyan-400 cursor-pointer" onClick={() => setActiveTab && setActiveTab('tasks')}>View All</span>
          </div>
          
          <div className="space-y-3">
            <div className="glass-panel p-4 rounded-2xl flex justify-between items-center border border-white/10">
              <div>
                <h4 className="text-sm font-semibold">Watch YouTube Video</h4>
                <p className="text-xs text-cyan-300 mt-0.5">Earn +50 Points</p>
              </div>
              <button 
                onClick={() => setActiveTab && setActiveTab('tasks')}
                className="px-4 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-all"
              >
                Start
              </button>
            </div>

            <div className="glass-panel p-4 rounded-2xl flex justify-between items-center border border-white/10">
              <div>
                <h4 className="text-sm font-semibold">Follow on Instagram</h4>
                <p className="text-xs text-cyan-300 mt-0.5">Earn +20 Points</p>
              </div>
              <button 
                onClick={() => setActiveTab && setActiveTab('tasks')}
                className="px-4 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-all"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar (Jaisa aapne kaha tha bilkul neeche) */}
      <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 p-3 flex justify-around items-center bg-black/80 backdrop-blur-xl z-50">
        <button onClick={() => setActiveTab && setActiveTab('home')} className="flex flex-col items-center text-cyan-400">
          <span className="text-lg">🏠</span>
          <span className="text-[10px] mt-0.5">Home</span>
        </button>
        <button onClick={() => setActiveTab && setActiveTab('tasks')} className="flex flex-col items-center text-gray-400 hover:text-cyan-400">
          <span className="text-lg">📋</span>
          <span className="text-[10px] mt-0.5">Tasks</span>
        </button>
        <button onClick={() => setActiveTab && setActiveTab('tasks')} className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center -mt-5 shadow-lg border-2 border-black">
          <span className="text-xl font-bold">+</span>
        </button>
        <button onClick={() => setActiveTab && setActiveTab('chat')} className="flex flex-col items-center text-gray-400 hover:text-cyan-400">
          <span className="text-lg">💬</span>
          <span className="text-[10px] mt-0.5">Chat</span>
        </button>
        <button onClick={() => setActiveTab && setActiveTab('wallet')} className="flex flex-col items-center text-gray-400 hover:text-cyan-400">
          <span className="text-lg">💰</span>
          <span className="text-[10px] mt-0.5">Wallet</span>
        </button>
      </div>
    </div>
  );
      }
