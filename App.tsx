
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './GameContext';

// Components
import Welcome from './components/Welcome';
import HowItWorks from './components/HowItWorks';
import ChooseGoal from './components/ChooseGoal';
import ChooseBuddy from './components/ChooseBuddy';
import Dashboard from './components/Dashboard';
import AddGoal from './components/AddGoal';
import Chat from './components/Chat';
import FocusMode from './components/FocusMode';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex justify-center bg-[#E0F2FE]">
      <div className="w-full max-w-md bg-[#E0F2FE] min-h-screen shadow-2xl overflow-hidden relative sm:border-x sm:border-white/20">
        {children}
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/choose-goal" element={<ChooseGoal />} />
      <Route path="/choose-buddy" element={<ChooseBuddy />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-goal" element={<AddGoal />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/focus-mode" element={<FocusMode />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <GameProvider>
      <HashRouter>
        <Layout>
            <AppRoutes />
        </Layout>
      </HashRouter>
    </GameProvider>
  );
}
