export type Category = 'grammar' | 'phrasal_verbs' | 'idioms' | 'speaking' | 'slang' | 'proverbs' | 'online_resources';

export interface Example {
  id: string;
  category: Category;
  phrase: string;
  meaning: string;
  sinhalaMeaning: string;
  example: string;
  isCustom?: boolean;
  createdAt?: string;
}

export interface UserExample extends Example {
  userId: string;
  isCustom: true;
  createdAt: string;
}

export const CATEGORIES: { id: Category; label: string; description: string }[] = [
  { id: 'grammar', label: 'Grammar Patterns', description: 'Master essential grammatical structures and patterns.' },
  { id: 'phrasal_verbs', label: 'Phrasal Verbs', description: 'Learn common verbs combined with prepositions.' },
  { id: 'idioms', label: 'Idioms', description: 'Understand expressions with figurative meanings.' },
  { id: 'speaking', label: 'Speaking Patterns', description: 'Common phrases used in daily conversation.' },
  { id: 'slang', label: 'Slangs', description: 'Informal words and phrases used in specific contexts.' },
  { id: 'proverbs', label: 'Proverbs', description: 'Short, well-known sayings that offer advice.' },
  { id: 'online_resources', label: 'Online Resources', description: 'Curated podcasts, newspapers, and YouTube channels.' },
];
