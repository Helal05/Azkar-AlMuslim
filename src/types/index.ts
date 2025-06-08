// Types from the new alert system (arab-alert-system-main)

interface PrayerTime {
  id: string;
  name: string; // English name? Seems unused in alert-settings.ts
  nameArabic: string;
  enabled: boolean;
  time?: string; // Static time string, likely example data
  description?: string;
}

export interface AlertSound {
  id: string;
  name: string; // English name?
  nameArabic?: string; // Made optional as it was added during copy
  path?: string; // Changed from src, made optional for 'none'/'default'
  // Removed 'selected' as it's not part of the data model, but runtime state
}

interface AlertTime {
  id: string;
  name: string; // Name of the timing option (e.g., "نصف ساعة بعد الفجر")
  timeText: string; // Display text for the time (e.g., "عند الساعة 05:10 صباحًا")
  enabled?: boolean; // Whether this specific timing option is selected
}

export interface AlertSetting {
  id: string; // Unique identifier (e.g., "fajr", "morning-athkar")
  nameArabic: string; // Display name in Arabic
  enabled: boolean; // Is this alert type globally enabled?
  description?: string; // Optional description
  alertTimes?: AlertTime[]; // Optional list of timing choices (e.g., for Duha, Morning Azkar)
  selectedSound?: string; // ID of the selected sound (references AlertSound.id or 'default' or 'none')
  iqamaSound?: string; // ID of the selected sound for iqama (references AlertSound.id or 'default' or 'none')
  details?: string; // Optional detailed text
  hasIqama?: boolean; // Does this alert have an associated Iqama alert?
  iqamaEnabled?: boolean; // Is the Iqama alert specifically enabled? (Only relevant if hasIqama is true)
  iqamaOffsetMinutes?: number; // Offset in minutes for Iqama notification after Adhan (Only relevant if hasIqama is true)
  preAlertEnabled?: boolean; // Enable/disable pre-alert
  preAlertMinutes?: number; // عدد الدقائق قبل الصلاة للتنبيه المسبق (5، 10، 15، 20، 25، 30)
  preAlertSound?: string; // ID of the selected sound for pre-alert (references AlertSound.id or 'default' or 'none')
}

// Interface for user-defined relative alerts
export interface CustomRelativeAlert {
  id: string; // Unique ID, e.g., "custom-fajr-plus-30"
  enabled: boolean;
  basePrayer: keyof import('adhan').PrayerTimes; // 'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'
  offsetMinutes: number; // Positive for 'after', negative for 'before'
  label: string; // User-defined or generated label (e.g., "30 دقيقة بعد الفجر")
  soundId: string; // ID of the sound to play (references AlertSound.id, 'default', or 'none')
}


// TODO: Check if existing types from azkar-al-muslim-companion-main need to be merged here.
// For now, these are just the types required by the new alert system files.
