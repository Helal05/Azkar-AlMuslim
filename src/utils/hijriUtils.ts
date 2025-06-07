/**
 * Utility functions for Hijri (Islamic) calendar calculations
 */

import moment from 'moment-hijri';

// Interface for Hijri date
export interface HijriDate {
  day: string;
  month: string;
  year: string;
  dayOfWeek: string;
  gregorianDate: string;
  monthNumber: number;
  dayNumber: number;
  yearNumber: number;
}

// Hijri month names in Arabic and English
export const hijriMonths = {
  ar: [
    "محرم",
    "صفر",
    "ربيع الأول",
    "ربيع الثاني",
    "جمادى الأولى",
    "جمادى الآخرة",
    "رجب",
    "شعبان",
    "رمضان",
    "شوال",
    "ذو القعدة",
    "ذو الحجة"
  ],
  en: [
    "Muharram",
    "Safar",
    "Rabi' al-Awwal",
    "Rabi' al-Thani",
    "Jumada al-Ula",
    "Jumada al-Akhirah",
    "Rajab",
    "Sha'ban",
    "Ramadan",
    "Shawwal",
    "Dhu al-Qi'dah",
    "Dhu al-Hijjah"
  ]
};

// Day names in Arabic and English
export const weekDays = {
  ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
};

// Convert a number to Arabic numerals
export const toArabicNumerals = (num: number): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(digit => {
    const digitNum = parseInt(digit, 10);
    return !isNaN(digitNum) ? arabicNumerals[digitNum] : digit;
  }).join('');
};

// Convert Gregorian date to Hijri date
export const convertToHijri = (date: Date = new Date(), language: string = 'ar'): HijriDate => {
  const m = moment(date);
  const hijriDate = m.format('iD');
  const hijriMonth = m.format('iM');
  const hijriYear = m.format('iYYYY');
  const dayOfWeek = weekDays[language][date.getDay()];
  const monthName = hijriMonths[language][parseInt(hijriMonth) - 1];
  
  // Format Gregorian date
  const gregorianDateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

  return {
    day: language === 'ar' ? toArabicNumerals(parseInt(hijriDate)) : hijriDate,
    month: monthName,
    year: language === 'ar' ? toArabicNumerals(parseInt(hijriYear)) : hijriYear,
    dayOfWeek: dayOfWeek,
    gregorianDate: gregorianDateStr,
    monthNumber: parseInt(hijriMonth),
    dayNumber: parseInt(hijriDate),
    yearNumber: parseInt(hijriYear)
  };
};

// Get current Hijri date
export const getCurrentHijriDate = (language: string = 'ar'): HijriDate => {
  return convertToHijri(new Date(), language);
};

// Get Hijri date for a specific Gregorian date
export const getHijriDateForGregorian = (gregorianDate: Date, language: string = 'ar'): HijriDate => {
  return convertToHijri(gregorianDate, language);
};

// Get Hijri month name
export const getHijriMonthName = (monthNumber: number, language: string = 'ar'): string => {
  // Adjust for 0-based index
  const index = ((monthNumber - 1) % 12 + 12) % 12;
  return hijriMonths[language][index];
};

// Calculate number of days in a Hijri month
export const getDaysInHijriMonth = (year: number, month: number): number => {
  return moment(`${year}-${month}-1`, 'iYYYY-iM-iD').iDaysInMonth();
};

// Convert Hijri date to Gregorian date
export const convertToGregorian = (hijriYear: number, hijriMonth: number, hijriDay: number): Date => {
  return moment(`${hijriYear}-${hijriMonth}-${hijriDay}`, 'iYYYY-iM-iD').toDate();
};

// Calculate age in Hijri years
export const calculateHijriAge = (birthDate: Date): number => {
  const currentHijri = convertToHijri(new Date());
  const birthHijri = convertToHijri(birthDate);
  
  let age = currentHijri.yearNumber - birthHijri.yearNumber;
  
  if (currentHijri.monthNumber < birthHijri.monthNumber || 
      (currentHijri.monthNumber === birthHijri.monthNumber && 
       currentHijri.dayNumber < birthHijri.dayNumber)) {
    age--;
  }
  
  return age;
};

// Important Islamic dates
export const importantIslamicDates = {
  ar: {
    '1-1': 'رأس السنة الهجرية',
    '1-10': 'يوم عاشوراء',
    '12-8': 'يوم التروية',
    '12-9': 'يوم عرفة',
    '12-10': 'عيد الأضحى',
    '12-11': 'أيام التشريق',
    '12-12': 'أيام التشريق',
    '12-13': 'أيام التشريق',
    '3-12': 'المولد النبوي',
    '7-27': 'الإسراء والمعراج',
    '9-1': 'بداية رمضان',
    '10-1': 'عيد الفطر'
  },
  en: {
    '1-1': 'Islamic New Year',
    '1-10': 'Day of Ashura',
    '12-8': 'Day of Tarwiyah',
    '12-9': 'Day of Arafah',
    '12-10': 'Eid al-Adha',
    '12-11': 'Days of Tashreeq',
    '12-12': 'Days of Tashreeq',
    '12-13': 'Days of Tashreeq',
    '3-12': 'Prophet\'s Birthday',
    '7-27': 'Isra and Mi\'raj',
    '9-1': 'Start of Ramadan',
    '10-1': 'Eid al-Fitr'
  }
};

// Check if today is an important Islamic date
export const getTodayIslamicEvent = (language: string = 'ar'): string | null => {
  const today = convertToHijri();
  const key = `${today.monthNumber}-${today.dayNumber}`;
  return importantIslamicDates[language][key] || null;
};
