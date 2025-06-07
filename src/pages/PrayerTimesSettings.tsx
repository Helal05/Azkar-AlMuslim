import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, Calculator, ArrowLeft, Settings as SettingsIcon
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useTranslation } from "../utils/translations";
import { useToast } from "@/hooks/use-toast";
import PrayerCalculationSettings from "../components/PrayerCalculationSettings";

const PrayerTimesSettings = () => {
  const navigate = useNavigate();
  
  const {
    settings: appSettings,
    requestLocationPermission: requestAppLocationPermission,
    updateLocationSettings,
  } = useAppSettings();

  const { t } = useTranslation(appSettings.language);
  const { toast } = useToast();

  const [advancedPrayerOpen, setAdvancedPrayerOpen] = useState(false);
  // State for manual location input
  const [manualCity, setManualCity] = useState("");
  const [manualGovernorate, setManualGovernorate] = useState("");
  const [manualCountry, setManualCountry] = useState("");
  const [isManualGeocodingLoading, setIsManualGeocodingLoading] = useState(false);
  // State for automatic location loading and error
  const [isIpLocationLoading, setIsIpLocationLoading] = useState(false);
  const [ipLocationError, setIpLocationError] = useState<string | null>(null);

  // Define calculation methods display names here for the dropdown
  const prayerCalculationMethods = [
    'أم القرى',
    'رابطة العالم الإسلامي',
    'الهيئة المصرية',
    'كراتشي',
    'أمريكا الشمالية (ISNA)',
    'دبي',
    'قطر',
    'الكويت',
    'لجنة رؤية الهلال',
    'سنغافورة',
    'تركيا (ديانت)',
    'طهران',
  ];

  // Function to handle automatic location detection (GPS/IP)
  const handleAutomaticLocation = async () => {
    setIsIpLocationLoading(true);
    setIpLocationError(null);
    
    console.log("Attempting automatic location detection...");
    const success = await requestAppLocationPermission();
    
    setIsIpLocationLoading(false);
    
    if (success) {
      toast({
        title: appSettings.language === "ar" ? "تم تحديد الموقع" : "Location Set",
        description: appSettings.language === "ar" ? "تم تحديد موقعك بنجاح" : "Your location has been set successfully",
      });
    } else {
      setIpLocationError(appSettings.language === "ar" ? "فشل في تحديد الموقع تلقائياً" : "Failed to detect location automatically");
    }
  };

  // Function to handle manual location input and geocoding
  const handleManualLocation = async () => {
    if (!manualCity || !manualCountry) {
      toast({
        title: appSettings.language === "ar" ? "خطأ في الإدخال" : "Input Error",
        description: appSettings.language === "ar" ? "الرجاء إدخال اسم المدينة والدولة على الأقل." : "Please enter at least city and country name.",
        variant: "destructive"
      });
      return;
    }

    setIsManualGeocodingLoading(true);

    try {
      const coordinates = await getCoordinatesFromCity(manualCity, manualCountry, appSettings.language);
      
      if (coordinates) {
        updateLocationSettings({
          city: manualCity,
          governorate: manualGovernorate || appSettings.location.governorate,
          country: manualCountry,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        });

        const locationDisplay = manualGovernorate
          ? `${manualCity}, ${manualGovernorate}, ${manualCountry}`
          : `${manualCity}, ${manualCountry}`;

        toast({
          title: appSettings.language === "ar" ? "تم تحديث الموقع يدوياً" : "Location Updated Manually",
          description: appSettings.language === "ar" ? `تم تغيير الموقع إلى ${locationDisplay}` : `Location changed to ${locationDisplay}`
        });

        // Clear the input fields after successful update
        setManualCity("");
        setManualGovernorate("");
        setManualCountry("");
      }
    } catch (error) {
      console.error("Error during manual location setting:", error);
    } finally {
      setIsManualGeocodingLoading(false);
    }
  };

  // Function to get coordinates from city and country name using Nominatim API
  const getCoordinatesFromCity = async (city: string, country: string, lang: 'ar' | 'en'): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&limit=1&accept-language=${lang}`
      );
      if (!response.ok) {
        throw new Error(`Geocoding request failed with status ${response.status}`);
      }
      const data: Array<{ lat: string; lon: string }> = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        toast({
          title: lang === 'ar' ? "لم يتم العثور على الموقع" : "Location Not Found",
          description: lang === 'ar' ? "لم نتمكن من العثور على إحداثيات للمدينة والدولة المدخلة." : "Could not find coordinates for the entered city and country.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error("Error getting coordinates:", error);
      toast({
        title: lang === 'ar' ? "خطأ في جلب الإحداثيات" : "Error Fetching Coordinates",
        description: lang === 'ar' ? "حدث خطأ أثناء محاولة تحديد الموقع يدوياً." : "An error occurred while trying to determine the location manually.",
        variant: "destructive"
      });
      return null;
    }
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
          {appSettings.language === "ar" ? "التاريخ ومواقيت الصلاة" : "Date & Prayer Times"}
        </h1>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        {/* Current Location Display */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-arabic text-base text-foreground">{t('location')}</h3>
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 text-center">
            <p className="text-sm text-muted-foreground mb-1">{t('currentCity')}</p>
            <p className="font-arabic text-foreground">{appSettings.location.city}, {appSettings.location.country}</p>
            
            {/* Display loading/error states for automatic location */}
            {isIpLocationLoading && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center">
                <Loader2 className="w-4 h-4 mr-1 rtl:ml-1 animate-spin" />
                {appSettings.language === "ar" ? "جاري تحديد الموقع..." : "Detecting location..."}
              </p>
            )}
            {ipLocationError && (
              <p className="text-xs text-destructive mt-1">{ipLocationError}</p>
            )}
            
            <button
              onClick={handleAutomaticLocation}
              disabled={isIpLocationLoading}
              className="mt-2 text-xs text-primary px-3 py-1 rounded-md border border-primary/30 bg-primary/10 hover:bg-primary/20 disabled:opacity-50"
            >
              {appSettings.language === "ar" ? "تحديد الموقع تلقائياً" : "Detect Location Automatically"}
            </button>
          </div>
        </div>

        {/* Manual Location Input */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-arabic text-base text-foreground">
                {appSettings.language === "ar" ? "إدخال الموقع يدوياً" : "Manual Location Input"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {appSettings.language === "ar" ? "أدخل المدينة والمحافظة والدولة للحصول على دقة أفضل" : "Enter city, governorate, and country for better accuracy"}
              </p>
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-3">
            <div className="mb-3">
              <Label htmlFor="manual-city" className="text-sm text-muted-foreground mb-1 block">
                {appSettings.language === "ar" ? "المدينة *" : "City *"}
              </Label>
              <Input
                id="manual-city"
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                placeholder={appSettings.language === "ar" ? "مثال: القاهرة" : "e.g. Cairo"}
                className="bg-background text-foreground"
                dir={appSettings.language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor="manual-governorate" className="text-sm text-muted-foreground mb-1 block">
                {appSettings.language === "ar" ? "المحافظة / المنطقة" : "Governorate / Region"}
              </Label>
              <Input
                id="manual-governorate"
                value={manualGovernorate}
                onChange={(e) => setManualGovernorate(e.target.value)}
                placeholder={appSettings.language === "ar" ? "مثال: محافظة القاهرة" : "e.g. Cairo Governorate"}
                className="bg-background text-foreground"
                dir={appSettings.language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor="manual-country" className="text-sm text-muted-foreground mb-1 block">
                {appSettings.language === "ar" ? "الدولة *" : "Country *"}
              </Label>
              <Input
                id="manual-country"
                value={manualCountry}
                onChange={(e) => setManualCountry(e.target.value)}
                placeholder={appSettings.language === "ar" ? "مثال: مصر" : "e.g. Egypt"}
                className="bg-background text-foreground"
                dir={appSettings.language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <Button
              onClick={handleManualLocation}
              disabled={isManualGeocodingLoading}
              className="w-full"
            >
              {isManualGeocodingLoading ? (
                <Loader2 className="w-4 h-4 mr-2 rtl:ml-2 animate-spin" />
              ) : (
                <SettingsIcon className="w-4 h-4 mr-2 rtl:ml-2" />
              )}
              {appSettings.language === "ar" ? "تحديد الموقع يدوياً" : "Set Location Manually"}
            </Button>
          </div>
        </div>

        {/* Prayer Calculation Settings */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
            <Calculator className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-arabic text-base text-foreground">{t('prayerCalculationMethod')}</h3>
            </div>
          </div>

          {/* Basic Method Selection */}
          <Select
            value={appSettings.location.method}
            onValueChange={(value) => updateLocationSettings({ method: value })}
            dir={appSettings.language === 'ar' ? 'rtl' : 'ltr'}
          >
            <SelectTrigger className="w-full bg-card border border-border">
              <SelectValue placeholder={t('selectCalculationMethod')} />
            </SelectTrigger>
            <SelectContent>
              {prayerCalculationMethods.map((methodName) => (
                <SelectItem key={methodName} value={methodName}>
                  {methodName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="text-xs text-muted-foreground mt-2 px-1 mb-4">
            {appSettings.language === 'ar'
              ? "اختر طريقة الحساب الأنسب لمنطقتك للحصول على أدق مواقيت."
              : "Choose the calculation method most suitable for your region for accurate times."}
          </p>

          {/* Advanced Prayer Calculation Settings */}
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setAdvancedPrayerOpen(!advancedPrayerOpen)}
            >
              <Calculator className="w-4 h-4 mr-2 rtl:ml-2" />
              {appSettings.language === "ar" ? "الإعدادات المتقدمة لحساب مواقيت الصلاة" : "Advanced Prayer Calculation Settings"}
            </Button>

            {advancedPrayerOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-4"
              >
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground">
                    {appSettings.language === "ar"
                      ? "هذه الإعدادات تتيح لك تخصيص حساب مواقيت الصلاة بدقة أكبر. يمكنك اختيار المذهب الفقهي، وتعديل الأوقات يدوياً، وضبط قواعد العروض العالية."
                      : "These settings allow you to customize prayer time calculations with greater precision. You can choose the jurisprudential school, manually adjust times, and set high latitude rules."
                    }
                  </p>
                </div>
                <PrayerCalculationSettings />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesSettings;
