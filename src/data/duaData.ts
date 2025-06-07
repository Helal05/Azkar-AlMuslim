export interface Dua {
  id: string;
  uniqueId: string; // Added uniqueId
  title: string;
  arabic: string;
  translation: string;
  source: string;
  reference?: string;
  virtue?: string;
  times?: number;
}

export interface DuaCategory {
  id: string;
  name: string;
  backgroundColor: string;
  duas: Dua[];
}

export const duaCategories: DuaCategory[] = [
  {
    id: "morning",
    name: "أذكار الصباح",
    backgroundColor: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    duas: [
      {
        id: "morning-1",
        uniqueId: "morning-1", // Added uniqueId
        title: "دعاء الصباح 1",
        arabic: "اصبحنا واصبح الملك لله",
        translation: "We have entered a new day and with it all dominion belongs to Allah.",
        source: "صحيح البخاري",
        reference: "رواه البخاري",
        virtue: "من قالها حين يصبح أو حين يمسي كتب له أجر من قالها من أمته"
      },
      {
        id: "morning-2",
        uniqueId: "morning-2", // Added uniqueId
        title: "دعاء الصباح 2",
        arabic: "اللهم بك اصبحنا وبك امسينا",
        translation: "O Allah, by Your grace we have entered a new day, and by Your grace we enter the evening.",
        source: "سنن الترمذي",
        reference: "رواه الترمذي",
        times: 1
      }
    ]
  },
  {
    id: "evening",
    name: "اذكار المساء",
    backgroundColor: "bg-gradient-to-br from-indigo-500 to-indigo-700",
    duas: [
      {
        id: "evening-1",
        uniqueId: "evening-1", // Added uniqueId
        title: "دعاء المساء 1",
        arabic: "امسينا وامسى الملك لله",
        translation: "We have entered the evening and with it all dominion belongs to Allah.",
        source: "صحيح البخاري",
        reference: "رواه البخاري",
        times: 1
      },
      {
        id: "evening-2",
        uniqueId: "evening-2", // Added uniqueId
        title: "دعاء المساء 2",
        arabic: "اللهم ما امسى بي من نعمة",
        translation: "O Allah, whatever blessing I have this evening.",
        source: "سنن أبي داود",
        reference: "رواه أبو داود",
        times: 3
      }
    ]
  },
  {
    id: "beforeSleep",
    name: "اذكار قبل النوم",
    backgroundColor: "bg-gradient-to-br from-purple-500 to-purple-700",
    duas: [
      {
        id: "sleep-1",
        uniqueId: "beforeSleep-sleep-1", // Added uniqueId
        title: "دعاء قبل النوم 1",
        arabic: "باسمك ربي وضعت جنبي",
        translation: "In Your name, my Lord, I lie down.",
        source: "صحيح البخاري",
        reference: "رواه البخاري"
      },
      {
        id: "sleep-2",
        uniqueId: "beforeSleep-sleep-2", // Added uniqueId
        title: "دعاء قبل النوم 2",
        arabic: "اللهم اني اسلمت نفسي اليك",
        translation: "O Allah, I have submitted myself to You.",
        source: "صحيح البخاري",
        reference: "رواه البخاري"
      }
    ]
  },
  {
    id: "afterPrayer",
    name: "أذكار بعد الصلاة",
    backgroundColor: "bg-gradient-to-br from-green-500 to-green-700",
    duas: [
      {
        id: "prayer-1",
        uniqueId: "afterPrayer-prayer-1", // Added uniqueId
        title: "دعاء بعد الصلاة 1",
        arabic: "أَسْتَغْفِرُ اللَّهَ",
        translation: "I seek forgiveness from Allah.",
        source: "صحيح مسلم",
        reference: "رواه مسلم",
        times: 3
      },
      {
        id: "prayer-2",
        uniqueId: "afterPrayer-prayer-2", // Added uniqueId
        title: "دعاء بعد الصلاة 2",
        arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ",
        translation: "O Allah, You are Peace.",
        source: "صحيح مسلم",
        reference: "رواه مسلم"
      }
    ]
  },
  {
    id: "general",
    name: "أدعية عامة",
    backgroundColor: "bg-gradient-to-br from-blue-500 to-blue-700",
    duas: [
      {
        id: "general-1",
        uniqueId: "general-general-1", // Added uniqueId
        title: "دعاء عام 1",
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً ﴿٢٠١﴾",
        translation: "Our Lord, give us good in this world.",
        source: "سورة البقرة",
        reference: "سورة البقرة: 201"
      },
      {
        id: "general-2",
        uniqueId: "general-general-2", // Added uniqueId
        title: "دعاء عام 2",
        arabic: "رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا ﴿٢٨٦﴾",
        translation: "Our Lord, do not take us to task if we forget.",
        source: "سورة البقرة",
        reference: "سورة البقرة: 286"
      }
    ]
  },
  {
    id: "forForgiveness",
    name: "أدعية طلب المغفرة",
    backgroundColor: "bg-gradient-to-br from-gray-500 to-gray-700",
    duas: [
      {
        id: "forgive-1",
        uniqueId: "forForgiveness-forgive-1", // Added uniqueId
        title: "دعاء طلب المغفرة 1",
        arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ ﴿٢٨﴾",
        translation: "My Lord, forgive me and my parents.",
        source: "سورة نوح",
        reference: "سورة نوح: 28"
      },
      {
        id: "forgive-2",
        uniqueId: "forForgiveness-forgive-2", // Added uniqueId
        title: "دعاء طلب المغفرة 2",
        arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ",
        translation: "O Allah, You are forgiving and love forgiveness.",
        source: "سنن الترمذي",
        reference: "رواه الترمذي"
      }
    ]
  },
  {
    id: "night-duas",
    name: "دعاء من تعار من الليل",
    backgroundColor: "bg-gradient-to-br from-blue-800 to-blue-900",
    duas: [
      {
        id: "night-dua-1",
        uniqueId: "night-duas-night-dua-1",
        title: "الدعاء عند الاستيقاظ من النوم ليلاً",
        arabic: "لا اله الا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير، سبحان الله، والحمد لله، ولا اله الا الله، والله اكبر، ولا حول ولا قوة الا بالله",
        translation: "There is no god but Allah, alone, without partner. To Him belongs sovereignty and praise, and He is over all things competent. Glory be to Allah, and praise be to Allah, and there is no god but Allah, and Allah is the greatest, and there is no might nor power except with Allah.",
        source: "صحيح البخاري",
        reference: "رواه البخاري"
      },
      {
        id: "night-dua-2",
        uniqueId: "night-duas-night-dua-2",
        title: "دعاء آخر عند الاستيقاظ من النوم ليلاً",
        arabic: "الحمد لله الذي احيانا بعد ما اماتنا واليه النشور",
        translation: "All praise is due to Allah, who has given us life after causing us to die, and to Him is the resurrection.",
        source: "صحيح البخاري",
        reference: "رواه البخاري"
      },
      {
        id: "night-dua-3",
        uniqueId: "night-duas-night-dua-3",
        title: "دعاء التهجد",
        arabic: "اللهم لك الحمد انت قيم السموات والارض ومن فيهن، ولك الحمد لك ملك السموات والارض ومن فيهن، ولك الحمد انت نور السموات والارض، ولك الحمد انت ملك السموات والارض، ولك الحمد انت الحق، ووعدك الحق، ولقاؤك حق، وقولك حق، والجنة حق، والنار حق، والنبيون حق، ومحمد حق، والساعة حق، اللهم لك اسلمت، وبك امنت، وعليك توكلت، واليك انبت، وبك خاصمت، واليك حاكمت، فاغفر لي ما قدمت وما اخرت، وما اسررت وما اعلنت، انت المقدم وانت المؤخر، لا اله الا انت.",
        translation: "O Allah, to You be praise, You are the Sustainer of the heavens and the earth and whoever is in them. To You be praise, Yours is the dominion of the heavens and the earth and whoever is in them. To You be praise, You are the Light of the heavens and the earth. To You be praise, You are the King of the heavens and the earth. To You be praise, You are the Truth, and Your promise is true, and meeting You is true, and Your word is true, and Paradise is true, and the Fire is true, and the Prophets are true, and Muhammad is true, and the Hour is true. O Allah, to You I have submitted, and in You I have believed, and upon You I have relied, and to You I have turned, and by You I have disputed, and to You I have referred for judgment. So forgive me what I have sent before and what I have held back, and what I have concealed and what I have made apparent. You are the Advancer and You are the Delayer. There is no god but You.",
        source: "صحيح البخاري",
        reference: "رواه البخاري"
      },
      {
        id: "night-dua-4",
        uniqueId: "night-duas-night-dua-4",
        title: "دعاء عند التقلب ليلاً",
        arabic: "لا اله الا الله الواحد القهار، رب السموات والارض وما بينهما العزيز الغفار",
        translation: "There is no god but Allah, the One, the Subduer, Lord of the heavens and the earth and all that is between them, the All-Mighty, the All-Forgiving.",
        source: "صحيح الجامع الصغير وزيادته",
        reference: "صحيح الجامع الصغير وزيادته: 4834"
      },
      {
        id: "night-dua-5",
        uniqueId: "night-duas-night-dua-5",
        title: "دعاء القنوت في الوتر",
        arabic: "اللهم اهدني فيمن هديت، وعافني فيمن عافيت، وتولني فيمن توليت، وبارك لي فيما اعطيت، وقني شر ما قضيت، فانك تقضي ولا يقضى عليك، وانه لا يذل من واليت، ولا يعز من عاديت، تباركت ربنا وتعاليت",
        translation: "O Allah, guide me among those You have guided, and grant me well-being among those You have granted well-being, and protect me among those You have protected, and bless for me what You have given, and save me from the evil of what You have decreed. For verily You decree and none can decree against You, and none whom You have befriended shall be humiliated, and none whom You have opposed shall be honored. Blessed are You, our Lord, and Exalted.",
        source: "سنن أبي داود والترمذي والنسائي وابن ماجه والدارمي وأحمد",
        reference: "صحيح ابن خزيمة: 1096"
      },
      {
        id: "night-dua-6",
        uniqueId: "night-duas-night-dua-6",
        title: "دعاء بعد الاستيقاظ من النوم",
        arabic: "الحمد لله الذي عافاني في جسدي، ورد علي روحي، واذن لي بذكره",
        translation: "All praise is due to Allah who gave me health in my body, and returned my soul to me, and allowed me to remember Him.",
        source: "سنن الترمذي",
        reference: "رواه الترمذي"
      },
      {
        id: "night-dua-8",
        uniqueId: "night-duas-night-dua-8",
        title: "دعاء عند الفزع من النوم",
        arabic: "اعوذ بكلمات الله التامات من غضبه وعقابه وشر عباده ومن همزات الشياطين وان يحضرون",
        translation: "I seek refuge in the perfect words of Allah from His wrath and His punishment, and from the evil of His servants, and from the whisperings of the devils and their presence.",
        source: "سنن أبي داود والترمذي",
        reference: "رواه أبو داود والترمذي"
      },
      {
        id: "night-dua-9",
        uniqueId: "night-duas-night-dua-9",
        title: "دعاء عند الارق",
        arabic: "اللهم غارت النجوم وهدات العيون وانت حي قيوم لا تاخذك سنة ولا نوم يا حي يا قيوم اهدئ ليلي وانم عيني",
        translation: "O Allah, the stars have set, and the eyes have become tranquil, and You are the Ever Living, the Sustainer. Neither slumber nor sleep overtakes You. O Ever Living, O Sustainer, make my night peaceful and my eyes sleep.",
        source: "ابن السني",
        reference: "رواه ابن السني"
      }
    ]
  }
];

// Add natural background images
export const naturalBackgrounds = [
   "/backgrounds/bg1.jpg.jpeg",
  "/backgrounds/bg2.jpg.jpeg",
  "/backgrounds/bg3.jpg.jpeg",
  "/backgrounds/bg4.jpg.jpeg",
  "/backgrounds/bg5.jpg.jpeg",
  "/backgrounds/bg6.jpg.jpeg"
];

// Add more Quranic verses
export const quranVerses = [
  {
    verse: "إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ",
    surah: "الحجرات",
    ayah: 13
  },
  {
    verse: "وَاللَّهُ يَعْلَمُ وَأَنْتُمْ لَا تَعْلَمُونَ",
    surah: "البقرة",
    ayah: 216
  },
  {
    verse: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ",
    surah: "هود",
    ayah: 88
  },
  {
    verse: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    surah: "البقرة",
    ayah: 153
  },
  {
    verse: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ",
    surah: "ق",
    ayah: 16
  },
  {
    verse: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ",
    surah: "الإخلاص",
    ayah: "1-2"
  },
  {
    verse: "وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ لَّا إِلَٰهَ إِلَّا هُوَ الرَّحْمَٰنُ الرَّحِيمُ",
    surah: "البقرة",
    ayah: 163
  },
  {
    verse: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    surah: "الشرح",
    ayah: 6
  },
  {
    verse: "وَإِنْ تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا",
    surah: "إبراهيم",
    ayah: 34
  },
  {
    verse: "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    surah: "الطلاق",
    ayah: 3
  }
];

// Adding the missing duha data
export const duha = {
  time: "وقتها ما بين ارتفاع الشمس قيد رمح إلى وقوف الشمس الضحى كله، وقتها ما بين ارتفاع الشمس قيد رمح إلى وقوف الشمس قبيل الظهر، فإذا صلاها في أول الوقت أو في أثنائه فقد أصاب السنة، لكن أفضلها عند اشتداد الضحى، إذا اشتد الحر ورمضت الفصال كما قال في الحديث الصحيح يقول صلاة الأوابين حين ترمض الفصال، يعني: حين يشتد حر الرمضاء على أولاد الإبل, فصلاتها في الضحى في ارتفاع الضحى أفضل وإن صلاها بعد ارتفاع الشمس فقد حصلت السنة",
  rakaat: "أقلها ركعتان، وأكثرها ثمان ركعات، والأفضل أربع ركعات",
  virtue: "صلاة الضحى من أعظم النوافل وأجلها، وفيها أجر عظيم لمن داوم عليها"
};

// Adding the missing rawathib data
export const rawathib = [
  {
    prayer: "الفجر",
    before: 2,
    after: 0,
    description: "ركعتا الفجر من أهم السنن الرواتب، وكان النبي ﷺ لا يدعهما سفراً ولا حضراً"
  },
  {
    prayer: "الظهر",
    before: 4,
    after: 2,
    description: "أربع ركعات قبل الظهر وركعتان بعدها من السنن المؤكدة"
  },
  {
    prayer: "العصر",
    before: 4,
    after: 0,
    description: "أربع ركعات قبل العصر سنة غير مؤكدة"
  },
  {
    prayer: "المغرب",
    before: 0,
    after: 2,
    description: "ركعتان بعد المغرب من السنن المؤكدة"
  },
  {
    prayer: "العشاء",
    before: 0,
    after: 2,
    description: "ركعتان بعد العشاء من السنن المؤكدة"
  }
];
