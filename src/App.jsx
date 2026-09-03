import React, { useState } from 'react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [points, setPoints] = useState(0);
  const [pkrBalance, setPkrBalance] = useState(0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', paddingBottom: '80px' }}>
      
      {/* Top Banner */}
      <div style={{ backgroundColor: '#059669', color: '#fff', padding: '6px 16px', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
        ONLINE CONNECTED - TASK CONNECT GLOBAL
      </div>

      {/* Header */}
      <header style={{ padding: '16px', backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#020617', fontSize: '18px' }}>
            TC
          </div>
          <div>
            <h1 style={{ fontWeight: '800', fontSize: '16px', color: '#22d3ee', margin: 0 }}>Task Connect Global</h1>
            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>Cyberpunk Earning App</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '16px', maxWidth: '400px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* User Card */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '16px', padding: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}>
          <p style={{ fontSize: '12px', color: '#22d3ee', fontWeight: '500', margin: 0 }}>Hello, Demo User</p>
          <h2 style={{ fontSize: '20px', fontWeight: '900', margin: '4px 0 0 0' }}>Welcome Back</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
            <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Points</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#fbbf24', marginTop: '2px' }}>🟡 {points}</div>
            </div>
            <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>PKR Balance</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#34d399', marginTop: '2px' }}>{pkrBalance} PKR</div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '16px', border: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '12px', marginTop: 0 }}>Available Tasks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', margin: 0 }}>Watch Cyber Video</p>
                <p style={{ fontSize: '10px', color: '#94a3b8', margin: '2px 0 0 0' }}>+50 Points Reward</p>
              </div>
              <button 
                onClick={() => { setPoints(points + 50); alert('Task completed! +50 points added.'); }}
                style={{ backgroundColor: '#06b6d4', color: '#020617', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
              >
                Start
              </button>
            </div>
            <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', margin: 0 }}>Join Telegram Channel</p>
                <p style={{ fontSize: '10px', color: '#94a3b8', margin: '2px 0 0 0' }}>+30 Points Reward</p>
              </div>
              <button 
                onClick={() => { setPoints(points + 30); alert('Task completed! +30 points added.'); }}
                style={{ backgroundColor: '#06b6d4', color: '#020617', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
              >
                Start
              </button>
            </div>
          </div>
        </div>

        {/* Admin Panel Box */}
        <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '16px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#22d3ee', margin: '0 0 8px 0' }}>Admin Control Panel</h3>
          <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '0 0 12px 0' }}>Aap yahan se tasks manage aur approve kar sakte hain.</p>
          <button 
            onClick={() => alert('Admin features active!')}
            style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid #06b6d4', color: '#22d3ee', fontWeight: 'bold', padding: '10px', borderRadius: '12px', fontSize: '12px', cursor: 'pointer' }}
          >
            Open Admin Center
          </button>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', padding: '12px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <button onClick={() => setCurrentTab('home')} style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: 'bold', color: currentTab === 'home' ? '#22d3ee' : '#94a3b8', cursor: 'pointer' }}>Home</button>
        <button onClick={() => setCurrentTab('tasks')} style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: 'bold', color: currentTab === 'tasks' ? '#22d3ee' : '#94a3b8', cursor: 'pointer' }}>Tasks</button>
        <button onClick={() => setCurrentTab('wallet')} style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: 'bold', color: currentTab === 'wallet' ? '#22d3ee' : '#94a3b8', cursor: 'pointer' }}>Wallet</button>
        <button onClick={() => setCurrentTab('admin')} style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: 'bold', color: currentTab === 'admin' ? '#22d3ee' : '#94a3b8', cursor: 'pointer' }}>Admin</button>
      </nav>
    </div>
  );
                                               }
