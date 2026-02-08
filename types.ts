
export type BuddyType = 'astronaut' | 'dracula' | 'princess';

export interface BuddyConfig {
  id: BuddyType;
  name: string;
  description: string;
  emoji: string;
  image: string;
}

export interface Goal {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  reward: number;
  completed: boolean;
  collected?: boolean;
  isRemoving?: boolean;
  type: 'social' | 'focus' | 'health' | 'reading' | 'exercise';
  isTrackable?: boolean;
  currentProgress?: number;
  targetProgress?: number;
}

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  type: 'food' | 'fun' | 'utility';
  effect?: {
    health?: number;
    happiness?: number;
  };
}

export interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  stage: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: Date;
  meta?: {
    title?: string;
    sub?: string;
    type?: 'warning' | 'success' | 'info';
  };
}
