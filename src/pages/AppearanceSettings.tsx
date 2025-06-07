import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Languages, 
  PlusCircle, 
  MinusCircle,
  Palette,
  Eye,
  Monitor
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAppSettings } from "../contexts/AppSettingsContext";

const AppearanceSettings = () => {
  const navigate = useNavigate();
  const { 
    settings: appSettings, 
    toggleDarkMode, 
    increaseFontSize, 
    decreaseFontSize 
  } = useAppSettings();

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
          {appSettings.language === "ar" ? "المظهر والخلفيات" : "Appearance & Background"}
        </h1>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        {/* Theme Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-arabic font-semibold text-foreground">
              {appSettings.language === "ar" ? "المظهر العام" : "General Appearance"}
            </h2>
          </div>

          {/* Dark Mode Toggle */}
          <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                {appSettings.appearance.darkMode ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
                <div>
                  <h3 className="font-arabic text-base text-foreground font-medium">
                    {appSettings.language === "ar" ? "الوضع الداكن" : "Dark Mode"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {appSettings.language === "ar" ? "تغيير مظهر التطبيق للوضع الداكن أو الفاتح" : "Switch between dark and light app appearance"}
                  </p>
                </div>
              </div>
              <Switch
                checked={appSettings.appearance.darkMode}
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          {/* Theme Preview */}
          <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
              <Monitor className="w-5 h-5 text-primary" />
              <h3 className="font-arabic text-base text-foreground font-medium">
                {appSettings.language === "ar" ? "معاينة المظهر" : "Theme Preview"}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Light Theme Preview */}
              <div className={`p-3 rounded-lg border-2 transition-all ${!appSettings.appearance.darkMode ? 'border-primary bg-primary/5' : 'border-border bg-white'}`}>
                <div className="bg-white rounded p-2 mb-2">
                  <div className="h-2 bg-gray-200 rounded mb-1"></div>
                  <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                </div>
                <p className="text-xs text-center text-gray-600">
                  {appSettings.language === "ar" ? "فاتح" : "Light"}
                </p>
              </div>
              
              {/* Dark Theme Preview */}
              <div className={`p-3 rounded-lg border-2 transition-all ${appSettings.appearance.darkMode ? 'border-primary bg-primary/5' : 'border-border bg-gray-900'}`}>
                <div className="bg-gray-800 rounded p-2 mb-2">
                  <div className="h-2 bg-gray-600 rounded mb-1"></div>
                  <div className="h-2 bg-gray-500 rounded w-3/4"></div>
                </div>
                <p className="text-xs text-center text-gray-300">
                  {appSettings.language === "ar" ? "داكن" : "Dark"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Font Size Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
            <Languages className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-arabic font-semibold text-foreground">
              {appSettings.language === "ar" ? "حجم الخط" : "Font Size"}
            </h2>
          </div>

          <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-4">
            <div className="mb-4">
              <h3 className="font-arabic text-base text-foreground font-medium mb-2">
                {appSettings.language === "ar" ? "حجم خط الأذكار" : "Azkar Font Size"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {appSettings.language === "ar" ? "اضبط حجم الخط ليناسب راحتك في القراءة" : "Adjust font size for comfortable reading"}
              </p>
            </div>

            {/* Font Size Controls */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={decreaseFontSize}
                disabled={appSettings.appearance.fontSize <= 80}
                className={`p-3 rounded-lg flex items-center justify-center transition-colors ${
                  appSettings.appearance.fontSize <= 80
                    ? 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <MinusCircle className="w-5 h-5" />
              </button>
              
              <div className="flex-1 mx-4 text-center">
                <div
                  className="font-arabic p-4 bg-muted rounded-lg text-foreground border border-border"
                  style={{ fontSize: `${appSettings.appearance.fontSize}%` }}
                >
                  {appSettings.language === "ar" ? "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ" : "In the name of Allah"}
                </div>
                <span className="text-sm text-muted-foreground mt-2 block">
                  {appSettings.appearance.fontSize}%
                </span>
              </div>
              
              <button
                onClick={increaseFontSize}
                disabled={appSettings.appearance.fontSize >= 150}
                className={`p-3 rounded-lg flex items-center justify-center transition-colors ${
                  appSettings.appearance.fontSize >= 150
                    ? 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Font Size Range Indicator */}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{appSettings.language === "ar" ? "صغير" : "Small"}</span>
              <span>{appSettings.language === "ar" ? "متوسط" : "Medium"}</span>
              <span>{appSettings.language === "ar" ? "كبير" : "Large"}</span>
            </div>
          </div>
        </div>

        {/* Accessibility Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-arabic font-semibold text-foreground">
              {appSettings.language === "ar" ? "إمكانية الوصول" : "Accessibility"}
            </h2>
          </div>

          <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="bg-blue-500 rounded-lg p-2 text-white flex-shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-arabic text-base text-foreground font-medium">
                    {appSettings.language === "ar" ? "راحة العينين" : "Eye Comfort"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {appSettings.language === "ar" 
                      ? "الوضع الداكن يقلل من إجهاد العينين في الإضاءة المنخفضة"
                      : "Dark mode reduces eye strain in low-light conditions"
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="bg-green-500 rounded-lg p-2 text-white flex-shrink-0">
                  <Languages className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-arabic text-base text-foreground font-medium">
                    {appSettings.language === "ar" ? "سهولة القراءة" : "Reading Ease"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {appSettings.language === "ar" 
                      ? "اضبط حجم الخط حسب احتياجاتك البصرية"
                      : "Adjust font size according to your visual needs"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
          <h3 className="font-arabic text-base text-primary font-medium mb-2">
            {appSettings.language === "ar" ? "نصائح للاستخدام الأمثل" : "Tips for Optimal Use"}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start space-x-2 rtl:space-x-reverse">
              <span className="text-primary">•</span>
              <span>
                {appSettings.language === "ar" 
                  ? "استخدم الوضع الداكن في الليل لراحة أفضل للعينين"
                  : "Use dark mode at night for better eye comfort"
                }
              </span>
            </li>
            <li className="flex items-start space-x-2 rtl:space-x-reverse">
              <span className="text-primary">•</span>
              <span>
                {appSettings.language === "ar" 
                  ? "اضبط حجم الخط ليناسب المسافة بينك وبين الشاشة"
                  : "Adjust font size to match your distance from the screen"
                }
              </span>
            </li>
            <li className="flex items-start space-x-2 rtl:space-x-reverse">
              <span className="text-primary">•</span>
              <span>
                {appSettings.language === "ar" 
                  ? "الإعدادات تُحفظ تلقائياً ولا تحتاج لإعادة ضبط"
                  : "Settings are saved automatically and don't need to be reset"
                }
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
