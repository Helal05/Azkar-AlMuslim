import { AlertSetting, AlertTime } from "../types";

const morningTimesArabic: AlertTime[] = [
  {
    id: "morning-30min",
    name: "نصف ساعة بعد الفجر",
    timeText: "عند الساعة 05:10 صباحًا",
    enabled: false // Changed default to false
  },
  {
    id: "morning-1hour",
    name: "ساعة بعد الفجر",
    timeText: "عند الساعة 05:40 صباحًا"
  },
  {
    id: "morning-2hours",
    name: "ساعتان بعد الفجر",
    timeText: "عند الساعة 06:40 صباحًا"
  },
  {
    id: "morning-3hours",
    name: "ثلاث ساعات بعد الفجر",
    timeText: "عند الساعة 07:40 صباحًا"
  }
];

const duhaTimesArabic: AlertTime[] = [
  {
    id: "duha-20min",
    name: "20 دقيقة بعد الشروق (بداية وقت الضحى)",
    timeText: "بعد شروق الشمس بـ 20 دقيقة",
    enabled: false
  },
  {
    id: "duha-30min",
    name: "30 دقيقة بعد الشروق",
    timeText: "بعد شروق الشمس بـ 30 دقيقة",
    enabled: true // Default option
  },
  {
    id: "duha-1hour",
    name: "ساعة بعد الشروق",
    timeText: "بعد شروق الشمس بساعة"
  },
  {
    id: "duha-quarter-day",
    name: "ربع النهار (أفضل وقت للضحى)",
    timeText: "في منتصف المسافة بين الشروق والظهر",
    enabled: false
  },
  {
    id: "duha-2hours-before",
    name: "ساعتان قبل الظهر",
    timeText: "قبل الظهر بساعتين"
  },
  {
    id: "duha-1hour-before",
    name: "ساعة قبل الظهر",
    timeText: "قبل الظهر بساعة"
  },
  {
    id: "duha-30min-before",
    name: "30 دقيقة قبل الظهر (آخر وقت الضحى)",
    timeText: "قبل الظهر بـ 30 دقيقة"
  }
];

export const alertSettings: AlertSetting[] = [
  {
    id: "fajr",
    nameArabic: "صلاة الفجر",
    enabled: true, // تفعيل افتراضياً
    description: "تنبيه صلاة الفجر",
    selectedSound: 'adhan-fajr', // صوت الأذان الافتراضي
    hasIqama: true,
    iqamaEnabled: false, // تعطيل الإقامة افتراضياً
    iqamaOffsetMinutes: 15, // 15 دقيقة بعد الأذان
    iqamaSound: 'iqama', // صوت الإقامة
    preAlertEnabled: false, // تعطيل التنبيه المسبق افتراضياً
    preAlertMinutes: 10, // تنبيه قبل الفجر بـ 10 دقائق
    preAlertSound: 'pre-fajr' // صوت التنبيه المسبق
  },
  {
    id: "sunrise",
    nameArabic: "صلاة الشروق",
    enabled: true, // تفعيل افتراضياً
    description: "تنبيه صلاة الشروق",
    details: "صلاة الشروق (صلاة الإشراق) هي صلاة نافلة تؤدى بعد شروق الشمس بمقدار رمح (حوالي 15-20 دقيقة). وهي من السنن المؤكدة، وقد قال النبي صلى الله عليه وسلم: «من صلى الفجر في جماعة ثم قعد يذكر الله حتى تطلع الشمس ثم صلى ركعتين كانت له كأجر حجة وعمرة تامة تامة تامة».",
    selectedSound: "takbir-1", // تعيين الصوت الافتراضي
    preAlertEnabled: false, // تعطيل التنبيه المسبق افتراضياً
    preAlertMinutes: 5, // تنبيه قبل الشروق بـ 5 دقائق
    preAlertSound: 'hayya-ala-salah' // صوت التنبيه المسبق
  },
  {
    id: "dhuhr",
    nameArabic: "صلاة الظهر",
    enabled: true, // تفعيل افتراضياً
    description: "تنبيه صلاة الظهر",
    selectedSound: 'qatami', // صوت الأذان الافتراضي
    hasIqama: true,
    iqamaEnabled: false, // تعطيل الإقامة افتراضياً
    iqamaOffsetMinutes: 10, // 10 دقائق بعد الأذان
    iqamaSound: 'iqama', // صوت الإقامة
    preAlertEnabled: false, // تعطيل التنبيه المسبق افتراضياً
    preAlertMinutes: 10, // تنبيه قبل الظهر بـ 10 دقائق
    preAlertSound: 'hayya-ala-salah' // صوت التنبيه المسبق
  },
  {
    id: "asr",
    nameArabic: "صلاة العصر",
    enabled: true, // تفعيل افتراضياً
    description: "تنبيه صلاة العصر",
    selectedSound: 'masjid-nabawi', // صوت الأذان الافتراضي
    hasIqama: true,
    iqamaEnabled: false, // تعطيل الإقامة افتراضياً
    iqamaOffsetMinutes: 10, // 10 دقائق بعد الأذان
    iqamaSound: 'iqama', // صوت الإقامة
    preAlertEnabled: false, // تعطيل التنبيه المسبق افتراضياً
    preAlertMinutes: 10, // تنبيه قبل العصر بـ 10 دقائق
    preAlertSound: 'hayya-ala-salah' // صوت التنبيه المسبق
  },
  {
    id: "maghrib",
    nameArabic: "صلاة المغرب",
    enabled: true, // تفعيل افتراضياً
    description: "تنبيه صلاة المغرب",
    selectedSound: 'saqaf', // صوت الأذان الافتراضي
    hasIqama: true,
    iqamaEnabled: false, // تعطيل الإقامة افتراضياً
    iqamaOffsetMinutes: 5, // 5 دقائق بعد الأذان (المغرب أقصر)
    iqamaSound: 'iqama', // صوت الإقامة
    preAlertEnabled: false, // تعطيل التنبيه المسبق افتراضياً
    preAlertMinutes: 5, // تنبيه قبل المغرب بـ 5 دقائق
    preAlertSound: 'hayya-ala-salah' // صوت التنبيه المسبق
  },
  {
    id: "isha",
    nameArabic: "صلاة العشاء",
    enabled: true, // تفعيل افتراضياً
    description: "تنبيه صلاة العشاء",
    selectedSound: 'makkah1', // صوت الأذان الافتراضي
    hasIqama: true,
    iqamaEnabled: false, // تعطيل الإقامة افتراضياً
    iqamaOffsetMinutes: 15, // 15 دقيقة بعد الأذان
    iqamaSound: 'iqama', // صوت الإقامة
    preAlertEnabled: false, // تعطيل التنبيه المسبق افتراضياً
    preAlertMinutes: 10, // تنبيه قبل العشاء بـ 10 دقائق
    preAlertSound: 'hayya-ala-salah' // صوت التنبيه المسبق
  },
  {
    id: "last-third",
    nameArabic: "الثلث الأخير من الليل",
    enabled: true, // تفعيل افتراضياً
    description: "تنبيه الثلث الأخير من الليل",
    details: "اتفق العلماء على أن كل الليل وقت للتهجد وأن أفضله الثلث الأخير لأنه وقت الغفلة ونزول الرحمة واستجابة الدعاء، ومن فضل الثلث الأخير من الليل أن الله سبحانه وتعالى أمر نبيه محمدا - صلى الله عليه وسلم - بقيام وصلاة الليل فقال: (ومن الليل فتهجد به نافلة لك عسى أن يبعثك ربك مقاما محمودا) وقال تعالى: (إن المتقين في جنات وعيون آخذين ما آتاهم ربهم إنهم كانوا قبل ذلك محسنين كانوا قليلا من الليل ما يهجعون وبالأسحار هم يستغفرون).\n\nوقت السحر يبدأ في آخر الليل والثلث الأخير من الليل، وهو أن تقسم. الليل من غروب الشمس إلى طلوع الفجر أثلاثاً، فتحذف الثلثين الأولين منه، وما بقي فهو الثلث، فإذا قدرنا أن ما بين غروب الشمس إلى طلوع الفجر تسع ساعات، فإذا مضى ست ساعات من الليل دخل الثلث الآخر من الليل.",
    selectedSound: "prophet-salah" // تعيين الصوت الافتراضي
  },
  {
    id: "morning-athkar",
    nameArabic: "أذكار الصباح",
    enabled: true, // تفعيل افتراضياً
    description: "تنبيه أذكار الصباح",
    alertTimes: morningTimesArabic,
    selectedSound: "morning-dhikr" // تعيين الصوت الافتراضي
  },
  {
    id: "evening-athkar",
    nameArabic: "أذكار المساء",
    enabled: true, // تفعيل افتراضياً
    description: "تنبيه أذكار المساء",
    selectedSound: "evening-dhikr", // تعيين الصوت الافتراضي
    alertTimes: [
      {
        id: "evening-30min-after-asr",
        name: "نصف ساعة بعد العصر",
        timeText: "عند الساعة 05:00 مساءً"
      },
      {
        id: "evening-1hour-after-asr",
        name: "ساعة بعد العصر",
        timeText: "عند الساعة 05:30 مساءً",
        enabled: true
      },
      {
        id: "evening-2hours-after-asr",
        name: "ساعتان بعد العصر",
        timeText: "عند الساعة 06:30 مساءً"
      },
      {
        id: "evening-3hours-after-asr",
        name: "ثلاث ساعات بعد العصر",
        timeText: "عند الساعة 07:30 مساءً"
      },
      {
        id: "evening-15min-before-maghrib",
        name: "ربع ساعة قبل المغرب",
        timeText: "عند الساعة 07:18 مساءً"
      },
      {
        id: "evening-30min-before-maghrib",
        name: "نصف ساعة قبل المغرب",
        timeText: "عند الساعة 07:03 مساءً"
      },
      {
        id: "evening-1hour-before-maghrib",
        name: "ساعة قبل المغرب",
        timeText: "عند الساعة 06:33 مساءً"
      }
    ]
  },
  {
    id: "duha",
    nameArabic: "صلاة الضحى",
    enabled: true, // تفعيل افتراضياً
    description: "تنبيه صلاة الضحى",
    details: "صلاة الضحى هي صلاة نافلة تؤدى بعد شروق الشمس بمقدار رمح (حوالي 20 دقيقة) وحتى قبل الزوال (قبل صلاة الظهر). وأفضل وقتها عندما ترتفع الشمس وتشتد حرارتها، أي في منتصف المسافة بين الشروق والظهر. وهي من سنن النبي صلى الله عليه وسلم، وأقلها ركعتان وأكثرها ثمان ركعات.",
    alertTimes: duhaTimesArabic,
    selectedSound: "takbir-1" // تعيين الصوت الافتراضي
  },
  {
    id: "friday-sunnahs",
    nameArabic: "سنن يوم الجمعة",
    enabled: false,
    description: "تنبيه سنن يوم الجمعة"
  },
  {
    id: "white-days",
    nameArabic: "أيام البيض",
    enabled: false,
    description: "تنبيه أيام البيض"
  }
];
