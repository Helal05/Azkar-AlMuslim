import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Bell,
  Calendar,
  BookOpen,
  Star,
  Gift,
  Users,
  Check,
  Send,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useToast } from "@/hooks/use-toast";
import { sendNewsletterSubscription, initEmailJS, validateEmailConfig } from "../services/emailService";

const NewsletterPage = () => {
  const navigate = useNavigate();
  const { settings: appSettings } = useAppSettings();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState({
    updates: true,
    newFeatures: true,
    islamicContent: true,
    tips: true
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailConfigured, setEmailConfigured] = useState(false);

  // تهيئة EmailJS عند تحميل الصفحة
  useEffect(() => {
    initEmailJS();
    setEmailConfigured(validateEmailConfig());
  }, []);

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      titleAr: "محتوى إسلامي حصري",
      titleEn: "Exclusive Islamic Content",
      descriptionAr: "أذكار وأدعية جديدة مع شروحاتها وفضائلها",
      descriptionEn: "New dhikr and duas with explanations and virtues",
      color: "bg-green-500"
    },
    {
      icon: <Star className="w-6 h-6" />,
      titleAr: "تحديثات التطبيق",
      titleEn: "App Updates",
      descriptionAr: "كن أول من يعرف عن المزايا والتحسينات الجديدة",
      descriptionEn: "Be the first to know about new features and improvements",
      color: "bg-blue-500"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      titleAr: "تذكيرات موسمية",
      titleEn: "Seasonal Reminders",
      descriptionAr: "أذكار وأعمال خاصة بالمناسبات الإسلامية",
      descriptionEn: "Special dhikr and deeds for Islamic occasions",
      color: "bg-purple-500"
    },
    {
      icon: <Gift className="w-6 h-6" />,
      titleAr: "عروض خاصة",
      titleEn: "Special Offers",
      descriptionAr: "محتوى مجاني ومزايا حصرية للمشتركين",
      descriptionEn: "Free content and exclusive features for subscribers",
      color: "bg-orange-500"
    }
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: appSettings.language === "ar" ? "خطأ في الاشتراك" : "Subscription Error",
        description: appSettings.language === "ar" ? "يرجى إدخال بريدك الإلكتروني" : "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (emailConfigured) {
        // إرسال بيانات الاشتراك باستخدام EmailJS
        const result = await sendNewsletterSubscription(email, preferences, appSettings.language);

        if (!result.success) {
          throw new Error("Failed to send subscription");
        }
      }

      // نجح الاشتراك
      setIsSubscribed(true);
      toast({
        title: appSettings.language === "ar" ? "تم الاشتراك بنجاح!" : "Successfully Subscribed!",
        description: appSettings.language === "ar" ? "شكراً لك! ستصلك النشرة الإخبارية قريباً" : "Thank you! You'll receive our newsletter soon",
      });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast({
        title: appSettings.language === "ar" ? "خطأ في الاشتراك" : "Subscription Error",
        description: appSettings.language === "ar" ? "حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى" : "An error occurred during subscription. Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (isSubscribed) {
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
            {appSettings.language === "ar" ? "النشرة الإخبارية" : "Newsletter"}
          </h1>
        </div>

        {/* Success Content */}
        <div className="p-4 pb-20 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-md">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-arabic font-bold text-foreground mb-4">
              {appSettings.language === "ar" ? "مرحباً بك في النشرة!" : "Welcome to the Newsletter!"}
            </h2>
            <p className="text-muted-foreground font-arabic leading-relaxed mb-6">
              {appSettings.language === "ar"
                ? "تم تأكيد اشتراكك بنجاح. ستصلك رسائل دورية تحتوي على محتوى إسلامي مفيد وتحديثات التطبيق."
                : "Your subscription has been confirmed successfully. You'll receive periodic emails with useful Islamic content and app updates."
              }
            </p>
            <Button onClick={() => navigate('/settings')} className="w-full">
              {appSettings.language === "ar" ? "العودة للإعدادات" : "Back to Settings"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
          {appSettings.language === "ar" ? "النشرة الإخبارية" : "Newsletter"}
        </h1>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        {/* Introduction */}
        <div className="mb-8 text-center">
          <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-arabic font-bold text-foreground mb-3">
            {appSettings.language === "ar" ? "ابق على اطلاع دائم" : "Stay Always Updated"}
          </h2>
          <p className="text-muted-foreground font-arabic leading-relaxed">
            {appSettings.language === "ar"
              ? "اشترك في نشرتنا الإخبارية لتحصل على أحدث المحتويات الإسلامية وتحديثات التطبيق"
              : "Subscribe to our newsletter to get the latest Islamic content and app updates"
            }
          </p>
        </div>

        {/* Features */}
        <div className="mb-8">
          <h3 className="text-lg font-arabic font-semibold text-foreground mb-4">
            {appSettings.language === "ar" ? "ماذا ستحصل عليه؟" : "What will you get?"}
          </h3>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card backdrop-blur-sm rounded-xl border border-border p-4"
              >
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className={`${feature.color} rounded-lg p-3 text-white flex-shrink-0`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-arabic text-base font-semibold text-foreground mb-1">
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

        {/* Subscription Form */}
        <div className="mb-6">
          <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
            <h3 className="text-lg font-arabic font-semibold text-foreground mb-4">
              {appSettings.language === "ar" ? "اشترك الآن" : "Subscribe Now"}
            </h3>

            <form onSubmit={handleSubscribe} className="space-y-4">
              {/* Email Input */}
              <div>
                <Label htmlFor="email" className="text-sm font-arabic font-medium text-foreground mb-1 block">
                  {appSettings.language === "ar" ? "البريد الإلكتروني" : "Email Address"}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={appSettings.language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email address"}
                    className="pl-10 rtl:pr-10 rtl:pl-3 bg-background text-foreground"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              {/* Preferences */}
              <div>
                <Label className="text-sm font-arabic font-medium text-foreground mb-3 block">
                  {appSettings.language === "ar" ? "تفضيلات المحتوى" : "Content Preferences"}
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-arabic text-foreground">
                      {appSettings.language === "ar" ? "تحديثات التطبيق" : "App Updates"}
                    </span>
                    <Switch
                      checked={preferences.updates}
                      onCheckedChange={(value) => handlePreferenceChange('updates', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-arabic text-foreground">
                      {appSettings.language === "ar" ? "المزايا الجديدة" : "New Features"}
                    </span>
                    <Switch
                      checked={preferences.newFeatures}
                      onCheckedChange={(value) => handlePreferenceChange('newFeatures', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-arabic text-foreground">
                      {appSettings.language === "ar" ? "المحتوى الإسلامي" : "Islamic Content"}
                    </span>
                    <Switch
                      checked={preferences.islamicContent}
                      onCheckedChange={(value) => handlePreferenceChange('islamicContent', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-arabic text-foreground">
                      {appSettings.language === "ar" ? "نصائح الاستخدام" : "Usage Tips"}
                    </span>
                    <Switch
                      checked={preferences.tips}
                      onCheckedChange={(value) => handlePreferenceChange('tips', value)}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 rtl:ml-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2 rtl:ml-2" />
                )}
                {isLoading
                  ? (appSettings.language === "ar" ? "جاري الاشتراك..." : "Subscribing...")
                  : (appSettings.language === "ar" ? "اشترك في النشرة" : "Subscribe to Newsletter")
                }
              </Button>
            </form>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {appSettings.language === "ar"
              ? "نحن نحترم خصوصيتك ولن نشارك بريدك الإلكتروني مع أي طرف ثالث. يمكنك إلغاء الاشتراك في أي وقت."
              : "We respect your privacy and will never share your email with third parties. You can unsubscribe at any time."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;
