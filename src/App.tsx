import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import HomePage from './pages/HomePage';
import HadithSearch from './pages/HadithSearch';
import HadithDetails from './pages/HadithDetails';
import DuaPage from './pages/dua/DuaPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<HadithSearch />} />
              <Route path="/hadith/:id" element={<HadithDetails />} />
              <Route path="/dua" element={<DuaPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;