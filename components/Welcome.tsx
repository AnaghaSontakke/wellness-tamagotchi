import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="h-full min-h-screen flex flex-col items-center justify-between p-6 relative overflow-hidden bg-background-light">
      {/* Decorative Background Elements */}
      <div className="absolute top-[20%] left-[12%] text-yellow-400 opacity-80 animate-pulse">
        <span className="material-symbols-outlined text-4xl">star</span>
      </div>
      <div className="absolute top-[18%] right-[15%] text-blue-300 opacity-60">
        <span className="material-symbols-outlined text-3xl">spark</span>
      </div>
      <div className="absolute top-[35%] right-[20%] text-yellow-300 animate-bounce">
        <span className="material-symbols-outlined text-2xl">auto_awesome</span>
      </div>

      <div className="flex-1 max-h-24"></div>

      <div className="w-full max-w-sm flex flex-col items-center z-10">
        <div className="relative mb-14">
          <div className="w-60 h-60 bg-[#93c5fd] rounded-[48px] shadow-glow flex flex-col items-center justify-center relative transition-transform hover:scale-105 duration-500 shadow-[0_0_40px_rgba(147,197,253,0.4)]">
            <div className="flex space-x-12 mt-4">
              <div className="w-5 h-5 bg-black rounded-full"></div>
              <div className="w-5 h-5 bg-black rounded-full"></div>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-2 text-primary opacity-50">
            <span className="material-symbols-outlined text-3xl">favorite</span>
          </div>
        </div>

        <div className="text-center space-y-4 px-2">
          <h1 className="text-3xl font-extrabold text-gray-900 font-nunito tracking-tight leading-tight">
            Your Digital <br />
            <span className="text-primary">Best Friend</span>
          </h1>
          <p className="text-gray-500 text-base font-medium font-inter leading-relaxed max-w-[280px] mx-auto">
            I help you balance screen time with real life, making digital wellness fun and rewarding.
          </p>
        </div>
      </div>

      <div className="flex-1"></div>

      <div className="w-full max-w-sm mb-8">
        <button 
          onClick={() => navigate('/how-it-works')}
          className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 px-6 rounded-full shadow-soft hover:shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center text-lg group font-nunito"
        >
          <span>Continue</span>
          <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}