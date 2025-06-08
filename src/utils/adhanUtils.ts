/**
 * Utility functions for prayer times calculations using adhan-js library
 */

import { Coordinates, CalculationMethod, PrayerTimes, Madhab, HighLatitudeRule } from 'adhan';

// Interface for prayer calculation parameters
export interface PrayerCalculationParams {
  method: string;
  madhab: string;
  highLatitudeRule: string;
  adjustments: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
}

/**
 * Get calculation method parameters based on location or user preference
 * @param methodName Name of the calculation method
 * @returns Calculation method parameters
 */
const getCalculationMethod = (methodName: string = 'UmmAlQura') => {
  switch (methodName) {
    case 'MWL':
      return CalculationMethod.MuslimWorldLeague();
    case 'Egyptian':
      return CalculationMethod.Egyptian();
    case 'Karachi':
      return CalculationMethod.Karachi();
    case 'UmmAlQura':
      return CalculationMethod.UmmAlQura();
    case 'Dubai':
      return CalculationMethod.Dubai();
    case 'Qatar':
      return CalculationMethod.Qatar();
    case 'Kuwait':
      return CalculationMethod.Kuwait();
    case 'MoonsightingCommittee':
      return CalculationMethod.MoonsightingCommittee();
    case 'Singapore':
      return CalculationMethod.Singapore();
    case 'Turkey':
      return CalculationMethod.Turkey();
    case 'Tehran':
      return CalculationMethod.Tehran();
    case 'NorthAmerica':
      return CalculationMethod.NorthAmerica();
    default:
      return CalculationMethod.UmmAlQura();
  }
};

/**
 * Get madhab for Asr prayer calculation
 * @param madhabName Name of the madhab (Shafi or Hanafi)
 * @returns Madhab parameter
 */
const getMadhab = (madhabName: string = 'Shafi') => {
  return madhabName === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;
};

/**
 * Get high latitude rule for extreme latitudes
 * @param ruleName Name of the high latitude rule
 * @returns High latitude rule parameter
 */
const getHighLatitudeRule = (ruleName: string = 'MiddleOfTheNight') => {
  switch (ruleName) {
    case 'MiddleOfTheNight':
      return HighLatitudeRule.MiddleOfTheNight;
    case 'SeventhOfTheNight':
      return HighLatitudeRule.SeventhOfTheNight;
    case 'TwilightAngle':
      return HighLatitudeRule.TwilightAngle;
    default:
      return HighLatitudeRule.MiddleOfTheNight;
  }
};

/**
 * Calculate prayer times for a specific date and location
 * @param date Date to calculate prayer times for
 * @param latitude Latitude of the location
 * @param longitude Longitude of the location
 * @param params Prayer calculation parameters
 * @returns Prayer times object
 */
export const calculatePrayerTimes = (
  date: Date = new Date(),
  latitude: number = 21.3891,
  longitude: number = 39.8579,
  params: Partial<PrayerCalculationParams> = {}
) => {
  // Create coordinates
  const coordinates = new Coordinates(latitude, longitude);
  
  // Get calculation parameters
  const calculationParams = getCalculationMethod(params.method);
  
  // Set madhab if provided
  if (params.madhab) {
    calculationParams.madhab = getMadhab(params.madhab);
  }
  
  // Set high latitude rule if provided
  if (params.highLatitudeRule) {
    calculationParams.highLatitudeRule = getHighLatitudeRule(params.highLatitudeRule);
  }
  
  // Apply any adjustments if provided
  if (params.adjustments) {
    calculationParams.adjustments = params.adjustments;
  }
  
  // Calculate prayer times
  const prayerTimes = new PrayerTimes(coordinates, date, calculationParams);
  
  return prayerTimes;
};

/**
 * Format time to Arabic notation (ص/م)
 * @param hour Hour (0-23)
 * @param minute Minute (0-59)
 * @returns Formatted time string in Arabic
 */
const formatArabicTime = (hour: number, minute: number): string => {
  const period = hour < 12 ? 'ص' : 'م';
  const h = hour % 12 || 12;
  
  // Convert to Arabic numerals
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const toArabicNumerals = (num: number): string => {
    return num.toString().split('').map(digit => {
      const digitNum = parseInt(digit, 10);
      return !isNaN(digitNum) ? arabicNumerals[digitNum] : digit;
    }).join('');
  };
  
  // Ensure minutes are padded with leading zero if needed
  const formattedMinute = minute < 10 ? `٠${toArabicNumerals(minute)}` : toArabicNumerals(minute);
  return `${period} ${toArabicNumerals(h)}:${formattedMinute}`;
};

/**
 * Format time to English notation (AM/PM)
 * @param hour Hour (0-23)
 * @param minute Minute (0-59)
 * @returns Formatted time string in English
 */
const formatEnglishTime = (hour: number, minute: number): string => {
  const period = hour < 12 ? 'AM' : 'PM';
  const h = hour % 12 || 12;
  // Ensure minutes are padded with leading zero if needed
  const formattedMinute = minute < 10 ? `0${minute}` : minute.toString();
  return `${h}:${formattedMinute} ${period}`;
};

/**
 * Format prayer time based on language
 * @param date Date object representing prayer time
 * @param language Language code ('ar' or 'en')
 * @returns Formatted time string
 */
export const formatPrayerTime = (date: Date, language: string = 'ar'): string => {
  if (!date) return language === 'ar' ? 'غير متاح' : 'N/A';
  const hour = date.getHours();
  const minute = date.getMinutes();
  return language === 'ar' 
    ? formatArabicTime(hour, minute) 
    : formatEnglishTime(hour, minute);
};
