import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ChevronLeft } from 'lucide-react'; // Import ChevronLeft icon
import { useAppSettings } from '../contexts/AppSettingsContext'; // Assuming settings context is needed

const DuaEtiquettes: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigate
  const { settings } = useAppSettings();
  const pageTitle = settings.language === 'ar' ? 'آداب الدعاء' : 'Dua Etiquettes';

  return (
    <div className={`min-h-screen ${settings.appearance.darkMode ? 'bg-gradient-to-b from-slate-900 to-slate-950' : 'bg-gradient-to-b from-amber-50 to-amber-100'} flex flex-col`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 ${settings.appearance.darkMode ? "bg-slate-800/90" : "bg-white/90"} backdrop-blur-md border-b ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"}`}>
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate(-1)} // Add back button functionality
            className={`p-2 rounded-lg ${settings.appearance.darkMode ? "hover:bg-slate-700/50" : "hover:bg-amber-100/50"}`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="font-arabic text-xl font-semibold">{pageTitle}</h1>
          <div className="w-10"></div> {/* Placeholder for alignment */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto font-arabic text-right leading-relaxed">
        <div className={`p-4 rounded-lg ${settings.appearance.darkMode ? "bg-slate-800/50" : "bg-white/50"} backdrop-blur-md border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} mb-4`}>
          <h2 className={`text-xl font-semibold mb-2 ${settings.appearance.darkMode ? 'text-amber-400' : 'text-amber-700'}`}>الإخلاص</h2>
          <p className={`${settings.appearance.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            يُعتبر الإخلاص من الأمور المهمة، والمطلوبة في كافة العبادات الشرعية، وهو شرط لقبول الأعمال، فعند الدعاء يتوجب الإخلاص، والخشوع، والتضرع، والرهبة، والرغبة، قال تعالى: (فَادْعُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ) [غافر:14]، ويكون الإخلاص لله وحده، إذ يشتمل ذلك الخفية، والإخفاء، والإسرار بأن يكون القلب خائفاً طامعاً، ليس بغافل، ولا بآمن، ويُعدّ هذا من إحسان الدعاء، حيث إنّ الإحسان في كل عبادة بذل الجهد فيها، وأداءها بشكل تام.
          </p>
        </div>

        <div className={`p-4 rounded-lg ${settings.appearance.darkMode ? "bg-slate-800/50" : "bg-white/50"} backdrop-blur-md border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} mb-4`}>
          <h2 className={`text-xl font-semibold mb-2 ${settings.appearance.darkMode ? 'text-amber-400' : 'text-amber-700'}`}>تحري وقت الاستجابة</h2>
          <p className={`${settings.appearance.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            يتمثل ذلك في اختيار الأوقات الشريفة، والتي يكثر الاستجابة بها، وهي: يوم عرفة، ورمضان، ويوم الجمعة، ووقت السحر، ولحظة السجود، عَنْ أَبِي هُرَيْرَةَ رضي الله عنه أَنَّ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: (أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ، فَأَكْثِرُوا الدُّعَاءَ) [صحيح مسلم].
          </p>
        </div>

        <div className={`p-4 rounded-lg ${settings.appearance.darkMode ? "bg-slate-800/50" : "bg-white/50"} backdrop-blur-md border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} mb-4`}>
          <h2 className={`text-xl font-semibold mb-2 ${settings.appearance.darkMode ? 'text-amber-400' : 'text-amber-700'}`}>خفض الصوت</h2>
          <p className={`${settings.appearance.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            يجب على الداعي خفض صوته عند الدعاء بين المخافتة والجهر، وعدم الاعتداء بالدعاء، قال تعالى: (ادْعُوا رَبَّكُمْ تَضَرُّعًا وَخُفْيَةً إِنَّهُ لَا يُحِبُّ الْمُعْتَدِينَ) [الأعراف:55].
          </p>
        </div>

        <div className={`p-4 rounded-lg ${settings.appearance.darkMode ? "bg-slate-800/50" : "bg-white/50"} backdrop-blur-md border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} mb-4`}>
          <h2 className={`text-xl font-semibold mb-2 ${settings.appearance.darkMode ? 'text-amber-400' : 'text-amber-700'}`}>عدم استعجال الإجابة</h2>
          <p className={`${settings.appearance.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            العبد لا يعلم أين الخير والشر فيما يدعو بينما الله عالم قال رسول الله صلى الله عليه وسلم: (ما على الأرض مسلم يدعو الله تعالى بدعوةٍ إلا آتاهُ اللهُ إيَّاها أو صرف عنهُ من السُّوءِ مثلَها ما لم يدعُ بإثمٍ أو قطيعةِ رحمٍ فقال رجلٌ من القومِ إذًا نُكثِرُ قال اللهُ أكثرُ) [صحيح الترمذي].
          </p>
        </div>

        <div className={`p-4 rounded-lg ${settings.appearance.darkMode ? "bg-slate-800/50" : "bg-white/50"} backdrop-blur-md border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} mb-4`}>
          <h2 className={`text-xl font-semibold mb-2 ${settings.appearance.darkMode ? 'text-amber-400' : 'text-amber-700'}`}>استقبال القبلة</h2>
          <p className={`${settings.appearance.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            يجب على الداعي استقبال القبلة، ورفع يديه عند الدعاء.
          </p>
        </div>

        <div className={`p-4 rounded-lg ${settings.appearance.darkMode ? "bg-slate-800/50" : "bg-white/50"} backdrop-blur-md border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} mb-4`}>
          <h2 className={`text-xl font-semibold mb-2 ${settings.appearance.darkMode ? 'text-amber-400' : 'text-amber-700'}`}>عدم التكلف</h2>
          <p className={`${settings.appearance.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            والمقصود بعدم التكلف هنا السجع عند الدعاء، فحال الداعي يجب أن يكون كحال المتضرع، والتكلف لا يلائمه.
          </p>
        </div>

        <div className={`p-4 rounded-lg ${settings.appearance.darkMode ? "bg-slate-800/50" : "bg-white/50"} backdrop-blur-md border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} mb-4`}>
          <h2 className={`text-xl font-semibold mb-2 ${settings.appearance.darkMode ? 'text-amber-400' : 'text-amber-700'}`}>الجزم</h2>
          <p className={`${settings.appearance.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            أي الثقة بالله تعالى، والقطع، واليقين بحتمية استجابة الدعاء.
          </p>
        </div>

        <div className={`p-4 rounded-lg ${settings.appearance.darkMode ? "bg-slate-800/50" : "bg-white/50"} backdrop-blur-md border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} mb-4`}>
          <h2 className={`text-xl font-semibold mb-2 ${settings.appearance.darkMode ? 'text-amber-400' : 'text-amber-700'}`}>الإلحاح</h2>
          <p className={`${settings.appearance.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            يجب الإلحاح في الدعاء، وتكراره ثلاث مرات.
          </p>
        </div>

        <div className={`p-4 rounded-lg ${settings.appearance.darkMode ? "bg-slate-800/50" : "bg-white/50"} backdrop-blur-md border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} mb-4`}>
          <h2 className={`text-xl font-semibold mb-2 ${settings.appearance.darkMode ? 'text-amber-400' : 'text-amber-700'}`}>التوبة</h2>
          <p className={`${settings.appearance.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            يجب الدعاء بعد التوبة من كافة الذنوب التي ارتكبها الداعي، ورد المظالم إلى أهلها، ثم الإقبال على الله تعالى بقلب سليم.
          </p>
        </div>

        <div className={`p-4 rounded-lg ${settings.appearance.darkMode ? "bg-slate-800/50" : "bg-white/50"} backdrop-blur-md border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} mb-4`}>
          <h2 className={`text-xl font-semibold mb-2 ${settings.appearance.darkMode ? 'text-amber-400' : 'text-amber-700'}`}>الحمد</h2>
          <p className={`${settings.appearance.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            البدء بحمد الله تعالى، والثناء، والصلاة على الرسول صلى الله عليه وسلم، والختم بذلك أيضاً.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DuaEtiquettes;
