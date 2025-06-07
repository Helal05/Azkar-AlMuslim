import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { tasabeehItems } from "../data/tasabeehData";
import { useAppSettings } from "../contexts/AppSettingsContext";

const TasbeehCounter = () => {
  const { tasbeehId } = useParams<{ tasbeehId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useAppSettings();
  
  const [count, setCount] = useState(0);
  
  // Find the current tasbeeh
  const currentTasbeeh = tasabeehItems.find(item => item.id === tasbeehId);
  
  // If tasbeeh not found, navigate back
  useEffect(() => {
    if (!currentTasbeeh) {
      navigate("/tasabeeh");
    }
  }, [currentTasbeeh, navigate]);
  
  // Target count from the tasbeeh item
  const target = currentTasbeeh?.count || 100;
  
  // Load saved count from localStorage
  useEffect(() => {
    if (currentTasbeeh) {
      const savedCount = localStorage.getItem(`tasbeeh_count_${currentTasbeeh.id}`);
      if (savedCount) setCount(Number(savedCount));
    }
  }, [currentTasbeeh]);
  
  // Save count to localStorage on changes
  useEffect(() => {
    if (currentTasbeeh) {
      localStorage.setItem(`tasbeeh_count_${currentTasbeeh.id}`, String(count));
    }
  }, [count, currentTasbeeh]);
  
  const incrementCount = () => {
    // Only increment if count is less than target
    if (count < target) {
      const newCount = count + 1;
      setCount(newCount);
      
      // Vibrate if available
      if (navigator.vibrate) {
        navigator.vibrate(20);
      }
      
      // Show toast when target is reached
      if (newCount === target) {
        toast({
          title: "اكتمل الهدف",
          description: `لقد وصلت إلى ${target} تسبيحة.`,
        });
      }
    }
  };
  
  const resetCount = () => {
    setCount(0);
    toast({
      title: "تم التصفير",
      description: "تم تصفير العداد"
    });
  };
  
  const shareCounter = () => {
    if (navigator.share) {
      navigator.share({
        title: "عداد التسبيح",
        text: `${currentTasbeeh?.text}: ${count}/${target}`,
        url: window.location.href
      }).catch(err => console.error("Error sharing:", err));
    } else {
      toast({
        title: "المشاركة غير متاحة",
        description: "متصفحك لا يدعم ميزة المشاركة"
      });
    }
  };
  
  if (!currentTasbeeh) {
    return null; // Return null while navigating away
  }
  
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <button onClick={() => navigate("/tasabeeh")} className="p-2">
          {settings.language === "ar" ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
        <h2 className="text-xl font-arabic font-bold">عداد التسبيح</h2>
        <div className="w-9 h-9"></div> {/* Placeholder to keep spacing */}
      </div>
      
      {/* Tasbeeh Text */}
      <div className={`${currentTasbeeh.backgroundColor} p-6 text-center`}>
        <h3 className="text-2xl font-arabic font-bold mb-2">{currentTasbeeh.text}</h3>
        <p className="text-sm font-arabic text-gray-700">{currentTasbeeh.virtue}</p>
      </div>

      {/* Tasbeeh Counter View */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Progress Arc */}
        <div className="w-64 h-64 relative mb-8">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#333"
              strokeWidth="5"
            />
            
            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#4A8262"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${(count / target) * 283} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          
          {/* Count Display */}
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-white">{count}</span>
            <span className="text-sm text-gray-400 mt-2">الهدف: {target}</span>
          </div>
        </div>

        {/* Tasbeeh Controls */}
        <div className="flex justify-center space-x-4 rtl:space-x-reverse mb-8">
          <button
            onClick={resetCount}
            className="p-3 bg-gray-900 rounded-full text-white"
          >
            <RefreshCw className="h-6 w-6" />
          </button>
          
          <button 
            onClick={shareCounter}
            className="p-3 bg-gray-900 rounded-full text-white"
          >
            <Share2 className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={incrementCount}
        disabled={count >= target}
        className={`text-white py-8 text-xl font-arabic ${count >= target ? 'bg-gray-600 cursor-not-allowed' : 'bg-teal-800 hover:bg-teal-700'}`}
      >
        {count >= target ? 'اكتمل الهدف' : 'اضغط للتسبيح'}
      </motion.button>
    </div>
  );
};

export default TasbeehCounter;
