import React, { useState, useEffect, useContext } from "react"; // Added useEffect, useContext
import { useParams, useNavigate } from "react-router-dom";
import { HeaderWithBack } from "../components/layout/header";
import { useAlert } from "../contexts/alert-context";
import { SwitchRTL } from "../components/ui/switch-rtl";
import { TimeSelector } from "../components/time-selector";
import { SoundSelectorButton } from "../components/sound-selector";
// import { TestAlertButton } from "../components/test-alert-button"; // Test button seems removed in provided code
import { IqamaSelector } from "../components/iqama-selector";
import { NotificationTest } from "../components/notification-test";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import * as adhan from 'adhan'; // Import adhan types
import { calculateRelativePrayerTime, formatTimeForDisplay } from '../../utils/prayerTimes'; // Import helpers
import { useAppSettings } from "../../contexts/AppSettingsContext"; // Import the custom hook instead of the context directly
import { AlertTime } from "../types";

const AlertDetailPage = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSetting, updateSetting, updateAlertTime, updatePreAlertMinutes, updatePreAlertEnabled, updateIqamaOffsetMinutes, getSelectedSound } = useAlert();
  // Get settings, prayer times, and loading state from AppSettingsContext
  const { settings: appSettings, prayerTimesData, isLoadingPrayerTimes } = useAppSettings();
  const language = appSettings.language || 'ar';

  // Fetch the specific alert setting for the current page ID
  const setting = getSetting(id);
  const selectedSound = getSelectedSound(id);

  // State for the alert times with calculated text
  const [calculatedAlertTimes, setCalculatedAlertTimes] = useState<AlertTime[]>([]);
  const [selectedTimeIdInternal, setSelectedTimeIdInternal] = useState<string | undefined>(undefined);
  const [preAlertMinutes, setPreAlertMinutes] = useState(setting?.preAlertMinutes || 0);

  // Effect to calculate timeText when prayer times or setting data load/change
  useEffect(() => {
    // Check if prayer times are loading or if setting/alertTimes data is missing
    if (isLoadingPrayerTimes || !setting || !setting.alertTimes || Object.keys(prayerTimesData).length === 0) {
      // Set loading state or default text if data isn't ready
      setCalculatedAlertTimes(setting?.alertTimes?.map(t => ({
        ...t,
        timeText: language === 'ar' ? 'جاري الحساب...' : 'Calculating...'
      })) || []);
      return;
    }

    // Helper function to parse AlertTime id/name and return calculation parameters
    const getCalculationParamsFromAlertTime = (alertTime: AlertTime): { prayerName?: keyof adhan.PrayerTimes, offsetMinutes?: number, type?: 'before' | 'after' } => {
        const id = alertTime.id;
        const name = alertTime.name; // Use name as fallback or primary source if needed

        // Morning Athkar (relative to Fajr)
        if (id.startsWith('morning-')) {
            if (id === 'morning-30min') return { prayerName: 'fajr', offsetMinutes: 30, type: 'after' };
            if (id === 'morning-1hour') return { prayerName: 'fajr', offsetMinutes: 60, type: 'after' };
            if (id === 'morning-2hours') return { prayerName: 'fajr', offsetMinutes: 120, type: 'after' };
            if (id === 'morning-3hours') return { prayerName: 'fajr', offsetMinutes: 180, type: 'after' };
        }

        // Duha Prayer (relative to Sunrise or Dhuhr)
        if (id.startsWith('duha-')) {
            if (id === 'duha-15min') return { prayerName: 'sunrise', offsetMinutes: 15, type: 'after' };
            if (id === 'duha-30min') return { prayerName: 'sunrise', offsetMinutes: 30, type: 'after' };
            if (id === 'duha-30min-before') return { prayerName: 'dhuhr', offsetMinutes: 30, type: 'before' };
            if (id === 'duha-1hour-before') return { prayerName: 'dhuhr', offsetMinutes: 60, type: 'before' };
            if (id === 'duha-2hours-before') return { prayerName: 'dhuhr', offsetMinutes: 120, type: 'before' };
            if (id === 'duha-3hours-before') return { prayerName: 'dhuhr', offsetMinutes: 180, type: 'before' };
        }

        // Evening Athkar (relative to Asr or Maghrib)
        if (id.startsWith('evening-')) {
             if (id === 'evening-30min-after-asr') return { prayerName: 'asr', offsetMinutes: 30, type: 'after' };
             if (id === 'evening-1hour-after-asr') return { prayerName: 'asr', offsetMinutes: 60, type: 'after' };
             if (id === 'evening-2hours-after-asr') return { prayerName: 'asr', offsetMinutes: 120, type: 'after' };
             if (id === 'evening-3hours-after-asr') return { prayerName: 'asr', offsetMinutes: 180, type: 'after' };
             if (id === 'evening-15min-before-maghrib') return { prayerName: 'maghrib', offsetMinutes: 15, type: 'before' };
             if (id === 'evening-30min-before-maghrib') return { prayerName: 'maghrib', offsetMinutes: 30, type: 'before' };
             if (id === 'evening-1hour-before-maghrib') return { prayerName: 'maghrib', offsetMinutes: 60, type: 'before' };
        }

        // Add more parsing logic here if other alert types have relative times

        // Fallback or if it's not a relative time defined above
        console.warn("Could not determine calculation parameters for AlertTime:", id);
        return {};
    };

    const newCalculatedTimes = setting.alertTimes.map((alertTime): AlertTime => {
      let timeText = alertTime.timeText || (language === 'ar' ? 'غير محدد' : 'Not Set'); // Keep original text as fallback

      const { prayerName, offsetMinutes, type } = getCalculationParamsFromAlertTime(alertTime);

      if (prayerName && typeof offsetMinutes === 'number' && type && prayerTimesData[prayerName]) {
         const basePrayerTime = prayerTimesData[prayerName];
         if (basePrayerTime instanceof Date) {
            try {
                const calculatedDate = calculateRelativePrayerTime(basePrayerTime, offsetMinutes, type);
                const displayString = formatTimeForDisplay(calculatedDate, language);
                timeText = language === 'ar' ? `عند الساعة ${displayString}` : `At ${displayString}`;
            } catch (e) {
                console.error("Error calculating time:", e);
                timeText = language === 'ar' ? 'خطأ بالحساب' : 'Calc Error';
            }
         }
      } else {
         // Handle cases where the alertTime doesn't have enough info for calculation
         // Or if it's a fixed time (though the request focuses on relative times)
         // Keep existing timeText if available, otherwise show error/placeholder
         timeText = alertTime.timeText || (language === 'ar' ? 'غير محدد' : 'Not Set');
         console.warn("Could not calculate time for:", alertTime.id, " - missing data or not a relative time.");
      }
      // --- End of Calculation Logic ---


      return {
        ...alertTime,
        timeText: timeText, // Set the calculated or existing/error text
      };
    });

    setCalculatedAlertTimes(newCalculatedTimes);

    // Find the initially selected time ID after calculation
    const currentSelected = newCalculatedTimes.find(time => time.enabled);
    setSelectedTimeIdInternal(currentSelected?.id);

  // Depend on the setting object, prayerTimesData from context, loading state, and language
  }, [setting, prayerTimesData, isLoadingPrayerTimes, language]);

  // Effect to update preAlertMinutes when setting changes
  useEffect(() => {
    if (setting && setting.preAlertMinutes !== undefined) {
      setPreAlertMinutes(setting.preAlertMinutes);
    }
  }, [setting]);


  if (!setting) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center" dir="rtl">
        <p>لم يتم العثور على التنبيه</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 rounded"
          onClick={() => navigate('/')}
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    );
  }

  // Handlers remain mostly the same, but use internal state for selected ID if needed
  const handleToggle = () => {
    updateSetting(id, !setting.enabled);
    toast.success(`تم ${!setting.enabled ? 'تفعيل' : 'تعطيل'} ${setting.nameArabic}`);
  };

  const handleTimeSelect = (timeId: string) => {
     // Update the internal state for immediate UI feedback
     setSelectedTimeIdInternal(timeId);
     // Update the actual setting in the context/storage
     updateAlertTime(id, timeId, true);
     // Optional: Show toast confirmation
     const selectedAlert = calculatedAlertTimes.find(t => t.id === timeId);
     if (selectedAlert) {
       toast.success(`تم اختيار وقت التنبيه: ${selectedAlert.name}`);
     }
  };

 const navigateToSoundSelector = () => {
    if (setting.enabled) {
      try {
        if (!id) {
          toast.error('معرف التنبيه غير صالح');
          return;
        }
        // Use the correct path defined in routes.tsx
        navigate(`/alert-system/sounds?alertId=${id}`);
      } catch (error) {
        console.error('خطأ في التنقل:', error);
        toast.error('حدث خطأ أثناء محاولة فتح صفحة اختيار الصوت');
      }
    } else {
      toast.error('يرجى تفعيل التنبيه أولاً');
    }
  };

  const increasePreAlert = () => {
    if (preAlertMinutes < 30) {
      const newValue = preAlertMinutes + 5;
      setPreAlertMinutes(newValue);
      updatePreAlertMinutes(id, newValue);
    }
  };

  const decreasePreAlert = () => {
    if (preAlertMinutes > 0) {
      const newValue = preAlertMinutes - 5;
      setPreAlertMinutes(newValue);
      updatePreAlertMinutes(id, newValue);
    }
  };

  const selectedTime = setting.alertTimes?.find(time => time.enabled);
  const selectedTimeId = selectedTime?.id;

  return (
    <div className="min-h-screen bg-gray-900 text-white" dir="rtl">
      <HeaderWithBack title={setting.nameArabic} />

      <div className="p-4 bg-gray-900">
        <div className="bg-gray-800 rounded-md p-4 mb-6 flex items-center justify-between">
          <SwitchRTL checked={setting.enabled} onCheckedChange={handleToggle} />
          <div className="text-right">
            <h3 className="text-lg font-medium">{setting.nameArabic}</h3>
          </div>
        </div>

        {setting.enabled && (
          <>
            {setting.hasIqama && (
              <IqamaSelector
                enabled={setting.iqamaEnabled || false}
                offsetMinutes={setting.iqamaOffsetMinutes || 10}
                onToggle={() => {
                  updateSetting(id, setting.enabled, !setting.iqamaEnabled);
                  toast.success(setting.iqamaEnabled ? 'تم تعطيل تنبيه الإقامة' : 'تم تفعيل تنبيه الإقامة');
                }}
                onIncreaseOffset={() => {
                  const currentOffset = setting.iqamaOffsetMinutes || 10;
                  if (currentOffset < 30) {
                    updateIqamaOffsetMinutes(id, currentOffset + 5);
                  }
                }}
                onDecreaseOffset={() => {
                  const currentOffset = setting.iqamaOffsetMinutes || 10;
                  if (currentOffset > 5) {
                    updateIqamaOffsetMinutes(id, currentOffset - 5);
                  }
                }}
              />
            )}

            {/* Removed TestAlertButton section */}

            {calculatedAlertTimes.length > 0 && ( // Use the state variable with calculated times
              <>
                <div className="mb-6">
                  <TimeSelector
                    times={calculatedAlertTimes} // Pass calculated times
                    onSelectTime={handleTimeSelect}
                    selectedTimeId={selectedTimeIdInternal} // Use internal state for selection
                  />
                </div>
              </>
            )}

            {/* Pre-alert section for all prayers that support it */}
            {(id === 'fajr' || id === 'dhuhr' || id === 'asr' || id === 'maghrib' || id === 'isha' || id === 'sunrise') && (
              <div className="bg-gray-800 rounded-md mb-6">
                <div className="p-4 text-right">
                  <h3 className="text-lg font-medium mb-3">التنبيه المسبق</h3>

                  <div className="bg-gray-900 divide-y divide-gray-800 rounded-md mb-4">
                    <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => {
                      updatePreAlertEnabled(id, !setting.preAlertEnabled);
                      toast.success(setting.preAlertEnabled ? 'تم تعطيل التنبيه المسبق' : 'تم تفعيل التنبيه المسبق');
                    }}>
                      <SwitchRTL
                        checked={setting.preAlertEnabled || false}
                        onCheckedChange={(enabled) => {
                          updatePreAlertEnabled(id, enabled);
                          toast.success(enabled ? 'تم تفعيل التنبيه المسبق' : 'تم تعطيل التنبيه المسبق');
                        }}
                      />
                      <div className="text-right">
                        <span className="text-white">
                          {setting.preAlertEnabled ? 'التنبيه المسبق مفعل' : 'التنبيه المسبق معطل'}
                        </span>
                        <p className="text-gray-400 text-sm">
                          {setting.preAlertEnabled ? `قبل ${preAlertMinutes} دقيقة` : 'لن تتلقى تنبيه مسبق'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {setting.preAlertEnabled && (
                    <div>
                      <p className="text-gray-400 text-sm mb-3">
                        كم دقيقة قبل موعد {setting.nameArabic} تريد التنبيه؟
                      </p>

                      <div className="flex items-center justify-between bg-gray-900 rounded-md p-3">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <button
                            className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center disabled:opacity-50"
                            onClick={increasePreAlert}
                            disabled={preAlertMinutes >= 30}
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                          <button
                            className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center disabled:opacity-50"
                            onClick={decreasePreAlert}
                            disabled={preAlertMinutes <= 5}
                          >
                            <Minus className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-xl">{preAlertMinutes} دقيقة</span>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm mt-3">
                        سيصلك تنبيه قبل موعد {setting.nameArabic} بـ {preAlertMinutes} دقيقة، ثم تنبيه آخر عند الوقت.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gray-800 rounded-md mb-6">
              <div className="p-4 text-right">
                <h3 className="text-lg font-medium mb-3">صوت المنبه وقت {setting.nameArabic}</h3>
                <div
                  className="bg-gray-900 p-4 rounded-md cursor-pointer"
                  onClick={navigateToSoundSelector}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400">اختر الصوت</span>
                    <div className="text-right">
                      <span className="text-lg">{selectedSound?.name || 'صوت المنبه الرئيسي'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Notifications Component */}
            <NotificationTest
              prayerName={setting.nameArabic}
              soundId={setting.selectedSound}
            />

            {setting.details && (
              <div className="bg-gray-800 rounded-md p-4 mb-6">
                <h3 className="text-lg font-medium mb-3 text-right">
                  {setting.nameArabic} ({id === 'last-third' ? 'قيام الليل' : ''})
                </h3>
                <p className="text-right text-gray-300 leading-relaxed">
                  {setting.details}
                </p>
              </div>
            )}

            {id !== 'fajr' && (
              <div className="text-center text-gray-400 mt-6">
                <p>
                  اختر صوت المنبه. لا يوجد حاليًا الأذان كاملاً لأن التنبيه في أجهزة آبل محدود بـ 30 ثانية قط. عند استلامك التنبيه اضغط عليه لتسمع الأذان كاملاً.
                </p>
              </div>
            )}

            <div className="text-center text-gray-400 mt-6">
              <p>
                سيصلك تنبيه تجريبي بعد ثوان يمكنك سماع الصوت ومشاهدة شكل التنبيه. لن تسمع المنبه إذا كان الجهاز على الصامت.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AlertDetailPage;
