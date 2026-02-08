import React, { createContext, useContext, useState, PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { BuddyType, Goal, ShopItem, ChatMessage, JournalEntry } from './types';

interface GameState {
  coins: number;
  buddy: BuddyType;
  happiness: number;
  health: number;
  storyStage: number;
  isGameOver: boolean;
  activeGoals: Goal[];
  completedGoals: Goal[];
  inventory: string[];
  chatHistory: ChatMessage[];
  currentThought: string;
  journalEntries: JournalEntry[];
  setBuddy: (b: BuddyType) => void;
  addGoal: (g: Goal) => void;
  addGoals: (gs: Goal[]) => void;
  completeGoal: (id: string) => void;
  updateGoalProgress: (id: string, amount: number) => void;
  collectReward: (id: string) => void;
  buyItem: (item: ShopItem) => boolean;
  addChatMessage: (msg: ChatMessage) => void;
  addCoins: (amount: number) => void;
  playSound: (type: 'coin' | 'success' | 'click' | 'purchase' | 'poke' | 'sad' | 'eating' | 'zen' | 'alarm') => void;
  resetGame: () => void;
  triggerThought: (manualText?: string) => void;
}

const defaultGoals: Goal[] = [
  { id: '1', icon: '📱', title: 'Limit Instagram', subtitle: '30 min tracked', reward: 50, completed: false, type: 'social', isTrackable: true, currentProgress: 0, targetProgress: 30 },
  { id: '2', icon: '💧', title: 'Hydration', subtitle: '8 glasses', reward: 40, completed: false, type: 'health', isTrackable: true, currentProgress: 0, targetProgress: 8 },
];

const STORY_BEATS = [
  "I'm keeping calm and analyzing supplies. We need O2 and food to survive this wreck.",
  "Stage 1: I'm building a makeshift windmill for power! It'll keep the tent cozy.",
  "Stage 2: First sprouts are out! I'm turning this Martian dust into a garden.",
  "Stage 3: Earth contacted me! They're coming to fetch me if I can repair the ship.",
  "Final Stage: The ship is ready. Earth, here I come! I can almost taste that burger."
];

const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [coins, setCoins] = useState(250);
  const [buddy, setBuddy] = useState<BuddyType>('astronaut');
  const [happiness, setHappiness] = useState(100); 
  const [health, setHealth] = useState(100); 
  const [storyStage, setStoryStage] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [activeGoals, setActiveGoals] = useState<Goal[]>(defaultGoals);
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);
  const [inventory, setInventory] = useState<string[]>([]);
  const [currentThought, setCurrentThought] = useState(STORY_BEATS[0]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const lastPurchaseRef = useRef<string | null>(null);
  const lastThoughtRef = useRef<string>(currentThought);
  const panicIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-progress story based on goals completed
  useEffect(() => {
    if (isGameOver) return;
    const stage = Math.min(Math.floor(completedGoals.length / 3), 4);
    if (stage > storyStage) {
      setStoryStage(stage);
      triggerThought(STORY_BEATS[stage]);
      // Add a journal entry
      const entry: JournalEntry = {
        id: `journal-${Date.now()}`,
        date: new Date(),
        content: `Log Entry: ${STORY_BEATS[stage]} Progressing well. Wellness levels: ${Math.floor(health)}HP / ${Math.floor(happiness)}HAP.`,
        stage: stage
      };
      setJournalEntries(prev => [entry, ...prev]);
    }
  }, [completedGoals.length, storyStage, health, happiness, isGameOver]);

  useEffect(() => {
    if (currentThought !== lastThoughtRef.current) {
      const msg: ChatMessage = {
        id: `thought-${Date.now()}`,
        sender: 'system',
        text: currentThought,
        timestamp: new Date(),
        meta: {
          title: buddy === 'astronaut' ? 'Mr. Martian' : buddy.charAt(0).toUpperCase() + buddy.slice(1),
          type: health < 30 || happiness < 30 ? 'warning' : 'info'
        }
      };
      setChatHistory(prev => [...prev, msg]);
      lastThoughtRef.current = currentThought;
    }
  }, [currentThought, buddy, health, happiness]);

  // Depletion Logic & Game Over Check
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setHappiness(prev => {
         const newVal = Math.max(0, prev - 0.8);
         return newVal;
      }); 
      setHealth(prev => {
         const newVal = Math.max(0, prev - 0.5);
         return newVal;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isGameOver]);

  // Check Game Over State and Trigger Panic Thoughts
  useEffect(() => {
    if (isGameOver) return;

    if (health <= 0 && happiness <= 0) {
        setIsGameOver(true);
        playSound('alarm');
        setCurrentThought("CRITICAL FAILURE. SYSTEMS OFFLINE.");
        const msg: ChatMessage = {
            id: `sys-fail-${Date.now()}`,
            sender: 'system',
            text: "MISSION FAILED. CONTACT LOST.",
            timestamp: new Date(),
            meta: { type: 'warning' }
        };
        setChatHistory(prev => [...prev, msg]);
    } else if (health < 20 || happiness < 20) {
        // Panic Mode
        if (!panicIntervalRef.current) {
            panicIntervalRef.current = setInterval(() => {
                triggerThought(); // Will trigger panic thought
            }, 10000); // More frequent thoughts
        }
    } else {
        if (panicIntervalRef.current) {
            clearInterval(panicIntervalRef.current);
            panicIntervalRef.current = null;
        }
    }
  }, [health, happiness, isGameOver]);

  const triggerThought = useCallback((manualText?: string) => {
    if (isGameOver) return;
    
    if (manualText) {
      setCurrentThought(manualText);
      return;
    }

    let thought = STORY_BEATS[storyStage];
    
    // Panic Logic
    if (health < 15 && happiness < 15) {
        const panicThoughts = [
            "SYSTEMS FAILING! I CAN'T SEE!",
            "IT'S GETTING DARK...",
            "PLEASE... HELP ME...",
            "WARNING: VITAL SIGNS CRITICAL"
        ];
        thought = panicThoughts[Math.floor(Math.random() * panicThoughts.length)];
    } else if (health < 25) {
      thought = "My vision is blurry... I need food or O2 now!";
    } else if (happiness < 25) {
      thought = "I can't take this silence anymore. I'm losing my mind.";
    } else if (lastPurchaseRef.current) {
      thought = `That ${lastPurchaseRef.current} helped a lot. Thank you.`;
      lastPurchaseRef.current = null;
    } else {
      const randomThoughts = [
        "Checking the solar arrays...",
        "I think I saw a dust devil today.",
        "Your consistency keeps me going.",
        "Just one more day. We can do this.",
        "The stars look different from here.",
        "Systems nominal, thanks to you."
      ];
      thought = randomThoughts[Math.floor(Math.random() * randomThoughts.length)];
    }
    setCurrentThought(thought);
  }, [health, happiness, storyStage, isGameOver]);

  const playSound = useCallback((type: 'coin' | 'success' | 'click' | 'purchase' | 'poke' | 'sad' | 'eating' | 'zen' | 'alarm') => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'coin') {
            osc.frequency.setValueAtTime(1200, now);
            osc.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(); osc.stop(now + 0.3);
        } else if (type === 'alarm') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(50, now + 0.5);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0, now + 2);
            osc.start(); osc.stop(now + 2);
        } else if (type === 'success') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, now); 
            osc.frequency.setValueAtTime(659.25, now + 0.1); 
            osc.frequency.setValueAtTime(783.99, now + 0.2); 
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.5);
            osc.start(); osc.stop(now + 0.5);
        } else if (type === 'eating') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, now);
            gain.gain.setValueAtTime(0.1, now);
            osc.start(); osc.stop(now + 0.1);
        } else if (type === 'sad') {
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.5);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.5);
            osc.start(); osc.stop(now + 0.5);
        } else {
            osc.frequency.setValueAtTime(400, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(); osc.stop(now + 0.1);
        }
    } catch (e) {}
  }, []);

  const addGoal = (goal: Goal) => setActiveGoals(prev => [...prev, goal]);
  const addGoals = (gs: Goal[]) => setActiveGoals(prev => [...prev, ...gs]);

  const completeGoal = useCallback((id: string) => {
    if (isGameOver) return;
    const goal = activeGoals.find(g => g.id === id);
    if (goal) {
      playSound('success');
      setActiveGoals(prev => prev.filter(g => g.id !== id));
      setCompletedGoals(prev => [...prev, { ...goal, completed: true, collected: false }]);
      // Goal completion gives a moderate boost to both
      setHappiness(prev => Math.min(100, prev + 15));
      setHealth(prev => Math.min(100, prev + 10));
      triggerThought();
    }
  }, [activeGoals, playSound, triggerThought, isGameOver]);

  const updateGoalProgress = (id: string, amount: number) => {
    if (isGameOver) return;
    setActiveGoals(prev => {
        const index = prev.findIndex(g => g.id === id);
        if (index === -1) return prev;
        const goal = prev[index];
        if (!goal.isTrackable) return prev;
        const newProgress = Math.min((goal.currentProgress || 0) + amount, goal.targetProgress || 1);
        const updatedGoal = { ...goal, currentProgress: newProgress };
        const newGoals = [...prev];
        newGoals[index] = updatedGoal;
        if (newProgress >= (goal.targetProgress || 1)) {
            setTimeout(() => completeGoal(id), 50);
        }
        return newGoals;
    });
  };

  const collectReward = (id: string) => {
      const goal = completedGoals.find(g => g.id === id);
      if (goal && !goal.collected) {
          playSound('coin');
          setCoins(prev => prev + goal.reward);
          setCompletedGoals(prev => prev.map(g => g.id === id ? { ...g, collected: true, isRemoving: true } : g));
          setTimeout(() => {
              setCompletedGoals(prev => prev.filter(g => g.id !== id));
          }, 3500);
      }
  };

  const buyItem = (item: ShopItem): boolean => {
    if (isGameOver) return false;
    if (coins >= item.price) {
      playSound('purchase');
      playSound('eating');
      setCoins(prev => prev - item.price);
      setInventory([...inventory, item.id]);
      
      // Specific Item Effects
      if (item.effect) {
          if (item.effect.happiness) setHappiness(prev => Math.min(100, Math.max(0, prev + item.effect!.happiness!)));
          if (item.effect.health) setHealth(prev => Math.min(100, Math.max(0, prev + item.effect!.health!)));
      } else {
          // Fallback generic boost if no specific effect defined
          setHappiness(prev => Math.min(100, prev + 20));
          setHealth(prev => Math.min(100, prev + 10));
      }

      lastPurchaseRef.current = item.name;
      triggerThought();
      return true;
    }
    return false;
  };

  const addChatMessage = (msg: ChatMessage) => setChatHistory(prev => [...prev, msg]);
  const addCoins = (amount: number) => { setCoins(prev => prev + amount); playSound('coin'); };

  const resetGame = () => {
      setCoins(250);
      setHappiness(100);
      setHealth(100);
      setStoryStage(0);
      setIsGameOver(false);
      setActiveGoals(defaultGoals);
      setCompletedGoals([]);
      setInventory([]);
      setChatHistory([]);
      setJournalEntries([]);
      setCurrentThought(STORY_BEATS[0]);
  };

  return (
    <GameContext.Provider value={{
      coins, buddy, happiness, health, storyStage, isGameOver, activeGoals, completedGoals, inventory, chatHistory, currentThought, journalEntries,
      setBuddy, addGoal, addGoals, completeGoal, updateGoalProgress, collectReward, buyItem, addChatMessage, addCoins, playSound, resetGame, triggerThought
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};