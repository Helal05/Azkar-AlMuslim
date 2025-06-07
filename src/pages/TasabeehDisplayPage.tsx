import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { tasabeehItems, TasbeehItem } from '../data/tasabeehData'; // Corrected import path
import { motion } from 'framer-motion';

const TasabeehDisplayPage = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();

  const Header = () => (
    <div className={`sticky top-0 z-50 ${settings.appearance.darkMode ? "bg-slate-800/90" : "bg-white/90"} backdrop-blur-md border-b ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"}`}>
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={() => navigate(-1)} // Go back to the previous page (likely Index.tsx)
          className={`p-2 rounded-lg ${settings.appearance.darkMode ? "hover:bg-slate-700/50" : "hover:bg-amber-100/50"}`}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="font-arabic text-xl font-semibold">تسابيح وأذكار</h1>
        <div className="w-10"></div> {/* Placeholder for alignment */}
      </div>
    </div>
  );

  // Card component for consistent styling
  const Card = ({ children, className = "", itemClassName = "" }: { children: React.ReactNode, className?: string, itemClassName?: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className={`rounded-lg shadow-md overflow-hidden ${settings.appearance.darkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"} ${className} ${itemClassName}`}
    >
      {children}
    </motion.div>
  );


  return (
    <div className={`min-h-screen ${settings.appearance.darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-slate-800"} flex flex-col font-arabic`}>
      <Header />
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {tasabeehItems.map((item: TasbeehItem, index: number) => (
          <Card key={item.uniqueId} itemClassName={item.backgroundColor.replace('bg-', 'border-l-4 border-')}>
            <div className={`p-5 ${settings.appearance.darkMode ? item.backgroundColor.replace('bg-','bg-opacity-20 ') : item.backgroundColor }`}>
              <h2 className={`text-2xl font-bold text-right mb-2 ${settings.appearance.darkMode ? 'text-white' : 'text-slate-700'}`} style={{ fontFamily: "'Traditional Arabic', serif" }}>
                {item.text}
              </h2>
              <p className={`text-md text-right mb-1 ${settings.appearance.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-semibold">الفضيلة:</span> {item.virtue}
              </p>
              <p className={`text-md text-right mb-3 ${settings.appearance.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-semibold">العدد:</span> {item.count} مرات
              </p>
              {item.hadith && (
                 <p className={`text-sm text-right italic ${settings.appearance.darkMode ? 'text-gray-400' : 'text-gray-500'} border-t ${settings.appearance.darkMode ? 'border-gray-700' : 'border-gray-300'} pt-2 mt-2`}>
                   {item.hadith}
                 </p>
              )}
              {item.reference && (
                <p className={`text-xs text-left mt-2 ${settings.appearance.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  المرجع: {item.reference}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TasabeehDisplayPage;
