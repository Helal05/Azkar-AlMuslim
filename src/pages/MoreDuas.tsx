import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ArrowUp } from 'lucide-react';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { comprehensiveDuas, DuaCategory, Dua } from '../data/comprehensiveDuasData';

const MoreDuas = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const { categoryId } = useParams<{ categoryId: string }>();

  const duasToDisplay = useMemo(() => {
    if (categoryId) {
      const foundCategory = comprehensiveDuas.find(cat => cat.id === categoryId);
      return foundCategory ? [foundCategory] : [];
    }
    return comprehensiveDuas;
  }, [categoryId]);

  const pageTitle = useMemo(() => {
    if (categoryId && duasToDisplay.length > 0) {
      return duasToDisplay[0].title;
    }
    return "أدعية من المزيد";
  }, [categoryId, duasToDisplay]);

  const Header = () => (
    <div className={`p-4 flex items-center justify-between border-b ${settings.appearance.darkMode ? "bg-slate-800/80 border-slate-700" : "bg-amber-100/80 border-amber-200"}`}>
      <button onClick={() => navigate("/more")} className="p-2">
        <ChevronLeft className={`w-5 h-5 ${settings.appearance.darkMode ? "text-white" : "text-amber-800"}`} />
      </button>
      <h2 className={`text-xl font-arabic font-bold ${settings.appearance.darkMode ? "text-white" : "text-amber-800"}`}>
        {pageTitle}
      </h2>
      <div className="w-5"></div>
    </div>
  );

  const scrollToTop = () => {
    const contentArea = document.getElementById("more-duas-content-area");
    if (contentArea) {
      contentArea.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen ${settings.appearance.darkMode ? "bg-slate-900 text-white" : "bg-amber-50 text-black"} flex flex-col font-arabic`}>
      <Header />
      <div id="more-duas-content-area" className="flex-1 p-4 overflow-y-auto">
        {duasToDisplay.length === 0 && categoryId && (
          <div className="text-center py-10">
            <p className="text-lg">الفئة المطلوبة غير موجودة.</p>
            <button 
              onClick={() => navigate("/more")} 
              className={`mt-4 px-4 py-2 rounded-lg ${settings.appearance.darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-amber-200 hover:bg-amber-300"}`}
            >
              العودة إلى المزيد
            </button>
          </div>
        )}
        {duasToDisplay.map((category: DuaCategory) => (
          <div key={category.id} className="mb-8">
            {(duasToDisplay.length > 1 || !categoryId) && (
              <h2 
                className={`font-arabic text-2xl font-bold p-3 rounded-t-lg text-center ${settings.appearance.darkMode ? "bg-slate-700/60 text-white" : "bg-amber-200/60 text-amber-800"}`}
                style={{ fontFamily: "'Traditional Arabic', serif" }}
              >
                {category.title}
              </h2>
            )}
            <div className={`p-4 rounded-b-lg space-y-4 ${settings.appearance.darkMode ? "bg-slate-800/40" : "bg-white/40"} border ${settings.appearance.darkMode ? "border-slate-700" : "border-amber-200"} ${!((duasToDisplay.length > 1 || !categoryId)) ? 'rounded-t-lg' : ''}`}>
              {category.duas.map((dua: Dua, index: number) => (
                <div
                  key={dua.id || index}
                  className={`p-3 rounded-lg ${settings.appearance.darkMode ? "bg-slate-700/30" : "bg-amber-50/50"} border ${settings.appearance.darkMode ? "border-slate-600/50" : "border-amber-200/50"}`}
                >
                  <p
                    className="text-lg leading-relaxed text-right mb-2"
                    style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}
                  >
                    {dua.text}
                  </p>
                  {dua.reference && (
                    <p
                      className={`text-sm text-right ${settings.appearance.darkMode ? "text-slate-400" : "text-amber-600"}`}
                      style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}
                    >
                      {dua.reference}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Scroll to top button */}
      <div className={`flex justify-center py-3 border-t ${settings.appearance.darkMode ? "border-slate-700 bg-slate-800/90" : "border-amber-200/50 bg-white/90"} backdrop-blur-md`}>
        <button
          onClick={scrollToTop}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${settings.appearance.darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-amber-100 hover:bg-amber-200"}`}
        >
          <ArrowUp className="h-5 w-5" />
          <span className="font-arabic">العودة لبداية الأدعية</span>
        </button>
      </div>
    </div>
  );
};

export default MoreDuas;
