import React, { createContext, useState, useContext, useEffect } from "react";
import { AlertSetting, AlertSound, AlertTime } from "../types";
import { alertSettings } from "../data/alert-settings";
import { alertSounds } from "../data/sounds";
import { toast } from "sonner";

interface AlertContextProps {
  settings: AlertSetting[];
  sounds: AlertSound[];
  updateSetting: (id: string, enabled: boolean, iqamaEnabled?: boolean) => void;
  getSetting: (id: string) => AlertSetting | undefined;
  updateAlertTime: (settingId: string, timeId: string, enabled: boolean) => void;
  updateAlertSound: (settingId: string, soundId: string) => void;
  updatePreAlertMinutes: (settingId: string, minutes: number) => void;
  updatePreAlertEnabled: (settingId: string, enabled: boolean) => void;
  updateIqamaOffsetMinutes: (settingId: string, minutes: number) => void;
  getSelectedSound: (settingId: string) => AlertSound | undefined;
  testAlert: (soundId: string) => void;
  resetAllAlerts: () => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AlertSetting[]>(alertSettings);
  const [sounds] = useState<AlertSound[]>(alertSounds);

  useEffect(() => {
    const savedSettingsString = localStorage.getItem("alertSettings");
    let savedSettingsMap: { [key: string]: AlertSetting } = {};

    if (savedSettingsString) {
      try {
        const parsedSettings: AlertSetting[] = JSON.parse(savedSettingsString);
        // Create a map for easy lookup
        parsedSettings.forEach(setting => {
          savedSettingsMap[setting.id] = setting;
        });
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
        // Optionally clear corrupted storage
        // localStorage.removeItem("alertSettings");
      }
    }

    // Merge default settings with saved settings
    const mergedSettings = alertSettings.map(defaultSetting => {
      const savedSetting = savedSettingsMap[defaultSetting.id];
      if (savedSetting) {
        // Merge: prioritize saved state but ensure all default keys exist
        // This ensures new properties like 'alertTimes' or 'details' are added
        // if they were missing in the saved version.
        return { ...defaultSetting, ...savedSetting };
      } else {
        // If no saved setting exists for this ID, use the default
        return defaultSetting;
      }
    });

    setSettings(mergedSettings);

  }, []); // Run only on initial mount

  useEffect(() => {
    localStorage.setItem("alertSettings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (id: string, enabled: boolean, iqamaEnabled?: boolean) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === id ? {
          ...setting,
          enabled,
          iqamaEnabled: iqamaEnabled !== undefined ? iqamaEnabled : setting.iqamaEnabled
        } : setting
      )
    );

    const setting = settings.find(s => s.id === id);
    if (setting) {
      if (iqamaEnabled !== undefined) {
        toast.success(`تم ${iqamaEnabled ? 'تفعيل' : 'تعطيل'} تنبيه الإقامة لـ ${setting.nameArabic}`);
      } else {
        toast.success(`تم ${enabled ? 'تفعيل' : 'تعطيل'} ${setting.nameArabic}`);
      }
    }
  };

  const getSetting = (id: string) => {
    return settings.find((setting) => setting.id === id);
  };

  const updateAlertTime = (settingId: string, timeId: string, enabled: boolean) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) => {
        if (setting.id === settingId && setting.alertTimes) {
          const updatedTimes = setting.alertTimes.map((time) =>
            time.id === timeId
              ? { ...time, enabled }
              : { ...time, enabled: false }
          );
          return { ...setting, alertTimes: updatedTimes };
        }
        return setting;
      })
    );
  };

  const updateAlertSound = (settingId: string, soundId: string) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === settingId ? { ...setting, selectedSound: soundId } : setting
      )
    );
  };

  const updatePreAlertMinutes = (settingId: string, minutes: number) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === settingId ? { ...setting, preAlertMinutes: minutes } : setting
      )
    );

    const setting = settings.find(s => s.id === settingId);
    if (setting) {
      if (minutes > 0) {
        toast.success(`تم ضبط التنبيه المسبق قبل ${setting.nameArabic} بـ ${minutes} دقيقة`);
      } else {
        toast.success(`تم إلغاء التنبيه المسبق قبل ${setting.nameArabic}`);
      }
    }
  };

  const updatePreAlertEnabled = (settingId: string, enabled: boolean) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === settingId ? { ...setting, preAlertEnabled: enabled } : setting
      )
    );

    const setting = settings.find(s => s.id === settingId);
    if (setting) {
      toast.success(`تم ${enabled ? 'تفعيل' : 'تعطيل'} التنبيه المسبق قبل ${setting.nameArabic}`);
    }
  };

  const updateIqamaOffsetMinutes = (settingId: string, minutes: number) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === settingId ? { ...setting, iqamaOffsetMinutes: minutes } : setting
      )
    );

    const setting = settings.find(s => s.id === settingId);
    if (setting) {
      toast.success(`تم ضبط تنبيه الإقامة بعد ${setting.nameArabic} بـ ${minutes} دقيقة`);
    }
  };

  const getSelectedSound = (settingId: string): AlertSound | undefined => {
    const targetSetting = settings.find((s) => s.id === settingId);
    const mainSetting = settings.find((s) => s.id === 'main');
    const hardcodedDefaultSoundId = "makkah1";

    let soundIdToUse: string | undefined;

    const targetSelectedSoundId = targetSetting?.selectedSound;
    const mainSelectedSoundId = mainSetting?.selectedSound;

    if (targetSelectedSoundId) {
      soundIdToUse = targetSelectedSoundId;
    } else if (mainSelectedSoundId) {
      soundIdToUse = mainSelectedSoundId;
    } else {
      soundIdToUse = hardcodedDefaultSoundId;
    }

    return sounds.find((s) => s.id === soundIdToUse);
  };

  const testAlert = (soundId: string) => {
    const sound = sounds.find((s) => s.id === soundId);
    if (sound) {
      const audio = new Audio(sound.url);
      audio.play();
    }
  };

  const resetAllAlerts = () => {
    setSettings(alertSettings);
    localStorage.removeItem("alertSettings");
    toast.success("تم إعادة تعيين جميع الإعدادات");
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
        updatePreAlertMinutes,
        updatePreAlertEnabled,
        updateIqamaOffsetMinutes,
        getSelectedSound,
        testAlert,
        resetAllAlerts,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
