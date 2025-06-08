import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSettings } from "../contexts/AppSettingsContext";
import { Moon, ChevronRight, Heart } from 'lucide-react';
import { duaCategories, Dua } from '../data/duaData';

const nightDuasCategory = duaCategories.find(category => category.id === "night-duas");

const NightDuas: React.FC = () => {
  const navigate = useNavigate();
  const { settings, addFavorite, removeFavorite, isFavorite } = useAppSettings();
  const isArabic = settings.language === "ar";
  
  const nightDuas = nightDuasCategory?.duas || [];

  // Function to check if it's night time (between sunset and sunrise)
  const isNightTime = () => {
    const now = new Date();
    const hour = now.getHours();
    // Assuming night time is between 7 PM (19:00) and 5 AM (05:00)
    return hour >= 19 || hour < 5;
  };

  const getRandomDua = (): Dua | undefined => {
    if (nightDuas.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * nightDuas.length);
    return nightDuas[randomIndex];
  };
  
  const [currentDua, setCurrentDua] = React.useState<Dua | undefined>(getRandomDua());

  // Move the conditional return after all hooks have been called
  if (!isNightTime()) {
    return null;
  }

  const changeDua = () => {
    let newDua = getRandomDua();
    // Make sure we don't get the same dua twice in a row
    while (newDua && currentDua && newDua.id === currentDua.id) {
      newDua = getRandomDua();
    }
    setCurrentDua(newDua);
  };

  const handleToggleFavorite = () => {
    if (!currentDua?.uniqueId) {
      console.log("No uniqueId found for current dua");
      return;
    }
    
    console.log("Toggling favorite for dua:", currentDua.uniqueId);
    if (isFavorite(currentDua.uniqueId)) {
      console.log("Removing from favorites");
      removeFavorite(currentDua.uniqueId);
    } else {
      console.log("Adding to favorites");
      addFavorite(currentDua.uniqueId);
    }
  };

  if (!currentDua) {
    return <div className="text-center">No night duas available.</div>;
  }

  const isCurrentDuaFavorite = isFavorite(currentDua.uniqueId);
  console.log("Current dua favorite status:", isCurrentDuaFavorite, "for dua:", currentDua.uniqueId);

  return (
    <div className="relative min-h-[200px] bg-gradient-to-br from-slate-900 to-indigo-900 border border-indigo-800/30 p-4 rounded-xl overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-2 right-2 opacity-20">
        <Moon className="w-12 h-12 text-indigo-300" />
      </div>

      <div className="absolute top-3 left-3 flex items-center z-10">
        <h3 className="text-lg font-arabic text-indigo-300">
          {isArabic ? "دعاء من تعار من الليل" : "Night Duas"}
        </h3>
      </div>

      <div className="absolute bottom-3 right-3 z-10">
        <button
          onClick={() => navigate("/dua-category/night-duas")}
          className="flex items-center text-xs text-indigo-300 hover:text-indigo-200"
        >
          {isArabic ? "المزيد" : "More"}
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>

      <div className="flex justify-center items-center mt-12 mb-12">
        <div className="max-w-sm">
          <p onClick={changeDua} className="text-center font-arabic text-white text-base leading-loose cursor-pointer">
            {currentDua.arabic}
          </p>

          {currentDua.reference && (
            <p className="text-center text-xs text-indigo-300 mt-2">
              {currentDua.reference}
            </p>
          )}

          {/* Favorite Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full ${isCurrentDuaFavorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors`}
              aria-label={isCurrentDuaFavorite ? (isArabic ? "إزالة من المفضلة" : "Remove from favorites") : (isArabic ? "إضافة إلى المفضلة" : "Add to favorites")}
            >
              <Heart className={`w-6 h-6 ${isCurrentDuaFavorite ? 'fill-current text-red-500' : 'text-transparent'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NightDuas;