export interface LanguageItem {
  id: string;
  phrase: string;
  meaning: string;
  example: string;
  category: string;
}

export const CATEGORIES = [
  { id: 'grammar', name: 'Grammar Patterns', color: 'blue', icon: 'BookOpen' },
  { id: 'phrasal_verb', name: 'Phrasal Verbs', color: 'emerald', icon: 'Zap' },
  { id: 'idiom', name: 'Idioms', color: 'purple', icon: 'Sparkles' },
  { id: 'speaking_pattern', name: 'Speaking Patterns', color: 'orange', icon: 'MessageCircle' },
  { id: 'slang', name: 'Slangs', color: 'rose', icon: 'Flame' },
  { id: 'proverb', name: 'Proverbs', color: 'teal', icon: 'Quote' },
];

export const INITIAL_DATA: Record<string, LanguageItem[]> = {
  grammar: [
    { id: 'g1', phrase: 'Used to + Verb', meaning: 'Refers to something that happened regularly in the past but no longer happens.', example: 'I used to play tennis every weekend.', category: 'grammar' },
    { id: 'g2', phrase: 'Be used to + V-ing', meaning: 'To be accustomed to something.', example: 'I am used to waking up early.', category: 'grammar' },
    { id: 'g3', phrase: 'Get used to + V-ing', meaning: 'The process of becoming accustomed to something.', example: 'You will soon get used to the cold weather.', category: 'grammar' },
    { id: 'g4', phrase: 'Had better + Verb', meaning: 'Used to give strong advice or a warning.', example: 'You had better finish your homework now.', category: 'grammar' },
    { id: 'g5', phrase: 'Would rather + Verb', meaning: 'Used to express preference.', example: 'I would rather stay home than go out.', category: 'grammar' },
  ],
  phrasal_verb: [
    { id: 'pv1', phrase: 'Break down', meaning: 'To stop functioning (of a machine).', example: 'My car broke down on the highway.', category: 'phrasal_verb' },
    { id: 'pv2', phrase: 'Call off', meaning: 'To cancel something.', example: 'They called off the meeting due to rain.', category: 'phrasal_verb' },
    { id: 'pv3', phrase: 'Get along', meaning: 'To have a good relationship.', example: 'I get along well with my neighbors.', category: 'phrasal_verb' },
    { id: 'pv4', phrase: 'Look forward to', meaning: 'To be excited about something in the future.', example: 'I look forward to meeting you.', category: 'phrasal_verb' },
    { id: 'pv5', phrase: 'Put off', meaning: 'To postpone something.', example: 'Don\'t put off your work until tomorrow.', category: 'phrasal_verb' },
  ],
  idiom: [
    { id: 'i1', phrase: 'Piece of cake', meaning: 'Something very easy to do.', example: 'The exam was a piece of cake.', category: 'idiom' },
    { id: 'i2', phrase: 'Break a leg', meaning: 'Good luck (especially for a performance).', example: 'Break a leg at your audition tonight!', category: 'idiom' },
    { id: 'i3', phrase: 'Under the weather', meaning: 'Feeling slightly ill.', example: 'I\'m feeling a bit under the weather today.', category: 'idiom' },
    { id: 'i4', phrase: 'Bite the bullet', meaning: 'To endure a painful or difficult situation.', example: 'I decided to bite the bullet and tell him the truth.', category: 'idiom' },
    { id: 'i5', phrase: 'Call it a day', meaning: 'To stop working on something.', example: 'Let\'s call it a day and go home.', category: 'idiom' },
  ],
  speaking_pattern: [
    { id: 'sp1', phrase: 'How about + V-ing?', meaning: 'Used to make a suggestion.', example: 'How about going for a walk?', category: 'speaking_pattern' },
    { id: 'sp2', phrase: 'I was wondering if...', meaning: 'A polite way to ask for something or make a request.', example: 'I was wondering if you could help me.', category: 'speaking_pattern' },
    { id: 'sp3', phrase: 'It seems to me that...', meaning: 'Used to express an opinion politely.', example: 'It seems to me that we need more time.', category: 'speaking_pattern' },
    { id: 'sp4', phrase: 'To be honest...', meaning: 'Used to introduce a frank or sincere statement.', example: 'To be honest, I didn\'t like the movie.', category: 'speaking_pattern' },
    { id: 'sp5', phrase: 'As far as I know...', meaning: 'Used to say what you think is true based on your knowledge.', example: 'As far as I know, the shop is closed.', category: 'speaking_pattern' },
  ],
  slang: [
    { id: 's1', phrase: 'No cap', meaning: 'Used to emphasize that one is not lying.', example: 'That was the best burger I\'ve ever had, no cap.', category: 'slang' },
    { id: 's2', phrase: 'Ghost someone', meaning: 'To suddenly stop all communication with someone.', example: 'He ghosted me after our first date.', category: 'slang' },
    { id: 's3', phrase: 'Salty', meaning: 'Being upset or bitter about something minor.', example: 'He\'s just salty because he lost the game.', category: 'slang' },
    { id: 's4', phrase: 'Flex', meaning: 'To show off your belongings or accomplishments.', example: 'He bought a new car just to flex on his friends.', category: 'slang' },
    { id: 's5', phrase: 'Tea', meaning: 'Gossip or interesting news.', example: 'What\'s the tea? Tell me everything!', category: 'slang' },
  ],
  proverb: [
    { id: 'pr1', phrase: 'A stitch in time saves nine', meaning: 'Fixing a problem early prevents it from getting worse.', example: 'I should fix that leak now; a stitch in time saves nine.', category: 'proverb' },
    { id: 'pr2', phrase: 'Better late than never', meaning: 'It is better to do something late than not at all.', example: 'He finally arrived at 10 PM. Better late than never.', category: 'proverb' },
    { id: 'pr3', phrase: 'Don\'t judge a book by its cover', meaning: 'Don\'t judge someone or something based on appearance.', example: 'The house looks old, but it\'s beautiful inside. Don\'t judge a book by its cover.', category: 'proverb' },
    { id: 'pr4', phrase: 'Actions speak louder than words', meaning: 'What you do is more important than what you say.', example: 'He says he loves me, but actions speak louder than words.', category: 'proverb' },
    { id: 'pr5', phrase: 'Every cloud has a silver lining', meaning: 'Every difficult situation has a positive aspect.', example: 'I lost my job, but I found a better one. Every cloud has a silver lining.', category: 'proverb' },
  ],
};
