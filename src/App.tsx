import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import QuranPage from './pages/quran/QuranPage';
import SurahPage from './pages/quran/SurahPage';
import HadithPage from './pages/hadith/HadithPage';
import AdhkarPage from './pages/adhkar/AdhkarPage';
import DuaPage from './pages/dua/DuaPage';
import CalendarPage from './pages/calendar/CalendarPage';
import QiblaPage from './pages/qibla/QiblaPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="quran">
          <Route index element={<QuranPage />} />
          <Route path=":surahNumber" element={<SurahPage />} />
        </Route>
        <Route path="hadith" element={<HadithPage />} />
        <Route path="adhkar" element={<AdhkarPage />} />
        <Route path="dua" element={<DuaPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="qibla" element={<QiblaPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;