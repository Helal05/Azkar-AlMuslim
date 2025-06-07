import { AlertSound } from "../types"; // Adjusted import path

export const alertSounds: AlertSound[] = [
  {
    id: "morning-dhikr",
    name: "اصبحنا واصبح الملك لله",
    nameArabic: "اصبحنا واصبح الملك لله", // Added nameArabic for consistency
    path: "/sounds/morning-dhikr.mp3" // Changed src to path
  },
  {
    id: "evening-dhikr",
    name: "امسينا و امسى الملك لله",
    nameArabic: "امسينا و امسى الملك لله", // Added nameArabic
    path: "/sounds/evening-dhikr.mp3" // Changed src to path
  },
  {
    id: "prophet-salah",
    name: "الصلاة على النبي",
    nameArabic: "الصلاة على النبي", // Added nameArabic
    path: "/sounds/prophet-salah.mp3" // Changed src to path
  },
  {
    id: "takbir-1",
    name: "تكبيرات", // Removed trailing space
    nameArabic: "تكبيرات", // Added nameArabic
    path: "/sounds/takbir-1.mp3" // Changed src to path
  },
  {
    id: "hayya-ala-salah",
    name: "حي على الصلاة",
    nameArabic: "حي على الصلاة", // Added nameArabic
    path: "/sounds/hayya-ala-salah.mp3" // Changed src to path
  },
  {
    id: "qatami",
    name: "جزء من الأذان - ناصر القطامي",
    nameArabic: "جزء من الأذان - ناصر القطامي", // Added nameArabic
    path: "/sounds/adhan-qatami.mp3" // Changed src to path
  },
  {
    id: "masjid-nabawi",
    name: "جزء من الأذان - الحرم النبوي",
    nameArabic: "جزء من الأذان - الحرم النبوي", // Added nameArabic
    path: "/sounds/adhan-masjid-nabawi.mp3" // Changed src to path
  },
  {
    id: "saqaf",
    name: "جزء من الأذان - هشام السقاف",
    nameArabic: "جزء من الأذان - هشام السقاف", // Added nameArabic
    path: "/sounds/adhan-saqaf.mp3" // Changed src to path
  },
  {
    id: "makkah2",
    name: "جزء من الأذان - مكة 2",
    nameArabic: "جزء من الأذان - مكة 2", // Added nameArabic
    path: "/sounds/adhan-makkah2.mp3" // Changed src to path
  },
  {
    id: "adhan-time",
    name: "حان الآن موعد الأذان",
    nameArabic: "حان الآن موعد الأذان", // Added nameArabic
    path: "/sounds/adhan-time.mp3" // Changed src to path
  },
  {
    id: "fajr-time",
    name: "حان الآن موعد أذان صلاة الفجر",
    nameArabic: "حان الآن موعد أذان صلاة الفجر", // Added nameArabic
    path: "/sounds/fajr-time.mp3" // Changed src to path
  },
  {
    id: "mishari-afasy",
    name: "جزء من الأذان - مشاري العفاسي",
    nameArabic: "جزء من الأذان - مشاري العفاسي", // Added nameArabic
    path: "/sounds/adhan-afasy.mp3" // Changed src to path
  },
  {
    id: "adhan-makkah1", // Renamed from makkah1 for clarity if used as default
    name: "جزء من الأذان الفجر - مكة 1",
    nameArabic: "جزء من الأذان الفجر - مكة 1", // Added nameArabic
    path: "/sounds/adhan-makkah 1.mp3" // Changed src to path, kept space in filename as original
  },
  {
    id: "emirates",
    name: "جزء من الأذان - الإمارات",
    nameArabic: "جزء من الأذان - الإمارات", // Added nameArabic
    path: "/sounds/adhan-emirates.mp3" // Changed src to path
  },
  {
    id: "egypt",
    name: "جزء من الأذان - مصر",
    nameArabic: "جزء من الأذان - مصر", // Added nameArabic
    path: "/sounds/adhan-egypt.mp3" // Changed src to path
  },
  {
    id: "adhan-fajr", // Renamed from fajr to avoid conflict with prayer id
    name: "جزء من الأذان - الفجر",
    nameArabic: "جزء من الأذان - الفجر", // Added nameArabic
    path: "/sounds/adhan-fajr.mp3" // Changed src to path
  },
  {
    id: "default", // Added a 'default' option explicitly
    name: "الصوت الافتراضي",
    nameArabic: "الصوت الافتراضي",
    path: undefined // Represents using the main alert sound
  },
  {
    id: "none", // Renamed from no-sound for consistency with old system
    name: "بدون صوت",
    nameArabic: "بدون صوت", // Added nameArabic
    path: undefined // Represents no sound
  }
];
