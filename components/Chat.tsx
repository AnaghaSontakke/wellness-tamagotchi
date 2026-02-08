
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../GameContext';
import { generateBuddyResponse } from '../services/geminiService';

export default function Chat() {
  const navigate = useNavigate();
  const { chatHistory, buddy, addChatMessage, playSound, journalEntries, storyStage } = useGame();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping, journalEntries]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    playSound('click');
    addChatMessage({
        id: `user-${Date.now()}`,
        sender: 'user',
        text: text,
        timestamp: new Date()
    });
    setInputValue('');
    setIsTyping(true);

    const responseText = await generateBuddyResponse(`${text} (Current Mission Stage: ${storyStage})`, buddy);
    
    setIsTyping(false);
    playSound('success');
    addChatMessage({
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: responseText,
        timestamp: new Date()
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage(inputValue);
  };

  const quickReplies = [
    { text: 'How is the mission?', icon: '🚀' },
    { text: 'Earth is watching!', icon: '🌍' },
    { text: 'Show me your log', icon: '📝' },
  ];

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString([], { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
  };

  return (
    <div className="bg-[#E0F2FE] min-h-screen flex justify-center antialiased font-inter">
        <div className="w-full max-w-md bg-[#E0F2FE] h-screen shadow-2xl overflow-hidden relative flex flex-col border-0 sm:border-x sm:border-white/20">
            
            <div className="flex items-center px-6 pt-6 pb-4 bg-[#E0F2FE] z-10 shrink-0">
                <button onClick={() => navigate('/dashboard')} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-gray-800 hover:bg-black/5 transition-colors">
                    <span className="material-icons-round text-2xl">arrow_back</span>
                </button>
                <div className="ml-2 flex flex-col">
                    <h1 className="text-xl font-bold text-black tracking-tight">{buddy === 'astronaut' ? 'Mr. Martian' : 'Buddy'}</h1>
                    <span className="text-[10px] text-green-500 font-bold flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span> Mission Live</span>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-32 no-scrollbar space-y-6 pt-4">
                {/* Journal Entries at the top */}
                {journalEntries.length > 0 && (
                   <div className="space-y-4 pb-4">
                      <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest justify-center">
                        <span className="h-px bg-gray-200 flex-1"></span>
                        Mission Logs
                        <span className="h-px bg-gray-200 flex-1"></span>
                      </div>
                      {journalEntries.map(entry => (
                        <div key={entry.id} className="bg-white/40 backdrop-blur-sm border border-white p-4 rounded-2xl shadow-sm text-center">
                           <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-tighter">Day {entry.stage + 1} - {entry.date.toLocaleDateString()}</p>
                           <p className="text-sm text-gray-700 font-medium italic">"{entry.content}"</p>
                        </div>
                      ))}
                   </div>
                )}

                {chatHistory.map((msg) => {
                    if (msg.sender === 'system') {
                        const icon = msg.meta?.type === 'warning' ? '⚠️' : '💭';
                        return (
                            <div key={msg.id} className="flex flex-col items-center animate-fade-in-up my-4">
                                <span className="text-[10px] text-gray-400 mb-2 font-medium uppercase tracking-widest">{formatTimestamp(msg.timestamp)}</span>
                                <div className="bg-white/60 backdrop-blur-sm border border-white px-4 py-3 rounded-2xl max-w-[90%] text-center shadow-sm">
                                    <p className="text-sm text-gray-600 font-medium italic"><span className="mr-1">{icon}</span>{msg.text}</p>
                                </div>
                            </div>
                        );
                    } else if (msg.sender === 'user') {
                        return (
                            <div key={msg.id} className="flex justify-end gap-2 animate-fade-in-up">
                                <div className="flex flex-col items-end max-w-[80%]">
                                    <div className="bg-primary text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md">
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                    </div>
                                    <span className="text-[9px] text-gray-400 mt-1 mr-1">{formatTimestamp(msg.timestamp)}</span>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div key={msg.id} className="flex justify-start gap-2 items-end animate-fade-in-up">
                                <div className="w-8 h-8 rounded-full bg-blue-100 shrink-0 overflow-hidden border border-white shadow-sm flex items-center justify-center mb-5">
                                    <div className="text-sm">👨‍🚀</div>
                                </div>
                                <div className="flex flex-col items-start max-w-[80%]">
                                    <div className="bg-white text-gray-800 px-5 py-3 rounded-2xl rounded-tl-sm shadow-md border border-gray-50">
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                    </div>
                                    <span className="text-[9px] text-gray-400 mt-1 ml-1">{formatTimestamp(msg.timestamp)}</span>
                                </div>
                            </div>
                        );
                    }
                })}

                {isTyping && (
                    <div className="flex justify-start gap-2 items-end">
                        <div className="w-8 h-8 rounded-full bg-blue-100 shrink-0 overflow-hidden border border-white shadow-sm flex items-center justify-center mb-5">
                            <div className="text-sm">👨‍🚀</div>
                        </div>
                        <div className="bg-white text-gray-800 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                            <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="h-4"></div>
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-[#E0F2FE]/95 backdrop-blur-md pt-2 pb-8 px-5 z-20">
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
                    {quickReplies.map((reply, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleSendMessage(reply.text)}
                            className="shrink-0 bg-white text-gray-700 px-4 py-2.5 rounded-full shadow-sm text-sm font-medium border border-gray-100 flex items-center gap-2 hover:bg-gray-50 active:scale-95 transition-all"
                        >
                            <span>{reply.icon}</span> {reply.text}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 bg-white p-1.5 pl-4 rounded-[2rem] shadow-lg border border-gray-100">
                    <input 
                        className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 py-2.5 text-base" 
                        placeholder="Message your buddy..." 
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button 
                        onClick={() => handleSendMessage(inputValue)}
                        disabled={!inputValue.trim()}
                        className="w-10 h-10 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center text-white shadow-md transition-all active:scale-90"
                    >
                        <span className="material-icons-round text-[20px] ml-0.5">send</span>
                    </button>
                </div>
            </div>

        </div>
    </div>
  );
}
