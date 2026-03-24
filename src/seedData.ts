import { Example, Category } from './types';

const generateExamples = (category: Category, count: number, prefix: string): Example[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${category}-seed-${i}`,
    phrase: `${prefix} example sentence number ${i + 1}.`,
    meaning: `Explanation for ${prefix} example ${i + 1}.`,
    sinhalaMeaning: `සිංහල තේරුම ${i + 1}`,
    example: `This is an example of ${prefix} ${i + 1}.`,
    category
  }));
};

export const SEED_DATA: Record<string, Example[]> = {
  'grammar': [
    { id: 'tp1', phrase: 'I drink water every morning.', meaning: 'Simple Present', sinhalaMeaning: 'මම සෑම උදෑසනකම වතුර බොනවා.', example: 'I drink water every morning to stay hydrated.', category: 'grammar' },
    { id: 'tp2', phrase: 'She is reading a book right now.', meaning: 'Present Continuous', sinhalaMeaning: 'ඇය දැන් පොතක් කියවමින් සිටී.', example: 'She is reading a book right now in the library.', category: 'grammar' },
    { id: 'tp3', phrase: 'They have finished their homework.', meaning: 'Present Perfect', sinhalaMeaning: 'ඔවුන් ඔවුන්ගේ ගෙදර වැඩ අවසන් කර ඇත.', example: 'They have finished their homework and are ready to play.', category: 'grammar' },
    { id: 'tp4', phrase: 'We have been living here for five years.', meaning: 'Present Perfect Continuous', sinhalaMeaning: 'අපි අවුරුදු පහක් තිස්සේ මෙහි ජීවත් වෙමු.', example: 'We have been living here for five years since 2021.', category: 'grammar' },
    { id: 'tp5', phrase: 'The sun rises in the east.', meaning: 'Simple Present (General Truth)', sinhalaMeaning: 'ඉර නැගෙනහිරින් පායයි.', example: 'The sun rises in the east every day.', category: 'grammar' },
    { id: 'tp6', phrase: 'He plays football on Sundays.', meaning: 'Simple Present (Habit)', sinhalaMeaning: 'ඔහු ඉරිදා දිනවල පාපන්දු සෙල්ලම් කරයි.', example: 'He plays football on Sundays with his friends.', category: 'grammar' },
    { id: 'tp7', phrase: 'I am working on a new project.', meaning: 'Present Continuous (Temporary Action)', sinhalaMeaning: 'මම අලුත් ව්‍යාපෘතියක් සඳහා වැඩ කරමින් සිටිමි.', example: 'I am working on a new project this month.', category: 'grammar' },
    { id: 'tp8', phrase: 'Are you listening to me?', meaning: 'Present Continuous (Question)', sinhalaMeaning: 'ඔබ මට සවන් දෙනවාද?', example: 'Are you listening to me while I explain this?', category: 'grammar' },
    { id: 'tp9', phrase: 'She has already seen that movie.', meaning: 'Present Perfect (Recent Action)', sinhalaMeaning: 'ඇය දැනටමත් එම චිත්‍රපටය නරඹා ඇත.', example: 'She has already seen that movie twice.', category: 'grammar' },
    { id: 'tp10', phrase: 'We have never been to Japan.', meaning: 'Present Perfect (Experience)', sinhalaMeaning: 'අපි කවදාවත් ජපානයට ගොස් නැත.', example: 'We have never been to Japan but we want to go.', category: 'grammar' },
    ...generateExamples('grammar', 190, 'Grammar Pattern')
  ],
  'phrasal_verbs': [
    { id: 'pv1', phrase: 'Break down', meaning: 'Stop functioning (vehicle, machine).', sinhalaMeaning: 'කැඩෙනවා / අක්‍රිය වෙනවා', example: 'My car broke down on the way to work.', category: 'phrasal_verbs' },
    { id: 'pv2', phrase: 'Call off', meaning: 'Cancel something.', sinhalaMeaning: 'අවලංගු කරනවා', example: 'They decided to call off the meeting.', category: 'phrasal_verbs' },
    ...generateExamples('phrasal_verbs', 198, 'Phrasal Verb')
  ],
  'idioms': [
    { id: 'i1', phrase: 'Piece of cake', meaning: 'Something very easy.', sinhalaMeaning: 'ඉතා පහසු දෙයක්', example: 'The exam was a piece of cake.', category: 'idioms' },
    { id: 'i2', phrase: 'Break a leg', meaning: 'Good luck.', sinhalaMeaning: 'වාසනාව ප්‍රාර්ථනා කිරීම', example: 'Break a leg at your performance tonight!', category: 'idioms' },
    ...generateExamples('idioms', 198, 'Idiom')
  ],
  'speaking': [
    { id: 's1', phrase: 'Could you please...?', meaning: 'Polite request.', sinhalaMeaning: 'කරුණාකර ඔබට පුළුවන්ද...?', example: 'Could you please pass me the salt?', category: 'speaking' },
    { id: 's2', phrase: 'I was wondering if...', meaning: 'Indirect question.', sinhalaMeaning: 'මට දැනගන්න පුළුවන්ද...', example: 'I was wondering if you are free tomorrow.', category: 'speaking' },
    ...generateExamples('speaking', 198, 'Speaking Pattern')
  ],
  'slang': [
    { id: 'sl1', phrase: 'No cap', meaning: 'No lie / For real.', sinhalaMeaning: 'ඇත්තටම / බොරු නෙමෙයි', example: 'That was the best pizza ever, no cap.', category: 'slang' },
    { id: 'sl2', phrase: 'Bet', meaning: 'Agreement / Yes.', sinhalaMeaning: 'එකඟයි / හරි', example: 'Want to go to the movies? - Bet.', category: 'slang' },
    ...generateExamples('slang', 198, 'Slang')
  ],
  'proverbs': [
    { id: 'pr1', phrase: 'Better late than never', meaning: 'It is better to arrive late than not at all.', sinhalaMeaning: 'නොපැමිණීමට වඩා ප්‍රමාද වී හෝ පැමිණීම හොඳය.', example: 'He finished his degree at 40; better late than never.', category: 'proverbs' },
    { id: 'pr2', phrase: 'A picture is worth a thousand words', meaning: 'A complex idea can be conveyed with just a single still image.', sinhalaMeaning: 'එක් පින්තූරයකින් වචන දහසක අදහසක් ලබා දිය හැකිය.', example: 'Just show him the photo; a picture is worth a thousand words.', category: 'proverbs' },
    ...generateExamples('proverbs', 198, 'Proverb')
  ],
};

