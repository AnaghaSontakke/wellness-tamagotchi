
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../GameContext';
import { BuddyType } from '../types';

export default function ChooseBuddy() {
  const navigate = useNavigate();
  const { setBuddy } = useGame();
  const [selected, setSelected] = useState<BuddyType>('astronaut');
  const [BASE_ASSET, setBaseAsset] = useState<BuddyType>('./Assets/Base_characters/');

  const buddies: { id: BuddyType, name: string, desc: string, emoji: string, bg: string, imgStyle?: React.CSSProperties }[] = [
    { 
        id: 'astronaut', 
        name: 'Astronaut', 
        desc: 'Mars surface, Science', 
        emoji: '👨‍🚀', 
        bg: 'bg-blue-50'
    },
    { 
        id: 'dracula', 
        name: 'Count Dracula', 
        desc: 'Castle Ruins, Ominous', 
        emoji: '🧛', 
        bg: 'bg-purple-50',
        imgStyle: { filter: 'hue-rotate(260deg) contrast(1.1)' }
    },
    { 
        id: 'princess', 
        name: 'Princess Lira', 
        desc: 'Royal chambers, Luxurious', 
        emoji: '👸', 
        bg: 'bg-pink-50',
        imgStyle: { filter: 'hue-rotate(300deg) saturate(1.2)' }
    },
  ];

  // Reusing the main astronaut asset for all, with filters for others until new assets are provided
  // const BASE_ASSET = "https://lh3.googleusercontent.com/aida-public/AB6AXuCzVMUsJ_D1ID4CwHDVXyrOtt9adzwZjLi7hub0hDmlU1XybY1sDz0J2t0LU5RkOdoIqGFFN5U-8Z9yaACxDMRzbsGUG1YmtcMU2p6e519lXeoYAEy0pG-ilroiFUYL1pyQ2gVuZsxkiOb3FEnhJrssCKzvDZK_uw_o5cKjhMdw9iqOswkBYQMXDkZbIT0qWbzGmFGKZ0RJKxjYRazJdeKxuYJ58cS5PTaUs5pC0Xz4TWZ72I1AUnIY-WkbCBBXmVcNQ7ozyozKupx4";


  const handleStart = () => {
    setBuddy(selected);
    navigate('/dashboard');
  };

  return (
    <div className="bg-[#EFF6FF] min-h-screen flex justify-center antialiased font-inter">
      <div className="w-full max-w-md h-full min-h-screen flex flex-col px-6 pb-6 relative overflow-hidden">
        
        {/* Progress */}
        <div className="flex justify-center items-center space-x-2 mt-8 mb-6 pt-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-200"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-blue-200"></div>
          <div className="w-8 h-2.5 rounded-full bg-primary"></div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2 text-gray-900 tracking-tight font-nunito">Choose your buddy</h1>
          <p className="text-gray-500 text-sm px-4 leading-relaxed">Choose a character that resonates with you and your goals.</p>
        </div>

        {/* Hero Image */}
        <div className="flex-none flex flex-col items-center justify-center mb-6">
          <div className={`relative w-64 h-64 bg-white rounded-3xl shadow-soft flex items-center justify-center overflow-hidden border border-blue-50`}>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>
             <img 
                alt={selected} 
                className="w-48 h-48 object-contain drop-shadow-lg animate-float" 
                src={BASE_ASSET+selected.toLowerCase()+".png"}
                style={buddies.find(b => b.id === selected)?.imgStyle}
             />
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full bg-white rounded-full p-1.5 flex mb-6 shadow-sm border border-blue-50">
          <button className="flex-1 bg-primary text-white text-sm font-semibold py-2.5 rounded-full shadow-sm transition-all">Role</button>
          <button className="flex-1 text-gray-500 hover:text-gray-900 text-sm font-medium py-2.5 rounded-full transition-colors">Costume</button>
          <button className="flex-1 text-gray-500 hover:text-gray-900 text-sm font-medium py-2.5 rounded-full transition-colors">Accessory</button>
        </div>

        {/* Selection List */}
        <div className="flex-grow overflow-y-auto no-scrollbar pb-32 space-y-3">
          {buddies.map(b => (
             <label 
                key={b.id}
                onClick={() => setSelected(b.id)}
                className={`group relative flex items-center p-4 bg-white rounded-3xl cursor-pointer border-[2.5px] transition-all active:scale-[0.99] ${selected === b.id ? 'border-primary shadow-soft' : 'border-transparent shadow-card hover:border-blue-100'}`}
             >
                <div className={`${b.bg} p-3 rounded-2xl mr-4 flex-shrink-0 flex items-center justify-center w-14 h-14`}>
                    <span className="text-3xl">{b.emoji}</span>
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-gray-900 text-base">{b.name}</h3>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">{b.desc}</p>
                </div>
                <div className="relative flex items-center justify-center w-6 h-6 mr-1">
                    <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${selected === b.id ? 'border-primary border-[6px]' : 'border-gray-200'}`}></div>
                </div>
             </label>
          ))}
        </div>

        {/* Bottom Button */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#EFF6FF] via-[#EFF6FF]/95 to-transparent flex justify-center z-10">
          <div className="w-full max-w-md">
            <button 
                onClick={handleStart}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-base py-4 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all transform active:scale-[0.98] font-nunito"
            >
                Start Journey
                <span className="material-symbols-outlined ml-2 text-[20px] font-bold">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
