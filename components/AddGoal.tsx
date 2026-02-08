
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../GameContext';
import { Goal } from '../types';

export default function AddGoal() {
  const navigate = useNavigate();
  const { addGoals, playSound } = useGame();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);

  const recommendedGoals: Partial<Goal>[] = [
    { id: 'rec-1', icon: '📱', title: 'Limit Instagram', subtitle: '30 min tracked', type: 'social', reward: 50, isTrackable: true, currentProgress: 0, targetProgress: 30 },
    { id: 'rec-2', icon: '🏃', title: 'Steps count', subtitle: '5000 units', type: 'exercise', reward: 100, isTrackable: true, currentProgress: 0, targetProgress: 5000 },
    { id: 'rec-3', icon: '🌐', title: 'Social media usage', subtitle: 'Limit to 1hr', type: 'social', reward: 80, isTrackable: true, currentProgress: 0, targetProgress: 60 },
    { id: 'rec-4', icon: '🧘', title: 'Focus mode session', subtitle: '1 session', type: 'focus', reward: 40, isTrackable: true, currentProgress: 0, targetProgress: 1 },
    { id: 'rec-5', icon: '📚', title: 'Reading', subtitle: 'Not Trackable', type: 'reading', reward: 50, isTrackable: false },
    { id: 'rec-6', icon: '🏋️', title: 'Exercise', subtitle: 'Not Trackable', type: 'exercise', reward: 70, isTrackable: false },
    { id: 'rec-7', icon: '🧠', title: 'Deep work', subtitle: 'Not Trackable', type: 'focus', reward: 60, isTrackable: false },
    { id: 'rec-8', icon: '💧', title: 'Hydration', subtitle: '8 glasses', type: 'health', reward: 40, isTrackable: true, currentProgress: 0, targetProgress: 8 },
  ];

  const toggleGoal = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
        newSet.delete(id);
    } else {
        newSet.add(id);
        playSound('click');
    }
    setSelectedIds(newSet);
  };

  const handleStart = () => {
    const goalsToAdd: Goal[] = [];
    recommendedGoals.forEach(g => {
        if (g.id && selectedIds.has(g.id)) {
            goalsToAdd.push({ ...g, completed: false, collected: false } as Goal);
        }
    });
    
    addGoals(goalsToAdd);
    setShowSuccess(true);
    playSound('success');

    setTimeout(() => {
        navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="bg-[#E6F0FA] min-h-screen flex flex-col font-jakarta text-[#111814] relative">
      {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-[2rem] shadow-2xl animate-pop-in flex flex-col items-center max-w-xs w-full mx-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                    <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Goals Added!</h3>
                  <p className="text-gray-500 text-center text-sm">Your companion is ready to grow.</p>
              </div>
          </div>
      )}

      <header className="flex items-center justify-between p-4 pt-6 sticky top-0 z-20 bg-[#E6F0FA]/90 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/50 hover:bg-white/80 transition-colors shadow-sm">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <h2 className="text-xl font-bold leading-tight tracking-tight text-center">Add New Goals</h2>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32 px-4 pt-2">
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
             <h3 className="text-lg font-bold tracking-tight text-gray-800">Available Wellness Goals</h3>
             {selectedIds.size > 0 && <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-1 rounded-full">{selectedIds.size} selected</span>}
          </div>
          <div className="grid grid-cols-2 gap-4 pb-4">
            {recommendedGoals.map((goal) => (
                <label key={goal.id} className="relative cursor-pointer group select-none">
                    <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={selectedIds.has(goal.id!)}
                        onChange={() => toggleGoal(goal.id!)}
                    />
                    <div className="selection-ring flex flex-col items-center justify-between p-5 h-44 rounded-3xl bg-white border-2 border-transparent shadow-sm hover:shadow-md transition-all duration-300 peer-checked:border-[#2bee79] peer-checked:shadow-[0_4px_20px_rgba(43,238,121,0.15)]">
                        <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-1">
                            <span className="text-2xl">{goal.icon}</span>
                        </div>
                        <div className="text-center space-y-0.5">
                            <p className="font-bold text-sm leading-tight text-gray-900">{goal.title}</p>
                            <p className="text-[11px] font-medium text-gray-500">{goal.subtitle}</p>
                        </div>
                        <div className={`size-8 rounded-full flex items-center justify-center transition-all duration-300 mt-1 ${selectedIds.has(goal.id!) ? 'bg-[#2bee79] text-[#102217] scale-100' : 'bg-gray-100 text-gray-400'}`}>
                            <span className="material-symbols-outlined text-xl">{selectedIds.has(goal.id!) ? 'check' : 'add'}</span>
                        </div>
                        {goal.isTrackable && (
                           <div className="absolute top-2 right-2">
                              <span className="material-symbols-outlined text-[14px] text-blue-400">sync</span>
                           </div>
                        )}
                    </div>
                </label>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-4 pb-8 bg-gradient-to-t from-[#E6F0FA] via-[#E6F0FA]/95 to-transparent z-30 pointer-events-none flex justify-center">
        <div className="w-full max-w-md pointer-events-auto">
             <button 
                onClick={handleStart}
                disabled={selectedIds.size === 0}
                className="shadow-lg shadow-primary/30 w-full bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:shadow-none active:scale-[0.98] transition-all text-white text-base font-bold h-14 rounded-full flex items-center justify-center gap-2"
            >
                <span>Add Selected Goals</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
        </div>
      </div>
    </div>
  );
}
