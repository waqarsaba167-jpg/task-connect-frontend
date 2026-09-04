import React, { useState, useEffect } from 'react';

export default function App() {
  const [currentView, setCurrentView] = useState('login');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  
  // User Form States with Auto-Save support
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);

  // App Data States
  const [balance, setBalance] = useState(12450);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Watch YouTube Video & Earn', reward: 2.50, type: 'youtube' },
    { id: 2, title: 'Follow on Instagram & Stay Updated', reward: 1.20, type: 'instagram' },
    { id: 3, title: 'Subscribe to Official YouTube Channel', reward: 3.00, type: 'youtube' },
    { id: 4, title: 'Like & Share Facebook Post', reward: 0.80, type: 'facebook' },
  ]);

  // Chat States
  const [messages, setMessages] = useState([
    { id: 1, user: 'Admin', text: 'Welcome to TaskConnect Global Official Group! Work hard & earn.', isProof: false }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Admin States
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [withdrawRequests, setWithdrawRequests] = useState([
    { id: 1, user: 'Saba Khan', amount: 500, method: 'EasyPaisa', status: 'Pending' },
    { id: 2, user: 'Ali Raza', amount: 800, method: 'JazzCash', status: 'Pending' }
  ]);

  // Ad simulation every 2 minutes (120,000 ms)
  useEffect(() => {
    const adTimer = setInterval(() => {
      if (user) {
        alert("📢 [Ad Popup]: Sponsored Advertisement loaded! (Admin Revenue Generated)");
      }
    }, 120000);
    return () => clearInterval(adTimer);
  }, [user]);

  // Handle Login / Signup
  const handleAuth = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter email and password!");
      return;
    }
    if (authMode === 'signup' && !username) {
      alert("Please choose a unique username!");
      return;
    }

    // Mock Authentication
    const loggedUser = { email, username: username || email.split('@')[0] };
    setUser(loggedUser);
    setCurrentView('home');
  };

  // Handle Chat Message Send (Blocking links and phone numbers)
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const lowerText = newMessage.toLowerCase();
    const hasPhone = /\d{10,}/.test(newMessage) || /(\+92|03)\d{9}/.test(newMessage);
    const hasLink = lowerText.includes('http') || lowerText.includes('www.') || lowerText.includes('.com');

    if (hasPhone || hasLink) {
      alert("❌ Security Alert: Phone numbers and external links are strictly prohibited in the community chat!");
      return;
    }

    setMessages([...messages, { id: Date.now(), user: user.username, text: newMessage }]);
    setNewMessage('');
  };

  // Handle Task Completion (70% to User, 30% to Admin Pool)
  const completeTask = (task) => {
    const userShare = task.reward * 0.70;
    const adminShare = task.reward * 0.30;
    
    setBalance(prev => prev + userShare);
    alert(`🎉 Task Completed Successfully!\nYou earned $${userShare.toFixed(2)} (30% platform fee allocated to Admin).`);
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-start p-4 md:p-8">
      
      {/* Top Navbar / Header */}
      <header className="w-full max-w-6xl glass-panel rounded-2xl p-4 mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl glow-btn flex items-center justify-center font-bold text-xl">TC</div>
          <div>
            <h1 className="font-bold text-lg tracking-wider">TASK CONNECT GLOBAL</h1>
            <p className="text-xs text-purple-300">Connect • Complete • Earn • Grow</p>
          </div>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm bg-purple-900/50 px-3 py-1 rounded-full border border-purple-500/30">
              👤 {user.username}
            </span>
            <button 
              onClick={() => { setUser(null); setCurrentView('login'); }}
              className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/30"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="w-full max-w-6xl">

        {/* 1. LOGIN / SIGNUP VIEW */}
        {currentView === 'login' && (
          <div className="flex justify-center items-center py-12">
            <div className="glass-panel p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"></div>
              
              <h2 className="text-2xl font-bold text-center mb-2">
                {authMode === 'login' ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-xs text-center text-gray-400 mb-6">Sign in with your browser auto-save enabled credentials</p>

              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Username (Visible in Chat)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. saba_earner" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm"
                      required 
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm"
                    autoComplete="email"
                    required 
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm"
                    autoComplete="current-password"
                    required 
                  />
                </div>

                <button type="submit" className="w-full py-3 rounded-xl glow-btn font-semibold text-sm mt-2">
                  {authMode === 'login' ? 'Login to Account' : 'Register & Start Earning'}
                </button>
              </form>

              <div className="flex justify-between items-center mt-6 text-xs text-gray-400">
                <button 
                  type="button" 
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="hover:text-purple-400 underline"
                >
                  {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setIsAdmin(!isAdmin); setCurrentView('admin'); }}
                  className="text-cyan-400 hover:underline"
                >
                  {isAdmin ? 'User Mode' : 'Admin Portal'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* USER APP NAVIGATION (If logged in and not in admin view) */}
        {user && currentView !== 'admin' && (
          <>
            {/* Bottom/Top Tab Switcher */}
            <div className="flex justify-center space-x-2 md:space-x-4 mb-6 overflow-x-auto pb-2">
              <button onClick={() => setCurrentView('home')} className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition ${currentView === 'home' ? 'glow-btn' : 'glass-panel'}`}>🏠 Home</button>
              <button onClick={() => setCurrentView('tasks')} className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition ${currentView === 'tasks' ? 'glow-btn' : 'glass-panel'}`}>📋 Tasks</button>
              <button onClick={() => setCurrentView('chat')} className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition ${currentView === 'chat' ? 'glow-btn' : 'glass-panel'}`}>💬 Community Chat</button>
              <button onClick={() => setCurrentView('wallet')} className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition ${currentView === 'wallet' ? 'glow-btn' : 'glass-panel'}`}>💳 Wallet</button>
              <button onClick={() => setCurrentView('admin')} className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition border border-cyan-500/30 text-cyan-300`}>⚙️ Admin Panel</button>
            </div>

            {/* 2. HOME DASHBOARD */}
            {currentView === 'home' && (
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl relative overflow-hidden bg-gradient-to-r from-purple-900/40 to-blue-900/40">
                  <h2 className="text-xl font-bold mb-1">Hello, {user.username} 👋</h2>
                  <p className="text-xs text-gray-300 mb-4">Welcome back to your ultimate earning command center.</p>
                  <div className="glass-card p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-400">Total Balance</p>
                      <h3 className="text-2xl font-black text-cyan-400">${balance.toFixed(2)} USD</h3>
                    </div>
                    <button onClick={() => setCurrentView('wallet')} className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-xl text-xs border border-cyan-500/40 hover:bg-cyan-500/30">Withdraw</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-panel p-5 rounded-2xl">
                    <h3 className="font-bold text-sm mb-3 text-purple-300">Quick Actions</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => setCurrentView('tasks')} className="glass-card p-3 rounded-xl text-center hover:bg-white/10 text-xs">📋 Tasks</button>
                      <button onClick={() => setCurrentView('wallet')} className="glass-card p-3 rounded-xl text-center hover:bg-white/10 text-xs">💳 Wallet</button>
                      <button onClick={() => setCurrentView('chat')} className="glass-card p-3 rounded-xl text-center hover:bg-white/10 text-xs">💬 Chat</button>
                    </div>
                  </div>
                  <div className="glass-panel p-5 rounded-2xl">
                    <h3 className="font-bold text-sm mb-3 text-cyan-300">Platform Status</h3>
                    <p className="text-xs text-gray-300">✅ Secure Anti-Fraud Active</p>
                    <p className="text-xs text-gray-300 mt-1">⚡ 70/30 Revenue Split Operational</p>
                    <p className="text-xs text-gray-300 mt-1">🔄 Auto-Ads Interval: Every 2 Minutes</p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. TASKS PAGE */}
            {currentView === 'tasks' && (
              <div className="space-y-4">
                <div className="glass-panel p-5 rounded-3xl flex justify-between items-center">
                  <h2 className="font-bold text-lg">Available Social & Video Tasks</h2>
                  <span className="text-xs text-purple-300 bg-purple-900/40 px-3 py-1 rounded-lg">Instant Payouts</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tasks.map(task => (
                    <div key={task.id} className="glass-panel p-5 rounded-2xl flex justify-between items-center">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-md">{task.type}</span>
                        <h4 className="font-semibold text-sm mt-1">{task.title}</h4>
                        <p className="text-xs text-emerald-400 font-bold mt-1">Reward: ${task.reward.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => completeTask(task)}
                        className="px-4 py-2 rounded-xl glow-btn text-xs font-semibold"
                      >
                        Start Task
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. COMMUNITY CHAT PAGE */}
            {currentView === 'chat' && (
              <div className="glass-panel p-6 rounded-3xl flex flex-col h-[500px]">
                <div className="border-b border-white/10 pb-3 mb-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm">Official Community Group</h3>
                    <p className="text-[10px] text-gray-400">Strictly no phone numbers or links allowed. Earnings proofs only.</p>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full">128 Members Online</span>
                </div>

                {/* Messages Box */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {messages.map(msg => (
                    <div key={msg.id} className={`p-3 rounded-2xl max-w-[80%] text-xs ${msg.user === user.username ? 'ml-auto bg-purple-600/30 border border-purple-500/30' : 'glass-card'}`}>
                      <span className="block font-bold text-[10px] text-cyan-300 mb-1">@{msg.user}</span>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Send Message Input */}
                <form onSubmit={handleSendMessage} className="mt-4 flex gap-2 pt-2 border-t border-white/10">
                  <input 
                    type="text" 
                    placeholder="Type message or share earning proof..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl text-xs"
                  />
                  <button type="submit" className="px-5 py-2.5 glow-btn rounded-xl text-xs font-bold">Send</button>
                </form>
              </div>
            )}

            {/* 5. WALLET PAGE */}
            {currentView === 'wallet' && (
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 to-purple-900/40">
                  <p className="text-xs text-gray-400">My Wallet Balance</p>
                  <h2 className="text-3xl font-black text-cyan-400 mt-1">${balance.toFixed(2)} USD</h2>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => alert("Withdrawal request submitted to Admin for approval!")} className="px-5 py-2.5 glow-btn rounded-xl text-xs font-bold">Request Withdraw</button>
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-3xl">
                  <h3 className="font-bold text-sm mb-3">Supported Payment Methods</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="glass-card p-3 rounded-xl text-center text-xs">easypaisa (Min $5)</div>
                    <div className="glass-card p-3 rounded-xl text-center text-xs">JazzCash (Min $5)</div>
                    <div className="glass-card p-3 rounded-xl text-center text-xs">PayPal (Min $10)</div>
                    <div className="glass-card p-3 rounded-xl text-center text-xs">Crypto / USDT (Min $10)</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* 6. ADMIN PANEL VIEW */}
        {currentView === 'admin' && (
          <div className="space-y-6">
            <div className="glass-panel p-5 rounded-3xl flex justify-between items-center border border-cyan-500/40">
              <div>
                <h2 className="text-xl font-bold text-cyan-300">⚙️ Admin Control Panel (Secure Access)</h2>
                <p className="text-xs text-gray-400">Full system control, task management, and payout oversight.</p>
              </div>
              <button onClick={() => setCurrentView(user ? 'home' : 'login')} className="px-4 py-2 bg-white/10 rounded-xl text-xs hover:bg-white/20">Back to App</button>
            </div>

            {/* Admin Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-panel p-4 rounded-2xl">
                <p className="text-xs text-gray-400">Total Users</p>
                <h3 className="text-xl font-black text-purple-300 mt-1">1,245</h3>
              </div>
              <div className="glass-panel p-4 rounded-2xl">
                <p className="text-xs text-gray-400">Active Tasks</p>
                <h3 className="text-xl font-black text-cyan-300 mt-1">{tasks.length}</h3>
              </div>
              <div className="glass-panel p-4 rounded-2xl">
                <p className="text-xs text-gray-400">Admin Revenue (30%)</p>
                <h3 className="text-xl font-black text-emerald-400 mt-1">$4,120.00</h3>
              </div>
              <div className="glass-panel p-4 rounded-2xl">
                <p className="text-xs text-gray-400">Pending Withdrawals</p>
                <h3 className="text-xl font-black text-amber-400 mt-1">{withdrawRequests.length}</h3>
              </div>
            </div>

            {/* Admin Search Bar & Management */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm">System & User Search Bar</h3>
                <input 
                  type="text" 
                  placeholder="Search user, task, or transaction..." 
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="px-4 py-2 rounded-xl text-xs w-64"
                />
              </div>

              <div>
                <h4 className="font-bold text-xs text-gray-300 mb-2">Pending Withdrawal Approvals</h4>
                <div className="space-y-2">
                  {withdrawRequests.map(req => (
                    <div key={req.id} className="glass-card p-3 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold">{req.user}</span> requests <span className="text-cyan-400 font-bold">${req.amount}</span> via {req.method}
                      </div>
                      <div className="space-x-2">
                        <button onClick={() => alert(`Approved payout for ${req.user}`)} className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30">Approve</button>
                        <button onClick={() => alert(`Rejected payout for ${req.user}`)} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-
