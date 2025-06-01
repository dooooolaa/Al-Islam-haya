export interface Dhikr {
  id: string;
  text: string;
  category: string;
  repeat: number;
  audio?: string;
  explanation?: string;
}

export const categoryMap = {
  'أذكار الصباح والمساء': 'morningEvening',
  'أذكار الصباح': 'morning',
  'أذكار المساء': 'evening',
  'أذكار النوم': 'sleep',
  'أذكار الاستيقاظ': 'wakeup',
  'أذكار الصلاة': 'prayer',
  'أدعية الصباح والمساء': 'morningEveningDua',
  'أدعية الكرب': 'distress',
  'أدعية الهم والحزن': 'sadness',
  'أدعية الاستخارة': 'istikhara',
  'أدعية متنوعة': 'misc'
};

export const azkar: Dhikr[] = [
  // أذكار الصباح
  {
    id: 'morning-1',
    text: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    category: 'أذكار الصباح',
    repeat: 3,
    explanation: 'الاستعاذة بالله من الشيطان الرجيم'
  },
  {
    id: 'morning-2',
    text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    category: 'أذكار الصباح',
    repeat: 1
  },

  // أذكار المساء
  {
    id: 'evening-1',
    text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
    category: 'أذكار المساء',
    repeat: 1
  },

  // أدعية متنوعة
  {
    id: 'dua-1',
    text: 'اللَّهُمَّ اجْعَلْنَا مِنَ التَّوَّابِينَ وَاجْعَلْنَا مِنَ الْمُتَطَهِّرِينَ',
    category: 'أدعية متنوعة',
    repeat: 1,
    explanation: 'الدعاء بأن يجعلنا الله من التوابين والمتطهرين'
  },
  {
    id: 'dua-2',
    text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
    category: 'أدعية متنوعة',
    repeat: 1
  }
];

export const categories = [
  { id: 'morning', name: 'أذكار الصباح' },
  { id: 'evening', name: 'أذكار المساء' },
  { id: 'morningEvening', name: 'أذكار الصباح والمساء' },
  { id: 'prayer', name: 'أذكار الصلاة' },
  { id: 'sleep', name: 'أذكار النوم' },
  { id: 'wakeup', name: 'أذكار الاستيقاظ' },
  { id: 'morningEveningDua', name: 'أدعية الصباح والمساء' },
  { id: 'distress', name: 'أدعية الكرب' },
  { id: 'sadness', name: 'أدعية الهم والحزن' },
  { id: 'istikhara', name: 'أدعية الاستخارة' },
  { id: 'misc', name: 'أدعية متنوعة' }
];