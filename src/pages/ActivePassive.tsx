import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Repeat, ArrowRight, Info, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

interface VoiceExample {
  active: string;
  passive: string;
  siActive: string;
  siPassive: string;
}

interface VoiceUse {
  use: string;
  sinhalaUse: string;
  examples: VoiceExample[];
}

interface VoiceTense {
  id: string;
  name: string;
  sinhalaName: string;
  hasPassive: boolean;
  activeFormula: string;
  passiveFormula?: string;
  description: string;
  sinhalaDescription: string;
  color: string;
  glowColor: string;
  uses: VoiceUse[];
}

const voiceData: VoiceTense[] = [
  {
    id: 'present-simple',
    name: 'Present Simple',
    sinhalaName: 'සරල වර්තමාන කාලය',
    hasPassive: true,
    activeFormula: 'Subject + V1 (s/es)',
    passiveFormula: 'Object + am/is/are + V3',
    description: 'Used for general facts and regular actions.',
    sinhalaDescription: 'පොදු කරුණු සහ නිතිපතා සිදුවන ක්‍රියා සඳහා භාවිතා වේ.',
    color: 'bg-blue-500',
    glowColor: 'shadow-blue-500/20',
    uses: [
      {
        use: 'General Facts',
        sinhalaUse: 'පොදු කරුණු',
        examples: [
          {
            active: 'He writes a letter.',
            passive: 'A letter is written by him.',
            siActive: 'ඔහු ලිපියක් ලියයි.',
            siPassive: 'ඔහු විසින් ලිපියක් ලියනු ලැබේ.'
          },
          {
            active: 'They play football.',
            passive: 'Football is played by them.',
            siActive: 'ඔවුන් පාපන්දු සෙල්ලම් කරති.',
            siPassive: 'ඔවුන් විසින් පාපන්දු සෙල්ලම් කරනු ලැබේ.'
          }
        ]
      },
      {
        use: 'Daily Routines',
        sinhalaUse: 'දිනචරියාවන්',
        examples: [
          {
            active: 'She cleans the house every day.',
            passive: 'The house is cleaned by her every day.',
            siActive: 'ඇය දිනපතා නිවස පිරිසිදු කරයි.',
            siPassive: 'ඇය විසින් දිනපතා නිවස පිරිසිදු කරනු ලැබේ.'
          },
          {
            active: 'I make breakfast.',
            passive: 'Breakfast is made by me.',
            siActive: 'මම උදෑසන ආහාරය සාදමි.',
            siPassive: 'මා විසින් උදෑසන ආහාරය සාදනු ලැබේ.'
          }
        ]
      },
      {
        use: 'Scheduled Events',
        sinhalaUse: 'සැලසුම් කළ සිදුවීම්',
        examples: [
          {
            active: 'The company holds meetings every Monday.',
            passive: 'Meetings are held by the company every Monday.',
            siActive: 'සමාගම සෑම සඳුදා දිනකම රැස්වීම් පවත්වයි.',
            siPassive: 'සමාගම විසින් සෑම සඳුදා දිනකම රැස්වීම් පවත්වනු ලැබේ.'
          },
          {
            active: 'They deliver the newspaper at 6 AM.',
            passive: 'The newspaper is delivered at 6 AM.',
            siActive: 'ඔවුන් උදේ 6 ට පුවත්පත බෙදා හරියි.',
            siPassive: 'උදේ 6 ට පුවත්පත බෙදා හරිනු ලැබේ.'
          }
        ]
      }
    ]
  },
  {
    id: 'present-continuous',
    name: 'Present Continuous',
    sinhalaName: 'අඛණ්ඩ වර්තමාන කාලය',
    hasPassive: true,
    activeFormula: 'Subject + am/is/are + V-ing',
    passiveFormula: 'Object + am/is/are + being + V3',
    description: 'Used for actions happening right now.',
    sinhalaDescription: 'දැනට සිදුවෙමින් පවතින ක්‍රියා සඳහා භාවිතා වේ.',
    color: 'bg-emerald-500',
    glowColor: 'shadow-emerald-500/20',
    uses: [
      {
        use: 'Actions in Progress',
        sinhalaUse: 'සිදුවෙමින් පවතින ක්‍රියා',
        examples: [
          {
            active: 'She is cleaning the room.',
            passive: 'The room is being cleaned by her.',
            siActive: 'ඇය කාමරය පිරිසිදු කරමින් සිටී.',
            siPassive: 'ඇය විසින් කාමරය පිරිසිදු කරනු ලබමින් පවතී.'
          },
          {
            active: 'We are building a house.',
            passive: 'A house is being built by us.',
            siActive: 'අපි නිවසක් සාදමින් සිටිමු.',
            siPassive: 'අප විසින් නිවසක් සාදනු ලබමින් පවතී.'
          }
        ]
      },
      {
        use: 'Temporary Actions',
        sinhalaUse: 'තාවකාලික ක්‍රියා',
        examples: [
          {
            active: 'They are repairing the road.',
            passive: 'The road is being repaired by them.',
            siActive: 'ඔවුන් පාර අලුත්වැඩියා කරමින් සිටිති.',
            siPassive: 'ඔවුන් විසින් පාර අලුත්වැඩියා කරනු ලබමින් පවතී.'
          },
          {
            active: 'He is painting a picture.',
            passive: 'A picture is being painted by him.',
            siActive: 'ඔහු පින්තූරයක් අඳිමින් සිටී.',
            siPassive: 'ඔහු විසින් පින්තූරයක් අඳිනු ලබමින් පවතී.'
          }
        ]
      },
      {
        use: 'Future Arrangements',
        sinhalaUse: 'අනාගත විධිවිධාන',
        examples: [
          {
            active: 'They are holding a meeting tomorrow.',
            passive: 'A meeting is being held by them tomorrow.',
            siActive: 'ඔවුන් හෙට රැස්වීමක් පවත්වයි.',
            siPassive: 'ඔවුන් විසින් හෙට රැස්වීමක් පවත්වනු ලබමින් පවතී.'
          },
          {
            active: 'I am preparing the report tonight.',
            passive: 'The report is being prepared by me tonight.',
            siActive: 'මම අද රාත්‍රියේ වාර්තාව සකස් කරමි.',
            siPassive: 'මා විසින් අද රාත්‍රියේ වාර්තාව සකස් කරනු ලබමින් පවතී.'
          }
        ]
      }
    ]
  },
  {
    id: 'present-perfect',
    name: 'Present Perfect',
    sinhalaName: 'පූර්ණ වර්තමාන කාලය',
    hasPassive: true,
    activeFormula: 'Subject + have/has + V3',
    passiveFormula: 'Object + have/has + been + V3',
    description: 'Used for actions completed at an unspecified time.',
    sinhalaDescription: 'නිශ්චිත නොවන කාලයකදී අවසන් වූ ක්‍රියා සඳහා භාවිතා වේ.',
    color: 'bg-violet-500',
    glowColor: 'shadow-violet-500/20',
    uses: [
      {
        use: 'Completed Actions',
        sinhalaUse: 'අවසන් වූ ක්‍රියා',
        examples: [
          {
            active: 'I have finished the work.',
            passive: 'The work has been finished by me.',
            siActive: 'මම වැඩ අවසන් කර ඇත්තෙමි.',
            siPassive: 'මා විසින් වැඩ අවසන් කරනු ලැබ ඇත.'
          },
          {
            active: 'He has broken the window.',
            passive: 'The window has been broken by him.',
            siActive: 'ඔහු ජනේලය කඩා ඇත.',
            siPassive: 'ඔහු විසින් ජනේලය කඩනු ලැබ ඇත.'
          }
        ]
      },
      {
        use: 'Recent Events',
        sinhalaUse: 'මෑතකදී සිදු වූ සිදුවීම්',
        examples: [
          {
            active: 'They have invited us.',
            passive: 'We have been invited by them.',
            siActive: 'ඔවුන් අපට ආරාධනා කර ඇත.',
            siPassive: 'ඔවුන් විසින් අපට ආරාධනා කරනු ලැබ ඇත.'
          },
          {
            active: 'She has lost her keys.',
            passive: 'Her keys have been lost by her.',
            siActive: 'ඇයට ඇගේ යතුරු නැති වී ඇත.',
            siPassive: 'ඇය විසින් ඇගේ යතුරු නැති කරනු ලැබ ඇත.'
          }
        ]
      },
      {
        use: 'Life Experiences',
        sinhalaUse: 'ජීවිත අත්දැකීම්',
        examples: [
          {
            active: 'I have visited London.',
            passive: 'London has been visited by me.',
            siActive: 'මම ලන්ඩනයට ගොස් ඇත්තෙමි.',
            siPassive: 'මා විසින් ලන්ඩනයට ගොස් කරනු ලැබ ඇත.'
          },
          {
            active: 'They have seen this movie.',
            passive: 'This movie has been seen by them.',
            siActive: 'ඔවුන් මෙම චිත්‍රපටය නරඹා ඇත.',
            siPassive: 'ඔවුන් විසින් මෙම චිත්‍රපටය නරඹනු ලැබ ඇත.'
          }
        ]
      }
    ]
  },
  {
    id: 'present-perfect-continuous',
    name: 'Present Perfect Continuous',
    sinhalaName: 'පූර්ණ අඛණ්ඩ වර්තමාන කාලය',
    hasPassive: false,
    activeFormula: 'Subject + have/has + been + V-ing',
    description: 'This tense does not have a standard passive voice form.',
    sinhalaDescription: 'මෙම කාලය සඳහා සම්මත කර්ම කාරක (Passive Voice) ස්වරූපයක් නොමැත.',
    color: 'bg-slate-400',
    glowColor: 'shadow-slate-400/10',
    uses: []
  },
  {
    id: 'past-simple',
    name: 'Past Simple',
    sinhalaName: 'සරල අතීත කාලය',
    hasPassive: true,
    activeFormula: 'Subject + V2',
    passiveFormula: 'Object + was/were + V3',
    description: 'Used for actions completed in the past.',
    sinhalaDescription: 'අතීතයේ අවසන් වූ ක්‍රියා සඳහා භාවිතා වේ.',
    color: 'bg-orange-500',
    glowColor: 'shadow-orange-500/20',
    uses: [
      {
        use: 'Past Events',
        sinhalaUse: 'අතීත සිදුවීම්',
        examples: [
          {
            active: 'She bought a car.',
            passive: 'A car was bought by her.',
            siActive: 'ඇය මෝටර් රථයක් මිලදී ගත්තාය.',
            siPassive: 'ඇය විසින් මෝටර් රථයක් මිලදී ගනු ලැබීය.'
          },
          {
            active: 'They invited us.',
            passive: 'We were invited by them.',
            siActive: 'ඔවුන් අපට ආරාධනා කළහ.',
            siPassive: 'ඔවුන් විසින් අපට ආරාධනා කරනු ලැබීය.'
          }
        ]
      },
      {
        use: 'Historical Facts',
        sinhalaUse: 'ඓතිහාසික කරුණු',
        examples: [
          {
            active: 'Columbus discovered America.',
            passive: 'America was discovered by Columbus.',
            siActive: 'කොලොම්බස් ඇමරිකාව සොයා ගත්තේය.',
            siPassive: 'කොලොම්බස් විසින් ඇමරිකාව සොයා ගනු ලැබීය.'
          },
          {
            active: 'He built this house in 1990.',
            passive: 'This house was built by him in 1990.',
            siActive: 'ඔහු 1990 දී මෙම නිවස ඉදි කළේය.',
            siPassive: 'ඔහු විසින් 1990 දී මෙම නිවස ඉදි කරනු ලැබීය.'
          }
        ]
      },
      {
        use: 'Past Habits',
        sinhalaUse: 'අතීත පුරුදු',
        examples: [
          {
            active: 'He played the piano every evening.',
            passive: 'The piano was played by him every evening.',
            siActive: 'ඔහු සෑම සවසකම පියානෝව වාදනය කළේය.',
            siPassive: 'ඔහු විසින් සෑම සවසකම පියානෝව වාදනය කරනු ලැබීය.'
          },
          {
            active: 'They used the old machine.',
            passive: 'The old machine was used by them.',
            siActive: 'ඔවුන් පැරණි යන්ත්‍රය භාවිතා කළහ.',
            siPassive: 'ඔවුන් විසින් පැරණි යන්ත්‍රය භාවිතා කරනු ලැබීය.'
          }
        ]
      }
    ]
  },
  {
    id: 'past-continuous',
    name: 'Past Continuous',
    sinhalaName: 'අඛණ්ඩ අතීත කාලය',
    hasPassive: true,
    activeFormula: 'Subject + was/were + V-ing',
    passiveFormula: 'Object + was/were + being + V3',
    description: 'Used for actions that were happening in the past.',
    sinhalaDescription: 'අතීතයේ සිදුවෙමින් පැවති ක්‍රියා සඳහා භාවිතා වේ.',
    color: 'bg-amber-500',
    glowColor: 'shadow-amber-500/20',
    uses: [
      {
        use: 'Actions in Progress in the Past',
        sinhalaUse: 'අතීතයේ සිදුවෙමින් පැවති ක්‍රියා',
        examples: [
          {
            active: 'He was painting the wall.',
            passive: 'The wall was being painted by him.',
            siActive: 'ඔහු බිත්තිය පින්තාරු කරමින් සිටියේය.',
            siPassive: 'ඔහු විසින් බිත්තිය පින්තාරු කරනු ලබමින් පැවතියේය.'
          },
          {
            active: 'They were fixing the car.',
            passive: 'The car was being fixed by them.',
            siActive: 'ඔවුන් මෝටර් රථය අලුත්වැඩියා කරමින් සිටියහ.',
            siPassive: 'ඔවුන් විසින් මෝටර් රථය අලුත්වැඩියා කරනු ලබමින් පැවතියේය.'
          }
        ]
      },
      {
        use: 'Interrupted Actions',
        sinhalaUse: 'බාධා වූ ක්‍රියා',
        examples: [
          {
            active: 'She was cooking dinner.',
            passive: 'Dinner was being cooked by her.',
            siActive: 'ඇය රාත්‍රී ආහාරය පිසමින් සිටියාය.',
            siPassive: 'ඇය විසින් රාත්‍රී ආහාරය පිසිනු ලබමින් පැවතියේය.'
          },
          {
            active: 'I was reading a book.',
            passive: 'A book was being read by me.',
            siActive: 'මම පොතක් කියවමින් සිටියෙමි.',
            siPassive: 'මා විසින් පොතක් කියවනු ලබමින් පැවතියේය.'
          }
        ]
      },
      {
        use: 'Parallel Actions',
        sinhalaUse: 'සමාන්තර ක්‍රියා',
        examples: [
          {
            active: 'They were preparing the stage.',
            passive: 'The stage was being prepared by them.',
            siActive: 'ඔවුන් වේදිකාව සකස් කරමින් සිටියහ.',
            siPassive: 'ඔවුන් විසින් වේදිකාව සකස් කරනු ලබමින් පැවතියේය.'
          },
          {
            active: 'He was recording the song.',
            passive: 'The song was being recorded by him.',
            siActive: 'ඔහු ගීතය පටිගත කරමින් සිටියේය.',
            siPassive: 'ඔහු විසින් ගීතය පටිගත කරනු ලබමින් පැවතියේය.'
          }
        ]
      }
    ]
  },
  {
    id: 'past-perfect',
    name: 'Past Perfect',
    sinhalaName: 'පූර්ණ අතීත කාලය',
    hasPassive: true,
    activeFormula: 'Subject + had + V3',
    passiveFormula: 'Object + had + been + V3',
    description: 'Used for an action completed before another past action.',
    sinhalaDescription: 'තවත් අතීත ක්‍රියාවකට පෙර අවසන් වූ ක්‍රියාවක් සඳහා භාවිතා වේ.',
    color: 'bg-pink-500',
    glowColor: 'shadow-pink-500/20',
    uses: [
      {
        use: 'Action before another past action',
        sinhalaUse: 'තවත් අතීත ක්‍රියාවකට පෙර සිදු වූ ක්‍රියාවක්',
        examples: [
          {
            active: 'She had cooked the meal.',
            passive: 'The meal had been cooked by her.',
            siActive: 'ඇය ආහාර පිස තිබුණාය.',
            siPassive: 'ඇය විසින් ආහාර පිසිනු ලැබ තිබුණි.'
          },
          {
            active: 'I had sent the email.',
            passive: 'The email had been sent by me.',
            siActive: 'මම විද්‍යුත් තැපෑල යවා තිබුණෙමි.',
            siPassive: 'මා විසින් විද්‍යුත් තැපෑල යවනු ලැබ තිබුණි.'
          }
        ]
      },
      {
        use: 'Cause of a past result',
        sinhalaUse: 'අතීත ප්‍රතිඵලයකට හේතුව',
        examples: [
          {
            active: 'They had closed the shop.',
            passive: 'The shop had been closed by them.',
            siActive: 'ඔවුන් කඩය වසා තිබුණහ.',
            siPassive: 'ඔවුන් විසින් කඩය වසා දමනු ලැබ තිබුණි.'
          },
          {
            active: 'He had stolen the money.',
            passive: 'The money had been stolen by him.',
            siActive: 'ඔහු මුදල් සොරාගෙන තිබුණි.',
            siPassive: 'ඔහු විසින් මුදල් සොරාගනු ලැබ තිබුණි.'
          }
        ]
      },
      {
        use: 'Reported Speech',
        sinhalaUse: 'වාර්තාගත කථනය',
        examples: [
          {
            active: 'He said they had finished the work.',
            passive: 'He said the work had been finished by them.',
            siActive: 'ඔවුන් වැඩ අවසන් කර ඇති බව ඔහු පැවසීය.',
            siPassive: 'වැඩ අවසන් කර ඇති බව ඔහු විසින් පවසනු ලැබීය.'
          },
          {
            active: 'She told me she had lost the key.',
            passive: 'She told me the key had been lost by her.',
            siActive: 'ඇයට යතුර නැති වී ඇති බව ඇය මට පැවසුවාය.',
            siPassive: 'යතුර නැති වී ඇති බව ඇය විසින් මට පවසනු ලැබීය.'
          }
        ]
      }
    ]
  },
  {
    id: 'past-perfect-continuous',
    name: 'Past Perfect Continuous',
    sinhalaName: 'පූර්ණ අඛණ්ඩ අතීත කාලය',
    hasPassive: false,
    activeFormula: 'Subject + had + been + V-ing',
    description: 'This tense does not have a standard passive voice form.',
    sinhalaDescription: 'මෙම කාලය සඳහා සම්මත කර්ම කාරක (Passive Voice) ස්වරූපයක් නොමැත.',
    color: 'bg-slate-400',
    glowColor: 'shadow-slate-400/10',
    uses: []
  },
  {
    id: 'future-simple',
    name: 'Future Simple',
    sinhalaName: 'සරල අනාගත කාලය',
    hasPassive: true,
    activeFormula: 'Subject + will + V1',
    passiveFormula: 'Object + will + be + V3',
    description: 'Used for future actions and predictions.',
    sinhalaDescription: 'අනාගත ක්‍රියා සහ අනාවැකි සඳහා භාවිතා වේ.',
    color: 'bg-cyan-500',
    glowColor: 'shadow-cyan-500/20',
    uses: [
      {
        use: 'Future Actions',
        sinhalaUse: 'අනාගත ක්‍රියා',
        examples: [
          {
            active: 'I will help you.',
            passive: 'You will be helped by me.',
            siActive: 'මම ඔබට උදව් කරන්නෙමි.',
            siPassive: 'මා විසින් ඔබට උදව් කරනු ලැබෙනු ඇත.'
          },
          {
            active: 'They will win the match.',
            passive: 'The match will be won by them.',
            siActive: 'ඔවුන් තරඟය දිනනු ඇත.',
            siPassive: 'ඔවුන් විසින් තරඟය දිනනු ලැබෙනු ඇත.'
          }
        ]
      },
      {
        use: 'Predictions',
        sinhalaUse: 'අනාවැකි',
        examples: [
          {
            active: 'He will deliver the package.',
            passive: 'The package will be delivered by him.',
            siActive: 'ඔහු පැකේජය ලබා දෙනු ඇත.',
            siPassive: 'ඔහු විසින් පැකේජය ලබා දෙනු ලැබෙනු ඇත.'
          },
          {
            active: 'We will celebrate the victory.',
            passive: 'The victory will be celebrated by us.',
            siActive: 'අපි ජයග්‍රහණය සමරන්නෙමු.',
            siPassive: 'අප විසින් ජයග්‍රහණය සමරනු ලැබෙනු ඇත.'
          }
        ]
      },
      {
        use: 'Promises and Offers',
        sinhalaUse: 'පොරොන්දු සහ ඉදිරිපත් කිරීම්',
        examples: [
          {
            active: 'I will send the report tomorrow.',
            passive: 'The report will be sent by me tomorrow.',
            siActive: 'මම හෙට වාර්තාව එවන්නෙමි.',
            siPassive: 'මා විසින් හෙට වාර්තාව එවනු ලැබෙනු ඇත.'
          },
          {
            active: 'She will bake a cake for you.',
            passive: 'A cake will be baked for you by her.',
            siActive: 'ඇය ඔබ වෙනුවෙන් කේක් එකක් සාදනු ඇත.',
            siPassive: 'ඇය විසින් ඔබ වෙනුවෙන් කේක් එකක් සාදනු ලැබෙනු ඇත.'
          }
        ]
      }
    ]
  },
  {
    id: 'future-continuous',
    name: 'Future Continuous',
    sinhalaName: 'අඛණ්ඩ අනාගත කාලය',
    hasPassive: false,
    activeFormula: 'Subject + will + be + V-ing',
    description: 'This tense does not have a standard passive voice form.',
    sinhalaDescription: 'මෙම කාලය සඳහා සම්මත කර්ම කාරක (Passive Voice) ස්වරූපයක් නොමැත.',
    color: 'bg-slate-400',
    glowColor: 'shadow-slate-400/10',
    uses: []
  },
  {
    id: 'future-perfect',
    name: 'Future Perfect',
    sinhalaName: 'පූර්ණ අනාගත කාලය',
    hasPassive: true,
    activeFormula: 'Subject + will + have + V3',
    passiveFormula: 'Object + will + have + been + V3',
    description: 'Used for actions that will be completed by a future time.',
    sinhalaDescription: 'අනාගත කාලයකට පෙර අවසන් වන ක්‍රියා සඳහා භාවිතා වේ.',
    color: 'bg-sky-500',
    glowColor: 'shadow-sky-500/20',
    uses: [
      {
        use: 'Action completed by a future time',
        sinhalaUse: 'අනාගත කාලයකට පෙර අවසන් වන ක්‍රියාවක්',
        examples: [
          {
            active: 'He will have finished the project.',
            passive: 'The project will have been finished by him.',
            siActive: 'ඔහු ව්‍යාපෘතිය අවසන් කර තිබෙනු ඇත.',
            siPassive: 'ඔහු විසින් ව්‍යාපෘතිය අවසන් කරනු ලැබ තිබෙනු ඇත.'
          },
          {
            active: 'We will have built the bridge.',
            passive: 'The bridge will have been built by us.',
            siActive: 'අපි පාලම සාදා තිබෙනු ඇත.',
            siPassive: 'අප විසින් පාලම සාදනු ලැබ තිබෙනු ඇත.'
          }
        ]
      },
      {
        use: 'Future Milestones',
        sinhalaUse: 'අනාගත සන්ධිස්ථාන',
        examples: [
          {
            active: 'She will have written the book.',
            passive: 'The book will have been written by her.',
            siActive: 'ඇය පොත ලියා තිබෙනු ඇත.',
            siPassive: 'ඇය විසින් පොත ලියනු ලැබ තිබෙනු ඇත.'
          },
          {
            active: 'I will have paid the bill.',
            passive: 'The bill will have been paid by me.',
            siActive: 'මම බිල්පත ගෙවා තිබෙනු ඇත.',
            siPassive: 'මා විසින් බිල්පත ගෙවනු ලැබ තිබෙනු ඇත.'
          }
        ]
      },
      {
        use: 'Duration until a future time',
        sinhalaUse: 'අනාගත කාලයක් දක්වා කාලසීමාව',
        examples: [
          {
            active: 'They will have built the house by next year.',
            passive: 'The house will have been built by them by next year.',
            siActive: 'ඔවුන් ලබන වසර වන විට නිවස සාදා තිබෙනු ඇත.',
            siPassive: 'ඔවුන් විසින් ලබන වසර වන විට නිවස සාදනු ලැබ තිබෙනු ඇත.'
          },
          {
            active: 'He will have completed the course by June.',
            passive: 'The course will have been completed by him by June.',
            siActive: 'ඔහු ජුනි මාසය වන විට පාඨමාලාව අවසන් කර තිබෙනු ඇත.',
            siPassive: 'ඔහු විසින් ජුනි මාසය වන විට පාඨමාලාව අවසන් කරනු ලැබ තිබෙනු ඇත.'
          }
        ]
      }
    ]
  },
  {
    id: 'future-perfect-continuous',
    name: 'Future Perfect Continuous',
    sinhalaName: 'පූර්ණ අඛණ්ඩ අනාගත කාලය',
    hasPassive: false,
    activeFormula: 'Subject + will + have + been + V-ing',
    description: 'This tense does not have a standard passive voice form.',
    sinhalaDescription: 'මෙම කාලය සඳහා සම්මත කර්ම කාරක (Passive Voice) ස්වරූපයක් නොමැත.',
    color: 'bg-slate-400',
    glowColor: 'shadow-slate-400/10',
    uses: []
  }
];

export const ActivePassive = () => {
  const [selectedTense, setSelectedTense] = React.useState<VoiceTense | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      {/* Page Cover Image */}
      <div className="h-[400px] w-full relative overflow-hidden">
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1600&h=500"
          alt="Active & Passive Voice"
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
              Voice <span className="text-emerald-400">Shift</span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 -mt-24 px-8 max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-16 shadow-2xl shadow-slate-200 border border-white mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="inline-block p-6 rounded-[2rem] bg-white shadow-2xl mb-8 relative group"
          >
            <div className="absolute inset-0 bg-blue-500/10 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all" />
            <Repeat className="text-blue-600 relative z-10" size={48} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            Active & <span className="text-blue-600 italic serif">Passive</span> Voice
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed"
          >
            Master the art of sentence transformation with our comprehensive guide to English voices.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {voiceData.map((tense, i) => (
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
                {!tense.hasPassive && (
                  <div className="flex items-center gap-1 text-rose-500 bg-rose-50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    <AlertCircle size={12} /> No Passive
                  </div>
                )}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="p-3 rounded-xl bg-apple-bg border border-apple-bg/50">
                  <span className="text-[9px] font-bold text-apple-gray uppercase tracking-widest block mb-1">Active</span>
                  <code className="text-apple-dark font-mono text-xs font-bold">{tense.activeFormula}</code>
                </div>
                {tense.hasPassive && (
                  <div className="p-3 rounded-xl bg-apple-blue/5 border border-apple-blue/10">
                    <span className="text-[9px] font-bold text-apple-blue uppercase tracking-widest block mb-1">Passive</span>
                    <code className="text-apple-blue font-mono text-xs font-bold">{tense.passiveFormula}</code>
                  </div>
                )}
              </div>
              
              <p className="text-apple-gray text-sm line-clamp-2 mb-6">
                {tense.description}
              </p>
              
              <div className="flex items-center gap-2 text-apple-blue font-bold text-sm group-hover:gap-4 transition-all">
                View Details <ArrowRight size={16} />
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
              className="bg-white rounded-[40px] w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col"
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
                        Tense Guide
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

                {!selectedTense.hasPassive ? (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-16 rounded-[3rem] bg-rose-50/50 border-2 border-dashed border-rose-200 text-center relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />
                    <AlertCircle className="text-rose-500 mx-auto mb-8 animate-bounce" size={80} />
                    <h3 className="text-4xl font-bold text-rose-900 mb-6">No Passive Voice Form</h3>
                    <p className="text-2xl text-rose-700 leading-relaxed mb-8 max-w-2xl mx-auto">
                      {selectedTense.description}
                    </p>
                    <p className="text-xl text-rose-600 italic font-medium">
                      {selectedTense.sinhalaDescription}
                    </p>
                  </motion.div>
                ) : (
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
                          <span className="text-xs font-black uppercase tracking-[0.2em]">Usage Guide</span>
                        </div>
                        <p className="text-2xl text-apple-dark leading-relaxed mb-6 relative z-10 font-medium">
                          {selectedTense.description}
                        </p>
                        <p className="text-xl text-apple-gray italic relative z-10">
                          {selectedTense.sinhalaDescription}
                        </p>
                      </motion.div>

                      <div className="space-y-6">
                        <motion.div 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="p-10 rounded-[2.5rem] bg-white border-2 border-apple-bg shadow-xl hover:shadow-2xl transition-shadow group"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-black text-apple-gray uppercase tracking-[0.3em]">Active Formula</span>
                            <div className="w-2 h-2 rounded-full bg-apple-dark/20" />
                          </div>
                          <code className="text-4xl font-mono font-bold text-apple-dark block group-hover:text-apple-blue transition-colors">
                            {selectedTense.activeFormula}
                          </code>
                        </motion.div>
                        
                        <motion.div 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className={cn("p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group", selectedTense.color)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                          <div className="flex items-center justify-between mb-6 relative z-10">
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Passive Formula</span>
                            <div className="w-2 h-2 rounded-full bg-white/40 animate-ping" />
                          </div>
                          <code className="text-4xl font-mono font-bold block relative z-10 group-hover:scale-105 transition-transform origin-left">
                            {selectedTense.passiveFormula}
                          </code>
                        </motion.div>
                      </div>
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
                        <h3 className="text-3xl font-bold tracking-tight">Transformation Examples</h3>
                      </motion.div>
                      
                      <div className="space-y-16">
                        {selectedTense.uses.map((use, i) => (
                          <motion.div 
                            key={i}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="space-y-8"
                          >
                            <div className="flex items-center gap-4 border-l-4 border-apple-blue pl-6">
                              <div>
                                <h4 className="text-2xl font-bold text-apple-dark tracking-tight">{use.use}</h4>
                                <p className="text-apple-blue font-bold text-sm tracking-wide">{use.sinhalaUse}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8">
                              {use.examples.map((ex, j) => (
                                <motion.div 
                                  key={j}
                                  whileHover={{ scale: 1.02 }}
                                  className="relative p-10 rounded-[3rem] bg-apple-bg/30 border border-apple-bg hover:bg-white hover:shadow-2xl hover:border-apple-blue/20 transition-all duration-500 group"
                                >
                                  <div className="flex flex-col gap-10">
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-4">
                                        <span className="px-3 py-1 rounded-xl bg-apple-dark text-white text-[10px] font-black uppercase tracking-widest">Active</span>
                                        <p className="text-2xl font-bold text-apple-dark group-hover:text-apple-blue transition-colors">{ex.active}</p>
                                      </div>
                                      <p className="text-apple-gray text-lg italic pl-14">{ex.siActive}</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-8">
                                      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-apple-bg to-transparent" />
                                      <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
                                        <ArrowRight className="text-apple-blue" size={24} />
                                      </div>
                                      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-apple-bg to-transparent" />
                                    </div>

                                    <div className="space-y-4">
                                      <div className="flex items-center gap-4">
                                        <span className="px-3 py-1 rounded-xl bg-apple-blue text-white text-[10px] font-black uppercase tracking-widest">Passive</span>
                                        <p className="text-2xl font-bold text-apple-blue">{ex.passive}</p>
                                      </div>
                                      <p className="text-apple-gray text-lg italic pl-14">{ex.siPassive}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 bg-apple-bg/50 border-t border-apple-bg shrink-0 flex justify-center">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTense(null)}
                  className="btn-primary py-5 px-16 text-xl font-bold shadow-2xl shadow-apple-blue/30 rounded-[2rem]"
                >
                  Complete Lesson
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
