/**
 * Enhanced Prayer Calculation Utilities
 * أدوات حساب مواقيت الصلاة المحسنة
 */

import { 
  getPrayerTimes as getBasePrayerTimes, 
  createEnhancedPrayerOptions,
  getRecommendedCalculationMethod,
  PrayerCalculationOptions 
} from './prayerTimes';
import { getCompleteLocationData, LocationData } from './locationUtils';
import { 
  DEFAULT_ACCURACY_CONFIG, 
  REGIONAL_ACCURACY_PRESETS,
  getAccuracyLevel,
  calculateElevationAdjustments,
  AccuracyConfig 
} from '../config/prayerAccuracyConfig';

export interface EnhancedPrayerResult {
  prayerTimes: any[];
  locationData: LocationData;
  calculationMethod: string;
  accuracyInfo: {
    gpsAccuracy: number;
    accuracyLevel: string;
    elevation: number;
    elevationAdjustments?: any;
  };
  options: PrayerCalculationOptions;
}

/**
 * Get enhanced prayer times with maximum accuracy
 * الحصول على مواقيت الصلاة المحسنة بأقصى دقة
 */
export const getEnhancedPrayerTimes = async (
  language: 'ar' | 'en' = 'ar',
  userPreferences?: Partial<PrayerCalculationOptions>,
  config: AccuracyConfig = DEFAULT_ACCURACY_CONFIG
): Promise<EnhancedPrayerResult> => {
  try {
    // Step 1: Get enhanced location data with elevation
    console.log('🌍 Getting enhanced location data...');
    const locationData = await getCompleteLocationData(config.location.enableElevation);
    
    // Step 2: Determine best calculation method
    console.log('📊 Determining best calculation method...');
    const recommendedMethod = getRecommendedCalculationMethod(
      locationData.country, 
      locationData.latitude, 
      locationData.longitude
    );
    
    // Step 3: Create enhanced prayer options
    console.log('⚙️ Creating enhanced prayer options...');
    let enhancedOptions = createEnhancedPrayerOptions(
      locationData.country,
      locationData.latitude,
      locationData.longitude,
      {
        method: recommendedMethod,
        madhab: config.calculation.defaultMadhab,
        highLatitudeRule: config.calculation.defaultHighLatitudeRule,
        elevation: locationData.elevation,
        ...userPreferences
      }
    );

    // Step 4: Apply elevation-based adjustments if enabled
    let elevationAdjustments;
    if (locationData.elevation && locationData.elevation > config.precision.elevationThreshold) {
      console.log(`🏔️ Applying elevation adjustments for ${locationData.elevation}m...`);
      elevationAdjustments = calculateElevationAdjustments(locationData.elevation);
      
      // Merge elevation adjustments with existing adjustments
      enhancedOptions = {
        ...enhancedOptions,
        adjustments: {
          fajr: (enhancedOptions.adjustments?.fajr || 0) + elevationAdjustments.fajr,
          sunrise: (enhancedOptions.adjustments?.sunrise || 0) + elevationAdjustments.sunrise,
          dhuhr: (enhancedOptions.adjustments?.dhuhr || 0) + elevationAdjustments.dhuhr,
          asr: (enhancedOptions.adjustments?.asr || 0) + elevationAdjustments.asr,
          maghrib: (enhancedOptions.adjustments?.maghrib || 0) + elevationAdjustments.maghrib,
          isha: (enhancedOptions.adjustments?.isha || 0) + elevationAdjustments.isha
        }
      };
    }

    // Step 5: Calculate prayer times with enhanced options
    console.log('🕌 Calculating enhanced prayer times...');
    const prayerTimes = getBasePrayerTimes(
      locationData.latitude,
      locationData.longitude,
      enhancedOptions,
      language
    );

    // Step 6: Prepare accuracy information
    const accuracyLevel = getAccuracyLevel(locationData.accuracy || 1000, language);
    
    const result: EnhancedPrayerResult = {
      prayerTimes,
      locationData,
      calculationMethod: recommendedMethod,
      accuracyInfo: {
        gpsAccuracy: locationData.accuracy || 1000,
        accuracyLevel,
        elevation: locationData.elevation || 0,
        elevationAdjustments
      },
      options: enhancedOptions
    };

    // Log success
    console.log('✅ Enhanced prayer times calculated successfully');
    console.log(`📍 Location: ${locationData.city}, ${locationData.country}`);
    console.log(`📊 Method: ${recommendedMethod}`);
    console.log(`🎯 GPS Accuracy: ±${locationData.accuracy}m (${accuracyLevel})`);
    console.log(`🏔️ Elevation: ${locationData.elevation}m`);

    return result;

  } catch (error) {
    console.error('❌ Error calculating enhanced prayer times:', error);
    
    // Fallback to basic calculation with default location (Makkah)
    console.log('🔄 Falling back to default location...');
    const fallbackLocation: LocationData = {
      city: 'مكة المكرمة',
      country: 'المملكة العربية السعودية',
      latitude: 21.3891,
      longitude: 39.8579,
      elevation: 277,
      accuracy: 1000
    };

    const fallbackOptions = createEnhancedPrayerOptions(
      fallbackLocation.country,
      fallbackLocation.latitude,
      fallbackLocation.longitude,
      userPreferences
    );

    const fallbackPrayerTimes = getBasePrayerTimes(
      fallbackLocation.latitude,
      fallbackLocation.longitude,
      fallbackOptions,
      language
    );

    return {
      prayerTimes: fallbackPrayerTimes,
      locationData: fallbackLocation,
      calculationMethod: 'UmmAlQura',
      accuracyInfo: {
        gpsAccuracy: 1000,
        accuracyLevel: getAccuracyLevel(1000, language),
        elevation: 277
      },
      options: fallbackOptions
    };
  }
};

/**
 * Get regional accuracy preset based on location
 * الحصول على إعدادات الدقة الإقليمية بناءً على الموقع
 */
export const getRegionalAccuracyPreset = (
  latitude: number, 
  longitude: number, 
  country: string
): AccuracyConfig => {
  // High latitude regions (above 60° or below -60°)
  if (Math.abs(latitude) > 60) {
    return REGIONAL_ACCURACY_PRESETS.highLatitude;
  }
  
  // Gulf region
  if (latitude >= 21 && latitude <= 32 && longitude >= 34 && longitude <= 55) {
    return REGIONAL_ACCURACY_PRESETS.gulf;
  }
  
  // North Africa
  if (latitude >= 15 && latitude <= 37 && longitude >= -17 && longitude <= 35) {
    return REGIONAL_ACCURACY_PRESETS.northAfrica;
  }
  
  // South Asia
  if (latitude >= 5 && latitude <= 40 && longitude >= 60 && longitude <= 100) {
    return REGIONAL_ACCURACY_PRESETS.southAsia;
  }
  
  // Europe
  if (latitude >= 35 && latitude <= 70 && longitude >= -10 && longitude <= 40) {
    return REGIONAL_ACCURACY_PRESETS.europe;
  }
  
  // Default configuration
  return DEFAULT_ACCURACY_CONFIG;
};

/**
 * Validate and optimize prayer calculation options
 * التحقق من وتحسين خيارات حساب مواقيت الصلاة
 */
export const optimizePrayerOptions = (
  options: Partial<PrayerCalculationOptions>,
  locationData: LocationData
): PrayerCalculationOptions => {
  const optimized = createEnhancedPrayerOptions(
    locationData.country,
    locationData.latitude,
    locationData.longitude,
    options
  );

  // Apply regional optimizations
  const regionalConfig = getRegionalAccuracyPreset(
    locationData.latitude,
    locationData.longitude,
    locationData.country
  );

  return {
    ...optimized,
    madhab: options.madhab || regionalConfig.calculation.defaultMadhab,
    highLatitudeRule: options.highLatitudeRule || regionalConfig.calculation.defaultHighLatitudeRule
  };
};

/**
 * Export enhanced prayer calculation as the main interface
 * تصدير حساب مواقيت الصلاة المحسن كواجهة رئيسية
 */
export default getEnhancedPrayerTimes;
