import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Volume2, Copy, Share2, ChevronUp, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatNumber, copyToClipboard, generateShareLink } from '../../lib/utils';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

interface Reciter {
  id: string;
  name: string;
  audioUrl: string;
  type: 'api' | 'direct'; // نوع مصدر الصوت: API أو رابط مباشر
  surahPrefix?: string; // بادئة رقم السورة للروابط المباشرة
  ayahPrefix?: string; // بادئة رقم الآية للروابط المباشرة
  fileExtension?: string; // امتداد الملف للروابط المباشرة
}

const reciters: Reciter[] = [
  { 
    id: 'minshawi_mojawwad',
    name: 'محمد صديق المنشاوي (مجود)',
    audioUrl: 'https://server8.mp3quran.net/minsh/',
    type: 'direct',
    fileExtension: '.mp3'
  },
  { 
    id: 'husary_mojawwad',
    name: 'محمود خليل الحصري (مجود)',
    audioUrl: 'https://server13.mp3quran.net/husr/',
    type: 'direct',
    fileExtension: '.mp3'
  },
  { 
    id: 'husary_murattal',
    name: 'محمود خليل الحصري (مرتل)',
    audioUrl: 'https://server7.mp3quran.net/husary/',
    type: 'direct',
    fileExtension: '.mp3'
  },
  { 
    id: 'kurdi',
    name: 'رعد محمد الكردي',
    audioUrl: 'https://server6.mp3quran.net/kurdi/',
    type: 'direct',
    fileExtension: '.mp3'
  },
  { 
    id: 'alafasy',
    name: 'مشاري راشد العفاسي',
    audioUrl: 'https://server7.mp3quran.net/afs/',
    type: 'direct',
    fileExtension: '.mp3'
  },
  { 
    id: 'sudais',
    name: 'عبد الرحمن السديس',
    audioUrl: 'https://server11.mp3quran.net/sds/',
    type: 'direct',
    fileExtension: '.mp3'
  },
  { 
    id: 'shuraim',
    name: 'سعود الشريم',
    audioUrl: 'https://server7.mp3quran.net/shur/',
    type: 'direct',
    fileExtension: '.mp3'
  },
  { 
    id: 'maher',
    name: 'ماهر المعيقلي',
    audioUrl: 'https://server12.mp3quran.net/maher/',
    type: 'direct',
    fileExtension: '.mp3'
  },
  { 
    id: 'abdulbasit',
    name: 'عبد الباسط عبد الصمد',
    audioUrl: 'https://server7.mp3quran.net/basit/',
    type: 'direct',
    fileExtension: '.mp3'
  },
  { 
    id: 'ghamdi',
    name: 'سعد الغامدي',
    audioUrl: 'https://server7.mp3quran.net/s_gmd/',
    type: 'direct',
    fileExtension: '.mp3'
  }
];

const SurahPage = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const navigate = useNavigate();
  
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<string>('alafasy');
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlayingSurah, setIsPlayingSurah] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [fontSize, setFontSize] = useState<number>(24);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [surahAudioAvailable, setSurahAudioAvailable] = useState(true);

  useEffect(() => {
    const fetchSurah = async () => {
      if (!surahNumber) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.asad`);
        const data = await response.json();
        
        if (data.code === 200 && data.status === 'OK') {
          setSurah(data.data);
        } else {
          throw new Error('فشل في تحميل بيانات السورة');
        }
      } catch (err) {
        setError('حدث خطأ أثناء تحميل بيانات السورة. يرجى المحاولة مرة أخرى.');
        console.error('Error fetching surah:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurah();
  }, [surahNumber]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // إعادة تعيين حالة توفر الصوت عند تغيير القارئ
  useEffect(() => {
    setSurahAudioAvailable(true);
    setAudioError(null);
    
    // إيقاف الصوت الحالي عند تغيير القارئ
    if (currentAudio) {
      currentAudio.pause();
      setPlayingAyah(null);
      setCurrentAudio(null);
      setIsPlayingSurah(false);
    }
  }, [selectedReciter]);

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
  };

  const handleBackClick = () => {
    navigate('/quran');
  };

  const handleAudioError = (audio: HTMLAudioElement) => {
    let errorMessage = 'هذه السورة غير متوفرة لهذا الشيخ. يرجى اختيار قارئ آخر.';
    
    // تعيين حالة عدم توفر الصوت للسورة
    setSurahAudioAvailable(false);
    
    setAudioError(errorMessage);
    setAudioLoading(false);
    setPlayingAyah(null);
    setCurrentAudio(null);
    setIsPlayingSurah(false);
    
    // إزالة رسالة الخطأ بعد 5 ثوانٍ
    setTimeout(() => setAudioError(null), 5000);
  };

  const getAudioUrl = (reciterId: string, surahNum: number): string => {
    const reciter = reciters.find(r => r.id === reciterId);
    
    if (!reciter) {
      throw new Error('Reciter not found');
    }
    
    // تنسيق رقم السورة بثلاثة أرقام (مثال: 001، 012، 114)
    const formattedSurahNumber = surahNum.toString().padStart(3, '0');
    
    return `${reciter.audioUrl}${formattedSurahNumber}${reciter.fileExtension}`;
  };

  const createAudioElement = (surahNum: number): HTMLAudioElement => {
    const audio = new Audio();
    
    // إذا كانت السورة غير متوفرة، لا نحاول تحميل الصوت
    if (!surahAudioAvailable) {
      throw new Error('Surah audio not available for this reciter');
    }
    
    audio.addEventListener('error', () => handleAudioError(audio));
    
    audio.addEventListener('loadstart', () => {
      setAudioLoading(true);
    });

    audio.addEventListener('canplaythrough', () => {
      setAudioLoading(false);
    });

    // تحميل مسبق للآية التالية للتشغيل المستمر
    audio.preload = 'auto';
    
    try {
      audio.src = getAudioUrl(selectedReciter, surahNum);
    } catch (error) {
      console.error('Error creating audio element:', error);
      handleAudioError(audio);
      throw error;
    }
    
    return audio;
  };

  const playSurah = async () => {
    if (!surah || !surahAudioAvailable) return;

    if (isPlayingSurah) {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
      setIsPlayingSurah(false);
      setPlayingAyah(null);
      setCurrentAyahIndex(0);
      return;
    }

    setIsPlayingSurah(true);
    
    try {
      const audio = createAudioElement(surah.number);
      
      audio.onended = () => {
        setIsPlayingSurah(false);
        setPlayingAyah(null);
        setCurrentAudio(null);
      };
      
      audio.onplay = () => {
        setPlayingAyah(surah.ayahs[0].number);
      };
      
      if (currentAudio) {
        currentAudio.pause();
      }
      
      setCurrentAudio(audio);
      await audio.play();
    } catch (error) {
      console.error('Error playing surah:', error);
      setIsPlayingSurah(false);
    }
  };

  const handleAudioPlay = (ayahNumber: number) => {
    if (!surahAudioAvailable) {
      setAudioError('هذه السورة غير متوفرة لهذا الشيخ. يرجى اختيار قارئ آخر.');
      setTimeout(() => setAudioError(null), 5000);
      return;
    }
    
    if (isPlayingSurah) {
      if (currentAudio) {
        currentAudio.pause();
      }
      setIsPlayingSurah(false);
    }

    if (currentAudio) {
      currentAudio.pause();
      if (playingAyah === ayahNumber) {
        setPlayingAyah(null);
        setCurrentAudio(null);
        setAudioLoading(false);
        return;
      }
    }

    try {
      if (!surah) return;
      
      const audio = createAudioElement(surah.number);
      
      audio.onended = () => {
        setPlayingAyah(null);
        setCurrentAudio(null);
        setAudioLoading(false);
      };

      audio.onplay = () => {
        setPlayingAyah(ayahNumber);
      };

      setCurrentAudio(audio);
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        handleAudioError(audio);
      });
    } catch (error) {
      console.error('Error in handleAudioPlay:', error);
      setAudioLoading(false);
    }
  };

  const handleReciterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newReciter = event.target.value;
    
    if (currentAudio) {
      currentAudio.pause();
      setPlayingAyah(null);
      setCurrentAudio(null);
      setAudioLoading(false);
    }
    
    setIsPlayingSurah(false);
    setSelectedReciter(newReciter);
    setSurahAudioAvailable(true); // إعادة تعيين حالة توفر الصوت عند تغيير القارئ
  };

  const handleCopyAyah = async (ayah: Ayah) => {
    const textToCopy = `${ayah.text} [${surah?.name} ${formatNumber(ayah.numberInSurah)}]`;
    const success = await copyToClipboard(textToCopy);
    
    if (success) {
      alert('تم نسخ الآية بنجاح');
    } else {
      alert('فشل في نسخ الآية');
    }
  };

  const handleShareAyah = async (ayah: Ayah) => {
    const shareUrl = generateShareLink(`/quran/${surah?.number}?ayah=${ayah.numberInSurah}`);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${surah?.name} - الآية ${formatNumber(ayah.numberInSurah)}`,
          text: `${ayah.text} [${surah?.name} ${formatNumber(ayah.numberInSurah)}]`,
          url: shareUrl
        });
      } catch (err) {
        console.error('Error sharing:', err);
        const success = await copyToClipboard(shareUrl);
        if (success) {
          alert('تم نسخ رابط الآية بنجاح');
        }
      }
    } else {
      const success = await copyToClipboard(shareUrl);
      if (success) {
        alert('تم نسخ رابط الآية بنجاح');
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container-page min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !surah) {
    return (
      <div className="container-page">
        <button 
          onClick={handleBackClick}
          className="flex items-center text-[var(--color-link)] hover:underline mb-6"
        >
          <ArrowRight className="ml-1" size={18} />
          العودة لقائمة السور
        </button>
        <ErrorMessage 
          message={error || 'لم يتم العثور على السورة'} 
          retry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="container-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Navigation */}
        <button 
          onClick={handleBackClick}
          className="flex items-center text-[var(--color-link)] hover:underline mb-6"
        >
          <ArrowRight className="ml-1" size={18} />
          العودة لقائمة السور
        </button>

        {/* Surah Header */}
        <div className="surah-header mb-8">
          <h1 className="text-4xl md:text-5xl font-title font-bold mb-2 section-title">
            سورة {surah.name}
          </h1>
          <div className="text-[var(--color-text)] mb-4">
            <span>{surah.englishName} • {surah.englishNameTranslation}</span>
            <span className="mx-2">|</span>
            <span>{formatNumber(surah.numberOfAyahs)} آية</span>
            <span className="mx-2">|</span>
            <span>{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <div className="flex items-center">
              <label htmlFor="reciter-select" className="ml-2 text-sm font-medium text-[var(--color-text)]">
                القارئ:
              </label>
              <select
                id="reciter-select"
                value={selectedReciter}
                onChange={handleReciterChange}
                className="input py-1 max-w-xs"
              >
                {reciters.map((reciter) => (
                  <option key={reciter.id} value={reciter.id}>
                    {reciter.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleFontSizeChange(fontSize + 2)}
              className="btn btn-outline text-sm"
            >
              تكبير الخط
            </button>
            <button
              onClick={() => handleFontSizeChange(fontSize - 2)}
              className="btn btn-outline text-sm"
            >
              تصغير الخط
            </button>

            <button
              onClick={playSurah}
              disabled={audioLoading || !surahAudioAvailable}
              className={`btn ${isPlayingSurah ? 'btn-primary' : 'btn-outline'} flex items-center ${
                (audioLoading || !surahAudioAvailable) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {audioLoading ? (
                <LoadingSpinner size="sm" className="ml-2" />
              ) : isPlayingSurah ? (
                <Pause className="ml-2" size={18} />
              ) : (
                <Play className="ml-2" size={18} />
              )}
              {isPlayingSurah ? 'إيقاف التلاوة' : 'استماع للسورة كاملة'}
            </button>
          </div>

          {/* Audio Error Message */}
          {audioError && (
            <div className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 p-3 rounded-md text-sm mb-4">
              {audioError}
            </div>
          )}

          {/* رسالة عدم توفر السورة */}
          {!surahAudioAvailable && !audioError && (
            <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 p-3 rounded-md text-sm mb-4">
              هذه السورة غير متوفرة لهذا الشيخ. يرجى اختيار قارئ آخر.
            </div>
          )}

          {/* Bismillah */}
          {surah.number !== 1 && surah.number !== 9 && (
            <p className="text-center quran-text text-2xl my-6 text-[var(--color-heading)]">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          )}
        </div>

        {/* Ayahs */}
        <div className="card">
          <div className="flex flex-wrap gap-4 text-justify leading-loose" style={{ fontSize: `${fontSize}px` }}>
            {surah.ayahs.map((ayah) => (
              <div 
                key={ayah.number} 
                id={`ayah-${ayah.numberInSurah}`}
                className={cn(
                  "inline relative group text-[var(--color-text)]",
                  playingAyah === ayah.number && "bg-[var(--color-card-border)] rounded"
                )}
              >
                <span className="quran-text">{ayah.text}</span>
                <span className="inline-flex items-center justify-center w-6 h-6 text-sm mx-1 rounded-full bg-[var(--color-btn)] text-white">
                  {formatNumber(ayah.numberInSurah)}
                </span>
                
                <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 space-x-reverse bg-[var(--color-card)] rounded-md shadow-lg p-1 border border-[var(--color-card-border)]">
                  <button
                    onClick={() => handleAudioPlay(ayah.number)}
                    disabled={audioLoading || !surahAudioAvailable}
                    className={`p-1.5 rounded-full hover:bg-[var(--color-card-border)] transition-theme ${ (audioLoading || !surahAudioAvailable) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label="استماع"
                  >
                    {audioLoading && playingAyah === ayah.number ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Volume2 size={16} className={playingAyah === ayah.number ? 'text-[var(--color-link)]' : 'text-[var(--color-text)]'} />
                    )}
                  </button>
                  <button
                    onClick={() => handleCopyAyah(ayah)}
                    className="p-1.5 rounded-full hover:bg-[var(--color-card-border)] transition-theme"
                    aria-label="نسخ"
                  >
                    <Copy size={16} className="text-[var(--color-text)]" />
                  </button>
                  <button
                    onClick={() => handleShareAyah(ayah)}
                    className="p-1.5 rounded-full hover:bg-[var(--color-card-border)] transition-theme"
                    aria-label="مشاركة"
                  >
                    <Share2 size={16} className="text-[var(--color-text)]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 p-3 rounded-full bg-[var(--color-btn)] text-white shadow-lg hover:opacity-90 transition-opacity"
            aria-label="Scroll to top"
          >
            <ChevronUp size={24} />
          </button>
        )}

        {/* Modal for Reciter Unavailable - Example (requires modal component) */}
        {/* {showModal && ( */}
        {/*   <Modal onClose={() => setShowModal(false)}> */}
        {/*     <p>Sorry, audio for this surah is not available for the selected reciter.</p> */}
        {/*   </Modal> */}
        {/* )} */}

      </motion.div>
    </div>
  );
};

export default SurahPage;
