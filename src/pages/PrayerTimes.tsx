import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ChevronLeft, CalendarDays, MapPin, ChevronRight } from "lucide-react";
import { getCurrentIslamicDate, getPrayerTimesWithSettings, getTimeToNextPrayerWithSettings } from "../data/prayerData";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useTranslation } from "../utils/translations";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { schedulePrayerNotifications } from "../utils/prayerNotifications";
import { useAlert } from "../alert-system/contexts/alert-context";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const PrayerTimes = () => {
  const navigate = useNavigate();
  const { settings, requestLocationPermission } = useAppSettings();
  const { t } = useTranslation(settings.language);
  const { toast } = useToast();
  const { alertSettings } = useAlert();

  // Create settings object with adjustments
  const prayerSettings = {
    madhab: settings.location.madhab,
    elevation: settings.location.elevation,
    adjustments: settings.location.adjustments
  };

  const [islamicDate, setIslamicDate] = useState(getCurrentIslamicDate(settings.language));
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes[]>(getPrayerTimesWithSettings(settings.location.latitude, settings.location.longitude, settings.location.method, settings.language, prayerSettings));
  const [nextPrayerTime, setNextPrayerTime] = useState(getTimeToNextPrayerWithSettings(settings.location.latitude, settings.location.longitude, settings.location.method, settings.language, true, prayerSettings));
  const [gregorianDate, setGregorianDate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [lastCheckedDate, setLastCheckedDate] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date } | null>(null);

  useEffect(() => {
    const today = new Date();
    const dayNames = {
      ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
      en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    };

    setDayOfWeek(settings.language === "ar" ? dayNames.ar[today.getDay()] : dayNames.en[today.getDay()]);

    if (settings.language === "ar") {
      const day = today.getDate().toString().padStart(2, '0');
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const year = today.getFullYear();
      setGregorianDate(`${day}/${month}/${year}`);
    } else {
      setGregorianDate(format(today, 'dd/MM/yyyy'));
    }

    const checkAndUpdateHijriDate = () => {
      const currentDateStr = format(new Date(), 'yyyy-MM-dd');
      if (currentDateStr !== lastCheckedDate) {
        setIslamicDate(getCurrentIslamicDate(settings.language));
        setLastCheckedDate(currentDateStr);
        console.log("Hijri date updated for new day:", currentDateStr);
      }
    };

    checkAndUpdateHijriDate();

    const intervalId = setInterval(checkAndUpdateHijriDate, 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [settings.language, lastCheckedDate]);

  const getNextPrayer = () => {
    const next = prayerTimes.find(prayer => prayer.isNext);
    return next ? next.name : t('fajr');
  };

  useEffect(() => {
    // Update prayer settings when location or language changes
    const updatedPrayerSettings = {
      madhab: settings.location.madhab,
      elevation: settings.location.elevation,
      adjustments: settings.location.adjustments
    };

    setPrayerTimes(getPrayerTimesWithSettings(settings.location.latitude, settings.location.longitude, settings.location.method, settings.language, updatedPrayerSettings));
  }, [settings.location, settings.language]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update prayer settings for countdown
      const updatedPrayerSettings = {
        madhab: settings.location.madhab,
        elevation: settings.location.elevation,
        adjustments: settings.location.adjustments
      };

      setNextPrayerTime(getTimeToNextPrayerWithSettings(settings.location.latitude, settings.location.longitude, settings.location.method, settings.language, true, updatedPrayerSettings));
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.language, settings.location]);

  useEffect(() => {
    const today = new Date().toDateString();
    if (today !== lastCheckedDate) {
      schedulePrayerNotifications(settings, settings.language);
      setLastCheckedDate(today);
    }
  }, [settings, settings.language]);

  const getElapsedOrRemainingTime = () => {
    const nextPrayer = prayerTimes.find(prayer => prayer.isNext);
    if (nextPrayer) {
      return `${nextPrayer.name} ${settings.language === "ar" ? "بعد" : "in"} ${nextPrayerTime}`;
    }
    return "";
  };

  const updateLocation = async () => {
    const success = await requestLocationPermission();
    if (success) {
      toast({
        title: settings.language === "ar" ? "تم تحديث الموقع" : "Location Updated",
        description: settings.language === "ar"
          ? "تم تحديث موقعك ومواقيت الصلاة"
          : "Your location and prayer times have been updated"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col">
      <div className="bg-slate-800/80 p-4 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="p-2">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h2 className="text-xl font-arabic font-bold">{t('prayerTimes')}</h2>
        <div className="w-5"></div>
      </div>

      {/* Date, Location, and Next Prayer Cards */}
      <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Date and Location Card */}
        <div className="bg-slate-800/50 p-4 rounded-lg shadow-md flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center text-left">
              <CalendarDays className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
              <div>
                <p className="text-gray-300 text-sm">{gregorianDate}</p>
                <p className="text-gray-400 text-xs">{dayOfWeek}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-300 text-sm font-arabic">
                {islamicDate.day} {islamicDate.month}
              </p>
              <p className="text-gray-400 text-xs font-arabic">{islamicDate.dayOfWeek}</p>
            </div>
          </div>
          <button
            onClick={updateLocation}
            className="flex items-center justify-center text-center hover:bg-slate-700/50 p-2 rounded-md transition-colors mt-auto"
          >
            <MapPin className="w-4 h-4 text-amber-400 mr-1.5 flex-shrink-0" />
            <p className="text-amber-400 text-sm font-arabic truncate">
              {settings.location.city}{settings.location.governorate && settings.location.governorate !== 'Unknown' ? `, ${settings.location.governorate}` : ''}
            </p>
          </button>
        </div>

        {/* Next Prayer and Countdown Card */}
        <div className="bg-slate-800/50 p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
          <div className="mb-2 text-sm text-gray-400 font-arabic">{t('nextPrayer')}</div>
          <div className="mb-3 text-2xl font-bold text-amber-400 font-arabic">{getNextPrayer()}</div>
          <div className="text-4xl font-bold text-white font-mono">{nextPrayerTime}</div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {prayerTimes.map((prayer, index) => (
            <div
              key={index}
              className={`flex justify-between items-center p-4 rounded-lg ${
                prayer.isNext
                  ? 'bg-amber-900/20 border border-amber-700/50'
                  : 'bg-slate-800/50'
              }`}
            >
              <div className="text-left">
                <span className={`text-xl font-arabic ${
                  prayer.isNext ? 'text-amber-400' : 'text-white'
                }`}>
                  {prayer.time}
                </span>
              </div>

              <div className="text-right">
                <span className={`text-xl font-arabic ${
                  prayer.isNext ? 'text-amber-400' : 'text-white'
                }`}>
                  {settings.language === "ar"
                    ? prayer.name
                    : t(prayer.name.toLowerCase() as any)}
                </span>
                {prayer.isNext && (
                  <div className="flex items-center justify-end text-amber-500 text-sm mt-1">
                    <span className="font-arabic">{t('nextPrayer')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/sunnah-prayers")}
            className="bg-gradient-to-br from-slate-800/60 to-slate-800/20 border border-green-800/30 text-center p-4 rounded-lg"
          >
            <span className="text-green-400 font-arabic text-lg">{t('sunnahPrayers')}</span>
          </button>

          <button
            onClick={() => navigate("/duha-prayer")}
            className="bg-gradient-to-br from-slate-800/60 to-slate-800/20 border border-green-800/30 text-center p-4 rounded-lg"
          >
            <span className="text-green-400 font-arabic text-lg">{t('duhaPrayer')}</span>
          </button>

          <button
            onClick={() => navigate("/forbidden-times")}
            className="bg-gradient-to-br from-slate-800/60 to-slate-800/20 border border-red-800/30 text-center p-4 rounded-lg col-span-2"
          >
            <span className="text-red-400 font-arabic text-lg">{t('forbiddenPrayerTimes')}</span>
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate("/monthly-prayer-times")}
            className="flex items-center justify-between w-full bg-gradient-to-br from-slate-800/60 to-slate-800/20 p-4 rounded-lg border border-amber-800/30"
          >
            <CalendarDays className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-arabic">
              {settings.language === "ar"
                ? "جدول مواقيت الصلاة الشهري"
                : "Monthly Prayer Times Calendar"}
            </span>
            <ChevronRight className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;
