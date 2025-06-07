
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { duha } from "../data/duaData";

const DuhaPrayer = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/80 p-4 flex items-center">
        <button onClick={() => navigate("/prayer-times")} className="p-2 mr-2">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h2 className="text-xl font-arabic font-bold text-white">صلاة الضحى</h2>
      </div>
      
      <div className="p-4 bg-slate-800/50">
        <p className="font-arabic text-gray-300 text-center text-lg mb-2">
          صلاة الضحى من أعظم النوافل وأجلها
        </p>
      </div>
      
      {/* Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-6 bg-slate-800/50 rounded-lg overflow-hidden">
          <div className="bg-slate-700 py-2 px-4">
            <h3 className="font-arabic text-lg text-white">وقت صلاة الضحى</h3>
          </div>
          
          <div className="p-4">
            <p className="font-arabic text-gray-300">{duha.time}</p>
          </div>
        </div>
        
        <div className="mb-6 bg-slate-800/50 rounded-lg overflow-hidden">
          <div className="bg-slate-700 py-2 px-4">
            <h3 className="font-arabic text-lg text-white">عدد ركعات صلاة الضحى</h3>
          </div>
          
          <div className="p-4">
            <p className="font-arabic text-gray-300">{duha.rakaat}</p>
          </div>
        </div>
        
        <div className="mb-6 bg-slate-800/50 rounded-lg overflow-hidden">
          <div className="bg-slate-700 py-2 px-4">
            <h3 className="font-arabic text-lg text-white">فضل صلاة الضحى</h3>
          </div>
          
          <div className="p-4">
            <p className="font-arabic text-gray-300">{duha.virtue}</p>
            
            <div className="mt-4 border-t border-slate-700 pt-4">
              <p className="font-arabic text-gray-300">قال النبي ﷺ: «يصبح على كل سلامى من أحدكم صدقة، فكل تسبيحة صدقة، وكل تحميدة صدقة، وكل تهليلة صدقة، وكل تكبيرة صدقة، وأمر بالمعروف صدقة، ونهي عن المنكر صدقة، ويجزئ من ذلك ركعتان يركعهما من الضحى»</p>
              <p className="font-arabic text-gray-400 text-sm mt-2">رواه مسلم</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6 bg-slate-800/50 rounded-lg overflow-hidden">
          <div className="bg-slate-700 py-2 px-4">
            <h3 className="font-arabic text-lg text-white">كيفية صلاة الضحى</h3>
          </div>
          
          <div className="p-4">
            <p className="font-arabic text-gray-300">أقلها ركعتان تسليمة واحدة، وإن صلى أربع أو ست أو ثمان أو أكثر يسلم من كل ثنتين فكله حسن، والنبي صلى اللّٰه عليه وسلم صلاها يوم الفتح صلى ثمان ركعات يسلم من كل ثنتين عليه الصلاة والسلام</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuhaPrayer;
