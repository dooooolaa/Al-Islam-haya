import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatNumber } from '../../lib/utils';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import QuranAudioPlayer from '../../components/quran/QuranAudioPlayer';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

const QuranPage = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        
        if (data.code === 200 && data.status === 'OK') {
          setSurahs(data.data);
          setFilteredSurahs(data.data);
        } else {
          throw new Error('فشل في تحميل بيانات السور');
        }
      } catch (err) {
        setError('حدث خطأ أثناء تحميل بيانات السور. يرجى المحاولة مرة أخرى.');
        console.error('Error fetching surahs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSurahs(surahs);
    } else {
      const filtered = surahs.filter(
        (surah) =>
          surah.name.includes(searchQuery) ||
          surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.number.toString().includes(searchQuery)
      );
      setFilteredSurahs(filtered);
    }
  }, [searchQuery, surahs]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="container-page min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-page">
        <h1 className="section-title">القرآن الكريم</h1>
        <ErrorMessage message={error} retry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <QuranAudioPlayer />
  );
};

export default QuranPage;