import { LocalNotifications, ActionPerformed, LocalNotificationSchema } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { AlertSetting } from '../types';

// Navigation types
export interface NavigationData {
  route: string;
  params?: Record<string, string>;
}

/**
 * Initializes notification listeners for handling notification clicks
 * @param navigate Function to navigate to a different route
 */
export const initNotificationListeners = (navigate: (route: string) => void) => {
  if (!Capacitor.isNativePlatform()) {
    console.log("Notification listeners skipped on web platform");
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

      if (type === 'prayer' || type === 'iqama') {
        // Navigate to prayer time details
        navigate(`/prayer-times`);
      } else if (type === 'azkar') {
        if (name === 'morning-athkar') {
          // Navigate to morning athkar
          navigate(`/category/morning`);
        } else if (name === 'evening-athkar') {
          // Navigate to evening athkar
          navigate(`/category/evening`);
        }
      } else if (type === 'special-timing') {
        // Navigate to special timing details
        navigate(`/prayer-times`);
      } else if (type === 'reminder') {
        // Navigate to reminder details
        navigate(`/`);
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

/**
 * Requests notification permissions from the user
 * @returns Promise<boolean> True if permission granted, false otherwise
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    console.log("Notification permission request skipped on web");
    return true;
  }

  try {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Creates notification channels for Android
 */
export const createNotificationChannels = async () => {
  if (Capacitor.getPlatform() !== 'android') {
    return;
  }

  try {
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
      id: 'custom_sound_channel',
      name: 'Custom Sound Notifications',
      description: 'Notifications with custom sounds',
      importance: 5,
      visibility: 1,
      vibration: true,
      lights: true,
    });

    console.log('Notification channels created successfully');
  } catch (error) {
    console.error('Error creating notification channels:', error);
  }
};
