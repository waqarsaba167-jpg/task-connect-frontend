import React, { useState, useEffect } from 'react';

export default function App() {
  const [currentView, setCurrentView] = useState('login');
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(12450);
  
  const [tasks] = useState([
    { id: 1, title: 'Watch YouTube Video & Earn', reward: 2.50, type: 'youtube' },
    { id: 2, title: 'Follow on Instagram & Stay Updated', reward: 1.20, type: 'instagram' },
    { id: 3, title: 'Subscribe to Official YouTube Channel', reward: 3.00, type: 'youtube' },
    { id: 4, title: 'Like & Share Facebook Post', reward: 0.80, type: 'facebook' },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, user: 'Admin', text: 'Welcome to TaskConnect Global Official Group! Work hard & earn.' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [adminSearch, setAdminSearch] = useState('');
  
  const [withdrawRequests] = useState([
    { id: 1, user: 'Saba Khan', amount: 500, method: 'EasyPaisa', status: 'Pending' },
    { id: 2, user: 'Ali Raza', amount: 800, method: 'JazzCash', status: 'Pending' }
  ]);

  useEffect(() => {
    const adTimer = setInterval(() => {
      if (user) alert("📢 [Ad Popup]: Sponsored Advertisement loaded!");
    }, 120000);
    return () => clearInterval(adTimer);
  }, [user]);

  const handleAuth = (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Enter email & password!");
    if (authMode === 'signup' && !username) return alert("Choose a username!");
    setUser({ email, username: username || email.split('@')[0] });
    setCurrentView('home');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (/\d{10,}/.test(newMessage) || /http|www\.|\.com/i.test(newMessage)) {
      return alert("❌ Links and phone numbers are prohibited!");
    }
    setMessages([...messages, { id: Date.now(), user: user.username, text: newMessage }]);
    setNewMessage('');
  };

  const completeTask = (task) => {
    setBalance(prev => prev + task.reward * 0.70);
    alert(`🎉 Task Completed! Earned $${(task.reward * 0.70).toFixed(2)}`);
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-4">
      <header className="w-full max-w-4xl bg-slate-800 p-4 rounded-xl mb-4 flex justify-between items-center shadow-lg">
        <h1 className="font-bold text-lg tracking-wider">TASK CONNECT GLOBAL</h1>
        {user && <button onClick={() => {setUser(null); setCurrentView('login');}} className="bg-red-500/20 text-red-300 px-3 py-1 rounded border border-red-500/30">Logout</button>}
      </header>

      <main className="w-full max-w-4xl">
        {currentView === 'login' && (
          <div className="bg-slate-800 p-6 rounded-2xl max-w-md mx-auto mt-10 shadow-2xl border border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-center">{authMode === 'login' ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === 'signup' && (
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Username</label>
                  <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2.5 rounded bg-slate-700 text-sm" required />
                </div>
              )}
              <div>
                <label className="text-xs text-gray-300 block mb-1">Email</label>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2.5 rounded bg-slate-700 text-sm" required />
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1">Password</label>
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2.5 rounded bg-slate-700 text-sm" required />
              </div>
              <button type="submit" className="w-full bg-purple-600 p-3 rounded-xl font-bold text-sm mt-2 hover:bg-purple-500">{authMode === 'login' ? 'Login' : 'Register'}</button>
            </form>
            <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-xs text-purple-400 mt-4 underline block mx-auto">
              {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>
        )}

        {user && (
          <div className="space-y-4">
            <div className="flex gap-2 justify-center overflow-x-auto pb-2">
              <button onClick={() => setCurrentView('home')} className="bg-slate-700 px-4 py-2 rounded-xl text-xs font-medium hover:bg-slate-600">Home</button>
              <button onClick={() => setCurrentView('tasks')} className="bg-slate-700 px-4 py-2 rounded-xl text-xs font-medium hover:bg-slate-600">Tasks</button>
              <button onClick={() => setCurrentView('chat')} className="bg-slate-700 px-4 py-2 rounded-xl text-xs font-medium hover:bg-slate-600">Chat</button>
              <button onClick={() => setCurrentView('wallet')} className="bg-slate-700 px-4 py-2 rounded-xl text-xs font-medium hover:bg-slate-600">Wallet</button>
              <button onClick={() => setCurrentView('admin')} className="bg-cyan-700 px-4 py-2 rounded-xl text-xs font-medium hover:bg-cyan-600">Admin</button>
            </div>

            {currentView === 'home' && (
              <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
                <h2 className="text-lg font-bold">Welcome, {user.username}! 👋</h2>
                <p className="text-gray-400 text-xs mt-1">Your earning command center is active.</p>
                <div className="mt-4 bg-slate-700/50 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400">Total Balance</p>
                    <p className="text-cyan-400 text-2xl font-black mt-1">${balance.toFixed(2)} USD</p>
                  </div>
                  <button onClick={() => setCurrentView('wallet')} className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-xl text-xs border border-cyan-500/30">Withdraw</button>
                </div>
              </div>
            )}

            {currentView === 'tasks' && (
              <div className="grid gap-3">
                {tasks.map(t => (
                  <div key={t.id} className="bg-slate-800 p-4 rounded-2xl flex justify-between items-center border border-slate-700">
                    <div>
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded uppercase">{t.type}</span>
                      <h4 className="font-semibold text-sm mt-1">{t.title}</h4>
                      <p className="text-emerald-400 text-xs font-bold mt-1">Reward: ${t.reward.toFixed(2)}</p>
                    </div>
                    <button onClick={() => completeTask(t)} className="bg-purple-600 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-purple-500">Start Task</button>
                  </div>
                ))}
              </div>
            )}

            {currentView === 'chat' && (
              <div className="bg-slate-800 p-4 rounded-2xl flex flex-col h-96 border border-slate-700">
                <div className="border-b border-slate-700 pb-2 mb-3">
                  <h3 className="font-bold text-sm">Official Community Group</h3>
                  <p className="text-[10px] text-gray-400">No phone numbers or links allowed.</p>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1">
                  {messages.map(m => (
                    <div key={m.id} className="bg-slate-700/80 p-3 rounded-xl text-xs">
                      <span className="text-cyan-300 font-bold block mb-0.5">@{m.user}</span>
                      <p>{m.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-700">
                  <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type message..." className="flex-1 p-2.5 rounded-xl bg-slate-700 text-xs" />
                  <button type="submit" className="bg-purple-600 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-purple-500">Send</button>
                </form>
              </div>
            )}

            {currentView === 'wallet' && (
              <div className="bg-slate-800 p-6 rounded-2xl space-y-4 border border-slate-700">
                <h2 className="font-bold text-lg">My Wallet</h2>
                <p className="text-cyan-400 text-2xl font-black">${balance.toFixed(2)} USD</p>
                <button onClick={() => alert("Withdrawal request submitted!")} className="bg-purple-600 px-5 py-2.5 rounded-xl text-xs font-bold">Request Withdraw</button>
              </div>
            )}

            {currentView === 'admin' && (
              <div className="bg-slate-800 p-6 rounded-2xl space-y-4 border border-cyan-500/40">
                <h2 className="font-bold text-cyan-300 text-base">⚙️ Admin Panel</h2>
                <input type="text" placeholder="Search user..." value={adminSearch} onChange={e => setAdminSearch(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-700 text-xs" />
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-300">Pending Withdrawals</h3>
                  {withdrawRequests.map(r => (
                    <div key={r.id} className="bg-slate-700/60 p-3 rounded-xl flex justify-between items-center text-xs border border-slate-700">
                      <span><strong>{r.user}</strong> requests <span className="text-cyan-400">${r.amount}</span> ({r.method})</span>
                      <div className="space-x-1">
                        <button onClick={() => alert("Approved")} className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-lg border border-emerald-500/30">Approve</button>
                        <button onClick={() => alert("Rejected")} className="bg-red-500/20 text-red-300 px-3 py-1 rounded-lg border border-red-500/30">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
