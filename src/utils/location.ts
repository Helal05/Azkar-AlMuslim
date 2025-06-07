import { AppSettings } from '../contexts/AppSettingsContext';

// Interface for location data
interface LocationData {
  country: string;
  governorate: string;
  city: string;
  latitude: number;
  longitude: number;
}

// Get current location using browser's geolocation API
export const getCurrentLocation = async (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const locationInfo = await reverseGeocode(latitude, longitude);
          resolve({
            ...locationInfo,
            latitude,
            longitude
          });
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

// Reverse geocode coordinates to get location details
const reverseGeocode = async (latitude: number, longitude: number): Promise<Omit<LocationData, 'latitude' | 'longitude'>> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar`
    );
    const data = await response.json();

    return {
      country: data.address.country || 'Unknown',
      governorate: data.address.state || data.address.city || 'Unknown',
      city: data.address.city || data.address.town || data.address.village || data.address.suburb || 'Unknown'
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return {
      country: 'Unknown',
      governorate: 'Unknown',
      city: 'Unknown'
    };
  }
};

// Update location settings with new location data
export const updateLocation = async (settings: AppSettings, updateSettings: (settings: Partial<AppSettings>) => void) => {
  try {
    const locationData = await getCurrentLocation();
    
    updateSettings({
      location: {
        ...settings.location,
        ...locationData
      }
    });

    return true;
  } catch (error) {
    console.error('Error updating location:', error);
    return false;
  }
};