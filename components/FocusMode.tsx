
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../GameContext';

export default function FocusMode() {
  const navigate = useNavigate();
  const { addCoins, playSound, triggerThought, storyStage, buddy } = useGame();
  
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins default
  const [totalTime, setTotalTime] = useState(1800);
  const [isActive, setIsActive] = useState(true);
  const [accumulatedReward, setAccumulatedReward] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        const elapsed = totalTime - timeLeft;
        const progressFactor = elapsed / totalTime;
        const baseRate = 60 / totalTime;
        const currentRate = baseRate * (0.5 + progressFactor);
        setAccumulatedReward(prev => prev + currentRate);
      }, 1000);
    } else if (timeLeft === 0) {
      playSound('success');
      addCoins(Math.round(accumulatedReward));
      triggerThought("That focus session helped me stabilize the O2 levels. Great work!");
      navigate('/dashboard');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, totalTime, accumulatedReward, addCoins, playSound, triggerThought, navigate]);

  const addTime = () => {
    setTimeLeft(prev => prev + 300);
    setTotalTime(prev => prev + 300);
    playSound('click');
  };

  const exitFocus = () => {
    addCoins(Math.round(accumulatedReward));
    triggerThought("Short but helpful. Every bit of focus helps the mission.");
    navigate('/dashboard');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Reusing the asset logic from Dashboard conceptually, or simplifying for Focus Mode
  const getBuddyImage = () => {
     // Default for now, can be updated to share logic
     return "https://lh3.googleusercontent.com/aida-public/AB6AXuCzVMUsJ_D1ID4CwHDVXyrOtt9adzwZjLi7hub0hDmlU1XybY1sDz0J2t0LU5RkOdoIqGFFN5U-8Z9yaACxDMRzbsGUG1YmtcMU2p6e519lXeoYAEy0pG-ilroiFUYL1pyQ2gVuZsxkiOb3FEnhJrssCKzvDZK_uw_o5cKjhMdw9iqOswkBYQMXDkZbIT0qWbzGmFGKZ0RJKxjYRazJdeKxuYJ58cS5PTaUs5pC0Xz4TWZ72I1AUnIY-WkbCBBXmVcNQ7ozyozKupx4";
  };
  
  const getBuddyStyle = () => {
      if (buddy === 'dracula') return { filter: 'hue-rotate(260deg) contrast(1.1) brightness(1.1)' };
      if (buddy === 'princess') return { filter: 'hue-rotate(300deg) saturate(1.2) brightness(1.1)' };
      return {};
  }

  return (
    <div className="bg-[#E0F2FE] min-h-screen flex flex-col items-center justify-center p-6 text-gray-800 font-fredoka antialiased transition-colors duration-1000">
      
      <div className="absolute top-10 flex flex-col items-center">
         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-soft mb-2">
            <span className="material-symbols-outlined text-3xl text-primary animate-pulse">self_improvement</span>
         </div>
         <h1 className="text-xl font-bold tracking-widest uppercase text-primary/60">Zen Protocol</h1>
      </div>

      <div className="relative w-72 h-72 flex items-center justify-center mb-12">
        <div className="absolute inset-0 bg-white/60 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-full h-full border-4 border-white rounded-full shadow-inner"></div>
        <div 
            className="absolute w-full h-full border-4 border-primary rounded-full transition-all duration-1000 opacity-20"
            style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
        ></div>

        <div className="flex flex-col items-center z-10">
             <img 
                src={getBuddyImage()} 
                alt="Zen Buddy"
                style={getBuddyStyle()}
                className="w-48 h-48 object-contain drop-shadow-xl animate-float"
             />
        </div>
      </div>

      <div className="text-center mb-12 bg-white/40 backdrop-blur-sm p-8 rounded-[3rem] border border-white/60 shadow-soft">
        <div className="text-6xl font-bold mb-4 font-mono tracking-tighter text-gray-900">
          {formatTime(timeLeft)}
        </div>
        <div className="flex items-center justify-center gap-2 text-accent-yellow drop-shadow-sm">
           <span className="material-symbols-outlined fill-1">diamond</span>
           <span className="text-xl font-bold">{Math.floor(accumulatedReward)}</span>
           <span className="text-xs text-gray-500 ml-1">diamonds earned</span>
        </div>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <button 
            onClick={addTime}
            className="w-full bg-white hover:bg-blue-50 text-primary py-4 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-soft border border-blue-100"
        >
            <span className="material-symbols-outlined">add</span> +5 Minutes
        </button>
        
        <button 
            onClick={exitFocus}
            className="w-full bg-red-50 hover:bg-red-100 text-red-500 py-4 rounded-2xl font-bold transition-all active:scale-95 border border-red-100"
        >
            Abort Protocol
        </button>
      </div>

      <p className="mt-12 text-sm text-primary/40 text-center italic px-8">
        The mission is silence. The goal is clarity.
      </p>

    </div>
  );
}
