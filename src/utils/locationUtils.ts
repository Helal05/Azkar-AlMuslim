/**
 * Utility functions for location services and geocoding
 */

// Interface for location data
interface LocationData {
  city: string;
  country: string;
  governorate?: string; // Add governorate field
  latitude: number;
  longitude: number;
  timezone?: string;
  elevation?: number; // Add elevation field for more accurate prayer calculations
  accuracy?: number; // Add accuracy field to track GPS precision
}

/**
 * Get the current user location using browser's geolocation API with enhanced accuracy
 * @param highAccuracy Whether to use high accuracy mode (default: true)
 * @param timeout Timeout in milliseconds (default: 20000)
 * @returns Promise with location coordinates
 */
const getCurrentLocation = (
  highAccuracy: boolean = true,
  timeout: number = 20000
): Promise<GeolocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('الموقع الجغرافي غير مدعوم في هذا المتصفح'));
      return;
    }

    // Enhanced geolocation options for maximum accuracy
    const options: PositionOptions = {
      enableHighAccuracy: highAccuracy,
      timeout: timeout,
      maximumAge: 0 // Always get fresh location
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(`Location accuracy: ${position.coords.accuracy} meters`);
        resolve(position.coords);
      },
      (error) => {
        let errorMessage = 'حدث خطأ أثناء تحديد الموقع';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض إذن الوصول إلى الموقع الجغرافي';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'معلومات الموقع غير متاحة';
            break;
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة طلب الموقع الجغرافي';
            break;
        }
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

/**
 * Reverse geocode coordinates to get city and country names
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Promise with location data including city and country
 */
const reverseGeocode = async (latitude: number, longitude: number): Promise<LocationData> => {
  try {
    // Using OpenStreetMap Nominatim API for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=ar`
    );

    if (!response.ok) {
      throw new Error('فشل في الحصول على بيانات الموقع');
    }

    const data = await response.json();

    // Extract city, governorate, and country from response
    const city = data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.suburb ||
                'غير معروف'; // County might be governorate sometimes, prioritize state/state_district

    const governorate = data.address.state ||
                        data.address.state_district ||
                        data.address.county; // Fallback to county if state/district not found

    const country = data.address.country || 'غير معروف';
    const timezone = data.address.timezone || 'Asia/Riyadh'; // Default timezone if not provided

    return {
      city,
      country,
      governorate: governorate || undefined, // Set governorate, or undefined if not found
      latitude,
      longitude,
      timezone
    };
  } catch (error) {
    console.error('خطأ في تحويل الإحداثيات إلى عنوان:', error);
    // Return default data with coordinates but unknown city/country
    return {
      city: 'غير معروف',
      country: 'غير معروف',
      latitude,
      longitude
    };
  }
};

/**
 * Get elevation data for coordinates using Open Elevation API
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Promise with elevation in meters
 */
const getElevation = async (latitude: number, longitude: number): Promise<number> => {
  try {
    const response = await fetch(
      `https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`
    );

    if (!response.ok) {
      throw new Error('فشل في الحصول على بيانات الارتفاع');
    }

    const data = await response.json();
    return data.results[0]?.elevation || 0;
  } catch (error) {
    console.warn('تعذر الحصول على بيانات الارتفاع، سيتم استخدام القيمة الافتراضية:', error);
    return 0; // Default to sea level if elevation service fails
  }
};

/**
 * Get location data including coordinates and place names with enhanced accuracy
 * @param includeElevation Whether to fetch elevation data (default: true)
 * @returns Promise with complete location data
 */
export const getCompleteLocationData = async (includeElevation: boolean = true): Promise<LocationData> => {
  try {
    const coords = await getCurrentLocation(true, 20000); // Use enhanced accuracy settings
    const locationData = await reverseGeocode(coords.latitude, coords.longitude);

    // Add accuracy and elevation data
    const enhancedLocationData: LocationData = {
      ...locationData,
      accuracy: coords.accuracy,
      elevation: coords.altitude || undefined
    };

    // Fetch elevation from external service if not available from GPS and requested
    if (includeElevation && !enhancedLocationData.elevation) {
      try {
        enhancedLocationData.elevation = await getElevation(coords.latitude, coords.longitude);
      } catch (error) {
        console.warn('فشل في الحصول على بيانات الارتفاع من الخدمة الخارجية');
      }
    }

    return enhancedLocationData;
  } catch (error) {
    console.error('فشل في الحصول على بيانات الموقع الكاملة:', error);
    // Return default location (Makkah)
    return {
      city: 'مكة المكرمة',
      country: 'المملكة العربية السعودية',
      latitude: 21.3891,
      longitude: 39.8579,
      timezone: 'Asia/Riyadh',
      elevation: 277 // Makkah's elevation
    };
  }
};
