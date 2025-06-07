import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ArrowUp } from 'lucide-react';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { newComprehensiveDuas, DuaCategory, Dua } from '../data/newComprehensiveDuasData';

const ComprehensiveDuas = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const { categoryId } = useParams<{ categoryId: string }>();

  const duasToDisplay = useMemo(() => {
    if (categoryId) {
      const foundCategory = newComprehensiveDuas.find(cat => cat.id === categoryId);
      return foundCategory ? [foundCategory] : [];
    }
    return newComprehensiveDuas;
  }, [categoryId]);

  const pageTitle = useMemo(() => {
    if (categoryId && duasToDisplay.length > 0) {
      return duasToDisplay[0].title;
    }
    return "أدعية شاملة";
  }, [categoryId, duasToDisplay]);

  const Header = () => (
    <div className={`sticky top-0 z-50 ${settings.appearance.darkMode ? "bg-slate-800/90" : "bg-white/90"} backdrop-blur-md border-b ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"}`}>
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={() => categoryId ? navigate('/more') : navigate(-1)}
          className={`p-2 rounded-lg ${settings.appearance.darkMode ? "hover:bg-slate-700/50" : "hover:bg-amber-100/50"}`}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="font-arabic text-xl font-semibold">{pageTitle}</h1>
        <div className="w-10"></div> {/* Placeholder for alignment */}
      </div>
    </div>
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${settings.appearance.darkMode ? "bg-slate-900 text-white" : "bg-amber-50 text-black"} flex flex-col font-arabic`}>
      <Header />
      <div id="comprehensive-duas-content-area" className="flex-1 p-4 overflow-y-auto">
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
            <div className={`p-4 rounded-b-lg space-y-3 ${settings.appearance.darkMode ? "bg-slate-800/40" : "bg-white/40"} border ${settings.appearance.darkMode ? "border-slate-700" : "border-amber-200"} ${!((duasToDisplay.length > 1 || !categoryId)) ? 'rounded-t-lg' : ''}`}>
              {category.duas.map((dua: Dua, index: number) => (
                <p
                  key={index}
                  className="text-lg leading-relaxed text-right"
                  style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}
                >
                  {dua.text}
                </p>
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

export default ComprehensiveDuas;
