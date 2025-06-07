import { useState, useEffect, useRef } from 'react';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { getPrayerTimes } from '../data/prayerData';
import { calculatePrayerTimes } from '../utils/adhanUtils'; // Need this for raw Date objects

const useAzkarAlerts = () => {
  const { settings } = useAppSettings();
  const [fajrTime, setFajrTime] = useState<Date | null>(null);
  const [asrTime, setAsrTime] = useState<Date | null>(null);
  const [playedFajrAlertToday, setPlayedFajrAlertToday] = useState(false);
  const [playedAsrAlertToday, setPlayedAsrAlertToday] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Function to get today's prayer times as Date objects
  const updatePrayerTimes = () => {
    // Add validation for location data
    const lat = settings.location.latitude;
    const lon = settings.location.longitude;
    const method = settings.location.method;

    if (typeof lat !== 'number' || isNaN(lat) || lat < -90 || lat > 90 ||
        typeof lon !== 'number' || isNaN(lon) || lon < -180 || lon > 180 ||
        !method || typeof method !== 'string') {
      console.error("useAzkarAlerts: Invalid location/method settings detected:", settings.location);
      setFajrTime(null); // Clear times if settings are invalid
      setAsrTime(null);
      return; // Stop processing
    }

    // Proceed only if location data is valid
    try {
      const now = new Date();
      const prayers = calculatePrayerTimes(
        now,
        lat, // Use validated lat
        lon, // Use validated lon
        { method: method } // Use validated method
      );
      setFajrTime(prayers.fajr);
      setAsrTime(prayers.asr);
      console.log("Azkar Alert Times Updated:", { fajr: prayers.fajr, asr: prayers.asr });
    } catch (error) {
        console.error("useAzkarAlerts: Error calculating prayer times:", error);
        setFajrTime(null);
        setAsrTime(null);
    }
  };

  // Effect to calculate prayer times daily or when settings change
  useEffect(() => {
    updatePrayerTimes(); // Initial calculation

    // Recalculate daily at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 1, 0); // 1 second past midnight
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const dailyTimeout = setTimeout(() => {
      updatePrayerTimes();
      setPlayedFajrAlertToday(false); // Reset daily flags
      setPlayedAsrAlertToday(false);
      // Set up next daily check
      const interval = setInterval(() => {
         updatePrayerTimes();
         setPlayedFajrAlertToday(false);
         setPlayedAsrAlertToday(false);
      }, 24 * 60 * 60 * 1000); // Check every 24 hours
      return () => clearInterval(interval);
    }, msUntilMidnight);

    return () => clearTimeout(dailyTimeout);

  }, [settings.location.latitude, settings.location.longitude, settings.location.method]);

  // Effect to check time and play alerts
  useEffect(() => {
    if (!settings.appearance.enableAzkarAlerts || (!fajrTime && !asrTime)) {
      return; // Do nothing if alerts disabled or times not set
    }

    // Initialize audio reference if needed
    if (!audioRef.current) {
        audioRef.current = null;
        console.log("Azkar alert audio reference initialized");
    }


    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Check Fajr
      if (fajrTime) {
        const fajrMinutes = fajrTime.getHours() * 60 + fajrTime.getMinutes();
        if (currentMinutes === fajrMinutes && !playedFajrAlertToday) {
          console.log("Playing Fajr Azkar Alert");
          try {
            // Stop previous sound if any
            if (audioRef.current) {
              audioRef.current.pause();
            }

            // Create new audio object with morning sound
            const morningSound = '/sounds/morning-dhikr.mp3';
            audioRef.current = new Audio(morningSound);
            audioRef.current.volume = 1.0; // Full volume

            // Add event listeners for better debugging
            audioRef.current.addEventListener('playing', () => {
              console.log("Morning Azkar sound started playing");
            });

            audioRef.current.addEventListener('ended', () => {
              console.log("Morning Azkar sound finished playing");
            });

            audioRef.current.addEventListener('error', (e) => {
              console.error("Error in Morning Azkar sound:", e);
            });

            // Play the sound
            audioRef.current.play()
              .then(() => {
                console.log("Morning Azkar sound play promise resolved");
                setPlayedFajrAlertToday(true);
              })
              .catch(e => {
                console.error("Error playing Morning Azkar sound:", e);
                console.error(`Sound URL was: ${morningSound}`);
              });
          } catch (error) {
            console.error("Exception when setting up Morning Azkar sound:", error);
          }
        }
      }

      // Check Asr
      if (asrTime) {
        const asrMinutes = asrTime.getHours() * 60 + asrTime.getMinutes();
        if (currentMinutes === asrMinutes && !playedAsrAlertToday) {
          console.log("Playing Asr Azkar Alert");
          try {
            // Stop previous sound if any
            if (audioRef.current) {
              audioRef.current.pause();
            }

            // Create new audio object with evening sound
            const eveningSound = '/sounds/evening-dhikr.mp3';
            audioRef.current = new Audio(eveningSound);
            audioRef.current.volume = 1.0; // Full volume

            // Add event listeners for better debugging
            audioRef.current.addEventListener('playing', () => {
              console.log("Evening Azkar sound started playing");
            });

            audioRef.current.addEventListener('ended', () => {
              console.log("Evening Azkar sound finished playing");
            });

            audioRef.current.addEventListener('error', (e) => {
              console.error("Error in Evening Azkar sound:", e);
            });

            // Play the sound
            audioRef.current.play()
              .then(() => {
                console.log("Evening Azkar sound play promise resolved");
                setPlayedAsrAlertToday(true);
              })
              .catch(e => {
                console.error("Error playing Evening Azkar sound:", e);
                console.error(`Sound URL was: ${eveningSound}`);
              });
          } catch (error) {
            console.error("Exception when setting up Evening Azkar sound:", error);
          }
        }
      }

      // Reset flags if the day has changed (double check)
      if (now.getHours() === 0 && now.getMinutes() === 0) {
          if (playedFajrAlertToday || playedAsrAlertToday) {
              console.log("Resetting Azkar alert flags at midnight.");
              setPlayedFajrAlertToday(false);
              setPlayedAsrAlertToday(false);
          }
      }

    }, 60 * 1000); // Check every minute

    return () => clearInterval(checkInterval);

  }, [settings.appearance.enableAzkarAlerts, fajrTime, asrTime, playedFajrAlertToday, playedAsrAlertToday]);

  // No return value needed, the hook just runs effects
};

export default useAzkarAlerts;
