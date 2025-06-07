import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { duaCategories } from "../data/duaData";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Heart, Share2, Bookmark } from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext"; // Import useAppSettings

// Function to remove Arabic diacritics
const removeDiacritics = (text: string): string => {
  return text.replace(/[\u064B-\u0652]/g, "");
};

const DuaCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  // Use favorites, addFavorite, removeFavorite, and isFavorite from useAppSettings
  const { settings, favorites, addFavorite, removeFavorite, isFavorite } = useAppSettings(); 
  const isArabic = settings.language === "ar"; // Determine if language is Arabic
  
  // Remove local favorites state, use from context
  // const [favorites, setFavorites] = useState<string[]>([]); 
  const [category, setCategory] = useState(duaCategories.find(c => c.id === categoryId));
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Loading favorites is now handled by the context
    // const savedFavorites = localStorage.getItem("dua_favorites");
    // console.log("Loading favorites from localStorage:", savedFavorites); 
    // if (savedFavorites) {
    //   try { 
    //     const parsedFavorites = JSON.parse(savedFavorites);
    //     setFavorites(parsedFavorites);
    //     console.log("Favorites loaded:", parsedFavorites); 
    //   } catch (error) {
    //     console.error("Error parsing favorites from localStorage:", error); 
    //   }
    // } else {
    //   console.log("No favorites found in localStorage."); 
    //   setFavorites([]); 
    // }
  }, [categoryId]); // Keep categoryId as dependency to re-evaluate category

  // Add useEffect to update category if duaCategories changes (though it's const, good practice)
  useEffect(() => {
    setCategory(duaCategories.find(c => c.id === categoryId));
  }, [categoryId]); // Depend on categoryId

  
  if (!category) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${settings.appearance.darkMode ? "bg-gradient-to-b from-slate-900 to-slate-950 text-white" : "bg-gradient-to-b from-amber-50 to-amber-100 text-slate-900"}`}>
        <p className={`font-arabic text-xl ${settings.appearance.darkMode ? "text-white" : "text-slate-900"}`}>
          {isArabic ? "لم يتم العثور على هذه الفئة" : "Category not found"}
        </p>
        <button
          onClick={() => navigate("/")} // Navigate to home page
          className="mt-4 px-6 py-2 bg-islamic-green-dark rounded-lg text-white font-arabic"
        >
          {isArabic ? "العودة" : "Back"}
        </button>
      </div>
    );
  }
  
  // Use addFavorite and removeFavorite from context
  const handleToggleFavorite = (duaId: string) => {
    if (isFavorite(duaId)) {
      removeFavorite(duaId);
    } else {
      addFavorite(duaId);
    }
  };
  
  const shareDua = async (dua: {
    title: string;
    arabic: string;
    translation?: string;
    reference?: string;
    source?: string;
  }) => {
    const shareText = dua.arabic;

    if (navigator.share) {
      try {
        await navigator.share({
          title: dua.title,
          text: shareText,
        });
      } catch (err: any) {
        console.error("Error sharing:", err);
        // Fallback to clipboard if share fails
        navigator.clipboard.writeText(shareText).then(() => {
          toast({
            title: isArabic ? "تم النسخ" : "Copied to clipboard",
            description: isArabic ? "تم نسخ الدعاء إلى الحافظة" : "Dua was copied to clipboard",
          });
        });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText).then(() => {
        toast({
          title: isArabic ? "تم النسخ" : "Copied to clipboard",
          description: isArabic ? "تم نسخ الدعاء إلى الحافظة" : "Dua was copied to clipboard",
        });
      });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${settings.appearance.darkMode ? "bg-gradient-to-b from-slate-900 to-slate-950 text-white" : "bg-gradient-to-b from-amber-50 to-amber-100 text-slate-900"}`}>
      {/* Header */}
      <div className={`${settings.appearance.darkMode ? "bg-slate-900/90 text-white" : "bg-white/90 text-slate-900"} p-4 flex items-center border-b ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} backdrop-blur-md`}>
        <button onClick={() => navigate("/")} className={`p-2 mr-2 ${settings.appearance.darkMode ? "text-white/70 hover:text-white" : "text-slate-600 hover:text-slate-800"}`}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className={`text-xl font-arabic font-bold ${settings.appearance.darkMode ? "text-white" : "text-slate-900"}`}>{category.name}</h2>
      </div>
      
      {/* Dua List */}
      <div className="flex-1 p-4">
        {category.duas.map((dua) => {
          // Check if the dua is a Quranic verse
          const isQuranVerse = dua.source?.includes("سورة") || dua.reference?.includes("سورة");
          const arabicText = isQuranVerse ? dua.arabic : removeDiacritics(dua.arabic);

          return (
            <div 
              key={dua.id}
              className={`mb-6 rounded-lg overflow-hidden border ${settings.appearance.darkMode ? "bg-slate-800/20 border-slate-700" : "bg-white/50 border-amber-200"}`}
            >
              <div className={`py-2 px-4 flex justify-between items-center ${settings.appearance.darkMode ? "bg-slate-700/30" : "bg-amber-100/50"}`}>
                <h3 className={`font-arabic text-lg ${settings.appearance.darkMode ? "text-white" : "text-slate-900"}`}>{dua.title}</h3>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => handleToggleFavorite(dua.id)} // Use handleToggleFavorite
                    className="p-1 rounded-full"
                  >
                    <Heart 
                      className="w-5 h-5" 
                      fill={isFavorite(dua.id) ? "#ef4444" : "none"} // Use isFavorite from context
                      color={isFavorite(dua.id) ? "#ef4444" : (settings.appearance.darkMode ? "white" : "currentColor")} // Use isFavorite from context
                    />
                  </button>
                  <button
                    onClick={() => shareDua(dua)}
                    className="p-1 rounded-full"
                  >
                    <Share2 className={`w-5 h-5 ${settings.appearance.darkMode ? "text-white" : "text-slate-600"}`} />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <p className={`font-arabic text-right text-lg leading-relaxed mb-4 ${settings.appearance.darkMode ? "text-white" : "text-slate-900"}`}>
                  {arabicText}
                </p>
                
                {/* Conditionally render translation */}
                {!isArabic && dua.translation && (
                  <div className={`mb-4 border-t ${settings.appearance.darkMode ? "border-slate-700" : "border-amber-200"} pt-3`}>
                    <p className={`font-arabic text-right ${settings.appearance.darkMode ? "text-gray-300" : "text-slate-700"}`}>
                      {dua.translation}
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col mt-3">
                  {dua.virtue && (
                    <p className={`font-arabic text-sm text-right mb-2 ${settings.appearance.darkMode ? "text-amber-400" : "text-amber-700"}`}>
                      {dua.virtue}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center mt-2">
                    <p className={`font-arabic text-sm ${settings.appearance.darkMode ? "text-gray-400" : "text-slate-600"}`}>
                      {dua.reference || dua.source}
                    </p>
                    
                    {dua.times && dua.times > 1 && (
                      <div className={`px-2 py-1 rounded-md ${settings.appearance.darkMode ? "bg-islamic-green-dark/30" : "bg-islamic-green-light/30"}`}>
                        <p className={`font-arabic text-sm ${settings.appearance.darkMode ? "text-islamic-green-light" : "text-islamic-green-dark"}`}>
                          يقال {dua.times} مرات
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DuaCategory;
