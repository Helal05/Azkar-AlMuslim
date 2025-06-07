
import { useState, useEffect } from "react"; // Keep useEffect for islamicDate if needed later
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Clock, AlertCircle, Info } from "lucide-react";
import { getCurrentIslamicDate, getForbiddenPrayerTimes } from "../data/prayerData"; // Removed getPrayerTimes
// Removed Header import as it's not used
import { useAppSettings } from "../contexts/AppSettingsContext";
// Import both useTranslation hook and the translations object
import { useTranslation, translations } from "../utils/translations"; 

const ForbiddenPrayerTimes = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const { t } = useTranslation(settings.language);

  // Assuming getCurrentIslamicDate doesn't need location, otherwise add useEffect
  const [islamicDate, setIslamicDate] = useState(getCurrentIslamicDate()); 
  // Removed prayerTimes state and useEffect
  
  // Assuming getForbiddenPrayerTimes returns an array of objects like:
  // { key: string, description: string, descriptionEn: string, timeRange: string, timeRangeEn: string }
  // Or perhaps just keys: { key: string } and the descriptions/ranges are in translation files.
  // We'll assume the keys are like 'forbiddenTime1', 'forbiddenTime2', etc.
  const [forbiddenTimes, setForbiddenTimes] = useState(getForbiddenPrayerTimes());

  // Re-introduce getForbiddenTimesContent as specific keys are not available in translations.ts
  const getForbiddenTimesContent = () => {
    if (settings.language === "ar") {
      return {
        // Using 'nafilahProhibitedTimes' key for title if preferred, or hardcoded string
        title: translations.ar.nafilahProhibitedTimes || "أوقات لا تجوز فيها صلاة النافلة", 
        description: "هناك خمسة أوقات نهى النبي ﷺ عن الصلاة فيها، ولا تُصَلَّى فيها إلا الفرائض والصلوات ذات السبب",
        // Using 'importantNotes' key for notes title
        notesTitle: translations.ar.importantNotes || "ملاحظات هامة", 
        notesList: [
          "الصلوات ذات السبب: هي الصلوات التي لها سبب يوجبها مثل صلاة الكسوف وتحية المسجد وسجود التلاوة.",
          "يجوز قضاء الفرائض الفائتة في هذه الأوقات.",
          "لا يجوز تأخير الفريضة حتى يدخل وقت النهي."
        ],
        hadithTitle: ": الدليل على الأوقات المنهي عن الصلاة فيها",
        hadithText: "وروى البخاري (551) عن أبي سَعِيدٍ الْخُذْرِيَّ رَضِيَ اللَّهُ عَنْهُ يَقُولُ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: (لا صَلاةَ بَعْدَ الصَّبْحِ حَتَّى تَرْتَفِعَ الشَّمْسُ وَلَا صَلاةَ بَعْدَ الْعَصْرِ حَتَّى تَغِيبَ الشَّمْسُ). وروى مسلم (1373) عن عُقْبَةَ بْنَ عَامِرِ الْجُهَنِيَّ رَضِيَ اللَّهُ عَنْهُ يَقُولُ: (ثَلاثُ سَاعَاتٍ كَانَ رَسُولُ اللّهِ صَلّى اللّهُ عَلَيْهِ وَسَلَّمَ يَنْهَانَا أَنْ نُصَلَّيَ فِيهِنَّ أَوْ أَنْ نَقْبُرَ فِيهِنَّ مَوْتَانَا: جِينَ تَظِلّعُ الشَّمْسْ بَازغَةً حَتَّى تَرْتَفِعَ وَجِينَ يَقُومُ قَائِمُ الظَّهِيرَةِ حَتَّى تَمِيلَ الشَّمْسُ وَجِينَ تَضَيَّفُ الشَّمْسُ لِلْغُرُوبِ حَتَّى تَغْرُبَ)..ويدل على أوقات النهي عن الصلاة ما عون أن علاب في الله علهما قال) (شَهِدَ عِنْدِي رِجَالُ مَرْضِيُّونَ وَأَرْضَاهُمْ عِنْدِي عُمَرُ أَنَّ النَّبِيَّ صَلِّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَهِي عَنْ الصَّلاةِ بَعْدَ الصُّبْحِ حَتَّى تَشْرُقَ الشَّمْسُ وَبَعْدَ الْعَصْرِ حَتَّى تَغْرُبَ). وروى البخاري (548) ومسلم (1371) عَن ابْنُ عُمَرَ رَضِيَ اللَّهُ عَنْهُما قَالَ: قَالَ رَسُولُ اللَهِ صَلِّي اللَّهُ عَلَيْهِ وَسَلَّمَ: (إِذَا طَلَعَ حَاجِبُ الشَّمْسِ فَأَخّرُوا الصَّلاَّةَ حَتَّى تَرْتَفَعَ وَإِذَا غَابٌ حَاجِبُ الشَّمْسِ فَأَخِّرُوا الصَّلاةَ حَتَّى تَغِيبَ)",
      };
    } else {
      return {
        // Using 'nafilahProhibitedTimes' key for title if preferred, or hardcoded string
        title: translations.en.nafilahProhibitedTimes || "Times When Voluntary Prayers Are Prohibited",
        description: "There are three times when the Prophet ﷺ prohibited prayer, and no voluntary prayers should be performed during these times except obligatory prayers and prayers with specific reasons.",
         // Using 'importantNotes' key for notes title
        notesTitle: translations.en.importantNotes || "Important Notes",
        notesList: [
          "Prayers with specific reasons include: eclipse prayer, greeting the mosque (Tahiyyatul Masjid), and prostration of recitation.",
          "It is permissible to make up missed obligatory prayers during these times.",
          "It is not permissible to delay obligatory prayers until these forbidden times."
        ],
        hadithTitle: "From the Prophetic Sunnah",
        hadithText: "\"The Prophet ﷺ prohibited us from praying or burying our dead during three times: when the sun is rising until it has fully risen, when the sun is at its zenith until it passes the meridian, and when the sun begins to set until it has completely set.\"",
        hadithSource: "Narrated by Muslim"
      };
    }
  };
  
  const content = getForbiddenTimesContent();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col">
      {/* Header */}
      {/* Header */}
      <div className="relative py-4 border-b border-white/10">
        <button 
          onClick={() => navigate(-1)} // Go back to previous page
          className="absolute left-4 top-1/2 transform -translate-y-1/2 rtl:left-auto rtl:right-4"
        >
          <ChevronLeft className="h-6 w-6 text-white/80" />
        </button>
        {/* Use the valid 'forbiddenPrayerTimes' key */}
        <h1 className="text-xl font-bold text-center font-arabic text-amber-400">{t('forbiddenPrayerTimes')}</h1> 
      </div>
      
      {/* Islamic Date Display */}
      <div className="bg-slate-800/50 border-b border-white/10 p-3">
        <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse">
          <div className="text-center">
            <p className="text-white font-arabic">
              {islamicDate.day} {islamicDate.month} {islamicDate.year}هـ
            </p>
            <p className="text-white/50 text-xs">{islamicDate.gregorianDate}</p>
          </div>
        </div>
      </div>
      
      {/* Forbidden Prayer Times */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500 mx-2" />
            {/* Use content object from getForbiddenTimesContent */}
            <h3 className="text-lg font-arabic font-bold text-red-400">{content.title}</h3>
          </div>
          
          <p className="text-center text-sm text-white/70 mb-8 font-arabic leading-relaxed">
            {/* Use content object from getForbiddenTimesContent */}
            {content.description} 
          </p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {forbiddenTimes.map((time, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.1 }}
                className="bg-gradient-to-r from-slate-800/90 to-slate-800/50 backdrop-blur-sm border border-red-800/30 rounded-lg p-4"
              >
                <div className="flex items-start">
                  {/* Adjusted icon margin for RTL/LTR */}
                  <Clock className="w-5 h-5 text-red-400 mt-1 mx-3 flex-shrink-0" /> 
                  <div>
                    {/* Reverted to using properties based on language, assuming they exist */}
                    {/* No t() needed here if properties contain final strings */}
                    <h4 className="font-arabic text-lg text-red-400">
                      {settings.language === 'ar' ? time.description : (time.descriptionEn || time.description)}
                    </h4>
                    <p className="text-sm text-white/70 font-arabic mt-1">
                      {settings.language === 'ar' ? time.timeRange : (time.timeRangeEn || time.timeRange)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Additional Information */}
        <div className="mt-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-4"
          >
            <h3 className="flex items-center font-arabic font-bold text-amber-400 mb-3">
              {/* Adjusted icon margin */}
              <Info className="w-4 h-4 mx-1.5" /> 
              {/* Use content object from getForbiddenTimesContent */}
              {content.notesTitle}
            </h3>
            {/* Use content object from getForbiddenTimesContent */}
            <ul className="text-sm text-white/70 font-arabic space-y-2 list-disc list-inside px-5">
              {content.notesList.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </motion.div>
          
          {/* Hadith Source */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            // Adjusted border for RTL/LTR
            className="bg-gradient-to-r from-slate-800/40 to-slate-800/20 backdrop-blur-sm rounded-lg p-4 border-r-4 rtl:border-r-0 rtl:border-l-4 border-green-700" 
          >
            {/* Use content object from getForbiddenTimesContent */}
            <h3 className="text-center font-arabic font-bold text-green-400 mb-3">{content.hadithTitle}</h3>
            {/* Adjusted text alignment */}
            <div className="text-sm text-white/80 font-arabic text-right rtl:text-right"> 
              {/* Use content object from getForbiddenTimesContent */}
              <p className="mb-2 leading-relaxed">{content.hadithText}</p>
              <p className="text-xs text-white/50 mt-1">{content.hadithSource}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPrayerTimes;
