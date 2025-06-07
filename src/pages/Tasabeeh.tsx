import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, Share, RefreshCw } from "lucide-react";
import { tasabeehItems } from "../data/tasabeehData";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const TasabeehList = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const { toast } = useToast();

  // Animation variants for the cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center border-b border-gray-800 sticky top-0 z-10">
        <button onClick={() => navigate("/")} className="p-2 text-white">
          {settings.language === "ar" ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>
        <h2 className="text-xl font-arabic font-bold">تسابيح</h2>
        <div className="w-5 h-5"></div> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {tasabeehItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/tasabeeh/${item.id}`)}
              className={`${item.backgroundColor} rounded-lg p-5 shadow-md flex items-center justify-center text-center cursor-pointer`}
            >
              <p className="text-lg font-arabic font-bold text-gray-800">{item.virtue}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const TasabeehCounter = () => {
  const navigate = useNavigate();
  const { settings, addFavorite, removeFavorite, isFavorite } = useAppSettings();
  const { toast } = useToast();
  const { id } = useParams();

  // Find the current tasbeeh
  const currentTasbeeh = tasabeehItems.find(item => item.id === id);

  console.log("TasabeehCounter - tasbeehId:", id); // Debug log
  console.log("TasabeehCounter - currentTasbeeh:", currentTasbeeh); // Debug log
  console.log("TasabeehCounter - all tasabeehItems:", tasabeehItems.map(item => item.id)); // Debug log - just IDs

  // State for counts
  const [currentIndex, setCurrentIndex] = useState(0);
  const [azkarCounts, setAzkarCounts] = useState<Record<string, number>>({});

  // Filter to only show the selected tasbeeh
  const filteredTasbeeh = useMemo(() => {
    if (id) {
      return tasabeehItems.filter(item => item.id === id);
    }
    return tasabeehItems;
  }, [id]);

  // Initialize counts
  useEffect(() => {
    if (filteredTasbeeh.length > 0) {
      const initialCounts = filteredTasbeeh.reduce((acc, tasbeeh) => {
        acc[tasbeeh.uniqueId] = tasbeeh.count;
        return acc;
      }, {} as Record<string, number>);
      setAzkarCounts(initialCounts);
    }
  }, [filteredTasbeeh]);

  if (!currentTasbeeh) {
    navigate("/tasabeeh");
    return null;
  }

  const currentRemainingCount = currentTasbeeh ? azkarCounts[currentTasbeeh.uniqueId] ?? currentTasbeeh.count : 0;
  const isCurrentFavorite = currentTasbeeh ? isFavorite(currentTasbeeh.uniqueId) : false;

  // State for ripple effect
  const [rippleEffect, setRippleEffect] = useState({ x: 0, y: 0, show: false });

  const handleAzkarClick = (e) => {
    if (!currentTasbeeh) return;
    const currentCount = azkarCounts[currentTasbeeh.uniqueId];

    // Create ripple effect at click position
    if (e && e.clientX) {
      const rect = e.currentTarget.getBoundingClientRect();
      setRippleEffect({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        show: true
      });

      // Hide ripple after animation
      setTimeout(() => {
        setRippleEffect(prev => ({ ...prev, show: false }));
      }, 500);
    }

    if (currentCount > 0) {
      const newCount = currentCount - 1;
      setAzkarCounts(prevCounts => ({
        ...prevCounts,
        [currentTasbeeh.uniqueId]: newCount,
      }));

      // Vibrate if available
      if (navigator.vibrate) {
        navigator.vibrate(20);
      }

      // Show toast and provide stronger vibration feedback when counter reaches zero
      if (newCount === 0) {
        // Stronger vibration pattern for completion
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }

        toast({
          title: "اكتمل الذكر",
          description: `لقد أكملت ${currentTasbeeh.count} من التسبيح`,
        });

        // Play a subtle sound if available
        try {
          const audio = new Audio('/sounds/complete.mp3');
          audio.volume = 0.5;
          audio.play().catch(e => console.log('Sound not available', e));
        } catch (error) {
          console.log('Sound playback not supported');
        }
      }
    } else {
      // Reset counter if it's already at zero
      resetCounter();
    }
  };

  const resetCounter = () => {
    if (!currentTasbeeh) return;

    setAzkarCounts(prevCounts => ({
      ...prevCounts,
      [currentTasbeeh.uniqueId]: currentTasbeeh.count,
    }));

    toast({
      title: "تم إعادة العداد",
      description: "تم إعادة تعيين العداد للبدء من جديد",
    });
  };

  const toggleFavorite = () => {
    if (!currentTasbeeh) return;
    const currentlyIsFavorite = isFavorite(currentTasbeeh.uniqueId);

    if (currentlyIsFavorite) {
      removeFavorite(currentTasbeeh.uniqueId);
    } else {
      if (!isFavorite(currentTasbeeh.uniqueId)) {
        addFavorite(currentTasbeeh.uniqueId);
      }
    }
  };

  const shareAzkar = () => {
    if (!currentTasbeeh) return;

    const shareText = currentTasbeeh.text;

    if (navigator.share) {
      navigator.share({
        title: "تسبيح",
        text: shareText,
      }).catch((err) => {
        console.error("Error sharing:", err);
        // Fallback to clipboard if share fails
        navigator.clipboard.writeText(shareText).then(() => {
          toast({
            title: settings.language === "ar" ? "تم النسخ" : "Copied to clipboard",
            description: settings.language === "ar" ? "تم نسخ التسبيح إلى الحافظة" : "Tasbeeh was copied to clipboard",
          });
        });
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText).then(() => {
        toast({
          title: settings.language === "ar" ? "تم النسخ" : "Copied to clipboard",
          description: settings.language === "ar" ? "تم نسخ التسبيح إلى الحافظة" : "Tasbeeh was copied to clipboard",
        });
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center border-b border-gray-800 sticky top-0 z-10">
        <button onClick={() => navigate("/tasabeeh")} className="p-2 text-white">
          {settings.language === "ar" ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>
        <h2 className="text-xl font-arabic font-bold truncate max-w-[70%]">تسابيح</h2>
        <div className="w-5 h-5"></div> {/* Spacer */}
      </div>

      {/* Main Content Area - Entire area clickable */}
      <motion.div
        className="flex-1 flex flex-col overflow-hidden bg-black cursor-pointer relative"
        onClick={handleAzkarClick}
        whileTap={{ scale: 0.98 }}
      >
        {/* Ripple effect */}
        {rippleEffect.show && (
          <motion.div
            className="absolute bg-white rounded-full opacity-30 pointer-events-none"
            initial={{ width: 0, height: 0, x: rippleEffect.x, y: rippleEffect.y, opacity: 0.5 }}
            animate={{ width: 200, height: 200, x: rippleEffect.x - 100, y: rippleEffect.y - 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
        {/* Tasbeeh Text Section */}
        <div
          key={`tasbeeh-${currentTasbeeh.id}`}
          className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto relative"
        >
          <p className="arabic-text text-3xl md:text-4xl font-bold text-center leading-relaxed text-white">
            {currentTasbeeh.text}
          </p>

          {/* Small indicator to show the area is clickable */}
          <div className="mt-6 text-gray-500 text-xs flex items-center">
            <span>اضغط للتسبيح</span>
            <span className="mx-1">•</span>
            <span>{currentRemainingCount} / {currentTasbeeh.count}</span>
          </div>
        </div>

        {/* Virtue Section */}
        <div className="px-6 py-4 text-right">
          <p className="text-cyan-400 font-arabic text-xl">
            {currentTasbeeh.virtue}
          </p>
        </div>

        {/* Hadith Section */}
        <div className="px-6 py-4 border-t border-gray-800 text-right overflow-y-auto">
          {currentTasbeeh.hadith && (
            <div className="mb-3">
              <p className="text-cyan-400 font-arabic text-base leading-relaxed">
                {currentTasbeeh.hadith}
              </p>
              {currentTasbeeh.reference && (
                <p className="text-cyan-400 text-sm font-arabic mt-2">
                  ({currentTasbeeh.reference})
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Reset Button */}
      <div className="flex justify-center py-4 bg-black">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={resetCounter}
          className="bg-gray-800 text-white text-sm px-4 py-2 rounded-full flex items-center shadow-md"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          إعادة العداد
        </motion.button>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-black p-3 flex items-center justify-between border-t border-gray-800 sticky bottom-0 z-10">
        {/* Counter Display */}
        <div className="flex items-center text-white">
          <span className="text-sm font-arabic">{currentIndex + 1}/{filteredTasbeeh.length}</span>
        </div>

        {/* Central Counter Button - Larger and more prominent with progress circle */}
        <div className="flex items-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAzkarClick}
            className={`w-20 h-20 rounded-full ${currentRemainingCount === 0 ? 'bg-green-800' : 'bg-gray-800'} flex items-center justify-center border-2 ${currentRemainingCount === 0 ? 'border-green-600' : 'border-gray-700'} shadow-lg relative`}
          >
            {/* Progress Circle */}
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="#333"
                strokeWidth="5"
              />

              {/* Progress Circle - Decreases as count decreases */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke={currentTasbeeh.backgroundColor.includes('sky') ? '#0ea5e9' :
                       currentTasbeeh.backgroundColor.includes('pink') ? '#ec4899' :
                       currentTasbeeh.backgroundColor.includes('amber') ? '#f59e0b' :
                       currentTasbeeh.backgroundColor.includes('green') ? '#10b981' :
                       currentTasbeeh.backgroundColor.includes('purple') ? '#8b5cf6' :
                       '#4A8262'}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${(currentRemainingCount / currentTasbeeh.count) * 283} 283`}
                transform="rotate(-90 50 50)"
              />
            </svg>

            {/* Count Display */}
            <motion.span
              key={currentRemainingCount}
              initial={{ scale: 1.2, opacity: 0.7 }}
              animate={{
                scale: currentRemainingCount === 0 ? [1, 1.2, 1] : 1,
                opacity: 1,
                color: currentRemainingCount === 0 ? ['#ffffff', '#4ade80', '#ffffff'] : '#ffffff'
              }}
              transition={{
                duration: currentRemainingCount === 0 ? 1.5 : 0.3,
                repeat: currentRemainingCount === 0 ? 1 : 0,
                repeatType: "reverse"
              }}
              className="text-2xl font-bold text-white z-10"
            >
              {currentRemainingCount === 0 ? "✓" : currentRemainingCount}
            </motion.span>
          </motion.button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* Share Button */}
          <button
            onClick={shareAzkar}
            className="text-white p-1"
            aria-label={settings.language === 'ar' ? 'مشاركة' : 'Share'}
          >
            <Share className="h-5 w-5" />
          </button>

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="text-white p-1"
            aria-label={settings.language === 'ar' ? 'المفضلة' : 'Favorite'}
          >
            <Heart className={`h-5 w-5 ${isCurrentFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Tasabeeh = () => {
  const { id } = useParams();

  console.log("Tasabeeh component loaded with ID:", id); // Debug log

  // If there's a tasbeeh ID in the URL, show the counter, otherwise show the list
  if (id) {
    console.log("Rendering TasabeehCounter with ID:", id);
    return <TasabeehCounter />;
  } else {
    console.log("Rendering TasabeehList");
    return <TasabeehList />;
  }
};

export default Tasabeeh;
