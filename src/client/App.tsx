import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Hadith {
  id: string;
  hadithKey: string;
  hadithArabic: string;
  hadithEnglish: string;
  book: string;
  chapter: string;
  reference: string;
  grade: string;
}

interface SearchResponse {
  hadiths: Hadith[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

function App() {
  const [query, setQuery] = useState('');
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [page, setPage] = useState(1);
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [books, setBooks] = useState<string[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<SearchResponse['pagination']>({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0
  });

  useEffect(() => {
    fetchBooks();
    fetchChapters();
  }, []);

  useEffect(() => {
    searchHadiths();
  }, [query, book, chapter, page]);

  const fetchBooks = async () => {
    const response = await axios.get('http://localhost:3001/api/hadiths/books');
    setBooks(response.data.map((b: any) => b.book));
  };

  const fetchChapters = async () => {
    const response = await axios.get('http://localhost:3001/api/hadiths/chapters');
    setChapters(response.data.map((c: any) => c.chapter));
  };

  const searchHadiths = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/hadiths/search', {
        params: { query, book, chapter, page }
      });
      setHadiths(response.data.hadiths);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error searching hadiths:', error);
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <header>
        <h1>محرك بحث الأحاديث</h1>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="ابحث في الأحاديث..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={book}
          onChange={(e) => setBook(e.target.value)}
          className="select-input"
        >
          <option value="">كل الكتب</option>
          {books.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          className="select-input"
        >
          <option value="">كل الأبواب</option>
          {chapters.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">جاري البحث...</div>
      ) : (
        <div className="results">
          <div className="pagination">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              السابق
            </button>
            <span>الصفحة {page} من {pagination.pages}</span>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
            >
              التالي
            </button>
          </div>

          <div className="hadiths-list">
            {hadiths.map((hadith) => (
              <div key={hadith.id} className="hadith-card">
                <div className="hadith-arabic">{hadith.hadithArabic}</div>
                <div className="hadith-english">{hadith.hadithEnglish}</div>
                <div className="hadith-meta">
                  <span className="book">{hadith.book}</span>
                  <span className="chapter">{hadith.chapter}</span>
                  <span className="grade">{hadith.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 