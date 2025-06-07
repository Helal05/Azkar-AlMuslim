import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { motion } from "framer-motion";

const FridayDua = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();

  // Collection of Friday duas
  const fridayDuas = [
    "اللَّهُمَّ اغْفِرْ لِي، وَاهْدِنِي، وَارْزُقْنِي، وَعَافِنِي، أَعُوذُ بِاللهِ مِنْ ضِيقِ المَقَامِ يَومَ القِيَامَةِ.",
    "اللَّهُمَّ فِي عَذَابِكَ يَوْمَ تَبْعَثُ عِبَادَكَ.",
    "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ، وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، وَبَارِكْ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ، وَعَلَى آلِ إِبْرَاهِيمَ، فِي الْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ.",
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَعُوذُ بِكَ مِنَ النَّارِ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ.",
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ، وَأَعُوذُ بِكَ مِنَ الشَّرِّ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ.",
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ مَا سَأَلَكَ عَبْدُكَ وَنَبِيُّكَ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا عَاذَ بِهِ عَبْدُكَ وَنَبِيُّكَ.",
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَعُوذُ بِكَ مِنَ النَّارِ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَسْأَلُكَ أَنْ تَجْعَلَ كُلَّ قَضَاءٍ قَضَيْتَهُ لِي خَيْرًا.",
    "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.",
    "اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ."
  ];

  // State to track current dua index
  const [currentDuaIndex, setCurrentDuaIndex] = useState(0);

  // Function to change dua when screen is tapped
  const changeDua = () => {
    setCurrentDuaIndex((prevIndex) => (prevIndex + 1) % fridayDuas.length);
  };

  // State for ripple effect
  const [rippleEffect, setRippleEffect] = useState({ x: 0, y: 0, show: false });

  // Handle screen tap with ripple effect
  const handleScreenTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Create ripple effect at click position
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

    // Change dua
    changeDua();
  };

  return (
    <div className={`min-h-screen ${settings.appearance.darkMode ? "bg-gradient-to-b from-slate-900 to-slate-950" : "bg-gradient-to-b from-amber-50 to-amber-100"} flex flex-col`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 ${settings.appearance.darkMode ? "bg-slate-800/90" : "bg-white/90"} backdrop-blur-md border-b ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"}`}>
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate("/friday-sunan")}
            className={`p-2 rounded-lg ${settings.appearance.darkMode ? "hover:bg-slate-700/50" : "hover:bg-amber-100/50"}`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="font-arabic text-xl font-semibold">الدعــــاء</h1>
          <div className="w-10"></div> {/* Placeholder for alignment */}
        </div>
      </div>

      {/* Main content - Clickable area */}
      <motion.div 
        className="flex-1 relative overflow-hidden"
        onClick={handleScreenTap}
      >
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/backgrounds/bg${(currentDuaIndex % 6) + 1}.jpg.jpeg')`,
          }}
        />
        
        {/* Ripple effect */}
        {rippleEffect.show && (
          <motion.div
            className="absolute bg-white rounded-full opacity-30 pointer-events-none"
            initial={{ width: 0, height: 0, x: rippleEffect.x, y: rippleEffect.y, opacity: 0.5 }}
            animate={{ width: 300, height: 300, x: rippleEffect.x - 150, y: rippleEffect.y - 150, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}

        {/* Dua text */}
        <div className="relative z-10 flex items-center justify-center h-full p-6">
          <motion.div
            key={currentDuaIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="font-arabic text-2xl leading-relaxed text-white">
              {fridayDuas[currentDuaIndex]}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer hint */}
      <div className={`p-3 text-center ${settings.appearance.darkMode ? "bg-slate-800/90" : "bg-white/90"} backdrop-blur-md border-t ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"}`}>
        <p className="font-arabic text-sm opacity-70">اضغط على الشاشة لتغيير الدعاء</p>
      </div>
    </div>
  );
};

export default FridayDua;
