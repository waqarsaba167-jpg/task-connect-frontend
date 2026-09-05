import React, { useState } from 'react';

export default function Auth({ onLoginSuccess }) {
  // Step management: 'welcome', 'login', or 'signup'
  const [step, setStep] = useState('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Yahan backend API call ya authentication logic aayegi
    if (onLoginSuccess) onLoginSuccess();
  };

  // 1. Sabse pehla Welcome Screen ("Get Started" button wala)
  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-gradient)' }}>
        <div className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-2xl text-center text-white space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              TASK CONNECT GLOBAL
            </h1>
            <p className="text-sm text-cyan-200 uppercase tracking-widest">Work • Earn • Connect • Grow</p>
          </div>

          <div className="py-6 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-4xl">🚀</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Start Your Journey</h2>
            <p className="text-xs text-gray-300 mt-1">Join millions and start earning rewards daily.</p>
          </div>

          <button 
            onClick={() => setStep('signup')}
            className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition-all shadow-xl"
          >
            Get Started &rarr;
          </button>
        </div>
      </div>
    );
  }

  // 2. Login / Signup Form (Browser password saving support ke sath)
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-gradient)' }}>
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-2xl text-white space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            {step === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-xs text-cyan-200 mt-1">Task Connect Global Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 'signup' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-cyan-300">Full Name</label>
              <input 
                type="text" 
                required
                name="name"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-cyan-400 text-white text-sm"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-cyan-300">Email Address</label>
            <input 
              type="email" 
              required
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-cyan-400 text-white text-sm"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-cyan-300">Password</label>
            <input 
              type="password" 
              required
              name="password"
              autoComplete={step === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-cyan-400 text-white text-sm"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition-all shadow-lg text-sm uppercase tracking-wider mt-2"
          >
            {step === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            onClick={() => setStep(step === 'login' ? 'signup' : 'login')}
            className="text-xs text-cyan-300 hover:underline focus:outline-none font-medium"
          >
            {step === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
