import { LocalNotifications, PermissionStatus, LocalNotificationSchema, PendingResult, ActionPerformed } from '@capacitor/local-notifications';
import { Coordinates, CalculationMethod, PrayerTimes as AdhanPrayerTimes } from 'adhan'; // Renamed PrayerTimes to avoid conflict
import { AppSettings } from '../contexts/AppSettingsContext'; // Keep for location, method, iqama offsets etc.
import { AlertSetting, CustomRelativeAlert } from '../types'; // Import new types, including CustomRelativeAlert
// Removed import of defaultAlertSettings
import { alertSounds } from '../data/sounds'; // Import sounds data
import { addMinutes } from 'date-fns';
import { Capacitor } from '@capacitor/core'; // Import Capacitor
// Assuming storageUtils has functions for both standard and custom alerts
import { scheduleAthkarNotifications } from './athkarNotifications'; // Import athkar notifications

const getCustomAlertsFromStorage = (): CustomRelativeAlert[] => {
  console.warn("Using placeholder for getCustomAlertsFromStorage. Implement in storageUtils.ts");
  // Placeholder: return a default or empty array
  // Example: return [{ id: 'custom-fajr-plus-30', enabled: true, basePrayer: 'fajr', offsetMinutes: 30, label: 'Test Custom Alert', soundId: 'default' }];
  return [];
};


// --- Constants ---
const HARDCODED_DEFAULT_SOUND_ID = "adhan-makkah1"; // Match the one in alert-context

// --- Permission Handling --- (Keep as is)

/**
 * Checks if notification permissions have been granted.
 * @returns {Promise<boolean>} True if permission is granted, false otherwise.
 */
const checkNotificationPermission = async (): Promise<boolean> => {
  // On web, permissions are handled differently or not applicable for standard notifications
  if (!Capacitor.isNativePlatform()) {
    console.log("Notification permissions check skipped on web.");
    // You might want to check browser Notification API permission if implementing web push
    return true; // Assume allowed for basic functionality or handle web specifics
  }
  try {
    const result: PermissionStatus = await LocalNotifications.checkPermissions();
    console.log('Native notification permission status:', result.display);
    return result.display === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
};

/**
 * Requests notification permissions from the user.
 * @returns {Promise<boolean>} True if permission is granted, false otherwise.
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
   if (!Capacitor.isNativePlatform()) {
    console.log("Notification permissions request skipped on web.");
    // You might want to request browser Notification API permission here
    return true; // Assume allowed or handle web specifics
  }
  try {
    const result: PermissionStatus = await LocalNotifications.requestPermissions();
    console.log('Native notification permission request result:', result.display);
    return result.display === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// --- Scheduling Logic ---

// Define prayer keys based on the IDs used in the new alertSettings data
// These are prayers that can have a direct Adhan/notification time
// Use only string keys known to exist in AdhanPrayerTimes
const PRAYER_ALERT_KEYS: ReadonlyArray<keyof AdhanPrayerTimes> = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
const IQAMA_KEYS: ReadonlyArray<keyof AdhanPrayerTimes> = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']; // Prayers that can have Iqama
const AZKAR_KEYS: string[] = ['morning-athkar', 'evening-athkar', 'misc-athkar']; // These are setting IDs, not prayer time keys directly
const REMINDER_KEYS: string[] = ['friday-sunnahs', 'white-days']; // Setting IDs
const SPECIAL_TIMING_KEYS: string[] = ['last-third', 'duha']; // Setting IDs requiring custom calculation

// Map alert setting IDs to adhan.js AdhanPrayerTimes properties (ensure keys are valid strings)
const prayerTimePropMap: { [key: string]: keyof AdhanPrayerTimes | null } = {
  fajr: 'fajr',
  sunrise: 'sunrise', // Used for Duha calculation base
  dhuhr: 'dhuhr', // Used for Duha 'before' calculation base and Evening Azkar base
  asr: 'asr',
  maghrib: 'maghrib', // Used for Last Third calculation base
  isha: 'isha',
  // 'last-third' and 'duha' need calculation, not direct mapping from this map
  'last-third': null, // Base time (Maghrib) handled in SPECIAL_TIMING_KEYS logic
  'duha': null,       // Base time (Sunrise/Dhuhr) handled in SPECIAL_TIMING_KEYS logic
  // Azkar base times (map setting ID to the prayer time used as base)
  'morning-athkar': 'fajr',
  'evening-athkar': 'asr', // Changed from dhuhr to asr to match user expectations
  // 'misc-athkar' doesn't use a prayer time base
};


// --- Unique ID Generation --- (Keep as is, maybe adjust prefixes if needed)
// Use prefixes or ranges to avoid collisions
const ID_PREFIX_PRAYER = 1000;
const ID_PREFIX_IQAMA = 2000;
const ID_PREFIX_AZKAR = 3000;
const ID_PREFIX_REMINDER = 4000;
const ID_PREFIX_CUSTOM = 5000; // Prefix for custom relative alerts

// Helper to generate unique IDs based on type and index/key
const generateNotificationId = (type: 'prayer' | 'iqama' | 'azkar' | 'reminder' | 'custom', key: string, dayOffset: number = 0): number => {
    // Simple hash function for the key (can be improved)
    let keyHash = 0;
    for (let i = 0; i < key.length; i++) {
        keyHash = (keyHash << 5) - keyHash + key.charCodeAt(i);
        keyHash |= 0; // Convert to 32bit integer
    }
    keyHash = Math.abs(keyHash) % 100; // Keep it within a reasonable range (0-99)

    const dayMultiplier = dayOffset === 0 ? 0 : 500; // Offset IDs for the next day significantly

    switch (type) {
        case 'prayer': return ID_PREFIX_PRAYER + keyHash + dayMultiplier;
        case 'iqama': return ID_PREFIX_IQAMA + keyHash + dayMultiplier;
        case 'azkar': return ID_PREFIX_AZKAR + keyHash + dayMultiplier;
        case 'reminder': return ID_PREFIX_REMINDER + keyHash + dayMultiplier;
        case 'custom': return ID_PREFIX_CUSTOM + keyHash + dayMultiplier;
        default: return Math.floor(Math.random() * 10000); // Fallback random ID
    }
};

/**
 * Schedules prayer notifications for the next 24 hours based on settings.
 * Cancels existing notifications before scheduling new ones.
 * @param {AppSettings} settings - Current app settings (for location, method, iqama offsets).
 * @param {AlertSetting[]} alertSettings - Current alert settings (from context).
 * @param {string} lang - Current language ('ar' or 'en').
 * @param {(key: string, lang: 'ar' | 'en') => string} translateFn - Function to translate keys.
 */
export const schedulePrayerNotifications = async (
    settings: AppSettings, // Keep for location, method, iqama offsets
    alertSettings: AlertSetting[], // <-- أضف هذا الباراميتر
    lang: 'ar' | 'en',
    translateFn: (key: string, lang: 'ar' | 'en') => string
): Promise<void> => {

  // Only schedule native notifications on native platforms
  if (!Capacitor.isNativePlatform()) {
    console.log("Native notification scheduling skipped on web.");
    return;
  }

  const hasPermission = await checkNotificationPermission();
  if (!hasPermission) {
    console.log('Native notification permission not granted. Cannot schedule.');
    // Optionally request permission again here if desired
    return;
  }

  // Cancel existing native notifications
  await cancelAllNotifications();

  // --- Load Alert Settings from Storage ---
  const storedAlertSettings = alertSettings; // استخدم الإعدادات الممررة
  const customRelativeAlerts = getCustomAlertsFromStorage(); // Load custom alerts

  // --- Get Prayer Times ---
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Use location/method from AppSettings
  const coordinates = new Coordinates(settings.location.latitude, settings.location.longitude);
  const params = CalculationMethod[settings.location.method as keyof typeof CalculationMethod]?.() ?? CalculationMethod.Other();

  const prayerTimesToday = new AdhanPrayerTimes(coordinates, today, params);
  const prayerTimesTomorrow = new AdhanPrayerTimes(coordinates, tomorrow, params);

  const notificationsToSchedule: LocalNotificationSchema[] = [];
  const now = new Date();

  // --- Main Scheduling Loop for Today and Tomorrow ---
  [prayerTimesToday, prayerTimesTomorrow].forEach((prayerTimesInstance, dayIndex) => {

      // --- Schedule Prayer, Pre-Prayer, and Iqama Notifications ---
      PRAYER_ALERT_KEYS.forEach((prayerKey) => { // Iterate using defined prayer keys
          const alertSetting = storedAlertSettings.find(s => s.id === prayerKey);
          if (!alertSetting?.enabled) return; // Skip if this prayer alert is disabled

          const prayerTimeProp = prayerTimePropMap[prayerKey];
          if (!prayerTimeProp) {
              console.warn(`No adhan.js mapping for prayer key: ${prayerKey}`);
              return;
          }
          // Explicitly type baseTime as Date | null
          const baseTime: Date | null = prayerTimesInstance[prayerTimeProp] as Date | null;
          if (!baseTime || !(baseTime instanceof Date)) { // Add check to ensure it's a Date object
              console.warn(`Could not get valid base time (Date) for ${prayerKey}`);
              return;
          }

          // 1. Schedule Main Prayer Alert (Adhan)
          if (baseTime instanceof Date && baseTime > now) {
              const soundFilename = getSoundFilenameForNotification(String(prayerKey), 'main', storedAlertSettings);
              const title = alertSetting.nameArabic || translateFn(String(prayerKey), lang);
              const body = lang === 'ar' ? `حان الآن وقت ${title}` : `It's time for ${title}`;

              notificationsToSchedule.push({
                  id: generateNotificationId('prayer', String(prayerKey), dayIndex),
                  title: title,
                  body: body,
                  schedule: { at: baseTime, allowWhileIdle: true },
                  sound: soundFilename,
                  channelId: soundFilename ? 'custom_sound_channel' : undefined,
                  extra: { type: 'prayer', name: String(prayerKey) }
              });
          }

          // 2. Schedule Pre-Prayer Alert (for all prayers that support it)
          if (alertSetting.preAlertEnabled && alertSetting.preAlertMinutes && alertSetting.preAlertMinutes > 0 && baseTime instanceof Date) {
              const preAlertTime = addMinutes(baseTime, -alertSetting.preAlertMinutes);
              if (preAlertTime > now) {
                  const soundFilename = getSoundFilenameForNotification(String(prayerKey), 'pre', storedAlertSettings);
                  const title = lang === 'ar' ? `${alertSetting.nameArabic} بعد قليل` : `${alertSetting.nameArabic} soon`;
                  const body = lang === 'ar'
                      ? `${alertSetting.nameArabic} بعد ${alertSetting.preAlertMinutes} دقيقة`
                      : `${alertSetting.nameArabic} in ${alertSetting.preAlertMinutes} minutes`;

                  notificationsToSchedule.push({
                      id: generateNotificationId('prayer', `${String(prayerKey)}-pre`, dayIndex),
                      title: title,
                      body: body,
                      schedule: { at: preAlertTime, allowWhileIdle: true },
                      sound: soundFilename,
                      channelId: soundFilename ? 'custom_sound_channel' : undefined,
                      extra: { type: 'pre-prayer', name: String(prayerKey) }
                  });
              }
          }

          // 3. Schedule Iqama Alert
          if (alertSetting.hasIqama && alertSetting.iqamaEnabled && IQAMA_KEYS.includes(prayerKey as keyof AdhanPrayerTimes) && baseTime instanceof Date) {
              const iqamaOffsetMinutes = alertSetting.iqamaOffsetMinutes ?? 10;
              const iqamaTime = addMinutes(baseTime, iqamaOffsetMinutes);
              if (iqamaTime > now) {
                  const soundFilename = getSoundFilenameForNotification(String(prayerKey), 'iqama', storedAlertSettings);
                  const prayerNameTranslated = alertSetting.nameArabic || translateFn(String(prayerKey), lang);
                  const title = lang === 'ar' ? `إقامة ${prayerNameTranslated}` : `Iqamah ${prayerNameTranslated}`;
                  const body = lang === 'ar' ? `إقامة صلاة ${prayerNameTranslated} بعد ${iqamaOffsetMinutes} دقائق` : `Iqamah for ${prayerNameTranslated} prayer in ${iqamaOffsetMinutes} minutes`;

                  notificationsToSchedule.push({
                      id: generateNotificationId('iqama', String(prayerKey), dayIndex),
                      title: title,
                      body: body,
                      schedule: { at: iqamaTime, allowWhileIdle: true },
                      sound: soundFilename,
                      channelId: soundFilename ? 'custom_sound_channel' : undefined,
                      extra: { type: 'iqama', name: String(prayerKey) }
                  });
              }
          }
      }); // End PRAYER_ALERT_KEYS loop

      // --- Schedule Special Timings (Duha, Last Third) ---
      SPECIAL_TIMING_KEYS.forEach((specialKey) => { // specialKey is a string ID like 'duha'
          const alertSetting = storedAlertSettings.find(s => s.id === specialKey);
          if (!alertSetting?.enabled) return;

          let notificationTime: Date | null = null;
          let offsetMinutes = 0; // Default offset relative to calculated base

          const selectedTimeOption = alertSetting.alertTimes?.find(t => t.enabled);
          if (selectedTimeOption) {
              const parts = selectedTimeOption.id.split('-');
              const timePart = parts.find(p => p.endsWith('min') || p.endsWith('hour'));
              const isBefore = parts.includes('before');
              if (timePart) {
                  if (timePart.endsWith('min')) {
                      offsetMinutes = parseInt(timePart.replace('min', ''), 10);
                  } else if (timePart.endsWith('hour')) {
                      offsetMinutes = parseInt(timePart.replace('hour', ''), 10) * 60;
                  }
                  if (isBefore) offsetMinutes = -offsetMinutes;
              }
          } else {
              if (specialKey === 'last-third') offsetMinutes = 0; // Default for last third
              else { console.log(`No specific time selected for ${specialKey}, skipping.`); return; }
          }

          // Calculate base time and apply offset
          if (specialKey === 'duha') {
              const sunriseTime = prayerTimesInstance.sunrise;
              const dhuhrTime = prayerTimesInstance.dhuhr;

              if (sunriseTime instanceof Date && dhuhrTime instanceof Date) {
                  // Special case for quarter-day (best time for Duha)
                  if (selectedTimeOption && selectedTimeOption.id === "duha-quarter-day") {
                      // Calculate quarter of the day (middle point between sunrise and dhuhr)
                      const dayDurationMillis = dhuhrTime.getTime() - sunriseTime.getTime();
                      const quarterDayMillis = sunriseTime.getTime() + (dayDurationMillis / 2);
                      notificationTime = new Date(quarterDayMillis);
                  } else {
                      // Determine base time based on user selection
                      const baseTime = offsetMinutes < 0 ? dhuhrTime : sunriseTime;

                      // Calculate notification time
                      notificationTime = addMinutes(baseTime, offsetMinutes);
                  }

                  // Calculate minimum valid Duha time (15-20 minutes after sunrise)
                  // This ensures Duha prayer is after the sun has risen "a spear's length" (قيد رمح)
                  const minDuhaTime = addMinutes(sunriseTime, 15);

                  // Validate that the time is within the valid window for Duha
                  if (!(notificationTime >= minDuhaTime && notificationTime < dhuhrTime)) {
                      console.warn(`Calculated Duha time (${notificationTime}) is outside the valid window (15 min after Sunrise to Dhuhr).`);

                      // If invalid, set to a reasonable default (30 minutes after sunrise)
                      notificationTime = addMinutes(sunriseTime, 30);
                      console.log(`Adjusted to default Duha time: ${notificationTime}`);
                  }
              }
          } else if (specialKey === 'last-third') {
              const maghribTime = prayerTimesInstance.maghrib;
              const nextDayPrayerTimes = (dayIndex === 0) ? prayerTimesTomorrow : new AdhanPrayerTimes(coordinates, new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000), params);
              const fajrOfNextDay = nextDayPrayerTimes.fajr;
              if (maghribTime instanceof Date && fajrOfNextDay instanceof Date) {
                  const nightDurationMillis = fajrOfNextDay.getTime() - maghribTime.getTime();
                  if (nightDurationMillis > 0) {
                      const lastThirdStartTimeMillis = maghribTime.getTime() + (nightDurationMillis * 2 / 3);
                      const calculatedStartTime = new Date(lastThirdStartTimeMillis);
                      notificationTime = addMinutes(calculatedStartTime, offsetMinutes);
                  }
              }
          }

          if (notificationTime && notificationTime > now) {
              const soundFilename = getSoundFilenameForNotification(specialKey, 'main', storedAlertSettings);
              const title = alertSetting.nameArabic || translateFn(specialKey, lang);
              const body = lang === 'ar' ? `حان الآن وقت ${title}` : `It's time for ${title}`;
              notificationsToSchedule.push({
                  id: generateNotificationId('prayer', specialKey, dayIndex),
                  title: title,
                  body: body,
                  schedule: { at: notificationTime, allowWhileIdle: true },
                  sound: soundFilename,
                  channelId: soundFilename ? 'custom_sound_channel' : undefined,
                  extra: { type: 'special-timing', name: specialKey }
              });
          }
      }); // End SPECIAL_TIMING_KEYS loop

      // --- Schedule Azkar Notifications ---
      AZKAR_KEYS.forEach((azkarKey) => { // azkarKey is a string ID like 'morning-athkar'
          const alertSetting = storedAlertSettings.find(s => s.id === azkarKey);
          if (!alertSetting?.enabled) return;

          let baseTime: Date | null = null;
          let offsetMinutes = 0;

          const basePrayerProp = prayerTimePropMap[azkarKey];
          if (basePrayerProp) {
              baseTime = prayerTimesInstance[basePrayerProp] as Date | null;
          }

          const selectedTimeOption = alertSetting.alertTimes?.find(t => t.enabled);

          if (azkarKey === 'morning-athkar' || azkarKey === 'evening-athkar') {
              if (selectedTimeOption && baseTime instanceof Date) {
                  const parts = selectedTimeOption.id.split('-');
                  const timePart = parts.find(p => p.endsWith('min') || p.endsWith('hour'));
                  if (timePart) {
                      if (timePart.endsWith('min')) offsetMinutes = parseInt(timePart.replace('min', ''), 10);
                      else if (timePart.endsWith('hour')) offsetMinutes = parseInt(timePart.replace('hour', ''), 10) * 60;
                  }
              } else {
                  console.log(`No specific time selected or invalid base time for ${azkarKey}, skipping.`);
                  return;
              }
          } else if (azkarKey === 'misc-athkar') {
              const fixedTimes = [9, 12, 15, 18];
              fixedTimes.forEach((hour, index) => {
                  const time = new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayIndex, hour, 0);
                  if (time > now) {
                      const soundFilename = getSoundFilenameForNotification(azkarKey, 'main', storedAlertSettings);
                      const title = alertSetting.nameArabic || translateFn(azkarKey, lang);
                      const body = lang === 'ar' ? `لا تنس ${title}` : `Don't forget ${title}`;
                      notificationsToSchedule.push({
                          id: generateNotificationId('azkar', `${azkarKey}-${index}`, dayIndex),
                          title: title, body: body, schedule: { at: time, allowWhileIdle: true },
                          sound: soundFilename, channelId: soundFilename ? 'custom_sound_channel' : undefined,
                          extra: { type: 'azkar', name: azkarKey }
                      });
                  }
              });
              return; // Skip rest for misc-athkar
          }

          if (!baseTime) { // Should only be null for misc-athkar which returned above
             console.warn(`Could not determine base time for Azkar: ${azkarKey}`);
             return;
          }

          const notificationTime = addMinutes(baseTime, offsetMinutes);

          // Validate Azkar times
          let isValid = false;
          const fajrTime = prayerTimesInstance.fajr;
          const dhuhrTime = prayerTimesInstance.dhuhr;
          const asrTime = prayerTimesInstance.asr;
          const maghribTime = prayerTimesInstance.maghrib;

          if (azkarKey === 'morning-athkar' && fajrTime instanceof Date && dhuhrTime instanceof Date) {
              // Morning Azkar should be between Fajr and Dhuhr
              isValid = notificationTime >= fajrTime && notificationTime < dhuhrTime;
          } else if (azkarKey === 'evening-athkar' && asrTime instanceof Date && maghribTime instanceof Date) {
              // Evening Azkar should be between Asr and Maghrib
              isValid = notificationTime >= asrTime && notificationTime < maghribTime;
          }

          if (isValid && notificationTime > now) {
              const soundFilename = getSoundFilenameForNotification(azkarKey, 'main', storedAlertSettings);
              const title = alertSetting.nameArabic || translateFn(azkarKey, lang);
              const body = lang === 'ar' ? `لا تنس ${title}` : `Don't forget ${title}`;
              notificationsToSchedule.push({
                  id: generateNotificationId('azkar', azkarKey, dayIndex),
                  title: title, body: body, schedule: { at: notificationTime, allowWhileIdle: true },
                  sound: soundFilename, channelId: soundFilename ? 'custom_sound_channel' : undefined,
                  extra: { type: 'azkar', name: azkarKey }
              });
          } else if (!isValid) {
              console.warn(`Calculated time for ${azkarKey} (${notificationTime}) is outside its valid window.`);
          }
      }); // End AZKAR_KEYS loop

      // --- Schedule Reminder Notifications ---
      REMINDER_KEYS.forEach((reminderKey) => { // reminderKey is string ID
          const alertSetting = storedAlertSettings.find(s => s.id === reminderKey);
          if (!alertSetting?.enabled) return;

          const dateForCalculation = (dayIndex === 0) ? today : tomorrow;

          if (reminderKey === 'friday-sunnahs') {
              const isThursday = dateForCalculation.getDay() === 4;
              const isFriday = dateForCalculation.getDay() === 5;
              if (!isThursday && !isFriday) return;
              const times = [];
              if (isThursday) times.push(new Date(dateForCalculation.getFullYear(), dateForCalculation.getMonth(), dateForCalculation.getDate(), 18, 0)); // Thu 6 PM
              if (isFriday) times.push(new Date(dateForCalculation.getFullYear(), dateForCalculation.getMonth(), dateForCalculation.getDate(), 8, 0)); // Fri 8 AM
              times.forEach((time, index) => {
                  if (time > now) {
                      const soundFilename = getSoundFilenameForNotification(reminderKey, 'main', storedAlertSettings);
                      const title = alertSetting.nameArabic || translateFn(reminderKey, lang);
                      const body = lang === 'ar' ? `تذكير: ${title}` : `Reminder: ${title}`;
                      notificationsToSchedule.push({
                          id: generateNotificationId('reminder', `${reminderKey}-${index}`, dayIndex),
                          title: title, body: body, schedule: { at: time, allowWhileIdle: true },
                          sound: soundFilename, channelId: soundFilename ? 'custom_sound_channel' : undefined,
                          extra: { type: 'reminder', name: reminderKey }
                      });
                  }
              });
          } else if (reminderKey === 'white-days') {
              // TODO: Implement proper Hijri date checking
              const dayOfMonth = dateForCalculation.getDate();
              if (dayOfMonth !== 13 && dayOfMonth !== 14 && dayOfMonth !== 15) return;
              const notificationTime = new Date(dateForCalculation.getFullYear(), dateForCalculation.getMonth(), dateForCalculation.getDate(), 6, 0); // 6 AM
              if (notificationTime > now) {
                  const soundFilename = getSoundFilenameForNotification(reminderKey, 'main', storedAlertSettings);
                  const title = alertSetting.nameArabic || translateFn(reminderKey, lang);
                  const body = lang === 'ar' ? `تذكير: ${title}` : `Reminder: ${title}`;
                  notificationsToSchedule.push({
                      id: generateNotificationId('reminder', reminderKey, dayIndex),
                      title: title, body: body, schedule: { at: notificationTime, allowWhileIdle: true },
                      sound: soundFilename, channelId: soundFilename ? 'custom_sound_channel' : undefined,
                      extra: { type: 'reminder', name: reminderKey }
                  });
              }
          }
      }); // End REMINDER_KEYS loop

      // --- Schedule Custom Relative Alerts ---
      customRelativeAlerts.forEach((customAlert: CustomRelativeAlert) => {
          if (!customAlert.enabled) return;

          const basePrayerKey = customAlert.basePrayer as keyof AdhanPrayerTimes;
          if (!(basePrayerKey in prayerTimesInstance)) {
              console.warn(`Invalid basePrayer key '${basePrayerKey}' found in custom alert '${customAlert.id}'. Skipping.`);
              return;
          }
          const basePrayerTime = prayerTimesInstance[basePrayerKey] as Date | null;

          if (basePrayerTime instanceof Date) {
              const notificationTime = addMinutes(basePrayerTime, customAlert.offsetMinutes);
              if (notificationTime > now) {
                  const soundFilename = getSoundFilenameForCustomAlert(customAlert.soundId);
                  const title = customAlert.label || (lang === 'ar' ? 'تنبيه مخصص' : 'Custom Alert');
                  const body = lang === 'ar' ? `الوقت المحدد لـ "${customAlert.label}"` : `Scheduled time for "${customAlert.label}"`;
                  notificationsToSchedule.push({
                      id: generateNotificationId('custom', customAlert.id, dayIndex),
                      title: title, body: body, schedule: { at: notificationTime, allowWhileIdle: true },
                      sound: soundFilename, channelId: soundFilename ? 'custom_sound_channel' : undefined,
                      extra: { type: 'custom-relative', name: customAlert.id, basePrayer: customAlert.basePrayer, offset: customAlert.offsetMinutes }
                  });
              }
          } else {
              console.warn(`Could not get valid base time for custom alert '${customAlert.id}' based on prayer '${customAlert.basePrayer}'.`);
          }
      }); // End customRelativeAlerts loop

  }); // End loop over [prayerTimesToday, prayerTimesTomorrow]


   // --- Schedule All ---
   if (notificationsToSchedule.length > 0) {
     try {
       notificationsToSchedule.sort((a, b) => a.schedule!.at!.getTime() - b.schedule!.at!.getTime());

       // Ensure channels exist on Android
       if (Capacitor.getPlatform() === 'android') {
         // Prayer notifications channel
         await LocalNotifications.createChannel({
           id: 'prayer_notifications',
           name: 'Prayer Times',
           description: 'Notifications for prayer times',
           importance: 5,
           visibility: 1,
           vibration: true,
           lights: true,
         });

         // Athkar notifications channel
         await LocalNotifications.createChannel({
           id: 'athkar_notifications',
           name: 'Athkar Reminders',
           description: 'Notifications for morning and evening athkar',
           importance: 5,
           visibility: 1,
           vibration: true,
           lights: true,
         });

         // Custom sound channel
         await LocalNotifications.createChannel({
           id: 'custom_sound_channel', // Must match channelId used above
           name: 'Custom Sound Notifications',
           description: 'Notifications with custom sounds',
           importance: 5, // Max importance
           sound: undefined, // Sound is set per notification
           visibility: 1, // Public visibility
           vibration: true,
           lights: true,
         });

         console.log("Notification channels created/verified.");
       }

      const scheduleResult = await LocalNotifications.schedule({ notifications: notificationsToSchedule });
      console.log('Scheduled native notifications IDs:', scheduleResult.notifications.map(n => n.id));
      // Detailed logging:
      notificationsToSchedule.forEach(n => console.log(`  ID: ${n.id}, Time: ${n.schedule?.at?.toISOString()}, Sound: ${n.sound}, Title: ${n.title}`));

      // Also schedule Athkar notifications
      await scheduleAthkarNotifications(settings, storedAlertSettings, lang);
    } catch (error) {
      console.error('Error scheduling notifications:', error);
      // Consider showing a toast message to the user about the failure
    }
  } else {
    console.log('No prayer notifications to schedule for the upcoming period or notifications disabled.');

    // Still schedule Athkar notifications even if no prayer notifications
    try {
      await scheduleAthkarNotifications(settings, storedAlertSettings, lang);
    } catch (error) {
      console.error('Error scheduling Athkar notifications:', error);
    }
  }
};

/**
 * Cancels all previously scheduled native local notifications.
 */
const cancelAllNotifications = async (): Promise<void> => {
   if (!Capacitor.isNativePlatform()) {
    console.log("Native notification cancellation skipped on web.");
    return;
  }
  try {
    const pending: PendingResult = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      console.log('Cancelling pending native notifications IDs:', pending.notifications.map(n => n.id));
      await LocalNotifications.cancel({ notifications: pending.notifications });
    } else {
      console.log('No pending native notifications to cancel.');
    }
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

/**
 * Sets up notification click handlers to navigate to the appropriate pages
 * @param navigate Function to navigate to a different route
 */
export const setupNotificationClickHandlers = (navigate: (route: string) => void): void => {
  if (!Capacitor.isNativePlatform()) {
    console.log("Notification click handlers skipped on web platform");
    return;
  }

  // Listen for notification clicks
  LocalNotifications.addListener('localNotificationActionPerformed',
    (notification: ActionPerformed) => {
      console.log('Notification clicked:', notification);

      // Extract navigation data from notification
      const extra = notification.notification.extra;
      if (!extra) return;

      // Handle different notification types
      const type = extra.type as string;
      const name = extra.name as string;

      if (type === 'prayer' || type === 'iqama' || type === 'pre-prayer' || type === 'special-timing') {
        // Navigate to prayer time details
        navigate(`/prayer-times`);
      } else if (type === 'azkar') {
        if (name === 'morning-athkar') {
          // Navigate to morning athkar
          navigate(`/category/morning`);
        } else if (name === 'evening-athkar') {
          // Navigate to evening athkar
          navigate(`/category/evening`);
        } else if (name === 'misc-athkar') {
          // Navigate to home page
          navigate(`/`);
        }
      } else if (type === 'reminder') {
        // Navigate to home page
        navigate(`/`);
      } else if (type === 'custom-relative') {
        // Navigate to prayer times
        navigate(`/prayer-times`);
      }
    }
  );

  // Listen for received notifications (optional, for debugging)
  LocalNotifications.addListener('localNotificationReceived',
    (notification) => {
      console.log('Notification received:', notification);
    }
  );
};

// --- Helpers ---

// Helper to get sound filename for custom alerts (simplified version)
// Assumes customAlertSoundId directly maps to an ID in alertSounds
const getSoundFilenameForCustomAlert = (customAlertSoundId: string): string | undefined => {
    if (!customAlertSoundId || customAlertSoundId === 'none') {
        return undefined; // No sound
    }

    let soundIdToUse = customAlertSoundId;

    // Fallback to default if 'default' is selected or ID is invalid
    if (soundIdToUse === 'default') {
        soundIdToUse = HARDCODED_DEFAULT_SOUND_ID;
    }

    let finalSound = alertSounds.find((s) => s.id === soundIdToUse);

    // Final fallback if the ID (even default) isn't found
    if (!finalSound) {
        console.warn(`Sound ID '${soundIdToUse}' for custom alert not found, falling back to hardcoded default '${HARDCODED_DEFAULT_SOUND_ID}'.`);
        finalSound = alertSounds.find((s) => s.id === HARDCODED_DEFAULT_SOUND_ID);
        if (!finalSound) {
             console.error(`CRITICAL: Hardcoded default sound '${HARDCODED_DEFAULT_SOUND_ID}' could not be found.`);
             return undefined;
        }
    }

    // Extract filename (same logic as the other helper)
    if (finalSound?.path) {
        try {
            const parts = finalSound.path.split('/');
            const filename = parts[parts.length - 1];

            // Log sound selection for debugging
            console.log(`Custom sound selected: ${finalSound.id} - ${filename}`);

            if (Capacitor.getPlatform() === 'android') {
               const dotIndex = filename.lastIndexOf('.');
               return dotIndex > 0 ? filename.substring(0, dotIndex) : filename;
            } else {
               return filename;
            }
        } catch (e) {
            console.error(`Error extracting filename from path: ${finalSound.path}`, e);
            return undefined;
        }
    } else {
        console.warn(`Custom sound object found (${finalSound?.id}) but no path property exists.`);
    }
    return undefined;
};


/**
 * Determines the sound filename for a notification based on stored settings and the type of alert.
 * @param settingId The ID of the alert setting (e.g., 'fajr', 'morning-athkar').
 * @param soundType The type of sound needed ('main', 'pre', 'iqama').
 * @param storedSettings The array of all alert settings loaded from storage.
 * @returns The sound filename (e.g., 'adhan-makkah1.mp3') or undefined.
 */
const getSoundFilenameForNotification = (
    settingId: string,
    soundType: 'main' | 'pre' | 'iqama',
    storedSettings: AlertSetting[]
): string | undefined => {
    const targetSetting = storedSettings.find((s) => s.id === settingId);
    if (!targetSetting) return undefined; // Setting not found

    let soundIdToUse: string | undefined;

    // Determine which sound property to use based on soundType
    let targetSpecificSoundId: string | undefined;
    switch (soundType) {
        case 'pre':
            targetSpecificSoundId = targetSetting.preAlertSound;
            break;
        case 'iqama':
            targetSpecificSoundId = targetSetting.iqamaSound;
            break;
        case 'main':
        default:
            targetSpecificSoundId = targetSetting.selectedSound;
            break;
    }

    // Logic to decide the final sound ID (specific > default > none)
    if (targetSpecificSoundId && targetSpecificSoundId !== "default" && targetSpecificSoundId !== "none") {
        // Case 1: Specific sound type has a specific sound selected (not 'default' or 'none')
        soundIdToUse = targetSpecificSoundId;
    } else if (targetSpecificSoundId !== "none") {
        // Case 2: Specific sound type uses 'default' or is undefined (and not explicitly 'none')
        // Fallback to the general 'selectedSound' for this alert, if it's not 'none' or 'default'
        if (targetSetting.selectedSound && targetSetting.selectedSound !== "default" && targetSetting.selectedSound !== "none") {
            soundIdToUse = targetSetting.selectedSound;
        } else {
             // If general selectedSound is also default/none/undefined, use hardcoded default
             soundIdToUse = HARDCODED_DEFAULT_SOUND_ID;
             console.log(`Sound for ${settingId} (${soundType}) falling back to hardcoded default.`);
        }
    }
    // Case 3: Specific sound type is explicitly 'none' -> soundIdToUse remains undefined

    if (!soundIdToUse) {
        console.log(`No sound selected ('none') for ${settingId} (${soundType}).`);
        return undefined; // Explicitly no sound
    }

    // Find the actual sound object based on the determined ID
    let finalSound = alertSounds.find((s) => s.id === soundIdToUse);

    // Final check: If the determined sound ID doesn't exist in alertSounds, use hardcoded default
    if (!finalSound) {
        console.warn(`Sound ID '${soundIdToUse}' for setting '${settingId}' (${soundType}) not found in alertSounds, falling back to hardcoded default '${HARDCODED_DEFAULT_SOUND_ID}'.`);
        finalSound = alertSounds.find((s) => s.id === HARDCODED_DEFAULT_SOUND_ID);
        if (!finalSound) {
             console.error(`CRITICAL: Hardcoded default sound '${HARDCODED_DEFAULT_SOUND_ID}' could not be found.`);
             return undefined; // Critical error: default sound is missing
        }
    }

    // Extract filename from path for Capacitor (e.g., "/sounds/foo.mp3" -> "foo.mp3")
    if (finalSound?.path) {
        try {
            // Basic extraction assuming simple path structure
            const parts = finalSound.path.split('/');
            const filename = parts[parts.length - 1];

            // Log sound selection for debugging
            console.log(`Sound selected for ${settingId} (${soundType}): ${finalSound.id} - ${filename}`);

            // Capacitor on Android needs the name without the extension for resource lookup in res/raw
            if (Capacitor.getPlatform() === 'android') {
               const dotIndex = filename.lastIndexOf('.');
               return dotIndex > 0 ? filename.substring(0, dotIndex) : filename;
            } else {
               // iOS might need the full filename
               return filename;
            }
        } catch (e) {
            console.error(`Error extracting filename from path: ${finalSound.path}`, e);
            return undefined;
        }
    } else {
        console.warn(`Sound object found (${finalSound?.id}) but no path property exists.`);
    }

    return undefined; // No sound selected or error
};
