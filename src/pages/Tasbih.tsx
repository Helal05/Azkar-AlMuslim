import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Plus, List, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DEFAULT_AZKAR = [
  { text: "سبحان الله", count: 0 },
  { text: "الحمد لله", count: 0 },
  { text: "الله أكبر", count: 0 },
  { text: "لا إله إلا الله", count: 0 },
  { text: "سبحان الله وبحمده", count: 0 },
  { text: "لا حول ولا قوة إلا بالله", count: 0 },
  { text: "أستغفر الله", count: 0 },
  { text: "سبحان الله وبحمده سبحان الله العظيم", count: 0 },
];

const Tasbih = () => {
  const [azkar, setAzkar] = useState(() => {
    const saved = localStorage.getItem("azkar_list");
    return saved ? JSON.parse(saved) : DEFAULT_AZKAR;
  });
  const [current, setCurrent] = useState(0);
  const [showList, setShowList] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newZikr, setNewZikr] = useState("");
  const [swipedIdx, setSwipedIdx] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [editValue, setEditValue] = useState("");
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const [showMenu, setShowMenu] = useState(false);
  const [vibrate, setVibrate] = useState(true);
  const [counterFontWeight, setCounterFontWeight] = useState("bold");
  const [sectionStyle, setSectionStyle] = useState("default");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCount, setEditCount] = useState(0);
  const [counterOpacity, setCounterOpacity] = useState(1);
  const navigate = useNavigate();
  const [showOpacityDropdown, setShowOpacityDropdown] = useState(false);

  // حفظ القائمة
  const saveAzkar = (list) => {
    setAzkar(list);
    localStorage.setItem("azkar_list", JSON.stringify(list));
  };

  // عداد الذكر الحالي
  const increment = () => {
    const updated = azkar.map((z, i) => i === current ? { ...z, count: z.count + 1 } : z);
    saveAzkar(updated);
    if (vibrate && window.navigator.vibrate) window.navigator.vibrate(20);
  };

  // تصفير ذكر معين
  const reset = (i) => {
    const updated = azkar.map((z, idx) => idx === i ? { ...z, count: 0 } : z);
    saveAzkar(updated);
  };

  // إضافة ذكر جديد
  const addZikr = () => {
    if (newZikr.trim()) {
      saveAzkar([...azkar, { text: newZikr.trim(), count: 0 }]);
      setNewZikr("");
      setShowAdd(false);
      setCurrent(azkar.length); // انتقل مباشرة للذكر الجديد
    }
  };

  // تنقل يمين/يسار
  const goNext = () => setCurrent((prev) => (prev < azkar.length - 1 ? prev + 1 : prev));
  const goPrev = () => setCurrent((prev) => (prev > 0 ? prev - 1 : prev));

  // شريط النقاط
  const Dots = () => (
    <div className="flex items-center justify-center gap-2 py-4">
      {azkar.map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${i === current ? "bg-white" : "bg-gray-700"}`}
          style={{ display: "inline-block" }}
        ></span>
      ))}
    </div>
  );

  // المجموع الكلي
  const total = azkar.reduce((acc, z) => acc + z.count, 0);

  // حذف ذكر
  const deleteZikr = (i) => {
    const updated = azkar.filter((_, idx) => idx !== i);
    saveAzkar(updated);
    setSwipedIdx(null);
    if (current >= updated.length) setCurrent(updated.length - 1);
  };

  // بدء التعديل
  const startEdit = (i) => {
    setEditIdx(i);
    setEditValue(azkar[i].text);
  };

  // حفظ التعديل
  const saveEdit = () => {
    if (editValue.trim()) {
      const updated = azkar.map((z, i) => i === editIdx ? { ...z, text: editValue.trim() } : z);
      saveAzkar(updated);
      setEditIdx(null);
      setEditValue("");
    }
  };

  // إلغاء التعديل
  const cancelEdit = () => {
    setEditIdx(null);
    setEditValue("");
  };

  // التعامل مع السحب
  const handleTouchStart = (e, i) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e, i) => {
    touchCurrentX.current = e.touches[0].clientX;
    if (Math.abs(touchCurrentX.current - touchStartX.current) > 40) {
      setSwipedIdx(i);
    }
  };
  const handleTouchEnd = (e, i) => {
    setTimeout(() => setSwipedIdx(null), 3000); // إخفاء الخيارات بعد 3 ثواني
  };

  // عند الضغط على "تعديل الدعاء" في القائمة
  const openEditModal = () => {
    setEditIdx(current);
    setEditValue(azkar[current].text);
    setEditCount(azkar[current].count);
    setShowEditModal(true);
    setShowMenu(false);
  };

  // حفظ التعديل من المودال
  const saveEditModal = () => {
    if (editValue.trim()) {
      const updated = azkar.map((z, i) =>
        i === editIdx ? { ...z, text: editValue.trim(), count: Number(editCount) } : z
      );
      saveAzkar(updated);
      setEditIdx(null);
      setEditValue("");
      setShowEditModal(false);
    }
  };

  // سحب العداد للتنقل بين الأدعية
  const counterTouchStartX = useRef(0);
  const counterTouchEndX = useRef(0);
  const handleCounterTouchStart = (e) => {
    counterTouchStartX.current = e.touches[0].clientX;
  };
  const handleCounterTouchEnd = (e) => {
    counterTouchEndX.current = e.changedTouches[0].clientX;
    const diff = counterTouchEndX.current - counterTouchStartX.current;
    if (diff > 40 && current > 0) setCurrent(current - 1); // سحب يمين
    if (diff < -40 && current < azkar.length - 1) setCurrent(current + 1); // سحب يسار
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      {/* الشريط العلوي */}
      <div className="flex items-center justify-between p-4 border-b border-[#222]">
        <button className="p-2" onClick={() => navigate("/")}>{/* زر رجوع */}
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowList(true)} className="p-2"><List className="w-6 h-6" /></button>
          <button onClick={() => reset(current)} className="p-2"><RefreshCw className="w-6 h-6" /></button>
        </div>
        <button className="p-2" onClick={() => setShowMenu(true)}><MoreHorizontal className="w-6 h-6" /></button>
      </div>

      {/* قائمة الإعدادات المنسدلة */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-start justify-center"
            style={{ background: "rgba(0,0,0,0.3)" }}
            onClick={() => { setShowMenu(false); setShowOpacityDropdown(false); }}
          >
            <div className="mt-24 w-80 max-w-full bg-[#232323] rounded-2xl shadow-xl p-2 flex flex-col gap-1" onClick={e => e.stopPropagation()}>
              <button onClick={openEditModal} className="flex items-center gap-2 p-3 hover:bg-[#333] rounded-xl text-right">
                <span className="inline-block w-5"><svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 112.828 2.828L11.828 13.828a4 4 0 01-1.414.94l-3.172 1.057 1.057-3.172a4 4 0 01.94-1.414z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                تعديل الدعاء
              </button>
              {/* درجة وضوح الخط Dropdown */}
              <div className="flex items-center gap-2 p-3 hover:bg-[#333] rounded-xl text-right relative">
                <span className="inline-block w-5"><svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg></span>
                <span>درجة وضوح خط العداد</span>
                <button className="ml-auto bg-[#232323] text-white border border-[#444] rounded px-2 py-1 flex items-center gap-1" onClick={() => setShowOpacityDropdown(v => !v)}>
                  {Math.round(counterOpacity * 100)}%
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" /></svg>
                </button>
                {showOpacityDropdown && (
                  <div className="absolute right-0 top-12 w-40 bg-[#232323] rounded-xl shadow-lg border border-[#333] z-50">
                    {[1,0.8,0.6,0.4,0.2,0.1].map(val => (
                      <button key={val} onClick={() => { setCounterOpacity(val); setShowOpacityDropdown(false); }} className={`w-full text-right px-4 py-2 hover:bg-[#333] ${counterOpacity === val ? 'text-blue-400 font-bold' : ''}`}>{Math.round(val*100)}%</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 p-3 hover:bg-[#333] rounded-xl text-right">
                <span className="inline-block w-5"><svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/></svg></span>
                <span>شكل القسم</span>
                <select value={sectionStyle} onChange={e => setSectionStyle(e.target.value)} className="ml-auto bg-[#232323] text-white border border-[#444] rounded px-2 py-1">
                  <option value="default">افتراضي</option>
                  <option value="rounded">مستدير</option>
                  <option value="underline">خط سفلي</option>
                </select>
              </div>
              <button onClick={() => { reset(current); setShowMenu(false); }} className="flex items-center gap-2 p-3 hover:bg-[#333] rounded-xl text-right">
                <RefreshCw className="w-5 h-5" />
                تصفير عداد الصفحة
              </button>
              <div className="text-center text-gray-400 py-2 border-t border-[#333] mt-2">المجموع الكلي: <span className="text-white font-bold">{total}</span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة تعديل الدعاء */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.7)" }}
          >
            <div className="bg-[#232323] rounded-2xl p-6 w-[90vw] max-w-md flex flex-col gap-6">
              <div className="flex items-center justify-between mb-2">
                <button onClick={()=>setShowEditModal(false)} className="text-red-400 font-bold">إلغاء</button>
                <div className="font-bold text-lg">تحرير دعاء</div>
                <button onClick={saveEditModal} className="bg-blue-500 text-white px-4 py-1 rounded font-bold">حفظ</button>
              </div>
              <div>
                <div className="mb-2 text-right font-arabic">اكتب الدعاء:</div>
                <input
                  className="w-full p-3 rounded bg-[#333] text-white border-none text-center font-arabic"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <div className="mb-2 text-right font-arabic">العداد (يمكنك تحرير رقم العداد)</div>
                <input
                  className="w-full p-3 rounded bg-[#333] text-white border-none text-center font-mono"
                  type="number"
                  value={editCount}
                  onChange={e => setEditCount(Number(e.target.value))}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* الذكر والعداد */}
      <div
        className="flex-1 flex flex-col items-center justify-center select-none"
        onClick={increment}
        style={{ cursor: 'pointer' }}
        onTouchStart={handleCounterTouchStart}
        onTouchEnd={handleCounterTouchEnd}
      >
        <span
          className={`text-2xl font-arabic mb-6 text-center leading-relaxed ${sectionStyle === 'rounded' ? 'bg-[#222] px-6 py-2 rounded-full' : ''} ${sectionStyle === 'underline' ? 'border-b-4 border-blue-400 pb-2' : ''}`}
          style={{ opacity: counterOpacity }}
        >
          {azkar[current]?.text}
        </span>
        <motion.span
          key={azkar[current]?.count}
          initial={{ scale: 1.2, opacity: 0.7 }}
          animate={{ scale: 1, opacity: counterOpacity }}
          transition={{ duration: 0.3 }}
          className="text-7xl"
          style={{ fontWeight: counterFontWeight }}
        >
          {azkar[current]?.count}
        </motion.span>
      </div>

      {/* شريط النقاط */}
      <Dots />

      {/* قائمة الأذكار (modal) */}
      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setShowList(false)}
          >
            <div className="w-full max-w-md mx-auto bg-[#181818] rounded-t-2xl p-4 pb-8 relative" onClick={e => e.stopPropagation()}>
              {/* رأس القائمة */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => { reset(current); }} className="p-2"><RefreshCw className="w-5 h-5" /></button>
                <h3 className="text-lg font-arabic font-bold text-center flex-1">قائمة الأدعية</h3>
                <div className="w-8"></div>
              </div>
              {/* قائمة الأذكار */}
              <div className="divide-y divide-[#222] mb-4">
                {azkar.map((z, i) => (
                  <div
                    key={i}
                    className={`relative bg-transparent ${i === current ? 'text-yellow-400 font-bold' : ''}`}
                    onClick={() => { setCurrent(i); setShowList(false); }}
                    style={{ cursor: 'pointer' }}
                    onTouchStart={e => handleTouchStart(e, i)}
                    onTouchMove={e => handleTouchMove(e, i)}
                    onTouchEnd={e => handleTouchEnd(e, i)}
                  >
                    {/* خيارات السحب */}
                    {swipedIdx === i && (
                      <div className="absolute inset-0 z-10 flex items-center bg-gray-800 rounded-lg overflow-hidden animate-fade-in">
                        <button onClick={e => { e.stopPropagation(); deleteZikr(i); }} className="flex-1 h-full bg-red-600 flex items-center justify-center text-white text-2xl"><span>✕</span></button>
                        <button onClick={e => { e.stopPropagation(); startEdit(i); }} className="flex-1 h-full bg-gray-600 flex items-center justify-center text-white text-lg">تعديل</button>
                        <button onClick={e => { e.stopPropagation(); reset(i); }} className="flex-1 h-full bg-gray-700 flex items-center justify-center text-white text-lg">تصفير العداد</button>
                      </div>
                    )}
                    {/* تعديل الذكر */}
                    {editIdx === i ? (
                      <div className="flex items-center gap-2 py-3">
                        <input
                          className="flex-1 p-2 rounded bg-black text-white border border-gray-700 text-center font-arabic"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                          autoFocus
                        />
                        <button onClick={saveEdit} className="bg-blue-600 px-3 py-1 rounded text-white font-bold">حفظ</button>
                        <button onClick={cancelEdit} className="bg-gray-700 px-3 py-1 rounded text-white">إلغاء</button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between py-3 px-2">
                        <span className="text-lg font-arabic">{z.text}</span>
                        <span className="text-xl tabular-nums">{z.count}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* المجموع */}
              <div className="text-center my-4">
                <span className="font-arabic text-lg">المجموع</span>
                <div className="text-3xl font-bold mt-1">{total}</div>
              </div>
              {/* ملاحظة */}
              <div className="text-xs text-gray-400 text-center mb-4">
                يمكنك تحرير أو حذف أو تصفير العداد من خلال تحريك مكان الدعاء من اليسار إلى اليمين أو العكس.
              </div>
              {/* زر إضافة */}
              <button onClick={() => setShowAdd(true)} className="fixed bottom-8 right-8 bg-blue-600 rounded-full p-4 shadow-lg z-50">
                <Plus className="w-7 h-7 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة إضافة ذكر */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.7)" }}
          >
            <div className="bg-[#222] rounded-xl p-6 w-80 max-w-full flex flex-col gap-4">
              <h3 className="text-lg font-arabic font-bold text-center">إضافة ذكر جديد</h3>
              <input
                type="text"
                className="p-2 rounded bg-black text-white border border-gray-700 text-center font-arabic"
                placeholder="اكتب الذكر هنا"
                value={newZikr}
                onChange={e => setNewZikr(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addZikr(); }}
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={addZikr} className="flex-1 bg-blue-600 py-2 rounded text-white font-bold">إضافة</button>
                <button onClick={() => setShowAdd(false)} className="flex-1 bg-gray-700 py-2 rounded text-white">إلغاء</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasbih;
