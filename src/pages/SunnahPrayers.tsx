
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { rawathib } from "../data/duaData";

const SunnahPrayers = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/80 p-4 flex items-center">
        <button onClick={() => navigate("/prayer-times")} className="p-2 mr-2">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h2 className="text-xl font-arabic font-bold text-white">السنن الرواتب</h2>
      </div>
      
      <div className="p-4 bg-slate-800/50">
        <p className="font-arabic text-gray-300 text-center mb-4">
          السنن الرواتب هي الصلوات التطوعية المؤكدة التي كان يصليها النبي ﷺ قبل الصلاة المفروضة أو بعدها
        </p>
      </div>
      
      {/* Rawatib List */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {rawathib.map((prayer, index) => (
          <div 
            key={index}
            className="mb-4 bg-slate-800/50 rounded-lg overflow-hidden"
          >
            <div className="bg-slate-700 py-2 px-4">
              <h3 className="font-arabic text-lg text-white">{prayer.prayer}</h3>
            </div>
            
            <div className="p-4 flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="font-arabic text-gray-300">قبل الفريضة:</span>
                <span className="font-arabic text-white">{prayer.before} ركعات</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-arabic text-gray-300">بعد الفريضة:</span>
                <span className="font-arabic text-white">{prayer.after} ركعات</span>
              </div>
              
              <div className="mt-2 pt-2 border-t border-slate-700">
                <p className="font-arabic text-gray-400 text-sm">{prayer.description}</p>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
          <h3 className="font-arabic text-lg text-white mb-2">فضل السنن الرواتب</h3>
          <p className="font-arabic text-gray-300">
            .عن أُمّ المؤمِنِينَ أُمّ حبِيبَةَ رَمْلةَ بِنتِ أَبي سُفِيانَ رضيَ اللَّهِ عَنهمَ قَالَتِ: قَالَ رَسُولُ اللَّهِ : مَنْ صَلِّى فِي يَوْمِ وَلَيْلَةٍ ثُنْتَيْ عَشْرَةَ رَكْعَةَ بُنِيَ لَهُ بَيْتٌ فِي الْجَنَّةِ أَرْبَعَا قَبْلَ الظَّهْرِ وَرَكَعَتَيْنِ بَعْدَهَا وَرَكْعَتَيْن بَعْدَ الْمَعْرِبِ وَرَكْعَتَيْن بَعْدَ الْعِشَاءِ وَرَكْعَتَيْن قَبْلَ صَلَاةٍ الْفَجْرِ. رواه الترمذي
          </p>
          <p className="font-arabic text-gray-300">
            .وعن ابن عُمَر رَضيَ اللَّه عنْهُما، قالَ: صَلَّيْتُ مَعَ رسُول اللّهِ * رَكْعَتَيْن قَبْلَ الظَّهْرِ، وَرَكْعَتَيْن بَعْدَهَا، وَرَكْعَتِيْنِ بَعْدَ الجُمُعَةِ، ورَكْعتيْنِ بَعْد المغرِبِ، وركْعتيْن بعد العِشَاءِ متفقُّ عَليهِ
          </p>
        </div>
      </div>
    </div>
  );
};

export default SunnahPrayers;
