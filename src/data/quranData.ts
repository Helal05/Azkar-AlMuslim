export interface QuranVerse {
  id: number;
  arabic: string;
  english: string;
  surah_ar: string;
  surah_en: string;
  verse: string;
  background: string;
}

export const quranVerses: QuranVerse[] = [
  {
    id: 1,
    arabic: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ",
    english: "Allah! There is no god ˹worthy of worship˺ except Him, the Ever-Living, All-Sustaining. Neither drowsiness nor sleep overtakes Him.",
    surah_ar: "البقرة",
    surah_en: "Al-Baqarah",
    verse: "2:255",
    background: "islamic-pattern-1"
  },
  {
    id: 2,
    arabic: "فَٱذْكُرُونِىٓ أَذْكُرْكُمْ وَٱشْكُرُوا۟ لِى وَلَا تَكْفُرُونِ",
    english: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    surah_ar: "البقرة",
    surah_en: "Al-Baqarah",
    verse: "2:152",
    background: ""
  },
  {
    id: 3,
    arabic: "وَمَا بِكُم مِّن نِّعْمَةٍ فَمِنَ ٱللَّهِ",
    english: "And whatever of blessings and good things you have, it is from Allah.",
    surah_ar: "النحل",
    surah_en: "An-Nahl",
    verse: "16:53",
    background: ""
  },
  {
    id: 4,
    arabic: "إِنَّ ٱللَّهَ وَمَلَٰٓئِكَتَهُۥ يُصَلُّونَ عَلَى ٱلنَّبِىِّ ۚ يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ صَلُّوا۟ عَلَيْهِ وَسَلِّمُوا۟ تَسْلِيمًا",
    english: "Indeed, Allah confers blessing upon the Prophet, and His angels [ask Him to do so]. O you who have believed, ask [ Allah to confer] blessing upon him and ask [ Allah to grant him] peace.",
    surah_ar: "الأحزاب",
    surah_en: "Al-Ahzab",
    verse: "33:56",
    background: ""
  },
   {
    id: 5,
    arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
    english: "Say, 'He is Allah, [who is] One.'",
    surah_ar: "الإخلاص",
    surah_en: "Al-Ikhlas",
    verse: "112:1",
    background: ""
  }
];

// Sample background image paths (assuming they exist in public/backgrounds)
export const islamicBackgrounds: string[] = [
  '/backgrounds/islamic-geo-1.webp',
  '/backgrounds/islamic-geo-2.webp',
  '/backgrounds/mosque-silhouette.webp',
  '/backgrounds/lanterns.webp',
  '/backgrounds/arabic-calligraphy.webp'
];
