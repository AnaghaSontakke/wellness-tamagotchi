
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../GameContext';
import { Goal } from '../types';

export default function ChooseGoal() {
  const navigate = useNavigate();
  const { addGoal } = useGame();
  const [selectedGoalId, setSelectedGoalId] = useState<string>('instagram');

  const goals: Goal[] = [
    { id: 'instagram', icon: '📱', title: 'Limit Instagram', subtitle: '30 min tracked', reward: 50, completed: false, type: 'social', isTrackable: true, currentProgress: 0, targetProgress: 30 },
    { id: 'steps', icon: '🏃', title: 'Steps count', subtitle: '5000 units', reward: 100, completed: false, type: 'exercise', isTrackable: true, currentProgress: 0, targetProgress: 5000 },
    { id: 'social_usage', icon: '🌐', title: 'Social media usage', subtitle: 'Limit to 1hr', reward: 80, completed: false, type: 'social', isTrackable: true, currentProgress: 0, targetProgress: 60 },
    { id: 'focus_session', icon: '🧘', title: 'Focus mode session', subtitle: '1 session', reward: 40, completed: false, type: 'focus', isTrackable: true, currentProgress: 0, targetProgress: 1 },
    { id: 'hydration', icon: '💧', title: 'Hydration', subtitle: '8 glasses', reward: 40, completed: false, type: 'health', isTrackable: true, currentProgress: 0, targetProgress: 8 },
    { id: 'reading', icon: '📚', title: 'Reading', subtitle: 'Not Trackable', reward: 50, completed: false, type: 'reading', isTrackable: false },
    { id: 'exercise', icon: '🏋️', title: 'Exercise', subtitle: 'Not Trackable', reward: 70, completed: false, type: 'exercise', isTrackable: false },
    { id: 'deepwork', icon: '🧠', title: 'Deep work', subtitle: 'Not Trackable', reward: 60, completed: false, type: 'focus', isTrackable: false },
  ];

  const handleContinue = () => {
    const selected = goals.find(g => g.id === selectedGoalId);
    if (selected) {
        addGoal(selected);
    }
    navigate('/choose-buddy');
  };

  return (
    <div className="bg-[#E6F0FF] min-h-screen flex justify-center antialiased font-inter">
      <div className="w-full max-w-md min-h-screen relative flex flex-col px-6 pt-12 pb-8">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8 relative z-10">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center text-black hover:bg-black/5 transition-colors -ml-2">
            <span className="material-symbols-outlined text-2xl font-semibold">arrow_back</span>
          </button>
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-8 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
          <div className="w-10"></div> 
        </header>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2 tracking-tight font-nunito">Choose your first goal</h1>
          <p className="text-gray-500 text-base">Trackable goals sync with Screen Time data.</p>
        </div>

        <div className="flex-1 space-y-4 mb-28 overflow-y-auto no-scrollbar pb-4">
          {goals.map((goal) => {
            const isSelected = selectedGoalId === goal.id;
            return (
              <label 
                key={goal.id}
                onClick={() => setSelectedGoalId(goal.id)}
                className={`group bg-white p-5 rounded-3xl border-2 flex items-center cursor-pointer transition-all shadow-soft relative overflow-hidden ${isSelected ? 'border-primary' : 'border-transparent hover:border-blue-100'}`}
              >
                <div className="flex-shrink-0 mr-4 relative z-10">
                  <div className={`w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl`}>
                    {goal.icon}
                  </div>
                </div>
                <div className="flex-1 relative z-10">
                  <h3 className="font-bold text-black text-lg leading-tight">{goal.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500 font-medium">{goal.subtitle}</p>
                      {goal.isTrackable && (
                          <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Trackable</span>
                      )}
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3 relative z-10">
                  <div className={`w-6 h-6 rounded-full border-[6px] transition-colors box-border ${isSelected ? 'border-primary bg-white' : 'border-gray-200 bg-transparent group-hover:border-primary'}`}></div>
                </div>
              </label>
            );
          })}
        </div>

        <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#E6F0FF] via-[#E6F0FF] to-transparent flex justify-center pointer-events-none z-20 pb-10">
          <div className="w-full max-w-md pointer-events-auto">
            <button 
              onClick={handleContinue}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98] text-lg font-nunito"
            >
              <span>Continue with this goal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
