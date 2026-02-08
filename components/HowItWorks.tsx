import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light font-inter flex flex-col items-center justify-between py-8 px-6">
      <div className="w-full h-2"></div>
      
      <div className="flex-1 w-full max-w-sm flex flex-col items-center pt-4">
        {/* Pagination Dots */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
        </div>

        <h1 className="text-3xl font-bold text-black mb-10 text-center tracking-tight font-nunito">
          How it works
        </h1>

        <div className="w-full flex flex-col gap-5">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-3xl flex items-center gap-5 shadow-soft">
            <div className="bg-red-50 text-red-500 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">ads_click</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-black mb-1">Set Goals</h3>
              <p className="text-[15px] text-gray-500 leading-snug font-medium">
                Choose daily limits that feel right for you
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-3xl flex items-center gap-5 shadow-soft">
            <div className="bg-orange-50 text-orange-500 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">card_giftcard</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-black mb-1">Get rewards</h3>
              <p className="text-[15px] text-gray-500 leading-snug font-medium">
                Earn coins when you complete your goals
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-3xl flex items-center gap-5 shadow-soft">
            <div className="bg-yellow-50 text-yellow-600 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">egg_alt</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-black mb-1">Customize buddy</h3>
              <p className="text-[15px] text-gray-500 leading-snug font-medium">
                Use rewards to customize and care for your companion
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm mt-8 mb-4">
        <button 
          onClick={() => navigate('/choose-goal')}
          className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-lg h-14 rounded-full shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] font-nunito"
        >
          Continue
          <span className="material-symbols-outlined text-2xl">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}