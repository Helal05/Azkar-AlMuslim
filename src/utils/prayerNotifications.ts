import { LocalNotifications } from '@capacitor/local-notifications';
import { AppSettings } from '../contexts/AppSettingsContext';
import { AlertSetting } from '../types';
import { format, addMinutes } from 'date-fns';
import { Capacitor } from '@capacitor/core';
import { getPrayerTimes } from '../data/prayerData';

// Constants for notification IDs
const PRAYER_NOTIFICATION_PREFIX = 1000;
const IQAMA_NOTIFICATION_PREFIX = 2000;

// Generate unique notification ID for prayers
const generatePrayerNotificationId = (prayerName: string, isIqama: boolean = false, dayOffset: number = 0): number => {
  const baseId = isIqama ? IQAMA_NOTIFICATION_PREFIX : PRAYER_NOTIFICATION_PREFIX;
  const prayerHash = prayerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return baseId + (prayerHash % 100) + (dayOffset * 1000);
};

// Schedule prayer notifications
export const schedulePrayerNotifications = async (
  prayerTimes: any[],
  alertSettings: any[],
  language: 'ar' | 'en'
): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    console.log("Native notification scheduling skipped on web.");
    return;
  }

  // Cancel existing notifications
  await LocalNotifications.cancel({ notifications: [] });

  const notificationsToSchedule = [];

  // Helper function to create notification
  const createNotification = (
    prayerName: string,
    time: string,
    isIqama: boolean = false,
    dayOffset: number = 0
  ) => {
    const alertSetting = alertSettings.find(s => s.id === prayerName.toLowerCase());
    if (!alertSetting?.enabled) return;

    // Convert time string to Date object
    const [hours, minutes] = time.split(':').map(Number);
    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes, 0, 0);
    
    // If the time has passed for today, schedule for tomorrow
    if (notificationTime < new Date()) {
      notificationTime.setDate(notificationTime.getDate() + 1);
    }

    if (isIqama) {
      notificationTime.setMinutes(notificationTime.getMinutes() + (alertSetting.iqamaOffsetMinutes || 10));
    }

    if (notificationTime > new Date()) {
      let title = '';
      let body = '';

      if (prayerName.toLowerCase() === 'sunrise') {
        title = language === 'ar' ? 'وقت صلاة الشروق' : 'Sunrise Prayer Time';
        body = language === 'ar' ? 'حان الآن وقت صلاة الشروق' : 'It\'s time for Sunrise prayer';
      } else {
        title = isIqama
          ? language === 'ar' ? `إقامة صلاة ${alertSetting.nameArabic}` : `Iqamah ${alertSetting.nameArabic}`
          : language === 'ar' ? `حان وقت صلاة ${alertSetting.nameArabic}` : `Time for ${alertSetting.nameArabic}`;

        body = isIqama
          ? language === 'ar' 
            ? `إقامة صلاة ${alertSetting.nameArabic} بعد ${alertSetting.iqamaOffsetMinutes || 10} دقائق`
            : `Iqamah for ${alertSetting.nameArabic} in ${alertSetting.iqamaOffsetMinutes || 10} minutes`
          : language === 'ar'
            ? `حان الآن وقت صلاة ${alertSetting.nameArabic}`
            : `It's time for ${alertSetting.nameArabic}`;
      }

      notificationsToSchedule.push({
        id: generatePrayerNotificationId(prayerName, isIqama, dayOffset),
        title,
        body,
        schedule: { at: notificationTime, allowWhileIdle: true },
        sound: alertSetting.selectedSound || 'default',
        channelId: 'prayer_notifications',
        extra: { 
          type: isIqama ? 'iqama' : 'prayer',
          prayerName: prayerName.toLowerCase()
        }
      });
    }
  };

  // Schedule notifications for today
  prayerTimes.forEach(prayer => {
    const prayerName = prayer.name.toLowerCase();
    const alertSetting = alertSettings.find(s => s.id === prayerName);
    
    // Schedule prayer notification
    createNotification(prayer.name, prayer.time);
    
    // Schedule iqama notifications if enabled and it's not sunrise prayer
    if (prayerName !== 'sunrise' && alertSettings.some(s => s.hasIqama && s.iqamaEnabled)) {
      createNotification(prayer.name, prayer.time, true);
    }
  });

  // Create notification channel for Android
  if (Capacitor.getPlatform() === 'android') {
    await LocalNotifications.createChannel({
      id: 'prayer_notifications',
      name: 'Prayer Times',
      importance: 5,
      visibility: 1,
      vibration: true,
    });
  }

  // Schedule all notifications
  if (notificationsToSchedule.length > 0) {
    try {
      await LocalNotifications.schedule({ notifications: notificationsToSchedule });
      console.log('Successfully scheduled prayer notifications');
    } catch (error) {
      console.error('Error scheduling prayer notifications:', error);
    }
  }
}; 