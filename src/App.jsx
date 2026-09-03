import React, { useState, useEffect, useRef } from "react";
import {
  Star, Sparkles, Home, CheckSquare, MessageCircle, Wallet, ShieldCheck,
  User, Play, Youtube, Instagram, Twitter, Smartphone, Gamepad2, Gift,
  Copy, Camera, Edit2, LogOut, X, Check, ChevronRight, TrendingUp, Users,
  DollarSign, Send, AlertTriangle, Ban, ThumbsUp, ThumbsDown, Plus,
  Settings, BarChart3, Upload, Link as LinkIcon, Lock, Flame, ArrowLeft,
  Filter, Clock, CircleCheck, CircleX, Award, CreditCard, Share2, Image as ImageIcon
} from "lucide-react";

const AVATARS = ["🧑", "👩", "👨", "🧔", "👩‍💼", "👨‍💼", "🦸", "🧑‍🎨"];

// ---------------------------------------------------------------------------
// AdMob configuration
// NOTE: AdMob's SDK only runs inside a compiled native app (via
// react-native-google-mobile-ads, the Capacitor AdMob plugin, or native
// Android/iOS code) — it cannot load or render real ads inside a browser
// preview like this one. These IDs are wired through as the single source of
// truth for every ad surface in the app; when this UI is ported into a
// native shell, swap the placeholder <BannerAdSlot>/rewarded-ad overlay
// markup for the native SDK's <BannerAd unitId={ADMOB_BANNER_AD_ID} /> and
// RewardedAd.createForAdRequest(ADMOB_REWARDED_AD_ID) calls respectively.
// ---------------------------------------------------------------------------
const ADMOB_BANNER_AD_ID = "ca-app-pub-7670786611041200/7251333813";
const ADMOB_REWARDED_AD_ID = "ca-app-pub-7670786611041200/6824008730";

// ---------------------------------------------------------------------------
// Backend wiring
// ---------------------------------------------------------------------------
// Point this at your real backend. In this chat preview there is no way for
// this file to reach a server running on your own computer (they're on
// different machines) — this only works once you run this project on your
// own machine/website, pointed at your backend's real address (localhost:4000
// while developing locally, or your deployed server's URL once it's live).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // some backend routes (like /postback) return plain text, not JSON —
    // not relevant here since the frontend never calls those directly
  }

  if (!res.ok) {
    const err = new Error((data && data.error) || `Request failed (${res.status})`);
    err.data = data; // preserves any extra fields a route sends alongside `error`, e.g. chat's strikes/banned
    throw err;
  }
  return data;
}

// ---------------------------------------------------------------------------
// What's actually wired to the real backend right now, vs. what's still
// local-only demo behavior:
//   ✅ Real: register/login (with pending-approval gate), profile load, DP
//      upload/removal, tasks (list/create/edit/remove), reward claims
//      (daily bonus/ad view/task proof — server-verified per-task amounts,
//      one-time-per-task), chat (server-enforced link/strike moderation),
//      wallet withdrawals + history, admin member management (approve/
//      reject/ban/remove), admin withdrawal approve/reject, admin settings
//      (min withdrawal, PKR rate, daily bonus rate, ad frequency,
//      announcement, payment gateways), real offerwall network status.
//   🔶 Still local-only: "Add Balance" (deliberately — no real payment
//      collection should exist without proper licensing, see earlier
//      discussion), and per-network offerwall link management beyond status
//      display (those credentials live in backend env vars, not a DB CRUD
//      UI, on purpose — see README).
//   Demo Mode bypasses all of the above entirely — it's a local-only UI
//   walkthrough with no backend calls at all, clearly labeled in the app.
// ---------------------------------------------------------------------------

const CATEGORY_ICON = {
  Social: Instagram,
  "Website Visits": LinkIcon,
  "Ad Views": Play,
  Games: Gamepad2,
};

const TASK_CATEGORIES = ["Social", "Website Visits", "Ad Views", "Games"];

function classNames(...c) {
  return c.filter(Boolean).join(" ");
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm px-4 py-2 rounded-full shadow-lg animate-pulse">
      {message}
    </div>
  );
}

function BannerAdSlot() {
  return (
    <div className="w-full h-12 rounded-xl bg-cyan-500/10 border border-dashed border-purple-300 flex items-center justify-center gap-2 shrink-0">
      <Play size={13} className="text-cyan-300" />
      <div className="text-center leading-tight">
        <p className="text-[10px] font-semibold text-cyan-400">AdMob Banner</p>
        <p className="text-[8px] text-cyan-300">{ADMOB_BANNER_AD_ID}</p>
      </div>
    </div>
  );
}

function Logo({ size = 22 }) {
  return (
    <div className="relative flex items-center justify-center">
      <Sparkles size={size} className="text-cyan-400" />
      <Star size={size * 0.5} className="text-blue-400 absolute -top-1 -right-1" fill="currentColor" />
    </div>
  );
}

function GradientButton({ children, onClick, className = "", disabled = false, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-2xl shadow-[0_0_20px_rgba(0,180,255,0.35)] active:scale-95 transition disabled:opacity-40 disabled:active:scale-100 disabled:shadow-none",
        className
      )}
    >
      {children}
    </button>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center bg-slate-900/50">
      <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] w-full rounded-t-3xl p-5 max-h-[85%] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-100 text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full bg-[#05070c]">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function TaskConnectGlobal() {
  const [screen, setScreen] = useState("auth");
  const [authMode, setAuthMode] = useState("login");
  const [toast, setToastMsg] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [showProfile, setShowProfile] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    id: "",
    joined: "",
    country: "Pakistan",
    avatar: "🧑",
    photo: null,
    points: 0,
    pkr: 0,
    usd: 0,
    referrals: 0,
    referralCode: "",
    role: "user",
    paymentMethod: { type: "EasyPaisa", account: "" },
  });

  // Tracks points earned in this session ("today") — drives the daily earning
  // target progress shown on Home. Resets to 0 on a fresh app load, standing
  // in for a real day-boundary reset a backend would handle.
  const [dailyEarnedPoints, setDailyEarnedPoints] = useState(0);

  function earnPoints(amount) {
    setUser((u) => ({ ...u, points: u.points + amount }));
    setDailyEarnedPoints((d) => d + amount);
  }

  const showToast = (m) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg(null), 2200);
  };

  // ---------- Auth ----------
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", referral: "" });
  const [authToken, setAuthToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [isDemoSession, setIsDemoSession] = useState(false);

  // Loads the real profile from the backend and merges it into local user
  // state. Fields the backend doesn't store yet (avatar, payment method) are
  // left as whatever's already in local state.
  async function loadProfile(token) {
    const data = await apiRequest("/user/me", { token });
    setUser((u) => ({
      ...u,
      name: data.name,
      email: data.email,
      id: data.id,
      points: data.points,
      pkr: data.pkrEquivalent,
      referralCode: data.referralCode,
      role: data.role,
      photo: data.photo, // persisted server-side — survives reload/re-login now
    }));
  }

  async function handleAuthSubmit(e) {
    e.preventDefault();
    if (!authForm.email || !authForm.password) {
      showToast("Please fill in email & password");
      return;
    }
    if (authMode === "signup" && !authForm.name) {
      showToast("Please enter your name");
      return;
    }

    setAuthLoading(true);
    try {
      const path = authMode === "signup" ? "/auth/register" : "/auth/login";
      const body =
        authMode === "signup"
          ? { name: authForm.name, email: authForm.email, password: authForm.password, referralCode: authForm.referral || undefined }
          : { email: authForm.email, password: authForm.password };

      const data = await apiRequest(path, { method: "POST", body });

      if (authMode === "signup") {
        // New accounts start pending — no token issued until an admin
        // approves. Switch to login mode so they can try once approved.
        showToast("Account created — awaiting admin approval before you can log in");
        setAuthMode("login");
        setAuthForm({ name: "", email: authForm.email, password: "", referral: "" });
        return;
      }

      setAuthToken(data.token);
      setIsDemoSession(false);
      await loadProfile(data.token);
      setScreen("main");
      showToast("Welcome back!");
    } catch (err) {
      showToast(err.message || "Couldn't reach the server — is the backend running?");
    } finally {
      setAuthLoading(false);
    }
  }

  function handleDemoAccess() {
    // Local-only sandbox — no backend account, nothing persists, and it
    // can't be used to test real withdrawals or offerwall crediting.
    // Deliberately starts at zero, same as a real new account would —
    // no illustrative/fake numbers, per the "remove all dummy balances"
    // request. It's a UI walkthrough, not a populated example.
    setUser((u) => ({ ...u, name: "Demo", email: "", id: "DEMO", referralCode: "DEMO-MODE" }));
    setIsDemoSession(true);
    setAuthToken(null);
    setScreen("main");
    showToast("Demo access granted (not a real account — starts at zero)");
  }

  function handleLogout() {
    setAuthToken(null);
    setIsDemoSession(false);
    setScreen("auth");
  }

  // ---------- Daily bonus ----------
  const [streak, setStreak] = useState({ day: 3, claimedToday: false, claimed: [true, true, true, false, false, false, false] });

  function claimDaily() {
    if (streak.claimedToday) return;
    const idx = streak.day - 1;
    const nextClaimed = [...streak.claimed];
    nextClaimed[idx] = true;
    setStreak({ ...streak, claimedToday: true, claimed: nextClaimed });

    if (isDemoSession || !authToken) {
      const amount = 10 * streak.day;
      earnPoints(amount);
      setUser((u) => ({ ...u, pkr: u.pkr + 5 * streak.day }));
      showToast(`Day ${streak.day} bonus claimed! +${amount} ⭐ (demo — not saved)`);
      return;
    }

    apiRequest("/rewards/claim", { method: "POST", token: authToken, body: { type: "daily_bonus", day: streak.day } })
      .then((data) => {
        setUser((u) => ({ ...u, points: data.newBalance, pkr: u.pkr + 5 * streak.day }));
        showToast(`Day ${streak.day} bonus claimed! +${data.pointsAwarded} ⭐`);
      })
      .catch((err) => showToast(err.message || "Couldn't claim bonus"));
  }

  // ---------- Tasks — loaded live from the backend, no static seed data ----------
  const [tasks, setTasks] = useState([]);
  const [taskFilter, setTaskFilter] = useState("All");
  const [proofTask, setProofTask] = useState(null);
  const [proofText, setProofText] = useState("");
  const [visitTimers, setVisitTimers] = useState({}); // { taskId: secondsLeft }
  const [visitReady, setVisitReady] = useState({}); // { taskId: true } once timer completes
  const [adTaskOverlay, setAdTaskOverlay] = useState(null); // task currently being "watched"

  // Normalizes a task row from the backend (snake_case, active as 0/1) into
  // the shape the rest of this component already expects.
  function normalizeTask(t) {
    return { id: t.id, title: t.title, category: t.category, reward: t.reward, link: t.link || "", done: !!t.completed };
  }

  async function loadTasks() {
    if (isDemoSession || !authToken) return; // demo sessions have no real tasks to load
    try {
      const data = await apiRequest("/tasks", { token: authToken });
      setTasks(data.tasks.map(normalizeTask));
    } catch (err) {
      showToast(err.message || "Couldn't load tasks");
    }
  }

  useEffect(() => {
    if (authToken) {
      loadTasks();
      loadSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitTimers((prev) => {
        let changed = false;
        const next = { ...prev };
        Object.keys(next).forEach((id) => {
          if (next[id] > 0) {
            next[id] -= 1;
            changed = true;
            if (next[id] === 0) {
              setVisitReady((r) => ({ ...r, [id]: true }));
            }
          }
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function startWebsiteVisit(task) {
    if (task.link) {
      try {
        window.open(task.link, "_blank", "noopener,noreferrer");
      } catch (e) {
        // window opening may be blocked in this preview environment — ignore
      }
    }
    setVisitTimers((v) => ({ ...v, [task.id]: 30 }));
    showToast("Visiting site — reward unlocks in 30s");
  }

  function watchAdTask(task) {
    setAdTaskOverlay(task);
  }

  function closeAdTask() {
    if (adTaskOverlay) {
      const t = adTaskOverlay;

      if (isDemoSession || !authToken) {
        setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: true } : x)));
        earnPoints(t.reward);
        showToast(`Ad watched! +${t.reward} ⭐ (demo — not saved)`);
      } else {
        apiRequest("/rewards/claim", { method: "POST", token: authToken, body: { type: "ad_view", taskId: t.id } })
          .then((data) => {
            setUser((u) => ({ ...u, points: data.newBalance }));
            setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: true } : x)));
            showToast(`Ad watched! +${data.pointsAwarded} ⭐`);
          })
          .catch((err) => showToast(err.message || "Couldn't credit this ad view"));
      }
    }
    setAdTaskOverlay(null);
  }

  function openProofModal(task) {
    setProofTask(task);
    setProofText("");
  }

  function submitProof() {
    if (!proofText.trim()) {
      showToast("Add a screenshot note or URL first");
      return;
    }
    const task = proofTask;

    if (isDemoSession || !authToken) {
      setTasks((ts) => ts.map((t) => (t.id === task.id ? { ...t, done: true } : t)));
      earnPoints(task.reward);
      showToast(`Proof submitted! +${task.reward} ⭐ (demo — not saved)`);
      setProofTask(null);
      return;
    }

    apiRequest("/rewards/claim", { method: "POST", token: authToken, body: { type: "task_proof", taskId: task.id } })
      .then((data) => {
        setUser((u) => ({ ...u, points: data.newBalance }));
        setTasks((ts) => ts.map((t) => (t.id === task.id ? { ...t, done: true } : t)));
        showToast(`Proof submitted! +${data.pointsAwarded} ⭐`);
      })
      .catch((err) => showToast(err.message || "Couldn't submit proof"))
      .finally(() => setProofTask(null));
  }

  const filteredTasks = tasks.filter((t) => taskFilter === "All" || t.category === taskFilter);
  const completedTasksCount = tasks.filter((t) => t.done).length;

  // ---------- Chat ----------
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [strikes, setStrikes] = useState(0);
  const [banned, setBanned] = useState(false);
  const [showLinkWarning, setShowLinkWarning] = useState(false);
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [chatTab, setChatTab] = useState("group");
  const adTimerRef = useRef(null);

  const URL_REGEX = /(https?:\/\/|www\.)[^\s]+/i; // used only as an instant local pre-check; the server is authoritative

  async function loadChatMessages() {
    if (isDemoSession || !authToken) return;
    try {
      const data = await apiRequest("/chat/messages", { token: authToken });
      setChatMessages(data.messages.map((m) => ({ id: m.id, user: m.user_name, text: m.text, mine: m.user_id === user.id })));
    } catch (err) {
      showToast(err.message || "Couldn't load chat");
    }
  }

  useEffect(() => {
    if (activeTab === "chat" && authToken && !isDemoSession) loadChatMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, authToken]);

  async function sendChatMessage() {
    if (banned) return;
    if (!chatInput.trim()) return;

    if (isDemoSession || !authToken) {
      // Demo mode has no backend to moderate against — simulate the same
      // rule locally so the UX is representative, clearly not real.
      if (URL_REGEX.test(chatInput)) {
        setShowLinkWarning(true);
        const newStrikes = strikes + 1;
        setStrikes(newStrikes);
        if (newStrikes >= 3) setBanned(true);
        setChatInput("");
        return;
      }
      setChatMessages((m) => [...m, { id: "u" + Date.now(), user: user.name, text: chatInput, mine: true }]);
      setChatInput("");
      return;
    }

    const text = chatInput;
    setChatInput("");
    try {
      const data = await apiRequest("/chat/messages", { method: "POST", token: authToken, body: { text } });
      setChatMessages((m) => [...m, { id: data.message.id, user: data.message.user_name, text: data.message.text, mine: true }]);
    } catch (err) {
      // The backend itself enforces the link rule and strike count — this
      // branch fires on a real 403 from the server, not a local guess.
      if (err.data && err.data.strikes !== undefined) {
        setShowLinkWarning(true);
        setStrikes(err.data.strikes);
        if (err.data.banned) setBanned(true);
      } else {
        showToast(err.message || "Couldn't send message");
      }
    }
  }

  useEffect(() => {
    if (activeTab === "chat" && !adTimerRef.current) {
      adTimerRef.current = setInterval(() => {
        setShowAdOverlay(true);
      }, settings.adFrequencyMin * 60 * 1000);
    }
    if (activeTab !== "chat" && adTimerRef.current) {
      clearInterval(adTimerRef.current);
      adTimerRef.current = null;
    }
    return () => {
      if (activeTab !== "chat" && adTimerRef.current) {
        clearInterval(adTimerRef.current);
        adTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ---------- Wallet ----------
  // "Add Balance" stays local-only demo behavior — there's no backend route
  // for it yet (that needs real payment-gateway integration, not just a
  // button). Withdrawals are real: they call the backend, which is the
  // actual source of truth for what's pending/approved/rejected.
  const [transactions, setTransactions] = useState([]);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({ gateway: "EasyPaisa", account: "", amountPoints: "" });
  const [walletLoading, setWalletLoading] = useState(false);

  async function loadWithdrawals() {
    if (!authToken) return; // demo sessions have no real history to load
    try {
      const data = await apiRequest("/wallet/withdrawals", { token: authToken });
      const mapped = data.withdrawals.map((w) => ({
        id: w.id,
        type: "Withdraw",
        amount: `${w.amount_pkr.toLocaleString()} PKR`,
        gateway: w.gateway,
        status: w.status.charAt(0).toUpperCase() + w.status.slice(1),
        date: new Date(w.created_at).toLocaleDateString(),
      }));
      setTransactions(mapped);
    } catch (err) {
      showToast(err.message || "Couldn't load transaction history");
    }
  }

  async function submitWithdraw() {
    const pts = parseInt(withdrawForm.amountPoints, 10);
    if (!withdrawForm.account || !pts) {
      showToast("Fill in account number & amount");
      return;
    }
    if (isDemoSession || !authToken) {
      showToast("Demo mode can't submit real withdrawals — create a real account first");
      return;
    }

    setWalletLoading(true);
    try {
      await apiRequest("/wallet/withdraw", {
        method: "POST",
        token: authToken,
        body: { gateway: withdrawForm.gateway, accountNumber: withdrawForm.account, amountPoints: pts },
      });
      setShowWithdraw(false);
      setWithdrawForm({ gateway: "EasyPaisa", account: "", amountPoints: "" });
      showToast("Withdrawal request submitted");
      await loadWithdrawals();
      await loadProfile(authToken); // refresh balance — points were just deducted
    } catch (err) {
      showToast(err.message || "Withdrawal failed");
    } finally {
      setWalletLoading(false);
    }
  }

  // Load real withdrawal history whenever we get a real logged-in session
  // (right after login/register, and again whenever the tab is opened so it
  // reflects any admin approve/reject that happened elsewhere).
  useEffect(() => {
    if (authToken) loadWithdrawals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, activeTab]);

  // ---------- Admin ----------
  // Loaded live from the backend (GET /settings), not hardcoded. Empty
  // shell here — populated by loadSettings() below once available.
  const [settings, setSettings] = useState({
    minWithdrawalPoints: 100,
    pkrPerPoint: 2.0,
    dailyBonusPerDay: 10,
    announcement: "",
    adFrequencyMin: 2,
    paymentOptions: [],
    theme: "Purple",
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [allMembers, setAllMembers] = useState([]); // real users from the backend, all statuses
  const [adminWithdrawals, setAdminWithdrawals] = useState([]); // pending withdrawal requests, admin view
  const [networkStatus, setNetworkStatus] = useState([]); // real configured/not-configured per offerwall network
  const [adminTab, setAdminTab] = useState("users");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", category: "Social", reward: "", link: "" });
  const [editTask, setEditTask] = useState(null); // task object being edited, or null
  const [newPaymentOption, setNewPaymentOption] = useState("");

  const isRealAdmin = !isDemoSession && authToken && user.role === "admin";

  // Any logged-in user can read settings (announcement, pkrPerPoint, etc
  // are needed outside Admin too) — loaded once a real session exists.
  async function loadSettings() {
    if (isDemoSession || !authToken) return;
    try {
      const data = await apiRequest("/settings", { token: authToken });
      setSettings(data);
      setSettingsLoaded(true);
    } catch (err) {
      showToast(err.message || "Couldn't load settings");
    }
  }

  async function saveSettings(partial) {
    if (!isRealAdmin) {
      showToast("Admin access required to change settings");
      return;
    }
    try {
      const data = await apiRequest("/settings", { method: "PUT", token: authToken, body: partial });
      setSettings(data);
      showToast("Settings saved");
    } catch (err) {
      showToast(err.message || "Couldn't save settings");
    }
  }

  async function loadAdminUsers() {
    if (!isRealAdmin) return;
    try {
      const data = await apiRequest("/admin/users", { token: authToken });
      setAllMembers(data.users);
    } catch (err) {
      showToast(err.message || "Couldn't load members");
    }
  }

  async function loadAdminWithdrawals() {
    if (!isRealAdmin) return;
    try {
      const data = await apiRequest("/admin/withdrawals?status=pending", { token: authToken });
      setAdminWithdrawals(data.withdrawals);
    } catch (err) {
      showToast(err.message || "Couldn't load withdrawal requests");
    }
  }

  async function loadNetworkStatus() {
    if (!isRealAdmin) return;
    try {
      const data = await apiRequest("/admin/networks", { token: authToken });
      setNetworkStatus(data.networks);
    } catch (err) {
      showToast(err.message || "Couldn't load offerwall network status");
    }
  }

  // Load everything admin-related once we know this is a real admin account.
  useEffect(() => {
    if (isRealAdmin) {
      loadAdminUsers();
      loadAdminWithdrawals();
      loadNetworkStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRealAdmin]);

  async function approveMember(id) {
    try {
      await apiRequest(`/admin/users/${id}/approve`, { method: "POST", token: authToken });
      showToast("Member approved");
      loadAdminUsers();
    } catch (err) {
      showToast(err.message || "Couldn't approve member");
    }
  }

  async function rejectMember(id) {
    try {
      await apiRequest(`/admin/users/${id}/reject`, { method: "POST", token: authToken });
      showToast("Member request rejected");
      loadAdminUsers();
    } catch (err) {
      showToast(err.message || "Couldn't reject member");
    }
  }

  async function toggleBanUser(member) {
    const action = member.status === "active" ? "ban" : "unban";
    try {
      await apiRequest(`/admin/users/${member.id}/${action}`, { method: "POST", token: authToken });
      showToast(action === "ban" ? "Member banned" : "Member unbanned");
      loadAdminUsers();
    } catch (err) {
      showToast(err.message || "Couldn't update member status");
    }
  }

  async function removeUser(id) {
    try {
      await apiRequest(`/admin/users/${id}`, { method: "DELETE", token: authToken });
      showToast("Member removed");
      loadAdminUsers();
    } catch (err) {
      showToast(err.message || "Couldn't remove member");
    }
  }

  async function reviewWithdrawal(id, decision) {
    const action = decision === "Approved" ? "approve" : "reject";
    try {
      await apiRequest(`/admin/withdrawals/${id}/${action}`, { method: "POST", token: authToken });
      showToast(`Withdrawal ${action}d`);
      loadAdminWithdrawals();
    } catch (err) {
      showToast(err.message || "Couldn't update withdrawal");
    }
  }

  async function addCustomTask() {
    if (!newTask.title || !newTask.reward) {
      showToast("Fill in title and reward");
      return;
    }
    if (newTask.category === "Website Visits" && !newTask.link) {
      showToast("Website Visits tasks need a link");
      return;
    }
    try {
      await apiRequest("/tasks", {
        method: "POST",
        token: authToken,
        body: { title: newTask.title, category: newTask.category, reward: parseInt(newTask.reward, 10), link: newTask.link || null },
      });
      setNewTask({ title: "", category: "Social", reward: "", link: "" });
      setShowAddTask(false);
      showToast("Task published — now live for all users");
      loadTasks();
    } catch (err) {
      showToast(err.message || "Couldn't publish task");
    }
  }

  function openEditTask(task) {
    setEditTask({ ...task, reward: String(task.reward) });
  }

  async function saveEditedTask() {
    if (!editTask.title || !editTask.reward) {
      showToast("Fill in title and reward");
      return;
    }
    if (editTask.category === "Website Visits" && !editTask.link) {
      showToast("Website Visits tasks need a link");
      return;
    }
    try {
      await apiRequest(`/tasks/${editTask.id}`, {
        method: "PUT",
        token: authToken,
        body: { title: editTask.title, category: editTask.category, reward: parseInt(editTask.reward, 10), link: editTask.link || null },
      });
      setEditTask(null);
      showToast("Task updated live");
      loadTasks();
    } catch (err) {
      showToast(err.message || "Couldn't update task");
    }
  }

  async function removeTask(id) {
    try {
      await apiRequest(`/tasks/${id}`, { method: "DELETE", token: authToken });
      showToast("Task removed");
      loadTasks();
    } catch (err) {
      showToast(err.message || "Couldn't remove task");
    }
  }

  function addPaymentOption() {
    if (!newPaymentOption.trim()) return;
    const updated = [...settings.paymentOptions, newPaymentOption.trim()];
    setSettings((s) => ({ ...s, paymentOptions: updated }));
    setNewPaymentOption("");
    saveSettings({ paymentOptions: updated });
  }

  function removePaymentOption(opt) {
    const updated = settings.paymentOptions.filter((p) => p !== opt);
    setSettings((s) => ({ ...s, paymentOptions: updated }));
    saveSettings({ paymentOptions: updated });
  }

  const activeMembers = allMembers.filter((m) => m.status === "active" || m.status === "banned");
  const pendingMembersList = allMembers.filter((m) => m.status === "pending");
  const totalMemberPoints = activeMembers.reduce((a, m) => a + m.points, 0);

  // ---------- Profile ----------
  const [profileForm, setProfileForm] = useState({ name: user.name, email: user.email });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [paymentForm, setPaymentForm] = useState({ type: "EasyPaisa", account: "" });
  const fileInputRef = useRef(null);

  function saveProfile() {
    setUser((u) => ({ ...u, name: profileForm.name || u.name, email: profileForm.email || u.email }));
    showToast("Profile updated");
  }

  function resetPassword() {
    if (!pwForm.current || !pwForm.next || pwForm.next !== pwForm.confirm) {
      showToast("Check your password fields");
      return;
    }
    setPwForm({ current: "", next: "", confirm: "" });
    setShowPasswordReset(false);
    showToast("Password updated");
  }

  // Resizes/compresses an image file down to a reasonable profile-photo size
  // before it's stored anywhere — raw phone photos are often several MB,
  // which is both slow to store and would get rejected by the backend's
  // size cap. Caps the longest side at 512px and re-encodes as JPEG.
  function compressImageToDataUrl(file, maxDim = 512, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const reader = new FileReader();
      reader.onload = () => {
        img.onload = () => {
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file");
      return;
    }

    let dataUrl;
    try {
      dataUrl = await compressImageToDataUrl(file);
    } catch (err) {
      showToast("Couldn't process that image — try a different photo");
      return;
    }

    setUser((u) => ({ ...u, photo: dataUrl }));

    if (isDemoSession || !authToken) {
      showToast("Profile photo updated (demo — not saved permanently)");
      return;
    }

    try {
      await apiRequest("/user/photo", { method: "PUT", token: authToken, body: { photo: dataUrl } });
      showToast("Profile photo updated");
    } catch (err) {
      showToast(err.message || "Photo shows locally but couldn't be saved — try again");
    }
  }

  async function removePhoto() {
    setUser((u) => ({ ...u, photo: null }));

    if (isDemoSession || !authToken) return;

    try {
      await apiRequest("/user/photo", { method: "PUT", token: authToken, body: { photo: null } });
    } catch (err) {
      showToast(err.message || "Couldn't remove the saved photo — try again");
    }
  }

  function savePaymentMethod() {
    if (!paymentForm.account.trim()) {
      showToast("Enter an account number first");
      return;
    }
    setUser((u) => ({ ...u, paymentMethod: { ...paymentForm } }));
    showToast("Payment method saved");
  }

  function copyReferral() {
    const link = `https://taskconnect.app/join/${user.referralCode}`;
    try {
      navigator.clipboard.writeText(link);
    } catch (e) {
      // clipboard unavailable in this environment — ignore
    }
    showToast("Referral link copied!");
  }

  function copyReferralCode() {
    try {
      navigator.clipboard.writeText(user.referralCode);
    } catch (e) {
      // clipboard unavailable — ignore
    }
    showToast("Referral code copied!");
  }

  async function shareReferral() {
    const link = `https://taskconnect.app/join/${user.referralCode}`;
    const shareData = { title: "Task Connect Global", text: "Join me on Task Connect Global and start earning!", url: link };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch (e) {
      // user cancelled or share unsupported — fall through to copy
    }
    try {
      navigator.clipboard.writeText(link);
    } catch (e) {
      // ignore
    }
    showToast("Link copied — share it anywhere!");
  }

  // ================= RENDER =================

  if (screen === "auth") {
    return (
      <div className="w-full max-w-sm mx-auto h-[700px] bg-[radial-gradient(circle_at_50%_0%,#111827_0%,#030712_70%)] rounded-[2rem] shadow-[0_0_40px_rgba(0,120,255,0.15)] border border-cyan-500/10 overflow-hidden relative flex flex-col">
        <Toast message={toast} />
        <div className="flex-1 flex flex-col items-center justify-center px-7">
          <Logo size={40} />
          <h1 className="mt-3 text-2xl font-extrabold text-gray-100 text-center">Task Connect Global</h1>
          <p className="text-cyan-400 text-sm font-medium mb-6">Work • Earn • Connect</p>

          <div className="w-full bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl shadow-sm p-1 flex mb-4">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => setAuthMode(m)}
                className={classNames(
                  "flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition",
                  authMode === m ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white" : "text-gray-500"
                )}
              >
                {m}
              </button>
            ))}
          </div>

          <form onSubmit={handleAuthSubmit} className="w-full space-y-3">
            {authMode === "signup" && (
              <input
                type="text"
                placeholder="Full name"
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-cyan-500/20 text-sm text-gray-100 outline-none focus:border-cyan-400"
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-cyan-500/20 text-sm text-gray-100 outline-none focus:border-cyan-400"
            />
            <input
              type="password"
              placeholder="Password (min. 8 characters)"
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-cyan-500/20 text-sm text-gray-100 outline-none focus:border-cyan-400"
            />
            {authMode === "signup" && (
              <input
                type="text"
                placeholder="Referral code (optional)"
                value={authForm.referral}
                onChange={(e) => setAuthForm({ ...authForm, referral: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-cyan-500/20 text-sm text-gray-100 outline-none focus:border-cyan-400"
              />
            )}
            <GradientButton type="submit" className="w-full py-3" disabled={authLoading}>
              {authLoading ? "Please wait..." : authMode === "signup" ? "Create Account" : "Log In"}
            </GradientButton>
          </form>

          <button
            onClick={handleDemoAccess}
            className="mt-4 w-full py-3 rounded-2xl border-2 border-cyan-500/30 text-cyan-400 font-semibold text-sm active:scale-95 transition"
          >
            ⚡ Instant Demo Access
          </button>
          <p className="text-[11px] text-gray-500 mt-6 text-center leading-relaxed">
            Real accounts require the backend server running — see the setup guide if signup fails.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto h-[700px] bg-[radial-gradient(circle_at_50%_0%,#111827_0%,#030712_70%)] rounded-[2rem] shadow-[0_0_40px_rgba(0,120,255,0.15)] border border-cyan-500/10 overflow-hidden relative flex flex-col">
      <Toast message={toast} />

      {/* Session status watermark */}
      <div className={classNames("text-white text-[10px] text-center py-1 tracking-wide flex items-center justify-center gap-2", isDemoSession ? "bg-slate-900" : "bg-green-700")}>
        {isDemoSession ? "DEMO MODE · NOT A REAL ACCOUNT · NOTHING SAVED" : "CONNECTED TO REAL ACCOUNT"}
        <button onClick={handleLogout} className="underline">Log out</button>
      </div>

      {/* Top bar */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between bg-[#05070c]">
        <div className="flex items-center gap-2">
          <Logo size={22} />
          <span className="font-bold text-gray-100 text-sm">Task Connect Global</span>
        </div>
        <button onClick={() => setShowProfile(true)} className="w-8 h-8 rounded-full bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] flex items-center justify-center shadow-sm text-base overflow-hidden">
          {user.photo ? <img src={user.photo} alt="" className="w-full h-full object-cover" /> : user.avatar}
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 pb-3">
        {activeTab === "home" && (
          <HomeScreen
            user={user}
            streak={streak}
            claimDaily={claimDaily}
            setActiveTab={setActiveTab}
            settings={settings}
          />
        )}
        {activeTab === "tasks" && (
          <TasksScreen
            tasks={filteredTasks}
            taskFilter={taskFilter}
            setTaskFilter={setTaskFilter}
            openProofModal={openProofModal}
            visitTimers={visitTimers}
            visitReady={visitReady}
            startWebsiteVisit={startWebsiteVisit}
            watchAdTask={watchAdTask}
            settings={settings}
          />
        )}
        {activeTab === "chat" && (
          <ChatScreen
            chatTab={chatTab}
            setChatTab={setChatTab}
            messages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            sendChatMessage={sendChatMessage}
            banned={banned}
            strikes={strikes}
          />
        )}
        {activeTab === "wallet" && (
          <WalletScreen
            user={user}
            transactions={transactions}
            setShowWithdraw={setShowWithdraw}
            setShowAddBalance={setShowAddBalance}
            settings={settings}
          />
        )}
        {activeTab === "admin" && (
          <AdminScreen
            isRealAdmin={isRealAdmin}
            adminTab={adminTab}
            setAdminTab={setAdminTab}
            activeMembers={activeMembers}
            pendingMembersList={pendingMembersList}
            toggleBanUser={toggleBanUser}
            approveMember={approveMember}
            rejectMember={rejectMember}
            removeUser={removeUser}
            adminWithdrawals={adminWithdrawals}
            reviewWithdrawal={reviewWithdrawal}
            settings={settings}
            saveSettings={saveSettings}
            totalMemberPoints={totalMemberPoints}
            networkStatus={networkStatus}
            setShowAddTask={setShowAddTask}
            openEditTask={openEditTask}
            removeTask={removeTask}
            newPaymentOption={newPaymentOption}
            setNewPaymentOption={setNewPaymentOption}
            addPaymentOption={addPaymentOption}
            removePaymentOption={removePaymentOption}
            tasks={tasks}
          />
        )}
      </div>

      {/* AdMob banner — pinned above the bottom nav */}
      <div className="px-3 pb-2 bg-[#05070c]">
        <BannerAdSlot />
      </div>

      {/* Bottom nav */}
      <div className="bg-black/60 backdrop-blur-xl border-t border-cyan-500/20 flex justify-around items-center py-2 px-1">
        {[
          { id: "home", label: "Home", icon: Home },
          { id: "tasks", label: "Tasks", icon: CheckSquare },
          { id: "chat", label: "Chat", icon: MessageCircle },
          { id: "wallet", label: "Wallet", icon: Wallet },
          { id: "admin", label: "Admin", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-0.5 px-2 py-1"
            >
              <Icon size={20} className={active ? "text-cyan-400" : "text-gray-500"} />
              <span className={classNames("text-[10px] font-medium", active ? "text-cyan-400" : "text-gray-500")}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ---------- Modals ---------- */}

      <Modal open={showProfile} onClose={() => setShowProfile(false)} title="My Profile">
        <ProfileContent
          user={user}
          profileForm={profileForm}
          setProfileForm={setProfileForm}
          saveProfile={saveProfile}
          showAvatarPicker={showAvatarPicker}
          setShowAvatarPicker={setShowAvatarPicker}
          setUser={setUser}
          setShowPasswordReset={setShowPasswordReset}
          copyReferral={copyReferral}
          copyReferralCode={copyReferralCode}
          shareReferral={shareReferral}
          completedTasksCount={completedTasksCount}
          settings={settings}
          fileInputRef={fileInputRef}
          handlePhotoUpload={handlePhotoUpload}
          removePhoto={removePhoto}
          paymentForm={paymentForm}
          setPaymentForm={setPaymentForm}
          savePaymentMethod={savePaymentMethod}
        />
      </Modal>

      <Modal open={showPasswordReset} onClose={() => setShowPasswordReset(false)} title="Reset Password">
        <div className="space-y-3">
          <input type="password" placeholder="Current password" value={pwForm.current} onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#05070c] text-sm outline-none" />
          <input type="password" placeholder="New password" value={pwForm.next} onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#05070c] text-sm outline-none" />
          <input type="password" placeholder="Confirm new password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#05070c] text-sm outline-none" />
          <GradientButton className="w-full py-3" onClick={resetPassword}>Update Password</GradientButton>
        </div>
      </Modal>

      <Modal open={!!proofTask} onClose={() => setProofTask(null)} title="Submit Proof">
        {proofTask && (
          <div className="space-y-3">
            <p className="text-sm text-gray-400">{proofTask.title}</p>
            <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-6 flex flex-col items-center gap-2 text-cyan-300">
              <Upload size={22} />
              <span className="text-xs">Tap to upload screenshot (demo)</span>
            </div>
            <textarea
              placeholder="Paste proof URL or add a note..."
              value={proofText}
              onChange={(e) => setProofText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#05070c] text-sm outline-none h-20 resize-none"
            />
            <GradientButton className="w-full py-3" onClick={submitProof}>
              Submit for Review (+{proofTask.reward} ⭐)
            </GradientButton>
          </div>
        )}
      </Modal>

      <Modal open={showWithdraw} onClose={() => setShowWithdraw(false)} title="Withdraw Request">
        <div className="space-y-3">
          {isDemoSession && (
            <p className="text-[11px] text-amber-600 bg-amber-50 rounded-lg px-3 py-2">You're in demo mode — log out and create a real account to submit an actual withdrawal request.</p>
          )}
          <label className="text-xs text-gray-500 font-medium">Gateway</label>
          <select value={withdrawForm.gateway} onChange={(e) => setWithdrawForm({ ...withdrawForm, gateway: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#05070c] text-sm outline-none">
            {settings.paymentOptions.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <input type="text" placeholder="Account number / wallet address" value={withdrawForm.account} onChange={(e) => setWithdrawForm({ ...withdrawForm, account: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#05070c] text-sm outline-none" />
          <input type="number" placeholder="Points to withdraw" value={withdrawForm.amountPoints} onChange={(e) => setWithdrawForm({ ...withdrawForm, amountPoints: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#05070c] text-sm outline-none" />
          {withdrawForm.amountPoints && (
            <p className="text-[11px] text-gray-500">≈ {(parseInt(withdrawForm.amountPoints, 10) * settings.pkrPerPoint || 0).toLocaleString()} PKR — the backend enforces the real minimum, this is just a preview.</p>
          )}
          <GradientButton className="w-full py-3" onClick={submitWithdraw} disabled={walletLoading}>
            {walletLoading ? "Submitting..." : "Submit Request"}
          </GradientButton>
        </div>
      </Modal>

      <Modal open={showAddBalance} onClose={() => setShowAddBalance(false)} title="Add Balance">
        <div className="space-y-3">
          <p className="text-xs text-gray-500">Demo only — no real payment is charged.</p>
          {settings.paymentOptions.map((g) => (
            <button
              key={g}
              onClick={() => {
                setTransactions((tx) => [{ id: "a" + Date.now(), type: "Add Balance", amount: "$5.00", gateway: g, status: "Pending", date: "Today" }, ...tx]);
                setShowAddBalance(false);
                showToast(`Add-balance request via ${g} submitted`);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#05070c] text-sm font-medium text-gray-300"
            >
              {g} <ChevronRight size={16} className="text-cyan-300" />
            </button>
          ))}
        </div>
      </Modal>

      <Modal open={showAddTask} onClose={() => setShowAddTask(false)} title="Create Task">
        <div className="space-y-3">
          <input type="text" placeholder="Task title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#05070c] text-sm outline-none" />
          <select value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#05070c] text-sm outline-none">
            {TASK_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="url"
            placeholder={newTask.category === "Website Visits" ? "Destination link (required)" : "Destination link (optional)"}
            value={newTask.link}
            onChange={(e) => setNewTask({ ...newTask, link: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#05070c] text-sm outline-none"
          />
          <input type="number" placeholder="Reward (points)" value={newTask.reward} onChange={(e) => setNewTask({ ...newTask, reward: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#05070c] text-sm outline-none" />
          <GradientButton className="w-full py-3" onClick={addCustomTask}>Publish Task</GradientButton>
          <p className="text-[11px] text-gray-500 text-center">Published tasks appear instantly in every user's Tasks tab.</p>
        </div>
      </Modal>

      <Modal open={!!editTask} onClose={() => setEditTask(null)} title="Edit Task">
        {editTask && (
          <div className="space-y-3">
            <input type="text" placeholder="Task title" value={editTask.title} onChange={(e) => setEditTask({ ...editTask, title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#05070c] text-sm outline-none" />
            <select value={editTask.category} onChange={(e) => setEditTask({ ...editTask, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#05070c] text-sm outline-none">
              {TASK_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="url"
              placeholder={editTask.category === "Website Visits" ? "Destination link (required)" : "Destination link (optional)"}
              value={editTask.link}
              onChange={(e) => setEditTask({ ...editTask, link: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#05070c] text-sm outline-none"
            />
            <input type="number" placeholder="Reward (points)" value={editTask.reward} onChange={(e) => setEditTask({ ...editTask, reward: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#05070c] text-sm outline-none" />
            <GradientButton className="w-full py-3" onClick={saveEditedTask}>Save Changes</GradientButton>
            <p className="text-[11px] text-gray-500 text-center">Changes apply instantly for every user.</p>
          </div>
        )}
      </Modal>

      {showLinkWarning && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-6">
          <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-5 text-center space-y-3 shadow-2xl">
            <AlertTriangle size={30} className="text-red-500 mx-auto" />
            <p className="font-bold text-gray-100 text-sm">Posting external links is strictly prohibited.</p>
            <p className="text-xs text-gray-500">Strike {strikes}/3{banned ? " — your account has been suspended." : ""}</p>
            <GradientButton className="w-full py-2.5" onClick={() => setShowLinkWarning(false)}>
              Understood
            </GradientButton>
          </div>
        </div>
      )}

      {showAdOverlay && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 px-6 text-center">
          <span className="text-[10px] uppercase tracking-widest text-cyan-300/70 mb-2">Advertisement</span>
          <div className="w-full h-40 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center mb-4">
            <Play size={40} className="text-white/80" />
          </div>
          <p className="text-white text-sm mb-1">Your next task unlocks after this ad.</p>
          <p className="text-white/40 text-[10px] mb-4 font-mono">{ADMOB_REWARDED_AD_ID}</p>
          <button
            onClick={() => setShowAdOverlay(false)}
            className="px-5 py-2 rounded-full bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] text-gray-100 text-sm font-semibold"
          >
            Close Ad
          </button>
        </div>
      )}

      {adTaskOverlay && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 px-6 text-center">
          <span className="text-[10px] uppercase tracking-widest text-cyan-300/70 mb-2">Rewarded Ad</span>
          <div className="w-full h-40 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center mb-4">
            <Play size={40} className="text-white/80" />
          </div>
          <p className="text-white text-sm mb-1">{adTaskOverlay.title}</p>
          <p className="text-white/70 text-xs mb-1">+{adTaskOverlay.reward} ⭐ when the ad finishes</p>
          <p className="text-white/40 text-[10px] mb-4 font-mono">{ADMOB_REWARDED_AD_ID}</p>
          <button
            onClick={closeAdTask}
            className="px-5 py-2 rounded-full bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] text-gray-100 text-sm font-semibold"
          >
            Close & Claim
          </button>
        </div>
      )}
    </div>
  );
}

// ============ Subscreens ============

function BalanceCard({ icon: Icon, label, value, tint }) {
  return (
    <div className={classNames("flex-1 rounded-2xl p-3 shadow-sm", tint)}>
      <Icon size={16} className="text-white/90 mb-2" />
      <p className="text-white/80 text-[10px] font-medium">{label}</p>
      <p className="text-white font-bold text-sm">{value}</p>
    </div>
  );
}

function HomeScreen({ user, streak, claimDaily, setActiveTab, settings }) {
  const quickAccess = [
    { label: "Watch Videos", icon: Youtube, tab: "tasks" },
    { label: "Social Tasks", icon: Instagram, tab: "tasks" },
    { label: "Games Zone", icon: Gamepad2, tab: "tasks" },
    { label: "Refer & Earn", icon: Users, tab: "wallet" },
    { label: "Daily Bonus", icon: Gift, tab: "home" },
    { label: "Wallet", icon: Wallet, tab: "wallet" },
  ];

  return (
    <div className="space-y-4 pt-2">
      <div>
        <p className="text-gray-100 font-bold text-lg">Hello, {user.name} 👋</p>
        <p className="text-cyan-400 text-xs font-medium">{settings.announcement}</p>
      </div>

      <div className="flex gap-2">
        <BalanceCard icon={Star} label="Points" value={`⭐ ${user.points.toLocaleString()}`} tint="bg-gradient-to-br from-blue-600 to-cyan-400" />
        <BalanceCard icon={DollarSign} label="PKR Balance" value={`${user.pkr.toLocaleString()} PKR`} tint="bg-gradient-to-br from-cyan-500 to-blue-500" />
        <BalanceCard icon={DollarSign} label="USD Balance" value={`$${user.usd.toFixed(2)}`} tint="bg-gradient-to-br from-blue-500 to-cyan-300" />
      </div>

      <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-gray-100 text-sm flex items-center gap-1">
            <Flame size={16} className="text-orange-400" /> 7-Day Daily Bonus
          </p>
          <span className="text-[11px] text-gray-500">Day {streak.day}/7</span>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-3">
          {streak.claimed.map((c, i) => (
            <div
              key={i}
              className={classNames(
                "aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold",
                c ? "bg-gradient-to-br from-blue-600 to-cyan-400 text-white" : "bg-[#05070c] text-cyan-300/70"
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <GradientButton className="w-full py-2.5 text-sm" onClick={claimDaily} disabled={streak.claimedToday}>
          {streak.claimedToday ? "Claimed for today ✓" : `Claim Day ${streak.day} Bonus`}
        </GradientButton>
      </div>

      <div>
        <p className="font-bold text-gray-100 text-sm mb-2">Quick Access</p>
        <div className="grid grid-cols-3 gap-2">
          {quickAccess.map((q) => {
            const Icon = q.icon;
            return (
              <button
                key={q.label}
                onClick={() => setActiveTab(q.tab)}
                className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-xl p-3 flex flex-col items-center gap-1.5 shadow-sm active:scale-95 transition"
              >
                <div className="w-9 h-9 rounded-full bg-[#05070c] flex items-center justify-center">
                  <Icon size={16} className="text-cyan-400" />
                </div>
                <span className="text-[10px] text-gray-400 font-medium text-center leading-tight">{q.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={() => setActiveTab("wallet")} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-4 flex items-center justify-between shadow-md active:scale-95 transition">
        <div className="text-left">
          <p className="text-white font-bold text-sm">Invite Friends & Earn More Points</p>
          <p className="text-white/80 text-[11px]">Share your referral link now</p>
        </div>
        <ChevronRight size={20} className="text-white" />
      </button>
    </div>
  );
}

function TaskCard({ t, openProofModal, visitTimers, visitReady, startWebsiteVisit, watchAdTask }) {
  const Icon = CATEGORY_ICON[t.category] || Star;
  const timerLeft = visitTimers[t.id];
  const ready = visitReady[t.id];

  let action = null;
  if (t.done) {
    action = (
      <span className="text-[11px] font-semibold text-green-500 flex items-center gap-1">
        <Check size={14} /> Done
      </span>
    );
  } else if (t.category === "Website Visits") {
    if (timerLeft > 0) {
      action = (
        <span className="px-3 py-1.5 rounded-full bg-[#05070c] text-cyan-300 text-[11px] font-semibold">
          {timerLeft}s...
        </span>
      );
    } else if (ready) {
      action = (
        <button onClick={() => openProofModal(t)} className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-[11px] font-semibold">
          Submit Proof
        </button>
      );
    } else {
      action = (
        <button onClick={() => startWebsiteVisit(t)} className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-[11px] font-semibold">
          Visit Site
        </button>
      );
    }
  } else if (t.category === "Ad Views") {
    action = (
      <button onClick={() => watchAdTask(t)} className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-[11px] font-semibold">
        Watch Ad
      </button>
    );
  } else {
    action = (
      <button onClick={() => openProofModal(t)} className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-[11px] font-semibold">
        Start
      </button>
    );
  }

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 flex items-center gap-3 shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-[#05070c] flex items-center justify-center shrink-0">
        <Icon size={18} className="text-cyan-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-100 truncate">{t.title}</p>
        <p className="text-[11px] text-cyan-400 font-medium">+{t.reward} ⭐ · {t.category}</p>
      </div>
      {action}
    </div>
  );
}

function TasksScreen({ tasks, taskFilter, setTaskFilter, openProofModal, visitTimers, visitReady, startWebsiteVisit, watchAdTask, settings }) {
  return (
    <div className="space-y-3 pt-2">
      <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 shadow-sm flex items-center gap-2">
        <TrendingUp size={16} className="text-cyan-400" />
        <p className="text-xs text-gray-400">Earnings depend on which tasks and offerwall offers are live — check back often, as new ones are published regularly.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["All", ...TASK_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setTaskFilter(c)}
            className={classNames(
              "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap",
              taskFilter === c ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white" : "bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] text-gray-500"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {tasks.map((t) => (
          <TaskCard
            key={t.id}
            t={t}
            openProofModal={openProofModal}
            visitTimers={visitTimers}
            visitReady={visitReady}
            startWebsiteVisit={startWebsiteVisit}
            watchAdTask={watchAdTask}
          />
        ))}
        {tasks.length === 0 && (
          <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-6 text-center shadow-sm">
            <Gift size={24} className="text-cyan-300/70 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-300">No active tasks right now</p>
            <p className="text-[11px] text-gray-500 mt-1">New tasks published from the Admin panel appear here instantly.</p>
          </div>
        )}
      </div>

      <div className="bg-[#05070c] rounded-2xl p-3 flex items-start gap-2">
        <ShieldCheck size={16} className="text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-400 leading-relaxed">
          <span className="font-semibold text-gray-100">Fair Gaming Guarantee:</span> milestone games only — no fake progression traps or level-reset tricks. Task rewards are fixed and shown upfront before you start.
        </p>
      </div>
    </div>
  );
}

function ChatScreen({ chatTab, setChatTab, messages, chatInput, setChatInput, sendChatMessage, banned, strikes }) {
  return (
    <div className="flex flex-col h-full pt-2">
      <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-1 flex mb-2 shadow-sm">
        {["group", "support"].map((t) => (
          <button
            key={t}
            onClick={() => setChatTab(t)}
            className={classNames(
              "flex-1 py-2 rounded-xl text-xs font-semibold capitalize",
              chatTab === t ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white" : "text-gray-500"
            )}
          >
            {t === "group" ? "Group Chat" : "Support"}
          </button>
        ))}
      </div>

      {strikes > 0 && !banned && (
        <div className="bg-amber-50 text-amber-600 text-[11px] font-medium rounded-xl px-3 py-2 mb-2 flex items-center gap-1">
          <AlertTriangle size={13} /> Strike {strikes}/3 — links aren't allowed in chat.
        </div>
      )}
      {banned && (
        <div className="bg-red-50 text-red-600 text-[11px] font-medium rounded-xl px-3 py-2 mb-2 flex items-center gap-1">
          <Ban size={13} /> Account suspended after 3 link-posting strikes.
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages.map((m) => (
          <div key={m.id} className={classNames("max-w-[80%] px-3 py-2 rounded-2xl text-xs", m.mine ? "ml-auto bg-gradient-to-r from-blue-600 to-cyan-400 text-white" : "bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] text-gray-300 shadow-sm")}>
            {!m.mine && <p className="text-[10px] font-bold text-cyan-400 mb-0.5">{m.user}</p>}
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          disabled={banned}
          placeholder={banned ? "Chat disabled" : "Type a message..."}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
          className="flex-1 px-4 py-2.5 rounded-full bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] text-xs outline-none shadow-sm disabled:opacity-50"
        />
        <button onClick={sendChatMessage} disabled={banned} className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 flex items-center justify-center shrink-0 disabled:opacity-40">
          <Send size={15} className="text-white" />
        </button>
      </div>
    </div>
  );
}

function WalletScreen({ user, transactions, setShowWithdraw, setShowAddBalance, settings }) {
  return (
    <div className="space-y-4 pt-2">
      <div className="bg-gradient-to-br from-blue-600 to-cyan-400 rounded-2xl p-4 shadow-md">
        <p className="text-white/80 text-xs font-medium">Total Balance</p>
        <p className="text-white font-extrabold text-2xl">{user.pkr.toLocaleString()} PKR</p>
        <p className="text-white/80 text-xs">≈ ${user.usd.toFixed(2)} USD</p>
      </div>

      <div className="flex gap-2">
        <GradientButton className="flex-1 py-3 text-sm" onClick={() => setShowAddBalance(true)}>Add Balance</GradientButton>
        <button onClick={() => setShowWithdraw(true)} className="flex-1 py-3 rounded-2xl border-2 border-cyan-500/30 text-cyan-400 font-semibold text-sm active:scale-95 transition">
          Withdraw
        </button>
      </div>

      <div className="bg-[#05070c] rounded-2xl p-3 text-[11px] text-gray-500">
        Minimum withdrawal: <span className="font-semibold text-gray-100">{settings.minWithdrawalPoints.toLocaleString()} points</span> (≈ {Math.round(settings.minWithdrawalPoints * settings.pkrPerPoint).toLocaleString()} PKR). Available gateways: {settings.paymentOptions.join(", ")}.
      </div>

      <div>
        <p className="font-bold text-gray-100 text-sm mb-2">Transaction History</p>
        <div className="space-y-2">
          {transactions.map((t) => (
            <div key={t.id} className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-sm font-semibold text-gray-100">{t.type}</p>
                <p className="text-[11px] text-gray-500">{t.gateway} · {t.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-100">{t.amount}</p>
                <span
                  className={classNames(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                    t.status === "Approved" ? "bg-green-50 text-green-600" : t.status === "Rejected" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"
                  )}
                >
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileContent({
  user, profileForm, setProfileForm, saveProfile, showAvatarPicker, setShowAvatarPicker, setUser,
  setShowPasswordReset, copyReferral, copyReferralCode, shareReferral, completedTasksCount, settings,
  fileInputRef, handlePhotoUpload, removePhoto, paymentForm, setPaymentForm, savePaymentMethod,
}) {
  const totalEarnedPkr = Math.round(user.points * settings.pkrPerPoint);
  const totalEarnedUsd = (totalEarnedPkr / 280).toFixed(2);
  const isProEarner = completedTasksCount >= 5 || user.points >= 1000;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16 mb-1">
          <button onClick={() => setShowAvatarPicker((s) => !s)} className="w-16 h-16 rounded-full bg-[#05070c] flex items-center justify-center text-2xl overflow-hidden">
            {user.photo ? <img src={user.photo} alt="" className="w-full h-full object-cover" /> : user.avatar}
          </button>
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center"
          >
            <Camera size={11} className="text-white" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
        </div>

        {showAvatarPicker && (
          <div className="space-y-2 mt-1 w-full">
            <div className="flex flex-wrap gap-2 justify-center bg-[#05070c] rounded-xl p-2">
              {AVATARS.map((a) => (
                <button key={a} onClick={() => { setUser((u) => ({ ...u, avatar: a, photo: null })); setShowAvatarPicker(false); }} className="w-8 h-8 rounded-full bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] flex items-center justify-center text-base">
                  {a}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-[#05070c] text-cyan-400 text-[11px] font-semibold">
                <ImageIcon size={13} /> Choose from Gallery
              </button>
              {user.photo && (
                <button onClick={removePhoto} className="flex-1 py-2 rounded-xl bg-red-50 text-red-500 text-[11px] font-semibold">
                  Remove Photo
                </button>
              )}
            </div>
          </div>
        )}
        <p className="text-[11px] text-gray-500 mt-1">{user.id} · Joined {user.joined} · {user.country}</p>
      </div>

      {/* Earning Stats Card */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-400 rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-bold text-sm">Earning Stats</p>
          {isProEarner && (
            <span className="flex items-center gap-1 bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold px-2 py-1 rounded-full shadow-[0_0_10px_rgba(0,210,255,0.3)]">
              <Award size={11} /> Pro Earner
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-white font-extrabold text-sm">{totalEarnedPkr.toLocaleString()}</p>
            <p className="text-white/70 text-[10px]">PKR Earned</p>
          </div>
          <div>
            <p className="text-white font-extrabold text-sm">${totalEarnedUsd}</p>
            <p className="text-white/70 text-[10px]">USD Earned</p>
          </div>
          <div>
            <p className="text-white font-extrabold text-sm">{completedTasksCount}</p>
            <p className="text-white/70 text-[10px]">Tasks Done</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#05070c] text-sm outline-none" placeholder="Name" />
        <input value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#05070c] text-sm outline-none" placeholder="Email" />
        <GradientButton className="w-full py-2.5 text-sm" onClick={saveProfile}>Save Changes</GradientButton>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 bg-[#05070c] rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-cyan-400">{user.points.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Total Points</p>
        </div>
        <div className="flex-1 bg-[#05070c] rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-cyan-400">{user.referrals}</p>
          <p className="text-[10px] text-gray-500">Referrals</p>
        </div>
      </div>

      {/* Referral card */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/20 rounded-xl p-3 space-y-2">
        <p className="text-[11px] font-semibold text-gray-500">Referral Code & Link</p>
        <button onClick={copyReferralCode} className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#05070c] text-sm font-medium text-gray-300">
          <span>{user.referralCode}</span>
          <Copy size={14} className="text-cyan-400 shrink-0" />
        </button>
        <button onClick={copyReferral} className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#05070c] text-sm font-medium text-gray-300">
          <span className="truncate">taskconnect.app/join/{user.referralCode}</span>
          <Copy size={14} className="text-cyan-400 shrink-0 ml-2" />
        </button>
        <GradientButton className="w-full py-2.5 text-sm flex items-center justify-center gap-1.5" onClick={shareReferral}>
          <Share2 size={14} /> Share Referral Link
        </GradientButton>
      </div>

      {/* Saved payment method */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/20 rounded-xl p-3 space-y-2">
        <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-1"><CreditCard size={13} className="text-cyan-400" /> Saved Payment Method</p>
        <select value={paymentForm.type} onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#05070c] text-xs outline-none">
          <option value="EasyPaisa">EasyPaisa</option>
          <option value="JazzCash">JazzCash</option>
        </select>
        <input
          type="text"
          placeholder={`${paymentForm.type} account number`}
          value={paymentForm.account}
          onChange={(e) => setPaymentForm({ ...paymentForm, account: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-[#05070c] text-xs outline-none"
        />
        {user.paymentMethod && user.paymentMethod.account && (
          <p className="text-[10px] text-gray-500">Currently saved: {user.paymentMethod.type} · ***{user.paymentMethod.account.slice(-4)}</p>
        )}
        <GradientButton className="w-full py-2.5 text-sm" onClick={savePaymentMethod}>Save Payment Method</GradientButton>
      </div>

      <button onClick={() => setShowPasswordReset(true)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-cyan-500/20 text-sm font-medium text-gray-300">
        <span className="flex items-center gap-2"><Lock size={14} className="text-cyan-400" /> Reset Password</span>
        <ChevronRight size={15} className="text-slate-300" />
      </button>
    </div>
  );
}

function AdminScreen({
  isRealAdmin, adminTab, setAdminTab,
  activeMembers, pendingMembersList, toggleBanUser, approveMember, rejectMember, removeUser,
  adminWithdrawals, reviewWithdrawal,
  settings, saveSettings, totalMemberPoints, networkStatus,
  setShowAddTask, openEditTask, removeTask,
  newPaymentOption, setNewPaymentOption, addPaymentOption, removePaymentOption,
  tasks,
}) {
  const tabs = [
    { id: "users", label: "Members" },
    { id: "tasks", label: "Tasks" },
    { id: "offerwalls", label: "Offerwalls" },
    { id: "withdrawals", label: "Payouts" },
    { id: "analytics", label: "Analytics" },
    { id: "customizer", label: "Customize" },
  ];

  const [localSettings, setLocalSettings] = useState(settings);
  useEffect(() => setLocalSettings(settings), [settings]);

  if (!isRealAdmin) {
    return (
      <div className="pt-2">
        <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-6 text-center shadow-sm space-y-2">
          <ShieldCheck size={28} className="text-cyan-300/70 mx-auto" />
          <p className="font-bold text-gray-100 text-sm">Admin access required</p>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            This account isn't an admin. In demo mode this panel is view-only preview
            (nothing here connects to a real backend). For a real account, an existing
            admin needs to promote you — the very first admin is set up via a one-time
            bootstrap command described in the backend README.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="bg-slate-900 rounded-2xl p-3 flex items-center gap-2">
        <ShieldCheck size={16} className="text-violet-300" />
        <p className="text-white text-xs font-semibold">Master Admin Panel — connected to real backend</p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setAdminTab(t.id)}
            className={classNames(
              "px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap",
              adminTab === t.id ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white" : "bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] text-gray-500"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {adminTab === "users" && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-gray-100 mb-2 flex items-center gap-1">
              <Clock size={13} className="text-amber-500" /> Pending Approvals ({pendingMembersList.length})
            </p>
            {pendingMembersList.length === 0 && <p className="text-[11px] text-gray-500">No pending member requests.</p>}
            <div className="space-y-2">
              {pendingMembersList.map((m) => (
                <div key={m.id} className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 shadow-sm">
                  <p className="text-sm font-semibold text-gray-100">{m.name}</p>
                  <p className="text-[11px] text-gray-500 mb-2">{m.email} · Applied {new Date(m.created_at).toLocaleDateString()}</p>
                  <div className="flex gap-2">
                    <button onClick={() => approveMember(m.id)} className="flex-1 py-1.5 rounded-full bg-green-50 text-green-600 text-[11px] font-semibold flex items-center justify-center gap-1">
                      <CircleCheck size={13} /> Approve
                    </button>
                    <button onClick={() => rejectMember(m.id)} className="flex-1 py-1.5 rounded-full bg-red-50 text-red-500 text-[11px] font-semibold flex items-center justify-center gap-1">
                      <CircleX size={13} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-100 mb-2">All Members ({activeMembers.length})</p>
            <div className="space-y-2">
              {activeMembers.map((m) => (
                <div key={m.id} className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-100">{m.name}</p>
                      <p className="text-[11px] text-gray-500">{m.email} · {m.points} pts{m.role === "admin" ? " · Admin" : ""}</p>
                    </div>
                    <span className={classNames(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0",
                      m.status === "active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                    )}>
                      {m.status === "active" ? "Active" : "Banned"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleBanUser(m)}
                      className={classNames(
                        "flex-1 py-1.5 rounded-full text-[11px] font-semibold",
                        m.status === "active" ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"
                      )}
                    >
                      {m.status === "active" ? "Ban User" : "Unban User"}
                    </button>
                    {m.role !== "admin" && (
                      <button onClick={() => removeUser(m.id)} className="flex-1 py-1.5 rounded-full bg-slate-100 text-gray-500 text-[11px] font-semibold">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {activeMembers.length === 0 && <p className="text-[11px] text-gray-500">No members yet.</p>}
            </div>
          </div>
        </div>
      )}

      {adminTab === "tasks" && (
        <div className="space-y-3">
          <GradientButton className="w-full py-2.5 text-sm flex items-center justify-center gap-1" onClick={() => setShowAddTask(true)}>
            <Plus size={15} /> Create New Task
          </GradientButton>

          <p className="text-xs font-bold text-gray-100 pt-1">Live Tasks ({tasks.length})</p>
          {tasks.length === 0 && <p className="text-[11px] text-gray-500">No tasks published yet — create one above and it appears instantly in every user's Tasks tab.</p>}
          <div className="space-y-2">
            {tasks.map((t) => (
              <div key={t.id} className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 flex items-center justify-between shadow-sm">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-100 truncate">{t.title}</p>
                  <p className="text-[11px] text-gray-500 truncate">{t.category} · +{t.reward} ⭐{t.link ? ` · ${t.link}` : ""}</p>
                </div>
                <div className="flex gap-1.5 shrink-0 ml-2">
                  <button onClick={() => openEditTask(t)} className="px-2.5 py-1.5 rounded-full bg-[#05070c] text-cyan-400 text-[11px] font-semibold flex items-center gap-1">
                    <Edit2 size={11} /> Edit
                  </button>
                  <button onClick={() => removeTask(t.id)} className="px-2.5 py-1.5 rounded-full bg-red-50 text-red-500 text-[11px] font-semibold">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {adminTab === "offerwalls" && (
        <div className="space-y-3">
          <div className="bg-[#05070c] rounded-2xl p-3">
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Real offerwall credentials (placement ID + postback secret) live in the backend's <span className="font-mono">.env</span> file,
              not here — they're secrets that shouldn't be editable from a web UI. This shows their real configured status.
            </p>
          </div>
          <div className="space-y-2">
            {networkStatus.map((n) => (
              <div key={n.key} className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 flex items-center justify-between shadow-sm">
                <p className="text-sm font-semibold text-gray-100 capitalize">{n.key}</p>
                <span className={classNames("text-[10px] font-semibold px-2 py-0.5 rounded-full", n.configured ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600")}>
                  {n.configured ? "Configured" : "Not configured yet"}
                </span>
              </div>
            ))}
            {networkStatus.length === 0 && <p className="text-[11px] text-gray-500">Couldn't load network status.</p>}
          </div>
        </div>
      )}

      {adminTab === "withdrawals" && (
        <div className="space-y-2">
          {adminWithdrawals.length === 0 && <p className="text-xs text-gray-500 text-center py-6">No pending payout requests.</p>}
          {adminWithdrawals.map((w) => (
            <div key={w.id} className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-gray-100">{w.amount_pkr.toLocaleString()} PKR · {w.gateway}</p>
                <Clock size={14} className="text-amber-500" />
              </div>
              <p className="text-[11px] text-gray-500 mb-2">{w.user_name} ({w.user_email}) · Acct: {w.account_number}</p>
              <div className="flex gap-2">
                <button onClick={() => reviewWithdrawal(w.id, "Approved")} className="flex-1 py-1.5 rounded-full bg-green-50 text-green-600 text-[11px] font-semibold flex items-center justify-center gap-1">
                  <CircleCheck size={13} /> Approve
                </button>
                <button onClick={() => reviewWithdrawal(w.id, "Rejected")} className="flex-1 py-1.5 rounded-full bg-red-50 text-red-500 text-[11px] font-semibold flex items-center justify-center gap-1">
                  <CircleX size={13} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {adminTab === "analytics" && (
        <div className="space-y-2">
          <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 shadow-sm flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center gap-1"><Users size={14} className="text-cyan-400" /> Active Members</span>
            <span className="text-sm font-bold text-gray-100">{activeMembers.length}</span>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 shadow-sm flex items-center justify-between">
            <span className="text-xs text-gray-500">Pending Approvals</span>
            <span className="text-sm font-bold text-amber-600">{pendingMembersList.length}</span>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 shadow-sm flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center gap-1"><BarChart3 size={14} className="text-cyan-400" /> Total Points Held (all members)</span>
            <span className="text-sm font-bold text-gray-100">{totalMemberPoints.toLocaleString()} pts</span>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 shadow-sm flex items-center justify-between">
            <span className="text-xs text-gray-500">Live Published Tasks</span>
            <span className="text-sm font-bold text-gray-100">{tasks.length}</span>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 shadow-sm flex items-center justify-between">
            <span className="text-xs text-gray-500">Configured Offerwall Networks</span>
            <span className="text-sm font-bold text-gray-100">{networkStatus.filter((n) => n.configured).length}/{networkStatus.length}</span>
          </div>
          <p className="text-[10px] text-gray-500 px-1">
            Revenue/profit figures aren't shown here — this backend doesn't yet track real fiat revenue per offerwall completion, only points. Add that once live network payout data is flowing.
          </p>
        </div>
      )}

      {adminTab === "customizer" && (
        <div className="space-y-3">
          <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 shadow-sm space-y-2">
            <label className="text-[11px] font-semibold text-gray-500">Announcement Text</label>
            <textarea value={localSettings.announcement} onChange={(e) => setLocalSettings({ ...localSettings, announcement: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-[#05070c] text-xs outline-none h-16 resize-none" />
            <GradientButton className="w-full py-2 text-xs" onClick={() => saveSettings({ announcement: localSettings.announcement })}>Save Announcement</GradientButton>
          </div>

          <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 shadow-sm space-y-2">
            <label className="text-[11px] font-semibold text-gray-500">Minimum Withdrawal (points)</label>
            <input type="number" value={localSettings.minWithdrawalPoints} onChange={(e) => setLocalSettings({ ...localSettings, minWithdrawalPoints: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg bg-[#05070c] text-xs outline-none" />
            <p className="text-[10px] text-gray-500">≈ {Math.round((localSettings.minWithdrawalPoints || 0) * (localSettings.pkrPerPoint || 0)).toLocaleString()} PKR at the current conversion rate.</p>
            <GradientButton className="w-full py-2 text-xs" onClick={() => saveSettings({ minWithdrawalPoints: localSettings.minWithdrawalPoints })}>Save Minimum Withdrawal</GradientButton>
          </div>

          <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 shadow-sm space-y-2">
            <label className="text-[11px] font-semibold text-gray-500">PKR per Point Conversion Rate</label>
            <input type="number" step="0.1" value={localSettings.pkrPerPoint} onChange={(e) => setLocalSettings({ ...localSettings, pkrPerPoint: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg bg-[#05070c] text-xs outline-none" />
            <GradientButton className="w-full py-2 text-xs" onClick={() => saveSettings({ pkrPerPoint: localSettings.pkrPerPoint })}>Save Conversion Rate</GradientButton>
          </div>

          <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 shadow-sm space-y-2">
            <label className="text-[11px] font-semibold text-gray-500">Daily Bonus (points per streak day)</label>
            <input type="number" value={localSettings.dailyBonusPerDay} onChange={(e) => setLocalSettings({ ...localSettings, dailyBonusPerDay: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg bg-[#05070c] text-xs outline-none" />
            <p className="text-[10px] text-gray-500">Day 1 pays this amount, day 2 pays 2×, up to day 7 at 7×.</p>
            <GradientButton className="w-full py-2 text-xs" onClick={() => saveSettings({ dailyBonusPerDay: localSettings.dailyBonusPerDay })}>Save Daily Bonus Rate</GradientButton>
          </div>

          <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 shadow-sm space-y-2">
            <label className="text-[11px] font-semibold text-gray-500">Ad Display Frequency (minutes)</label>
            <input type="number" value={localSettings.adFrequencyMin} onChange={(e) => setLocalSettings({ ...localSettings, adFrequencyMin: Math.max(1, parseInt(e.target.value) || 1) })} className="w-full px-3 py-2 rounded-lg bg-[#05070c] text-xs outline-none" />
            <GradientButton className="w-full py-2 text-xs" onClick={() => saveSettings({ adFrequencyMin: localSettings.adFrequencyMin })}>Save Ad Frequency</GradientButton>
          </div>

          <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 shadow-sm space-y-2">
            <label className="text-[11px] font-semibold text-gray-500 flex items-center gap-1"><Play size={12} className="text-cyan-400" /> AdMob Ad Unit IDs</label>
            <div>
              <p className="text-[10px] text-gray-500 mb-1">Banner</p>
              <p className="w-full px-3 py-2 rounded-lg bg-[#05070c] text-[11px] font-mono text-gray-400 break-all">{ADMOB_BANNER_AD_ID}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 mb-1">Rewarded</p>
              <p className="w-full px-3 py-2 rounded-lg bg-[#05070c] text-[11px] font-mono text-gray-400 break-all">{ADMOB_REWARDED_AD_ID}</p>
            </div>
            <p className="text-[10px] text-gray-500">Set at build time in source — requires a native app shell to actually serve ads.</p>
          </div>

          <div className="bg-white/[0.04] backdrop-blur-xl border border-cyan-500/[0.15] rounded-2xl p-3 shadow-sm space-y-2">
            <label className="text-[11px] font-semibold text-gray-500">Payment Options</label>
            <div className="flex flex-wrap gap-1.5">
              {settings.paymentOptions.map((p) => (
                <span key={p} className="flex items-center gap-1 bg-[#05070c] text-cyan-400 text-[11px] font-medium px-2.5 py-1 rounded-full">
                  {p}
                  <button onClick={() => removePaymentOption(p)}><X size={11} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-1">
              <input value={newPaymentOption} onChange={(e) => setNewPaymentOption(e.target.value)} placeholder="Add gateway..." className="flex-1 px-3 py-2 rounded-lg bg-[#05070c] text-xs outline-none" />
              <button onClick={addPaymentOption} className="px-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 text-white"><Plus size={14} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
