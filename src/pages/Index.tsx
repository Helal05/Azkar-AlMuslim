import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentIslamicDate, getPrayerTimesWithSettings, getTimeToNextPrayerWithSettings } from "../data/prayerData";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useToast } from "@/hooks/use-toast";
import QuranVerse from "../components/QuranVerse";
import { Search, Heart, Settings, Moon, Sun, MapPin, Clock, Calendar } from "lucide-react";
import NightDuas from "../components/NightDuas";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent, // Import DragEndEvent type
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy, // Use rectSortingStrategy for grid
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion"; // Import motion
import { ChevronRight } from "lucide-react"; // Import ChevronRight

// Define IslamicDate type
type IslamicDate = {
  day: string;
  month: string;
  year: string;
  gregorianDate: string;
};

// Define PrayerTime type if not imported from elsewhere
type PrayerTime = {
  name: string;
  time: string;
  isNext?: boolean;
};

// --- Define Sortable Item Component OUTSIDE Index ---
// Infer item type from how it's used later
function SortableCategoryItem({ item }: { item: any }) {
  const navigate = useNavigate();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
    touchAction: 'none',
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => item.path ? navigate(item.path) : navigate(`/category/${item.id}`)}
      className={`p-4 rounded-lg bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo} border ${item.borderColor} text-center transition-all duration-300 hover:shadow-lg hover:shadow-${item.borderColor}/10 active:scale-95`}
    >
      <span className={`text-lg ${item.textColor} font-arabic`}>{item.title}</span>
    </button>
  );
}
// --- End Sortable Item Component ---


const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings, toggleDarkMode, requestLocationPermission } = useAppSettings();

  // Initialize state with default/empty values
  const [islamicDate, setIslamicDate] = useState<IslamicDate | null>(null); // Keep if used in restored Date/Prayer section
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]); // Keep
  const [nextPrayerTime, setNextPrayerTime] = useState<string>("..."); // Keep
  // Restore state for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Fetch initial data and set up intervals
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout | null = null;
    let prayerListInterval: NodeJS.Timeout | null = null;

  const updateData = () => {
    try {
      setIslamicDate(getCurrentIslamicDate(settings.language));

      // Add validation for location data before calling prayer time functions
      const lat = settings.location.latitude;
      const lon = settings.location.longitude;
      const method = settings.location.method;

      if (typeof lat !== 'number' || isNaN(lat) || lat < -90 || lat > 90 ||
          typeof lon !== 'number' || isNaN(lon) || lon < -180 || lon > 180 ||
          !method || typeof method !== 'string') { // Also check if method is a non-empty string
        console.error("Invalid location/method settings detected:", settings.location);
        setPrayerTimes([]);
        setNextPrayerTime(settings.language === 'ar' ? "إعدادات موقع غير صالحة" : "Invalid location settings");
        // Optionally show a toast message to the user
        toast({
          title: settings.language === 'ar' ? "خطأ في الإعدادات" : "Settings Error",
          description: settings.language === 'ar' ? "إعدادات الموقع أو طريقة الحساب غير صالحة. يرجى التحقق منها في صفحة الإعدادات." : "Invalid location or calculation method settings detected. Please check them in the settings page.",
          variant: "destructive",
          duration: 9000 // Longer duration for error message
        });
        return; // Stop further processing if settings are invalid
      }

      // Proceed only if location data is valid
      // Create settings object with adjustments
      const prayerSettings = {
        madhab: settings.location.madhab,
        elevation: settings.location.elevation,
        adjustments: settings.location.adjustments
      };

      const currentPrayerTimes = getPrayerTimesWithSettings(lat, lon, method, settings.language, prayerSettings);
      setPrayerTimes(currentPrayerTimes);
      setNextPrayerTime(getTimeToNextPrayerWithSettings(lat, lon, method, settings.language, true, prayerSettings)); // Added commas

    } catch (error) {
      console.error("Error updating prayer data:", error); // Keep original console error format
      setPrayerTimes([]);
      setNextPrayerTime(settings.language === 'ar' ? "خطأ في الحساب" : "Calculation Error");
      // Optionally show a toast message
      toast({
          title: settings.language === 'ar' ? "خطأ" : "Error",
          description: settings.language === 'ar' ? "حدث خطأ أثناء تحديث بيانات الصلاة." : "An error occurred while updating prayer data.",
          variant: "destructive"
        });
    }
  };

    // Initial fetch
    updateData();

    // Set up intervals
    countdownInterval = setInterval(() => {
      try {
        // Create settings object with adjustments for countdown
        const prayerSettings = {
          madhab: settings.location.madhab,
          elevation: settings.location.elevation,
          adjustments: settings.location.adjustments
        };

        setNextPrayerTime(getTimeToNextPrayerWithSettings(settings.location.latitude, settings.location.longitude, settings.location.method, settings.language, true, prayerSettings));
      } catch (error) {
        console.error("Error updating countdown:", error);
        if (countdownInterval) clearInterval(countdownInterval);
        setNextPrayerTime(settings.language === 'ar' ? "خطأ" : "Error");
      }
    }, 1000);

    prayerListInterval = setInterval(updateData, 5 * 60 * 1000); // Update all data periodically

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
      if (prayerListInterval) clearInterval(prayerListInterval);
    };
  }, [settings.location, settings.language, settings.location.method, toast]); // Adjust dependencies if needed

  // Auto request location on first load (Keep)
  useEffect(() => {
    const hasRequestedLocation = localStorage.getItem("location-requested");
    if (!hasRequestedLocation) {
      requestLocationPermission();
      localStorage.setItem("location-requested", "true");
    }
  }, [requestLocationPermission]); // Keep dependency

  // Restore handleSearch function
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      localStorage.setItem("search-query", searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Memoize the next prayer calculation (Keep)
  const nextPrayer = useMemo(() => {
    return prayerTimes.find(prayer => prayer.isNext);
  }, [prayerTimes]);

  // Get next prayer name and time safely
  const getNextPrayerDisplay = () => {
    return nextPrayer ? `${nextPrayer.name} ${nextPrayer.time}` : (settings.language === 'ar' ? "جاري التحميل..." : "Loading...");
  };

  // Share app functionality
  const shareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: settings.language === "ar" ? "تطبيق أذكاري" : "Azkari App",
        text: settings.language === "ar"
          ? "تطبيق للأذكار والأدعية الإسلامية"
          : "Islamic app for Azkar and Duas",
        url: window.location.href
      }).catch(err => console.error("Error sharing:", err));
    } else {
      toast({
        title: settings.language === "ar" ? "المشاركة غير متاحة" : "Sharing not available",
        description: settings.language === "ar"
          ? "متصفحك لا يدعم ميزة المشاركة"
          : "Your browser doesn't support the share feature"
      });
    }
  };

  // Modern Islamic categories with their colors and icons
  const azkarMenuItems = [
    {
      id: "morning",
      title: settings.language === "ar" ? "أذكار الصباح" : "Morning Azkar",
      borderColor: "border-cyan-700",
      textColor: "text-cyan-500",
      gradientFrom: "from-cyan-900/20",
      gradientTo: "to-cyan-800/5"
    },
    {
      id: "evening",
      title: settings.language === "ar" ? "أذكار المساء" : "Evening Azkar",
      borderColor: "border-indigo-700",
      textColor: "text-indigo-500",
      gradientFrom: "from-indigo-900/20",
      gradientTo: "to-indigo-800/5"
    },
    {
      id: "afterPrayer",
      title: settings.language === "ar" ? "أذكار بعد الصلاة" : "After Prayer Azkar",
      borderColor: "border-emerald-700",
      textColor: "text-emerald-500",
      gradientFrom: "from-emerald-900/20",
      gradientTo: "to-emerald-800/5"
    },
    {
      id: "sleep",
      title: settings.language === "ar" ? "أذكار النوم" : "Sleep Azkar",
      borderColor: "border-blue-700",
      textColor: "text-blue-500",
      gradientFrom: "from-blue-900/20",
      gradientTo: "to-blue-800/5"
    },
    {
      id: "prayerAzkar",
      title: settings.language === "ar" ? "أذكار الصلاة" : "Prayer Azkar",
      borderColor: "border-orange-700",
      textColor: "text-orange-500",
      gradientFrom: "from-orange-900/20",
      gradientTo: "to-orange-800/5"
    },
    {
      id: "wakeup",
      title: settings.language === "ar" ? "أذكار الاستيقاظ" : "Wakeup Azkar",
      borderColor: "border-teal-700",
      textColor: "text-teal-500",
      gradientFrom: "from-teal-900/20",
      gradientTo: "to-teal-800/5"
    },
    {
      id: "quranDuas",
      title: settings.language === "ar" ? "أدعية من القرآن" : "Duas from Quran",
      borderColor: "border-amber-700",
      textColor: "text-amber-500",
      gradientFrom: "from-amber-900/20",
      gradientTo: "to-amber-800/5"
    },
    {
      id: "prophet",
      title: settings.language === "ar" ? "من دعاء الرسول ﷺ" : "Prophet's Duas ﷺ",
      borderColor: "border-purple-700",
      textColor: "text-purple-500",
      gradientFrom: "from-purple-900/20",
      gradientTo: "to-purple-800/5"
    },
    {
      id: "ruqyah",
      title: settings.language === "ar" ? "الرقية بالقرآن" : "Quran Ruqyah",
      borderColor: "border-green-700",
      textColor: "text-green-500",
      gradientFrom: "from-green-900/20",
      gradientTo: "to-green-800/5"
    },
    {
      id: "ruqyahSunnah",
      title: settings.language === "ar" ? "الرقية بالسنة" : "Sunnah Ruqyah",
      borderColor: "border-emerald-700",
      textColor: "text-emerald-500",
      gradientFrom: "from-emerald-900/20",
      gradientTo: "to-emerald-800/5"
    },
    // Ensuring "Comprehensive Duas" and "Friday Sunan" are present and correctly ordered
    {
      id: "comprehensiveDuas",
      title: settings.language === "ar" ? "أدعية شاملة" : "Comprehensive Duas",
      path: "/comprehensive-duas",
      borderColor: "border-sky-700", // Existing style
      textColor: "text-sky-500",
      gradientFrom: "from-sky-900/20",
      gradientTo: "to-sky-800/5"
    },
    {
      id: "fridaySunan",
      title: settings.language === "ar" ? "سنن يوم الجمعة" : "Friday Sunan",
      path: "/friday-sunan",
      borderColor: "border-teal-700", // Existing style
      textColor: "text-teal-500",
      gradientFrom: "from-teal-900/20",
      gradientTo: "to-teal-800/5"
    },
    {
      id: "duaEtiquettes",
      title: settings.language === "ar" ? "آداب الدعاء" : "Dua Etiquettes",
      path: "/dua-etiquettes",
      borderColor: "border-pink-700", // Existing style
      textColor: "text-pink-500",
      gradientFrom: "from-pink-900/20",
      gradientTo: "to-pink-800/5"
    },
    {
      id: "namesOfAllah",
      title: settings.language === "ar" ? "أسماء الله الحسنى" : "Names of Allah",
      path: "/names-of-allah",
      borderColor: "border-amber-700", // Existing style
      textColor: "text-amber-500",
      gradientFrom: "from-amber-900/20",
      gradientTo: "to-amber-800/5"
    },
    {
      id: "tasabeeh",
      title: settings.language === "ar" ? "تسابيح" : "Tasabeeh",
      path: "/tasabeeh", // Corrected path to point to the Tasabeeh list/counter page
      borderColor: "border-lime-700",
      textColor: "text-lime-500",
      gradientFrom: "from-lime-900/20",
      gradientTo: "to-lime-800/5"
    },
    {
      id: "fadlAlDhikr",
      title: settings.language === "ar" ? "فضل الذكر" : "Virtues of Dhikr",
      path: "/fadl-al-dhikr",
      borderColor: "border-yellow-700", // Choose appropriate colors
      textColor: "text-yellow-500",
      gradientFrom: "from-yellow-900/20",
      gradientTo: "to-yellow-800/5"
    },
    {
      id: "more",
      title: settings.language === "ar" ? "المزيد" : "More",
      path: "/more",
      borderColor: "border-gray-700",
      textColor: "text-gray-400",
      gradientFrom: "from-gray-900/20",
      gradientTo: "to-gray-800/5"
    },
  ]; // End of azkarMenuItems definition

  // State for ordered items - Initialize based on azkarMenuItems
  const [orderedItems, setOrderedItems] = useState(azkarMenuItems);

  // Effect to load/save order and handle language changes
  useEffect(() => {
    // --- TEMPORARY DIAGNOSTIC ---
    // Force removal of saved order to test if localStorage is the issue
    console.log("DIAGNOSTIC: Forcing removal of azkar_menu_order from localStorage.");
    localStorage.removeItem("azkar_menu_order");
    // --- END TEMPORARY DIAGNOSTIC ---

    const currentLocalizedItems = azkarMenuItems;
    // Since localStorage is cleared above, savedOrderJSON will be null,
    // and finalOrderedItems will effectively be [...currentLocalizedItems]
    // The original logic for handling savedOrderJSON is preserved below but won't be hit in this diagnostic version.

    const savedOrderJSON = localStorage.getItem("azkar_menu_order"); // This will be null now
    let finalOrderedItems = [...currentLocalizedItems]; // Default to current items

    if (savedOrderJSON) { // This block will be skipped due to the removeItem above
      try {
        const savedOrderIds: string[] = JSON.parse(savedOrderJSON);
        const currentItemMap = new Map(currentLocalizedItems.map(item => [item.id, item]));
        const reorderedItems = savedOrderIds
          .map(id => currentItemMap.get(id))
          .filter(item => !!item);

        const currentItemIds = new Set(currentLocalizedItems.map(item => item.id));
        const newItems = currentLocalizedItems.filter(item => !reorderedItems.find(ri => ri.id === item.id));

        if (reorderedItems.length === currentItemIds.size - newItems.length) { // Check if reorderedItems are valid subset
            finalOrderedItems = [...reorderedItems, ...newItems];
        } else {
            console.warn("Saved menu order is inconsistent or incomplete. Resetting to default.");
            localStorage.removeItem("azkar_menu_order"); // Clear problematic order
            finalOrderedItems = [...currentLocalizedItems]; // Fallback to default
        }
      } catch (e) {
        console.error("Failed to parse saved menu order. Resetting to default:", e);
        localStorage.removeItem("azkar_menu_order"); // Clear invalid data
        finalOrderedItems = [...currentLocalizedItems]; // Fallback to default
      }
    }
    setOrderedItems(finalOrderedItems);
  }, [settings.language]); // azkarMenuItems is redefined if language changes, triggering this.

  // Effect to save order to localStorage whenever orderedItems changes
  useEffect(() => {
    // Only save if orderedItems is populated and its length matches the source of truth (azkarMenuItems)
    // This prevents saving an empty or partially initialized list.
    if (orderedItems && azkarMenuItems && orderedItems.length > 0 && orderedItems.length === azkarMenuItems.length) {
      const orderIds = orderedItems.map(item => item.id);
      localStorage.setItem("azkar_menu_order", JSON.stringify(orderIds));
    }
  }, [orderedItems, azkarMenuItems]); // Depend on both orderedItems and azkarMenuItems


   // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require the mouse to move by 10 pixels before activating
      // Allows scroll on touch devices and prevents accidental drags
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (oldIndex === -1 || newIndex === -1) {
          return items; // Should not happen if IDs are correct
        }

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // ... (keep existing functions like handleSearch, getNextPrayerDisplay, shareApp)
  // Restore handleAddToFavorites function
  const handleAddToFavorites = (duaId: string) => {
    // In a real implementation, this would save to a favorites store
    toast({
      title: settings.language === "ar" ? "تمت الإضافة للمفضلة" : "Added to favorites",
      description: settings.language === "ar"
        ? "تمت إضافة الدعاء إلى المفضلة"
        : "This dua has been added to your favorites"
    });
  };
  // Ensure all functions are correctly placed within the Index component

  return ( // Ensure this is the correct start of the return statement for Index
    <div className={`flex flex-col min-h-screen ${settings.appearance.darkMode ? "bg-gradient-to-b from-slate-900 to-slate-950 text-white" : "bg-gradient-to-b from-amber-50 to-amber-100 text-slate-900"}`}>
      {/* Container for QuranVerse and Header Buttons */}
      <div className="relative p-4"> {/* Make container relative */}
         <QuranVerse />
         {/* Absolutely positioned header buttons */}
         <div className="absolute top-6 left-4 right-4 z-20 flex justify-between items-center"> {/* Position buttons */}
           <button onClick={() => setShowSearch(!showSearch)} className="p-1.5 rounded-full bg-black/20 backdrop-blur-sm">
             <Search className="h-5 w-5 text-white/80 hover:text-white transition-colors" />
           </button>
           <div className="flex space-x-2 rtl:space-x-reverse">
             <button onClick={() => navigate("/favorites")} className="p-1.5 rounded-full bg-black/20 backdrop-blur-sm">
               <Heart className="h-5 w-5 text-white/80 hover:text-white transition-colors" />
             </button>
             <button onClick={() => navigate("/settings")} className="p-1.5 rounded-full bg-black/20 backdrop-blur-sm">
               <Settings className="h-5 w-5 text-white/80 hover:text-white transition-colors" />
             </button>
             {/* Removed Dark Mode Toggle Button */}
           </div>
         </div>
         {/* Search Bar - Conditionally displayed below buttons */}
         {showSearch && (
           <div className="relative z-20 mt-4"> {/* Adjust margin as needed */}
             <form onSubmit={handleSearch} className="relative">
               <input
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder={settings.language === "ar" ? "ابحث ..." : "Search..."}
                 // Use styles that work well on the potentially varied background
                 className="w-full bg-black/30 text-white border-white/20 focus:ring-white/30 backdrop-blur-md rounded-lg py-2 px-4 font-arabic text-right border focus:outline-none focus:ring-2 focus:border-transparent"
               />
               <button
                 type="submit"
                 className="absolute left-2 top-1/2 transform -translate-y-1/2 rtl:left-auto rtl:right-2"
               >
                 <Search className="h-5 w-5 text-white/60" />
               </button>
             </form>
           </div>
         )}
      </div>

      {/* Improved Info Bar: Date & Location */}
      <div className={`${settings.appearance.darkMode ? "bg-slate-800/80" : "bg-white/80"} border-t border-b ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} backdrop-blur-md rounded-2xl shadow-lg mx-2 mt-2 flex flex-col md:flex-row items-center justify-between gap-2 py-2 px-4`}>
        {/* Hijri Date - always centered and fixed */}
        <div className="flex-1 flex flex-col items-center min-w-[120px]">
          <div className="flex items-center gap-1">
            <Calendar className={`h-4 w-4 ${settings.appearance.darkMode ? "text-amber-300" : "text-amber-600"}`} />
            <span className="text-sm font-arabic font-semibold text-amber-600 dark:text-amber-300">
              {islamicDate ? `${islamicDate.day} ${islamicDate.month} ${islamicDate.year}هـ` : (settings.language === 'ar' ? 'جاري التحميل...' : 'Loading...')}
            </span>
          </div>
          <span className="text-xs text-gray-500 mt-1">{islamicDate ? islamicDate.gregorianDate : (settings.language === 'ar' ? '...' : '...')}</span>
        </div>
        {/* Location */}
        <div className="flex-1 flex items-center justify-center min-w-[120px] gap-2">
          <MapPin className={`h-4 w-4 ${settings.appearance.darkMode ? "text-blue-300" : "text-blue-600"}`} />
          <span className="text-xs font-arabic text-gray-700 dark:text-gray-200">
            {settings.location.city && settings.location.city !== 'غير معروف'
              ? `${settings.location.city}${settings.location.governorate ? `, ${settings.location.governorate}` : ''}${settings.location.country ? `, ${settings.location.country}` : ''}`
              : (settings.language === 'ar' ? 'تحديد الموقع...' : 'Set Location...')}
          </span>
        </div>
      </div>

      {/* Improved Prayer Info Section */}
      <div className={`${settings.appearance.darkMode ? "bg-slate-800/80" : "bg-white/80"} border-t border-b ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} backdrop-blur-md rounded-2xl shadow-lg mx-2 mt-2 px-4 py-3 flex justify-between items-center gap-2`}>
        <div className="flex flex-col items-center flex-1 min-w-[100px]">
          <p className={`text-xs mb-1 ${settings.appearance.darkMode ? "text-white/70" : "text-slate-600"}`}>{settings.language === "ar" ? "متبقي للصلاة" : "Time remaining"}</p>
          <div className="flex items-center">
            <Clock className={`h-4 w-4 ml-1 ${settings.appearance.darkMode ? "text-white/70" : "text-slate-600"}`} />
            <p className={settings.appearance.darkMode ? "text-white font-semibold" : "text-slate-800 font-semibold"}>
              {/* Always show countdown in English 12h format and English digits */}
              {(() => {
                const toEnglishDigits = (str) => str.replace(/\d/g, d => "0123456789"[+d]);
                const match = nextPrayerTime.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
                if (match) {
                  let h = parseInt(match[1], 10);
                  let m = parseInt(match[2], 10);
                  let ampm = h >= 12 ? 'PM' : 'AM';
                  let hour12 = h % 12 || 12;
                  return `${hour12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
                }
                return toEnglishDigits(nextPrayerTime);
              })()}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center flex-1 min-w-[100px]">
          <p className={`text-xs mb-1 ${settings.appearance.darkMode ? "text-white/70" : "text-slate-600"}`}>{settings.language === "ar" ? "الصلاة القادمة" : "Next prayer"}</p>
          <p className={`font-arabic font-semibold ${settings.appearance.darkMode ? "text-amber-400" : "text-amber-600"}`}>{nextPrayer?.name || (settings.language === 'ar' ? '...' : '...')}</p>
        </div>
        <div className="flex flex-col items-center flex-1 min-w-[100px]">
          <p className={`text-xs mb-1 ${settings.appearance.darkMode ? "text-white/70" : "text-slate-600"}`}>{settings.language === "ar" ? "وقت الصلاة" : "Prayer time"}</p>
          <p className={`font-semibold font-arabic ${settings.appearance.darkMode ? "text-white" : "text-slate-800"}`}>
            {/* Always show prayer time in English 12h format and English digits */}
            {(() => {
              const toEnglishDigits = (str) => str.replace(/\d/g, d => "0123456789"[+d]);
              if (nextPrayer?.time) {
                const t = nextPrayer.time.trim();
                const match = t.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
                if (match) {
                  let h = parseInt(match[1], 10);
                  let m = parseInt(match[2], 10);
                  let ampm = h >= 12 ? 'PM' : 'AM';
                  let hour12 = h % 12 || 12;
                  return `${hour12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
                }
                return toEnglishDigits(t);
              }
              return (settings.language === 'ar' ? '...' : '...');
            })()}
          </p>
        </div>
      </div>

      {/* Bottom Navigation - Modernized */}
      <div className={`${settings.appearance.darkMode ? "bg-slate-900/90" : "bg-white/90"} py-3 flex justify-around border-b ${settings.appearance.darkMode ? "border-white/5" : "border-amber-200/30"} backdrop-blur-md gap-2 rounded-t-2xl shadow-2xl mx-2 mb-2`}>
        <button
          onClick={() => navigate("/favorites")}
          className="flex flex-col items-center rounded-full p-2 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-slate-800 dark:to-slate-900 shadow-md hover:scale-105 transition"
        >
          <Heart className="w-6 h-6 text-pink-500 mb-1" />
          <span className="text-xs font-arabic text-gray-700 dark:text-gray-300">{settings.language === "ar" ? "المفضلة" : "Favorites"}</span>
        </button>
        <button
          onClick={() => navigate("/qibla")}
          className="flex flex-col items-center rounded-full p-2 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-slate-800 dark:to-slate-900 shadow-md hover:scale-105 transition"
        >
          <MapPin className="w-6 h-6 text-blue-500 mb-1" />
          <span className="text-xs font-arabic text-gray-700 dark:text-gray-300">{settings.language === "ar" ? "القبلة" : "Qibla"}</span>
        </button>
        <button
          onClick={() => navigate("/prayer-times")}
          className="flex flex-col items-center rounded-full p-2 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-slate-800 dark:to-slate-900 shadow-md hover:scale-105 transition"
        >
          <Clock className="w-6 h-6 text-green-500 mb-1" />
          <span className="text-xs font-arabic text-gray-700 dark:text-gray-300">{settings.language === "ar" ? "الصلاة" : "Prayer"}</span>
        </button>
        <button
          onClick={() => navigate("/tasbih")}
          className="flex flex-col items-center rounded-full p-2 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-slate-800 dark:to-slate-900 shadow-md hover:scale-105 transition"
        >
          <Sun className="w-6 h-6 text-yellow-500 mb-1" />
          <span className="text-xs font-arabic text-gray-700 dark:text-gray-300">{settings.language === "ar" ? "العداد" : "Counter"}</span>
        </button>
      </div>

      {/* Main Content - Categories Grid */}
      <div className="flex-1 py-5 px-3">
        {/* Night Dua Card - Keep */}
        <div className="mb-5">
          <NightDuas />
        </div>

        {/* Categories Grid - Now Sortable */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedItems.map(item => item.id)} // Pass array of IDs
            strategy={rectSortingStrategy} // Use grid strategy
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {orderedItems.map((item) => (
                <SortableCategoryItem key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Index;
// Removed duplicate Quran display section from the end of the file
