export interface PrayerTime {
  id: string;
  name: string;
  nameArabic: string;
  enabled: boolean;
  time?: string;
  description?: string;
}

export interface AlertSound {
  id: string;
  name: string;
  url: string;
  selected?: boolean;
}

export interface AlertTime {
  id: string;
  name: string;
  timeText: string;
  enabled?: boolean;
}

export interface AlertSetting {
  id: string;
  nameArabic: string;
  enabled: boolean;
  description?: string;
  alertTimes?: AlertTime[];
  selectedSound?: string;
  details?: string;
  hasIqama?: boolean;
  iqamaEnabled?: boolean;
  iqamaOffsetMinutes?: number; // Minutes after prayer time for Iqama notification
  iqamaSound?: string; // Sound ID for Iqama notification
  preAlertEnabled?: boolean; // Enable/disable pre-alert
  preAlertMinutes?: number; // Minutes before prayer time for pre-alert
  preAlertSound?: string; // Sound ID for pre-alert notification
}