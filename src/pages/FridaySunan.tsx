import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { motion } from "framer-motion";

const FridaySunan = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();

  // Data extracted from images with navigation paths
  const sunanItems = [
    { id: "ghusl", title: "الإغتسال", action: () => {} },
    { id: "perfume", title: "التطيب", action: () => {} },
    { id: "bestClothes", title: "لبس أحسن الثياب", action: () => {} },
    { id: "earlyMosque", title: "التبكير إلى المسجد", action: () => {} },
    { id: "kahf", title: "قراءة سورة الكهف", action: () => navigate("/surah-kahf") }, // Corrected path
    { id: "dua", title: "الدعــــاء", action: () => navigate("/comprehensive-duas") } // Navigate to Comprehensive Duas
  ];

  const duas = [
    "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ، وَعَلَى آل مُحَمَّدٍ» كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ، وَعَلَى آل إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، وَبَارِك عَلَى مُحَمَّدٍ، وَعَلَى آل مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ، وَعَلَى آل إِبْرَاهِيمَ، فِي الْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيْدٌ"
  ];

  const virtues = [
    {
      title: "فضائل يوم الجمعة",
      content: [
        "عن أبي هُرَيرَة رَضِيَ اللهُ عنه، عن النبيّ صلّى اللهُ عليه وسلَّم أنَّه قال: ((خيرُ يومٍ طَلعَتْ فيه الشَّمسُ يومُ الجُمُعة؛ فيه خَلَقَ اللهُ آدَمَ، وفيه أُدْخِلَ الجَنَّةَ، وفيه أُخرِجَ منها، ولا تقومُ السَّاعةُ إلّا في يومٍ الجُمُعة))",
        "ليوم الجمعة ميزات وفضائل كثيرة , فضل الله بها هذا اليوم على ما سواه من الأيام",
        " عن أبي هريرة وحذيفة رضي اللّٰه عنهما قالا : قال رسول اللّٰه صلى اللّٰه عليه وسلم : ( أَضَلَّ اللَّهُ عَنْ الْجُمُعَةِ مَنْ كَانَ قَبْلَنَا ، فَكَانَ لِلْيَهُودِ يَوْمُ السَّبْتِ ، وَكَانَ لِلنَّصَارَى يَوْمُ الأَحَدِ ، فَجَاءَ اللَّهُ بِنَا فَهَدَانَا اللَّهُ لِيَوْمِ الْجُمُعَةِ ، فَجَعَلَ الْجُمْعَةَ وَالسَّبْتَ وَالأَحَدَ ، وَكَذَلِكَ هُمْ تَبَعٌ لَنَا يَوْمَ الْقِيَامَةِ ، نَحْنُ الآخِرُونَ مِنْ أَهْلِ الدُّنْيَا . وَالأَوَلُونَ يَوْمَ الْقِيَامَةِ ، الْمَقْضِيُّ لَهُمْ قَبْلَ الْخَلائِق) . رواه مسلم (856).",
        "وعن أوس بن أوس : عن النبي صلى اللّٰه عليه وسلم قال : ( إِنَّ مِنْ أَفْضَل أَيَّامِكُمْ يَوْمَ الْجُمُعَةِ ، فِيهِ خَلِقَ آدَمُ عَلَيْهِ السَّلَامِ » وَفِيهِ قُبِضَ ، وَفِيهِ النَّفْخَةُ ، وَفِيهِ الصَّعْقَةُ ، فَأَكْثِرُوا عَلَيَّ مِنْ الصَّلَاةِ فَإِنَّ صَلَاتَكُمْ مَعْرُوضَةٌ عَلَيَّ ، قَالُوا : يَا رَسُولَ اللَّهِ ، وَكَيْفَ تُعْرَضُ صَلاتُنَا عَلَيْكَ وَقَدْ أَرَمْتَ - أَيْ يَقُولُونَ قَدْ بَلِيتَ- قَالَ : إِنَّ اللَّهَ عَزَّ وَجَلَّ قَدْ حَرَّمَ عَلَى الأَرْضِ أَنْ تَأْكُلَ أَجْسَادَ الأَنْبِيَاءِ عَلَيْهِمْ السَّلام ) . رواه أبو داود (1047) وصححه ابن القيم في تعليقه على سنن آبي داود (4/273) . وصححه الألباني في صحيح أبي داود (925)"
      ]
    }
  ];

  // Card component for consistent styling
  const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-lg ${settings.appearance.darkMode ? "bg-slate-800/50" : "bg-white/50"} backdrop-blur-md border ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"} ${className}`}
    >
      {children}
    </motion.div>
  );

  return (
    <div className={`min-h-screen ${settings.appearance.darkMode ? "bg-gradient-to-b from-slate-900 to-slate-950" : "bg-gradient-to-b from-amber-50 to-amber-100"} flex flex-col`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 ${settings.appearance.darkMode ? "bg-slate-800/90" : "bg-white/90"} backdrop-blur-md border-b ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"}`}>
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate("/")} // Changed to navigate to main page
            className={`p-2 rounded-lg ${settings.appearance.darkMode ? "hover:bg-slate-700/50" : "hover:bg-amber-100/50"}`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="font-arabic text-xl font-semibold">سنن يوم الجمعة</h1>
          <div className="w-10"></div> {/* Placeholder for alignment */}
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Sunan Grid */}
        <Card>
          <h2 className="font-arabic text-lg font-semibold mb-3 text-center">سنن يوم الجمعة</h2>
          <div className="grid grid-cols-2 gap-3">
            {sunanItems.map((sunnah, index) => (
              <motion.div
                key={sunnah.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={sunnah.action}
                className={`p-3 rounded-md text-center ${settings.appearance.darkMode ? "bg-slate-700/40" : "bg-white/40"} border ${settings.appearance.darkMode ? "border-white/5" : "border-amber-200/30"} ${sunnah.id === "kahf" || sunnah.id === "dua" ? "cursor-pointer hover:bg-opacity-70 active:scale-95" : ""}`}
              >
                <h3 className={`font-arabic text-sm font-medium ${
                  (sunnah.id === "kahf" || sunnah.id === "dua") 
                  ? (settings.appearance.darkMode ? 'text-amber-400' : 'text-amber-600') 
                  : ''
                }`}>
                  {sunnah.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Duas Section */}
        {duas.map((dua, index) => (
          <Card key={`dua-${index}`}>
            <p className="font-arabic text-lg leading-relaxed text-center">{dua}</p>
          </Card>
        ))}

        {/* Virtues Section */}
        {virtues.map((virtue, index) => (
          <Card key={`virtue-${index}`}>
            <h2 className="font-arabic text-lg font-semibold mb-3 text-center">{virtue.title}</h2>
            <div className="space-y-3">
              {virtue.content.map((text, textIndex) => (
                <p key={textIndex} className="font-arabic text-base leading-relaxed text-right">
                  {text}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FridaySunan;
