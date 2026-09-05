import React, { useState } from 'react';

export default function Wallet({ setActiveTab }) {
  const [copied, setCopied] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('JazzCash');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [accountDetails, setAccountDetails] = useState('');
  const [message, setMessage] = useState('');

  const referralLink = "https://taskconnect-global.up.railway.app/ref/user123";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!withdrawAmount || !accountDetails) {
      setMessage("⚠️ Please fill in all withdrawal details.");
      return;
    }
    setMessage("✅ Withdrawal request submitted successfully! Pending Admin approval.");
    setWithdrawAmount('');
    setAccountDetails('');
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="min-h-screen pb-28 text-white flex flex-col justify-between" style={{ background: 'var(--bg-gradient)' }}>
      
      {/* Top Header */}
      <div className="p-6 glass-panel border-b border-white/15 flex justify-between items-center">
        <div>
          <p className="text-xs text-cyan-300 uppercase tracking-wider">Financial Hub</p>
          <h1 className="text-xl font-bold">Wallet & Payments</h1>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-300">Status</span>
          <p className="text-sm font-extrabold text-green-400">● Secure</p>
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        
        {/* Main Balance Card */}
        <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-cyan-900/40 via-purple-900/40 to-blue-900/40 border border-cyan-500/30 text-center shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
          <span className="text-xs text-cyan-300 uppercase tracking-widest font-semibold">Available Points</span>
          <h2 className="text-4xl font-extrabold text-white mt-1 mb-2">12,450 <span className="text-lg text-cyan-400">Pts</span></h2>
          <p className="text-xs text-gray-300 mb-4">≈ $12.45 USD (Global Exchange)</p>
          
          <div className="flex gap-3 justify-center">
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-black shadow-lg hover:opacity-90 transition-all">
              Withdraw
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 font-bold text-xs text-white hover:bg-white/20 transition-all">
              Deposit
            </button>
          </div>
        </div>

        {/* Withdrawal Form Section with Local & International Methods */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-cyan-300">Select Withdrawal Method</h3>
          
          {/* Method Selector Grid */}
          <div className="grid grid-cols-3 gap-2">
            {['JazzCash', 'EasyPaisa', 'PayPal', 'Crypto (USDT)', 'Payeer', 'Wise'].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setSelectedMethod(method)}
                className={`p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  selectedMethod === method 
                    ? 'bg-cyan-500 text-black border-cyan-400 shadow-lg font-bold' 
                    : 'glass-panel text-gray-300 border-white/10 hover:border-cyan-400/40'
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-xs text-center font-semibold border ${message.includes('✅') ? 'bg-green-500/20 border-green-500/40 text-green-300' : 'bg-red-500/20 border-red-500/40 text-red-300'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleWithdraw} className="space-y-3 pt-2">
            <div>
              <label className="text-[10px] text-gray-300 uppercase tracking-wider block mb-1">Enter Points to Withdraw</label>
              <input 
                type="number" 
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="e.g. 5000 Points"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-300 uppercase tracking-wider block mb-1">{selectedMethod} Account / Wallet ID / Crypto Address</label>
              <input 
                type="text" 
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                placeholder={`Enter your ${selectedMethod} details`}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-black shadow-lg hover:opacity-90 transition-all"
            >
              Submit Withdrawal Request ({selectedMethod})
            </button>
          </form>
          
          <p className="text-[10px] text-gray-400 text-center">
            * Minimum limit, fees, and approval status are fully controlled by Admin Panel.
          </p>
        </div>

        {/* Refer & Earn Section */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 text-xl font-bold">
              🔗
            </div>
            <div>
              <h3 className="text-sm font-semibold">Refer & Earn Program</h3>
              <p className="text-xs text-cyan-300">Invite friends & earn commission points!</p>
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 p-3 rounded-xl flex items-center justify-between">
            <span className="text-xs text-gray-300 truncate mr-2">{referralLink}</span>
            <button 
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-xs font-semibold text-cyan-300 whitespace-nowrap hover:bg-cyan-500/30 transition-all"
            >
              {copied ? "Copied! ✅" : "Copy Link"}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center">
            * Referral reward points can be updated anytime from the Admin Panel.
          </p>
        </div>

      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 p-3 flex justify-around items-center bg-black/80 backdrop-blur-xl z-50">
        <button onClick={() => setActiveTab && setActiveTab('home')} className="flex flex-col items-center text-gray-400 hover:text-cyan-400">
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
        <button onClick={() => setActiveTab && setActiveTab('wallet')} className="flex flex-col items-center text-cyan-400">
          <span className="text-lg">💰</span>
          <span className="text-[10px] mt-0.5">Wallet</span>
        </button>
      </div>

    </div>
  );
}
