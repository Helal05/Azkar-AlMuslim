export type PrayerAzkarSection = {
  id: string;
  title?: string;
  arabic_text: string;
  translation?: string;
  source?: string;
  count?: number;
  benefit?: string;
};

export type PrayerAzkarItem = {
  id: string;
  title: string;
  arabic_text?: string;
  translation?: string;
  source?: string;
  note?: string;
  sections?: PrayerAzkarSection[];
  count?: number; // Overall count for the item, if applicable
  titleFontFamily?: string; // Custom font for title
};

export const prayerAzkarData: PrayerAzkarItem[] = [
  {
    id: "dua-going-to-mosque",
    title: "دعاء الذهاب إلى المسجد",
    arabic_text: "اللهم اجعل في قلبي نوراً، وفي لساني نوراً، واجعل في سمعي نوراً، واجعل في بصري نوراً، واجعل من خلفي نوراً، ومن أمامي نوراً، واجعل من فوقي نوراً، ومن تحتي نوراً، اللهم أعطني نوراً.",
    source: "رواه البخاري ومسلم",
    titleFontFamily: "Amiri", // Added custom font for title
  },
  {
    id: "dua-entering-mosque",
    title: "دعاء الدخول إلى المسجد",
    arabic_text: "عند الدخول يقدم قدمه اليمنى ثم يقول:\nأعوذ بالله العظيم وبوجهه الكريم وسلطانه القديم من الشيطان الرجيم.\nبسم الله والصلاة والسلام على رسول الله اللهم افتح لي أبواب رحمتك.",
    translation: "Upon entering, one should step in with their right foot and then say:\nI seek refuge in Allah, the Mighty, and in His Noble Face, and in His Eternal Dominion, from Satan, the accursed.\nIn the name of Allah, and prayers and peace be upon the Messenger of Allah. O Allah, open for me the gates of Your mercy.",
    source: "رواه أبوداود"
  },
  {
    id: "azkar-adhan",
    title: "أذكار الأذان",
    sections: [
      {
        id: "adhan-response",
        arabic_text: "يقول مثل ما يقول المؤذن إلا في (حي على الصلاة، وحي على الفلاح) فيقول: (لا حول ولا قوة إلا بالله).",
        translation: "One should repeat what the Mu'adhdhin says, except for (Hayya 'ala-s-Salah, Hayya 'ala-l-Falah), for which one should say: (There is no might nor power except with Allah)."
      },
      {
        id: "dua-after-adhan-call",
        arabic_text: "ثم يقول بعد الفراغ من الأذان: اللهم رب هذه الدعوة التامة، والصلاة القائمة آت محمداً الوسيلة والفضيلة، وابعثه مقاماً محموداً الذي وعدته.",
        translation: "Then, after the Adhan, one should say: O Allah, Lord of this perfect call and established prayer, grant Muhammad the intercession and favor, and raise him to the praiseworthy station that You have promised him.",
        source: "رواه البخاري"
      },
      {
        id: "dua-hearing-muadhin",
        arabic_text: "قال رسول الله صلى الله عليه وسلم: من قال حين يسمع المؤذن أشهد أن لا إله إلا الله وحده لا شريك له وأن محمداً عبده ورسوله رضيت بالله رباً، وبمحمد رسولاً وبالإسلام ديناً غفر له ذنبه.",
        translation: "The Messenger of Allah (ﷺ) said: Whoever says when he hears the Mu'adhdhin: 'I bear witness that there is no god but Allah alone, with no partner, and that Muhammad is His slave and Messenger. I am pleased with Allah as a Lord, with Muhammad as a Messenger, and with Islam as a religion,' his sins will be forgiven.",
        source: "رواه مسلم و أبوداود والنسائي و الترمذي"
      },
      {
        id: "salawat-on-prophet",
        arabic_text: "اللهم صل وسلم على نبينا محمد.",
        translation: "O Allah, send prayers and peace upon our Prophet Muhammad."
      }
    ]
  },
  {
    id: "dua-istiftah",
    title: "أدعية الاستفتاح الصلاة",
    note: "ملاحظة: في دعاء الاستفتاح: لا يجمع بينها بل يختار واحد و الأفضل أن ينوع بين ذلك في كل صلاة.",
    sections: [
      {
        id: "istiftah-1",
        arabic_text: "الله أكبر كبيراً، والحمد لله كثيراً، وسبحان الله بكرة وأصيلاً. أعوذ بالله من الشيطان: من نفخه، ونفثه، وهمزه.",
        translation: "Allah is the Greatest, much praise be to Allah, and Glory be to Allah morning and evening. I seek refuge in Allah from Satan: from his arrogance, his poetry, and his madness."
      },
      {
        id: "istiftah-2",
        arabic_text: "وجهت وجهي للذي فطر السموات والأرض حنيفاً وما أنا من المشركين، إن صلاتي، ونسكي، ومحياي، ومماتي لله رب العالمين، لا شريك له وبذلك أمرت وأنا من المسلمين، اللهم أنت الملك لا إله إلا أنت، أنت ربي وأنا عبدك، ظلمت نفسي واعترفت بذنبي فاغفر لي ذنوبي جميعاً إنه لا يغفر الذنوب إلا أنت. واهدني لأحسن الأخلاق لا يهدي لأحسنها إلا أنت، واصرف عني سيئها لا يصرف عني سيئها إلا أنت، لبيك وسعديك، والخير كله بيديك، والشر ليس إليك، أنا بك وإليك، تباركت وتعاليت، أستغفرك وأتوب إليك.",
        translation: "I have turned my face towards Him Who created the heavens and the earth, as a monotheist, and I am not of the polytheists. Indeed, my prayer, my rites of sacrifice, my living, and my dying are for Allah, Lord of the worlds, no partner has He. With this I have been commanded, and I am of the Muslims. O Allah, You are the King, there is no god but You. You are my Lord, and I am Your slave. I have wronged myself, and I acknowledge my sin, so forgive me all my sins, for none forgives sins but You. And guide me to the best of character, none guides to the best of it but You, and turn away from me its evil, none turns away from me its evil but You. I am here at Your service, and all good is in Your hands, and evil is not attributed to You. I am through You and to You. Blessed are You and Exalted. I seek Your forgiveness and repent to You."
      },
      {
        id: "istiftah-3",
        arabic_text: "اللهم باعد بيني وبين خطاياي كما باعدت بين المشرق والمغرب، اللهم نقني من خطاياي كما ينقى الثوب الأبيض من الدنس، اللهم اغسلني من خطاياي، بالثلج والماء والبرد.",
        translation: "O Allah, distance me from my sins as You have distanced the East from the West. O Allah, purify me from my sins as a white garment is purified from dirt. O Allah, wash me from my sins with snow, water, and hail."
      },
      {
        id: "istiftah-4",
        arabic_text: "سبحانك اللهم وبحمدك، وتبارك اسمك، وتعالى جدك، ولا إله غيرك.",
        translation: "Glory is to You, O Allah, and praise. Blessed is Your Name and Exalted is Your Majesty. There is no god but You."
      },
      {
        id: "istiftah-5",
        arabic_text: "الحمد لله حمداً كثيراً طيباً مباركاً فيه.",
        translation: "Praise be to Allah, much good and blessed praise."
      }
    ]
  },
  {
    id: "dua-ruku",
    title: "أدعية الركوع",
    sections: [
      {
        id: "ruku-1",
        arabic_text: "سبحان ربي العظيم. (ثلاث مرات).",
        translation: "Glory to my Lord, the Great. (Three times)."
      },
      {
        id: "ruku-2",
        arabic_text: "سبحانك اللهم ربنا وبحمدك، اللهم اغفر لي.",
        translation: "Glory is to You, O Allah, our Lord, and praise. O Allah, forgive me."
      },
      {
        id: "ruku-3",
        arabic_text: "سبوح، قدوس، رب الملائكة والروح.",
        translation: "All-Glorious, All-Holy, Lord of the angels and the Spirit."
      },
      {
        id: "ruku-4",
        arabic_text: "اللهم لك ركعت، وبك آمنت، ولك أسلمت، خشع لك سمعي وبصري، ومخي وعظمي وعصبي.",
        translation: "O Allah, to You I have bowed, in You I have believed, and to You I have submitted. My hearing, my sight, my brain, my bones, and my nerves are humbled before You."
      },
      {
        id: "ruku-5",
        arabic_text: "سبحان ربي العظيم وبحمدة. (ثلاث مرات).",
        translation: "Glory to my Lord, the Great, and praise be to Him. (Three times)."
      }
    ]
  },
  {
    id: "dua-raising-from-ruku",
    title: "أدعية الرفع من الركوع",
    sections: [
      {
        id: "raising-ruku-1",
        arabic_text: "سمع الله لمن حمده. ربنا ولك الحمد، حمداً كثيراً طيباً مباركاً فيه.",
        translation: "Allah hears whoever praises Him. Our Lord, to You is praise, much good and blessed praise."
      },
      {
        id: "raising-ruku-2",
        arabic_text: "اللهم ربنا لك الحمد ملء السموات وملء الأرض، وما بينهما، وملء ما شئت من شيء بعد، أهل الثناء والمجد، أحق ما قال العبد، وكلنا لك عبد، اللهم لا مانع لما أعطيت، ولا معطي لما منعت، ولا ينفع ذا الجد منك الجد.",
        translation: "O Allah, our Lord, to You is praise, filling the heavens, filling the earth, and what is between them, and filling whatever You wish of anything after. Possessor of praise and glory, most worthy of what a slave has said, and we are all Your slaves. O Allah, none can withhold what You have given, and none can give what You have withheld, and the might of the mighty does not avail against You."
      }
    ]
  },
  {
    id: "dua-sujood",
    title: "أدعية السجود",
    sections: [
      {
        id: "sujood-1",
        arabic_text: "سبحان ربي الأعلى. (ثلاث مرات).",
        translation: "Glory to my Lord, the Most High. (Three times)."
      },
      {
        id: "sujood-2",
        arabic_text: "سبحان ربي الأعلي وبحمدة.",
        translation: "Glory to my Lord, the Most High, and praise be to Him."
      },
      {
        id: "sujood-3",
        arabic_text: "سبوح، قدوس، رب الملائكة والروح.",
        translation: "All-Glorious, All-Holy, Lord of the angels and the Spirit."
      },
      {
        id: "sujood-4",
        arabic_text: "اللهم لك سجدت وبك آمنت، ولك أسلمت، سجد وجهي للذي خلقه، وصوره، وشق سمعه وبصره، تبارك الله أحسن الخالقين.",
        translation: "O Allah, to You I have prostrated, in You I have believed, and to You I have submitted. My face has prostrated to Him Who created it, and formed it, and opened its hearing and sight. Blessed is Allah, the best of creators."
      },
      {
        id: "sujood-5",
        arabic_text: "اللهم اغفر لي ذنبي كله دقه وجله، وأوله وآخره وعلانيته وسره.",
        translation: "O Allah, forgive me all my sins, the small and the great, the first and the last, the public and the secret."
      },
      {
        id: "sujood-6",
        arabic_text: "اللهم إني أعوذ برضاك من سخطك، وبمعافاتك من عقوبتك، وأعوذ بك منك، لا أحصي ثناء عليك أنت كما أثنيت على نفسك.",
        translation: "O Allah, I seek refuge in Your pleasure from Your anger, and in Your forgiveness from Your punishment. I seek refuge in You from You. I cannot count Your praises. You are as You have praised Yourself."
      }
    ]
  },
  {
    id: "dua-between-sajdatain",
    title: "أدعية الجلسة بين السجدتين",
    sections: [
      {
        id: "jalsa-1",
        arabic_text: "رب اغفر لي، رب اغفر لي.",
        translation: "Lord, forgive me. Lord, forgive me."
      },
      {
        id: "jalsa-2",
        arabic_text: "اللهم اغفر لي، وارحمني، واهدني، واجبرني، وعافني، وارزقني، وارفعني.",
        translation: "O Allah, forgive me, have mercy on me, guide me, support me, protect me, provide for me, and elevate me."
      }
    ]
  },
  {
    id: "azkar-tashahhud",
    title: "أذكار التشهد",
    sections: [
      {
        id: "tashahhud-first",
        title: "التشهد الأول",
        arabic_text: "التحيات لله والصلوات والطيبات السلام عليك أيها النبي ورحمة الله وبركاته السلام علينا وعلى عباد الله الصالحين، أشهد أن لا إله إلا الله وأشهد أن محمداً عبده ورسوله.",
        translation: "All greetings, prayers, and good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous slaves of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His slave and Messenger."
      },
      {
        id: "salat-on-prophet-after-tashahhud",
        title: "الصلاة على النبي صلى الله عليه وسلم بعد التشهد",
        arabic_text: "التحيات لله والصلوات والطيبات السلام عليك أيها النبي ورحمة الله وبركاته السلام علينا وعلى عباد الله الصالحين، أشهد أن لا إله إلا الله وأشهد أن محمداً عبده ورسوله. اللهم صل على محمد وعلى آل محمد كما صليت على إبراهيم وعلى آل إبراهيم إنك حميد مجيد، اللهم بارك على محمد وعلى آل محمد كما باركت على إبراهيم وعلى آل إبراهيم إنك حميد مجيد.",
        translation: "All greetings, prayers, and good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous slaves of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His slave and Messenger. O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim; indeed, You are Praiseworthy and Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim; indeed, You are Praiseworthy and Glorious."
      }
    ]
  },
  {
    id: "dua-after-last-tashahhud-before-salam",
    title: "الدعاء بعد التشهد الأخير و قبل السلام",
    sections: [
      {
        id: "dua-before-salam-1",
        arabic_text: "اللهم إني أعوذ بك من عذاب القبر، ومن عذاب جهنم، ومن فتنة المحيا والممات، ومن شر فتنة المسيح الدجال.",
        translation: "O Allah, I seek refuge in You from the torment of the grave, and from the torment of Hellfire, and from the trials of life and death, and from the evil of the trial of the Antichrist."
      },
      {
        id: "dua-before-salam-2",
        arabic_text: "اللهم إني أعوذ بك من عذاب القبر. وأعوذ بك من فتنة المسيح الدجال. وأعوذ بك من فتنة المحيا والممات. اللهم إني أعوذ بك من المأثم والمغرم.",
        translation: "O Allah, I seek refuge in You from the torment of the grave. And I seek refuge in You from the trial of the Antichrist. And I seek refuge in You from the trials of life and death. O Allah, I seek refuge in You from sin and debt."
      },
      {
        id: "dua-before-salam-3",
        arabic_text: "اللهم إني ظلمت نفسي ظلماً كثيراً، ولا يغفر الذنوب إلا أنت، فاغفر لي مغفرة من عندك وارحمني، إنك أنت الغفور الرحيم.",
        translation: "O Allah, I have wronged myself greatly, and none forgives sins but You, so grant me forgiveness from Yourself and have mercy on me. Indeed, You are the Forgiving, the Merciful."
      },
      {
        id: "dua-before-salam-4",
        arabic_text: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.",
        translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire."
      },
      {
        id: "dua-before-salam-5",
        arabic_text: "اللهم إني أسألك الجنة وأعوذ بك من النار.",
        translation: "O Allah, I ask You for Paradise and seek refuge in You from the Fire."
      },
      {
        id: "dua-before-salam-6",
        arabic_text: "اللهم إني أسألك يا الله بأنك الواحد الأحد الصمد الذي لم يلد ولم يولد، ولم يكن له كفواً أحد، أن تغفر لي ذنوبي إنك أنت الغفور الرحيم.",
        translation: "O Allah, I ask You, O Allah, as You are the One, the Unique, the Eternal Refuge, Who neither begets nor is born, nor is there to Him any equivalent, that You forgive me my sins. Indeed, You are the Forgiving, the Merciful."
      },
      {
        id: "dua-before-salam-7",
        arabic_text: "اللهم حاسبني حساباً يسيراً.",
        translation: "O Allah, grant me an easy reckoning."
      },
      {
        id: "dua-before-salam-8",
        arabic_text: "اللهم إني أسألك بأني أشهد أنك أنت الله لا إله إلا أنت الأحد الصمد الذي لم يلد ولم يولد ولم يكن له كفواً أحد.",
        translation: "O Allah, I ask You by my testimony that You are Allah, there is no god but You, the One, the Eternal Refuge, Who neither begets nor is born, nor is there to Him any equivalent."
      },
      {
        id: "dua-before-salam-9",
        arabic_text: "اللهم إني أسألك بأن لك الحمد لا إله إلا أنت وحدك لا شريك لك، المنان، يا بديع السموات والأرض يا ذا الجلال والإكرام، يا حي يا قيوم إني أسألك الجنة وأعوذ بك من النار.",
        translation: "O Allah, I ask You, as all praise is due to You, there is no god but You alone, You have no partner, the Bestower of favors, O Originator of the heavens and the earth, O Possessor of majesty and honor, O Living, O Sustainer, I ask You for Paradise and seek refuge in You from the Fire."
      }
    ]
  },
  {
    id: "dua-qunoot",
    title: "دعاء القنوت",
    translation: "Supplication of Qunoot",
    sections: [
      {
        id: "qunoot-intro",
        title: ".دعاء القنوت يكون في الركعة الأخيرة من صلاة الوتر بعد الركوع ، وإذا جعله قبل الركوع فلا بأس ، إلا أنه بعد الركوع أفضل ، ويرفع يديه إلى صدره ولا يرفعها كثيرا",
        arabic_text: "",
        translation: "Dua Qunoot is recited in the last Rak'ah of the Witr prayer after Ruku' (bowing). If one recites it before Ruku', there is no harm, but after Ruku' is preferred. One should raise their hands to their chest and not raise them too high."
      },
      {
        id: "qunoot-1",
        arabic_text: "اللهم اهدنا فيمن هديت، وعافنا فيمن عافيت، وتولنا فيمن توليت, وبارك لنا فيما أعطيت، وقنا شر ما قضيت، انك تقضي ولا يقضى عليك.",
        translation: "O Allah, guide us among those You have guided, grant us well-being among those You have granted well-being, take us into Your charge among those You have taken into Your charge, bless us in what You have given, and protect us from the evil of what You have decreed. Indeed, You decree and none can decree over You."
      },
      {
        id: "qunoot-2",
        arabic_text: "انه لا يذل من واليت، ولا يعز من عاديت، تباركت ربنا وتعاليت, لك الحمد على ماقضيت، ولك الشكر على ما أعطيت. نستغفرك اللهم من جميع الذنوب والخطايا ونتوب اليك.",
        translation: "Indeed, he whom You take as an ally is not humbled, and he whom You take as an enemy is not honored. Blessed are You, our Lord, and Exalted. To You is praise for what You have decreed, and to You is thanks for what You have given. We seek Your forgiveness, O Allah, from all sins and misdeeds, and we repent to You."
      },
      {
        id: "qunoot-3",
        arabic_text: "اللهم أقسم لنا من خشيتك ما تحول به بيننا وبين معصيتك, ومن طاعتك ما تبلغنا به جنتك، ومن اليقين ما تهون به علينا مصائب الدنيا.",
        translation: "O Allah, apportion to us such fear of You as should serve as a barrier between us and acts of disobedience; and such obedience to You as shall lead us to Your Paradise; and such certainty as shall make the calamities of this world easy for us to bear."
      },
      {
        id: "qunoot-4",
        arabic_text: "متعنا اللهم باسماعنا وأبصارنا وقواتنا ما أبقيتنا، واجعله الوارث منا، واجعل ثأرنا على من ظلمنا، وانصرنا على من عادانا، ولا تجعل مصيبتنا في ديننا.",
        translation: "O Allah, let us enjoy our hearing, our sight, and our strength as long as You keep us alive, and make it inherit from us (i.e., let it remain with us until death). And make our vengeance upon those who have wronged us, and give us victory over those who are hostile to us. And do not make our calamity in our religion."
      },
      {
        id: "qunoot-5",
        arabic_text: "ولا تجعل الدنيا أكبر همنا، ولا مبلغ علمنا، ولا الى النار مصيرنا.",
        translation: "And do not make this world our greatest concern, nor the limit of our knowledge, nor our destination Hellfire."
      },
      {
        id: "qunoot-6",
        arabic_text: "واجعل الجنة هي دارنا، ولا تسلط علينا بذنوبنا من لايخافك فينا ولا يرحمنا.",
        translation: "And make Paradise our abode, and do not give authority over us, due to our sins, to those who do not fear You concerning us nor show us mercy."
      },
      {
        id: "qunoot-7",
        arabic_text: "اللهم أصلح لنا ديننا الذي هو عصمة أمرنا، وأصلح لنا دنيانا التي فيها معاشنا، وأصلح لنا آخرتنا التي اليها معادنا، واجعل الحياة زيادة لنا في كل خير، واجعل الموت راحة لنا من كل شر.",
        translation: "O Allah, set right for us our religion which is the safeguard of our affairs, and set right for us our worldly affairs wherein is our living, and set right for us our Hereafter unto which is our return. And make life for us an increase in all that is good, and make death for us a rest from all evil."
      },
      {
        id: "qunoot-8",
        arabic_text: "اللهم انا نسألك فعل الخيرات، وترك المنكرات، وحب المساكين، وأن تغفر لنا وترحمنا وتتوب علينا، واذا أردت بقوم فتنة فتوفنا غير مفتونين.",
        translation: "O Allah, we ask You to enable us to do good deeds, to abandon evil deeds, and to love the poor. And (we ask You) to forgive us, have mercy on us, and accept our repentance. And if You intend a trial for a people, then take us to Yourself without being tried."
      },
      {
        id: "qunoot-9",
        arabic_text: "ونسألك حبك, وحب من يحبك، وحب كل عمل يقربنا الى حبك, يا رب العالمين. اللهم اغفر لجميع موتى المسلمين، الذين شهدوا لك بالوحدانية، ولنبيك بالرسالة، وماتوا على ذلك.",
        translation: "And we ask You for Your love, and the love of those who love You, and the love of every deed that brings us closer to Your love, O Lord of the worlds. O Allah, forgive all the deceased Muslims who testified to Your Oneness, and to Your Prophet's Messengership, and died upon that."
      },
      {
        id: "qunoot-10",
        arabic_text: "اللهم اغفر لهم وارحمهم وعافهم وأعفو عنهم، واكرم نزلهم، ووسع مدخلهم، واغسلهم بالماء والثلج والبرد. ونقهم كما ينقى الثوب الأبيض من الدنس وارحمنا اللهم برحمتك اذا صرنا الى ما صاروا اليه تحت الجنادل والتراب وحدنا.",
        translation: "O Allah, forgive them, have mercy on them, grant them well-being, and pardon them. Make honorable their reception, and widen their entrance, and wash them with water, snow, and hail. And purify them as a white garment is purified from dirt. And have mercy on us, O Allah, by Your mercy, when we become as they have become, beneath the tombstones and the earth, alone."
      },
      {
        id: "qunoot-11",
        arabic_text: "اللهم فرج هم المهمومين ونفس كرب المكروبين و أقضي الدين عن المدينين و أشفي مرضانا ومرضى المسلمين برحمتك يا أرحم الراحمين.",
        translation: "O Allah, relieve the anxiety of the anxious, alleviate the distress of the distressed, pay off the debts of the debtors, and heal our sick and the sick of the Muslims, by Your mercy, O Most Merciful of those who show mercy."
      },
      {
        id: "qunoot-12",
        arabic_text: "اللهم أغفر لنا و أرحمنا و أعتق رقابنا من النار.",
        translation: "O Allah, forgive us, have mercy on us, and free our necks from the Fire."
      },
      {
        id: "qunoot-13",
        arabic_text: "اللهم تقبل منا إنك أنت السميع العليم وتب عليناً إنك أنت التواب الرحيم. وصلى اللّٰه على سيدنا محمد وعلى آله وصحبه وسلم.",
        translation: "O Allah, accept from us, indeed You are the All-Hearing, the All-Knowing. And turn to us in repentance, indeed You are the Accepter of repentance, the Most Merciful. And may Allah send prayers and peace upon our master Muhammad and upon his family and companions."
      }
    ]
  },
  {
    id: "dua-sujood-tilawa",
    title: "دعاء سجود التلاوة",
    translation: "Supplication for Prostration of Recitation",
    sections: [
      {
        id: "sujood-tilawa-1",
        arabic_text: "سجد وجهي للذي خلقه، وشق سمعه وبصره، بحوله وقوته، فتبارك اللّٰه أحسن الخالقين.",
        translation: "My face has prostrated to Him Who created it, and brought forth its hearing and seeing by His might and power. So, blessed is Allah, the best of creators."
      },
      {
        id: "sujood-tilawa-2",
        arabic_text: "اللهم اكتب لي بها عندك أجرا، وضع عني بها وزرا، واجعلها لي عندك ذخرا، وتقبلها مني كما تقبلتها من عبدك داود.",
        translation: "O Allah, record for me a reward for it with You, remove from me a sin by it, make it a treasure for me with You, and accept it from me as You accepted it from Your servant Dawud (David)."
      }
    ]
  },
  {
    id: "azkar-after-salam",
    title: "الاذكار بعد السلام من الصلاة", // Diacritics removed
    sections: [
      { // Image 12/1
        id: "after-salam-1",
        arabic_text: "استغفر الله، استغفر الله، استغفر الله. اللهم انت السلام، ومنك السلام، تباركت يا ذا الجلال والاكرام.",
        translation: "I seek the forgiveness of Allah (three times). O Allah, You are Peace and from You is peace. Blessed are You, O Possessor of majesty and honor.",
        count: 1,
        source: "رواه مسلم",
        benefit: "يقال بعد التسليم من الصلاة"
      },
      { // Image 12/2
        id: "after-salam-2",
        arabic_text: "لا اله الا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير، اللهم لا مانع لما اعطيت، ولا معطي لما منعت، ولا ينفع ذا الجد منك الجد.",
        translation: "There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is over all things competent. O Allah, none can withhold what You have given, and none can give what You have withheld, and the might of the mighty does not avail against You.",
        count: 1,
        source: "متفق عليه",
        benefit: "يقال بعد الصلاة المفروضة"
      },
      { // Image 12/3
        id: "after-salam-3",
        arabic_text: "لا اله الا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير. لا حول ولا قوة الا بالله، لا اله الا الله، ولا نعبد الا اياه، له النعمة وله الفضل وله الثناء الحسن، لا اله الا الله مخلصين له الدين ولو كره الكافرون.",
        translation: "There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is over all things competent. There is no might nor power except with Allah. There is no god but Allah, and we worship none but Him. His is the blessing, His is the grace, and His is the excellent praise. There is no god but Allah, sincere in religion to Him, even if the disbelievers dislike it.",
        count: 1
      },
      {
        id: "after-salam-tasbeeh",
        arabic_text: "سبحان الله",
        translation: "Glory be to Allah",
        count: 33,
        source: "رواه مسلم",
        benefit: "يقال بعد الصلاة المفروضة 33 مرة"
      },
      {
        id: "after-salam-tahmeed",
        arabic_text: "و الحمد لله",
        translation: "And Praise be to Allah",
        count: 33,
        source: "رواه مسلم",
        benefit: "يقال بعد الصلاة المفروضة 33 مرة"
      },
      {
        id: "after-salam-takbeer",
        arabic_text: "و الله اكبر",
        translation: "And Allah is the Greatest",
        count: 33,
        source: "رواه مسلم",
        benefit: "يقال بعد الصلاة المفروضة 33 مرة"
      },
      { // Image 12/5 - Completion of 100
        id: "after-salam-4-tahleel",
        arabic_text: "لا اله الا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.",
        translation: "To complete one hundred (after SubhanAllah, Alhamdulillah, Allahu Akbar 33 times each): There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is over all things competent.",
        count: 1,
        source: "رواه مسلم",
        benefit: "تمام المائة بعد التسبيح والتحميد والتكبير، وهذه تقال مرة واحدة"
      },
      { // Image 12/6 - 10 times after Subh/Maghrib
        id: "after-salam-7", // Keeping original ID from file that matches this content
        arabic_text: "لا اله الا الله وحده لا شريك له، له الملك وله الحمد يحيي ويميت وهو على كل شيء قدير. (عشر مرات بعد صلاتي الصبح والمغرب)",
        translation: "There is no god but Allah alone, with no partner. His is the dominion and His is the praise. He gives life and causes death, and He is over all things competent (ten times after Maghrib and Subh prayers).",
        count: 10
      },
      { // Image 12/7 - After Subh
        id: "after-salam-8", // Keeping original ID from file that matches this content
        arabic_text: "اللهم اني اسالك علما نافعا، ورزقا طيبا، وعملا متقبلا. (بعد صلاة الصبح)",
        translation: "O Allah, I ask You for beneficial knowledge, goodly provision, and acceptable deeds (after Salam from Fajr prayer).",
        count: 1
      },
      { // Image 12/8 - Ayat al-Kursi
        id: "after-salam-5", // Keeping original ID from file that matches this content
        arabic_text: "الله لا اله الا هو الحي القيوم لا تاخذه سنة ولا نوم له ما في السموات وما في الارض من ذا الذي يشفع عنده الا باذنه يعلم ما بين ايديهم وما خلفهم ولا يحيطون بشيء من علمه الا بما شاء وسع كرسيه السموات والارض ولا يؤوده حفظهما وهو العلي العظيم.\n(من قرا اية الكرسي في دبر كل صلاة مكتوبة لم يمنعه من دخول الجنة الا ان يموت).",
        translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great. (Surah Al-Baqarah 2:255)\n(The Messenger of Allah (ﷺ) said: Whoever recites Ayat al-Kursi at the end of every obligatory prayer, nothing prevents him from entering Paradise except death).",
        count: 1
      },
      { // Image 12/9 - Surah Al-Ikhlas
        id: "after-salam-ikhlas",
        arabic_text: "بسم الله الرحمن الرحيم\nقل هو الله احد الله الصمد لم يلد ولم يولد ولم يكن له كفوا احد.\n(سورة الاخلاص / ١ - ٤)\n(مرة واحدة بعد كل صلاة وثلاث مرات بعد صلاتي الفجر والمغرب)",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.\nSay, 'He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent.'\n(Surah Al-Ikhlas / 1 - 4)\n(Recite once after every prayer, and three times after Fajr and Maghrib prayers).",
        count: 1
      },
      { // Image 12/10 - Surah Al-Falaq
        id: "after-salam-falaq",
        arabic_text: "بسم الله الرحمن الرحيم\nقل اعوذ برب الفلق من شر ما خلق ومن شر غاسق اذا وقب ومن شر النفاثات في العقد ومن شر حاسد اذا حسد.\n(سورة الفلق / ١ - ٥)\n(مرة واحدة بعد كل صلاة وثلاث مرات بعد صلاتي الفجر والمغرب)",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.\nSay, 'I seek refuge in the Lord of daybreak, From the evil of that which He created, And from the evil of darkness when it settles, And from the evil of the blowers in knots, And from the evil of an envier when he envies.'\n(Surah Al-Falaq / 1 - 5)\n(Recite once after every prayer, and three times after Fajr and Maghrib prayers).",
        count: 1
      },
      { // Image 12/11 - Surah An-Nas
        id: "after-salam-nas",
        arabic_text: "بسم الله الرحمن الرحيم\nقل اعوذ برب الناس ملك الناس اله الناس من شر الوسواس الخناس الذي يوسوس في صدور الناس من الجنة والناس.\n(سورة الناس / ١ - ٦)\n(مرة واحدة بعد كل صلاة وثلاث مرات بعد صلاتي الفجر والمغرب)",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.\nSay, 'I seek refuge in the Lord of mankind, The Sovereign of mankind, The God of mankind, From the evil of the retreating whisperer, Who whispers [evil] into the breasts of mankind, From among the jinn and mankind.'\n(Surah An-Nas / 1 - 6)\n(Recite once after every prayer, and three times after Fajr and Maghrib prayers).",
        count: 1
      }
    ]
  },
  {
    id: "general-duas-prayer",
    title: "دعاء صلاة الأستخارة",
    sections: [
      {
        id: "dua-for-guidance-steadfastness",
        arabic_text: " قال جابر بن عبد اللَّه رضي اللَّه عنهما : كان رسُول اللَّه صل الله علية وسلم يعلَمنا الاستِخارة في الأُمور كلِّها كمَا يعَلَمنا السُّورة من الْقُرآن،ِ يَقول : إِذَا هَم أَحدكُم بِالْأَمْر فلْيركَع ركعتين من غير الفريضة ثمَ ليَقل : اللَهم إِنِي أستخيرك علمكَ ، وأستقدرك بِقدرتك ، وأَسألكَ من فضلك العظيم ، فإِنَكَ تقدر ولَا أَقدر، وتعلَم، ولا أعلَم، وأنتَ علام الْغيوب ، ويُسَمَي حاجتَه خَيْرٌ لي في دينِي وَمعَاشي وعَاقِبَة أمري أَو قال : عاجله وَاجله - فاقدُرُه لي وَيَسَّرهُ لي ثُم بارك لي فيهِ ، وإِن كُنْتَ تعلَمُ أَنَّ هذا الْأمْر شر لي في دِيني ومعاشي وعاقبة أَمري - أَو قال : عاجلِه واجِله فاصرفه عنِّي واصْرِفني عنه واقدر لي الخير حيث كان ثمَم أرضني بهِاللَّهُمَّ إِن كُنت تعلم أَن هذا الْأمر",
        translation: "O Allah, set right for me my religion which is the safeguard of my affairs. And set right for me my worldly affairs wherein is my living. And set right for me my Hereafter on which depends my after-life. And make life for me (a source) of abundance for every good and make death for me a rest from every evil."
      },
      {
        id: "dua-seeking-goodness",
        arabic_text: "وما ندم من استخار الخالق ، وشاور المخلوقين الْمؤْمنِين وتثبَتَ في أَمره،ِ فقد قال سبحانه : وشاورهم في الْأمر فإِذا عَزمتَ فتوكَل على اللَه \n (رواه البخاري)",
        translation: "O Allah, we ask You to enable us to do good deeds, to abandon evil deeds, and to love the poor. And (we ask You) to forgive us, have mercy on us, and accept our repentance. And if You intend a trial for a people, then take us to Yourself without being tried."
      },
    ]
  },
  {
    id: "general-duas-prayer",
    title: "أدعية عامة متعلقة بالصلاة",
    sections: [
      {
        id: "dua-for-guidance-steadfastness",
        arabic_text: "اللهم أصلح لي ديني الذي هو عصمة أمري، وأصلح لي دنياي التي فيها معاشي، وأصلح لي آخرتي التي فيها معادي، واجعل الحياة زيادة لي في كل خير، واجعل الموت راحة لي من كل شر.",
        translation: "O Allah, set right for me my religion which is the safeguard of my affairs. And set right for me my worldly affairs wherein is my living. And set right for me my Hereafter on which depends my after-life. And make life for me (a source) of abundance for every good and make death for me a rest from every evil."
      },
      {
        id: "dua-seeking-goodness",
        arabic_text: "اللهم إنا نسألك فعل الخيرات، وترك المنكرات، وحب المساكين، وأن تغفر لنا وترحمنا وتتوب علينا، وإذا أردت بقوم فتنة فتوفنا غير مفتونين.",
        translation: "O Allah, we ask You to enable us to do good deeds, to abandon evil deeds, and to love the poor. And (we ask You) to forgive us, have mercy on us, and accept our repentance. And if You intend a trial for a people, then take us to Yourself without being tried."
      },
      {
        id: "dua-love-of-allah",
        arabic_text: "ونسألك حبك، وحب من يحبك، وحب كل عمل يقربنا إلى حبك. يا رب العالمين. اللهم اغفر لجميع موتى المسلمين، الذين شهدوا لك بالوحدانية، ولنبيك بالرسالة، وماتوا على ذلك.",
        translation: "And we ask You for Your love, and the love of those who love You, and the love of every deed that brings us closer to Your love. O Lord of the worlds. O Allah, forgive all the deceased Muslims who testified to Your Oneness, and to Your Prophet's Messengership, and died upon that."
      },
      {
        id: "dua-for-deceased",
        arabic_text: "اللهم اغفر لهم وارحمهم وعافهم وأعف عنهم، وأكرم نزلهم، ووسع مدخلهم، واغسلهم بالماء والثلج والبرد. ونقهم كما ينقى الثوب الأبيض من الدنس وارحمنا اللهم برحمتك اذا صرنا الى ما صاروا اليه تحت الجنادل والتراب وحدنا.",
        translation: "O Allah, forgive them, have mercy on them, grant them well-being, and pardon them. Make honorable their reception, and widen their entrance, and wash them with water, snow, and hail. And purify them as a white garment is purified from dirt. And have mercy on us, O Allah, by Your mercy, when we become as they have become, beneath the tombstones and the earth, alone."
      }
    ]
  },
  {
    id: "dua-out-of-mosque",
    title: "دعاء الخروج من المسجد",
    translation: "Supplication for Exiting the Mosque",
    sections: [
      {
        id: "dua-out-mosque-text",
        title: ":عند الخروج يقدم قدمة اليسري ثم يقول",
        arabic_text: " بسم الله والصلاة والسلام علي رسول الله اللهم أني أسالك من فضلك اللهم أعصمني من الشيطان الرجيم",
        translation: "In the name of Allah, and prayers and peace be upon the Messenger of Allah. O Allah, I ask You for Your bounty. O Allah, protect me from Satan, the accursed."
      },
    ]
  },
];
