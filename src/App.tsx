import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeWrapper } from './components/ThemeWrapper';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Lobby } from './pages/Lobby';
import { Dashboard } from './pages/Dashboard';
import { QuestMap } from './pages/QuestMap';
import { Arena } from './pages/Arena';
import { Learn } from './pages/Learn';
import { BossBattle } from './pages/BossBattle';
import { Squad } from './pages/Squad';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { useUserStore } from './store/userStore';

const FULLSCREEN_ROUTES = ['/arena'];

function AppInner() {
  const profile = useUserStore((state) => state.profile);
  const location = useLocation();
  const isFullscreen = FULLSCREEN_ROUTES.some((r) => location.pathname.startsWith(r));

  return (
    <ThemeWrapper>
      <div className={isFullscreen ? '' : 'pb-20 md:pb-0 md:pt-16'}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/lobby" element={profile ? <Lobby /> : <Navigate to="/signup" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quests" element={<QuestMap />} />
          <Route path="/arena/:topic" element={<Arena />} />
          <Route path="/learn/:topic" element={<Learn />} />
          <Route path="/boss/:topic" element={<BossBattle />} />
          <Route path="/squad" element={<Squad />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        {profile && !isFullscreen && <Navbar />}
      </div>
    </ThemeWrapper>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
