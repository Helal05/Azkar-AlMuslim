import { useState, useEffect, useRef } from 'react';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { useAlert } from '../alert-system/contexts/alert-context';
import * as adhan from 'adhan'; // Import the adhan library directly
// No need to import Prayer separately if using adhan.*
import { CALCULATION_METHODS, getCalculationParams } from '../utils/prayerTimes'; // Reuse calculation logic helpers

// Define a type for valid prayer names accepted by timeForPrayer using the values of the adhan.Prayer enum/object
// Get the type of the values within the adhan.Prayer object
type AdhanPrayerValue = typeof adhan.Prayer[keyof typeof adhan.Prayer];
// Exclude the unwanted prayer types
type PrayerName = Exclude<AdhanPrayerValue, typeof adhan.Prayer.Sunrise | typeof adhan.Prayer.None>;


// Define prayer names matching alert setting IDs using the specific type
const PRAYER_NAMES: PrayerName[] = [adhan.Prayer.Fajr, adhan.Prayer.Dhuhr, adhan.Prayer.Asr, adhan.Prayer.Maghrib, adhan.Prayer.Isha];

const usePrayerAlerts = () => {
  const { settings: appSettings } = useAppSettings();
  const { settings: alertSettings, getSetting, getSelectedSound } = useAlert();
  const [prayerTimes, setPrayerTimes] = useState<adhan.PrayerTimes | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playedAlertsToday = useRef<Record<string, boolean>>({}); // Track played alerts { 'fajr': true, 'isha_iqama': false }

  // 1. Function to calculate prayer times (raw Date objects)
  const updatePrayerTimes = () => {
    const lat = appSettings.location.latitude;
    const lon = appSettings.location.longitude;
    const method = appSettings.location.method;

    // Basic validation (can be enhanced)
    if (typeof lat !== 'number' || isNaN(lat) || typeof lon !== 'number' || isNaN(lon) || !method) {
      console.error("usePrayerAlerts: Invalid location/method settings.");
      setPrayerTimes(null);
      return;
    }

    try {
      const coordinates = new adhan.Coordinates(lat, lon);
      const params = getCalculationParams(method); // Use helper from prayerTimes.ts
      const date = new Date();
      const times = new adhan.PrayerTimes(coordinates, date, params);
      setPrayerTimes(times);
      console.log("Prayer Alert Times Updated:", {
        fajr: times.fajr,
        dhuhr: times.dhuhr,
        asr: times.asr,
        maghrib: times.maghrib,
        isha: times.isha,
      });
    } catch (error) {
      console.error("usePrayerAlerts: Error calculating prayer times:", error);
      setPrayerTimes(null);
    }
  };

  // 2. Effect to calculate times daily and on setting changes
  useEffect(() => {
    updatePrayerTimes(); // Initial calculation

    // Recalculate daily near midnight and reset flags
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 5, 0); // 5 seconds past midnight
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const dailyTimeout = setTimeout(() => {
      console.log("Recalculating prayer times and resetting alert flags.");
      updatePrayerTimes();
      playedAlertsToday.current = {}; // Reset played flags
      // Set up next daily check (interval better than nested timeouts)
      const interval = setInterval(() => {
         console.log("Recalculating prayer times and resetting alert flags (interval).");
         updatePrayerTimes();
         playedAlertsToday.current = {};
      }, 24 * 60 * 60 * 1000); // Check every 24 hours
      // Clean up interval on unmount or before next timeout runs
      return () => clearInterval(interval);
    }, msUntilMidnight);

    // Clean up timeout on unmount or settings change
    return () => clearTimeout(dailyTimeout);

  }, [appSettings.location.latitude, appSettings.location.longitude, appSettings.location.method]);

  // 3. Effect to check time and play alerts
  useEffect(() => {
    if (!prayerTimes) {
      return; // Don't run if times aren't calculated
    }

    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      PRAYER_NAMES.forEach(prayerName => { // prayerName is now of type PrayerName ('fajr', 'dhuhr', etc.)
        const prayerTime = prayerTimes.timeForPrayer(prayerName);
        if (!prayerTime) return;

        const prayerMinutes = prayerTime.getHours() * 60 + prayerTime.getMinutes();
        const settingId = prayerName; // Use prayerName directly as it's already 'fajr', 'dhuhr', etc.
        const alertSetting = getSetting(settingId);

        // Check Adhan Alert
        const adhanAlertKey = `${settingId}_adhan`;
        if (
          alertSetting?.enabled &&
          currentMinutes === prayerMinutes &&
          !playedAlertsToday.current[adhanAlertKey]
        ) {
          const sound = getSelectedSound(settingId);
          if (sound?.url) {
            console.log(`Playing Adhan Alert for ${prayerName}`);
            try {
              // Stop previous sound if any
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
              }

              // Create new audio object and set properties
              audioRef.current = new Audio(sound.url);
              audioRef.current.volume = 1.0; // Full volume

              // Add event listeners for better debugging
              audioRef.current.addEventListener('playing', () => {
                console.log(`${prayerName} adhan sound started playing`);
              });

              audioRef.current.addEventListener('ended', () => {
                console.log(`${prayerName} adhan sound finished playing`);
              });

              audioRef.current.addEventListener('error', (e) => {
                console.error(`Error in ${prayerName} adhan sound:`, e);
              });

              // Play the sound
              audioRef.current.play()
                .then(() => {
                  console.log(`${prayerName} adhan sound play promise resolved`);
                  playedAlertsToday.current[adhanAlertKey] = true;
                })
                .catch(e => {
                  console.error(`Error playing ${prayerName} adhan sound:`, e);
                  console.error(`Sound URL was: ${sound.url}`);
                });
            } catch (error) {
              console.error(`Exception when setting up ${prayerName} adhan sound:`, error);
            }
          } else {
            console.warn(`No sound configured or found for ${prayerName} adhan. SettingId: ${settingId}`);
          }
        }

        // Check Iqama Alert (Needs iqamaOffset in settings)
        // TODO: Implement Iqama check when AlertSetting includes iqamaOffset
        /*
        const iqamaAlertKey = `${settingId}_iqama`;
        if (
          alertSetting?.iqamaEnabled &&
          alertSetting?.iqamaOffset && // Check if offset exists
          !playedAlertsToday.current[iqamaAlertKey]
        ) {
          const iqamaTime = new Date(prayerTime.getTime() + alertSetting.iqamaOffset * 60000);
          const iqamaMinutes = iqamaTime.getHours() * 60 + iqamaTime.getMinutes();

          if (currentMinutes === iqamaMinutes) {
             const sound = getSelectedSound(settingId); // Or a specific Iqama sound?
             if (sound?.url) {
               console.log(`Playing Iqama Alert for ${prayerName}`);
               if (audioRef.current) audioRef.current.pause();
               audioRef.current = new Audio(sound.url); // Maybe a different sound for iqama?
               audioRef.current.play().catch(e => console.error(`Error playing ${prayerName} iqama sound:`, e));
               playedAlertsToday.current[iqamaAlertKey] = true;
             } else {
                console.warn(`No sound configured or found for ${prayerName} iqama.`);
             }
          }
        }
        */
      });

      // Optional: Reset flags if day changes (belt-and-suspenders)
      if (now.getHours() === 0 && now.getMinutes() === 0 && Object.keys(playedAlertsToday.current).length > 0) {
          console.log("Resetting prayer alert flags at midnight (interval check).");
          playedAlertsToday.current = {};
      }

    }, 60 * 1000); // Check every minute

    // Cleanup interval on unmount or when prayerTimes change
    return () => clearInterval(checkInterval);

  }, [prayerTimes, alertSettings, getSetting, getSelectedSound]); // Re-run if settings change

  // This hook primarily manages side effects (playing audio)
  // It doesn't need to return anything for components to use directly
};

export default usePrayerAlerts;
