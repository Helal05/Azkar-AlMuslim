import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { AppSettings } from '../contexts/AppSettingsContext';
import { AlertSetting } from '../types';
import { format, addMinutes } from 'date-fns';
import { getPrayerTimes } from '../data/prayerData';

// Constants for notification IDs
const MORNING_ATHKAR_PREFIX = 3000;
const EVENING_ATHKAR_PREFIX = 4000;

/**
 * Generates a unique notification ID for athkar
 * @param type 'morning' or 'evening'
 * @param dayOffset Day offset (0 for today, 1 for tomorrow)
 * @returns Unique notification ID
 */
const generateAthkarNotificationId = (type: 'morning' | 'evening', dayOffset: number = 0): number => {
  const baseId = type === 'morning' ? MORNING_ATHKAR_PREFIX : EVENING_ATHKAR_PREFIX;
  return baseId + (dayOffset * 100);
};

/**
 * Schedules athkar notifications based on user settings
 * @param settings App settings
 * @param alertSettings Alert settings
 * @param language App language
 */
export const scheduleAthkarNotifications = async (
  settings: AppSettings,
  alertSettings: AlertSetting[],
  language: 'ar' | 'en'
): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    console.log("Native notification scheduling skipped on web.");
    return;
  }

  // Get prayer times for reference
  const prayerTimes = getPrayerTimes(
    settings.location.latitude, 
    settings.location.longitude, 
    settings.location.method, 
    language
  );

  const notificationsToSchedule: LocalNotificationSchema[] = [];
  const now = new Date();

  // Find morning athkar settings
  const morningAthkarSetting = alertSettings.find(s => s.id === 'morning-athkar');
  if (morningAthkarSetting?.enabled) {
    // Find the selected time option
    const selectedTimeOption = morningAthkarSetting.alertTimes?.find(t => t.enabled);
    if (selectedTimeOption) {
      // Find Fajr prayer time as reference
      const fajrPrayer = prayerTimes.find(p => p.name.toLowerCase() === 'fajr');
      if (fajrPrayer) {
        // Parse the prayer time
        const [fajrHour, fajrMinute] = fajrPrayer.time.split(':').map(Number);
        const fajrTime = new Date();
        fajrTime.setHours(fajrHour, fajrMinute, 0, 0);

        // Calculate notification time based on selected option
        let notificationTime = new Date(fajrTime);
        const parts = selectedTimeOption.id.split('-');
        const timePart = parts.find(p => p.endsWith('min') || p.endsWith('hour'));
        
        if (timePart) {
          let offsetMinutes = 0;
          if (timePart.endsWith('min')) {
            offsetMinutes = parseInt(timePart.replace('min', ''), 10);
          } else if (timePart.endsWith('hour')) {
            offsetMinutes = parseInt(timePart.replace('hour', ''), 10) * 60;
          }
          notificationTime = addMinutes(fajrTime, offsetMinutes);
        }

        // Schedule notification if it's in the future
        if (notificationTime > now) {
          const title = language === 'ar' ? 'أذكار الصباح' : 'Morning Athkar';
          const body = language === 'ar' ? 'حان وقت أذكار الصباح' : 'Time for morning remembrances';

          notificationsToSchedule.push({
            id: generateAthkarNotificationId('morning'),
            title,
            body,
            schedule: { at: notificationTime, allowWhileIdle: true },
            sound: morningAthkarSetting.selectedSound || 'default',
            channelId: 'athkar_notifications',
            extra: {
              type: 'azkar',
              name: 'morning-athkar'
            }
          });
        }
      }
    }
  }

  // Find evening athkar settings
  const eveningAthkarSetting = alertSettings.find(s => s.id === 'evening-athkar');
  if (eveningAthkarSetting?.enabled) {
    // Find the selected time option
    const selectedTimeOption = eveningAthkarSetting.alertTimes?.find(t => t.enabled);
    if (selectedTimeOption) {
      // Find Asr prayer time as reference
      const asrPrayer = prayerTimes.find(p => p.name.toLowerCase() === 'asr');
      if (asrPrayer) {
        // Parse the prayer time
        const [asrHour, asrMinute] = asrPrayer.time.split(':').map(Number);
        const asrTime = new Date();
        asrTime.setHours(asrHour, asrMinute, 0, 0);

        // Calculate notification time based on selected option
        let notificationTime = new Date(asrTime);
        const parts = selectedTimeOption.id.split('-');
        const timePart = parts.find(p => p.endsWith('min') || p.endsWith('hour'));
        
        if (timePart) {
          let offsetMinutes = 0;
          if (timePart.endsWith('min')) {
            offsetMinutes = parseInt(timePart.replace('min', ''), 10);
          } else if (timePart.endsWith('hour')) {
            offsetMinutes = parseInt(timePart.replace('hour', ''), 10) * 60;
          }
          notificationTime = addMinutes(asrTime, offsetMinutes);
        }

        // Schedule notification if it's in the future
        if (notificationTime > now) {
          const title = language === 'ar' ? 'أذكار المساء' : 'Evening Athkar';
          const body = language === 'ar' ? 'حان وقت أذكار المساء' : 'Time for evening remembrances';

          notificationsToSchedule.push({
            id: generateAthkarNotificationId('evening'),
            title,
            body,
            schedule: { at: notificationTime, allowWhileIdle: true },
            sound: eveningAthkarSetting.selectedSound || 'default',
            channelId: 'athkar_notifications',
            extra: {
              type: 'azkar',
              name: 'evening-athkar'
            }
          });
        }
      }
    }
  }

  // Schedule all notifications
  if (notificationsToSchedule.length > 0) {
    try {
      await LocalNotifications.schedule({ notifications: notificationsToSchedule });
      console.log('Successfully scheduled athkar notifications');
    } catch (error) {
      console.error('Error scheduling athkar notifications:', error);
    }
  }
};
