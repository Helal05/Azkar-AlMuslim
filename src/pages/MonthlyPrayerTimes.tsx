import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Moon, Sun, ChevronDown } from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useTranslation } from "../utils/translations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculatePrayerTimes, formatPrayerTime, PrayerCalculationParams } from "../utils/adhanUtils"; // Import calculation functions
import { convertToHijri, toArabicNumerals, HijriDate } from "../utils/hijriUtils"; // Import Hijri functions
import { format, getMonth, getYear } from "date-fns"; // Import date-fns functions

interface PrayerDay {
  date: string;
  hijriDate: string;
  weekday: string;
  prayers: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  isToday?: boolean;
}

const MonthlyPrayerTimes = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const { t } = useTranslation(settings.language);
  
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [showMonthSelect, setShowMonthSelect] = useState<boolean>(false); // Keep for Gregorian month selection
  const [prayerDays, setPrayerDays] = useState<PrayerDay[]>([]);
  
  // Gregorian month names
  const gregorianMonths = {
    ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  };

  // Arabic weekday names (keep)
  const weekdayNames = {
    ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  };
  
  // Format time to display properly based on language
  const formatTime = (time: string) => {
    return settings.language === "ar" ? time : time.replace(/[٠-٩]/g, d => String("0123456789".indexOf(d)));
  };
  
  // Generate prayer times for the month
  const generateMonthPrayerTimes = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    const todayDate = today.getDate();
    
    const daysList: PrayerDay[] = [];
    
    // Get calculation parameters from settings
    const prayerParams: Partial<PrayerCalculationParams> = {
      method: settings.location.method, // Use method from settings
      // Add other params like madhab, highLatitudeRule if they are in settings
    };

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const weekdayIndex = date.getDay();
      
      // Calculate actual prayer times
      const times = calculatePrayerTimes(
        date, 
        settings.location.latitude, 
        settings.location.longitude, 
        prayerParams
      );
      
      // Get Hijri date
      const hijriDateInfo = convertToHijri(date, settings.language);
      
      // Format Gregorian date display
      const gregorianDayStr = settings.language === "ar" ? toArabicNumerals(day) : day.toString();
      const gregorianMonthStr = settings.language === "ar" ? toArabicNumerals(currentMonth + 1) : (currentMonth + 1).toString();
      const gregorianYearStr = settings.language === "ar" ? toArabicNumerals(currentYear) : currentYear.toString();
      const gregorianDateDisplay = `${gregorianDayStr}/${gregorianMonthStr}/${gregorianYearStr}`;

      // Format Hijri date display
      const hijriDateDisplay = `${hijriDateInfo.day} ${hijriDateInfo.month}`; // Show day and month name

      daysList.push({
        date: gregorianDateDisplay,
        hijriDate: hijriDateDisplay,
        weekday: settings.language === "ar" ? weekdayNames.ar[weekdayIndex] : weekdayNames.en[weekdayIndex],
        prayers: {
          fajr: formatPrayerTime(times.fajr, settings.language),
          sunrise: formatPrayerTime(times.sunrise, settings.language),
          dhuhr: formatPrayerTime(times.dhuhr, settings.language),
          asr: formatPrayerTime(times.asr, settings.language),
          maghrib: formatPrayerTime(times.maghrib, settings.language),
          isha: formatPrayerTime(times.isha, settings.language)
        },
        isToday: currentMonth === todayMonth && currentYear === todayYear && day === todayDate
      });
    }
    
    setPrayerDays(daysList);
  };
  
  useEffect(() => {
    generateMonthPrayerTimes();
  }, [currentMonth, currentYear, settings.language, settings.location]); // Update dependencies
  
  // Switch to previous month (Gregorian)
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // Switch to next month (Gregorian)
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Select a specific Gregorian month
  const selectGregorianMonth = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
    setShowMonthSelect(false);
  };
  
  // Get Gregorian month name based on current language
  const getMonthName = () => {
    return gregorianMonths[settings.language][currentMonth];
  };

  // Get Gregorian year display
  const getYearDisplay = () => {
    return settings.language === "ar" ? toArabicNumerals(currentYear) : currentYear.toString();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/80 p-4 flex items-center justify-between">
        <button onClick={() => navigate("/prayer-times")} className="p-2">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h2 className="text-lg font-arabic font-bold text-center">
          {settings.language === "ar" 
            ? `مواقيت الصلاة لشهر ${getMonthName()} ${getYearDisplay()}` 
            : `Prayer Times for ${getMonthName()} ${getYearDisplay()}`}
        </h2>
        <div className="w-5"></div> {/* Empty div for alignment */}
      </div>
      
      {/* Month selection controls */}
      <div className="bg-slate-800/50 p-3 flex justify-between items-center">
        <button 
          onClick={prevMonth}
          className="p-2 bg-slate-700/50 rounded-full"
        >
          <ChevronLeft className="w-5 h-5 text-amber-400" />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowMonthSelect(!showMonthSelect)}
            className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-700/50 px-4 py-2 rounded-lg"
          >
            <span className="font-arabic text-amber-400">{getMonthName()} {getYearDisplay()}</span>
            <ChevronDown className="w-4 h-4 text-amber-400" />
          </button>
          
          {/* Gregorian Month dropdown */}
          {showMonthSelect && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto w-48">
              {gregorianMonths[settings.language].map((monthName, index) => (
                <button
                  key={index}
                  onClick={() => selectGregorianMonth(index)}
                  className={`w-full text-start px-4 py-3 hover:bg-slate-700 transition-colors ${
                    currentMonth === index ? 'bg-amber-900/30 text-amber-400' : ''
                  }`}
                >
                  <span className="font-arabic">{monthName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button 
          onClick={nextMonth}
          className="p-2 bg-slate-700/50 rounded-full"
        >
          <ChevronRight className="w-5 h-5 text-amber-400" />
        </button>
      </div>
      
      {/* Prayer times table */}
      <div className="flex-1 p-2 overflow-y-auto">
        <div className="rounded-lg overflow-hidden">
          {prayerDays.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`mb-2 rounded-lg ${day.isToday 
                ? 'bg-amber-900/30 border border-amber-600/50' 
                : 'bg-slate-800/50'}`}
            >
              {/* Day header */}
              <div className="flex justify-between items-center p-3 border-b border-slate-700/50">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm text-white/70">{day.weekday}</span>
                  {day.isToday && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                      {settings.language === "ar" ? "اليوم" : "Today"}
                    </span>
                  )}
                </div>
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <span className="text-sm text-white/70">{day.date}</span>
                  <span className="text-sm text-amber-400/80">{day.hijriDate}</span>
                </div>
              </div>
              
              {/* Prayer times */}
              <div className="grid grid-cols-6 p-2 text-center">
                <div className="p-2">
                  <div className="text-xs text-white/70 mb-1">
                    {settings.language === "ar" ? "الفجر" : "Fajr"}
                  </div>
                  <div className="text-sm font-semibold">{day.prayers.fajr}</div>
                </div>
                <div className="p-2">
                  <div className="text-xs text-white/70 mb-1">
                    {settings.language === "ar" ? "الشروق" : "Sunrise"}
                  </div>
                  <div className="text-sm font-semibold">{day.prayers.sunrise}</div>
                </div>
                <div className="p-2">
                  <div className="text-xs text-white/70 mb-1">
                    {settings.language === "ar" ? "الظهر" : "Dhuhr"}
                  </div>
                  <div className="text-sm font-semibold">{day.prayers.dhuhr}</div>
                </div>
                <div className="p-2">
                  <div className="text-xs text-white/70 mb-1">
                    {settings.language === "ar" ? "العصر" : "Asr"}
                  </div>
                  <div className="text-sm font-semibold">{day.prayers.asr}</div>
                </div>
                <div className="p-2">
                  <div className="text-xs text-white/70 mb-1">
                    {settings.language === "ar" ? "المغرب" : "Maghrib"}
                  </div>
                  <div className="text-sm font-semibold">{day.prayers.maghrib}</div>
                </div>
                <div className="p-2">
                  <div className="text-xs text-white/70 mb-1">
                    {settings.language === "ar" ? "العشاء" : "Isha"}
                  </div>
                  <div className="text-sm font-semibold">{day.prayers.isha}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyPrayerTimes;
