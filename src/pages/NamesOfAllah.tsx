import { useState } from "react";
import { Heart, Share, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useToast } from "../hooks/use-toast"; // Corrected import path

interface Name {
  id: string;
  name: string;
  meaning: string;
  meaningEn: string;
}

export const allahNames: Name[] = [
    { id: "name-1", name: "ٱلله", meaning: "الاسم الأعظم الذي تفرد به الحق سبحانه وتعالى وخص به نفسه", meaningEn: "The Greatest Name" },
    { id: "name-2", name: "ٱلْرَّحْمَـٰنُ", meaning: "واسع الرحمة، وهي صفة شاملة لجميع أنواع الرحمة", meaningEn: "The Beneficent" },
    { id: "name-3", name: "ٱلْرَّحِيْمُ", meaning: "المعطي لرحمته لمن يشاء من عباده", meaningEn: "The Merciful" },
    { id: "name-4", name: "ٱلْمَلِكُ", meaning: "المتصرف في ملكه كيف يشاء", meaningEn: "The King" },
    { id: "name-5", name: "ٱلْقُدُّوسُ", meaning: "المنزه عن كل نقص", meaningEn: "The Holy" },
    { id: "name-6", name: "ٱلْسَّلَامُ", meaning: "الذي سلم من كل عيب وبرئ من كل آفة", meaningEn: "The Source of Peace" },
    { id: "name-7", name: "ٱلْمُؤْمِنُ", meaning: "الذي يصدق عباده المؤمنين ويؤمنهم من عذابه", meaningEn: "The Guardian of Faith" },
    { id: "name-8", name: "ٱلْمُهَيْمِنُ", meaning: "الرقيب الحافظ لكل شيء", meaningEn: "The Protector" },
    { id: "name-9", name: "ٱلْعَزِيزُ", meaning: "الغالب الذي لا يغلب", meaningEn: "The Mighty" },
    { id: "name-10", name: "ٱلْجَبَّارُ", meaning: "الذي يجبر كسر عباده ويقهر الجبابرة", meaningEn: "The Compeller" },
    { id: "name-11", name: "ٱلْمُتَكَبِّرُ", meaning: "المتعالي عن صفات الخلق", meaningEn: "The Majestic" },
    { id: "name-12", name: "ٱلْخَالِقُ", meaning: "الذي أوجد الأشياء من العدم", meaningEn: "The Creator" },
    { id: "name-13", name: "ٱلْبَارِئُ", meaning: "الذي خلق الخلق لا عن مثال سابق", meaningEn: "The Maker" },
    { id: "name-14", name: "ٱلْمُصَوِّرُ", meaning: "الذي صور المخلوقات كيف شاء", meaningEn: "The Fashioner" },
    { id: "name-15", name: "ٱلْغَفَّارُ", meaning: "الذي يغفر الذنوب مرة بعد مرة", meaningEn: "The Great Forgiver" },
    { id: "name-16", name: "ٱلْقَهَّارُ", meaning: "الذي قهر كل شيء وغلبه", meaningEn: "The Subduer" },
    { id: "name-17", name: "ٱلْوَهَّابُ", meaning: "الكثير العطاء بلا عوض", meaningEn: "The Bestower" },
    { id: "name-18", name: "ٱلْرَّزَّاقُ", meaning: "الذي خلق الأرزاق وأعطى الخلائق أرزاقها", meaningEn: "The Provider" },
    { id: "name-19", name: "ٱلْفَتَّاحُ", meaning: "الذي يفتح أبواب الرحمة والرزق لعباده", meaningEn: "The Opener" },
    { id: "name-20", name: "ٱلْعَلِيمُ", meaning: "الذي يعلم كل شيء، ظاهرًا وباطنًا", meaningEn: "The All-Knowing" },
    { id: "name-21", name: "ٱلْقَابِضُ", meaning: "الذي يقبض الأرواح والأرزاق", meaningEn: "The Restrainer" },
    { id: "name-22", name: "ٱلْبَاسِطُ", meaning: "الذي يبسط الرزق لمن يشاء", meaningEn: "The Expander" },
    { id: "name-23", name: "ٱلْخَافِضُ", meaning: "الذي يخفض المتكبرين والجبابرة", meaningEn: "The Abaser" },
    { id: "name-24", name: "ٱلْرَّافِعُ", meaning: "الذي يرفع المؤمنين بالعلم والإيمان", meaningEn: "The Exalter" },
    { id: "name-25", name: "ٱلْمُعِزُّ", meaning: "الذي يعز من يشاء بطاعته", meaningEn: "The Honorer" },
    { id: "name-26", name: "ٱلْمُذِلُّ", meaning: "الذي يذل من يشاء بمعصيته", meaningEn: "The Dishonorer" },
    { id: "name-27", name: "ٱلْسَّمِيعُ", meaning: "الذي يسمع كل الأصوات", meaningEn: "The All-Hearing" },
    { id: "name-28", name: "ٱلْبَصِيرُ", meaning: "الذي يرى كل الأشياء", meaningEn: "The All-Seeing" },
    { id: "name-29", name: "ٱلْحَكَمُ", meaning: "الذي يفصل بين الحق والباطل", meaningEn: "The Judge" },
    { id: "name-30", name: "ٱلْعَدْلُ", meaning: "المنزه عن الظلم والجور", meaningEn: "The Just" },
    { id: "name-31", name: "ٱلْلَّطِيفُ", meaning: "البر بعباده، المحسن إليهم", meaningEn: "The Subtle One" },
    { id: "name-32", name: "ٱلْخَبِيرُ", meaning: "العالم ببواطن الأمور", meaningEn: "The Aware" },
    { id: "name-33", name: "ٱلْحَلِيمُ", meaning: "الذي لا يعاجل بالعقوبة", meaningEn: "The Forbearing" },
    { id: "name-34", name: "ٱلْعَظِيمُ", meaning: "الذي له العظمة في كل شيء", meaningEn: "The Great One" },
    { id: "name-35", name: "ٱلْغَفُورُ", meaning: "الكثير المغفرة", meaningEn: "The All-Forgiving" },
    { id: "name-36", name: "ٱلْشَّكُورُ", meaning: "الذي يجزي على العمل القليل بالكثير", meaningEn: "The Appreciative" },
    { id: "name-37", name: "ٱلْعَلِيُّ", meaning: "الرفيع القدر فوق خلقه", meaningEn: "The Most High" },
    { id: "name-38", name: "ٱلْكَبِيرُ", meaning: "الأكبر من كل شيء", meaningEn: "The Most Great" },
    { id: "name-39", name: "ٱلْحَفِيظُ", meaning: "الذي يحفظ عباده وأعمالهم", meaningEn: "The Preserver" },
    { id: "name-40", name: "ٱلْمُقِيتُ", meaning: "خالق الأقوات وموصلها", meaningEn: "The Sustainer" },
    { id: "name-41", name: "ٱلْحَسِيبُ", meaning: "الكافي الذي يكفي عباده", meaningEn: "The Reckoner" },
    { id: "name-42", name: "ٱلْجَلِيلُ", meaning: "العظيم القدر", meaningEn: "The Majestic" },
    { id: "name-43", name: "ٱلْكَرِيمُ", meaning: "الكثير الخير، الجواد المعطي", meaningEn: "The Generous" },
    { id: "name-44", name: "ٱلْرَّقِيبُ", meaning: "الحافظ الذي لا يغيب عنه شيء", meaningEn: "The Watchful" },
    { id: "name-45", name: "ٱلْمُجِيبُ", meaning: "الذي يجيب دعاء الداعين", meaningEn: "The Responsive" },
    { id: "name-46", name: "ٱلْوَاسِعُ", meaning: "الذي وسع رزقه ورحمته كل شيء", meaningEn: "The All-Encompassing" },
    { id: "name-47", name: "ٱلْحَكِيمُ", meaning: "المحكم في تدبيره وصنعه", meaningEn: "The Wise" },
    { id: "name-48", name: "ٱلْوَدُودُ", meaning: "المحب لعباده المؤمنين والمحبوب لهم", meaningEn: "The Loving" },
    { id: "name-49", name: "ٱلْمَجِيدُ", meaning: "العظيم الشأن، الكثير الإحسان", meaningEn: "The Glorious" },
    { id: "name-50", name: "ٱلْبَاعِثُ", meaning: "الذي يبعث الخلق يوم القيامة", meaningEn: "The Resurrector" },
    { id: "name-51", name: "ٱلْشَّهِيدُ", meaning: "الحاضر الذي لا يغيب عنه شيء", meaningEn: "The Witness" },
    { id: "name-52", name: "ٱلْحَقُّ", meaning: "الموجود حقاً", meaningEn: "The Truth" },
    { id: "name-53", name: "ٱلْوَكِيلُ", meaning: "الكافي لمن توكل عليه", meaningEn: "The Trustee" },
    { id: "name-54", name: "ٱلْقَوِيُّ", meaning: "كامل القوة", meaningEn: "The Strong" },
    { id: "name-55", name: "ٱلْمَتِينُ", meaning: "شديد القوة", meaningEn: "The Firm" },
    { id: "name-56", name: "ٱلْوَلِيُّ", meaning: "الناصر والمعين للمؤمنين", meaningEn: "The Protecting Friend" },
    { id: "name-57", name: "ٱلْحَمِيدُ", meaning: "المحمود في كل حال", meaningEn: "The Praiseworthy" },
    { id: "name-58", name: "ٱلْمُحْصِي", meaning: "الذي أحصى كل شيء بعلمه", meaningEn: "The Accounter" },
    { id: "name-59", name: "ٱلْمُبْدِئُ", meaning: "الذي بدأ الخلق", meaningEn: "The Originator" },
    { id: "name-60", name: "ٱلْمُعِيدُ", meaning: "الذي يعيد الخلق بعد الموت", meaningEn: "The Restorer" },
    { id: "name-61", name: "ٱلْمُحْيِي", meaning: "الذي يحيي الموتى", meaningEn: "The Giver of Life" },
    { id: "name-62", name: "ٱلْمُمِيتُ", meaning: "الذي يميت الأحياء", meaningEn: "The Taker of Life" },
    { id: "name-63", name: "ٱلْحَيُّ", meaning: "الدائم الحياة بلا زوال", meaningEn: "The Ever-Living" },
    { id: "name-64", name: "ٱلْقَيُّومُ", meaning: "القائم بنفسه والمقيم لغيره", meaningEn: "The Self-Subsisting" },
    { id: "name-65", name: "ٱلْوَاجِدُ", meaning: "الغني الذي لا يفتقر", meaningEn: "The Perceiver" },
    { id: "name-66", name: "ٱلْمَاجِدُ", meaning: "العظيم الشأن", meaningEn: "The Illustrious" },
    { id: "name-67", name: "ٱلْوَاحِدُ", meaning: "الفرد المتفرد في ذاته وصفاته", meaningEn: "The One" },
    { id: "name-68", name: "ٱلْأَحَدُ", meaning: "المنفرد الذي لا نظير له", meaningEn: "The Unique" },
    { id: "name-69", name: "ٱلْصَّمَدُ", meaning: "المقصود في الحوائج", meaningEn: "The Eternal" },
    { id: "name-70", name: "ٱلْقَادِرُ", meaning: "صاحب القدرة التامة", meaningEn: "The Able" },
    { id: "name-71", name: "ٱلْمُقْتَدِرُ", meaning: "كامل القدرة لا يمتنع عليه شيء", meaningEn: "The Powerful" },
    { id: "name-72", name: "ٱلْمُقَدِّمُ", meaning: "الذي يقدم من يشاء", meaningEn: "The Expediter" },
    { id: "name-73", name: "ٱلْمُؤَخِّرُ", meaning: "الذي يؤخر من يشاء", meaningEn: "The Delayer" },
    { id: "name-74", name: "ٱلْأَوَّلُ", meaning: "الذي ليس قبله شيء", meaningEn: "The First" },
    { id: "name-75", name: "ٱلْآخِرُ", meaning: "الذي ليس بعده شيء", meaningEn: "The Last" },
    { id: "name-76", name: "ٱلْظَّاهِرُ", meaning: "الظاهر وجوده بالأدلة القاطعة", meaningEn: "The Manifest" },
    { id: "name-77", name: "ٱلْبَاطِنُ", meaning: "المحتجب عن الأبصار", meaningEn: "The Hidden" },
    { id: "name-78", name: "ٱلْوَالِي", meaning: "المالك لكل شيء والمتصرف فيه", meaningEn: "The Governor" },
    { id: "name-79", name: "ٱلْمُتَعَالِي", meaning: "المنزه عن صفات المخلوقين", meaningEn: "The Most Exalted" },
    { id: "name-80", name: "ٱلْبَرُّ", meaning: "الكثير الإحسان والخير", meaningEn: "The Source of All Goodness" },
    { id: "name-81", name: "ٱلْتَّوَّابُ", meaning: "الذي يقبل التوبة عن عباده", meaningEn: "The Acceptor of Repentance" },
    { id: "name-82", name: "ٱلْمُنْتَقِمُ", meaning: "الذي ينتقم من العصاة والمجرمين", meaningEn: "The Avenger" },
    { id: "name-83", name: "ٱلْعَفُوُّ", meaning: "الذي يمحو السيئات ويتجاوز عنها", meaningEn: "The Pardoner" },
    { id: "name-84", name: "ٱلْرَّؤُوفُ", meaning: "شديد الرحمة والرأفة", meaningEn: "The Kind" },
    { id: "name-85", name: "مَالِكُ ٱلْمُلْكِ", meaning: "المتصرف في ملكه كيف يشاء", meaningEn: "The Owner of Sovereignty" },
    { id: "name-86", name: "ذُو ٱلْجَلَالِ وَٱلْإِكْرَامِ", meaning: "صاحب العظمة والإكرام", meaningEn: "The Lord of Majesty and Bounty" },
    { id: "name-87", name: "ٱلْمُقْسِطُ", meaning: "العادل في حكمه", meaningEn: "The Equitable" },
    { id: "name-88", name: "ٱلْجَامِعُ", meaning: "الذي يجمع الخلائق ليوم الحساب", meaningEn: "The Gatherer" },
    { id: "name-89", name: "ٱلْغَنِيُّ", meaning: "الذي لا يحتاج إلى شيء", meaningEn: "The Self-Sufficient" },
    { id: "name-90", name: "ٱلْمُغْنِي", meaning: "الذي يغني عباده عن الحاجة إلى غيره", meaningEn: "The Enricher" },
    { id: "name-91", name: "ٱلْمَانِعُ", meaning: "الذي يمنع العطاء عمن يشاء ابتلاءً أو حماية", meaningEn: "The Preventer" },
    { id: "name-92", name: "ٱلْضَّارُّ", meaning: "الذي يقدر الضرر لمن يشاء بحكمته", meaningEn: "The Distresser" },
    { id: "name-93", name: "ٱلْنَّافِعُ", meaning: "الذي يقدر النفع لمن يشاء بحكمته", meaningEn: "The Propitious" },
    { id: "name-94", name: "ٱلْنُّورُ", meaning: "الهادي الذي بنوره يهتدي أهل السماوات والأرض", meaningEn: "The Light" },
    { id: "name-95", name: "ٱلْهَادِي", meaning: "الذي يهدي ويرشد عباده إلى ما فيه صلاحهم", meaningEn: "The Guide" },
    { id: "name-96", name: "ٱلْبَدِيعُ", meaning: "الذي خلق الخلق بلا مثال سابق", meaningEn: "The Incomparable" },
    { id: "name-97", name: "ٱلْبَاقِي", meaning: "الدائم الوجود الذي لا يفنى", meaningEn: "The Everlasting" },
    { id: "name-98", name: "ٱلْوَارِثُ", meaning: "الذي يرث الأرض ومن عليها", meaningEn: "The Inheritor" },
    { id: "name-99", name: "ٱلْرَّشِيدُ", meaning: "الذي يرشد الخلق إلى مصالحهم", meaningEn: "The Guide to the Right Path" },
];

const NamesOfAllah = () => {
  const navigate = useNavigate();
  const { settings, addFavorite, removeFavorite, favorites } = useAppSettings();
  const { toast } = useToast();
  const [selectedName, setSelectedName] = useState<Name | null>(null);

  const isArabic = settings.language === "ar";

  const toggleFavorite = (nameId: string) => {
    // استخدام نظام المفضلة الرئيسي في التطبيق
    const favoriteId = `allah-name-${nameId}`;

    if (favorites.includes(favoriteId)) {
      removeFavorite(favoriteId);
    } else {
      addFavorite(favoriteId);
    }
  };

  // التحقق مما إذا كان الاسم في المفضلة
  const isFavorite = (nameId: string): boolean => {
    return favorites.includes(`allah-name-${nameId}`);
  };

  const shareName = (name: Name) => {
    const shareText = `${name.name} - ${isArabic ? name.meaning : name.meaningEn}`;

    if (navigator.share) {
      navigator.share({
        title: isArabic ? "من أسماء الله الحسنى" : "Names of Allah",
        text: shareText,
      }).catch((err) => {
        console.error("Error sharing:", err);
        // Fallback to clipboard if share fails
        navigator.clipboard.writeText(shareText).then(() => {
          toast({
            title: isArabic ? "تم النسخ" : "Copied to clipboard",
            description: isArabic ? "تم نسخ الاسم إلى الحافظة" : "Name was copied to clipboard",
          });
        });
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText).then(() => {
        toast({
          title: isArabic ? "تم النسخ" : "Copied to clipboard",
          description: isArabic ? "تم نسخ الاسم إلى الحافظة" : "Name was copied to clipboard",
        });
      });
    }
  };

  return (
    <div className={`min-h-screen ${settings.appearance.darkMode ? "bg-gradient-to-b from-slate-900 to-slate-950 text-white" : "bg-gradient-to-b from-amber-50 to-amber-100 text-slate-900"} flex flex-col pb-16`}>
      {/* Header */}
      <div className={`${settings.appearance.darkMode ? "bg-slate-900/90" : "bg-white/90"} p-4 flex justify-end items-center backdrop-blur-md border-b ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"}`}>
        <h2 className={`text-2xl font-arabic font-bold text-center flex-1 ${settings.appearance.darkMode ? "text-white" : "text-slate-900"}`}>
          {settings.language === "ar" ? "أسماء الله الحسنى" : "Names of Allah"}
        </h2>
        <button onClick={() => navigate("/")} className="p-2">
          <ChevronLeft className={`w-5 h-5 rotate-180 ${settings.appearance.darkMode ? "text-white" : "text-slate-900"}`} />
        </button>
      </div>

      {/* Names Grid */}
      <div className="flex-1 p-3 pb-20">
        <div className="grid grid-cols-3 gap-3">
          {allahNames.map((name) => (
            <div
              key={name.id}
              className={`${settings.appearance.darkMode ? "bg-slate-800/50" : "bg-white/50"} rounded-xl aspect-square flex flex-col items-center justify-center p-2 relative cursor-pointer shadow-md backdrop-blur-md border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} hover:shadow-lg transition-all duration-300`}
              onClick={() => setSelectedName(name)}
            >
              <div className={`font-arabic text-2xl font-bold ${settings.appearance.darkMode ? "text-amber-400" : "text-amber-700"} text-center leading-tight`}>{name.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Name Detail Modal */}
      {selectedName && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className={`${settings.appearance.darkMode ? "bg-slate-800/90" : "bg-white/90"} rounded-xl p-6 w-full max-w-sm shadow-lg backdrop-blur-md border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"}`}>
            <div className="text-center mb-6">
              <h2 className={`text-3xl font-arabic font-bold ${settings.appearance.darkMode ? "text-amber-400" : "text-amber-700"} mb-4`}>{selectedName.name}</h2>
              <p className={`${settings.appearance.darkMode ? "text-gray-300" : "text-gray-700"} font-arabic`}>
                {isArabic ? selectedName.meaning : selectedName.meaningEn}
              </p>
            </div>

            <div className="flex justify-center space-x-6 rtl:space-x-reverse">
              <button
                onClick={() => toggleFavorite(selectedName.id)}
                className={`p-3 rounded-full ${settings.appearance.darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-amber-100 hover:bg-amber-200"} transition-colors`}
              >
                <Heart className={`h-6 w-6 ${isFavorite(selectedName.id) ? 'fill-red-500 text-red-500' : (settings.appearance.darkMode ? 'text-white' : 'text-amber-700')}`} />
              </button>

              <button
                onClick={() => shareName(selectedName)}
                className={`p-3 rounded-full ${settings.appearance.darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-amber-100 hover:bg-amber-200"} transition-colors`}
              >
                <Share className={`h-6 w-6 ${settings.appearance.darkMode ? "text-white" : "text-amber-700"}`} />
              </button>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setSelectedName(null)}
                className={`px-5 py-2 ${settings.appearance.darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-amber-100 hover:bg-amber-200 text-amber-900"} rounded-lg font-arabic transition-colors`}
              >
                {isArabic ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NamesOfAllah;
