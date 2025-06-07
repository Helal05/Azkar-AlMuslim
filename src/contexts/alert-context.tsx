import React, { createContext, useState, useContext, useEffect } from "react";
import { AlertSetting, AlertSound, AlertTime } from "../types"; // Adjusted import path
import { alertSettings } from "../data/alert-settings"; // Adjusted import path
import { alertSounds } from "../data/sounds"; // Adjusted import path
import { toast } from "sonner";

interface AlertContextProps {
  settings: AlertSetting[];
  sounds: AlertSound[];
  updateSetting: (id: string, enabled: boolean, iqamaEnabled?: boolean) => void;
  getSetting: (id: string) => AlertSetting | undefined;
  updateAlertTime: (settingId: string, timeId: string, enabled: boolean) => void;
  updateAlertSound: (settingId: string, soundId: string) => void;
  getSelectedSound: (settingId: string) => AlertSound | undefined;
  testAlert: (soundId: string) => void; // We might need to implement actual sound playing here later
  resetAllAlerts: () => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

// Helper function to safely parse JSON from localStorage
const loadSettingsFromStorage = (): AlertSetting[] => {
  const savedSettings = localStorage.getItem("alertSettings");
  if (savedSettings) {
    try {
      // TODO: Add validation logic here to ensure savedSettings matches AlertSetting[] structure
      // This prevents crashes if localStorage data is corrupted or outdated.
      const parsedSettings = JSON.parse(savedSettings);
      // Basic check: is it an array?
      if (Array.isArray(parsedSettings)) {
         // Deeper check: does the first item look like an AlertSetting? (improve as needed)
         if (parsedSettings.length === 0 || (parsedSettings[0] && typeof parsedSettings[0].id === 'string')) {
            return parsedSettings;
         }
      }
      console.warn("Saved settings format is invalid, falling back to default.");
    } catch (error) {
      console.error("Failed to parse saved settings, falling back to default:", error);
    }
  }
  // Return default settings if nothing valid is found in storage
  return alertSettings;
};


export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or use defaults
  const [settings, setSettings] = useState<AlertSetting[]>(loadSettingsFromStorage);
  const [sounds] = useState<AlertSound[]>(alertSounds); // Sounds are likely static

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("alertSettings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (id: string, enabled: boolean, iqamaEnabled?: boolean) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === id ? {
          ...setting,
          enabled,
          // Only update iqamaEnabled if the value is explicitly provided
          ...(iqamaEnabled !== undefined && { iqamaEnabled: iqamaEnabled })
        } : setting
      )
    );

    // Provide feedback to the user
    const setting = settings.find(s => s.id === id);
    if (setting) {
      // Determine the correct Arabic name (assuming nameArabic exists)
      const name = setting.nameArabic || setting.id; // Fallback to ID if nameArabic is missing
      if (iqamaEnabled !== undefined) {
        toast.success(`تم ${iqamaEnabled ? 'تفعيل' : 'تعطيل'} تنبيه الإقامة لـ ${name}`);
      } else {
        toast.success(`تم ${enabled ? 'تفعيل' : 'تعطيل'} ${name}`);
      }
    }
  };

  const getSetting = (id: string): AlertSetting | undefined => {
    return settings.find((setting) => setting.id === id);
  };

  const updateAlertTime = (settingId: string, timeId: string, enabled: boolean) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) => {
        if (setting.id === settingId && setting.alertTimes) {
          // Ensure only one time can be enabled for a given setting
          const updatedTimes = setting.alertTimes.map((time) =>
            time.id === timeId
              ? { ...time, enabled: enabled } // Enable/disable the selected one
              : { ...time, enabled: false }   // Disable all others
          );
          return { ...setting, alertTimes: updatedTimes };
        }
        return setting;
      })
    );
     // Optional: Add toast feedback here if needed
  };


  const updateAlertSound = (settingId: string, soundId: string) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === settingId ? { ...setting, selectedSound: soundId } : setting
      )
    );
     // Optional: Add toast feedback here if needed
     const setting = settings.find(s => s.id === settingId);
     const sound = sounds.find(s => s.id === soundId);
     if (setting && sound) {
       const settingName = setting.nameArabic || setting.id;
       const soundName = sound.nameArabic || sound.id;
       toast.success(`تم تغيير صوت ${settingName} إلى ${soundName}`);
     }
  };

  const getSelectedSound = (settingId: string): AlertSound | undefined => {
    const targetSetting = settings.find((s) => s.id === settingId);
    const mainSetting = settings.find((s) => s.id === 'main'); // Assuming 'main' is the ID for the main/default sound setting
    const hardcodedDefaultSoundId = "adhan-makkah1"; // Default sound if nothing else is found

    let soundIdToUse: string | undefined;

    const targetSelectedSoundId = targetSetting?.selectedSound;
    const mainSelectedSoundId = mainSetting?.selectedSound;

    if (targetSelectedSoundId && targetSelectedSoundId !== "default") {
      // Case 1: Specific alert has a specific sound selected (and it's not the 'default' placeholder)
      soundIdToUse = targetSelectedSoundId;
    } else {
      // Case 2: Specific alert uses 'default' or has no sound selected -> use the main setting's selection
      soundIdToUse = mainSelectedSoundId;
    }

    // Find the actual sound object based on the determined ID
    let finalSound = sounds.find((s) => s.id === soundIdToUse);

    // Final fallback: If no sound ID was determined or the ID doesn't match any sound, use the hardcoded default ID
    if (!finalSound) {
      finalSound = sounds.find((s) => s.id === hardcodedDefaultSoundId);
      if (finalSound) {
        console.warn(`Sound ID '${soundIdToUse}' not found, falling back to hardcoded default '${hardcodedDefaultSoundId}'.`);
      } else {
         console.error(`Neither determined sound ID '${soundIdToUse}' nor hardcoded default '${hardcodedDefaultSoundId}' could be found in sounds list.`);
         return undefined; // Critical error: default sound is missing
      }
    }

    return finalSound;
  };

  // --- Test Alert Implementation ---
  // Store the currently playing audio element to manage it
  let currentTestAudio: HTMLAudioElement | null = null;

  const testAlert = (soundId: string) => {
    // Stop any previously playing test sound
    if (currentTestAudio) {
      currentTestAudio.pause();
      currentTestAudio.currentTime = 0;
      currentTestAudio = null;
    }

    const sound = sounds.find((s) => s.id === soundId);
    if (sound && sound.path) {
      console.log(`Testing alert sound: ${sound.name} (Path: ${sound.path})`);
      try {
        const audio = new Audio(sound.path); // Assumes path is relative to public folder
        audio.play()
          .then(() => {
            toast.info(`تشغيل تنبيه تجريبي: ${sound.nameArabic || sound.id}`);
            currentTestAudio = audio; // Store the playing audio element
            // Clean up when finished
            audio.onended = () => {
              currentTestAudio = null;
            };
          })
          .catch(error => {
            console.error("Error playing test sound:", error);
            toast.error("حدث خطأ أثناء تشغيل الصوت التجريبي.");
          });
      } catch (error) {
        console.error("Error creating Audio object:", error);
        toast.error("حدث خطأ أثناء تهيئة الصوت التجريبي.");
      }
    } else {
      console.warn(`Sound ID '${soundId}' not found or has no path for testing.`);
      toast.error("لم يتم العثور على ملف الصوت المحدد للتجربة.");
    }
  };


  const resetAllAlerts = () => {
    // Use the original default settings from the data file
    const defaultSettingsWithDisabled = alertSettings.map(setting => ({
      ...setting,
      enabled: false,
      // Also disable iqama if it exists and default is enabled
      ...(setting.hasIqama && { iqamaEnabled: false }),
       // Reset selected sound to undefined (will fallback to default logic)
      selectedSound: undefined,
      // Reset alert times to their default enabled state (usually none enabled)
      alertTimes: setting.alertTimes?.map(time => ({
          ...time,
          enabled: alertSettings.find(ds => ds.id === setting.id)?.alertTimes?.find(dt => dt.id === time.id)?.enabled ?? false
      }))
    }));

    setSettings(defaultSettingsWithDisabled);
    // No need to remove from localStorage explicitly, useEffect will overwrite it.
    toast.success("تم إعادة ضبط جميع التنبيهات إلى الحالة الافتراضية (معطلة)");
  };


  return (
    <AlertContext.Provider
      value={{
        settings,
        sounds,
        updateSetting,
        getSetting,
        updateAlertTime,
        updateAlertSound,
        getSelectedSound,
        testAlert,
        resetAllAlerts
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextProps => { // Return AlertContextProps directly
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
