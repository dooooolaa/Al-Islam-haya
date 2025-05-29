import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Copy, Share2, Heart } from 'lucide-react';
import { copyToClipboard, generateShareLink } from '../../lib/utils';

interface Dua {
  id: string;
  text: string;
  translation?: string;
  source?: string;
  category: string;
  favorite?: boolean;
}

// Mock data - In a real app, this would come from an API
const duasData: Record<string, Dua[]> = {
  protection: [
    {
      id: 'p1',
      text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
      translation: 'O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.',
      source: 'رواه البخاري',
      category: 'protection'
    },
    {
      id: 'p2',
      text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      translation: 'In the name of Allah with Whose name nothing can harm on earth or in heaven, and He is the All-Hearing, All-Knowing.',
      source: 'رواه الترمذي وأبو داود وابن ماجه',
      category: 'protection'
    }
  ],
  forgiveness: [
    {
      id: 'f1',
      text: 'رَبِّ اغْفِرْ لِي خَطِيئَتِي وَجَهْلِي، وَإِسْرَافِي فِي أَمْرِي كُلِّهِ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي، اللَّهُمَّ اغْفِرْ لِي خَطَايَايَ وَعَمْدِي وَجَهْلِي وَهَزْلِي، وَكُلُّ ذَلِكَ عِنْدِي، اللَّهُمَّ اغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي، أَنْتَ الْمُقَدِّمُ وَأَنْتَ الْمُؤَخِّرُ وَأَنْتَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      translation: 'O my Lord, forgive me for my errors, my ignorance, my immoderation in all my affairs, and for all that You know better than I do. O Allah, forgive me for my sins, my deliberate actions, my ignorance, my joking, and all that I have. O Allah, forgive me for what I have put forward and what I have put back, what I have kept secret and what I have made public, and what You know more than I do. You are the One who brings forward and the One who puts back, and You are Able to do all things.',
      source: 'رواه البخاري ومسلم',
      category: 'forgiveness'
    }
  ],
  morning: [
    {
      id: 'm1',
      text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
      translation: 'O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.',
      source: 'رواه ابن ماجه والنسائي وأحمد',
      category: 'morning'
    }
  ],
  need: [
    {
      id: 'n1',
      text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِأَنَّ لَكَ الْحَمْدَ لَا إِلَهَ إِلَّا أَنْتَ الْمَنَّانُ بَدِيعُ السَّمَوَاتِ وَالْأَرْضِ ذُو الْجَلَالِ وَالْإِكْرَامِ يَا حَيُّ يَا قَيُّومُ إِنِّي أَسْأَلُكَ',
      translation: 'O Allah, I ask You, as all praise is due to You, there is none worthy of worship but You, the Bestower of blessings, the Creator of the heavens and the earth, O Possessor of majesty and honor, O Ever-Living, O Self-Sustaining, I ask of You.',
      source: 'رواه أبو داود والنسائي والترمذي وابن ماجه',
      category: 'need'
    }
  ]
};

const categories = [
  { id: 'protection', name: 'أدعية الحماية والحفظ' },
  { id: 'forgiveness', name: 'أدعية المغفرة' },
  { id: 'morning', name: 'أدعية الصباح' },
  { id: 'need', name: 'أدعية قضاء الحاجة' }
];

const DuaPage = () => {
  const [activeCategory, setActiveCategory] = useState('protection');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showTranslation, setShowTranslation] = useState<Record<string, boolean>>({});

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const toggleTranslation = (duaId: string) => {
    setShowTranslation(prev => ({
      ...prev,
      [duaId]: !prev[duaId]
    }));
  };

  const handleCopyDua = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      alert('تم نسخ الدعاء بنجاح');
    } else {
      alert('فشل في نسخ الدعاء');
    }
  };

  const handleShareDua = async (dua: Dua) => {
    const shareUrl = generateShareLink(`/dua?category=${dua.category}&id=${dua.id}`);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'دعاء من موقع الإسلام حياة',
          text: dua.text,
          url: shareUrl
        });
      } catch (err) {
        console.error('Error sharing:', err);
        const success = await copyToClipboard(shareUrl);
        if (success) {
          alert('تم نسخ رابط الدعاء بنجاح');
        }
      }
    } else {
      const success = await copyToClipboard(shareUrl);
      if (success) {
        alert('تم نسخ رابط الدعاء بنجاح');
      }
    }
  };

  const toggleFavorite = (duaId: string) => {
    setFavorites(prev => {
      if (prev.includes(duaId)) {
        return prev.filter(id => id !== duaId);
      } else {
        return [...prev, duaId];
      }
    });
  };

  // Filter duas based on search query
  const filteredDuas = duasData[activeCategory]?.filter(dua => 
    dua.text.includes(searchQuery) || 
    (dua.translation && dua.translation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="section-title">الأدعية</h1>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن دعاء..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text)] dark:text-[var(--color-dark-text)]" size={20} />
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 m-1 rounded-md font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-[var(--color-accent)] dark:bg-[var(--color-dark-accent)] text-white'
                  : 'bg-[var(--color-hover-bg)] dark:bg-[var(--color-dark-hover-bg)] text-[var(--color-text)] dark:text-[var(--color-dark-text)] hover:bg-[var(--color-hover-bg)] dark:hover:bg-[var(--color-dark-hover-bg)]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Duas List */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredDuas?.map((dua) => (
            <div key={dua.id} className="card hover:shadow-lg transition-all duration-300">
              <div className="mb-4">
                <p className="text-xl leading-relaxed font-quran">{dua.text}</p>
                
                {dua.translation && showTranslation[dua.id] && (
                  <div className="mt-4 p-3 bg-[var(--color-hover-bg)] dark:bg-[var(--color-dark-hover-bg)] rounded-md">
                    <p className="text-[var(--color-text)] dark:text-[var(--color-dark-text)] text-sm">{dua.translation}</p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
                <div className="flex items-center">
                  {dua.source && (
                    <p className="text-sm text-[var(--color-text)] dark:text-[var(--color-dark-text)]">{dua.source}</p>
                  )}
                </div>

                <div className="flex items-center space-x-3 space-x-reverse">
                  {dua.translation && (
                    <button
                      onClick={() => toggleTranslation(dua.id)}
                      className="text-sm text-[var(--color-accent)] dark:text-[var(--color-dark-accent)] hover:underline"
                    >
                      {showTranslation[dua.id] ? 'إخفاء الترجمة' : 'عرض الترجمة'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleCopyDua(dua.text)}
                    className="p-2 rounded-full bg-[var(--color-hover-bg)] dark:bg-[var(--color-dark-hover-bg)] hover:bg-[var(--color-hover-bg)] dark:hover:bg-[var(--color-dark-hover-bg)] transition-theme"
                    aria-label="نسخ"
                  >
                    <Copy size={18} className="text-[var(--color-text)] dark:text-[var(--color-dark-text)]" />
                  </button>
                  
                  <button
                    onClick={() => handleShareDua(dua)}
                    className="p-2 rounded-full bg-[var(--color-hover-bg)] dark:bg-[var(--color-dark-hover-bg)] hover:bg-[var(--color-hover-bg)] dark:hover:bg-[var(--color-dark-hover-bg)] transition-theme"
                    aria-label="مشاركة"
                  >
                    <Share2 size={18} className="text-[var(--color-text)] dark:text-[var(--color-dark-text)]" />
                  </button>
                  
                  <button
                    onClick={() => toggleFavorite(dua.id)}
                    className={`p-2 rounded-full transition-theme ${
                      favorites.includes(dua.id)
                        ? 'bg-[var(--color-error-bg)] dark:bg-[var(--color-dark-error-bg)] text-[var(--color-error)] dark:text-[var(--color-dark-error)]'
                        : 'bg-[var(--color-hover-bg)] dark:bg-[var(--color-dark-hover-bg)] text-[var(--color-text)] dark:text-[var(--color-dark-text)] hover:bg-[var(--color-hover-bg)] dark:hover:bg-[var(--color-dark-hover-bg)]'
                    }`}
                    aria-label={favorites.includes(dua.id) ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                  >
                    <Heart size={18} fill={favorites.includes(dua.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredDuas?.length === 0 && (
            <div className="text-center py-10">
              <p className="text-lg text-[var(--color-text)] dark:text-[var(--color-dark-text)]">
                لا توجد نتائج{searchQuery ? ` للبحث عن "${searchQuery}"` : ''}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DuaPage;