import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ChevronRight, BookOpen, CheckCircle2, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface Example {
  en: string;
  si: string;
}

interface Use {
  use: string;
  sinhalaUse: string;
  examples: Example[];
}

interface Tense {
  id: string;
  name: string;
  sinhalaName: string;
  formula: string;
  description: string;
  sinhalaDescription: string;
  color: string;
  glowColor: string;
  uses: Use[];
}

const tensesData: Tense[] = [
  {
    id: 'present-simple',
    name: 'Present Simple',
    sinhalaName: 'සරල වර්තමාන කාලය',
    formula: 'Subject + V1 (s/es)',
    description: 'Used for habits, general truths, and fixed arrangements.',
    sinhalaDescription: 'පුරුදු, පොදු සත්‍යයන් සහ ස්ථාවර වැඩපිළිවෙලවල් සඳහා භාවිතා වේ.',
    color: 'bg-blue-500',
    glowColor: 'shadow-blue-500/20',
    uses: [
      {
        use: 'Habits and Routines',
        sinhalaUse: 'පුරුදු සහ දිනචරියාවන්',
        examples: [
          { en: 'I drink tea every morning.', si: 'මම සෑම උදෑසනකම තේ බොනවා.' },
          { en: 'She goes to the gym on Saturdays.', si: 'ඇය සෙනසුරාදා දිනවල ව්‍යායාම් මධ්‍යස්ථානයට යනවා.' }
        ]
      },
      {
        use: 'General Truths',
        sinhalaUse: 'පොදු සත්‍යයන්',
        examples: [
          { en: 'The sun rises in the east.', si: 'ඉර නැගෙනහිරින් පායනවා.' },
          { en: 'Water boils at 100 degrees Celsius.', si: 'ජලය සෙල්සියස් අංශක 100 දී නටනවා.' }
        ]
      },
      {
        use: 'Scheduled Events',
        sinhalaUse: 'සැලසුම් කළ සිදුවීම්',
        examples: [
          { en: 'The train leaves at 8 PM.', si: 'දුම්රිය රාත්‍රී 8 ට පිටත් වේ.' },
          { en: 'The exam starts tomorrow morning.', si: 'විභාගය හෙට උදෑසන ආරම්භ වේ.' }
        ]
      }
    ]
  },
  {
    id: 'present-continuous',
    name: 'Present Continuous',
    sinhalaName: 'අඛණ්ඩ වර්තමාන කාලය',
    formula: 'Subject + am/is/are + V-ing',
    description: 'Used for actions happening right now or temporary situations.',
    sinhalaDescription: 'දැනට සිදුවෙමින් පවතින ක්‍රියා හෝ තාවකාලික තත්වයන් සඳහා භාවිතා වේ.',
    color: 'bg-emerald-500',
    glowColor: 'shadow-emerald-500/20',
    uses: [
      {
        use: 'Actions happening now',
        sinhalaUse: 'දැන් සිදුවන ක්‍රියා',
        examples: [
          { en: 'I am studying English right now.', si: 'මම මේ දැන් ඉංග්‍රීසි ඉගෙන ගනිමින් සිටිනවා.' },
          { en: 'They are playing football in the park.', si: 'ඔවුන් උද්‍යානයේ පාපන්දු සෙල්ලම් කරමින් සිටිනවා.' }
        ]
      },
      {
        use: 'Temporary situations',
        sinhalaUse: 'තාවකාලික තත්වයන්',
        examples: [
          { en: 'She is staying with her aunt this week.', si: 'ඇය මේ සතියේ ඇගේ නැන්දා සමඟ නැවතී සිටිනවා.' },
          { en: 'I am working from home these days.', si: 'මම මේ දිනවල නිවසේ සිට වැඩ කරනවා.' }
        ]
      },
      {
        use: 'Future arrangements',
        sinhalaUse: 'අනාගත විධිවිධාන',
        examples: [
          { en: 'We are meeting them for dinner tonight.', si: 'අපි අද රාත්‍රියේ රාත්‍රී ආහාරය සඳහා ඔවුන්ව හමුවෙමු.' },
          { en: 'He is flying to London tomorrow.', si: 'ඔහු හෙට ලන්ඩනය බලා පියාසර කරයි.' }
        ]
      }
    ]
  },
  {
    id: 'present-perfect',
    name: 'Present Perfect',
    sinhalaName: 'පූර්ණ වර්තමාන කාලය',
    formula: 'Subject + have/has + V3',
    description: 'Used for actions that happened at an unspecified time or started in the past and continue now.',
    sinhalaDescription: 'නිශ්චිත නොවන කාලයකදී සිදු වූ හෝ අතීතයේ ආරම්භ වී දැනටත් පවතින ක්‍රියා සඳහා භාවිතා වේ.',
    color: 'bg-violet-500',
    glowColor: 'shadow-violet-500/20',
    uses: [
      {
        use: 'Life experiences',
        sinhalaUse: 'ජීවිත අත්දැකීම්',
        examples: [
          { en: 'I have visited London twice.', si: 'මම ලන්ඩනයට දෙවරක් ගොස් තිබෙනවා.' },
          { en: 'She has never seen a whale.', si: 'ඇය කිසිදාක තල්මසෙකු දැක නැත.' }
        ]
      },
      {
        use: 'Action started in the past and continues',
        sinhalaUse: 'අතීතයේ ආරම්භ වී දැනටත් පවතින ක්‍රියා',
        examples: [
          { en: 'They have lived here for ten years.', si: 'ඔවුන් වසර දහයක් තිස්සේ මෙහි ජීවත් වී තිබෙනවා.' },
          { en: 'I have known him since childhood.', si: 'මම ඔහුව කුඩා කල සිටම හඳුනනවා.' }
        ]
      },
      {
        use: 'Recent actions with a result now',
        sinhalaUse: 'දැන් ප්‍රතිඵලයක් ඇති මෑතකදී සිදු වූ ක්‍රියා',
        examples: [
          { en: 'I have lost my keys.', si: 'මට මගේ යතුරු නැති වී ඇත.' },
          { en: 'He has finished his homework.', si: 'ඔහු ඔහුගේ ගෙදර වැඩ අවසන් කර ඇත.' }
        ]
      }
    ]
  },
  {
    id: 'present-perfect-continuous',
    name: 'Present Perfect Continuous',
    sinhalaName: 'පූර්ණ අඛණ්ඩ වර්තමාන කාලය',
    formula: 'Subject + have/has + been + V-ing',
    description: 'Used to show that something started in the past and has continued up until now.',
    sinhalaDescription: 'යමක් අතීතයේ ආරම්භ වී මේ දක්වා අඛණ්ඩව සිදුවෙමින් පවතින බව පෙන්වීමට භාවිතා කරයි.',
    color: 'bg-indigo-500',
    glowColor: 'shadow-indigo-500/20',
    uses: [
      {
        use: 'Duration of an action',
        sinhalaUse: 'ක්‍රියාවක කාලසීමාව',
        examples: [
          { en: 'I have been waiting for two hours.', si: 'මම පැය දෙකක් තිස්සේ බලා සිටිමි.' },
          { en: 'It has been raining all morning.', si: 'මුළු උදෑසනම වැසි වසිමින් පවතී.' }
        ]
      },
      {
        use: 'Recent actions with a result now',
        sinhalaUse: 'දැන් ප්‍රතිඵලයක් ඇති මෑතකදී සිදු වූ ක්‍රියා',
        examples: [
          { en: 'I am tired because I have been working hard.', si: 'මම වෙහෙස මහන්සි වී වැඩ කළ නිසා මට මහන්සියි.' },
          { en: 'She is out of breath because she has been running.', si: 'ඇය දුවමින් සිටි නිසා ඇයට හති වැටී ඇත.' }
        ]
      },
      {
        use: 'Temporary habits or situations',
        sinhalaUse: 'තාවකාලික පුරුදු හෝ තත්වයන්',
        examples: [
          { en: 'I have been eating too much lately.', si: 'මම මෑතකදී ඕනෑවට වඩා කමින් සිටිමි.' },
          { en: 'She has been working hard on her project.', si: 'ඇය ඇගේ ව්‍යාපෘතිය සඳහා වෙහෙස මහන්සි වී වැඩ කරමින් සිටී.' }
        ]
      }
    ]
  },
  {
    id: 'past-simple',
    name: 'Past Simple',
    sinhalaName: 'සරල අතීත කාලය',
    formula: 'Subject + V2',
    description: 'Used for completed actions in the past.',
    sinhalaDescription: 'අතීතයේ අවසන් වූ ක්‍රියා සඳහා භාවිතා වේ.',
    color: 'bg-orange-500',
    glowColor: 'shadow-orange-500/20',
    uses: [
      {
        use: 'Completed actions',
        sinhalaUse: 'අවසන් වූ ක්‍රියා',
        examples: [
          { en: 'I saw a movie yesterday.', si: 'මම ඊයේ චිත්‍රපටයක් බැලුවා.' },
          { en: 'They finished their homework.', si: 'ඔවුන් ඔවුන්ගේ ගෙදර වැඩ අවසන් කළා.' }
        ]
      },
      {
        use: 'Past habits',
        sinhalaUse: 'අතීත පුරුදු',
        examples: [
          { en: 'I lived in Galle when I was young.', si: 'මම කුඩා කාලයේ ගාල්ලේ ජීවත් වුණා.' },
          { en: 'She played the piano every day.', si: 'ඇය දිනපතා පියානෝව වාදනය කළාය.' }
        ]
      },
      {
        use: 'Series of completed actions',
        sinhalaUse: 'අවසන් වූ ක්‍රියා මාලාවක්',
        examples: [
          { en: 'I finished work, walked to the beach, and found a nice place to swim.', si: 'මම වැඩ අවසන් කර, වෙරළට ඇවිද ගොස්, පිහිනීමට හොඳ තැනක් සොයා ගත්තෙමි.' },
          { en: 'He arrived from the airport at 8:00, checked into the hotel at 9:00, and met the others at 10:00.', si: 'ඔහු 8:00 ට ගුවන් තොටුපළෙන් පැමිණ, 9:00 ට හෝටලයට ඇතුළු වී, 10:00 ට අනෙක් අය මුණගැසුණි.' }
        ]
      }
    ]
  },
  {
    id: 'past-continuous',
    name: 'Past Continuous',
    sinhalaName: 'අඛණ්ඩ අතීත කාලය',
    formula: 'Subject + was/were + V-ing',
    description: 'Used for actions that were happening at a specific time in the past.',
    sinhalaDescription: 'අතීතයේ යම් නිශ්චිත වේලාවක සිදුවෙමින් පැවති ක්‍රියා සඳහා භාවිතා වේ.',
    color: 'bg-amber-500',
    glowColor: 'shadow-amber-500/20',
    uses: [
      {
        use: 'Interrupted action in the past',
        sinhalaUse: 'අතීතයේ බාධා වූ ක්‍රියාවක්',
        examples: [
          { en: 'I was watching TV when she called.', si: 'ඇය කතා කරන විට මම රූපවාහිනිය නරඹමින් සිටියෙමි.' },
          { en: 'They were eating dinner when the lights went out.', si: 'විදුලිය විසන්ධි වන විට ඔවුන් රාත්‍රී ආහාරය ගනිමින් සිටියහ.' }
        ]
      },
      {
        use: 'Specific time as an interruption',
        sinhalaUse: 'බාධාවක් ලෙස නිශ්චිත කාලයක්',
        examples: [
          { en: 'At 8 PM last night, I was reading.', si: 'ඊයේ රාත්‍රී 8 ට මම කියවමින් සිටියෙමි.' },
          { en: 'What were you doing at noon?', si: 'දහවල් 12 ට ඔබ කුමක් කරමින් සිටියෙහිද?' }
        ]
      },
      {
        use: 'Parallel actions',
        sinhalaUse: 'සමාන්තර ක්‍රියා',
        examples: [
          { en: 'I was studying while he was making dinner.', si: 'ඔහු රාත්‍රී ආහාරය පිළියෙළ කරන අතරතුර මම පාඩම් කරමින් සිටියෙමි.' },
          { en: 'They were eating and talking.', si: 'ඔවුන් කමින් සහ කතා කරමින් සිටියහ.' }
        ]
      }
    ]
  },
  {
    id: 'past-perfect',
    name: 'Past Perfect',
    sinhalaName: 'පූර්ණ අතීත කාලය',
    formula: 'Subject + had + V3',
    description: 'Used for an action that was completed before another action in the past.',
    sinhalaDescription: 'අතීතයේ තවත් ක්‍රියාවකට පෙර අවසන් වූ ක්‍රියාවක් සඳහා භාවිතා වේ.',
    color: 'bg-pink-500',
    glowColor: 'shadow-pink-500/20',
    uses: [
      {
        use: 'Action before another past action',
        sinhalaUse: 'තවත් අතීත ක්‍රියාවකට පෙර සිදු වූ ක්‍රියාවක්',
        examples: [
          { en: 'The train had left when I arrived.', si: 'මා පැමිණෙන විට දුම්රිය පිටත්ව ගොස් තිබුණි.' },
          { en: 'She had already eaten when we called her.', si: 'අප ඇයට කතා කරන විට ඇය දැනටමත් ආහාර ගෙන තිබුණි.' }
        ]
      },
      {
        use: 'Cause of something in the past',
        sinhalaUse: 'අතීතයේ යමකට හේතුව',
        examples: [
          { en: 'I was tired because I had worked all night.', si: 'මම මුළු රාත්‍රිය පුරාම වැඩ කර තිබූ නිසා මට මහන්සියි.' },
          { en: 'The grass was yellow because it had not rained.', si: 'වැසි නොලැබුණු නිසා තණකොළ කහ පැහැ වී තිබුණි.' }
        ]
      },
      {
        use: 'Reported speech',
        sinhalaUse: 'වාර්තාගත ප්‍රකාශ',
        examples: [
          { en: 'He said he had lost his wallet.', si: 'ඔහුගේ පසුම්බිය නැති වූ බව ඔහු පැවසීය.' },
          { en: 'She told me she had seen that movie.', si: 'ඇය එම චිත්‍රපටය නරඹා ඇති බව මට පැවසුවාය.' }
        ]
      }
    ]
  },
  {
    id: 'past-perfect-continuous',
    name: 'Past Perfect Continuous',
    sinhalaName: 'පූර්ණ අඛණ්ඩ අතීත කාලය',
    formula: 'Subject + had + been + V-ing',
    description: 'Used to show that an action started in the past and continued up until another time in the past.',
    sinhalaDescription: 'ක්‍රියාවක් අතීතයේ ආරම්භ වී අතීතයේ තවත් කාලයක් දක්වා අඛණ්ඩව පැවති බව පෙන්වීමට භාවිතා කරයි.',
    color: 'bg-rose-500',
    glowColor: 'shadow-rose-500/20',
    uses: [
      {
        use: 'Duration before something in the past',
        sinhalaUse: 'අතීතයේ යමකට පෙර කාලසීමාව',
        examples: [
          { en: 'They had been talking for an hour before she arrived.', si: 'ඇය පැමිණීමට පෙර ඔවුන් පැයක් තිස්සේ කතා කරමින් සිටියහ.' },
          { en: 'I had been working there for a year when I got promoted.', si: 'මට උසස්වීමක් ලැබෙන විට මම වසරක් තිස්සේ එහි වැඩ කරමින් සිටියෙමි.' }
        ]
      },
      {
        use: 'Cause of a past result',
        sinhalaUse: 'අතීත ප්‍රතිඵලයකට හේතුව',
        examples: [
          { en: 'The road was wet because it had been raining.', si: 'වැසි වසිමින් තිබූ නිසා පාර තෙත් වී තිබුණි.' },
          { en: 'He was tired because he had been exercising.', si: 'ඔහු ව්‍යායාම කරමින් සිටි නිසා ඔහුට මහන්සියි.' }
        ]
      },
      {
        use: 'Emphasis on duration',
        sinhalaUse: 'කාලසීමාව අවධාරණය කිරීම',
        examples: [
          { en: 'They had been talking for over an hour.', si: 'ඔවුන් පැයකට වැඩි කාලයක් කතා කරමින් සිටියහ.' },
          { en: 'I had been living in Kandy for a long time.', si: 'මම දිගු කලක් මහනුවර ජීවත් වෙමින් සිටියෙමි.' }
        ]
      }
    ]
  },
  {
    id: 'future-simple',
    name: 'Future Simple',
    sinhalaName: 'සරල අනාගත කාලය',
    formula: 'Subject + will + V1',
    description: 'Used for spontaneous decisions, promises, and predictions.',
    sinhalaDescription: 'ක්ෂණික තීරණ, පොරොන්දු සහ අනාවැකි සඳහා භාවිතා වේ.',
    color: 'bg-cyan-500',
    glowColor: 'shadow-cyan-500/20',
    uses: [
      {
        use: 'Predictions',
        sinhalaUse: 'අනාවැකි',
        examples: [
          { en: 'It will rain tomorrow.', si: 'හෙට වැසි වසිනු ඇත.' },
          { en: 'I think he will win.', si: 'ඔහු දිනනු ඇතැයි මම සිතමි.' }
        ]
      },
      {
        use: 'Promises and Offers',
        sinhalaUse: 'පොරොන්දු සහ ඉදිරිපත් කිරීම්',
        examples: [
          { en: 'I will help you with your homework.', si: 'මම ඔබේ ගෙදර වැඩවලට උදව් කරන්නම්.' },
          { en: 'I will call you later.', si: 'මම ඔබට පසුව කතා කරන්නම්.' }
        ]
      },
      {
        use: 'Spontaneous decisions',
        sinhalaUse: 'ක්ෂණික තීරණ',
        examples: [
          { en: 'I am hungry. I will make a sandwich.', si: 'මට බඩගිනියි. මම සැන්ඩ්විච් එකක් සාදන්නම්.' },
          { en: 'The phone is ringing. I will answer it.', si: 'දුරකථනය නාද වේ. මම එයට පිළිතුරු දෙන්නම්.' }
        ]
      }
    ]
  },
  {
    id: 'future-continuous',
    name: 'Future Continuous',
    sinhalaName: 'අඛණ්ඩ අනාගත කාලය',
    formula: 'Subject + will + be + V-ing',
    description: 'Used for actions that will be happening at a specific time in the future.',
    sinhalaDescription: 'අනාගතයේ යම් නිශ්චිත වේලාවක සිදුවෙමින් පවතින ක්‍රියා සඳහා භාවිතා වේ.',
    color: 'bg-teal-500',
    glowColor: 'shadow-teal-500/20',
    uses: [
      {
        use: 'Action at a specific time in the future',
        sinhalaUse: 'අනාගතයේ නිශ්චිත වේලාවක සිදුවන ක්‍රියාවක්',
        examples: [
          { en: 'This time tomorrow, I will be flying to Japan.', si: 'හෙට මේ වෙලාවට මම ජපානය බලා පියාසර කරමින් සිටිනු ඇත.' },
          { en: 'At 10 PM, they will be sleeping.', si: 'රාත්‍රී 10 ට ඔවුන් නිදාගෙන සිටිනු ඇත.' }
        ]
      },
      {
        use: 'Interrupted action in the future',
        sinhalaUse: 'අනාගතයේ බාධා වන ක්‍රියාවක්',
        examples: [
          { en: 'I will be waiting for you when your bus arrives.', si: 'ඔබේ බස් රථය පැමිණෙන විට මම ඔබ එනතුරු බලා සිටිනු ඇත.' },
          { en: 'She will be working when you call.', si: 'ඔබ කතා කරන විට ඇය වැඩ කරමින් සිටිනු ඇත.' }
        ]
      },
      {
        use: 'Polite inquiries about future plans',
        sinhalaUse: 'අනාගත සැලසුම් පිළිබඳ විනීත විමසීම්',
        examples: [
          { en: 'Will you be joining us for the party?', si: 'ඔබ සාදය සඳහා අප හා එක්වනු ඇත්ද?' },
          { en: 'Will she be staying with us long?', si: 'ඇය අප සමඟ වැඩි කාලයක් රැඳී සිටිනු ඇත්ද?' }
        ]
      }
    ]
  },
  {
    id: 'future-perfect',
    name: 'Future Perfect',
    sinhalaName: 'පූර්ණ අනාගත කාලය',
    formula: 'Subject + will + have + V3',
    description: 'Used for an action that will be completed before a specific time in the future.',
    sinhalaDescription: 'අනාගතයේ යම් නිශ්චිත වේලාවකට පෙර අවසන් වන ක්‍රියාවක් සඳහා භාවිතා වේ.',
    color: 'bg-sky-500',
    glowColor: 'shadow-sky-500/20',
    uses: [
      {
        use: 'Action completed before a future time',
        sinhalaUse: 'අනාගත කාලයකට පෙර අවසන් වූ ක්‍රියාවක්',
        examples: [
          { en: 'I will have finished my project by Monday.', si: 'මම සඳුදා වන විට මගේ ව්‍යාපෘතිය අවසන් කර තිබෙනු ඇත.' },
          { en: 'They will have left before we arrive.', si: 'අප පැමිණීමට පෙර ඔවුන් පිටත්ව ගොස් තිබෙනු ඇත.' }
        ]
      },
      {
        use: 'Duration until a future time',
        sinhalaUse: 'අනාගත කාලයක් දක්වා කාලසීමාව',
        examples: [
          { en: 'By next year, I will have lived here for five years.', si: 'ලබන වසර වන විට මම වසර පහක් මෙහි ජීවත් වී තිබෙනු ඇත.' },
          { en: 'She will have worked here for a decade by June.', si: 'ජුනි මාසය වන විට ඇය දශකයක් මෙහි වැඩ කර තිබෙනු ඇත.' }
        ]
      },
      {
        use: 'Certainty about a past action',
        sinhalaUse: 'අතීත ක්‍රියාවක් පිළිබඳ ස්ථිරත්වය',
        examples: [
          { en: 'The train will have left by now.', si: 'දුම්රිය මේ වන විට පිටත් වී තිබෙනු ඇත.' },
          { en: 'He will have heard the news already.', si: 'ඔහු ඒ වන විටත් පුවත අසා තිබෙනු ඇත.' }
        ]
      }
    ]
  },
  {
    id: 'future-perfect-continuous',
    name: 'Future Perfect Continuous',
    sinhalaName: 'පූර්ණ අඛණ්ඩ අනාගත කාලය',
    formula: 'Subject + will + have + been + V-ing',
    description: 'Used to show how long an action will have been happening until a specific time in the future.',
    sinhalaDescription: 'අනාගතයේ යම් නිශ්චිත වේලාවක් දක්වා ක්‍රියාවක් කොපමණ කාලයක් සිදුවෙමින් පවතිනු ඇත්දැයි පෙන්වීමට භාවිතා කරයි.',
    color: 'bg-blue-600',
    glowColor: 'shadow-blue-600/20',
    uses: [
      {
        use: 'Duration before a future event',
        sinhalaUse: 'අනාගත සිදුවීමකට පෙර කාලසීමාව',
        examples: [
          { en: 'By 5 PM, I will have been working for eight hours.', si: 'සවස 5 වන විට මම පැය අටක් තිස්සේ වැඩ කරමින් සිටිනු ඇත.' },
          { en: 'They will have been traveling for two days by the time they arrive.', si: 'ඔවුන් පැමිණෙන විට ඔවුන් දින දෙකක් තිස්සේ ගමන් කරමින් සිටිනු ඇත.' }
        ]
      },
      {
        use: 'Cause of a future result',
        sinhalaUse: 'අනාගත ප්‍රතිඵලයකට හේතුව',
        examples: [
          { en: 'I will be tired because I will have been studying all day.', si: 'මම මුළු දවසම පාඩම් කරමින් සිටින නිසා මට මහන්සි වනු ඇත.' },
          { en: 'She will be hungry because she will have been fasting.', si: 'ඇය උපවාස කරමින් සිටින නිසා ඇයට බඩගිනි වනු ඇත.' }
        ]
      },
      {
        use: 'Emphasis on the activity',
        sinhalaUse: 'ක්‍රියාකාරකම අවධාරණය කිරීම',
        examples: [
          { en: 'They will have been playing for over three hours.', si: 'ඔවුන් පැය තුනකට වැඩි කාලයක් සෙල්ලම් කරමින් සිටිනු ඇත.' },
          { en: 'I will have been traveling for a month.', si: 'මම මාසයක් තිස්සේ සංචාරය කරමින් සිටිනු ඇත.' }
        ]
      }
    ]
  }
];

export const Tenses = () => {
  const [selectedTense, setSelectedTense] = React.useState<Tense | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      {/* Page Cover Image */}
      <div className="h-[400px] w-full relative overflow-hidden">
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1600&h=500"
          alt="English Tenses"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/20 to-white" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-8xl font-black text-white drop-shadow-2xl tracking-tighter uppercase italic">
              Grammar <span className="text-blue-400">Mastery</span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/5 blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 -mt-24 px-8 max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-16 shadow-2xl shadow-slate-200 border border-white mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="inline-block p-6 rounded-[2rem] bg-white shadow-2xl mb-8 relative group"
          >
            <div className="absolute inset-0 bg-blue-500/10 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all" />
            <Clock className="text-blue-600 relative z-10" size={48} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            English <span className="text-blue-600 italic serif">Tenses</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed"
          >
            Master the foundation of English grammar with our interactive tense guide.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {tensesData.map((tense, i) => (
          <motion.div
            key={tense.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02, translateY: -5 }}
            onClick={() => setSelectedTense(tense)}
            className={cn(
              "glass-card p-8 bg-white shadow-sm border-none cursor-pointer group transition-all relative overflow-hidden",
              tense.glowColor,
              "hover:shadow-2xl"
            )}
          >
            <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150", tense.color)} />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-apple-dark mb-1">{tense.name}</h3>
                  <span className="text-apple-blue font-bold text-sm">{tense.sinhalaName}</span>
                </div>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg", tense.color)}>
                  <BookOpen size={20} />
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-apple-bg mb-6 border border-apple-bg/50">
                <span className="text-[10px] font-bold text-apple-gray uppercase tracking-widest block mb-1">Formula</span>
                <code className="text-apple-dark font-mono font-bold">{tense.formula}</code>
              </div>
              
              <p className="text-apple-gray text-sm line-clamp-2 mb-6">
                {tense.description}
              </p>
              
              <div className="flex items-center gap-2 text-apple-blue font-bold text-sm group-hover:gap-4 transition-all">
                Learn More <ChevronRight size={16} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

      <AnimatePresence>
        {selectedTense && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-apple-dark/40 backdrop-blur-md"
            onClick={() => setSelectedTense(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-[40px] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={cn("h-3 w-full shrink-0", selectedTense.color)} />
              
              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                <div className="flex justify-between items-start mb-16">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-6xl font-bold text-apple-dark mb-3 tracking-tight">{selectedTense.name}</h2>
                    <div className="flex items-center gap-4">
                      <p className="text-3xl text-apple-blue font-bold">{selectedTense.sinhalaName}</p>
                      <div className={cn("px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-widest", selectedTense.color)}>
                        Grammar Guide
                      </div>
                    </div>
                  </motion.div>
                  <motion.button 
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    whileHover={{ rotate: 90 }}
                    onClick={() => setSelectedTense(null)}
                    className="w-14 h-14 rounded-2xl bg-apple-bg flex items-center justify-center text-apple-gray hover:text-apple-dark hover:bg-apple-bg/80 transition-all shadow-sm"
                  >
                    <span className="text-3xl">×</span>
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  <div className="lg:col-span-5 space-y-10">
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="p-10 rounded-[2.5rem] bg-apple-bg/50 border border-apple-bg backdrop-blur-sm relative overflow-hidden group"
                    >
                      <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 blur-2xl transition-all group-hover:scale-150", selectedTense.color)} />
                      <div className="flex items-center gap-4 mb-8 text-apple-blue relative z-10">
                        <div className="p-3 rounded-2xl bg-white shadow-sm">
                          <Info size={28} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Description</span>
                      </div>
                      <p className="text-2xl text-apple-dark leading-relaxed mb-6 relative z-10 font-medium">
                        {selectedTense.description}
                      </p>
                      <p className="text-xl text-apple-gray italic relative z-10">
                        {selectedTense.sinhalaDescription}
                      </p>
                    </motion.div>

                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="p-10 rounded-[2.5rem] bg-apple-dark text-white shadow-2xl relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                      <div className="flex items-center gap-4 mb-8 text-apple-blue relative z-10">
                        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md">
                          <CheckCircle2 size={28} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Grammar Formula</span>
                      </div>
                      <code className="text-4xl font-mono font-bold block relative z-10 group-hover:scale-105 transition-transform origin-left">
                        {selectedTense.formula}
                      </code>
                    </motion.div>
                  </div>

                  <div className="lg:col-span-7 space-y-10">
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-4 text-apple-dark"
                    >
                      <div className="p-3 rounded-2xl bg-apple-bg">
                        <BookOpen size={28} className="text-apple-blue" />
                      </div>
                      <h3 className="text-3xl font-bold tracking-tight">Common Uses & Examples</h3>
                    </motion.div>
                    
                    <div className="space-y-12">
                      {selectedTense.uses.map((use, i) => (
                        <motion.div 
                          key={i}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 + (i * 0.1) }}
                          className="space-y-6"
                        >
                          <div className="flex items-center gap-4 border-l-4 border-apple-blue pl-6">
                            <div>
                              <h4 className="text-2xl font-bold text-apple-dark tracking-tight">{use.use}</h4>
                              <p className="text-apple-blue font-bold text-sm tracking-wide">{use.sinhalaUse}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            {use.examples.map((ex, j) => (
                              <motion.div 
                                key={j}
                                whileHover={{ x: 10 }}
                                className="p-6 rounded-[2rem] bg-apple-bg/30 border border-apple-bg hover:bg-white hover:shadow-xl hover:border-apple-blue/20 transition-all duration-300 group"
                              >
                                <p className="text-xl font-bold text-apple-dark mb-2 group-hover:text-apple-blue transition-colors">{ex.en}</p>
                                <p className="text-apple-gray text-lg italic">{ex.si}</p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-apple-bg/50 border-t border-apple-bg shrink-0 flex justify-center">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTense(null)}
                  className="btn-primary py-5 px-16 text-xl font-bold shadow-2xl shadow-apple-blue/30 rounded-[2rem]"
                >
                  Got it, thanks!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
