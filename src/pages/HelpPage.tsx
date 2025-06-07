import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  Clock,
  Bell,
  Settings,
  Search,
  Heart,
  Compass,
  Volume2
} from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";

const HelpPage = () => {
  const navigate = useNavigate();
  const { settings: appSettings } = useAppSettings();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      questionAr: "كيف أستخدم الأذكار في التطبيق؟",
      questionEn: "How do I use the dhikr in the app?",
      answerAr: "يمكنك الوصول للأذكار من الصفحة الرئيسية، اختر الفئة المناسبة مثل أذكار الصباح أو المساء، ثم اضغط على الذكر لقراءته. يمكنك أيضاً إضافة الأذكار للمفضلة للوصول السريع.",
      answerEn: "You can access dhikr from the main page, choose the appropriate category like morning or evening dhikr, then tap on the dhikr to read it. You can also add dhikr to favorites for quick access."
    },
    {
      icon: <Clock className="w-5 h-5" />,
      questionAr: "كيف أضبط مواقيت الصلاة؟",
      questionEn: "How do I set prayer times?",
      answerAr: "اذهب إلى الإعدادات ← التاريخ ومواقيت الصلاة، ثم حدد موقعك إما تلقائياً أو يدوياً. يمكنك أيضاً اختيار طريقة الحساب المناسبة لمنطقتك.",
      answerEn: "Go to Settings → Date & Prayer Times, then set your location either automatically or manually. You can also choose the calculation method suitable for your region."
    },
    {
      icon: <Bell className="w-5 h-5" />,
      questionAr: "كيف أفعل التنبيهات؟",
      questionEn: "How do I enable notifications?",
      answerAr: "اذهب إلى الإعدادات ← منبه الأذكار والأذان، ثم فعل التنبيهات للصلوات والأذكار التي تريدها. يمكنك تخصيص أوقات التنبيهات وأصواتها.",
      answerEn: "Go to Settings → Azkar & Adhan Notifications, then enable notifications for the prayers and dhikr you want. You can customize notification times and sounds."
    },
    {
      icon: <Compass className="w-5 h-5" />,
      questionAr: "كيف أستخدم البوصلة لتحديد القبلة؟",
      questionEn: "How do I use the compass to find Qibla?",
      answerAr: "اضغط على أيقونة القبلة في الصفحة الرئيسية، اسمح للتطبيق بالوصول لموقعك والبوصلة، ثم اتبع السهم الذي يشير لاتجاه القبلة.",
      answerEn: "Tap the Qibla icon on the main page, allow the app to access your location and compass, then follow the arrow pointing to the Qibla direction."
    },
    {
      icon: <Heart className="w-5 h-5" />,
      questionAr: "كيف أضيف الأذكار للمفضلة؟",
      questionEn: "How do I add dhikr to favorites?",
      answerAr: "عند قراءة أي ذكر، اضغط على أيقونة القلب في أعلى الصفحة لإضافته للمفضلة. يمكنك الوصول للمفضلة من الصفحة الرئيسية.",
      answerEn: "When reading any dhikr, tap the heart icon at the top of the page to add it to favorites. You can access favorites from the main page."
    },
    {
      icon: <Search className="w-5 h-5" />,
      questionAr: "كيف أبحث عن ذكر معين؟",
      questionEn: "How do I search for a specific dhikr?",
      answerAr: "استخدم أيقونة البحث في الصفحة الرئيسية، ثم اكتب كلمة أو جملة من الذكر الذي تبحث عنه. ستظهر لك النتائج المطابقة.",
      answerEn: "Use the search icon on the main page, then type a word or phrase from the dhikr you're looking for. Matching results will appear."
    },
    {
      icon: <Volume2 className="w-5 h-5" />,
      questionAr: "كيف أستخدم عداد التسبيح؟",
      questionEn: "How do I use the tasbih counter?",
      answerAr: "اذهب إلى قسم التسبيح من الصفحة الرئيسية، اختر نوع التسبيح، ثم اضغط على الشاشة لزيادة العداد. العداد مضبوط على 100 مرة افتراضياً.",
      answerEn: "Go to the Tasbih section from the main page, choose the type of tasbih, then tap the screen to increase the counter. The counter is set to 100 by default."
    },
    {
      icon: <Settings className="w-5 h-5" />,
      questionAr: "كيف أغير مظهر التطبيق؟",
      questionEn: "How do I change the app appearance?",
      answerAr: "اذهب إلى الإعدادات ← المظهر والخلفيات، يمكنك تفعيل الوضع الداكن وتغيير حجم الخط حسب تفضيلك.",
      answerEn: "Go to Settings → Appearance & Background, you can enable dark mode and change font size according to your preference."
    }
  ];

  const quickTips = [
    {
      titleAr: "اسحب لأسفل للتحديث",
      titleEn: "Pull down to refresh",
      descriptionAr: "في أي صفحة، اسحب لأسفل لتحديث المحتوى",
      descriptionEn: "On any page, pull down to refresh content"
    },
    {
      titleAr: "اضغط مطولاً للخيارات",
      titleEn: "Long press for options",
      descriptionAr: "اضغط مطولاً على أي ذكر لإظهار خيارات إضافية",
      descriptionEn: "Long press on any dhikr to show additional options"
    },
    {
      titleAr: "استخدم الاختصارات",
      titleEn: "Use shortcuts",
      descriptionAr: "يمكنك الوصول السريع للمفضلة والبحث من الصفحة الرئيسية",
      descriptionEn: "You can quickly access favorites and search from the main page"
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
          {appSettings.language === "ar" ? "المساعدة والدعم" : "Help & Support"}
        </h1>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        {/* Introduction */}
        <div className="mb-6 text-center">
          <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-arabic font-semibold text-foreground mb-2">
            {appSettings.language === "ar" ? "كيف يمكننا مساعدتك؟" : "How can we help you?"}
          </h2>
          <p className="text-muted-foreground font-arabic">
            {appSettings.language === "ar" 
              ? "ستجد هنا إجابات للأسئلة الشائعة ونصائح لاستخدام التطبيق"
              : "Here you'll find answers to frequently asked questions and tips for using the app"
            }
          </p>
        </div>

        {/* Quick Tips */}
        <div className="mb-8">
          <h3 className="text-lg font-arabic font-semibold text-foreground mb-4">
            {appSettings.language === "ar" ? "نصائح سريعة" : "Quick Tips"}
          </h3>
          <div className="space-y-3">
            {quickTips.map((tip, index) => (
              <div key={index} className="bg-card backdrop-blur-sm rounded-xl border border-border p-4">
                <h4 className="font-arabic text-base font-medium text-foreground mb-1">
                  {appSettings.language === "ar" ? tip.titleAr : tip.titleEn}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {appSettings.language === "ar" ? tip.descriptionAr : tip.descriptionEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-6">
          <h3 className="text-lg font-arabic font-semibold text-foreground mb-4">
            {appSettings.language === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card backdrop-blur-sm rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 text-left rtl:text-right hover:bg-muted/50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="text-primary flex-shrink-0">
                      {faq.icon}
                    </div>
                    <span className="font-arabic text-base font-medium text-foreground">
                      {appSettings.language === "ar" ? faq.questionAr : faq.questionEn}
                    </span>
                  </div>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {appSettings.language === "ar" ? faq.answerAr : faq.answerEn}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
          <h3 className="font-arabic text-base text-primary font-medium mb-2">
            {appSettings.language === "ar" ? "لم تجد ما تبحث عنه؟" : "Didn't find what you're looking for?"}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {appSettings.language === "ar" 
              ? "يمكنك التواصل معنا عبر البريد الإلكتروني وسنكون سعداء لمساعدتك"
              : "You can contact us via email and we'll be happy to help you"
            }
          </p>
          <button 
            onClick={() => navigate('/contact')}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {appSettings.language === "ar" ? "تواصل معنا" : "Contact Us"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
