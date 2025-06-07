import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Globe, 
  Check,
  Languages,
  BookOpen,
  Users
} from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";

const LanguageSettings = () => {
  const navigate = useNavigate();
  const { settings: appSettings, updateLanguage } = useAppSettings();

  const languages = [
    {
      code: "ar",
      name: "العربية",
      englishName: "Arabic",
      flag: "🇸🇦",
      description: "اللغة العربية - لغة القرآن الكريم",
      englishDescription: "Arabic - The language of the Holy Quran",
      direction: "rtl"
    },
    {
      code: "en", 
      name: "English",
      englishName: "English",
      flag: "🇺🇸",
      description: "English - International language",
      englishDescription: "English - International language",
      direction: "ltr"
    }
  ];

  const features = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      titleAr: "محتوى مترجم بعناية",
      titleEn: "Carefully Translated Content",
      descriptionAr: "جميع الأذكار والأدعية مترجمة بدقة للغة الإنجليزية",
      descriptionEn: "All dhikr and duas are accurately translated to English"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      titleAr: "واجهة متكيفة",
      titleEn: "Adaptive Interface", 
      descriptionAr: "الواجهة تتكيف مع اتجاه النص حسب اللغة المختارة",
      descriptionEn: "Interface adapts to text direction based on selected language"
    },
    {
      icon: <Users className="w-5 h-5" />,
      titleAr: "إمكانية الوصول العالمية",
      titleEn: "Global Accessibility",
      descriptionAr: "يمكن للمسلمين من جميع أنحاء العالم الاستفادة من التطبيق",
      descriptionEn: "Muslims from around the world can benefit from the app"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground" dir={appSettings.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="relative py-4 border-b border-border">
        <button
          onClick={() => navigate('/settings')}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 rtl:right-auto rtl:left-4"
        >
          <ArrowLeft className="h-6 w-6 text-muted-foreground" />
        </button>
        <h1 className="text-xl font-bold text-center font-arabic text-foreground">
          {appSettings.language === "ar" ? "إعدادات اللغة" : "Language Settings"}
        </h1>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        {/* Introduction */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-3">
            <Languages className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-arabic font-semibold text-foreground">
              {appSettings.language === "ar" ? "اختر لغتك المفضلة" : "Choose Your Preferred Language"}
            </h2>
          </div>
          <p className="text-muted-foreground font-arabic">
            {appSettings.language === "ar" 
              ? "يمكنك تغيير لغة التطبيق في أي وقت"
              : "You can change the app language at any time"
            }
          </p>
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <div className="grid gap-4">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => updateLanguage(language.code as 'ar' | 'en')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  appSettings.language === language.code
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:bg-muted/50"
                } flex items-center justify-between`}
              >
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="text-3xl">{language.flag}</div>
                  <div className="text-left rtl:text-right">
                    <h3 className={`font-arabic text-lg font-semibold ${
                      appSettings.language === language.code ? "text-primary" : "text-foreground"
                    }`}>
                      {language.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {appSettings.language === "ar" ? language.description : language.englishDescription}
                    </p>
                  </div>
                </div>
                {appSettings.language === language.code && (
                  <div className="bg-primary rounded-full p-1">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-6">
          <h3 className="text-lg font-arabic font-semibold text-foreground mb-4">
            {appSettings.language === "ar" ? "مزايا دعم اللغات المتعددة" : "Multi-language Support Features"}
          </h3>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card backdrop-blur-sm rounded-xl border border-border p-4"
              >
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="bg-primary/10 rounded-lg p-2 text-primary flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-arabic text-base font-medium text-foreground mb-1">
                      {appSettings.language === "ar" ? feature.titleAr : feature.titleEn}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {appSettings.language === "ar" ? feature.descriptionAr : feature.descriptionEn}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Preview */}
        <div className="mb-6">
          <h3 className="text-lg font-arabic font-semibold text-foreground mb-4">
            {appSettings.language === "ar" ? "معاينة النص" : "Text Preview"}
          </h3>
          <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-4">
            <div className="space-y-4">
              {/* Arabic Preview */}
              <div className="text-right" dir="rtl">
                <h4 className="font-arabic text-base font-medium text-foreground mb-2">العربية</h4>
                <p className="font-arabic text-sm text-muted-foreground leading-relaxed">
                  بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ • الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
                </p>
              </div>
              
              <div className="border-t border-border"></div>
              
              {/* English Preview */}
              <div className="text-left" dir="ltr">
                <h4 className="font-arabic text-base font-medium text-foreground mb-2">English</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  In the name of Allah, the Most Gracious, the Most Merciful • All praise is due to Allah, Lord of all the worlds
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Note */}
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-arabic text-base font-medium text-blue-900 dark:text-blue-100 mb-1">
                {appSettings.language === "ar" ? "ملاحظة مهمة" : "Important Note"}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                {appSettings.language === "ar" 
                  ? "النصوص العربية للأذكار والأدعية تبقى كما هي في كلا اللغتين، والترجمة تشمل واجهة التطبيق والشروحات فقط"
                  : "Arabic texts of dhikr and duas remain unchanged in both languages, translation only applies to the app interface and explanations"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;
