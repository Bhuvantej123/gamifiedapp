import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeWrapper } from './components/ThemeWrapper';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { QuestMap } from './pages/QuestMap';
import { Learn } from './pages/Learn';
import { BossBattle } from './pages/BossBattle';
import { Squad } from './pages/Squad';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { useUserStore } from './store/userStore';

export default function App() {
  const profile = useUserStore((state) => state.profile);

  return (
    <BrowserRouter>
      <ThemeWrapper>
        <div className="pb-20 md:pb-0 md:pt-16">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={profile ? <Onboarding /> : <Navigate to="/signup" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quests" element={<QuestMap />} />
            <Route path="/learn/:topic" element={<Learn />} />
            <Route path="/boss/:topic" element={<BossBattle />} />
            <Route path="/squad" element={<Squad />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          {profile && <Navbar />}
        </div>
      </ThemeWrapper>
    </BrowserRouter>
  );
}
