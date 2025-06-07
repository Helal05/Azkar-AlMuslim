import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Geolocation, Position } from '@capacitor/geolocation'; // Re-enabled Capacitor Geolocation
// import type { Position } from '@capacitor/geolocation'; // Type is now imported directly with Geolocation
import { useToast } from "@/hooks/use-toast";
import { schedulePrayerNotifications } from "../utils/notifications";
import { getTranslation } from "../utils/translations";
import * as adhan from 'adhan'; // Import adhan library
import { getCalculationParams, getRecommendedCalculationMethod, getPrayerTimesWithAdjustments } from '../utils/prayerTimes'; // Import calculation helpers
import { useAlert } from "../alert-system/contexts/alert-context";

// --- Interfaces ---
export interface AppSettings {
  location: {
    country: string;
    governorate: string;
    city: string;
    latitude: number;
    longitude: number;
    method: string;
    madhab: 'Shafi' | 'Hanafi'; // Added madhab for Asr calculation
    highLatitudeRule: string; // Added high latitude rule for extreme latitudes
    elevation: number; // Added elevation for more accurate calculations
    adjustments: { // Added manual adjustments for prayer times
      fajr: number;
      sunrise: number;
      dhuhr: number;
      asr: number;
      maghrib: number;
      isha: number;
    };
  };
  notifications: {
    enabled: boolean; // Keep global enable/disable? Or remove if handled entirely by AlertContext? Keep for now.
    azkarReminders: boolean; // Keep if used for something other than scheduling prayer/iqama/azkar notifications handled by AlertContext
    // adhanSound: boolean; // Removed - Handled by AlertContext per alert
    // iqamahSound: boolean; // Removed - Handled by AlertContext per alert (iqamaEnabled)
  };
  appearance: {
    darkMode: boolean;
    fontSize: number;
    lightThemeColor: string;
    enableAzkarAlerts: boolean; // Added setting for Azkar sound alerts
  };
  language: "ar" | "en";
  favorites: string[]; // Array of Zikr IDs (e.g., "morning_1", "evening_5")
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateLocationSettings: (locationData: Partial<AppSettings["location"]>) => void;
  updateNotificationSettings: (notificationData: Partial<AppSettings["notifications"]>) => void;
  updateAppearanceSettings: (appearanceData: Partial<AppSettings["appearance"]>) => void;
  updateLanguage: (language: "ar" | "en") => void;
  toggleDarkMode: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  requestLocationPermission: () => Promise<boolean>;
  // Favorites functions
  favorites: string[];
  addFavorite: (zikrId: string) => void;
  removeFavorite: (zikrId: string) => void;
  isFavorite: (zikrId: string) => boolean;
  // Add prayer times data and loading state
  prayerTimesData: Partial<Record<keyof adhan.PrayerTimes, Date>>;
  isLoadingPrayerTimes: boolean;
}

// --- Default Settings ---
const defaultSettings: AppSettings = {
  location: {
    country: "المملكة العربية السعودية",
    governorate: "منطقة مكة المكرمة",
    city: "مكة المكرمة",
    latitude: 21.3891,
    longitude: 39.8579,
    method: "UmmAlQura",
    madhab: "Shafi", // Default to Shafi madhab
    highLatitudeRule: "MiddleOfTheNight", // Default high latitude rule
    elevation: 0, // Default elevation (sea level)
    adjustments: { // Default no adjustments
      fajr: 0,
      sunrise: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0
    }
  },
  notifications: {
    enabled: true, // تفعيل افتراضياً
    azkarReminders: true, // تفعيل افتراضياً
    // adhanSound: false, // Removed
    // iqamahSound: false, // Removed
  },
  appearance: {
    darkMode: false,
    fontSize: 100,
    lightThemeColor: '#f5f5f5',
    enableAzkarAlerts: true // تفعيل افتراضياً
  },
  language: "ar",
  favorites: [] // Default empty favorites
};

// --- Context ---
const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

// --- Provider Component ---
export const AppSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { settings: alertSettings } = useAlert();
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Original localStorage loading logic:
    // Load initial settings from localStorage or use defaults
    const savedSettings = localStorage.getItem("azkar-app-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Ensure favorites is always an array and merge with defaults carefully
        const mergedSettings = {
          ...defaultSettings,
          ...parsed,
          location: { ...defaultSettings.location, ...(parsed.location || {}) },
          notifications: { ...defaultSettings.notifications, ...(parsed.notifications || {}) },
          appearance: { ...defaultSettings.appearance, ...(parsed.appearance || {}) },
          favorites: Array.isArray(parsed.favorites) ? parsed.favorites : []
        };
        return mergedSettings;
      } catch (error) {
        console.error("Error parsing saved settings:", error);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });
  // State for calculated prayer times (Date objects)
  const [prayerTimesData, setPrayerTimesData] = useState<Partial<Record<keyof adhan.PrayerTimes, Date>>>({});
  const [isLoadingPrayerTimes, setIsLoadingPrayerTimes] = useState(true);


  // --- Effects ---
  // Effect to apply theme and font size on load and when they change
  useEffect(() => {
    if (settings.appearance.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    document.documentElement.style.fontSize = `${settings.appearance.fontSize}%`;
  }, [settings.appearance.darkMode, settings.appearance.fontSize]);

  // Effect to save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("azkar-app-settings", JSON.stringify(settings));
  }, [settings]);

  // Effect for location fetching using Capacitor Geolocation
  useEffect(() => {
    const fetchInitialLocation = async () => {
      // Requires Capacitor Geolocation setup
      try {
        // Check permissions silently first
        const permissions = await Geolocation.checkPermissions();
        if (permissions.location === 'granted' || permissions.coarseLocation === 'granted') {
          const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 20000, // Increased timeout for better accuracy
            maximumAge: 0 // Always get fresh location
          });
          handlePositionSuccess(position);
        } else {
           console.log("Initial location permission not granted. Will request on user action.");
           // Optionally, prompt user or wait for manual trigger via requestLocationPermission
        }
      } catch (error: any) {
        handlePositionError(error);
      }
    };

    fetchInitialLocation(); // Call it on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Effect to calculate prayer times when location/method changes
  useEffect(() => {
    const calculateTimes = () => {
      const { latitude, longitude, method, madhab, highLatitudeRule, adjustments } = settings.location;
      if (typeof latitude !== 'number' || isNaN(latitude) || typeof longitude !== 'number' || isNaN(longitude) || !method) {
        console.error("AppSettingsContext: Invalid location/method settings for prayer time calculation.");
        setPrayerTimesData({}); // Clear previous times on error
        setIsLoadingPrayerTimes(false);
        return;
      }

      console.log(`AppSettingsContext: Calculating prayer times for lat=${latitude}, lon=${longitude}, method=${method}, madhab=${madhab}`);
      setIsLoadingPrayerTimes(true);
      try {
        // Get calculation parameters with the selected method
        const params = getCalculationParams(method);

        // Set madhab for Asr calculation
        params.madhab = madhab === 'Hanafi' ? adhan.Madhab.Hanafi : adhan.Madhab.Shafi;

        // Set high latitude rule
        switch (highLatitudeRule) {
          case 'MiddleOfTheNight':
            params.highLatitudeRule = adhan.HighLatitudeRule.MiddleOfTheNight;
            break;
          case 'SeventhOfTheNight':
            params.highLatitudeRule = adhan.HighLatitudeRule.SeventhOfTheNight;
            break;
          case 'TwilightAngle':
            params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
            break;
          default:
            params.highLatitudeRule = adhan.HighLatitudeRule.MiddleOfTheNight;
        }

        // Create coordinates with elevation if available
        const coordinates = new adhan.Coordinates(latitude, longitude);
        const date = new Date(); // Calculate for today

        // Calculate prayer times
        const pt = new adhan.PrayerTimes(coordinates, date, params);

        // Apply manual adjustments if any
        const hasAdjustments = Object.values(adjustments).some(value => value !== 0);
        const finalPrayerTimes = hasAdjustments ?
          {
            fajr: adjustments.fajr !== 0 ? new Date(pt.fajr.getTime() + adjustments.fajr * 60000) : pt.fajr,
            sunrise: adjustments.sunrise !== 0 ? new Date(pt.sunrise.getTime() + adjustments.sunrise * 60000) : pt.sunrise,
            dhuhr: adjustments.dhuhr !== 0 ? new Date(pt.dhuhr.getTime() + adjustments.dhuhr * 60000) : pt.dhuhr,
            asr: adjustments.asr !== 0 ? new Date(pt.asr.getTime() + adjustments.asr * 60000) : pt.asr,
            maghrib: adjustments.maghrib !== 0 ? new Date(pt.maghrib.getTime() + adjustments.maghrib * 60000) : pt.maghrib,
            isha: adjustments.isha !== 0 ? new Date(pt.isha.getTime() + adjustments.isha * 60000) : pt.isha,
          } : pt;

        // Store times as Date objects
        setPrayerTimesData({
          fajr: finalPrayerTimes.fajr,
          sunrise: finalPrayerTimes.sunrise,
          dhuhr: finalPrayerTimes.dhuhr,
          asr: finalPrayerTimes.asr,
          maghrib: finalPrayerTimes.maghrib,
          isha: finalPrayerTimes.isha
        });

        // Calculate night times (not directly available in adhan.js)
        const maghribTime = finalPrayerTimes.maghrib.getTime();
        const fajrTime = finalPrayerTimes.fajr.getTime();
        const nightDuration = (fajrTime + 24 * 60 * 60 * 1000 - maghribTime) % (24 * 60 * 60 * 1000);

        // Calculate middle of the night and last third
        const middleOfNight = new Date(maghribTime + nightDuration / 2);
        const lastThird = new Date(maghribTime + nightDuration * 2 / 3);

        console.log("Night times calculated:", {
          middleOfNight,
          lastThird
        });

        console.log("AppSettingsContext: Prayer times calculated:", {
          fajr: finalPrayerTimes.fajr,
          dhuhr: finalPrayerTimes.dhuhr,
          asr: finalPrayerTimes.asr,
          maghrib: finalPrayerTimes.maghrib,
          isha: finalPrayerTimes.isha,
          hasAdjustments
        });

      } catch (error) {
        console.error("AppSettingsContext: Error calculating prayer times:", error);
        setPrayerTimesData({}); // Clear times on error
      } finally {
        setIsLoadingPrayerTimes(false);
      }
    };

    calculateTimes(); // Calculate on initial load and dependency change

    // Set up daily recalculation timer (optional but recommended)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 1, 0, 0); // 1 minute past midnight
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const dailyTimeoutId = setTimeout(() => {
      console.log("AppSettingsContext: Recalculating prayer times (daily timer).");
      calculateTimes(); // Recalculate
      // Set up interval for subsequent days (more robust than nested timeouts)
      const dailyIntervalId = setInterval(() => {
         console.log("AppSettingsContext: Recalculating prayer times (daily interval).");
         calculateTimes();
      }, 24 * 60 * 60 * 1000);
      // Store interval ID to clear it on unmount
      (window as any).__dailyPrayerTimeIntervalId = dailyIntervalId;
    }, msUntilMidnight);

    // Cleanup function
    return () => {
      clearTimeout(dailyTimeoutId);
      const intervalId = (window as any).__dailyPrayerTimeIntervalId;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };

  }, [
    settings.location.latitude,
    settings.location.longitude,
    settings.location.method,
    settings.location.madhab,
    settings.location.highLatitudeRule,
    settings.location.adjustments
  ]); // Recalculate when location or calculation settings change


  // Effect to schedule notifications when relevant settings change (Keep this separate)
  useEffect(() => {
    if (settings.location.latitude && settings.location.longitude && prayerTimesData && Object.keys(prayerTimesData).length > 0) {
      console.log("Settings or prayerTimesData changed, re-scheduling notifications...");

         // نستخدم الآن prayerTimesData الفعلية المحسوبة في هذا السياق
         schedulePrayerNotifications(
            Object.values(prayerTimesData) as any[], // تمرير أوقات الصلاة كـ Array
            alertSettings, // تمرير إعدادات التنبيه
            settings.language
          );
      }
    // تعتمد على settings (للموقع واللغة) و alertSettings (لإعدادات التنبيه) و prayerTimesData (للأوقات الفعلية)
  }, [settings, alertSettings, prayerTimesData]);


  // --- Helper Functions ---
  // Function to handle successful position retrieval (used by useEffect and requestLocationPermission)
  const handlePositionSuccess = (position: Position) => {
    const { latitude, longitude, accuracy, altitude } = position.coords;
    console.log(`Location accuracy: ${accuracy}m, altitude: ${altitude}m`);

    setSettings(prev => {
      const locationChanged = Math.abs(prev.location.latitude - latitude) > 0.001 || Math.abs(prev.location.longitude - longitude) > 0.001;
      const cityInfoMissing = !prev.location.city || prev.location.city === "Unknown City";

      if (locationChanged || cityInfoMissing) {
        console.log("Location updated via Capacitor:", latitude, longitude);
        getCityNameFromCoordinates(latitude, longitude, prev.language);

        // Update location with enhanced data including elevation
        const updatedLocation = {
          ...prev.location,
          latitude,
          longitude,
          elevation: altitude || prev.location.elevation || 0
        };

        // Return new state triggering the notification useEffect
        return { ...prev, location: updatedLocation };
      }
      return prev;
    });
  };

  // Function to handle errors during position retrieval
  const handlePositionError = (error: any) => {
    console.error("Capacitor Geolocation Error:", error);
    let errorMessage = settings.language === "ar"
        ? "لم نتمكن من تحديد موقعك."
        : "Could not determine your location.";

    if (error && error.message) {
        if (error.message.includes("permission was denied")) {
             errorMessage = settings.language === "ar" ? "تم رفض إذن الوصول للموقع." : "Location permission denied.";
        } else if (error.message.includes("location unavailable")) {
             errorMessage = settings.language === "ar" ? "معلومات الموقع غير متاحة حاليًا." : "Location information is unavailable.";
        } else if (error.message.includes("timed out")) {
             errorMessage = settings.language === "ar" ? "انتهت مهلة طلب الموقع." : "Location request timed out.";
        } else {
            errorMessage = error.message;
        }
    }

    toast({
      title: settings.language === "ar" ? "خطأ في تحديد الموقع" : "Location Error",
      description: errorMessage,
      variant: "destructive"
    });
  };

  const getCityNameFromCoordinates = async (latitude: number, longitude: number, lang: 'ar' | 'en') => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=${lang}&addressdetails=1`
      );
      if (!response.ok) {
        throw new Error(`Geocoding request failed with status ${response.status}`);
      }
      const data = await response.json();

      if (data && data.address) {
        const city = data.address.city || data.address.town || data.address.village || data.address.municipality || data.address.suburb || "Unknown City";
        const governorate = data.address.state || data.address.state_district || data.address.county || "Unknown Governorate";
        const country = data.address.country || "Unknown Country";

        console.log(`Fetched location: City: ${city}, Governorate: ${governorate}, Country: ${country}`);

        setSettings(prev => {
          if (prev.location.city !== city || prev.location.governorate !== governorate || prev.location.country !== country) {
            // Auto-select best calculation method based on location
            const recommendedMethod = getRecommendedCalculationMethod(country, latitude, longitude);
            console.log(`Recommended calculation method for ${country}: ${recommendedMethod}`);

            // Return new state triggering the notification useEffect
            return {
              ...prev,
              location: {
                ...prev.location,
                city,
                governorate,
                country,
                latitude,
                longitude,
                method: recommendedMethod // Auto-update method based on location
              }
            };
          }
          return prev;
        });
      } else {
        console.log("Could not find address details for the coordinates.");
         // Update coords even if city name fails, trigger notification update
         setSettings(prev => ({ ...prev, location: { ...prev.location, latitude, longitude } }));
      }
    } catch (error) {
      console.error("Error getting city name:", error);
      toast({
        title: lang === 'ar' ? "خطأ في جلب اسم المدينة" : "Error Fetching City Name",
        description: lang === 'ar' ? "لم نتمكن من تحديد اسم موقعك الحالي." : "We couldn't determine the name of your current location.",
        variant: "destructive"
      });
       // Update coords even if city name fails, trigger notification update
       setSettings(prev => ({ ...prev, location: { ...prev.location, latitude, longitude } }));
    }
  };

  // --- Context Value Functions ---
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateLocationSettings = (locationData: Partial<AppSettings["location"]>) => {
    setSettings(prevSettings => {
      const updatedLocation = { ...prevSettings.location, ...locationData };
      const updatedSettings = { ...prevSettings, location: updatedLocation };
      if (locationData.city && locationData.city !== prevSettings.location.city) {
          toast({
            title: prevSettings.language === "ar" ? "تم تحديث الموقع" : "Location updated",
            description: prevSettings.language === "ar"
              ? `تم تغيير الموقع إلى ${locationData.city}`
              : `Location changed to ${locationData.city}`
          });
      }
      // This state update will trigger the notification useEffect
      return updatedSettings;
    });
  };

  const updateNotificationSettings = (notificationData: Partial<AppSettings["notifications"]>) => {
    setSettings(prev => {
      // Directly merge the incoming changes. The 'enabled' flag is the main control now.
      const updatedNotifications = { ...prev.notifications, ...notificationData };

      console.log("Updated Notification Settings:", updatedNotifications); // Log for debugging

      // This state update will trigger the notification scheduling useEffect
      return { ...prev, notifications: updatedNotifications };
    });
  };

  const updateAppearanceSettings = (appearanceData: Partial<AppSettings["appearance"]>) => {
    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, ...appearanceData }
    }));
  };

  const updateLanguage = (language: "ar" | "en") => {
    setSettings(prev => ({ ...prev, language }));
    toast({
      title: language === "ar" ? "تم تغيير اللغة" : "Language changed",
      description: language === "ar"
        ? "تم تغيير لغة التطبيق إلى العربية"
        : "App language changed to English"
    });
    if (settings.location.latitude && settings.location.longitude) {
        getCityNameFromCoordinates(settings.location.latitude, settings.location.longitude, language);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !settings.appearance.darkMode;
    updateAppearanceSettings({ darkMode: newDarkMode });
    toast({
      title: settings.language === "ar"
        ? `تم تفعيل الوضع ${newDarkMode ? 'الداكن' : 'الفاتح'}`
        : `${newDarkMode ? 'Dark' : 'Light'} mode activated`,
      description: ""
    });
  };

  const increaseFontSize = () => {
    if (settings.appearance.fontSize < 150) {
      updateAppearanceSettings({ fontSize: settings.appearance.fontSize + 10 });
    }
  };

  const decreaseFontSize = () => {
    if (settings.appearance.fontSize > 80) {
      updateAppearanceSettings({ fontSize: settings.appearance.fontSize - 10 });
    }
  };

  // Updated requestLocationPermission to prioritize Capacitor Geolocation and fallback to Web API
  const requestLocationPermission = async (): Promise<boolean> => {
    const isCapacitor = !!(window as any).Capacitor && typeof Geolocation !== 'undefined';
    console.log("Is Capacitor Environment:", isCapacitor);

    if (isCapacitor) {
      console.log("Attempting to use Capacitor Geolocation");
      try {
        let permissions = await Geolocation.checkPermissions();
        if (permissions.location !== 'granted' && permissions.coarseLocation !== 'granted') {
          console.log("Requesting location permission via Capacitor...");
          permissions = await Geolocation.requestPermissions();
        }

        if (permissions.location === 'granted' || permissions.coarseLocation === 'granted') {
          console.log("Capacitor Geolocation permission granted.");
          const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 20000, // Increased timeout for better reliability and accuracy
            maximumAge: 0 // Always get fresh location
          });
          handlePositionSuccess(position);
          toast({ title: settings.language === "ar" ? "تم تحديد موقعك (Capacitor)" : "Location detected (Capacitor)" });
          return true;
        } else {
          console.log("Capacitor Geolocation permission denied. Falling back to Web API if available.");
          // Allow fallback to Web API by not returning false here
        }
      } catch (error: any) {
        // Check if this is the expected "Not implemented on web" error
        if (error && error.message && error.message.includes("Not implemented on web")) {
          console.log("Capacitor Geolocation error:", error.message, "Falling back to Web API if available.");
        } else {
          console.error("Capacitor Geolocation error:", error, "Falling back to Web API if available.");
        }
        // Allow fallback to Web API by not returning false here
      }
    }

    // --- Using Web Geolocation API (Fallback or if not Capacitor or if Capacitor failed) ---
    if ('geolocation' in navigator) {
      console.log("Using Web Geolocation API");
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (webPosition) => {
            const adaptedPosition: Position = {
              timestamp: webPosition.timestamp,
              coords: {
                latitude: webPosition.coords.latitude,
                longitude: webPosition.coords.longitude,
                accuracy: webPosition.coords.accuracy,
                altitudeAccuracy: webPosition.coords.altitudeAccuracy,
                altitude: webPosition.coords.altitude,
                speed: webPosition.coords.speed,
                heading: webPosition.coords.heading,
              }
            };
            handlePositionSuccess(adaptedPosition);
            toast({ title: settings.language === "ar" ? "تم تحديد موقعك (Web)" : "Location detected (Web)" });
            resolve(true);
          },
          (error) => {
            handlePositionError(error); // Use the existing error handler
            resolve(false);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 } // Enhanced web options for better accuracy
        );
      });
    } else {
      console.warn("Geolocation API not available in this environment.");
      toast({
        title: settings.language === "ar" ? "تحديد الموقع غير مدعوم" : "Geolocation Not Supported",
        description: settings.language === "ar" ? "جهازك أو متصفحك لا يدعم تحديد الموقع." : "Your device or browser does not support geolocation.",
        variant: "destructive"
      });
      return Promise.resolve(false);
    }
  };

  // --- Favorites Management ---
  const addFavorite = (zikrId: string) => {
    setSettings(prev => {
      console.log("AppSettingsContext: Attempting to add favorite:", zikrId); // Added log
      if (prev.favorites.includes(zikrId)) {
        console.log("AppSettingsContext: Zikr already in favorites:", zikrId); // Added log
        return prev;
      }
      const updatedFavorites = [...prev.favorites, zikrId];
      console.log("AppSettingsContext: Updated favorites after adding:", updatedFavorites); // Added log
      
      // Save to localStorage immediately
      const updatedSettings = { ...prev, favorites: updatedFavorites };
      localStorage.setItem("azkar-app-settings", JSON.stringify(updatedSettings));
      
      toast({ title: prev.language === "ar" ? "تمت الإضافة للمفضلة" : "Added to Favorites" });
      return updatedSettings;
    });
  };

  const removeFavorite = (zikrId: string) => {
    setSettings(prev => {
      console.log("AppSettingsContext: Attempting to remove favorite:", zikrId); // Added log
      const updatedFavorites = prev.favorites.filter(id => id !== zikrId);
      if (updatedFavorites.length === prev.favorites.length) {
        console.log("AppSettingsContext: Zikr not found in favorites:", zikrId); // Added log
        return prev;
      }
      console.log("AppSettingsContext: Updated favorites after removing:", updatedFavorites); // Added log
      
      // Save to localStorage immediately
      const updatedSettings = { ...prev, favorites: updatedFavorites };
      localStorage.setItem("azkar-app-settings", JSON.stringify(updatedSettings));
      
      toast({ title: prev.language === "ar" ? "تمت الإزالة من المفضلة" : "Removed from Favorites" });
      return updatedSettings;
    });
  };

  const isFavorite = (zikrId: string): boolean => {
    const result = settings.favorites.includes(zikrId);
    console.log(`AppSettingsContext: Checking if ${zikrId} is favorite: ${result}`); // Added log
    return result;
  };

  // --- Context Value ---
  const value = {
    settings,
    updateSettings,
    updateLocationSettings,
    updateNotificationSettings,
    updateAppearanceSettings,
    updateLanguage,
    toggleDarkMode,
    increaseFontSize,
    decreaseFontSize,
    requestLocationPermission,
    // Favorites
    favorites: settings.favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    // Prayer Times Data
    prayerTimesData,
    isLoadingPrayerTimes,
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};

// --- Hook ---
export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};