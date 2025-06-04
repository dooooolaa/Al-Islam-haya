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
  arafah: [
    {
      id: 'a1',
      text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      translation: 'There is no deity except Allah, alone, without any partner. To Him belongs the dominion and to Him belongs all praise, and He is over all things Omnipotent.',
      source: 'رواه الترمذي',
      category: 'arafah'
    },
    {
      id: 'a2',
      text: 'اللَّهُمَّ لَكَ الْحَمْدُ كَالَّذِي نَقُولُ وَخَيْرًا مِمَّا نَقُولُ، اللَّهُمَّ لَكَ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي، وَإِلَيْكَ مَآبِي، وَرَبِّي أَنْتَ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَوَسْوَسَةِ الصَّدْرِ، وَشَتَّاتِ الْأَمْرِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ مَا تَجِيءُ بِهِ الرِّيحُ',
      translation: 'O Allah, to You belongs all praise as we say and better than what we say. O Allah, to You belongs my prayer, my sacrifice, my life and my death, and to You is my return. You are my Lord. O Allah, I seek refuge in You from the punishment of the grave, the whisperings of the chest, and the scattering of affairs. O Allah, I seek refuge in You from the evil of what the wind brings.',
      source: 'رواه الترمذي',
      category: 'arafah'
    },
    {
      id: 'a3',
      text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ فِي سَفَرِي هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ، وَكَآبَةِ الْمَنْظَرِ، وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ',
      translation: 'O Allah, I ask You on this journey of mine for righteousness, piety, and such deeds as are pleasing to You. O Allah, make this journey easy for us and fold up for us its distance. O Allah, You are the Companion on the journey and the Successor over the family. O Allah, I seek refuge in You from the hardships of travel, from having a change of heart and from having a bad return in property and family.',
      source: 'رواه مسلم',
      category: 'arafah'
    },
    {
      id: 'a4',
      text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ مَا سَأَلَكَ مِنْهُ عِبَادُكَ الصَّالِحُونَ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا اسْتَعَاذَ مِنْهُ عِبَادُكَ الصَّالِحُونَ',
      translation: 'O Allah, I ask You for the good that Your righteous servants have asked You for, and I seek refuge in You from the evil that Your righteous servants have sought refuge from.',
      source: 'رواه الترمذي وابن ماجه',
      category: 'arafah'
    },
    {
      id: 'a5',
      text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ يَا مَنْ لَا تَرَاهُ الْعُيُونُ، وَلَا تُخَالِطُهُ الظُّنُونُ، وَلَا يَصِفُهُ الْوَاصِفُونَ، وَلَا تُغَيِّرُهُ الْحَوَادِثُ وَلَا يَخْشَاهُ الدَّهْرُ، يَا مَنْ لَا يَشْغَلُهُ حَافِظٌ عَنْ حَافِظٍ، وَلَا يَخْتَلِفُ عَلَيْهِ الْأُمَرَاءُ، وَلَا يَخْشَى الدَّوَائِرَ، يَعْلَمُ مِقْدَارَ الْجِبَالِ، وَمَكَايِيلَ الْبِحَارِ، وَعَدَدَ قَطْرِ الْأَمْطَارِ، وَعَدَدَ وَرَقِ الْأَشْجَارِ، وَعَدَدَ مَا أَظْلَمَ عَلَيْهِ اللَّيْلُ، وَأَشْرَقَ عَلَيْهِ النَّهَارُ، وَلَا تَتَوَارَى مِنْهُ ظُلْمَةُ ظَالِمٍ، وَلَا تَخْفَى عَلَيْهِ خَافِيَةٌ',
      translation: 'O Allah, I ask You, O He Who cannot be seen by eyes, nor can He be imagined by thoughts, nor can He be described by describers, nor can He be changed by events, nor can He be feared by time. O He Who is not distracted by one guardian from another, nor do the rulers differ over Him, nor does He fear the cycles of time. He knows the measure of the mountains, the measures of the seas, the number of raindrops, the number of tree leaves, the number of what the night has darkened and the day has brightened. No darkness of an oppressor is hidden from Him, and no secret is concealed from Him.',
      source: 'رواه الطبراني',
      category: 'arafah'
    },
    {
      id: 'a6',
      text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ فِي سَفَرِي هَذَا مِنَ الْبِرِّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ، وَكَآبَةِ الْمَنْظَرِ، وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ وَالْوَلَدِ',
      translation: 'O Allah, I ask You on this journey of mine for righteousness, piety, and such deeds as are pleasing to You. O Allah, make this journey easy for us and fold up for us its distance. O Allah, You are the Companion on the journey and the Successor over the family. O Allah, I seek refuge in You from the hardships of travel, from having a change of heart and from having a bad return in property, family and children.',
      source: 'رواه مسلم',
      category: 'arafah'
    }
  ],
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
  { id: 'arafah', name: 'أدعية عرفة' },
  { id: 'protection', name: 'أدعية الحماية والحفظ' },
  { id: 'forgiveness', name: 'أدعية المغفرة' },
  { id: 'morning', name: 'أدعية الصباح' },
  { id: 'need', name: 'أدعية قضاء الحاجة' }
];

const DuaPage = () => {
  const [activeCategory, setActiveCategory] = useState('arafah');
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
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
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
                  ? 'bg-light-accent dark:bg-dark-accent text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{dua.translation}</p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  {dua.source && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{dua.source}</p>
                  )}
                </div>

                <div className="flex items-center space-x-3 space-x-reverse">
                  {dua.translation && (
                    <button
                      onClick={() => toggleTranslation(dua.id)}
                      className="text-sm text-light-accent dark:text-dark-accent hover:underline"
                    >
                      {showTranslation[dua.id] ? 'إخفاء الترجمة' : 'عرض الترجمة'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleCopyDua(dua.text)}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-theme"
                    aria-label="نسخ"
                  >
                    <Copy size={18} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => handleShareDua(dua)}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-theme"
                    aria-label="مشاركة"
                  >
                    <Share2 size={18} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => toggleFavorite(dua.id)}
                    className={`p-2 rounded-full transition-theme ${
                      favorites.includes(dua.id)
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
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
              <p className="text-lg text-gray-600 dark:text-gray-400">
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