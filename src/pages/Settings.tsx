import { useNavigate } from "react-router-dom";
import {
  Bell, Calendar, Moon, Share2, Globe, X, Mail, Info
} from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useTranslation } from "../utils/translations";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();

  const {
    settings: appSettings,
  } = useAppSettings();

  const { t } = useTranslation(appSettings.language);
  const { toast } = useToast();

  const shareApp = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: appSettings.language === "ar" ? "أذكار المسلم" : "Muslim Azkar",
          text: appSettings.language === "ar" ? "تطبيق أذكار المسلم للذكر والدعاء" : "Muslim Azkar app for dhikr and dua",
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: appSettings.language === "ar" ? "تم نسخ الرابط" : "Link copied",
          description: appSettings.language === "ar" ? "تم نسخ رابط التطبيق إلى الحافظة" : "App link copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleAlertNavigation = (alertId?: string) => {
    if (alertId) {
      navigate(`/alert-system/alert/${alertId}`);
    } else {
      navigate('/alert-system');
    }
  };

  const handlePrayerTimesNavigation = () => {
    navigate('/prayer-times-settings');
  };

  const handleAppFeaturesNavigation = () => {
    navigate('/app-features');
  };

  const handleAppearanceNavigation = () => {
    navigate('/appearance-settings');
  };

  const handleLanguageNavigation = () => {
    navigate('/language-settings');
  };

  const handleHelpNavigation = () => {
    navigate('/help');
  };

  const handleContactNavigation = () => {
    navigate('/contact');
  };

  const handleNewsletterNavigation = () => {
    navigate('/newsletter');
  };



  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="relative py-4 border-b border-border">
        <button
          onClick={() => navigate('/')} // Changed to navigate to home page
          className="absolute right-4 top-1/2 transform -translate-y-1/2 rtl:right-auto rtl:left-4"
        >
          <X className="h-6 w-6 text-muted-foreground" />
        </button>
        <h1 className="text-xl font-bold text-center font-arabic text-foreground">{t('settings')}</h1>
      </div>

      {/* Main Content */}
      <div className="pb-20">
        {/* App Info Section */}
        <div className="border-b border-border px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-arabic text-foreground">{appSettings.language === "ar" ? "التطبيق" : "App"}</h2>
          </div>
          <div
            className="bg-card backdrop-blur-sm rounded-xl border border-border p-4 mb-3 flex items-center justify-between cursor-pointer hover:bg-muted"
            onClick={handleAppFeaturesNavigation}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-card-foreground">
                  {appSettings.language === "ar" ? "مزايا التطبيق" : "App Features"}
                </h3>
              </div>
            </div>
            <div className="bg-primary rounded-lg h-10 w-10 flex items-center justify-center">
              <Info className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Settings Categories */}
        <div className="border-b border-border px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-arabic text-foreground">{appSettings.language === "ar" ? "إعدادات" : "Settings"}</h2>
          </div>

          {/* Date & Prayer Times Section */}
          <div
            className="bg-card backdrop-blur-sm rounded-xl border border-border p-4 mb-3 flex items-center justify-between cursor-pointer hover:bg-muted"
            onClick={handlePrayerTimesNavigation}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-card-foreground">
                  {appSettings.language === "ar" ? "التاريخ ومواقيت الصلاة" : "Date & Prayer Times"}
                </h3>
              </div>
            </div>
            <div className="bg-secondary rounded-lg h-10 w-10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-secondary-foreground" />
            </div>
          </div>


          {/* Notifications Section */}
          <div
            className="bg-card backdrop-blur-sm rounded-xl border border-border p-4 mb-3 flex items-center justify-between cursor-pointer hover:bg-muted"
            onClick={() => handleAlertNavigation()}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-card-foreground">
                  {appSettings.language === "ar" ? "منبه الأذكار والأذان" : "Azkar & Adhan Notifications"}
                </h3>
              </div>
            </div>
            <div className="bg-accent rounded-lg h-10 w-10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>

          {/* Appearance Section */}
          <div
            className="bg-card backdrop-blur-sm rounded-xl border border-border p-4 mb-3 flex items-center justify-between cursor-pointer hover:bg-muted"
            onClick={handleAppearanceNavigation}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-card-foreground">
                  {appSettings.language === "ar" ? "المظهر والخلفيات" : "Appearance & Background"}
                </h3>
              </div>
            </div>
            <div className="bg-primary rounded-lg h-10 w-10 flex items-center justify-center">
              <Moon className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>


          {/* Language Section */}
          <div
            className="bg-card backdrop-blur-sm rounded-xl border border-border p-4 mb-3 flex items-center justify-between cursor-pointer hover:bg-muted"
            onClick={handleLanguageNavigation}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-card-foreground">
                  {appSettings.language === "ar" ? "اللغة" : "Language"}
                </h3>
              </div>
            </div>
            <div className="bg-secondary rounded-lg h-10 w-10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-secondary-foreground" />
            </div>
          </div>

        </div>

        {/* Social & Info Section */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-arabic text-foreground">{appSettings.language === "ar" ? "أذكار" : "Azkar"}</h2>
          </div>
          {/* Help */}
          <div
            className="bg-card backdrop-blur-sm rounded-xl border border-border p-4 mb-3 flex items-center justify-between cursor-pointer hover:bg-muted"
            onClick={handleHelpNavigation}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-card-foreground">
                  {appSettings.language === "ar" ? "مساعدة" : "Help"}
                </h3>
              </div>
            </div>
            <div className="bg-red-600 rounded-lg h-10 w-10 flex items-center justify-center">
              <Info className="w-6 h-6 text-white" />
            </div>
          </div>
          {/* Email */}
          <div
            className="bg-card backdrop-blur-sm rounded-xl border border-border p-4 mb-3 flex items-center justify-between cursor-pointer hover:bg-muted"
            onClick={handleContactNavigation}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-card-foreground">
                  {appSettings.language === "ar" ? "راسلني حول التطبيق" : "Email me about the app"}
                </h3>
              </div>
            </div>
            <div className="bg-amber-600 rounded-lg h-8 w-8 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
          </div>
          {/* Share App */}
          <div
            className="bg-card backdrop-blur-sm rounded-xl border border-border p-4 mb-3 flex items-center justify-between cursor-pointer hover:bg-muted"
            onClick={shareApp}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-card-foreground">
                  {appSettings.language === "ar" ? "انشر التطبيق" : "Share App"}
                </h3>
              </div>
            </div>
            <div className="bg-pink-600 rounded-lg h-8 w-8 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
          </div>
          {/* Newsletter */}
          <div
            className="bg-card backdrop-blur-sm rounded-xl border border-border p-4 mb-6 flex items-center justify-between cursor-pointer hover:bg-muted"
            onClick={handleNewsletterNavigation}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-card-foreground">
                  {appSettings.language === "ar" ? "النشرة الإخبارية" : "Newsletter"}
                </h3>
              </div>
            </div>
            <div className="bg-blue-600 rounded-lg h-8 w-8 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
          </div>
          {/* Version Info */}
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground font-arabic">
              {appSettings.language === "ar" ? "أذكار المسلم - تطبيق للذكر والدعاء" : "Muslim Azkar - App for Dhikr and Dua"}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              v1.1.0
            </p>
          </div>
          {/* Footer Text */}
          <div className="text-center mb-4 px-6">
            <p className="text-sm text-foreground font-arabic leading-relaxed">
              {appSettings.language === "ar"
                ? "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ."
                : "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. There is no deity except You."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
