
import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../GameContext';
import { ShopItem, Goal, BuddyType } from '../types';
import BuddyAnimation from './BuddyAnimation';

// Asset definitions for fallback static images (kept for game over screen)
const DEFAULT_BUDDY_IMAGE: Record<BuddyType, string> = {
  astronaut: "Assets/Base_characters/astronaut.png",
  dracula: "Assets/Base_characters/dracula.png",
  princess: "Assets/Base_characters/princess.png"
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    coins, happiness, health, activeGoals, completedGoals, storyStage, isGameOver,
    buyItem, completeGoal, updateGoalProgress, collectReward, 
    currentThought, resetGame, playSound, triggerThought, buddy,
    chatHistory
  } = useGame();
  
  const [showShopSuccess, setShowShopSuccess] = useState(false);
  const [flyingCoins, setFlyingCoins] = useState<{id: number, x: number, y: number}[]>([]);
  const [isPoking, setIsPoking] = useState(false);
  const [triggerEating, setTriggerEating] = useState(false);
  const coinCounterRef = useRef<HTMLDivElement>(null);

  // Shop Items with specific effects on Health and Mood
  const shopItems: ShopItem[] = [
    { id: 'oxygen', name: 'Oxygen', emoji: '🫧', price: 30, type: 'utility', effect: { health: 30, happiness: 10 } },
    { id: 'potatoes', name: 'Potatoes', emoji: '🥔', price: 60, type: 'food', effect: { health: 20, happiness: 5 } },
    { id: 'comms', name: 'Comms.', emoji: '📻', price: 50, type: 'utility', effect: { happiness: 25 } },
    { id: 'power', name: 'Power', emoji: '🔋', price: 50, type: 'utility', effect: { happiness: 20 } },
    { id: 'chips', name: 'Chips', emoji: '🍟', price: 40, type: 'food', effect: { happiness: 15, health: -5 } },
    { id: 'burger', name: 'Burger', emoji: '🍔', price: 70, type: 'food', effect: { happiness: 25, health: -10 } },
  ];

  const goalSummary = useMemo(() => {
    if (completedGoals.length === 0) return null;
    const counts = completedGoals.reduce((acc: any, g) => {
      acc[g.type] = (acc[g.type] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count: count as number
    }));
  }, [completedGoals]);

  const handleBuy = (item: ShopItem) => {
    const success = buyItem(item);
    if (success) {
      // Trigger eating animation
      setTriggerEating(true);
      playSound('eating');
      
      setShowShopSuccess(true);
      setTimeout(() => setShowShopSuccess(false), 2000);
    } else {
      playSound('sad');
      alert("Not enough diamonds!");
    }
  };

  const handleEatingComplete = () => {
    setTriggerEating(false);
  };

  const handlePoke = () => {
    setIsPoking(true);
    if (health < 40 || happiness < 40) {
      playSound('sad');
    } else {
      playSound('poke');
    }
    
    const pokeReplies = [
      "Hehe, that tickles!",
      "I'm ready for our next mission beat!",
      "You're doing great today, Commander!",
      "I love spending time with you!",
      "I believe in us!"
    ];
    triggerThought(pokeReplies[Math.floor(Math.random() * pokeReplies.length)]);
    
    setTimeout(() => setIsPoking(false), 300);
  };

  const handleCollectReward = (e: React.MouseEvent, goal: Goal) => {
    if ((window as any).confetti) {
        (window as any).confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 }
        });
    }

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    if (rect) {
        const newCoins = [];
        for(let i=0; i<5; i++) {
            newCoins.push({id: Date.now() + i, x: rect.left + rect.width/2, y: rect.top});
        }
        setFlyingCoins(newCoins);
        setTimeout(() => setFlyingCoins([]), 1000);
    }

    collectReward(goal.id);
  };

  const handleLogout = () => {
    resetGame();
    navigate('/');
  };

  if (isGameOver) {
      return (
        <div className="bg-black/90 min-h-screen flex flex-col items-center justify-center text-white p-6 relative overflow-hidden font-mono z-50">
            <div className="absolute inset-0 bg-red-900/20 animate-pulse"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <span className="material-symbols-outlined text-6xl text-red-500 animate-bounce">warning</span>
                <h1 className="text-4xl font-bold tracking-widest text-red-500">MISSION FAILED</h1>
                <p className="text-gray-300 max-w-xs">
                    Vital signs reached critical levels. Communication with the base has been lost.
                </p>
                <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden border-4 border-red-500/50 mb-4 opacity-50 grayscale">
                    <img src={DEFAULT_BUDDY_IMAGE[buddy]} alt="Lost Buddy" className="w-full h-full object-contain" />
                </div>
                <button 
                    onClick={resetGame}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-red-500/30 transition-all active:scale-95 uppercase tracking-wider"
                >
                    Initialize Rescue Protocol (Restart)
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="bg-[#E0F2FE] text-text-main font-fredoka min-h-screen antialiased pb-32 relative overflow-hidden transition-colors duration-1000">
      
      {/* Background Panic Effect */}
      {(health < 20 || happiness < 20) && (
          <div className="absolute inset-0 bg-red-500/10 pointer-events-none animate-pulse z-0"></div>
      )}

      {flyingCoins.map((coin, i) => (
         <div 
            key={coin.id}
            className="fixed z-[100] pointer-events-none text-accent-yellow"
            style={{ 
                left: coin.x, 
                top: coin.y,
                ['--tx' as any]: `${(window.innerWidth - 60) - coin.x}px`,
                ['--ty' as any]: `-${coin.y - 20}px`
            }}
         >
            <style>{`
                @keyframes flyCoin${i} {
                    0% { transform: translate(0,0) scale(1); opacity: 1; }
                    100% { transform: translate(var(--tx), var(--ty)) scale(0.5); opacity: 0; }
                }
            `}</style>
            <span 
                className="material-symbols-outlined text-2xl fill-1 drop-shadow-md"
                style={{ animation: `flyCoin${i} 0.8s ease-in-out forwards` }}
            >
                diamond
            </span>
         </div>
      ))}

      {showShopSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl animate-pop-in flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Purchased!</h3>
              </div>
          </div>
      )}

      <header className="flex justify-between items-center px-6 py-6 sticky top-0 z-40 bg-[#E0F2FE]/80 backdrop-blur-sm">
        <button onClick={() => navigate('/chat')} className="bg-white p-3 rounded-full shadow-soft hover:scale-105 transition-transform text-gray-600 relative">
          <span className="material-symbols-outlined text-2xl">chat_bubble</span>
          {chatHistory.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
        </button>
        <div ref={coinCounterRef} className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full shadow-soft hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-accent-yellow fill-1">diamond</span>
          <span className="font-bold text-black text-lg">{Math.floor(coins)}</span>
        </div>
      </header>

      <section className="relative px-6 pt-2 pb-8 flex flex-col items-center justify-center">
        <div 
            className={`bg-white p-5 rounded-2xl shadow-soft mb-8 max-w-[280px] relative animate-fade-in-up transform transition-all hover:scale-105 cursor-pointer border-2 ${health < 40 ? 'border-red-200' : 'border-transparent'}`} 
            onClick={() => navigate('/chat')}
        >
          <p className={`text-sm text-center font-medium leading-relaxed font-inter ${(health < 20 || happiness < 20) ? 'text-red-600 font-bold animate-pulse' : 'text-gray-600'}`}>
            {currentThought}
          </p>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-45 w-4 h-4 bg-white"></div>
        </div>

        <div className="flex items-end justify-between w-full max-w-sm gap-4 relative px-2">
          {/* Mood Bar */}
          <div className="flex flex-col items-center gap-3 h-48 justify-end pb-2">
            <div className="w-3 bg-white/60 rounded-full h-32 relative overflow-hidden shadow-inner flex flex-col justify-end">
              <div 
                className={`w-full rounded-full transition-all duration-300 ${happiness < 30 ? 'bg-red-500' : 'bg-accent-orange'}`}
                style={{ height: `${happiness}%` }}
              ></div>
            </div>
            <div className={`bg-white p-2 rounded-full shadow-sm ${happiness < 30 ? 'text-red-500 animate-bounce' : 'text-accent-orange'}`}>
              <span className="material-symbols-outlined text-xl">sentiment_satisfied</span>
            </div>
          </div>

          {/* Character Blob with Animation */}
          <div onClick={handlePoke} className="relative">
            <BuddyAnimation
              buddy={buddy}
              health={health}
              happiness={happiness}
              isPoking={isPoking}
              triggerEating={triggerEating}
              onEatingComplete={handleEatingComplete}
            />
            {storyStage > 0 && (
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 px-3 py-1 bg-primary text-white text-[10px] rounded-full font-bold uppercase tracking-widest animate-pulse shadow-md">
                Stage {storyStage}
              </div>
            )}
          </div>

          {/* Health Bar */}
          <div className="flex flex-col items-center gap-3 h-48 justify-end pb-2">
            <div className="w-3 bg-white/60 rounded-full h-32 relative overflow-hidden shadow-inner flex flex-col justify-end">
              <div 
                className={`w-full rounded-full transition-all duration-300 ${health < 30 ? 'bg-red-600' : 'bg-accent-red'}`}
                style={{ height: `${health}%` }}
              ></div>
            </div>
            <div className={`bg-white p-2 rounded-full shadow-sm ${health < 30 ? 'text-red-600 animate-bounce' : 'text-accent-red'}`}>
              <span className="material-symbols-outlined text-xl">favorite</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 pl-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 font-nunito">Supplies & Rations</h2>
        <div className="overflow-x-auto no-scrollbar pb-4 pr-6">
          <div className="flex gap-4 w-max">
            {shopItems.map(item => (
                <div key={item.id} onClick={() => handleBuy(item)} className="bg-white w-[120px] h-[140px] p-3 rounded-2xl shadow-card flex flex-col items-center justify-center space-y-2 hover:scale-95 transition-transform cursor-pointer border border-transparent hover:border-primary/20 relative overflow-hidden group">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-2xl z-10">{item.emoji}</div>
                    <span className="text-sm font-bold text-gray-800 z-10">{item.name}</span>
                    <div className="flex items-center text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-full z-10">
                        <span className="material-symbols-outlined text-[14px] text-accent-yellow fill-1 mr-1">diamond</span> {item.price}
                    </div>
                    {/* Visual indicators for effect */}
                    <div className="absolute bottom-0 w-full h-1 flex">
                        {item.effect?.health && item.effect.health > 0 && <div className="h-full bg-red-400 flex-1"></div>}
                        {item.effect?.health && item.effect.health < 0 && <div className="h-full bg-red-900 flex-1"></div>}
                        {item.effect?.happiness && <div className="h-full bg-orange-400 flex-1"></div>}
                    </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Goal Summary Module */}
      <section className="px-6 mb-8">
          <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-blue-50 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-9xl text-blue-500">sticky_note_2</span>
             </div>
             <h2 className="text-xl font-bold text-gray-800 mb-3 font-nunito relative z-10">Mission Log</h2>
             {goalSummary ? (
               <div className="relative z-10">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {goalSummary.map(sum => (
                       <div key={sum.type} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-blue-100">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                          {sum.type} <span className="opacity-60 ml-0.5">x{sum.count}</span>
                       </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 italic leading-relaxed font-medium">
                    "Great work, commander! You've been focusing on {goalSummary[0].type} lately. Keep it up to ensure the mission's success!"
                  </p>
               </div>
             ) : (
               <div className="text-center py-6 relative z-10">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-2xl text-gray-300">rocket_launch</span>
                  </div>
                  <p className="text-sm text-gray-400 font-medium">Complete your first mission goals to populate your log!</p>
               </div>
             )}
          </div>
      </section>

      {/* Completed Goals Section - RESTORED */}
      {completedGoals.length > 0 && (
        <section className="px-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 font-nunito">Completed Missions</h2>
            <div className="space-y-3">
                {completedGoals.map(goal => (
                    <div 
                        key={goal.id} 
                        className={`bg-white p-4 rounded-3xl shadow-card flex items-center justify-between transition-all duration-700 ${goal.isRemoving ? 'opacity-0 scale-95 -translate-y-2' : goal.collected ? 'opacity-60 ring-2 ring-transparent' : 'ring-2 ring-accent-yellow'}`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-50 p-3 rounded-2xl text-2xl">✅</div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-base">{goal.title}</h3>
                                <p className="text-xs text-gray-500 mt-1">{goal.subtitle}</p>
                            </div>
                        </div>
                        
                        {!goal.collected && (
                            <button 
                                onClick={(e) => handleCollectReward(e, goal)}
                                className="bg-accent-yellow text-white text-xs font-bold px-4 py-2 rounded-full shadow-md animate-bounce hover:bg-yellow-500 active:scale-95 transition-all flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-sm">diamond</span>
                                Collect
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </section>
      )}

      {/* Active Goals Section */}
      <section className="px-6 space-y-4 mb-8">
        <h2 className="text-xl font-bold text-gray-800 font-nunito">Current Directives</h2>
        {activeGoals.map(goal => (
            <div key={goal.id} className="bg-white p-5 rounded-3xl shadow-card transition-all hover:shadow-lg border border-transparent hover:border-primary/10">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-50 p-3 rounded-2xl text-2xl">{goal.icon}</div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-base">{goal.title}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{goal.subtitle}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 text-gray-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center">
                        <span className="material-symbols-outlined text-[14px] text-gray-400 fill-1 mr-1">diamond</span> {goal.reward}
                    </div>
                </div>

                {goal.isTrackable ? (
                     <div className="mt-4 pt-2 border-t border-gray-50">
                        <div className="flex justify-between items-end mb-2">
                             <div className="flex flex-col">
                                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Progress</span>
                                 <span className="text-sm font-bold text-primary">{Math.floor(((goal.currentProgress || 0) / (goal.targetProgress || 1)) * 100)}%</span>
                             </div>
                             <span className="text-xs font-bold text-gray-400">{goal.currentProgress} / {goal.targetProgress} units</span>
                        </div>
                        <div 
                            className="h-3 bg-gray-100 rounded-full overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
                            onClick={() => updateGoalProgress(goal.id, 1)}
                        >
                            <div 
                                className="h-full bg-accent-green transition-all duration-500 relative"
                                style={{ width: `${((goal.currentProgress || 0) / (goal.targetProgress || 1)) * 100}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 italic text-center">Tap bar to log progress</p>
                    </div>
                ) : (
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50 cursor-pointer group" onClick={() => completeGoal(goal.id)}>
                        <span className="text-xs text-gray-400 font-semibold font-inter group-hover:text-primary transition-colors">Mark as complete</span>
                        <button className="w-7 h-7 rounded-full border-2 border-gray-200 group-hover:border-primary transition-colors flex items-center justify-center">
                            <div className="w-4 h-4 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    </div>
                )}
            </div>
        ))}
        {activeGoals.length === 0 && (
            <div className="text-center text-gray-400 py-8 italic font-inter">No active goals. Add one below!</div>
        )}
      </section>

      <section className="px-6 pb-20">
        <div className="flex flex-col space-y-4">
          <button onClick={() => navigate('/add-goal')} className="w-full bg-white text-primary border-2 border-white hover:border-blue-100 py-4 rounded-2xl font-bold shadow-soft flex items-center justify-center transition-all active:scale-95 font-nunito">
            <span className="material-symbols-outlined mr-2 text-xl">add_circle</span> Add Goal
          </button>

          <button onClick={() => navigate('/focus-mode')} className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-soft flex items-center justify-center transition-all active:scale-95 font-nunito">
            <span className="material-symbols-outlined mr-2 text-xl">timer</span> Start Focus Mode
          </button>
          
          <button onClick={handleLogout} className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-bold shadow-sm flex items-center justify-center transition-all active:scale-95 font-nunito border border-red-100 mt-8">
            <span className="material-symbols-outlined mr-2 text-xl">logout</span> Logout
          </button>
        </div>
      </section>

    </div>
  );
}
