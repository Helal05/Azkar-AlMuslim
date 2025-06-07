type TranslationKey =
  | 'appName'
  | 'prayerTimes'
  | 'fajr'
  | 'sunrise'
  | 'dhuhr'
  | 'asr'
  | 'maghrib'
  | 'isha'
  | 'midnight'
  | 'lastThird'
  | 'settings'
  | 'location'
  | 'notifications'
  | 'darkMode'
  | 'fontSize'
  | 'language'
  | 'share'
  | 'currentCity'
  | 'changeLocation'
  | 'detectAutomaticLocation' // Added key
  | 'manualLocationInput' // Added key
  | 'calculationMethod'
  | 'currentMethod'
  | 'changeMethod'
  | 'prayerCalculationMethod' // Added key
  | 'selectCalculationMethod' // Added key
  | 'tasabeeh' // Added key for Tasabeeh page
  | 'calculationMethodDescription'
  | 'methodDetails'
  | 'fajrAngle'
  | 'ishaAngle'
  | 'asrCalculation'
  | 'asrCalculationDescription'
  | 'selectMadhab'
  | 'shafiMadhab'
  | 'hanafiMadhab'
  | 'shafiAsrDescription'
  | 'hanafiAsrDescription'
  | 'highLatitudes'
  | 'highLatitudesDescription'
  | 'selectHighLatitudeRule'
  | 'middleOfTheNight'
  | 'seventhOfTheNight'
  | 'twilightAngle'
  | 'manualAdjustments'
  | 'manualAdjustmentsDescription'
  | 'minutes'
  | 'resetAdjustments'
  | 'saveAdjustments'
  | 'adjustmentsSaved'
  | 'adjustmentsReset'
  | 'prayerTimesRecalculated'
  | 'calculationMethodUpdated'
  | 'madhabUpdated'
  | 'asrTimeRecalculated'
  | 'highLatitudeRuleUpdated'
  | 'advancedPrayerSettings'
  | 'enableNotifications'
  | 'reminderForAzkar'
  | 'soundEnabled'
  | 'playSoundOnTap'
  | 'vibrationEnabled'
  | 'enableVibration'
  | 'darkModeLabel'
  | 'changeAppearance'
  | 'morningAzkar'
  | 'eveningAzkar'
  | 'afterPrayerAzkar'
  | 'sleepAzkar'
  | 'wakeupAzkar'
  | 'quranDuas'
  | 'prophetDuas'
  | 'namesOfAllah'
  | 'quranRuqyah'
  | 'sunnahRuqyah'
  | 'tasbeeh'
  | 'more'
  | 'nextPrayer'
  | 'timeUntilNextPrayer'
  | 'prayerTime'
  | 'forbiddenPrayerTimes'
  | 'sunnahPrayers'
  | 'duhaPrayer'
  | 'islamicDate'
  | 'gregorianDate'
  | 'timeRemaining'
  | 'favorites'
  | 'azkar'
  | 'home'
  | 'qibla'
  | 'counter'
  | 'shareApp'
  | 'appLanguage'
  | 'additionalOptions'
  | 'helpAndSupport'
  | 'importantNotes'
  | 'nafilahProhibitedTimes'
  | 'search'
  | 'searchResults'
  | 'noResults'
  | 'monthlyPrayerTimes'
  | 'nightDuas'
  | 'adhanNotifications'
  | 'beforeAdhan'
  | 'atAdhan'
  | 'iqamah'
  | 'turnOffNotifications'
  | 'today'
  | 'locationUpdateSuccessful'
  | 'addedToFavorites'
  | 'removedFromFavorites'
  // Qibla Page Keys
  | 'qiblaDirectionTitle'
  | 'qiblaInstructions'
  | 'qiblaPermissionDeniedError'
  | 'qiblaNotSupportedError'
  | 'qiblaGenericError'
  | 'retry'
  | 'qiblaCompassActivatedTitle'
  | 'qiblaCompassActivatedDesc'
  | 'yourDirection'
  | 'facingQiblaMessage'
  | "qiblaDirection"
  | 'qiblaDisclaimer'
  | 'qiblaLocationNeededError' // Added key for location error
  // Azkar Sound Alerts
  | 'azkarSoundAlerts'
  | 'azkarSoundAlertsDesc'
  // Test Notification Button Keys
  | 'permissionDenied'
  | 'notificationPermissionRequired'
  | 'noSoundSelected'
  | 'selectAdhanSoundFirst'
  | 'testNotificationTitle'
  | 'testNotificationBody'
  | 'testNotificationScheduledTitle'
  | 'testNotificationScheduledDesc'
  | 'testNotificationError'
  | 'testAdhanSoundButton'
  | 'cannotTestSound' // Added key
  | 'enableNotificationsAndAdhanSound' // Added key
  | 'enableNotificationsAndIqamahSound' // Added key for Iqamah test
  | 'testAdhanTitle' // Added key
  | 'testIqamahTitle' // Added key
  | 'testAdhanBody' // Added key
  | 'testIqamahBody' // Added key
  | 'testAdhanScheduledTitle' // Added key
  | 'testIqamahScheduledTitle' // Added key
  | 'testAdhanScheduledDesc' // Added key
  | 'testIqamahScheduledDesc' // Added key
  | 'error'; // Ensure 'error' key exists if used

export const translations: Record<"ar" | "en", Record<TranslationKey, string>> = {
  ar: {
    appName: "أذكاري",
    prayerTimes: "مواقيت الصلاة",
    fajr: "الفجر",
    sunrise: "الشروق",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    isha: "العشاء",
    midnight: "منتصف الليل",
    lastThird: "الثلث الأخير",
    settings: "الإعدادات",
    location: "الموقع",
    notifications: "الإشعارات",
    darkMode: "الوضع الداكن",
    fontSize: "حجم الخط",
    language: "اللغة",
    share: "مشاركة",
    currentCity: "المدينة الحالية",
    changeLocation: "تغيير الموقع",
    detectAutomaticLocation: "تحديد الموقع تلقائياً", // Added translation
    manualLocationInput: "إدخال الموقع يدوياً", // Added translation
    calculationMethod: "طريقة الحساب",
    currentMethod: "الطريقة الحالية",
    changeMethod: "تغيير الطريقة",
    prayerCalculationMethod: "طريقة حساب مواقيت الصلاة", // Added translation
    selectCalculationMethod: "اختر طريقة الحساب", // Added translation
    enableNotifications: "تفعيل الإشعارات",
    reminderForAzkar: "تذكير بأوقات الأذكار",
    soundEnabled: "الصوت",
    playSoundOnTap: "تشغيل صوت عند الضغط",
    vibrationEnabled: "الاهتزاز",
    enableVibration: "تفعيل الاهتزاز عند الضغط",
    darkModeLabel: "الوضع الداكن",
    changeAppearance: "تغيير مظهر التطبيق",
    morningAzkar: "أذكار الصباح",
    eveningAzkar: "أذكار المساء",
    afterPrayerAzkar: "أذكار بعد الصلاة",
    sleepAzkar: "أذكار النوم",
    wakeupAzkar: "أذكار الاستيقاظ",
    quranDuas: "أدعية من القرآن",
    prophetDuas: "من دعاء الرسول ﷺ",
    namesOfAllah: "أسماء الله الحسنى",
    quranRuqyah: "الرقية بالقرآن",
    sunnahRuqyah: "الرقية بالسنة",
    tasbeeh: "تسابيح",
    tasabeeh: "تسابيح",
    more: "المزيد",
    nextPrayer: "الصلاة القادمة",
    timeUntilNextPrayer: "متبقي للصلاة",
    prayerTime: "وقت الصلاة",
    forbiddenPrayerTimes: "أوقات النهي عن الصلاة",
    sunnahPrayers: "السنن الرواتب",
    duhaPrayer: "صلاة الضحى",
    islamicDate: "التاريخ الهجري",
    gregorianDate: "التاريخ الميلادي",
    timeRemaining: "الوقت المتبقي",
    favorites: "المفضلة",
    azkar: "الأذكار",
    home: "الرئيسية",
    qibla: "القبلة",
    counter: "العداد",
    shareApp: "مشاركة التطبيق",
    appLanguage: "لغة التطبيق",
    additionalOptions: "خيارات إضافية",
    helpAndSupport: "المساعدة والدعم",
    importantNotes: "ملاحظات هامة",
    nafilahProhibitedTimes: "أوقات لا تجوز فيها صلاة النافلة",
    search: "البحث",
    searchResults: "نتائج البحث",
    noResults: "لا توجد نتائج",
    monthlyPrayerTimes: "جدول مواقيت الصلاة الشهري",
    nightDuas: "دعاء من تعار من الليل",
    adhanNotifications: "إشعارات الأذان",
    beforeAdhan: "قبل الأذان",
    atAdhan: "عند الأذان",
    iqamah: "عند الإقامة",
    turnOffNotifications: "إيقاف الإشعارات",
    today: "اليوم",
    locationUpdateSuccessful: "تم تحديث الموقع بنجاح",
    addedToFavorites: "تمت الإضافة للمفضلة",
    removedFromFavorites: "تمت الإزالة من المفضلة",
    // Qibla Page Keys - Arabic
    qiblaDirectionTitle: "اتجاه القبلة",
    qiblaInstructions: "استخدم البوصلة للعثور على اتجاه القبلة بدقة",
    qiblaPermissionDeniedError: "لم يتم السماح باستخدام مستشعرات الجهاز لتحديد القبلة.",
    qiblaNotSupportedError: "جهازك لا يدعم المستشعرات اللازمة لتحديد القبلة.",
    qiblaGenericError: "حدث خطأ أثناء محاولة الوصول إلى مستشعرات الجهاز.",
    retry: "إعادة المحاولة",
    qiblaCompassActivatedTitle: "تم تفعيل البوصلة",
    qiblaCompassActivatedDesc: "حرك جهازك للعثور على اتجاه القبلة",
    yourDirection: "اتجاهك الحالي",
    facingQiblaMessage: "أنت تواجه القبلة!",
    qiblaDirection: "اتجاه القبلة",
    qiblaDisclaimer: "تأكد من أن جهازك يدعم البوصلة وأنك بعيد عن أي تشويش مغناطيسي.",
    qiblaLocationNeededError: "يرجى تحديد موقعك أولاً لحساب اتجاه القبلة.", // Added Arabic translation
    // Azkar Sound Alerts - Arabic
    azkarSoundAlerts: "تنبيهات صوتية للأذكار",
    azkarSoundAlertsDesc: "تشغيل صوت عند وقت أذكار الصباح والمساء",
    // Test Notification Button Keys - Arabic
    permissionDenied: "تم رفض الإذن",
    notificationPermissionRequired: "مطلوب إذن الإشعارات لإرسال إشعار الاختبار.",
    noSoundSelected: "لم يتم تحديد صوت",
    selectAdhanSoundFirst: "يرجى تحديد صوت الأذان أولاً من القائمة.",
    testNotificationTitle: "إشعار اختبار",
    testNotificationBody: "هذا إشعار اختبار لصوت الأذان المحدد.",
    testNotificationScheduledTitle: "تم جدولة إشعار الاختبار",
    testNotificationScheduledDesc: "ستتلقى إشعارًا تجريبيًا خلال ثوانٍ قليلة.", // Generic, keep or remove if specific ones cover all cases
    testNotificationError: "حدث خطأ أثناء جدولة إشعار الاختبار.",
    testAdhanSoundButton: "اختبار صوت الأذان",
    cannotTestSound: "لا يمكن اختبار الصوت", // Added Arabic translation
    enableNotificationsAndAdhanSound: "يرجى تفعيل الإشعارات وصوت الأذان أولاً.", // Added Arabic translation
    enableNotificationsAndIqamahSound: "يرجى تفعيل الإشعارات وصوت الإقامة أولاً.", // Added Arabic translation
    testAdhanTitle: "اختبار الأذان", // Added Arabic translation
    testIqamahTitle: "اختبار الإقامة", // Added Arabic translation
    testAdhanBody: "هذا إشعار اختبار لصوت الأذان.", // Added Arabic translation
    testIqamahBody: "هذا إشعار اختبار لصوت الإقامة.", // Added Arabic translation
    testAdhanScheduledTitle: "تم جدولة اختبار الأذان", // Added Arabic translation
    testIqamahScheduledTitle: "تم جدولة اختبار الإقامة", // Added Arabic translation
    testAdhanScheduledDesc: "ستتلقى إشعار اختبار الأذان خلال ثوانٍ.", // Added Arabic translation
    testIqamahScheduledDesc: "ستتلقى إشعار اختبار الإقامة خلال ثوانٍ.", // Added Arabic translation
    error: "خطأ", // Added Arabic translation for 'error'

    // Prayer calculation settings
    calculationMethodDescription: "اختر طريقة حساب مواقيت الصلاة المناسبة لمنطقتك",
    methodDetails: "تفاصيل الطريقة",
    fajrAngle: "زاوية الفجر",
    ishaAngle: "زاوية العشاء",
    asrCalculation: "حساب وقت العصر",
    asrCalculationDescription: "اختر المذهب المناسب لحساب وقت صلاة العصر",
    selectMadhab: "اختر المذهب",
    shafiMadhab: "الشافعي (والمالكي والحنبلي)",
    hanafiMadhab: "الحنفي",
    shafiAsrDescription: "عندما يكون ظل الشيء مساوياً لطوله",
    hanafiAsrDescription: "عندما يكون ظل الشيء ضعف طوله",
    highLatitudes: "المناطق ذات خطوط العرض العالية",
    highLatitudesDescription: "طريقة حساب الفجر والعشاء في المناطق القريبة من القطبين",
    selectHighLatitudeRule: "اختر طريقة الحساب",
    middleOfTheNight: "منتصف الليل",
    seventhOfTheNight: "سبع الليل",
    twilightAngle: "زاوية الشفق",
    manualAdjustments: "تعديلات يدوية",
    manualAdjustmentsDescription: "تعديل أوقات الصلاة يدوياً (بالدقائق)",
    minutes: "دقائق",
    resetAdjustments: "إعادة ضبط",
    saveAdjustments: "حفظ التعديلات",
    adjustmentsSaved: "تم حفظ التعديلات",
    adjustmentsReset: "تم إعادة ضبط التعديلات",
    prayerTimesRecalculated: "تم إعادة حساب مواقيت الصلاة",
    calculationMethodUpdated: "تم تحديث طريقة الحساب",
    madhabUpdated: "تم تحديث المذهب",
    asrTimeRecalculated: "تم إعادة حساب وقت العصر",
    highLatitudeRuleUpdated: "تم تحديث طريقة حساب المناطق ذات خطوط العرض العالية",
    advancedPrayerSettings: "إعدادات متقدمة لحساب مواقيت الصلاة"
  },
  en: {
    appName: "Azkari",
    prayerTimes: "Prayer Times",
    fajr: "Fajr",
    sunrise: "Sunrise",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    midnight: "Midnight",
    lastThird: "Last Third",
    settings: "Settings",
    location: "Location",
    notifications: "Notifications",
    darkMode: "Dark Mode",
    fontSize: "Font Size",
    language: "Language",
    share: "Share",
    currentCity: "Current City",
    changeLocation: "Change Location",
    detectAutomaticLocation: "Detect Location Automatically", // Added translation
    manualLocationInput: "Manual Location Input", // Added translation
    calculationMethod: "Calculation Method",
    currentMethod: "Current Method",
    changeMethod: "Change Method",
    prayerCalculationMethod: "Prayer Calculation Method", // Added translation
    selectCalculationMethod: "Select Calculation Method", // Added translation
    enableNotifications: "Enable Notifications",
    reminderForAzkar: "Azkar Time Reminders",
    soundEnabled: "Sound",
    playSoundOnTap: "Play Sound On Tap",
    vibrationEnabled: "Vibration",
    enableVibration: "Enable Vibration On Tap",
    darkModeLabel: "Dark Mode",
    changeAppearance: "Change App Appearance",
    morningAzkar: "Morning Azkar",
    eveningAzkar: "Evening Azkar",
    afterPrayerAzkar: "After Prayer Azkar",
    sleepAzkar: "Sleep Azkar",
    wakeupAzkar: "Wake-up Azkar",
    quranDuas: "Duas from Quran",
    prophetDuas: "Prophet's Duas ﷺ",
    namesOfAllah: "Names of Allah",
    quranRuqyah: "Ruqyah from Quran",
    sunnahRuqyah: "Ruqyah from Sunnah",
    tasbeeh: "Tasbeeh",
    tasabeeh: "Tasabeeh",
    more: "More",
    nextPrayer: "Next Prayer",
    timeUntilNextPrayer: "Time Until Next Prayer",
    prayerTime: "Prayer Time",
    forbiddenPrayerTimes: "Forbidden Prayer Times",
    sunnahPrayers: "Sunnah Prayers",
    duhaPrayer: "Duha Prayer",
    islamicDate: "Hijri Date",
    gregorianDate: "Gregorian Date",
    timeRemaining: "Time Remaining",
    favorites: "Favorites",
    azkar: "Azkar",
    home: "Home",
    qibla: "Qibla",
    counter: "Counter",
    shareApp: "Share App",
    appLanguage: "App Language",
    additionalOptions: "Additional Options",
    helpAndSupport: "Help & Support",
    importantNotes: "Important Notes",
    nafilahProhibitedTimes: "Times When Nafilah Prayers Are Prohibited",
    search: "Search",
    searchResults: "Search Results",
    noResults: "No Results",
    monthlyPrayerTimes: "Monthly Prayer Times",
    nightDuas: "Night Duas",
    adhanNotifications: "Adhan Notifications",
    beforeAdhan: "Before Adhan",
    atAdhan: "At Adhan Time",
    iqamah: "At Iqamah Time",
    turnOffNotifications: "Turn Off Notifications",
    today: "Today",
    locationUpdateSuccessful: "Location updated successfully",
    addedToFavorites: "Added to favorites",
    removedFromFavorites: "Removed from favorites",
    // Qibla Page Keys - English
    qiblaDirectionTitle: "Qibla Direction",
    qiblaInstructions: "Use the compass to accurately find the Qibla direction",
    qiblaPermissionDeniedError: "Permission to use device sensors for Qibla direction was denied.",
    qiblaNotSupportedError: "Your device does not support the required sensors for Qibla direction.",
    qiblaGenericError: "An error occurred while trying to access device sensors.",
    retry: "Retry",
    qiblaCompassActivatedTitle: "Compass Activated",
    qiblaCompassActivatedDesc: "Move your device to find the Qibla direction",
    yourDirection: "Your Current Direction",
    facingQiblaMessage: "You are facing the Qibla!",
    qiblaDirection: "Qibla Direction",
    qiblaDisclaimer: "Make sure your device supports a compass and is away from magnetic interference.",
    qiblaLocationNeededError: "Please set your location first to calculate the Qibla direction.", // Added English translation
    // Azkar Sound Alerts - English
    azkarSoundAlerts: "Azkar Sound Alerts",
    azkarSoundAlertsDesc: "Play a sound for Morning and Evening Azkar times",
    // Test Notification Button Keys - English
    permissionDenied: "Permission Denied",
    notificationPermissionRequired: "Notification permission is required to send a test notification.",
    noSoundSelected: "No Sound Selected",
    selectAdhanSoundFirst: "Please select an Adhan sound from the list first.",
    testNotificationTitle: "Test Notification",
    testNotificationBody: "This is a test notification for the selected Adhan sound.",
    testNotificationScheduledTitle: "Test Notification Scheduled",
    testNotificationScheduledDesc: "You will receive a test notification in a few seconds.", // Generic, keep or remove if specific ones cover all cases
    testNotificationError: "An error occurred while scheduling the test notification.",
    testAdhanSoundButton: "Test Adhan Sound",
    cannotTestSound: "Cannot Test Sound", // Added English translation
    enableNotificationsAndAdhanSound: "Please enable notifications and Adhan sound first.", // Added English translation
    enableNotificationsAndIqamahSound: "Please enable notifications and Iqamah sound first.", // Added English translation
    testAdhanTitle: "Test Adhan", // Added English translation
    testIqamahTitle: "Test Iqamah", // Added English translation
    testAdhanBody: "This is a test notification for the Adhan sound.", // Added English translation
    testIqamahBody: "This is a test notification for the Iqamah sound.", // Added English translation
    testAdhanScheduledTitle: "Adhan Test Scheduled", // Added English translation
    testIqamahScheduledTitle: "Iqamah Test Scheduled", // Added English translation
    testAdhanScheduledDesc: "You will receive the Adhan test notification in a few seconds.", // Added English translation
    testIqamahScheduledDesc: "You will receive the Iqamah test notification in a few seconds.", // Added English translation
    error: "Error", // Added English translation for 'error'

    // Prayer calculation settings
    calculationMethodDescription: "Choose the prayer time calculation method suitable for your region",
    methodDetails: "Method Details",
    fajrAngle: "Fajr Angle",
    ishaAngle: "Isha Angle",
    asrCalculation: "Asr Time Calculation",
    asrCalculationDescription: "Choose the madhab for calculating Asr prayer time",
    selectMadhab: "Select Madhab",
    shafiMadhab: "Shafi (also Maliki & Hanbali)",
    hanafiMadhab: "Hanafi",
    shafiAsrDescription: "When the shadow of an object equals its height",
    hanafiAsrDescription: "When the shadow of an object equals twice its height",
    highLatitudes: "High Latitudes",
    highLatitudesDescription: "Method for calculating Fajr and Isha in regions near the poles",
    selectHighLatitudeRule: "Select Calculation Method",
    middleOfTheNight: "Middle of the Night",
    seventhOfTheNight: "Seventh of the Night",
    twilightAngle: "Twilight Angle",
    manualAdjustments: "Manual Adjustments",
    manualAdjustmentsDescription: "Manually adjust prayer times (in minutes)",
    minutes: "minutes",
    resetAdjustments: "Reset Adjustments",
    saveAdjustments: "Save Adjustments",
    adjustmentsSaved: "Adjustments Saved",
    adjustmentsReset: "Adjustments Reset",
    prayerTimesRecalculated: "Prayer times recalculated",
    calculationMethodUpdated: "Calculation method updated",
    madhabUpdated: "Madhab updated",
    asrTimeRecalculated: "Asr time recalculated",
    highLatitudeRuleUpdated: "High latitude rule updated",
    advancedPrayerSettings: "Advanced Prayer Calculation Settings"
  }
};

// Helper function to get translation
export const getTranslation = (key: TranslationKey, language: "ar" | "en"): string => {
  return translations[language][key] || key;
};

// Hook to easily use translations with the current language
export const useTranslation = (language: "ar" | "en") => {
  return {
    t: (key: TranslationKey) => getTranslation(key, language)
  };
};
