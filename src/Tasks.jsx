import React, { useState } from 'react';

export default function Tasks({ setActiveTab }) {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="min-h-screen pb-24 text-white" style={{ background: 'var(--bg-gradient)' }}>
      {/* Top Header */}
      <div className="p-6 glass-panel border-b border-white/15 flex justify-between items-center">
        <div>
          <p className="text-xs text-cyan-300 uppercase tracking-wider">Earn Rewards</p>
          <h1 className="text-xl font-bold">Task Center & Hub</h1>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-300">Total Balance</span>
          <p className="text-sm font-extrabold text-cyan-300">12,450 Points</p>
        </div>
      </div>

      {/* Special Daily Features (Daily Check-in & Spin Wheel) */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="glass-panel p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-white/10 flex items-center justify-between cursor-pointer hover:border-pink-400/50 transition-all">
          <div>
            <span className="text-2xl">🎁</span>
            <h3 className="text-xs font-bold mt-1">Daily Check-In</h3>
            <p className="text-[10px] text-pink-300">+100 Points Free</p>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-pink-500/20 border border-pink-500/40 text-[10px] font-semibold text-pink-300">
            Claim
          </button>
        </div>

        <div className="glass-panel p-4 rounded-2xl bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-white/10 flex items-center justify-between cursor-pointer hover:border-cyan-400/50 transition-all">
          <div>
            <span className="text-2xl">🎡</span>
            <h3 className="text-xs font-bold mt-1">Lucky Spin Wheel</h3>
            <p className="text-[10px] text-cyan-300">Spin & Win Big</p>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-semibold text-cyan-300">
            Play
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="px-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button 
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === 'all' ? 'bg-cyan-500 text-black font-bold shadow-lg' : 'glass-panel text-gray-300'}`}
        >
          All Tasks
        </button>
        <button 
          onClick={() => setActiveCategory('social')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === 'social' ? 'bg-cyan-500 text-black font-bold shadow-lg' : 'glass-panel text-gray-300'}`}
        >
          Social Media
        </button>
        <button 
          onClick={() => setActiveCategory('videos')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === 'videos' ? 'bg-cyan-500 text-black font-bold shadow-lg' : 'glass-panel text-gray-300'}`}
        >
          Videos & Ads
        </button>
        <button 
          onClick={() => setActiveCategory('web')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === 'web' ? 'bg-cyan-500 text-black font-bold shadow-lg' : 'glass-panel text-gray-300'}`}
        >
          Website & Apps
        </button>
        <button 
          onClick={() => setActiveCategory('gaming')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === 'gaming' ? 'bg-cyan-500 text-black font-bold shadow-lg' : 'glass-panel text-gray-300'}`}
        >
          Gaming
        </button>
      </div>

      {/* Task List Container */}
      <div className="p-4 space-y-3">
        {/* YouTube Task */}
        <div className="glass-panel p-4 rounded-2xl flex justify-between items-center border border-white/10 hover:border-cyan-400/40 transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold">
              ▶
            </div>
            <div>
              <h3 className="text-sm font-semibold">Watch YouTube Video & Subscribe</h3>
              <p className="text-xs text-cyan-300 mt-0.5">Reward: +50 Points • Full Watch</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-xs shadow-lg hover:opacity-90 transition-all">
            Start
          </button>
        </div>

        {/* TikTok Task */}
        <div className="glass-panel p-4 rounded-2xl flex justify-between items-center border border-white/10 hover:border-cyan-400/40 transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gray-800/60 border border-white/20 flex items-center justify-center text-white font-bold">
              🎵
            </div>
            <div>
              <h3 className="text-sm font-semibold">TikTok Video Like & Follow</h3>
              <p className="text-xs text-cyan-300 mt-0.5">Reward: +40 Points</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-xs shadow-lg hover:opacity-90 transition-all">
            Start
          </button>
        </div>

        {/* Instagram Task */}
        <div className="glass-panel p-4 rounded-2xl flex justify-between items-center border border-white/10 hover:border-cyan-400/40 transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold">
              📸
            </div>
            <div>
              <h3 className="text-sm font-semibold">Instagram Post Like & Comment</h3>
              <p className="text-xs text-cyan-300 mt-0.5">Reward: +35 Points</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-xs shadow-lg hover:opacity-90 transition-all">
            Start
          </button>
        </div>

        {/* Facebook Task */}
        <div className="glass-panel p-4 rounded-2xl flex justify-between items-center border border-white/10 hover:border-cyan-400/40 transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center text-blue-400 font-bold">
              f
            </div>
            <div>
              <h3 className="text-sm font-semibold">Facebook Page Like & Follow</h3>
              <p className="text-xs text-cyan-300 mt-0.5">Reward: +30 Points</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-xs shadow-lg hover:opacity-90 transition-all">
            Start
          </button>
        </div>

        {/* Telegram Task */}
        <div className="glass-panel p-4 rounded-2xl flex justify-between items-center border border-white/10 hover:border-cyan-400/40 transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
              ✈
            </div>
            <div>
              <h3 className="text-sm font-semibold">Join Telegram Channel & Group</h3>
              <p className="text-xs text-cyan-300 mt-0.5">Reward: +45 Points</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-xs shadow-lg hover:opacity-90 transition-all">
            Start
          </button>
        </div>

        {/* Website Registration Task */}
        <div className="glass-panel p-4 rounded-2xl flex justify-between items-center border border-white/10 hover:border-cyan-400/40 transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
              🌐
            </div>
            <div>
              <h3 className="text-sm font-semibold">Website Visit & Account Registration</h3>
              <p className="text-xs text-cyan-300 mt-0.5">Reward: +100 Points</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-xs shadow-lg hover:opacity-90 transition-all">
            Start
          </button>
        </div>

        {/* Ads Watch Task */}
        <div className="glass-panel p-4 rounded-2xl flex justify-between items-center border border-white/10 hover:border-cyan-400/40 transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold">
              📺
            </div>
            <div>
              <h3 className="text-sm font-semibold">Sponsored Ad Watch & Earn</h3>
              <p className="text-xs text-cyan-300 mt-0.5">Reward: +25 Points per Ad</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-xs shadow-lg hover:opacity-90 transition-all">
            Watch
          </button>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 p-3 flex justify-around items-center bg-black/80 backdrop-blur-xl z-50">
        <button onClick={() => setActiveTab && setActiveTab('home')} className="flex flex-col items-center text-gray-400 hover:text-cyan-400">
          <span className="text-lg">🏠</span>
          <span className="text-[10px] mt-0.5">Home</span>
        </button>
        <button onClick={() => setActiveTab && setActiveTab('tasks')} className="flex flex-col items-center text-cyan-400">
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
