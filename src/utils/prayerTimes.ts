import * as adhan from 'adhan';
import { format, addMinutes, subMinutes } from 'date-fns';
import { ar } from 'date-fns/locale';

/**
 * Prayer calculation methods mapping
 * Mapping of display names to adhan.js method names
 *
 * Each method has different angles for Fajr and Isha:
 * - Muslim World League: Fajr 18°, Isha 17°
 * - Egyptian General Authority: Fajr 19.5°, Isha 17.5°
 * - University of Islamic Sciences, Karachi: Fajr 18°, Isha 18°
 * - Umm al-Qura University, Makkah: Fajr 18.5°, Isha is 90 minutes after Maghrib
 * - Islamic Society of North America (ISNA): Fajr 15°, Isha 15°
 * - Moonsighting Committee: Fajr 18°, Isha 18° (more accurate for many regions)
 */
export const CALCULATION_METHODS: { [key: string]: string } = {
  'أم القرى': 'UmmAlQura',
  'رابطة العالم الإسلامي': 'MuslimWorldLeague',
  'الهيئة المصرية': 'Egyptian',
  'كراتشي': 'Karachi',
  'أمريكا الشمالية (ISNA)': 'NorthAmerica',
  'دبي': 'Dubai',
  'قطر': 'Qatar',
  'الكويت': 'Kuwait',
  'لجنة رؤية الهلال': 'MoonsightingCommittee',
  'سنغافورة': 'Singapore',
  'تركيا (ديانت)': 'Turkey',
  'طهران': 'Tehran',
  'الجزائر': 'Algeria', // Added Algeria method
  'المغرب': 'Morocco', // Added Morocco method
  'فرنسا (UOIF)': 'France', // Added France UOIF method
  'تونس': 'Tunisia', // Added Tunisia method
  'مخصص': 'Other' // For custom settings
};

// Geographic regions for automatic method selection
const GEOGRAPHIC_REGIONS: { [key: string]: string } = {
  // Middle East
  'المملكة العربية السعودية': 'UmmAlQura', // Saudi Arabia
  'الإمارات العربية المتحدة': 'Dubai', // UAE
  'قطر': 'Qatar', // Qatar
  'الكويت': 'Kuwait', // Kuwait
  'البحرين': 'UmmAlQura', // Bahrain
  'عمان': 'UmmAlQura', // Oman
  'اليمن': 'UmmAlQura', // Yemen
  'العراق': 'MuslimWorldLeague', // Iraq
  'سوريا': 'Egyptian', // Syria
  'لبنان': 'Egyptian', // Lebanon
  'الأردن': 'MuslimWorldLeague', // Jordan
  'فلسطين': 'MuslimWorldLeague', // Palestine

  // North Africa
  'مصر': 'Egyptian', // Egypt
  'ليبيا': 'Egyptian', // Libya
  'تونس': 'Tunisia', // Tunisia
  'الجزائر': 'Algeria', // Algeria
  'المغرب': 'Morocco', // Morocco
  'موريتانيا': 'MuslimWorldLeague', // Mauritania
  'السودان': 'Egyptian', // Sudan

  // Asia
  'باكستان': 'Karachi', // Pakistan
  'أفغانستان': 'Karachi', // Afghanistan
  'بنغلاديش': 'Karachi', // Bangladesh
  'الهند': 'Karachi', // India
  'ماليزيا': 'Singapore', // Malaysia
  'إندونيسيا': 'Singapore', // Indonesia
  'سنغافورة': 'Singapore', // Singapore
  'تركيا': 'Turkey', // Turkey
  'إيران': 'Tehran', // Iran

  // Europe & Americas
  'الولايات المتحدة': 'NorthAmerica', // USA
  'كندا': 'NorthAmerica', // Canada
  'المملكة المتحدة': 'MoonsightingCommittee', // UK
  'فرنسا': 'France', // France
  'ألمانيا': 'MoonsightingCommittee', // Germany
  'إسبانيا': 'MoonsightingCommittee', // Spain
  'إيطاليا': 'MoonsightingCommittee', // Italy

  // Default for other regions
  'default': 'MoonsightingCommittee'
};

/**
 * Helper function to get calculation parameters based on method name
 * @param methodName The name of the calculation method
 * @returns Calculation parameters for the specified method
 */
export const getCalculationParams = (methodName: string): adhan.CalculationParameters => {
  const adhanMethodName = CALCULATION_METHODS[methodName] || 'MoonsightingCommittee'; // Default to MoonsightingCommittee if not found

  // Handle custom methods not directly in adhan.js
  switch (adhanMethodName) {
    case 'Other':
      // Return customizable parameters for 'Other'
      const customParams = adhan.CalculationMethod.MuslimWorldLeague();
      // These can be customized based on user preferences
      return customParams;

    case 'Algeria':
      const algeriaParams = adhan.CalculationMethod.MuslimWorldLeague();
      algeriaParams.fajrAngle = 18;
      algeriaParams.ishaAngle = 17;
      return algeriaParams;

    case 'Morocco':
      const moroccoParams = adhan.CalculationMethod.Other();
      moroccoParams.fajrAngle = 19;
      moroccoParams.ishaAngle = 17;
      return moroccoParams;

    case 'Tunisia':
      const tunisiaParams = adhan.CalculationMethod.Other();
      tunisiaParams.fajrAngle = 18;
      tunisiaParams.ishaAngle = 18;
      return tunisiaParams;

    case 'France':
      const franceParams = adhan.CalculationMethod.Other();
      franceParams.fajrAngle = 12;
      franceParams.ishaAngle = 12;
      return franceParams;

    default:
      // Use standard method from adhan.js
      const methodFunction = adhan.CalculationMethod[adhanMethodName as keyof typeof adhan.CalculationMethod];
      if (typeof methodFunction === 'function') {
        return methodFunction();
      }

      // Fallback to MoonsightingCommittee if the method name is invalid
      console.warn(`Invalid calculation method: ${methodName}. Falling back to MoonsightingCommittee.`);
      return adhan.CalculationMethod.MoonsightingCommittee();
  }
};


/**
 * Enhanced prayer times calculation with additional accuracy parameters
 */
interface PrayerCalculationOptions {
  method: string;
  madhab?: 'Shafi' | 'Hanafi';
  highLatitudeRule?: 'MiddleOfTheNight' | 'SeventhOfTheNight' | 'TwilightAngle';
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

/**
 * Get prayer times based on location and method with enhanced accuracy
 * @param latitude Latitude of the location
 * @param longitude Longitude of the location
 * @param options Prayer calculation options including method, madhab, elevation, etc.
 * @param language Language for formatting ('ar' or 'en')
 * @returns Array of prayer times with names and next prayer indicator
 */
const getPrayerTimes = (
  latitude: number,
  longitude: number,
  options: PrayerCalculationOptions | string,
  language: 'ar' | 'en' = 'ar'
) => {
  // Validate coordinates
  if (isNaN(latitude) || isNaN(longitude)) {
    console.error("Invalid coordinates provided to getPrayerTimes:", { latitude, longitude });
    return [];
  }

  // Handle backward compatibility - if options is a string, treat it as method
  const calculationOptions: PrayerCalculationOptions = typeof options === 'string'
    ? { method: options }
    : options;

  const coordinates = new adhan.Coordinates(latitude, longitude);
  const params = getCalculationParams(calculationOptions.method);

  // Apply enhanced settings
  if (calculationOptions.madhab) {
    params.madhab = calculationOptions.madhab === 'Hanafi' ? adhan.Madhab.Hanafi : adhan.Madhab.Shafi;
  }

  if (calculationOptions.highLatitudeRule) {
    switch (calculationOptions.highLatitudeRule) {
      case 'MiddleOfTheNight':
        params.highLatitudeRule = adhan.HighLatitudeRule.MiddleOfTheNight;
        break;
      case 'SeventhOfTheNight':
        params.highLatitudeRule = adhan.HighLatitudeRule.SeventhOfTheNight;
        break;
      case 'TwilightAngle':
        params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
        break;
    }
  }

  // Set elevation if provided (affects sunrise/sunset calculations)
  if (calculationOptions.elevation !== undefined) {
    // Note: adhan.js doesn't directly support elevation, but we can log it for future use
    console.log(`Calculating prayer times with elevation: ${calculationOptions.elevation}m`);
  }

  // Calculate prayer times for today and tomorrow (needed for last third calculation)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  let prayerTimesToday = new adhan.PrayerTimes(coordinates, today, params);
  const prayerTimesTomorrow = new adhan.PrayerTimes(coordinates, tomorrow, params);

  // Apply manual adjustments if provided
  if (calculationOptions.adjustments) {
    const adjustments: PrayerTimeAdjustments = {
      fajr: calculationOptions.adjustments.fajr || 0,
      sunrise: calculationOptions.adjustments.sunrise || 0,
      dhuhr: calculationOptions.adjustments.dhuhr || 0,
      asr: calculationOptions.adjustments.asr || 0,
      maghrib: calculationOptions.adjustments.maghrib || 0,
      isha: calculationOptions.adjustments.isha || 0
    };
    prayerTimesToday = applyPrayerTimeAdjustments(prayerTimesToday, adjustments);
  }

  const formatPrayerTime = (time: Date) => {
    return format(time, language === 'ar' ? 'h:mm a' : 'h:mm a', {
      locale: language === 'ar' ? ar : undefined
    });
  };

  // Calculate Duha time (15 minutes after sunrise by default)
  const duhaTime = calculateDuhaTime(prayerTimesToday.sunrise, prayerTimesToday.dhuhr, 15);

  // Calculate Last Third of the Night
  const lastThirdTime = calculateLastThirdOfNight(prayerTimesToday.maghrib, prayerTimesTomorrow.fajr);

  const prayers = [
    { name: language === 'ar' ? 'الفجر' : 'Fajr', time: formatPrayerTime(prayerTimesToday.fajr), isNext: false },
    { name: language === 'ar' ? 'الشروق' : 'Sunrise', time: formatPrayerTime(prayerTimesToday.sunrise), isNext: false },
    { name: language === 'ar' ? 'الضحى' : 'Duha', time: formatPrayerTime(duhaTime), isNext: false },
    { name: language === 'ar' ? 'الظهر' : 'Dhuhr', time: formatPrayerTime(prayerTimesToday.dhuhr), isNext: false },
    { name: language === 'ar' ? 'العصر' : 'Asr', time: formatPrayerTime(prayerTimesToday.asr), isNext: false },
    { name: language === 'ar' ? 'المغرب' : 'Maghrib', time: formatPrayerTime(prayerTimesToday.maghrib), isNext: false },
    { name: language === 'ar' ? 'العشاء' : 'Isha', time: formatPrayerTime(prayerTimesToday.isha), isNext: false },
    { name: language === 'ar' ? 'الثلث الأخير' : 'Last Third', time: formatPrayerTime(lastThirdTime), isNext: false }
  ];

  // Find next prayer (excluding special times like Duha and Last Third)
  const standardPrayers = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const nextPrayerName = prayerTimesToday.nextPrayer();

  // Mark the next prayer
  if (standardPrayers.includes(nextPrayerName)) {
    prayers.forEach(prayer => {
      const prayerNameLower = prayer.name.toLowerCase();
      if (prayerNameLower.includes(nextPrayerName.toLowerCase())) {
        prayer.isNext = true;
      }
    });
  }

  return prayers;
};

/**
 * Calculate Duha prayer time
 * @param sunrise Sunrise time
 * @param dhuhr Dhuhr prayer time
 * @param offsetMinutes Minutes after sunrise (default: 15)
 * @returns Calculated Duha time
 */
const calculateDuhaTime = (sunrise: Date, dhuhr: Date, offsetMinutes: number = 15): Date => {
  // Duha time is typically between sunrise and dhuhr
  // Default is 15 minutes after sunrise, but can be customized
  const duhaTime = addMinutes(sunrise, offsetMinutes);

  // Ensure the calculated time is between sunrise and dhuhr
  if (duhaTime >= sunrise && duhaTime < dhuhr) {
    return duhaTime;
  } else {
    // If the calculated time is outside the valid range, use a more appropriate time
    // Calculate a time that is 1/4 of the way between sunrise and dhuhr
    const sunriseToDhuhrMillis = dhuhr.getTime() - sunrise.getTime();
    return new Date(sunrise.getTime() + (sunriseToDhuhrMillis / 4));
  }
};

/**
 * Calculate the Last Third of the Night
 * @param maghrib Maghrib prayer time of the current day
 * @param fajrNextDay Fajr prayer time of the next day
 * @returns Calculated Last Third of the Night time
 */
const calculateLastThirdOfNight = (maghrib: Date, fajrNextDay: Date): Date => {
  // Calculate the duration of the night in milliseconds
  const nightDurationMillis = fajrNextDay.getTime() - maghrib.getTime();

  // Calculate the start of the last third of the night
  // Last third starts after 2/3 of the night has passed
  const lastThirdStartMillis = maghrib.getTime() + (nightDurationMillis * 2 / 3);

  return new Date(lastThirdStartMillis);
};

// Get time until next prayer
const getTimeToNextPrayer = (latitude: number, longitude: number, method: string, language: 'ar' | 'en') => {
  // Validate coordinates
  if (isNaN(latitude) || isNaN(longitude)) {
    console.error("Invalid coordinates provided to getTimeToNextPrayer:", { latitude, longitude });
    return language === 'ar' ? 'غير متوفر' : 'Not available';
  }

  const coordinates = new adhan.Coordinates(latitude, longitude);
  const params = getCalculationParams(method);
  const today = new Date();

  const prayerTimes = new adhan.PrayerTimes(coordinates, today, params);
  const nextPrayer = prayerTimes.nextPrayer();
  const nextPrayerTime = prayerTimes.timeForPrayer(nextPrayer);

  if (!nextPrayerTime) return language === 'ar' ? 'غير متوفر' : 'Not available';

  const now = new Date();
  const diff = nextPrayerTime.getTime() - now.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Include seconds in the output for more precision
  if (language === 'ar') {
    return `${hours} ساعة و ${minutes} دقيقة و ${seconds} ثانية`;
  } else {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
};

// Get current Islamic date
const getCurrentIslamicDate = (language: 'ar' | 'en' = 'ar') => {
  const today = new Date();
  const islamicDate = new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA-u-ca-islamic' : 'en-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    calendar: 'islamic'
  }).formatToParts(today);

  const day = islamicDate.find(part => part.type === 'day')?.value || '';
  const month = islamicDate.find(part => part.type === 'month')?.value || '';
  const dayOfWeek = islamicDate.find(part => part.type === 'weekday')?.value || '';

  return { day, month, dayOfWeek };
};

/**
 * Get monthly prayer times
 * @param latitude Latitude of the location
 * @param longitude Longitude of the location
 * @param method Prayer calculation method name
 * @param language Language for formatting ('ar' or 'en')
 * @returns Array of daily prayer times for the current month
 */
const getMonthlyPrayerTimes = (latitude: number, longitude: number, method: string, language: 'ar' | 'en') => {
  // Validate coordinates
  if (isNaN(latitude) || isNaN(longitude)) {
    console.error("Invalid coordinates provided to getMonthlyPrayerTimes:", { latitude, longitude });
    return [];
  }

  const coordinates = new adhan.Coordinates(latitude, longitude);
  const today = new Date();
  const params = getCalculationParams(method);

  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const monthlyTimes = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(today.getFullYear(), today.getMonth(), day);
    const nextDay = new Date(today.getFullYear(), today.getMonth(), day + 1);

    // Calculate prayer times for current day
    const prayerTimes = new adhan.PrayerTimes(coordinates, date, params);

    // Calculate prayer times for next day (needed for last third calculation)
    const nextDayPrayerTimes = new adhan.PrayerTimes(coordinates, nextDay, params);

    // Calculate Duha time (15 minutes after sunrise)
    const duhaTime = calculateDuhaTime(prayerTimes.sunrise, prayerTimes.dhuhr, 15);

    // Calculate Last Third of the Night
    const lastThirdTime = calculateLastThirdOfNight(prayerTimes.maghrib, nextDayPrayerTimes.fajr);

    monthlyTimes.push({
      date: format(date, language === 'ar' ? 'dd/MM/yyyy' : 'MM/dd/yyyy'),
      fajr: format(prayerTimes.fajr, 'HH:mm'),
      sunrise: format(prayerTimes.sunrise, 'HH:mm'),
      duha: format(duhaTime, 'HH:mm'),
      dhuhr: format(prayerTimes.dhuhr, 'HH:mm'),
      asr: format(prayerTimes.asr, 'HH:mm'),
      maghrib: format(prayerTimes.maghrib, 'HH:mm'),
      isha: format(prayerTimes.isha, 'HH:mm'),
      lastThird: format(lastThirdTime, 'HH:mm')
    });
  }

  return monthlyTimes;
};

/**
 * Get recommended calculation method based on country or region with enhanced accuracy
 * @param country Country name (in Arabic)
 * @param latitude Optional latitude for more precise method selection
 * @param longitude Optional longitude for more precise method selection
 * @returns Recommended calculation method for the specified country/location
 */
export const getRecommendedCalculationMethod = (
  country: string,
  latitude?: number,
  longitude?: number
): string => {
  // Check if country exists in the geographic regions mapping
  if (country && GEOGRAPHIC_REGIONS[country]) {
    return GEOGRAPHIC_REGIONS[country];
  }

  // If country not found, try to match partial name
  const countryLower = country.toLowerCase();
  for (const [regionName, methodName] of Object.entries(GEOGRAPHIC_REGIONS)) {
    if (regionName.toLowerCase().includes(countryLower) || countryLower.includes(regionName.toLowerCase())) {
      return methodName;
    }
  }

  // Enhanced geographic-based method selection using coordinates
  if (latitude !== undefined && longitude !== undefined) {
    // Middle East region (high accuracy for Gulf countries)
    if (latitude >= 12 && latitude <= 42 && longitude >= 34 && longitude <= 60) {
      if (latitude >= 21 && latitude <= 32 && longitude >= 34 && longitude <= 55) {
        return 'UmmAlQura'; // Gulf region
      }
      return 'MuslimWorldLeague'; // Broader Middle East
    }

    // North Africa
    if (latitude >= 15 && latitude <= 37 && longitude >= -17 && longitude <= 35) {
      return 'Egyptian';
    }

    // South Asia
    if (latitude >= 5 && latitude <= 40 && longitude >= 60 && longitude <= 100) {
      return 'Karachi';
    }

    // Southeast Asia
    if (latitude >= -10 && latitude <= 25 && longitude >= 90 && longitude <= 140) {
      return 'Singapore';
    }

    // Europe
    if (latitude >= 35 && latitude <= 70 && longitude >= -10 && longitude <= 40) {
      return 'MoonsightingCommittee';
    }

    // North America
    if (latitude >= 25 && latitude <= 70 && longitude >= -170 && longitude <= -50) {
      return 'NorthAmerica';
    }
  }

  // Default to MoonsightingCommittee if no match found (most universally accurate)
  return GEOGRAPHIC_REGIONS['default'];
};

/**
 * Get calculation method information including angles and details
 * @param methodName Method name
 * @param language Language for the description ('ar' or 'en')
 * @returns Object with method details
 */
export const getCalculationMethodInfo = (methodName: string, language: 'ar' | 'en'): {
  name: string;
  fajrAngle: string;
  ishaAngle: string;
  description: string;
} => {
  const params = getCalculationParams(methodName);

  // Default values
  let fajrInfo = params.fajrAngle ? `${params.fajrAngle}°` : 'N/A';
  let ishaInfo = params.ishaAngle ? `${params.ishaAngle}°` : 'N/A';
  let description = '';

  // Special case for Umm Al-Qura
  if (methodName === 'UmmAlQura' || methodName === 'أم القرى') {
    fajrInfo = '18.5°';
    ishaInfo = language === 'ar' ? '90 دقيقة بعد المغرب' : '90 minutes after Maghrib';
    description = language === 'ar'
      ? 'طريقة حساب معتمدة في المملكة العربية السعودية ومعظم دول الخليج'
      : 'Calculation method used in Saudi Arabia and most Gulf countries';
  } else if (methodName === 'MuslimWorldLeague' || methodName === 'رابطة العالم الإسلامي') {
    fajrInfo = '18°';
    ishaInfo = '17°';
    description = language === 'ar'
      ? 'طريقة حساب معتمدة من رابطة العالم الإسلامي، تستخدم في أوروبا وأجزاء من الشرق الأوسط'
      : 'Method approved by Muslim World League, used in Europe and parts of the Middle East';
  } else if (methodName === 'Egyptian' || methodName === 'الهيئة المصرية') {
    fajrInfo = '19.5°';
    ishaInfo = '17.5°';
    description = language === 'ar'
      ? 'طريقة حساب معتمدة من الهيئة المصرية العامة للمساحة، تستخدم في مصر وأفريقيا وسوريا ولبنان'
      : 'Method approved by Egyptian General Authority of Survey, used in Egypt, Africa, Syria and Lebanon';
  } else if (methodName === 'Karachi' || methodName === 'كراتشي') {
    fajrInfo = '18°';
    ishaInfo = '18°';
    description = language === 'ar'
      ? 'طريقة حساب معتمدة من جامعة العلوم الإسلامية في كراتشي، تستخدم في باكستان وأفغانستان والهند وبنغلاديش'
      : 'Method approved by University of Islamic Sciences, Karachi, used in Pakistan, Afghanistan, India and Bangladesh';
  } else if (methodName === 'MoonsightingCommittee' || methodName === 'لجنة رؤية الهلال') {
    fajrInfo = '18°';
    ishaInfo = '18°';
    description = language === 'ar'
      ? 'طريقة حساب معتمدة من لجنة رؤية الهلال، تعتبر من أدق الطرق لمعظم المناطق'
      : 'Method approved by Moonsighting Committee, considered one of the most accurate methods for most regions';
  }

  return {
    name: methodName,
    fajrAngle: fajrInfo,
    ishaAngle: ishaInfo,
    description: description
  };
};

// --- Helper Functions ---

/**
 * Calculates a time relative to a specific prayer time.
 * @param prayerTime The Date object of the base prayer time (e.g., prayerTimes.fajr).
 * @param offsetMinutes The number of minutes to add or subtract.
 * @param type Whether the offset is 'before' or 'after' the prayer time.
 * @returns The calculated Date object.
 */
export const calculateRelativePrayerTime = (
  prayerTime: Date,
  offsetMinutes: number,
  type: 'before' | 'after'
): Date => {
  if (type === 'after') {
    return addMinutes(prayerTime, offsetMinutes);
  } else {
    return subMinutes(prayerTime, offsetMinutes);
  }
};

/**
 * Formats a Date object into a localized time string (HH:MM AM/PM).
 * @param time The Date object to format.
 * @param language The target language ('ar' or 'en').
 * @returns The formatted time string (e.g., "5:30 AM" or "٥:٣٠ ص").
 */
export const formatTimeForDisplay = (time: Date, language: 'ar' | 'en'): string => {
  // Use 'h:mm a' for 12-hour format with AM/PM
  // Pass the locale for Arabic formatting
  return format(time, 'h:mm a', {
    locale: language === 'ar' ? ar : undefined,
  });
};

/**
 * Interface for prayer time adjustments
 */
interface PrayerTimeAdjustments {
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
  [key: string]: number;
}

/**
 * Apply manual adjustments to prayer times
 * @param prayerTimes Original prayer times object
 * @param adjustments Adjustments in minutes for each prayer
 * @returns New prayer times object with adjustments applied
 */
const applyPrayerTimeAdjustments = (
  prayerTimes: adhan.PrayerTimes,
  adjustments: PrayerTimeAdjustments
): adhan.PrayerTimes => {
  // Create a shallow copy of the prayer times object
  const adjustedTimes = { ...prayerTimes };

  // Apply adjustments to each prayer time
  for (const prayer of Object.keys(adjustments)) {
    if (prayer in adjustedTimes && adjustments[prayer] !== 0) {
      const prayerKey = prayer as keyof adhan.PrayerTimes;
      const originalTime = adjustedTimes[prayerKey] as Date;

      if (originalTime instanceof Date) {
        // Apply the adjustment (in minutes)
        adjustedTimes[prayerKey] = addMinutes(originalTime, adjustments[prayer]);
      }
    }
  }

  return adjustedTimes as adhan.PrayerTimes;
};

/**
 * Get prayer times with manual adjustments applied
 * @param latitude Latitude of the location
 * @param longitude Longitude of the location
 * @param method Prayer calculation method name
 * @param adjustments Manual adjustments in minutes
 * @returns Prayer times object with adjustments applied
 */
export const getPrayerTimesWithAdjustments = (
  latitude: number,
  longitude: number,
  method: string,
  adjustments: PrayerTimeAdjustments = { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
): adhan.PrayerTimes => {
  // Validate coordinates
  if (isNaN(latitude) || isNaN(longitude)) {
    console.error("Invalid coordinates provided to getPrayerTimesWithAdjustments:", { latitude, longitude });
    throw new Error("Invalid coordinates");
  }

  const coordinates = new adhan.Coordinates(latitude, longitude);
  const date = new Date();
  const params = getCalculationParams(method);

  // Calculate base prayer times
  const basePrayerTimes = new adhan.PrayerTimes(coordinates, date, params);

  // Apply adjustments if any are non-zero
  const hasAdjustments = Object.values(adjustments).some(value => value !== 0);
  if (hasAdjustments) {
    return applyPrayerTimeAdjustments(basePrayerTimes, adjustments);
  }

  return basePrayerTimes;
};

/**
 * Create enhanced prayer calculation options with automatic method selection
 * @param country Country name for automatic method selection
 * @param latitude Latitude for geographic-based method selection
 * @param longitude Longitude for geographic-based method selection
 * @param userPreferences Optional user preferences to override defaults
 * @returns Enhanced prayer calculation options
 */
const createEnhancedPrayerOptions = (
  country: string,
  latitude: number,
  longitude: number,
  userPreferences?: Partial<PrayerCalculationOptions>
): PrayerCalculationOptions => {
  // Auto-select best method based on location
  const recommendedMethod = getRecommendedCalculationMethod(country, latitude, longitude);

  // Default enhanced options
  const defaultOptions: PrayerCalculationOptions = {
    method: recommendedMethod,
    madhab: 'Shafi', // Default to Shafi madhab
    highLatitudeRule: 'MiddleOfTheNight', // Best for most locations
    elevation: 0, // Will be updated if available
    adjustments: {
      fajr: 0,
      sunrise: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0
    }
  };

  // Merge with user preferences
  return {
    ...defaultOptions,
    ...userPreferences,
    adjustments: {
      ...defaultOptions.adjustments,
      ...userPreferences?.adjustments
    }
  };
};

/**
 * Calculate Asr prayer time based on madhab
 * @param coordinates Location coordinates
 * @param date Date to calculate for
 * @param params Calculation parameters
 * @param madhab Madhab name ('Shafi' or 'Hanafi')
 * @returns Asr prayer time
 */
const calculateAsrTime = (
  coordinates: adhan.Coordinates,
  date: Date,
  params: adhan.CalculationParameters,
  madhab: 'Shafi' | 'Hanafi' = 'Shafi'
): Date => {
  // Set madhab in parameters
  params.madhab = madhab === 'Hanafi' ? adhan.Madhab.Hanafi : adhan.Madhab.Shafi;

  // Calculate prayer times with specified madhab
  const prayerTimes = new adhan.PrayerTimes(coordinates, date, params);

  return prayerTimes.asr;
};
