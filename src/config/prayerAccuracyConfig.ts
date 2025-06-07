/**
 * Enhanced Prayer Times Accuracy Configuration
 * إعدادات دقة مواقيت الصلاة المحسنة
 */

export interface AccuracyConfig {
  location: {
    highAccuracy: boolean;
    timeout: number;
    maximumAge: number;
    enableElevation: boolean;
    fallbackToIP: boolean;
  };
  calculation: {
    autoSelectMethod: boolean;
    defaultMadhab: 'Shafi' | 'Hanafi';
    defaultHighLatitudeRule: 'MiddleOfTheNight' | 'SeventhOfTheNight' | 'TwilightAngle';
    enableManualAdjustments: boolean;
  };
  precision: {
    coordinateDecimalPlaces: number;
    timeDisplaySeconds: boolean;
    elevationThreshold: number; // Minimum elevation difference to consider
  };
}

/**
 * Default enhanced accuracy configuration
 * الإعدادات الافتراضية للدقة المحسنة
 */
export const DEFAULT_ACCURACY_CONFIG: AccuracyConfig = {
  location: {
    highAccuracy: true, // Always use high accuracy GPS
    timeout: 20000, // 20 seconds timeout for better accuracy
    maximumAge: 0, // Always get fresh location
    enableElevation: true, // Fetch elevation data
    fallbackToIP: true // Fallback to IP-based location if GPS fails
  },
  calculation: {
    autoSelectMethod: true, // Automatically select best method based on location
    defaultMadhab: 'Shafi', // Default to Shafi madhab
    defaultHighLatitudeRule: 'MiddleOfTheNight', // Best for most locations
    enableManualAdjustments: true // Allow manual time adjustments
  },
  precision: {
    coordinateDecimalPlaces: 6, // High precision coordinates
    timeDisplaySeconds: true, // Show seconds in countdown
    elevationThreshold: 10 // Consider elevation differences >= 10m
  }
};

/**
 * Regional accuracy presets for different geographic areas
 * إعدادات دقة إقليمية لمناطق جغرافية مختلفة
 */
export const REGIONAL_ACCURACY_PRESETS = {
  // Gulf Countries - دول الخليج
  gulf: {
    ...DEFAULT_ACCURACY_CONFIG,
    calculation: {
      ...DEFAULT_ACCURACY_CONFIG.calculation,
      defaultMadhab: 'Shafi' as const
    }
  },
  
  // North Africa - شمال أفريقيا
  northAfrica: {
    ...DEFAULT_ACCURACY_CONFIG,
    calculation: {
      ...DEFAULT_ACCURACY_CONFIG.calculation,
      defaultMadhab: 'Shafi' as const
    }
  },
  
  // South Asia - جنوب آسيا
  southAsia: {
    ...DEFAULT_ACCURACY_CONFIG,
    calculation: {
      ...DEFAULT_ACCURACY_CONFIG.calculation,
      defaultMadhab: 'Hanafi' as const
    }
  },
  
  // Europe - أوروبا
  europe: {
    ...DEFAULT_ACCURACY_CONFIG,
    calculation: {
      ...DEFAULT_ACCURACY_CONFIG.calculation,
      defaultHighLatitudeRule: 'TwilightAngle' as const
    }
  },
  
  // High Latitude Regions - المناطق ذات العروض العالية
  highLatitude: {
    ...DEFAULT_ACCURACY_CONFIG,
    calculation: {
      ...DEFAULT_ACCURACY_CONFIG.calculation,
      defaultHighLatitudeRule: 'SeventhOfTheNight' as const
    }
  }
};

/**
 * Method accuracy ratings for different calculation methods
 * تقييمات دقة طرق الحساب المختلفة
 */
export const METHOD_ACCURACY_RATINGS = {
  'UmmAlQura': {
    regions: ['Saudi Arabia', 'Gulf Countries'],
    accuracy: 'Very High',
    description: 'Most accurate for Saudi Arabia and Gulf region'
  },
  'Egyptian': {
    regions: ['Egypt', 'North Africa', 'Syria', 'Lebanon'],
    accuracy: 'Very High',
    description: 'Most accurate for Egypt and North African countries'
  },
  'Karachi': {
    regions: ['Pakistan', 'India', 'Bangladesh', 'Afghanistan'],
    accuracy: 'Very High',
    description: 'Most accurate for South Asian countries'
  },
  'MoonsightingCommittee': {
    regions: ['Global', 'Europe', 'North America'],
    accuracy: 'High',
    description: 'Good universal accuracy, recommended for most regions'
  },
  'MuslimWorldLeague': {
    regions: ['Europe', 'Middle East'],
    accuracy: 'High',
    description: 'Good for European and Middle Eastern countries'
  },
  'Singapore': {
    regions: ['Southeast Asia', 'Malaysia', 'Indonesia'],
    accuracy: 'Very High',
    description: 'Most accurate for Southeast Asian countries'
  }
};

/**
 * Elevation impact on prayer times (in minutes)
 * تأثير الارتفاع على مواقيت الصلاة (بالدقائق)
 */
export const ELEVATION_IMPACT = {
  // For every 1000m elevation, approximate time differences
  fajr: -2, // Fajr comes ~2 minutes earlier per 1000m
  sunrise: -2, // Sunrise comes ~2 minutes earlier per 1000m
  dhuhr: 0, // Dhuhr not significantly affected
  asr: 1, // Asr comes ~1 minute later per 1000m
  maghrib: 2, // Maghrib comes ~2 minutes later per 1000m
  isha: 2 // Isha comes ~2 minutes later per 1000m
};

/**
 * GPS accuracy thresholds for different use cases
 * عتبات دقة GPS لحالات استخدام مختلفة
 */
export const GPS_ACCURACY_THRESHOLDS = {
  excellent: 5, // ±5 meters - excellent accuracy
  good: 20, // ±20 meters - good accuracy
  acceptable: 50, // ±50 meters - acceptable accuracy
  poor: 100, // ±100 meters - poor accuracy
  veryPoor: 500 // ±500 meters - very poor accuracy
};

/**
 * Get accuracy level description based on GPS accuracy
 * الحصول على وصف مستوى الدقة بناءً على دقة GPS
 */
export const getAccuracyLevel = (accuracy: number, language: 'ar' | 'en' = 'ar') => {
  const descriptions = {
    ar: {
      excellent: 'ممتازة',
      good: 'جيدة',
      acceptable: 'مقبولة',
      poor: 'ضعيفة',
      veryPoor: 'ضعيفة جداً'
    },
    en: {
      excellent: 'Excellent',
      good: 'Good',
      acceptable: 'Acceptable',
      poor: 'Poor',
      veryPoor: 'Very Poor'
    }
  };

  if (accuracy <= GPS_ACCURACY_THRESHOLDS.excellent) return descriptions[language].excellent;
  if (accuracy <= GPS_ACCURACY_THRESHOLDS.good) return descriptions[language].good;
  if (accuracy <= GPS_ACCURACY_THRESHOLDS.acceptable) return descriptions[language].acceptable;
  if (accuracy <= GPS_ACCURACY_THRESHOLDS.poor) return descriptions[language].poor;
  return descriptions[language].veryPoor;
};

/**
 * Calculate elevation-based time adjustments
 * حساب تعديلات الوقت بناءً على الارتفاع
 */
export const calculateElevationAdjustments = (elevation: number) => {
  const elevationKm = elevation / 1000;
  
  return {
    fajr: Math.round(ELEVATION_IMPACT.fajr * elevationKm),
    sunrise: Math.round(ELEVATION_IMPACT.sunrise * elevationKm),
    dhuhr: Math.round(ELEVATION_IMPACT.dhuhr * elevationKm),
    asr: Math.round(ELEVATION_IMPACT.asr * elevationKm),
    maghrib: Math.round(ELEVATION_IMPACT.maghrib * elevationKm),
    isha: Math.round(ELEVATION_IMPACT.isha * elevationKm)
  };
};
