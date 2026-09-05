import React, { useState } from 'react';

export default function AdminPanel({ setActiveTab }) {
  const [minWithdraw, setMinWithdraw] = useState('1000');
  const [referralBonus, setReferralBonus] = useState('250');
  const [announcement, setAnnouncement] = useState('Welcome to TaskConnect Global! Complete tasks daily.');
  const [adTimer, setAdTimer] = useState('2');
  const [appLogoUrl, setAppLogoUrl] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('App');
  const [newTaskReward, setNewTaskReward] = useState('');
  const [newTaskLink, setNewTaskLink] = useState('');

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Watch YouTube Promo Video', category: 'YouTube', reward: 50, link: 'https://youtube.com' },
    { id: 2, title: 'Download TaskConnect App V2', category: 'App', reward: 150, link: 'https://play.google.com' }
  ]);

  const [withdrawRequests, setWithdrawRequests] = useState([
    { id: 1, user: 'Ali Raza', method: 'JazzCash', amount: '5,000 Pts', details: '0300-1234567', status: 'Pending', reason: '' },
    { id: 2, user: 'Sarah Khan', method: 'PayPal', amount: '12,000 Pts', details: 'sarah.fx@gmail.com', status: 'Pending', reason: '' }
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'Ali Raza', email: 'ali@gmail.com', points: '12,450', status: 'Active' },
    { id: 2, name: 'Sarah Khan', email: 'sarah@gmail.com', points: '8,300', status: 'Active' }
  ]);

  const [rejectionInput, setRejectionInput] = useState({});

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedMessage("✅ All global settings & branding updated successfully!");
    setTimeout(() => setSavedMessage(''), 4000);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskReward || !newTaskLink) return;
    setTasks([...tasks, { id: Date.now(), title: newTaskTitle, category: newTaskCategory, reward: Number(newTaskReward), link: newTaskLink }]);
    setNewTaskTitle('');
    setNewTaskReward('');
    setNewTaskLink('');
    setSavedMessage("✅ New task added successfully for all users!");
    setTimeout(() => setSavedMessage(''), 4000);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleWithdrawAction = (id, actionType) => {
    setWithdrawRequests(withdrawRequests.map(req => {
      if (req.id === id) {
        return { 
          ...req, 
          status: actionType, 
          reason: actionType === 'Rejected' ? (rejectionInput[id] || 'Did not meet requirements') : '' 
        };
      }
      return req;
    }));
  };

  const handleToggleBlockUser = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' };
      }
      return u;
    }));
  };

  return (
    <div className="min-h-screen pb-28 text-white flex flex-col justify-between" style={{ background: 'var(--bg-gradient)' }}>
      
      {/* Top Header */}
      <div className="p-6 glass-panel border-b border-white/15 flex justify-between items-center bg-black/70 backdrop-blur-md">
        <div>
          <span className="text-[10px] bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-purple-500/40">
            Master Control
          </span>
          <h1 className="text-xl font-bold mt-1">Admin Panel Dashboard</h1>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-300">Access</span>
          <p className="text-sm font-extrabold text-cyan-400">👑 Full Control</p>
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        
        {savedMessage && (
          <div className="p-3 rounded-xl text-xs text-center font-semibold bg-green-500/20 border border-green-500/40 text-green-300">
            {savedMessage}
          </div>
        )}

        {/* 1. App Branding & Logo (DP) Control */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-cyan-300">🖼️ App Logo / DP & Branding</h3>
          <div className="space-y-2">
            <label className="text-[10px] text-gray-300 uppercase block">App Logo Image URL / Direct Link</label>
            <input 
              type="text" 
              value={appLogoUrl}
              onChange={(e) => setAppLogoUrl(e.target.value)}
              placeholder="Paste image link here for App DP"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <button 
              onClick={() => setSavedMessage("✅ App DP / Logo updated globally!")}
              className="w-full py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs hover:bg-cyan-500/30 transition-all"
            >
              Update App Logo / DP
            </button>
          </div>
        </div>

        {/* 2. Global System & Financial Controls */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-cyan-300">⚙️ Financial & Ads Controls</h3>
          <form onSubmit={handleSaveSettings} className="space-y-3">
            <div>
              <label className="text-[10px] text-gray-300 uppercase block mb-1">Minimum Withdrawal Limit (Points)</label>
              <input type="number" value={minWithdraw} onChange={(e) => setMinWithdraw(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400" />
            </div>
            <div>
              <label className="text-[10px] text-gray-300 uppercase block mb-1">Referral Bonus (Points per Invite)</label>
              <input type="number" value={referralBonus} onChange={(e) => setReferralBonus(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400" />
            </div>
            <div>
              <label className="text-[10px] text-gray-300 uppercase block mb-1">Interstitial Ad Interval Timer (Minutes)</label>
              <input type="number" value={adTimer} onChange={(e) => setAdTimer(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400" />
            </div>
            <div>
              <label className="text-[10px] text-gray-300 uppercase block mb-1">Global Announcement Banner</label>
              <input type="text" value={announcement} onChange={(e) => setAnnouncement(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400" />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 font-bold text-xs text-white shadow-lg">Save Settings</button>
          </form>
        </div>

        {/* 3. Dynamic Task Creator (Add/Delete Tasks, Apps, Websites, Games) */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-cyan-300">➕ Add New Task (App / Website / Game / Social)</h3>
          <form onSubmit={handleAddTask} className="space-y-3">
            <div>
              <label className="text-[10px] text-gray-300 uppercase block mb-1">Task Title</label>
              <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="e.g. Play Ludo Game & Earn" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-300 uppercase block mb-1">Category</label>
                <select value={newTaskCategory} onChange={(e) => setNewTaskCategory(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
                  <option value="App">Mobile App</option>
                  <option value="Website">Website</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-300 uppercase block mb-1">Reward Points</label>
                <input type="number" value={newTaskReward} onChange={(e) => setNewTaskReward(e.target.value)} placeholder="100" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400" />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-300 uppercase block mb-1">Task Link / URL</label>
              <input type="text" value={newTaskLink} onChange={(e) => setNewTaskLink(e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400" />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-black">Publish Task Live</button>
          </form>

          {/* Active Tasks List with Delete option */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <p className="text-xs font-semibold text-gray-300">Manage Active Tasks:</p>
            {tasks.map(t => (
              <div key={t.id} className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div>
                  <p className="font-bold">{t.title} <span className="text-[10px] text-cyan-300">({t.category})</span></p>
                  <p className="text-[10px] text-green-400">Reward: {t.reward} Pts</p>
                </div>
                <button onClick={() => handleDeleteTask(t.id)} className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 text-[10px]">Delete</button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Withdrawal Approvals & Rejections with Reason */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-cyan-300">💸 Withdrawal Requests & Proof Moderation</h3>
          <div className="space-y-3">
            {withdrawRequests.map((req) => (
              <div key={req.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-white text-sm">{req.user} <span className="text-[10px] text-cyan-300">({req.method})</span></p>
                    <p className="text-[11px] text-gray-300">Amount: <span className="font-semibold text-green-400">{req.amount}</span></p>
                    <p className="text-[10px] text-yellow-300">Account: {req.details}</p>
                    {req.reason && <p className="text-[10px] text-red-400">Rejection Reason: {req.reason}</p>}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    req.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                    req.status === 'Approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                    'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>{req.status}</span>
                </div>

                {req.status === 'Pending' && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <input 
                      type="text" 
                      placeholder="Reason if rejecting (e.g. Invalid proof)"
                      onChange={(e) => setRejectionInput({...rejectionInput, [req.id]: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleWithdrawAction(req.id, 'Approved')} className="flex-1 py-1 rounded-lg bg-green-600/30 border border-green-500/40 text-green-300 font-bold text-[11px]">✔ Approve</button>
                      <button onClick={() => handleWithdrawAction(req.id, 'Rejected')} className="flex-1 py-1 rounded-lg bg-red-600/30 border border-red-500/40 text-red-300 font-bold text-[11px]">✖ Reject</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 5. User Management & Blocking */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-cyan-300">👥 Member / User Management</h3>
          <div className="space-y-2">
            {users.map(u => (
              <div key={u.id} className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div>
                  <p className="font-bold">{u.name} <span className="text-[10px] text-gray-400">({u.email})</span></p>
                  <p className="text-[10px] text-cyan-300">Points: {u.points} | Status: <span className={u.status === 'Active' ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{u.status}</span></p>
                </div>
                <button 
                  onClick={() => handleToggleBlockUser(u.id)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${u.status === 'Active' ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-green-500/20 text-green-300 border-green-500/40'}`}
                >
                  {u.status === 'Active' ? 'Block User' : 'Unblock'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 p-3 flex justify-around items-center bg-black/80 backdrop-blur-xl z-50">
        <button onClick={() => setActiveTab && setActiveTab('home')} className="flex flex-col items-center text-gray-400 hover:text-cyan-400"><span className="text-lg">🏠</span><span className="text-[10px] mt-0.5">Home</span></button>
        <button onClick={() => setActiveTab && setActiveTab('tasks')} className="flex flex-col items-center text-gray-400 hover:text-cyan-400"><span className="text-lg">📋</span><span className="text-[10px] mt-0.5">Tasks</span></button>
        <button onClick={() => setActiveTab && setActiveTab('tasks')} className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center -mt-5 shadow-lg border-2 border-black"><span className="text-xl font-bold">+</span></button>
        <button onClick={() => setActiveTab && setActiveTab('chat')} className="flex flex-col items-center text-gray-400 hover:text-gray-400"><span className="text-lg">💬</span><span className="text-[10px] mt-0.5">Chat</span></button>
        <button onClick={() => setActiveTab && setActiveTab('wallet')} className="flex flex-col items-center text-gray-400 hover:text-cyan-400"><span className="text-lg">💰</span><span className="text-[10px] mt-0.5">Wallet</span></button>
      </div>

    </div>
  );
}
