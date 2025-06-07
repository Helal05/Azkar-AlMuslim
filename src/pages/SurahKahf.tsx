import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ZoomIn, ZoomOut, ArrowUp } from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { motion } from "framer-motion";

const SurahKahf = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const [scale, setScale] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  // Header component
  const Header = () => (
    <div className={`sticky top-0 z-50 ${settings.appearance.darkMode ? "bg-slate-800/90" : "bg-white/90"} backdrop-blur-md border-b ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"}`}>
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={() => navigate("/friday-sunan")}
          className={`p-2 rounded-lg ${settings.appearance.darkMode ? "hover:bg-slate-700/50" : "hover:bg-amber-100/50"}`}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="font-arabic text-xl font-semibold">سورة الكهف</h1>
        <div className="w-10"></div>
      </div>
    </div>
  );

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Controls for zoom
  const Controls = () => (
    <div className={`fixed bottom-4 right-4 flex flex-col gap-2 p-2 rounded-lg ${settings.appearance.darkMode ? "bg-slate-800/80" : "bg-white/80"} backdrop-blur-md`}>
      <button
        onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
        className={`p-2 rounded-full ${settings.appearance.darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-amber-100 hover:bg-amber-200"}`}
      >
        <ZoomIn className="h-5 w-5" />
      </button>
      <button
        onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
        className={`p-2 rounded-full ${settings.appearance.darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-amber-100 hover:bg-amber-200"}`}
      >
        <ZoomOut className="h-5 w-5" />
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen ${settings.appearance.darkMode ? "bg-black text-white" : "bg-amber-50 text-black"} flex flex-col`}>
      <Header />
      <div className="flex-1 overflow-auto flex justify-center" ref={contentRef}>
        <motion.div 
          className="p-4 max-w-full"
          style={{ 
            scale,
            transformOrigin: "center center"
          }}
        >
          <img 
            src="/quran/surah-kahf-1.png" 
            alt="سورة الكهف" 
            className={`max-w-full ${settings.appearance.darkMode ? "invert" : ""}`}
          />
          <img 
            src="/quran/surah-kahf-2.png" 
            alt="سورة الكهف" 
            className={`max-w-full mt-4 ${settings.appearance.darkMode ? "invert" : ""}`}
          />
          <img 
            src="/quran/surah-kahf-3.png" 
            alt="سورة الكهف" 
            className={`max-w-full mt-4 ${settings.appearance.darkMode ? "invert" : ""}`}
          />
          <img 
            src="/quran/surah-kahf-4.png" 
            alt="سورة الكهف" 
            className={`max-w-full mt-4 ${settings.appearance.darkMode ? "invert" : ""}`}
          />
          <img 
            src="/quran/surah-kahf-5.png" 
            alt="سورة الكهف" 
            className={`max-w-full mt-4 ${settings.appearance.darkMode ? "invert" : ""}`}
          />
          <img 
            src="/quran/surah-kahf-6.png" 
            alt="سورة الكهف" 
            className={`max-w-full mt-4 ${settings.appearance.darkMode ? "invert" : ""}`}
          />
          <img 
            src="/quran/surah-kahf-7.png" 
            alt="سورة الكهف" 
            className={`max-w-full mt-4 ${settings.appearance.darkMode ? "invert" : ""}`}
          />
          <img 
            src="/quran/surah-kahf-8.png" 
            alt="سورة الكهف" 
            className={`max-w-full mt-4 ${settings.appearance.darkMode ? "invert" : ""}`}
          />
          <img 
            src="/quran/surah-kahf-9.png" 
            alt="سورة الكهف" 
            className={`max-w-full mt-4 ${settings.appearance.darkMode ? "invert" : ""}`}
          />
          <img 
            src="/quran/surah-kahf-10.png" 
            alt="سورة الكهف" 
            className={`max-w-full mt-4 ${settings.appearance.darkMode ? "invert" : ""}`}
          />
          <img 
            src="/quran/surah-kahf-11.png" 
            alt="سورة الكهف" 
            className={`max-w-full mt-4 ${settings.appearance.darkMode ? "invert" : ""}`}
          />
          <img 
            src="/quran/surah-kahf-12.png" 
            alt="سورة الكهف" 
            className={`max-w-full mt-4 ${settings.appearance.darkMode ? "invert" : ""}`}
          />
        </motion.div>
      </div>
      <div className="flex justify-center py-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={scrollToTop}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${settings.appearance.darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-amber-100 hover:bg-amber-200"}`}
        >
          <ArrowUp className="h-5 w-5" />
          <span className="font-arabic">العودة لبداية السورة</span>
        </button>
      </div>
      <Controls />
    </div>
  );
};

export default SurahKahf;

