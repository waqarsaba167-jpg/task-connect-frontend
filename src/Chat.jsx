import React, { useState } from 'react';

export default function Chat({ setActiveTab, userEmail = "user@gmail.com", userAvatar = null }) {
  const defaultName = userEmail ? userEmail.split('@')[0].replace(/[._]/g, ' ') : "Member";
  const formattedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

  const [messages, setMessages] = useState([
    { id: 1, sender: "Admin", text: "Welcome to TaskConnect Global Community! 🎉 Share your earning proofs here. Strictly no links or phone numbers allowed.", time: "10:00 AM", color: "from-purple-900/60 to-indigo-900/60 border-purple-500/40" },
    { id: 2, sender: "Sarah Khan", text: "Just received my withdrawal! This app is 100% legit. 🔥 [Earning Proof Attached]", time: "10:15 AM", color: "from-pink-900/50 to-purple-900/50 border-pink-500/40" },
    { id: 3, sender: "Ali Raza", text: "Completed all my daily tasks and spin wheel. Earned 500 points today!", time: "10:20 AM", color: "from-blue-900/50 to-cyan-900/50 border-blue-500/40" }
  ]);

  const [inputText, setInputText] = useState('');
  const [warning, setWarning] = useState('');

  const containsSpam = (text) => {
    const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/gi;
    const phonePattern = /(\+?\d{1,4}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/g;
    return urlPattern.test(text) || phonePattern.test(text);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (containsSpam(inputText)) {
      setWarning("⚠️ Warning: Sending external links or phone numbers is strictly prohibited! You will be blocked.");
      setTimeout(() => setWarning(''), 5000);
      return;
    }

    setWarning('');
    const newMessage = {
      id: messages.length + 1,
      sender: formattedName,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: "from-cyan-600 to-blue-600 border-cyan-400/30" // Aapke message ka special vibrant color
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="min-h-screen pb-28 text-white flex flex-col justify-between" style={{ background: 'var(--bg-gradient)' }}>
      
      {/* Top Header */}
      <div className="p-4 glass-panel border-b border-white/15 flex justify-between items-center fixed top-0 left-0 right-0 z-40 bg-black/70 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white border border-white/20 overflow-hidden shadow-md">
            {userAvatar ? (
              <img src={userAvatar} alt="DP" className="w-full h-full object-cover" />
            ) : (
              <span>{formattedName.charAt(0)}</span>
            )}
          </div>
          <div>
            <h1 className="text-sm font-bold">Global Community Chat</h1>
            <p className="text-[10px] text-cyan-300">🟢 Live • Earning Proofs & Discussion</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-lg border border-cyan-500/30">
            Secure Chat
          </span>
        </div>
      </div>

      {/* Warning Alert Banner */}
      {warning && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-red-600/90 text-white text-xs p-3 rounded-xl shadow-lg border border-red-400 text-center animate-bounce">
          {warning}
        </div>
      )}

      {/* Messages Container */}
      <div className="p-4 pt-24 space-y-4 overflow-y-auto flex-1">
        <div className="text-center my-2">
          <span className="text-[10px] text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Messages are monitored. No links or phone numbers allowed.
          </span>
        </div>

        {messages.map((msg) => {
          const isMyMessage = msg.sender === formattedName;
          return (
            <div key={msg.id} className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center space-x-1.5 mb-1">
                <span className="text-[10px] text-cyan-300 font-semibold">{msg.sender}</span>
                {msg.sender === "Admin" && <span className="text-[9px] bg-purple-500 text-white px-1.5 py-0.2 rounded font-bold">ADMIN</span>}
                <span className="text-[9px] text-gray-400">{msg.time}</span>
              </div>
              
              <div className={`p-3 rounded-2xl max-w-[80%] text-xs shadow-md border bg-gradient-to-r ${msg.color} ${
                isMyMessage ? 'rounded-tr-none text-white' : 'glass-panel rounded-tl-none text-gray-100'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Input & Proof Button Area */}
      <div className="fixed bottom-16 left-0 right-0 p-3 bg-black/90 backdrop-blur-xl border-t border-white/10 z-40">
        <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
          <button 
            type="button" 
            onClick={() => setInputText("[Earning Proof Screenshot Attached] 💰✨ ")}
            className="px-3 py-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-[10px] text-purple-300 font-semibold whitespace-nowrap hover:bg-purple-500/30 transition-all"
            title="Attach Proof"
          >
            📷 Proof
          </button>
          
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message or share earnings..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all"
          />

          <button 
            type="submit"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-black shadow-lg hover:opacity-90 transition-all"
          >
            Send
          </button>
        </form>
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
        <button onClick={() => setActiveTab && setActiveTab('chat')} className="flex flex-col items-center text-cyan-400">
          <span className="text-lg">💬</span>
          <span className="text-[10px] mt-0.5">Chat</span>
        </button>
        <button onClick={() => setActiveTab && setActiveTab('wallet')} className="flex flex-col items-center text-gray-400 hover:text-gray-400">
          <span className="text-lg">💰</span>
          <span className="text-[10px] mt-0.5">Wallet</span>
        </button>
      </div>

    </div>
  );
      }
