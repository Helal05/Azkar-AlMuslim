
import { format } from 'date-fns';
import { calculatePrayerTimes, formatPrayerTime } from '../utils/adhanUtils';
import { getCurrentHijriDate, getHijriDateForGregorian, toArabicNumerals } from '../utils/hijriUtils';
import { getCompleteLocationData } from '../utils/locationUtils';

export interface PrayerTime {
  name: string;
  time: string;
  isNext?: boolean;
}

export interface IslamicDate {
  day: string;
  month: string;
  year: string;
  dayOfWeek: string;
  gregorianDate: string;
  monthNumber?: number;
  dayNumber?: number;
  yearNumber?: number;
}

export interface ForbiddenPrayerTime {
  description: string;
  timeRange: string;
  descriptionEn?: string;
  timeRangeEn?: string;
}

export interface LocationInfo {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

// toArabicNumerals is now imported from hijriUtils.ts

// formatArabicTime and formatEnglishTime are now imported from adhanUtils.ts

export const getCurrentIslamicDate = (language: string = 'ar'): IslamicDate => {
  // Use the hijri-js library through our utility function
  return getCurrentHijriDate(language);
};

// Get location information for the user
export const getUserLocation = async (): Promise<LocationInfo> => {
  try {
    const locationData = await getCompleteLocationData();
    return locationData;
  } catch (error) {
    console.error('Error getting user location:', error);
    // Return default location (Makkah)
    return {
      city: 'مكة المكرمة',
      country: 'المملكة العربية السعودية',
      latitude: 21.3891,
      longitude: 39.8579
    };
  }
};

// Calculate prayer times based on coordinates using enhanced adhan library
export const getPrayerTimes = (
  latitude: number,
  longitude: number,
  method: string, // Added method parameter
  language: string = 'ar',
  options?: {
    madhab?: 'Shafi' | 'Hanafi';
    elevation?: number;
    adjustments?: {
      fajr?: number;
      sunrise?: number;
      dhuhr?: number;
      asr?: number;
      maghrib?: number;
      isha?: number;
    };
  }
): PrayerTime[] => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Use our enhanced utility function to calculate prayer times with the provided method and options
  const calculationOptions: any = {
    method,
    madhab: options?.madhab,
    elevation: options?.elevation
  };

  // Add adjustments if provided
  if (options?.adjustments) {
    calculationOptions.adjustments = {
      fajr: options.adjustments.fajr || 0,
      sunrise: options.adjustments.sunrise || 0,
      dhuhr: options.adjustments.dhuhr || 0,
      asr: options.adjustments.asr || 0,
      maghrib: options.adjustments.maghrib || 0,
      isha: options.adjustments.isha || 0
    };
  }

  const prayerTimes = calculatePrayerTimes(now, latitude, longitude, calculationOptions);

  // Format prayer times based on language
  const formatTime = (date: Date): string => {
    return formatPrayerTime(date, language);
  };

  // Get midnight and last third of night
  const maghribTime = prayerTimes.maghrib;
  const fajrTime = prayerTimes.fajr;
  const nightDuration = (fajrTime.getTime() - maghribTime.getTime()) + (24 * 60 * 60 * 1000);

  const midnight = new Date(maghribTime.getTime() + (nightDuration / 2));
  const lastThird = new Date(maghribTime.getTime() + (nightDuration * 2 / 3));

  // Prayer names based on language
  const prayerNames = {
    ar: {
      fajr: "الفجر",
      sunrise: "الشروق",
      dhuhr: "الظهر",
      asr: "العصر",
      maghrib: "المغرب",
      isha: "العشاء",
      midnight: "منتصف الليل",
      lastThird: "الثلث الأخير"
    },
    en: {
      fajr: "Fajr",
      sunrise: "Sunrise",
      dhuhr: "Dhuhr",
      asr: "Asr",
      maghrib: "Maghrib",
      isha: "Isha",
      midnight: "Midnight",
      lastThird: "Last Third of Night"
    }
  };

  const names = prayerNames[language] || prayerNames.ar;

  // Create prayer times array with proper formatting
  const formattedPrayerTimes: PrayerTime[] = [
    { name: names.fajr, time: formatTime(prayerTimes.fajr) },
    { name: names.sunrise, time: formatTime(prayerTimes.sunrise) },
    { name: names.dhuhr, time: formatTime(prayerTimes.dhuhr) },
    { name: names.asr, time: formatTime(prayerTimes.asr) },
    { name: names.maghrib, time: formatTime(prayerTimes.maghrib) },
    { name: names.isha, time: formatTime(prayerTimes.isha) },
    { name: names.midnight, time: formatTime(midnight) },
    { name: names.lastThird, time: formatTime(lastThird) }
  ];

  // Find the next prayer time
  const currentTimeMinutes = currentHour * 60 + currentMinute;

  // Convert prayer times to minutes for comparison
  const prayerMinutes = [
    prayerTimes.fajr.getHours() * 60 + prayerTimes.fajr.getMinutes(),
    prayerTimes.sunrise.getHours() * 60 + prayerTimes.sunrise.getMinutes(),
    prayerTimes.dhuhr.getHours() * 60 + prayerTimes.dhuhr.getMinutes(),
    prayerTimes.asr.getHours() * 60 + prayerTimes.asr.getMinutes(),
    prayerTimes.maghrib.getHours() * 60 + prayerTimes.maghrib.getMinutes(),
    prayerTimes.isha.getHours() * 60 + prayerTimes.isha.getMinutes(),
    midnight.getHours() * 60 + midnight.getMinutes(),
    lastThird.getHours() * 60 + lastThird.getMinutes()
  ];

  let nextPrayerIndex = 0;

  // Find the next prayer time
  for (let i = 0; i < prayerMinutes.length; i++) {
    if (prayerMinutes[i] > currentTimeMinutes) {
      nextPrayerIndex = i;
      break;
    }
  }

  // If no prayer time is found, it means we've passed the last prayer of the day
  // So the next prayer is the first prayer of tomorrow
  if (nextPrayerIndex === 0 && currentTimeMinutes > prayerMinutes[prayerMinutes.length - 1]) {
    nextPrayerIndex = 0;
  }

  formattedPrayerTimes[nextPrayerIndex].isNext = true;

  return formattedPrayerTimes;
};

export const getForbiddenPrayerTimes = (): ForbiddenPrayerTime[] => {
  return [
    {
      description: "من طلوع الفجر إلى طلوع الشمس",
      timeRange: "من بعد صلاة الفجر إلى بعد الشروق بثلث ساعة",
      descriptionEn: "After Fajr prayer until the sun rises fully",
      timeRangeEn: "From after Fajr prayer until about 15-20 minutes after sunrise"
    },
    {
      description: "ومن طلوع الشمس إلى ارتفاعها قيد رمح",
      timeRange: "ويقدر هذا الوقت باثنتي عشرة دقيقة، والاحتياط جعله ربع ساعة",
      descriptionEn: "When the sun is at its zenith (midday)",
      timeRangeEn: "When the sun is directly overhead until it begins to decline"
    },
    {
      description: "وعند قيام الشمس في الظهيرة حتى تزول عن كبد السماء",
      timeRange: "وقت استواء الشمس في منتصف السماء",
      descriptionEn: "When the sun is at its zenith (midday)",
      timeRangeEn: "When the sun is directly overhead until it begins to decline"
    },
    {
      description: "عندما تميل الشمس للغروب",
      timeRange: "من بعد صلاة العصر إلى غروب الشمس",
      descriptionEn: "When the sun begins to set",
      timeRangeEn: "From after Asr prayer until sunset"
    },
    {
      description: "وعند شروع الشمس في الغروب إلى أن يتم ذلك",
      timeRange: "من بعد صلاة العصر إلى غروب الشمس",
      descriptionEn: "When the sun begins to set",
      timeRangeEn: "From after Asr prayer until sunset"
    },
  ];
};

// Updated to accept location and method
export const getTimeToNextPrayer = (
  latitude: number,
  longitude: number,
  method: string,
  language: string = 'ar',
  includeSeconds: boolean = true
): string => {
  // Call getPrayerTimes with provided location and method
  const prayerTimes = getPrayerTimes(latitude, longitude, method, language);
  const nextPrayer = prayerTimes.find(prayer => prayer.isNext);

  if (!nextPrayer) {
    return language === 'ar' ? "٠٠:٠٠:٠٠" : "00:00:00";
  }

  // Parse the prayer time
  const now = new Date();
  let hour = 0, minute = 0, period = '';

  if (language === 'ar') {
    const prayerTimeStr = nextPrayer.time;
    const timeParts = prayerTimeStr.split(' ');
    period = timeParts[0];
    const timePortion = timeParts[1];
    const [hourStr, minuteStr] = timePortion.split(':');

    // Convert Arabic numerals to standard numerals
    const arabicToEnglish = (str: string) => {
      return str
        .replace(/[٠]/g, '0')
        .replace(/[١]/g, '1')
        .replace(/[٢]/g, '2')
        .replace(/[٣]/g, '3')
        .replace(/[٤]/g, '4')
        .replace(/[٥]/g, '5')
        .replace(/[٦]/g, '6')
        .replace(/[٧]/g, '7')
        .replace(/[٨]/g, '8')
        .replace(/[٩]/g, '9');
    };

    hour = parseInt(arabicToEnglish(hourStr));
    minute = parseInt(arabicToEnglish(minuteStr));
  } else {
    const prayerTimeStr = nextPrayer.time;
    const [timePortion, periodPart] = prayerTimeStr.split(' ');
    period = periodPart;
    const [hourStr, minuteStr] = timePortion.split(':');

    hour = parseInt(hourStr);
    minute = parseInt(minuteStr);
  }

  // Adjust for AM/PM (ص/م)
  if ((period === 'م' || period === 'PM') && hour !== 12) {
    hour += 12;
  } else if ((period === 'ص' || period === 'AM') && hour === 12) {
    hour = 0;
  }

  // Calculate difference from now
  const prayerTime = new Date();
  prayerTime.setHours(hour, minute, 0, 0);

  // If the prayer time is earlier today, it must be for tomorrow
  if (prayerTime < now) {
    prayerTime.setDate(prayerTime.getDate() + 1);
  }

  // Calculate difference in milliseconds
  const diffMs = prayerTime.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  // Convert to appropriate numerals with proper formatting
  if (language === 'ar') {
    if (includeSeconds) {
      return `${toArabicNumerals(hours)}:${minutes < 10 ? `٠${toArabicNumerals(minutes)}` : toArabicNumerals(minutes)}:${seconds < 10 ? `٠${toArabicNumerals(seconds)}` : toArabicNumerals(seconds)}`;
    } else {
      return `${toArabicNumerals(hours)}:${minutes < 10 ? `٠${toArabicNumerals(minutes)}` : toArabicNumerals(minutes)}`;
    }
  } else {
    if (includeSeconds) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  }
};

// Get prayer times for a specific date
export const getPrayerTimesForDate = (
  date: Date,
  latitude: number,
  longitude: number,
  method: string, // Added method parameter
  language: string = 'ar'
): PrayerTime[] => {
  // Use our utility function to calculate prayer times for the specific date with the provided method
  const prayerTimes = calculatePrayerTimes(date, latitude, longitude, { method });

  // Format prayer times based on language
  const formatTime = (date: Date): string => {
    return formatPrayerTime(date, language);
  };

  // Prayer names based on language
  const prayerNames = {
    ar: {
      fajr: "الفجر",
      sunrise: "الشروق",
      dhuhr: "الظهر",
      asr: "العصر",
      maghrib: "المغرب",
      isha: "العشاء"
    },
    en: {
      fajr: "Fajr",
      sunrise: "Sunrise",
      dhuhr: "Dhuhr",
      asr: "Asr",
      maghrib: "Maghrib",
      isha: "Isha"
    }
  };

  const names = prayerNames[language] || prayerNames.ar;

  // Create prayer times array with proper formatting
  const formattedPrayerTimes: PrayerTime[] = [
    { name: names.fajr, time: formatTime(prayerTimes.fajr) },
    { name: names.sunrise, time: formatTime(prayerTimes.sunrise) },
    { name: names.dhuhr, time: formatTime(prayerTimes.dhuhr) },
    { name: names.asr, time: formatTime(prayerTimes.asr) },
    { name: names.maghrib, time: formatTime(prayerTimes.maghrib) },
    { name: names.isha, time: formatTime(prayerTimes.isha) }
  ];

  return formattedPrayerTimes;
};

// Get Hijri date for a specific date
export const getIslamicDateForDate = (date: Date = new Date(), language: string = 'ar'): IslamicDate => {
  return getHijriDateForGregorian(date, language);
};

/**
 * Get prayer times with settings from AppSettings context
 * This function automatically applies adjustments, madhab, and other settings
 */
export const getPrayerTimesWithSettings = (
  latitude: number,
  longitude: number,
  method: string,
  language: string = 'ar',
  settings?: {
    madhab?: 'Shafi' | 'Hanafi';
    elevation?: number;
    adjustments?: {
      fajr?: number;
      sunrise?: number;
      dhuhr?: number;
      asr?: number;
      maghrib?: number;
      isha?: number;
    };
  }
): PrayerTime[] => {
  return getPrayerTimes(latitude, longitude, method, language, settings);
};

/**
 * Get time to next prayer with settings applied
 */
export const getTimeToNextPrayerWithSettings = (
  latitude: number,
  longitude: number,
  method: string,
  language: string = 'ar',
  includeSeconds: boolean = true,
  settings?: {
    madhab?: 'Shafi' | 'Hanafi';
    elevation?: number;
    adjustments?: {
      fajr?: number;
      sunrise?: number;
      dhuhr?: number;
      asr?: number;
      maghrib?: number;
      isha?: number;
    };
  }
): string => {
  // Call getPrayerTimes with settings applied
  const prayerTimes = getPrayerTimes(latitude, longitude, method, language, settings);
  const nextPrayer = prayerTimes.find(prayer => prayer.isNext);

  if (!nextPrayer) {
    return language === 'ar' ? "٠٠:٠٠:٠٠" : "00:00:00";
  }

  // Parse the prayer time
  const now = new Date();
  let hour = 0, minute = 0, period = '';

  if (language === 'ar') {
    const prayerTimeStr = nextPrayer.time;
    const timeParts = prayerTimeStr.split(' ');
    period = timeParts[0];
    const timePortion = timeParts[1];
    const [hourStr, minuteStr] = timePortion.split(':');

    // Convert Arabic numerals to standard numerals
    const arabicToEnglish = (str: string) => {
      return str
        .replace(/[٠]/g, '0')
        .replace(/[١]/g, '1')
        .replace(/[٢]/g, '2')
        .replace(/[٣]/g, '3')
        .replace(/[٤]/g, '4')
        .replace(/[٥]/g, '5')
        .replace(/[٦]/g, '6')
        .replace(/[٧]/g, '7')
        .replace(/[٨]/g, '8')
        .replace(/[٩]/g, '9');
    };

    hour = parseInt(arabicToEnglish(hourStr));
    minute = parseInt(arabicToEnglish(minuteStr));
  } else {
    const prayerTimeStr = nextPrayer.time;
    const [timePortion, periodPart] = prayerTimeStr.split(' ');
    period = periodPart;
    const [hourStr, minuteStr] = timePortion.split(':');

    hour = parseInt(hourStr);
    minute = parseInt(minuteStr);
  }

  // Adjust for AM/PM (ص/م)
  if ((period === 'م' || period === 'PM') && hour !== 12) {
    hour += 12;
  } else if ((period === 'ص' || period === 'AM') && hour === 12) {
    hour = 0;
  }

  // Calculate difference from now
  const prayerTime = new Date();
  prayerTime.setHours(hour, minute, 0, 0);

  // If the prayer time is earlier today, it must be for tomorrow
  if (prayerTime < now) {
    prayerTime.setDate(prayerTime.getDate() + 1);
  }

  // Calculate difference in milliseconds
  const diffMs = prayerTime.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  // Convert to appropriate numerals with proper formatting
  if (language === 'ar') {
    if (includeSeconds) {
      return `${toArabicNumerals(hours)}:${minutes < 10 ? `٠${toArabicNumerals(minutes)}` : toArabicNumerals(minutes)}:${seconds < 10 ? `٠${toArabicNumerals(seconds)}` : toArabicNumerals(seconds)}`;
    } else {
      return `${toArabicNumerals(hours)}:${minutes < 10 ? `٠${toArabicNumerals(minutes)}` : toArabicNumerals(minutes)}`;
    }
  } else {
    if (includeSeconds) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  }
};
