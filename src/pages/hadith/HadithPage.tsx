import { useState, useEffect } from 'react';
import { Search, Filter, Book, BookOpen, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import { hadiths as initialHadiths, categories, books } from '../../data/hadiths';
import { fetchMoreHadiths } from '../../data/hadithService';

interface Hadith {
  id: string;
  text: string;
  narrator: string;
  book: string;
  chapter: string;
  grade: string;
  explanation?: string;
  source?: string;
  page?: string;
  hadithNumber?: string;
}

const ITEMS_PER_PAGE = 10;

const HadithPage = () => {
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [filteredHadiths, setFilteredHadiths] = useState<Hadith[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedHadith, setExpandedHadith] = useState<string | null>(null);

  useEffect(() => {
    // Load hadiths from data file and API
    const fetchHadiths = async () => {
      try {
        setLoading(true);
        // Start with initial hadiths
        setHadiths(initialHadiths);
        
        // Fetch more hadiths from API
        const moreHadiths = await fetchMoreHadiths();
        setHadiths(prev => [...prev, ...moreHadiths]);
        
        setLoading(false);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل الأحاديث. يرجى المحاولة مرة أخرى.');
        setLoading(false);
      }
    };

    fetchHadiths();
  }, []);

  useEffect(() => {
    let result = hadiths;

    // Apply book filter
    if (selectedBook) {
      result = result.filter(hadith => hadith.book === selectedBook);
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(hadith => hadith.chapter.includes(selectedCategory));
    }

    // Apply search query
    if (searchQuery.trim()) {
      result = result.filter(
        hadith =>
          hadith.text.includes(searchQuery) ||
          hadith.narrator.includes(searchQuery) ||
          hadith.book.includes(searchQuery) ||
          hadith.chapter.includes(searchQuery)
      );
    }

    setFilteredHadiths(result);
    setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE));
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedCategory, selectedBook, hadiths]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBook(e.target.value);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleHadithExpand = (id: string) => {
    setExpandedHadith(expandedHadith === id ? null : id);
  };

  const getCurrentPageHadiths = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredHadiths.slice(startIndex, endIndex);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-8">
        <div className="flex space-x-2 space-x-reverse">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded-md transition-theme ${
              currentPage === 1 
                ? 'opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600' 
                : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <ChevronRight size={18} />
          </button>
          
          {startPage > 1 && (
            <>
              <button 
                onClick={() => handlePageChange(1)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-theme"
              >
                1
              </button>
              {startPage > 2 && (
                <span className="px-4 py-2 text-gray-500">...</span>
              )}
            </>
          )}
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-4 py-2 rounded-md transition-theme ${
                currentPage === number
                  ? 'bg-light-accent dark:bg-dark-accent text-white'
                  : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-4 py-2 text-gray-500">...</span>
              )}
              <button 
                onClick={() => handlePageChange(totalPages)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-theme"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded-md transition-theme ${
              currentPage === totalPages 
                ? 'opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600' 
                : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>
    );
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
        <h1 className="section-title">الحديث الشريف</h1>
        <ErrorMessage message={error} retry={() => window.location.reload()} />
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
        <h1 className="section-title">الحديث الشريف</h1>
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن حديث..."
                value={searchQuery}
                onChange={handleSearch}
                className="input pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="input pr-10"
              >
                <option value="">جميع الأبواب</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            
            <div className="relative">
              <select
                value={selectedBook}
                onChange={handleBookChange}
                className="input pr-10"
              >
                <option value="">جميع الكتب</option>
                {books.map(book => (
                  <option key={book} value={book}>{book}</option>
                ))}
              </select>
              <Book className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-gray-600 dark:text-gray-400">
          <p>
            {filteredHadiths.length} حديث {searchQuery ? `للبحث عن "${searchQuery}"` : ''}
            {selectedCategory ? ` في باب "${selectedCategory}"` : ''}
            {selectedBook ? ` من كتاب "${selectedBook}"` : ''}
          </p>
        </div>

        {/* Hadiths List */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {getCurrentPageHadiths().map((hadith) => (
            <div 
              key={hadith.id} 
              className="card hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => toggleHadithExpand(hadith.id)}
            >
              <div className="mb-4">
                <p className="text-xl leading-relaxed font-quran">{hadith.text}</p>
                
                {(expandedHadith === hadith.id && hadith.explanation) && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                  >
                    <div className="flex items-center mb-2">
                      <Info size={16} className="ml-2 text-light-accent dark:text-dark-accent" />
                      <span className="font-medium text-light-accent dark:text-dark-accent">شرح الحديث:</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{hadith.explanation}</p>
                  </motion.div>
                )}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 text-gray-600 dark:text-gray-400">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div className="flex items-center">
                    <span className="font-medium ml-1">الراوي:</span>
                    <span>{hadith.narrator}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium ml-1">المصدر:</span>
                    <span>{hadith.book}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium ml-1">الباب:</span>
                    <span>{hadith.chapter}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium ml-1">الدرجة:</span>
                    <span className={`${
                      hadith.grade === 'صحيح' ? 'text-green-600 dark:text-green-400' :
                      hadith.grade === 'حسن' ? 'text-blue-600 dark:text-blue-400' :
                      hadith.grade === 'ضعيف' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`}>{hadith.grade}</span>
                  </div>
                  {hadith.source && (
                    <div className="flex items-center">
                      <span className="font-medium ml-1">التخريج:</span>
                      <span>{hadith.source}</span>
                    </div>
                  )}
                  {hadith.page && (
                    <div className="flex items-center">
                      <span className="font-medium ml-1">الصفحة:</span>
                      <span>{hadith.page}</span>
                    </div>
                  )}
                  {hadith.hadithNumber && (
                    <div className="flex items-center">
                      <span className="font-medium ml-1">الرقم:</span>
                      <span>{hadith.hadithNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredHadiths.length === 0 && (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                لا توجد نتائج{searchQuery ? ` للبحث عن "${searchQuery}"` : ''}
              </p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {renderPagination()}
        
        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="text-center mt-6">
            <LoadingSpinner size="md" />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HadithPage;
