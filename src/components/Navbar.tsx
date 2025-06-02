import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          مكتبة الأحاديث
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">الرئيسية</Link>
          <Link to="/search" className="nav-link">البحث في الأحاديث</Link>
        </div>

        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
} 