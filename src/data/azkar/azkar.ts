import { useState } from 'react';
import { motion } from 'framer-motion';
import { Repeat, Copy, RefreshCw, Volume2 } from 'lucide-react';
import { copyToClipboard } from '../../lib/utils';
import { azkar, categories as azkarCategories } from '../../data/azkar/azkar';

interface Dhikr {
  id: string;
  text: string;
  category: string;
  repeat: number;
  audio?: string;
  explanation?: string;
}

const categoryMap = {
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

// تنظيم الأذكار حسب الفئات
const organizeAdhkarByCategory = () => {
  const result: Record<string, Dhikr[]> = {};
  
  // إضافة الأذكار الأساسية
  azkar.forEach(zikr => {
    const categoryKey = categoryMap[zikr.category] || 'misc';
    
    if (!result[categoryKey]) {
      result[categoryKey] = [];
    }
    
    result[categoryKey].push({
      id: zikr.id,
      text: zikr.text,
      category: zikr.category,
      repeat: zikr.repeat,
      audio: zikr.audio,
      explanation: zikr.explanation
    });
  });

  // إضافة الأدعية المتنوعة المطلوبة
  if (!result['misc']) {
    result['misc'] = [];
  }

  result['misc'].push(
    {
      id: 'dua-1',
      text: "اللَّهُمَّ اجْعَلْنَا مِنْ عَفَوْتَ وَرَضِيتَ عَنْهُمْ وَغَفَرْتَ لَهُمْ وَاسْتَجَبْتَ دُعَائِهِمْ وَكَتَبْتَ لَهُمُ الْجَنَّةَ",
      category: "أدعية متنوعة",
      repeat: 1,
      explanation: "هذا الدعاء يطلب من الله أن يجعلنا من المجموعة المباركة التي حصلت على العفو الإلهي، الرضا الإلهي، الغفران، استجابة الدعاء، والفوز بالجنة."
    },
    {
      id: 'dua-2',
      text: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ دَقَّهُ وَجَلَّهُ وَجَلَّهُ أَوَّلهُ وَآخِرَهُ وَعَلاَنِيَتَهُ وَمَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ",
      category: "أدعية متنوعة",
      repeat: 1,
      explanation: "هذا الدعاء يطلب من الله الغفران الشامل لجميع الذنوب، سواء كانت صغيرة (دقة) أو كبيرة (جلة)، مهما كان حجمها أو نوعها، سواء ظهرت للناس (علانية) أو بقيت خافية، سواء علم الإنسان بها أم لا."
    },
    {
      id: 'dua-3',
      text: "اللَّهُمَّ إِنِّي أَسْتَغْفِرُكَ مِمَّا أَعْلَمُ وَمِمَّا لَا أَعْلَمُ وَمِمَّا أَنْتَ أَعْلَمُ بِهِ إِنَّكَ أَنتَ الأَعْزَرُ الأَكْرَمُ",
      category: "أدعية متنوعة",
      repeat: 1,
      explanation: "هذا الدعاء يعبر عن التوبة الشاملة، حيث يطلب العبد الغفران لكل ما يعرفه من ذنوب، ولكل ما لا يعلمه، مع الإقرار بأن الله سبحانه وتعالى هو الأعلم بكل شيء. كما يذكر العبد رحمة الله وكرمه في قبول التوبة."
    },
    {
      id: 'dua-4',
      text: "اللَّهُمَّ أَجِرْ بِخَاطِرِي جَبْرَاءً وَلِيَّهُ فَإِنَّهُ لَا يَعْجَزُكَ شَيْئٌ فِي الأَرْضِ وَلَا فِي السَّمَاءِ يَا سَمِيعَ الدُّعَاءِ",
      category: "أدعية متنوعة",
      repeat: 1,
      explanation: "هذا الدعاء يطلب من الله الحماية والرعاية للقلب والفكر من كل شر، ويؤكد على قدرة الله العظيمة التي لا تعجز عن شيء في الأرض ولا في السماء. كما يشير إلى سماع الله للدعاء وقبوله."
    }
  );
  
  return result;
};

const adhkarData = organizeAdhkarByCategory();

const categories = [
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

const AdhkarPage = () => {
  const [activeCategory, setActiveCategory] = useState('morning');
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleIncrementCounter = (dhikrId: string, maxRepeat: number) => {
    setCounters(prev => {
      const currentCount = prev[dhikrId] || 0;
      if (currentCount < maxRepeat) {
        return { ...prev, [dhikrId]: currentCount + 1 };
      }
      return prev;
    });
  };

  const handleResetCounter = (dhikrId: string) => {
    setCounters(prev => ({ ...prev, [dhikrId]: 0 }));
  };

  const handleCopyDhikr = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      alert('تم نسخ الذكر بنجاح');
    } else {
      alert('فشل في نسخ الذكر');
    }
  };

  const handlePlayAudio = (audioUrl: string, dhikrId: string) => {
    if (audioPlaying === dhikrId) {
      // Stop playing if already playing this audio
      setAudioPlaying(null);
      const audio = document.getElementById('audio-player') as HTMLAudioElement;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    } else {
      // Play new audio
      setAudioPlaying(dhikrId);
      const audio = document.getElementById('audio-player') as HTMLAudioElement;
      if (audio) {
        audio.src = audioUrl;
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          setAudioPlaying(null);
        });
        
        audio.onended = () => {
          setAudioPlaying(null);
        };
      }
    }
  };

  return (
    <div className="container-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="section-title">الأذكار والأدعية</h1>
        
        {/* Hidden audio player */}
        <audio id="audio-player" className="hidden"></audio>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 m-1 rounded-md font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-light-accent dark:bg-dark-accent text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Adhkar List */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {adhkarData[activeCategory]?.map((dhikr) => (
            <div key={dhikr.id} className="card hover:shadow-lg transition-all duration-300">
              <div className="mb-4">
                <p className="text-xl leading-relaxed font-quran">{dhikr.text}</p>
              </div>
              
              {dhikr.explanation && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="text-gray-600 dark:text-gray-400">{dhikr.explanation}</p>
                </div>
              )}
              
              <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {dhikr.category}
                  </p>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  {dhikr.audio && (
                    <button
                      onClick={() => handlePlayAudio(dhikr.audio!, dhikr.id)}
                      className={`p-2 rounded-full ${
                        audioPlaying === dhikr.id
                          ? 'bg-light-accent dark:bg-dark-accent text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      } transition-theme`}
                      aria-label="تشغيل الصوت"
                    >
                      <Volume2 size={20} className={audioPlaying === dhikr.id ? 'text-white' : 'text-gray-600 dark:text-gray-400'} />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleCopyDhikr(dhikr.text)}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-theme"
                    aria-label="نسخ"
                  >
                    <Copy size={20} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleIncrementCounter(dhikr.id, dhikr.repeat)}
                      disabled={(counters[dhikr.id] || 0) >= dhikr.repeat}
                      className={`p-2 transition-theme ${
                        (counters[dhikr.id] || 0) >= dhikr.repeat
                          ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                          : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                      aria-label="عد"
                    >
                      <Repeat size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    
                    <div className="px-3 font-medium">
                      {counters[dhikr.id] || 0}/{dhikr.repeat}
                    </div>
                    
                    <button
                      onClick={() => handleResetCounter(dhikr.id)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-theme"
                      aria-label="إعادة"
                    >
                      <RefreshCw size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!adhkarData[activeCategory] || adhkarData[activeCategory].length === 0) && (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                لا توجد أذكار في هذه الفئة حالياً
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdhkarPage;