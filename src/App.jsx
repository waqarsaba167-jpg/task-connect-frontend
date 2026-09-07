import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Tasks from './Tasks';
import Wallet from './Wallet';
import Chat from './Chat';
import AdminPanel from './AdminPanel';
import Auth from './Auth';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ fontFamily: 'sans-serif' }}>
        {/* Navigation Menu taake aap har feature tak easily ja sakein */}
        <nav style={{ padding: '12px', background: '#1e1e1e', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
          <Link to="/tasks" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Tasks</Link>
          <Link to="/wallet" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Wallet</Link>
          <Link to="/chat" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Chat</Link>
          <Link to="/admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Admin Panel</Link>
          <Link to="/auth" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Login/Auth</Link>
        </nav>

        {/* Saari files aur features yahan automatic load honge */}
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
