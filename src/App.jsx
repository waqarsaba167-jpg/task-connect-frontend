import React, { useState, useEffect } from 'react';
import { 
  Home, CheckSquare, MessageSquare, Wallet, ShieldCheck, 
  Play, Users, Gamepad2, Gift, Calendar, ArrowUpRight, 
  ArrowDownLeft, History, Send, AlertTriangle, CheckCircle, 
  Lock, RefreshCw, Trophy, ExternalLink, Settings, Plus, Trash2, Edit3, X, UserCheck, Image as ImageIcon
} from 'lucide-react';

// Backend API URL connected to Railway production
const API_URL = 'https://task-connect-backend-production.up.railway.app';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('tc_token') || '');

  // State for app data
  const [tasks, setTasks] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [transactions, setTransactions] = useState([]);
  
  // Admin management states
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminTasks, setAdminTasks] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', reward: 10, type: 'social', link: '' });
  const [customImage, setCustomImage] = useState('');

  // Initial load & Auth check
  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      // Default Demo User State
      setUser({
        username: 'Demo',
        points: 0,
        pkrBalance: 0,
        usdBalance: 0,
        dailyStreak: 3,
        canClaimDaily: true,
        profileImage: ''
      });
      setDemoMode(true);
    }
    fetchPublicData();
  }, [token]);

  const fetchPublicData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      console.log('Using offline/demo tasks');
      setTasks([
        { id: 1, title: 'Watch Cyber Trailer & Subscribe', reward: 50, type: 'video', link: '#' },
        { id: 2, title: 'Join Telegram Community Group', reward: 30, type: 'social', link: '#' }
      ]);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsAdmin(data.user.isAdmin || false);
        setDemoMode(false);
        if (data.user.isAdmin) {
          fetchAdminData();
        }
      } else {
        localStorage.removeItem('tc_token');
        setToken('');
        setDemoMode(true);
      }
    } catch (e) {
      console.error('Failed to fetch profile', e);
    }
  };

  const fetchAdminData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/data`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data.users || []);
        setAdminTasks(data.tasks || []);
        setPendingApprovals(data.approvals || []);
      }
    } catch (e) {
      console.error('Failed to load admin data');
    }
  };

  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('tc_token', data.token);
        setToken(data.token);
        setDemoMode(false);
        alert('Login Successful!');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (e) {
      alert('Connection error with Railway backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tc_token');
    setToken('');
    setDemoMode(true);
    setIsAdmin(false);
    setIsAdminMode(false);
    setUser({
      username: 'Demo',
      points: 0,
      pkrBalance: 0,
      usdBalance: 0,
      dailyStreak: 3,
      canClaimDaily: true
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20">
      {/* Top Bar Banner */}
      <div className={`py-1.5 px-4 text-xs font-bold text-center flex justify-between items-center ${demoMode ? 'bg-amber-600 text-black' : 'bg-emerald-600 text-white'}`}>
        <span>{demoMode ? 'DEMO MODE - NOT A REAL ACCOUNT - NOTHING SAVED' : 'ONLINE CONNECTED - FULL ACCESS'}</span>
        {demoMode ? (
          <button onClick={() => {
            const u = prompt('Enter Admin/User Username:');
            const p = prompt('Enter Password:');
            if (u && p) handleLogin(u, p);
          }} className="bg-black text-white px-2 py-0.5 rounded text-[10px]">Login</button>
        ) : (
          <button onClick={handleLogout} className="bg-white text-black px-2 py-0.5 rounded text-[10px]">Log out</button>
        )}
      </div>

      {/* Header */}
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-lg shadow-lg shadow-cyan-500/30">
            TC
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wide bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">Task Connect Global</h1>
            <p className="text-[10px] text-slate-400">Cyberpunk Earning Ecosystem</p>
          </div>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 ${isAdminMode ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400 border border-cyan-500/30'}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAdminMode ? 'App View' : 'Admin Panel'}</span>
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 max-w-md w-full mx-auto overflow-y-auto">
        {isAdminMode ? (
          /* Admin Panel View */
          <div className="space-y-6">
            <div className="bg-slate-900 p-4 rounded-2xl border border-cyan-500/30">
              <h2 className="text-sm font-bold text-cyan-400 flex items-center mb-3">
                <Settings className="w-4 h-4 mr-1.5" /> Admin Control Center
              </h2>
              <p className="text-xs text-slate-300 mb-4">Manage tasks, user approvals, profile images, and links globally from here.</p>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Total Users</div>
                  <div className="text-lg font-bold text-cyan-400">{adminUsers.length || 1}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Active Tasks</div>
                  <div className="text-lg font-bold text-emerald-400">{tasks.length}</div>
                </div>
              </div>
            </div>

            {/* Add Task Box */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Add New Earning Task</h3>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Task Title (e.g. Watch Video)" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <div className="flex space-x-2">
                  <input 
                    type="number" 
                    placeholder="Reward Points" 
                    value={newTask.reward}
                    onChange={(e) => setNewTask({...newTask, reward: Number(e.target.value)})}
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <select 
                    value={newTask.type}
                    onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="social">Social Task</option>
                    <option value="video">Video Watch</option>
                    <option value="website">Website Visit</option>
                  </select>
                </div>
                <input 
                  type="text" 
                  placeholder="Target Link / URL" 
                  value={newTask.link}
                  onChange={(e) => setNewTask({...newTask, link: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button 
                  onClick={() => {
                    if(!newTask.title) return alert('Enter task title');
                    setTasks([...tasks, { ...newTask, id: Date.now() }]);
                    setNewTask({ title: '', reward: 10, type: 'social', link: '' });
                    alert('Task added successfully!');
                  }}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20"
                >
                  Publish Task Instantly
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Normal App View */
          <div className="space-y-4">
            {/* User Greeting Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-cyan-500/20 rounded-2xl p-4 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-cyan-400 font-medium">Hello, {user?.username || 'CyberUser'}</p>
                  <h2 className="text-xl font-black mt-0.5 tracking-tight">Task Connect Global</h2>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-cyan-500/40 flex items-center overflow-hidden">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-cyan-400 text-sm">TC</div>
                  )}
                </div>
              </div>

              {/* Balances Grid */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">Points</div>
                  <div className="text-sm font-extrabold text-amber-400 flex items-center mt-0.5">
                    🟡 {user?.points || 0}
                  </div>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">PKR Balance</div>
                  <div className="text-sm font-extrabold text-emerald-400 mt-0.5">
                    {user?.pkrBalance || 0} PKR
                  </div>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">USD Balance</div>
                  <div className="text-sm font-extrabold text-cyan-400 mt-0.5">
                    ${user?.usdBalance || 0.00}
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Bonus Section */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 p-4 rounded-2xl border border-indigo-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-indigo-300 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1" /> 7-Day Daily Bonus
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-medium">Day 3/7</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 my-3">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div key={day} className={`h-10 rounded-lg flex flex-col items-center justify-center text-xs font-bold ${day === 3 ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}>
                    <span>{day}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => alert('Daily bonus claimed successfully!')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs transition shadow-lg shadow-indigo-600/20"
              >
                Claim Day 3 Bonus
              </button>
            </div>

            {/* Quick Access Grid */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Quick Access</h3>
              <div className="grid grid-cols-3 gap-2.5">
                <button onClick={() => setCurrentTab('tasks')} className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-3 rounded-2xl flex flex-col items-center text-center transition">
                  <Play className="w-5 h-5 text-cyan-400 mb-1.5" />
                  <span className="text-[11px] font-medium text-slate-300">Watch Videos</span>
                </button>
                <button onClick={() => setCurrentTab('tasks')} className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-3 rounded-2xl flex flex-col items-center text-center transition">
                  <Users className="w-5 h-5 text-teal-400 mb-1.5" />
                  <span className="text-[11px] font-medium text-slate-300">Social Tasks</span>
                </button>
                <button onClick={() => setCurrentTab('wallet')} className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-3 rounded-2xl flex flex-col items-center text-center transition">
                  <Wallet className="w-5 h-5 text-amber-400 mb-1.5" />
                  <span className="text-[11px] font-medium text-slate-300">Wallet</span>
                </button>
              </div>
            </div>

            {/* AdMob Banner Mock */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>AdMob Banner: ca-app-pub-7670786611041200/7251333813</span>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 p-2 flex justify-around items-center z-50">
        <button onClick={() => { setCurrentTab('home'); setIsAdminMode(false); }} className={`flex flex-col items-center space-y-1 ${currentTab === 'home' && !isAdminMode ? 'text-cyan-400' : 'text-slate-400'}`}>
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>
        <button onClick={() => { setCurrentTab('tasks'); setIsAdminMode(false); }} className={`flex flex-col items-center space-y-1 ${currentTab === 'tasks' && !isAdminMode ? 'text-cyan-400' : 'text-slate-400'}`}>
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px]">Tasks</span>
        </button>
        <button onClick={() => { setCurrentTab('chat'); setIsAdminMode(false); }} className={`flex flex-col items-center space-y-1 ${currentTab === 'chat' && !isAdminMode ? 'text-cyan-400' : 'text-slate-400'}`}>
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Chat</span>
        </button>
        <button onClick={() => { setCurrentTab('wallet'); setIsAdminMode(false); }} className={`flex flex-col items-center space-y-1 ${currentTab === 'wallet' && !isAdminMode ? 'text-cyan-400' : 'text-slate-400'}`}>
          <Wallet className="w-5 h-5" />
          <span className="text-[10px]">Wallet</span>
        </button>
        <button onClick={() => { setIsAdminMode(true); }} className={`flex flex-col items-center space-y-1 ${isAdminMode ? 'text-cyan-400' : 'text-slate-400'}`}>
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px]">Admin</span>
        </button>
      </nav>
    </div>
  );
}
