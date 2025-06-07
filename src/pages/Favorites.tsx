import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Share2, Trash2 } from "lucide-react";
import { azkarItems, AzkarItem, azkarCategories } from "../data/azkarData";
import { prayerAzkarData, PrayerAzkarItem as PrayerAzkarDataItem } from "../data/prayerAzkarData";
import { tasabeehItems, TasbeehItem } from "../data/tasabeehData";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useToast } from "@/hooks/use-toast";
import { allahNames } from "./NamesOfAllah";
import { duaCategories } from "../data/duaData";

const Favorites = () => {
  const navigate = useNavigate();
  const { settings, removeFavorite, favorites } = useAppSettings();
  const { toast } = useToast();

  // Filter favorite azkar (excluding prayer azkar which are handled separately)
  const favoriteAzkar: AzkarItem[] = azkarItems.filter(item =>
    favorites.includes(item.uniqueId) && !item.uniqueId.startsWith("prayer_")
  );

  // Filter favorite Names of Allah
  const favoriteAllahNames = allahNames.filter(name => favorites.includes(`allah-name-${name.id}`));

  // Filter favorite Tasabeeh
  const favoriteTasabeeh: TasbeehItem[] = tasabeehItems.filter(item => favorites.includes(item.uniqueId));

  // Filter favorite prayer azkar
  const favoritePrayerAzkar: PrayerAzkarDataItem[] = prayerAzkarData.filter(item => {
    const originalId = item.id || `prayer-page-${prayerAzkarData.indexOf(item)}`;
    const uniquePrayerId = `prayer_${originalId}`;
    return favorites.includes(uniquePrayerId);
  });

  // Filter favorite night duas
  const nightDuasCategory = duaCategories.find(category => category.id === "night-duas");
  const favoriteNightDuas = nightDuasCategory?.duas.filter(dua => 
    favorites.includes(dua.uniqueId)
  ) || [];

  const hasFavorites = favoriteAzkar.length > 0 || 
                      favoriteAllahNames.length > 0 || 
                      favoriteTasabeeh.length > 0 || 
                      favoritePrayerAzkar.length > 0 ||
                      favoriteNightDuas.length > 0;

  const handleShare = (item: AzkarItem | PrayerAzkarDataItem | TasbeehItem | typeof allahNames[0], type: 'azkar' | 'prayer_azkar' | 'tasbeeh' | 'name') => {
    let title = "";
    let text = "";

    if (type === 'azkar') {
      const azkarItem = item as AzkarItem;
      const category = azkarCategories.find(cat => cat.id === azkarItem.category);
      title = category?.name || (settings.language === "ar" ? "ذكر" : "Dhikr");
      text = azkarItem.arabic;
    } else if (type === 'prayer_azkar') {
      const prayerItem = item as PrayerAzkarDataItem;
      title = settings.language === "ar" ? "أذكار الصلاة" : "Prayer Azkar";
      text = prayerItem.title;
      if (prayerItem.arabic_text) text += `\n${prayerItem.arabic_text}`;
      // Potentially add more details from sections if needed
    } else if (type === 'tasbeeh') {
      const tasbeehItem = item as TasbeehItem;
      title = settings.language === "ar" ? "تسبيح" : "Tasbeeh";
      text = `${tasbeehItem.text} - ${tasbeehItem.virtue}`;
    } else if (type === 'name') {
      const nameItem = item as typeof allahNames[0];
      title = settings.language === "ar" ? "من أسماء الله الحسنى" : "Name of Allah";
      text = `${nameItem.name} - ${settings.language === "ar" ? nameItem.meaning : nameItem.meaningEn}`;
    }

    if (navigator.share) {
      navigator.share({
        title: title,
        text: text,
        url: window.location.href
      }).catch(err => console.error("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(text).then(() => {
        toast({
          title: settings.language === "ar" ? "تم النسخ" : "Copied to clipboard",
          description: settings.language === "ar" ? "تم نسخ المحتوى إلى الحافظة" : "Content copied to clipboard",
        });
      });
    }
  };

  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id);
    toast({
      title: settings.language === "ar" ? "تمت الإزالة من المفضلة" : "Removed from Favorites",
    });
  };


  return (
    <div className={`min-h-screen ${settings.appearance.darkMode ? "bg-gradient-to-b from-slate-900 to-slate-950 text-white" : "bg-gradient-to-b from-amber-50 to-amber-100 text-slate-900"} flex flex-col`}>
      {/* Header */}
      <div className={`${settings.appearance.darkMode ? "bg-slate-900/90" : "bg-white/90"} p-4 flex justify-between items-center backdrop-blur-md border-b ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} sticky top-0 z-10`}>
        <button onClick={() => navigate("/")} className="p-2">
          {settings.language === 'ar' ?
            <ChevronRight className={`w-5 h-5 ${settings.appearance.darkMode ? "text-white" : "text-slate-900"}`} /> :
            <ChevronLeft className={`w-5 h-5 ${settings.appearance.darkMode ? "text-white" : "text-slate-900"}`} />
          }
        </button>
        <h2 className={`text-xl font-arabic font-bold ${settings.appearance.darkMode ? "text-white" : "text-slate-900"}`}>
          {settings.language === "ar" ? "المفضلة" : "Favorites"}
        </h2>
        <div className="w-5 h-5"></div> {/* Spacer */}
      </div>

      {!hasFavorites ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-5xl mb-4">💫</div>
          <p className={`${settings.appearance.darkMode ? "text-white" : "text-slate-900"} font-arabic text-center text-lg`}>
            {settings.language === "ar" ? "لا توجد مفضلات حتى الآن" : "No favorites yet"}
          </p>
          <p className={`${settings.appearance.darkMode ? "text-gray-400" : "text-slate-600"} font-arabic text-center mt-2`}>
            {settings.language === "ar" ? "اضغط على أيقونة القلب لإضافة العناصر إلى المفضلة" : "Tap the heart icon to add items to your favorites"}
          </p>
        </div>
      ) : (
        <div className={`flex-1 ${settings.appearance.darkMode ? "bg-slate-900" : "bg-amber-50"} p-4 overflow-y-auto`}>
          {/* Favorite Night Duas Section */}
          {favoriteNightDuas.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-xl font-arabic font-bold mb-4 ${settings.appearance.darkMode ? "text-indigo-400" : "text-indigo-700"}`}>
                {settings.language === "ar" ? "أدعية الليل المفضلة" : "Favorite Night Duas"}
              </h2>
              {favoriteNightDuas.map((dua) => (
                <div
                  key={dua.uniqueId}
                  className={`mb-4 ${settings.appearance.darkMode ? "bg-slate-800/50" : "bg-white/50"} rounded-lg overflow-hidden border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} backdrop-blur-md`}
                >
                  <div className={`${settings.appearance.darkMode ? "bg-slate-800" : "bg-amber-100/50"} py-2 px-4 flex justify-between items-center`}>
                    <h3 className={`font-arabic text-lg ${settings.appearance.darkMode ? "text-white" : "text-slate-900"}`}>
                      {dua.title}
                    </h3>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button onClick={() => handleRemoveFavorite(dua.uniqueId)} className="p-1 rounded-full">
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                      <button onClick={() => handleShare(dua, 'dua')} className="p-1 rounded-full">
                        <Share2 className={`w-5 h-5 ${settings.appearance.darkMode ? "text-white" : "text-slate-900"}`} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className={`arabic-text text-md leading-loose ${settings.appearance.darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {dua.arabic}
                    </p>
                    {settings.language === "en" && dua.translation && (
                      <p className={`text-sm mt-2 leading-relaxed ${settings.appearance.darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {dua.translation}
                      </p>
                    )}
                    {dua.reference && (
                      <p className={`text-xs mt-2 ${settings.appearance.darkMode ? "text-gray-500" : "text-gray-500"}`}>
                        ({dua.reference})
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Favorite Prayer Azkar Section */}
          {favoritePrayerAzkar.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-xl font-arabic font-bold mb-4 ${settings.appearance.darkMode ? "text-blue-400" : "text-blue-700"}`}>
                {settings.language === "ar" ? "أذكار الصلاة المفضلة" : "Favorite Prayer Azkar"}
              </h2>
              {favoritePrayerAzkar.map((item) => {
                const originalId = item.id || `prayer-page-${prayerAzkarData.indexOf(item)}`;
                const uniquePrayerId = `prayer_${originalId}`;
                return (
                  <div
                    key={uniquePrayerId}
                    className={`mb-4 ${settings.appearance.darkMode ? "bg-slate-800/50" : "bg-white/50"} rounded-lg overflow-hidden border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} backdrop-blur-md`}
                  >
                    <div className={`${settings.appearance.darkMode ? "bg-slate-800" : "bg-amber-100/50"} py-2 px-4 flex justify-between items-center`}>
                      <h3 className={`font-arabic text-lg ${settings.appearance.darkMode ? "text-white" : "text-slate-900"}`}>
                        {item.title}
                      </h3>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button onClick={() => handleRemoveFavorite(uniquePrayerId)} className="p-1 rounded-full">
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                        <button onClick={() => handleShare(item, 'prayer_azkar')} className="p-1 rounded-full">
                          <Share2 className={`w-5 h-5 ${settings.appearance.darkMode ? "text-white" : "text-slate-900"}`} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      {item.arabic_text && (
                        <p className={`arabic-text text-md leading-loose ${settings.appearance.darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {item.arabic_text}
                        </p>
                      )}
                      {settings.language === "en" && item.translation && (
                        <p className={`text-sm mt-2 leading-relaxed ${settings.appearance.darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {item.translation}
                        </p>
                      )}
                      {item.source && (
                        <p className={`text-xs mt-2 ${settings.appearance.darkMode ? "text-gray-500" : "text-gray-500"}`}>
                          ({item.source})
                        </p>
                      )}
                      {item.sections?.map((section, secIndex) => (
                        <div key={`${uniquePrayerId}-section-${section.id || secIndex}`} className={`mt-3 pt-3 border-t ${settings.appearance.darkMode ? "border-slate-700" : "border-amber-200"}`}>
                          {section.title && (
                            <h4 className={`text-md font-arabic-semibold mb-1 ${settings.appearance.darkMode ? "text-blue-300" : "text-blue-600"}`}>
                              {section.title}
                            </h4>
                          )}
                          <p className={`arabic-text text-md leading-loose ${settings.appearance.darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {section.arabic_text}
                          </p>
                          {settings.language === "en" && section.translation && (
                            <p className={`text-sm mt-2 leading-relaxed ${settings.appearance.darkMode ? "text-gray-400" : "text-gray-600"}`}>
                              {section.translation}
                            </p>
                          )}
                          {section.source && (
                            <p className={`text-xs mt-2 ${settings.appearance.darkMode ? "text-gray-500" : "text-gray-500"}`}>
                              ({section.source})
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Favorite Names of Allah Section */}
          {favoriteAllahNames.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-xl font-arabic font-bold mb-4 ${settings.appearance.darkMode ? "text-amber-400" : "text-amber-700"}`}>
                {settings.language === "ar" ? "أسماء الله الحسنى المفضلة" : "Favorite Names of Allah"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {favoriteAllahNames.map((name) => (
                  <div
                    key={name.id}
                    className={`${settings.appearance.darkMode ? "bg-slate-800/50" : "bg-white/50"} rounded-lg overflow-hidden border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} backdrop-blur-md`}
                  >
                    <div className={`${settings.appearance.darkMode ? "bg-slate-800" : "bg-amber-100/50"} py-2 px-4 flex justify-between items-center`}>
                      <h3 className={`font-arabic text-lg ${settings.appearance.darkMode ? "text-amber-400" : "text-amber-700"}`}>
                        {name.name}
                      </h3>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button onClick={() => handleRemoveFavorite(`allah-name-${name.id}`)} className="p-1 rounded-full">
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                        <button onClick={() => handleShare(name, 'name')} className="p-1 rounded-full">
                          <Share2 className={`w-5 h-5 ${settings.appearance.darkMode ? "text-white" : "text-amber-700"}`} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className={`font-arabic ${settings.appearance.darkMode ? "text-gray-300" : "text-gray-700"} text-sm`}>
                        {settings.language === "ar" ? name.meaning : name.meaningEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorite Tasabeeh Section */}
          {favoriteTasabeeh.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-xl font-arabic font-bold mb-4 ${settings.appearance.darkMode ? "text-green-400" : "text-green-700"}`}>
                {settings.language === "ar" ? "التسابيح المفضلة" : "Favorite Tasabeeh"}
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {favoriteTasabeeh.map((item) => (
                  <div
                    key={item.uniqueId}
                    className={`${settings.appearance.darkMode ? "bg-slate-800/50" : "bg-white/50"} rounded-lg overflow-hidden border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} backdrop-blur-md`}
                  >
                    <div className={`${settings.appearance.darkMode ? "bg-slate-800" : "bg-amber-100/50"} py-2 px-4 flex justify-between items-center`}>
                      <h3 className={`font-arabic text-lg ${settings.appearance.darkMode ? "text-green-400" : "text-green-700"}`}>
                        {item.text}
                      </h3>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button onClick={() => handleRemoveFavorite(item.uniqueId)} className="p-1 rounded-full">
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                        <button onClick={() => handleShare(item, 'tasbeeh')} className="p-1 rounded-full">
                          <Share2 className={`w-5 h-5 ${settings.appearance.darkMode ? "text-white" : "text-amber-700"}`} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className={`font-arabic ${settings.appearance.darkMode ? "text-gray-300" : "text-gray-700"} text-sm`}>
                        {item.virtue}
                      </p>
                      {item.reference && (
                        <p className={`font-arabic ${settings.appearance.darkMode ? "text-gray-400" : "text-gray-600"} text-xs mt-2`}>
                          ({item.reference})
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorite Other Azkar & Duas Section */}
          {favoriteAzkar.length > 0 && (
            <div>
              <h2 className={`text-xl font-arabic font-bold mb-4 ${settings.appearance.darkMode ? "text-white" : "text-slate-900"}`}>
                {settings.language === "ar" ? "الأذكار والأدعية الأخرى المفضلة" : "Favorite Other Azkar & Duas"}
              </h2>
              {favoriteAzkar.map((item) => (
                <div
                  key={item.uniqueId}
                  className={`mb-4 ${settings.appearance.darkMode ? "bg-slate-800/20" : "bg-white/50"} rounded-lg overflow-hidden border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} backdrop-blur-md`}
                >
                  <div className={`${settings.appearance.darkMode ? "bg-slate-800" : "bg-amber-100/50"} py-2 px-4 flex justify-between items-center`}>
                    <h3 className={`font-arabic text-lg ${settings.appearance.darkMode ? "text-white" : "text-slate-900"}`}>
                      {item.arabic}
                    </h3>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button onClick={() => handleRemoveFavorite(item.uniqueId)} className="p-1 rounded-full">
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                      <button onClick={() => handleShare(item, 'azkar')} className="p-1 rounded-full">
                        <Share2 className={`w-5 h-5 ${settings.appearance.darkMode ? "text-white" : "text-slate-900"}`} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    {item.benefit && (
                      <p className={`font-arabic ${settings.appearance.darkMode ? "text-gray-400" : "text-gray-600"} text-sm mt-3`}>
                        {item.benefit}
                      </p>
                    )}
                    {item.translation && settings.language === "en" && (
                      <p className={`text-sm mt-2 leading-relaxed ${settings.appearance.darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {item.translation}
                      </p>
                    )}
                    {item.reference && (
                      <p className={`text-xs mt-2 ${settings.appearance.darkMode ? "text-gray-500" : "text-gray-500"}`}>
                        ({item.reference})
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Favorites;
