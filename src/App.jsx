const API_BASE_URL = "https://task-connect-backend-production.up.railway.app";import React, { useState } from 'react';

export default function App() {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // App Navigation & Data State
  const [currentTab, setCurrentTab] = useState('home');
  const [points, setPoints] = useState(150);
  const [pkrBalance, setPkrBalance] = useState(750);

  // Admin Configurable Settings (Profit Split & Min Withdraw)
  const [userProfitShare, setUserProfitShare] = useState(70); // 70% for user
  const [adminProfitShare, setAdminProfitShare] = useState(30); // 30% for admin
  const [minWithdraw, setMinWithdraw] = useState(500); // Minimum withdrawal limit in PKR
  const [adsEnabled, setAdsEnabled] = useState(true); // Ads toggle

  // Dynamic Tasks (Admin can add any category: Social Media, Telegram, Gaming, etc.)
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Watch YouTube Cyber Video', reward: 50, category: 'Social Media' },
    { id: 2, title: 'Join Official Telegram Group', reward: 40, category: 'Telegram' },
    { id: 3, title: 'Play Cyber Runner Game', reward: 100, category: 'Gaming' }
  ]);

  // Admin Add Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskReward, setNewTaskReward] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Social Media');

  // Group Chat State (with Anti-Link & Anti-Number security)
  const [messages, setMessages] = useState([
    { sender: 'admin@taskconnect.com', text: 'Welcome to Task Connect Global! Earn 70% profit on every task.' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Wallet State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('EasyPaisa');

  // Handle Login / Signup
  const handleAuth = (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return alert('Please enter email and password');
    setIsLoggedIn(true);
  };

  // Complete Task with Profit Calculation (70% to User, 30% tracked for Admin)
  const handleCompleteTask = (task) => {
    const totalReward = task.reward;
    const userEarned = Math.round((totalReward * userProfitShare) / 100);
    
    setPoints(points + userEarned);
    setPkrBalance(pkrBalance + (userEarned * 5));
    alert(`Task completed! You received ${userProfitShare}% (${userEarned} points). Admin share (${adminProfitShare}%) recorded.`);
  };

  // Admin Add Task Handler
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskReward) return alert('Please fill all fields');
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      reward: Number(newTaskReward),
      category: newTaskCategory
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskReward('');
    alert('New task published successfully!');
  };

  // Admin Delete Task Handler
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Send Chat Message with Security (Blocks Links and Phone Numbers / Digits)
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const hasLink = /http|www|\.com|\.net|\.org/i.test(newMessage);
    const hasNumber = /\d/.test(newMessage);

    if (hasLink || hasNumber) {
      alert('Security Alert: Links and phone numbers/digits are strictly prohibited in the chat!');
      setNewMessage('');
      return;
    }

    setMessages([...messages, { sender: authEmail || 'User', text: newMessage }]);
    setNewMessage('');
  };

  // Handle Withdrawal Request based on Admin Min Limit
  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!withdrawAmount || withdrawAmount <= 0) return alert('Enter valid amount');
    if (Number(withdrawAmount) < minWithdraw) return alert(`Minimum withdrawal limit is ${minWithdraw} PKR set by Admin.`);
    if (withdrawAmount > pkrBalance) return alert('Insufficient balance');
    
    setPkrBalance(pkrBalance - Number(withdrawAmount));
    alert(`Withdrawal request of ${withdrawAmount} PKR via ${withdrawMethod} submitted successfully!`);
    setWithdrawAmount('');
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '16px' }}>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '380px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#06b6d4', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#020617', fontSize: '20px', marginBottom: '8px' }}>
              TC
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#22d3ee', margin: 0 }}>Task Connect Global</h1>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' }}>{isSignUp ? 'Create your account' : 'Login to your account'}</p>
          </div>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#020617', color: '#fff', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Password</label>
              <input 
                type="password" 
                placeholder="********"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#020617', color: '#fff', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
            <button 
              type="submit"
              style={{ backgroundColor: '#06b6d4', color: '#020617', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', marginTop: '6px' }}
            >
              {isSignUp ? 'Sign Up' : 'Login'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '16px', cursor: 'pointer' }} onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', paddingBottom: '90px' }}>
      
      {/* Top Banner / Ad Space Banner */}
      <div style={{ backgroundColor: '#059669', color: '#fff', padding: '6px 16px', fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>
        {adsEnabled ? '📢 SPONSORED AD BANNER (Google AdMob Active)' : 'ONLINE CONNECTED - TASK CONNECT GLOBAL'}
      </div>

      {/* Header */}
      <header style={{ padding: '16px', backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#020617', fontSize: '16px' }}>
            TC
          </div>
          <div>
            <h1 style={{ fontWeight: '800', fontSize: '15px', color: '#22d3ee', margin: 0 }}>Task Connect Global</h1>
            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>{authEmail}</p>
          </div>
        </div>
        <div style={{ fontSize: '11px', backgroundColor: '#1e293b', padding: '4px 10px', borderRadius: '20px', color: '#fbbf24', border: '1px solid #334155' }}>
          🟡 {points} Pts
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '16px', maxWidth: '450px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* TAB 1: HOME */}
        {currentTab === 'home' && (
          <>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '16px', padding: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}>
              <p style={{ fontSize: '12px', color: '#22d3ee', fontWeight: '500', margin: 0 }}>Welcome Member</p>
              <h2 style={{ fontSize: '20px', fontWeight: '900', margin: '4px 0 0 0' }}>Dashboard</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
                <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Total Points</div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#fbbf24', marginTop: '2px' }}>🟡 {points}</div>
                </div>
                <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>PKR Balance</div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#34d399', marginTop: '2px' }}>{pkrBalance} PKR</div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '16px', border: '1px solid #1e293b' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#22d3ee', margin: '0 0 8px 0' }}>Profit Distribution Info</h3>
              <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>You get **{userProfitShare}%** of every task reward directly into your wallet. Minimum withdrawal is set to **{minWithdraw} PKR**.</p>
            </div>
          </>
        )}

        {/* TAB 2: TASKS */}
        {currentTab === 'tasks' && (
          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '16px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '12px', marginTop: 0 }}>Available Tasks ({tasks.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tasks.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No tasks available right now.</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '9px', backgroundColor: '#1e293b', color: '#22d3ee', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{task.category}</span>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', margin: '4px 0 0 0' }}>{task.title}</p>
                      <p style={{ fontSize: '10px', color: '#fbbf24', margin: '2px 0 0 0' }}>Reward: +{task.reward} Pts ({userProfitShare}% to you)</p>
                    </div>
                    <button 
                      onClick={() => handleCompleteTask(task)}
                      style={{ backgroundColor: '#06b6d4', color: '#020617', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                    >
                      Complete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: WALLET */}
        {currentTab === 'wallet' && (
          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '16px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#34d399', margin: 0 }}>My Wallet & Withdraw</h3>
            <div style={{ backgroundColor: '#020617', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Available Balance</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#34d399', marginTop: '4px' }}>{pkrBalance} PKR</div>
              <div style={{ fontSize: '10px', color: '#fbbf24', marginTop: '4px' }}>Min Withdraw Limit: {minWithdraw} PKR</div>
            </div>

            <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Select Method</label>
                <select 
                  value={withdrawMethod} 
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#020617', color: '#fff', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                >
                  <option value="EasyPaisa">EasyPaisa</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Amount (PKR)</label>
                <input 
                  type="number" 
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#020617', color: '#fff', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>
              <button 
                type="submit"
                style={{ backgroundColor: '#10b981', color: '#020617', fontWeight: 'bold', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', marginTop: '6px' }}
              >
                Withdraw Funds
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: CHAT (SECURE COMMUNITY GROUP CHAT) */}
        {currentTab === 'chat' && (
          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '16px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', height: '380px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#22d3ee', margin: '0 0 10px 0' }}>Community Group Chat (No Links/Numbers)</h3>
            
            <div style={{ flex: 1, backgroundColor: '#020617', borderRadius: '10px', border: '1px solid #1e293b', padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ backgroundColor: msg.sender === authEmail ? '#0e383c' : '#1e293b', padding: '8px 12px', borderRadius: '8px', maxWidth: '85%', alignSelf: msg.sender === authEmail ? 'flex-end' : 'flex-start' }}>
                  <div style={{ fontSize: '9px', color: '#22d3ee', fontWeight: 'bold', marginBottom: '2px' }}>{msg.sender}</div>
                  <div style={{ fontSize: '12px', color: '#fff' }}>{msg.text}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              <input 
                type="text" 
                placeholder="Type message safely..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', backgroundColor: '#020617', color: '#fff', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <button 
                type="submit"
                style={{ backgroundColor: '#06b6d4', color: '#020617', fontWeight: 'bold', padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px' }}
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: ADMIN PANEL (FULL CONTROL FOR TASKS, ADS, & 70/30 PROFIT SPLIT) */}
        {currentTab === 'admin' && (
          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '16px', border: '1px solid rgba(6, 182, 212, 0.4)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#22d3ee', margin: '0 0 4px 0' }}>👑 Admin Control Center</h3>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Manage profit split, ads, withdrawal limits & tasks.</p>
            </div>

            {/* Profit & Withdrawal Settings */}
            <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#34d399', margin: '0 0 4px 0' }}>App & Profit Settings</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                <span>User Profit Share (%):</span>
                <input 
                  type="number" 
                  value={userProfitShare} 
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setUserProfitShare(val);
                    setAdminProfitShare(100 - val);
                  }}
                  style={{ width: '60px', padding: '4px', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '4px', textAlign: 'center' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                <span>Admin Share (%):</span>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{adminProfitShare}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                <span>Min Withdrawal (PKR):</span>
                <input 
                  type="number" 
                  value={minWithdraw} 
                  onChange={(e) => setMinWithdraw(Number(e.target.value))}
                  style={{ width: '80px', padding: '4px', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '4px
