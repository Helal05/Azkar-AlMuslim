import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowUp } from 'lucide-react';
import { useAppSettings } from '../contexts/AppSettingsContext';

const FadlAlDhikr = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();

  const pageTitle = settings.language === "ar" ? "فضل الذكر" : "Virtues of Dhikr";

  const Header = () => (
    <div className={`sticky top-0 z-50 ${settings.appearance.darkMode ? "bg-slate-800/90" : "bg-white/90"} backdrop-blur-md border-b ${settings.appearance.darkMode ? "border-white/10" : "border-amber-200/50"}`}>
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={() => navigate(-1)}
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
      <div id="fadl-al-dhikr-content-area" className="flex-1 p-4 overflow-y-auto">
        <div className={`p-4 rounded-lg space-y-3 ${settings.appearance.darkMode ? "bg-slate-800/40" : "bg-white/40"} border ${settings.appearance.darkMode ? "border-slate-700" : "border-amber-200"}`}>
          <p className="text-lg leading-relaxed text-right" style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}>
            قَالَ اللَّهُ تَعَالَى : ﴿ فَاذْكُرُونِي أَذْكُرَكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونَ ﴾ <span className="text-xs opacity-70">(۱)</span>
          </p>
          <p className="text-lg leading-relaxed text-right" style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}>
            ﴿ يَأَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا ﴾ <span className="text-xs opacity-70">(۲)</span>
          </p>
          <p className="text-lg leading-relaxed text-right" style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}>
            ﴿ وَالذَّاكِرِينَ اللَّهَ كَثِيرًا وَالذَّاكِرَاتِ أَعَدَّ اللَّهُ لَهُم مَغْفِرَةً وَأَجْرًا عَظِيمًا ﴾ <span className="text-xs opacity-70">(۳)</span>
          </p>
          <p className="text-lg leading-relaxed text-right" style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}>
            ﴿ وَاذْكُر رَّبَّكَ فِي نَفْسِكَ تَضَرُّعًا وَخِيفَةً وَدُونَ الْجَهْرِ مِنَ الْقَوْلِ بِالْغُدُوِّ وَالْآصَالِ وَلَا تَكُن مِّنَ الْغَافِلِينَ ﴾ <span className="text-xs opacity-70">(٤)</span>
          </p>
          <p className="text-lg leading-relaxed text-right" style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}>
            وقال ﷺ مثل الذي يذكر ربه والذي لا يذكر ربه مثل الحي والميت <span className="text-xs opacity-70">(٥)</span>
          </p>
          <p className="text-lg leading-relaxed text-right" style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}>
            وقالﷺ: ألا أنبئكم بخير أعمالكم، وأزكاها عند مليككم، وأرفعها في درجاتكم، وخير لكم من إنفاق الذهب والورق ، وخير لكم من أن تلقوا عدوكم فتضربوا أعناقهم ويضربوا أعناقكم قالوا بلى قال : ذكر الله تعالى <span className="text-xs opacity-70">(٦)</span>
          </p>
          <p className="text-lg leading-relaxed text-right" style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}>
            وقال الله تعالى : أنا عند ظن عبدي بي، وأنا معه إذا ذكرني ، فإن ذكرني في نفسه ذكرته في نفسي، وإن ذكرني في ملأ ذكرته في ملأ خير منهم ، وإن تقرب إلي شبرا تقربت إليه ذراعا، وإن تقرب إلى ذراعا تقربت إليه باعا ، وإن أتاني يمشي أتيته هرولة <span className="text-xs opacity-70">(٧)</span>
          </p>
          <p className="text-lg leading-relaxed text-right" style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}>
            وعن عبد الله بن بسر رضي الله عنه أن رجلا قال : يا رسول الله إن شرائع الإسلام قد كثرت علي فأخبرني بشيء أتشبث به . قال : لا يزال لسانك رطبا من ذكر الله <span className="text-xs opacity-70">(٨)</span>
          </p>
          <p className="text-lg leading-relaxed text-right" style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}>
            وقالﷺ: من قرأ حرفا من كتاب الله فله به حسنة ، والحسنة بعشر أمثالها ، لا أقول : الم حرف ؛ ولكن ألف حرف ، ولام حرف ، وميم حرف <span className="text-xs opacity-70">(٩)</span>
          </p>
          <p className="text-lg leading-relaxed text-right" style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}>
            وعن عقبة بن عامر رضي الله عنه قال : خرج رسول اللهﷺونحن في الصفة فقال : أيكم يحب أن يغدو كل يوم إلى بطحان أو إلى العقيق فيأتي منه بناقتين كوماوين في غير إثم ولا قطيعة رحم ؟ فقلنا : يا رسول الله نحب ذلك قال : أفلا يغدو أحدكم إلى المسجد فيعلم، أو يقرأ آيتين من كتاب الله عز وجل خير له من ناقتين ، وثلاث خير له من ثلاث ، وأربع خير له من أربع ، ومن أعدادهن من الإبل <span className="text-xs opacity-70">(١٠)</span>
          </p>
          <p className="text-lg leading-relaxed text-right" style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}>
            وقالﷺ: من قعد مقعدا لم يذكر الله فيه كانت عليه من الله ترة، ومن اصطجع مضجعا لم يذكر الله فيه كانت عليه من الله ترة <span className="text-xs opacity-70">(١١)</span>
          </p>
          <p className="text-lg leading-relaxed text-right" style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}>
            وقالﷺ: ما جلس قوم مجلسا لم يذكروا الله فيه ، ولم يصلوا على نبيهم إلا كان عليهم ترة، فإن شاء عذبهم وإن شاء غفر لهم <span className="text-xs opacity-70">(١٢)</span>
          </p>
          <p className="text-lg leading-relaxed text-right" style={{ direction: 'rtl', fontFamily: "'Noto Naskh Arabic', serif" }}>
            وقالﷺ: ما من قوم يقومون من مجلس لا يذكرون الله فيه إلا قاموا عن مثل جيفة حمار وكان لهم حسرة <span className="text-xs opacity-70">(١٣)</span>
          </p>
          {/* Sources */}
          <div className="mt-4 text-xs opacity-80" style={{ direction: 'rtl' }}>
            <p>(۱) سورة البقرة، آية : ١٥٢ .</p>
            <p>(۲) سورة الأحزاب، آية : ٤١ .</p>
            <p>(۳) سورة الأحزاب، آية : ٣٥.</p>
            <p>(٤) سورة الأعراف ،آية -۲۰۵.</p>
            <p>(٥) البخاري مع الفتح ۲۰۸/11 و مسلم بلفظ مثل البيت الذي يذكر الله فيه والبيت الذي لا يذكر الله فيه مثل الحي والميت .٥٣٩/١</p>
            <p>(٦) الترمذي ٤٥٩/٥ وابن ماجه ١٢٤٥/٢ وانظر صحيح ابن ماجه ٣١٦/٢ وصحيح الترمذي ٣/ ١٣٩ .</p>
            <p>(٧) البخاري ۱71/8 و مسلم /٢٠٦١٤ واللفظ للبخاري</p>
            <p>(٨) الترمذي ٤٥٨/٥ وابن ماجه ١٢٤٦/٢ وانظر صحيح الترمذي ٣/ ۱۳۹ وصحيح ابن ماجه ۳۱۷/۲.</p>
            <p>(٩) الترمذي ١٧٥/٥ وانظر صحيح الترمذي ٩٣ وصحيح الجامع الصغير ٣٤٠/٥.</p>
            <p>(١٠) مسلم ٥٥٣/١ .</p>
            <p>(١١) أبو داود ٤/ ٢٦٤ وغيره وانظر صحيح الجامع ٣٤٢/٥.</p>
            <p>(١٢) الترمذي وانظر صحيح الترمذي ٣ ١٤٠</p>
            <p>(١٣) رواه أبو داود بإسناد حسن .</p>
          </div>
        </div>
      </div>
      {/* Scroll to top button */}
      <div className={`flex justify-center py-3 border-t ${settings.appearance.darkMode ? "border-slate-700 bg-slate-800/90" : "bg-amber-200/50 bg-white/90"} backdrop-blur-md`}>
        <button
          onClick={scrollToTop}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${settings.appearance.darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-amber-100 hover:bg-amber-200"}`}
        >
          <ArrowUp className="h-5 w-5" />
          <span className="font-arabic">العودة لبداية النصوص</span>
        </button>
      </div>
    </div>
  );
};

export default FadlAlDhikr;
