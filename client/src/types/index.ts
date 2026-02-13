export interface User {
  id: string;
  email: string;
  name: string;
  denomination: 'catholic' | 'protestant' | 'orthodox' | 'anglican' | 'other';
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    bibleTranslation: string;
    notificationsEnabled: boolean;
  };
  bookmarks: Bookmark[];
  readingHistory: ReadingHistory[];
}

export interface Bookmark {
  _id?: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  createdAt?: Date;
}

export interface ReadingHistory {
  book: string;
  chapter: number;
  timestamp: Date;
}

export interface Reminder {
  _id?: string;
  title: string;
  description?: string;
  time: string; // HH:MM format
  days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  prayerType?: 'rosary' | 'angelus' | 'divine-mercy' | 'morning' | 'evening' | 'custom';
  enabled: boolean;
}

export interface Prayer {
  id: string;
  title: string;
  text?: string;
  instructions?: string;
  reference?: string;
}

export interface BibleTranslation {
  id: string;
  name: string;
  language: string;
}

export interface BibleChapter {
  translation: string;
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

export interface BibleVerse {
  number: number;
  text: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  denomination?: string;
}
