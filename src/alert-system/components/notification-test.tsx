import React, { useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';
import { Play, Bell, Clock } from 'lucide-react';

interface NotificationTestProps {
  prayerName: string;
  soundId?: string;
}

export const NotificationTest: React.FC<NotificationTestProps> = ({
  prayerName,
  soundId
}) => {
  const [isScheduling, setIsScheduling] = useState(false);

  const scheduleTestNotification = async (type: 'main' | 'pre' | 'iqama') => {
    if (!Capacitor.isNativePlatform()) {
      toast.error('اختبار الإشعارات متاح فقط على الأجهزة المحمولة');
      return;
    }

    setIsScheduling(true);

    try {
      // Create notification channel for Android
      if (Capacitor.getPlatform() === 'android') {
        await LocalNotifications.createChannel({
          id: 'test_notifications',
          name: 'Test Notifications',
          description: 'Test notifications for prayer alerts',
          importance: 5,
          visibility: 1,
          vibration: true,
          lights: true,
        });
      }

      const now = new Date();
      const testTime = new Date(now.getTime() + 3000); // 3 seconds from now

      let title = '';
      let body = '';

      switch (type) {
        case 'main':
          title = prayerName;
          body = `حان الآن وقت ${prayerName}`;
          break;
        case 'pre':
          title = `${prayerName} بعد قليل`;
          body = `${prayerName} بعد 5 دقائق`;
          break;
        case 'iqama':
          title = `إقامة ${prayerName}`;
          body = `إقامة صلاة ${prayerName} بعد 10 دقائق`;
          break;
      }

      const notification = {
        id: Date.now(),
        title,
        body,
        schedule: { at: testTime, allowWhileIdle: true },
        sound: soundId || undefined,
        channelId: 'test_notifications',
        extra: { 
          type: 'test',
          prayerName,
          alertType: type
        }
      };

      await LocalNotifications.schedule({ notifications: [notification] });
      
      toast.success(`سيصلك إشعار تجريبي خلال 3 ثوان`);
      
    } catch (error) {
      console.error('Error scheduling test notification:', error);
      toast.error('حدث خطأ أثناء جدولة الإشعار التجريبي');
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-md mb-6">
      <div className="p-4 text-right">
        <h3 className="text-lg font-medium mb-3">اختبار الإشعارات</h3>
        <p className="text-gray-400 text-sm mb-4">
          اختبر كيف ستبدو الإشعارات على جهازك
        </p>
        
        <div className="space-y-3">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md p-3 flex items-center justify-between"
            onClick={() => scheduleTestNotification('main')}
            disabled={isScheduling}
          >
            <Bell className="h-5 w-5" />
            <span>اختبار إشعار الأذان</span>
          </button>

          <button
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded-md p-3 flex items-center justify-between"
            onClick={() => scheduleTestNotification('pre')}
            disabled={isScheduling}
          >
            <Clock className="h-5 w-5" />
            <span>اختبار التنبيه المسبق</span>
          </button>

          <button
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-md p-3 flex items-center justify-between"
            onClick={() => scheduleTestNotification('iqama')}
            disabled={isScheduling}
          >
            <Play className="h-5 w-5" />
            <span>اختبار إشعار الإقامة</span>
          </button>
        </div>

        <p className="text-gray-400 text-xs mt-4">
          ملاحظة: لن تسمع الصوت إذا كان الجهاز على الصامت
        </p>
      </div>
    </div>
  );
};
