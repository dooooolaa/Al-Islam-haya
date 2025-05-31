import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, X, Sun, Moon, BookOpen, BookText, Heart, AtSign, Calendar, Compass } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/quran', label: 'القرآن الكريم', icon: BookOpen },
  { to: '/hadith', label: 'الحديث الشريف', icon: BookText },
  { to: '/adhkar', label: 'الأذكار', icon: Heart },
  { to: '/dua', label: 'الأدعية', icon: AtSign },
  { to: '/calendar', label: 'التقويم الهجري', icon: Calendar },
  { to: '/qibla', label: 'اتجاه القبلة', icon: Compass },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-dark-bg shadow-sm transition-theme">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 space-x-reverse" onClick={closeMenu}>
            <BookOpen className="h-6 w-6 text-light-accent dark:text-dark-accent" />
            <span className="font-title text-xl font-bold">الإسلام حياة</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 space-x-reverse">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-theme',
                    isActive
                      ? 'text-light-accent dark:text-dark-accent bg-primary-50 dark:bg-gray-800'
                      : 'text-gray-700 dark:text-gray-300 hover:text-light-accent dark:hover:text-dark-accent'
                  )
                }
              >
                <link.icon className="ml-1.5 h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-theme"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-theme"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <nav className="flex flex-col space-y-2 px-4 py-3 bg-white dark:bg-dark-bg border-t border-gray-200 dark:border-gray-800 transition-theme">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center px-3 py-3 rounded-md text-base font-medium transition-theme',
                      isActive
                        ? 'text-light-accent dark:text-dark-accent bg-primary-50 dark:bg-gray-800'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )
                  }
                  onClick={closeMenu}
                >
                  <link.icon className="ml-2 h-5 w-5" />
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;