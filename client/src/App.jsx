import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CodingArea from './pages/CodingArea';
import LearnPage from './pages/LearnPage';
import LandingPage from './pages/LandingPage';
import AuthModal from './components/auth/AuthModal';
import DailyWarmUpModal from './components/warmup/DailyWarmUpModal';
import PracticePage from './pages/PracticePage';
import CrashDashboard from './pages/CrashDashboard';
import CrashCodePage from './pages/CrashCodePage';
import BountyBoard from './pages/BountyBoard';
import BountyArena from './pages/BountyArena';
import useStore from './store/useStore';
import { useState, useEffect } from 'react';
import './App.css';

function NavBar({ onOpenAuth }) {
  const location = useLocation();
  const { coins, user, logout } = useStore();

  return (
    <nav className="app-nav">
      <div className="app-nav-logo">
        <div className="app-nav-logomark">
          <span>&lt;</span><span className="slash">/</span><span>&gt;</span>
        </div>
        <span className="app-nav-logotext">Code<span>Camp</span></span>
      </div>

      <div className="app-nav-links">
        {user ? (
          <Link to="/dashboard" className={`app-nav-link ${location.pathname === '/dashboard' ? 'app-nav-link--active' : ''}`}>Dashboard</Link>
        ) : (
          <Link to="/" className={`app-nav-link ${location.pathname === '/' ? 'app-nav-link--active' : ''}`}>Home</Link>
        )}
        <Link to="/learn" className={`app-nav-link ${location.pathname === '/learn' ? 'app-nav-link--active' : ''}`}>Learn</Link>
        <Link to="/code"  className={`app-nav-link ${location.pathname === '/code'  ? 'app-nav-link--active' : ''}`}>Missions</Link>
        <Link to="/practice" className={`app-nav-link ${location.pathname === '/practice' ? 'app-nav-link--active' : ''}`}>Practice</Link>
        <Link to="/bounties" className={`app-nav-link ${location.pathname === '/bounties' ? 'app-nav-link--active' : ''}`} style={{ color: '#FAC775', textShadow: '0 0 10px rgba(250,199,117,0.4)', fontWeight: 'bold' }}>Bounties</Link>
        <Link to="/crash" className={`app-nav-link ${location.pathname === '/crash' ? 'app-nav-link--active' : ''}`} style={{ color: '#FF6B6B', textShadow: '0 0 10px rgba(255,107,107,0.4)' }}>Crash Test</Link>
      </div>

      <div className="app-nav-right">
        {user ? (
          <div className="app-nav-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Hi, {user.name}</span>
            <button onClick={logout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Logout</button>
          </div>
        ) : (
          <button onClick={onOpenAuth} style={{ background: '#6c5ce7', border: 'none', color: 'white', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
            Log In
          </button>
        )}
        <div className="app-nav-coins">
          🪙 <span>{coins}</span> coins
        </div>
      </div>
    </nav>
  );
}

function AppShell({ isLanding, showAuth, setShowAuth, hasPendingWarmup, setPendingWarmup, user }) {
  const location = useLocation();
  const onLandingPage = isLanding && location.pathname === '/';

  // Toggle body scrolling for landing page
  useEffect(() => {
    if (onLandingPage) {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    }
    return () => {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    };
  }, [onLandingPage]);

  return (
    <div className={onLandingPage ? 'app-root app-root--landing' : 'app-root'}>
      <NavBar onOpenAuth={() => setShowAuth(true)} />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      
      {hasPendingWarmup && (
        <DailyWarmUpModal onClose={() => setPendingWarmup(false)} />
      )}

      <main className={onLandingPage ? 'app-main app-main--landing' : 'app-main'}>
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <LandingPage onOpenAuth={() => setShowAuth(true)} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/code"  element={<CodingArea />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/crash" element={<CrashDashboard />} />
          <Route path="/crash/:id" element={<CrashCodePage />} />
          <Route path="/bounties" element={<BountyBoard />} />
          <Route path="/bounties/:id" element={<BountyArena />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const { user, hasPendingWarmup, setPendingWarmup, setCoins, setCashBalance, setStats, setSkillGraph } = useStore();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/progress/skill-graph`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setSkillGraph(data.skillGraph);
          setCoins(data.coins || 0);
          setCashBalance(data.cashBalance || 0);
          setStats({
            challengesDone: data.challengesDone,
            streak: data.streak,
            retentionScore: data.retentionScore,
            mysteryBoxes: data.mysteryBoxes
          });
        }
      } catch (err) {
        console.error("Error fetching progress globally", err);
      }
    };

    const checkWarmup = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/warmup/daily`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.needsWarmup) {
          setPendingWarmup(true);
        }
      } catch (err) {
        console.error("Error checking warmup", err);
      }
    };
    
    fetchProgress();
    checkWarmup();
  }, [user, setPendingWarmup, setCoins, setCashBalance, setStats, setSkillGraph]);

  const isLanding = !user;

  return (
    <Router>
      <AppShell isLanding={isLanding} showAuth={showAuth} setShowAuth={setShowAuth} hasPendingWarmup={hasPendingWarmup} setPendingWarmup={setPendingWarmup} user={user} />
    </Router>
  );
}

export default App;
