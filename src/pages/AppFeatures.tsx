import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Clock, 
  Bell, 
  BookOpen, 
  Compass, 
  Heart, 
  Search, 
  Moon, 
  Globe,
  Calendar,
  Volume2,
  Smartphone,
  Wifi,
  Download
} from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";

const AppFeatures = () => {
  const navigate = useNavigate();
  const { settings: appSettings } = useAppSettings();

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      titleAr: "أذكار شاملة",
      titleEn: "Comprehensive Azkar",
      descriptionAr: "مجموعة كاملة من أذكار الصباح والمساء وأذكار النوم والاستيقاظ",
      descriptionEn: "Complete collection of morning, evening, sleep and wake-up remembrances",
      color: "bg-blue-500"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      titleAr: "مواقيت الصلاة الدقيقة",
      titleEn: "Accurate Prayer Times",
      descriptionAr: "حساب دقيق لمواقيت الصلاة بناءً على موقعك الجغرافي",
      descriptionEn: "Precise prayer time calculations based on your geographical location",
      color: "bg-green-500"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      titleAr: "تنبيهات ذكية",
      titleEn: "Smart Notifications",
      descriptionAr: "تنبيهات للصلوات والأذكار مع إمكانية التخصيص الكامل",
      descriptionEn: "Prayer and dhikr notifications with full customization options",
      color: "bg-purple-500"
    },
    {
      icon: <Compass className="w-6 h-6" />,
      titleAr: "اتجاه القبلة",
      titleEn: "Qibla Direction",
      descriptionAr: "تحديد اتجاه القبلة بدقة باستخدام البوصلة المدمجة",
      descriptionEn: "Accurate Qibla direction using built-in compass",
      color: "bg-orange-500"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      titleAr: "المفضلة",
      titleEn: "Favorites",
      descriptionAr: "حفظ الأذكار والأدعية المفضلة للوصول السريع",
      descriptionEn: "Save favorite dhikr and duas for quick access",
      color: "bg-red-500"
    },
    {
      icon: <Search className="w-6 h-6" />,
      titleAr: "البحث المتقدم",
      titleEn: "Advanced Search",
      descriptionAr: "البحث في جميع الأذكار والأدعية بسهولة وسرعة",
      descriptionEn: "Search through all dhikr and duas easily and quickly",
      color: "bg-indigo-500"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      titleAr: "سنن الجمعة",
      titleEn: "Friday Sunnahs",
      descriptionAr: "دليل شامل لسنن يوم الجمعة مع قراءة سورة الكهف",
      descriptionEn: "Comprehensive guide to Friday Sunnahs with Surah Al-Kahf reading",
      color: "bg-teal-500"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      titleAr: "أسماء الله الحسنى",
      titleEn: "Names of Allah",
      descriptionAr: "الأسماء الحسنى مع معانيها وشرحها التفصيلي",
      descriptionEn: "Beautiful Names of Allah with meanings and detailed explanations",
      color: "bg-amber-500"
    },
    {
      icon: <Volume2 className="w-6 h-6" />,
      titleAr: "التسبيح التفاعلي",
      titleEn: "Interactive Tasbih",
      descriptionAr: "عداد تسبيح رقمي مع فضائل كل تسبيحة",
      descriptionEn: "Digital tasbih counter with virtues of each glorification",
      color: "bg-cyan-500"
    },
    {
      icon: <Moon className="w-6 h-6" />,
      titleAr: "الوضع الداكن",
      titleEn: "Dark Mode",
      descriptionAr: "واجهة مريحة للعينين في الإضاءة المنخفضة",
      descriptionEn: "Eye-friendly interface for low-light conditions",
      color: "bg-gray-600"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      titleAr: "متعدد اللغات",
      titleEn: "Multi-language",
      descriptionAr: "دعم اللغتين العربية والإنجليزية",
      descriptionEn: "Support for Arabic and English languages",
      color: "bg-pink-500"
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      titleAr: "يعمل بدون إنترنت",
      titleEn: "Works Offline",
      descriptionAr: "جميع المحتويات متاحة بدون الحاجة للاتصال بالإنترنت",
      descriptionEn: "All content available without internet connection",
      color: "bg-emerald-500"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      titleAr: "تصميم متجاوب",
      titleEn: "Responsive Design",
      descriptionAr: "يعمل بسلاسة على جميع الأجهزة والشاشات",
      descriptionEn: "Works smoothly on all devices and screen sizes",
      color: "bg-violet-500"
    },
    {
      icon: <Download className="w-6 h-6" />,
      titleAr: "سهولة التثبيت",
      titleEn: "Easy Installation",
      descriptionAr: "يمكن تثبيته كتطبيق على الهاتف مباشرة من المتصفح",
      descriptionEn: "Can be installed as an app directly from the browser",
      color: "bg-rose-500"
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
          {appSettings.language === "ar" ? "مزايا التطبيق" : "App Features"}
        </h1>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        {/* Introduction */}
        <div className="mb-6 text-center">
          <p className="text-muted-foreground font-arabic leading-relaxed">
            {appSettings.language === "ar" 
              ? "تطبيق أذكار المسلم يوفر لك مجموعة شاملة من المزايا لمساعدتك في ذكر الله والمحافظة على الصلوات"
              : "Muslim Azkar app provides you with a comprehensive set of features to help you remember Allah and maintain your prayers"
            }
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card backdrop-blur-sm rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className={`${feature.color} rounded-lg p-3 text-white flex-shrink-0`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-arabic text-lg font-semibold text-foreground mb-2">
                    {appSettings.language === "ar" ? feature.titleAr : feature.titleEn}
                  </h3>
                  <p className="text-muted-foreground font-arabic leading-relaxed">
                    {appSettings.language === "ar" ? feature.descriptionAr : feature.descriptionEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-center">
          <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
            <p className="text-primary font-arabic text-lg font-semibold mb-2">
              {appSettings.language === "ar" ? "بارك الله فيكم" : "May Allah bless you"}
            </p>
            <p className="text-muted-foreground font-arabic leading-relaxed">
              {appSettings.language === "ar" 
                ? "نسأل الله أن ينفعكم بهذا التطبيق وأن يجعله في ميزان حسناتنا وحسناتكم"
                : "We ask Allah to benefit you with this app and make it in the scale of our good deeds and yours"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppFeatures;
