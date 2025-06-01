import { useState } from 'react';
import { motion } from 'framer-motion';
import { Repeat, Copy, RefreshCw, Volume2 } from 'lucide-react';
import { copyToClipboard } from '../../lib/utils';
import { azkar, categories, categoryMap, Dhikr } from '../../data/azkar/azkar.data';

const organizeAdhkarByCategory = () => {
  const result: Record<string, Dhikr[]> = {};
  
  azkar.forEach(zikr => {
    const categoryKey = categoryMap[zikr.category as keyof typeof categoryMap] || 'misc';
    
    if (!result[categoryKey]) {
      result[categoryKey] = [];
    }
    
    result[categoryKey].push(zikr);
  });
  
  return result;
};

const adhkarData = organizeAdhkarByCategory();

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
      return currentCount < maxRepeat ? { ...prev, [dhikrId]: currentCount + 1 } : prev;
    });
  };

  const handleResetCounter = (dhikrId: string) => {
    setCounters(prev => ({ ...prev, [dhikrId]: 0 }));
  };

  const handleCopyDhikr = async (text: string) => {
    const success = await copyToClipboard(text);
    alert(success ? 'تم نسخ الذكر بنجاح' : 'فشل في نسخ الذكر');
  };

  const handlePlayAudio = (audioUrl: string, dhikrId: string) => {
    if (audioPlaying === dhikrId) {
      setAudioPlaying(null);
      const audio = document.getElementById('audio-player') as HTMLAudioElement;
      audio?.pause();
    } else {
      setAudioPlaying(dhikrId);
      const audio = document.getElementById('audio-player') as HTMLAudioElement;
      if (audio) {
        audio.src = audioUrl;
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          setAudioPlaying(null);
        });
        audio.onended = () => setAudioPlaying(null);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">الأذكار والأدعية</h1>
        
        <audio id="audio-player" className="hidden"></audio>
        
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {adhkarData[activeCategory]?.map((dhikr) => (
            <div key={dhikr.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <p className="text-xl leading-relaxed text-right font-quran text-gray-800">
                  {dhikr.text}
                </p>
              </div>
              
              {dhikr.explanation && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-600">{dhikr.explanation}</p>
                </div>
              )}
              
              <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <p className="text-sm text-gray-500">{dhikr.category}</p>
                </div>

                <div className="flex items-center gap-2">
                  {dhikr.audio && (
                    <button
                      onClick={() => handlePlayAudio(dhikr.audio!, dhikr.id)}
                      className={`p-2 rounded-full ${
                        audioPlaying === dhikr.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleCopyDhikr(dhikr.text)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <Copy size={20} className="text-gray-600" />
                  </button>
                  
                  <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleIncrementCounter(dhikr.id, dhikr.repeat)}
                      disabled={(counters[dhikr.id] || 0) >= dhikr.repeat}
                      className={`p-2 ${
                        (counters[dhikr.id] || 0) >= dhikr.repeat
                          ? 'bg-gray-200 cursor-not-allowed'
                          : 'hover:bg-gray-200'
                      }`}
                    >
                      <Repeat size={20} className="text-gray-600" />
                    </button>
                    
                    <div className="px-3 font-medium text-gray-700">
                      {counters[dhikr.id] || 0}/{dhikr.repeat}
                    </div>
                    
                    <button
                      onClick={() => handleResetCounter(dhikr.id)}
                      className="p-2 hover:bg-gray-200"
                    >
                      <RefreshCw size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!adhkarData[activeCategory] || adhkarData[activeCategory].length === 0) && (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500">
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