import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, X, Sun, Moon, BookOpen, BookText, Heart, AtSign, Calendar, Compass } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Define nav links with associated accent colors for active state border
const navLinks = [
  { to: '/quran', label: 'القرآن الكريم', icon: BookOpen, accent: 'accent-quran' },
  { to: '/hadith', label: 'الحديث الشريف', icon: BookText, accent: 'accent-hadith' },
  { to: '/adhkar', label: 'الأذكار', icon: Heart, accent: 'accent-adhkar' },
  { to: '/dua', label: 'الأدعية', icon: AtSign, accent: 'accent-dua' },
  { to: '/calendar', label: 'التقويم الهجري', icon: Calendar, accent: 'accent-calendar' },
  { to: '/qibla', label: 'اتجاه القبلة', icon: Compass, accent: 'accent-qibla' },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Get current location
  const [activeAccent, setActiveAccent] = useState('');

  // Update active accent color based on current path
  useEffect(() => {
    const currentLink = navLinks.find(link => location.pathname.startsWith(link.to));
    setActiveAccent(currentLink ? currentLink.accent : '');
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    // Use reference background colors and add a subtle bottom border
    <header className="sticky top-0 z-50 bg-ref-light-bg dark:bg-ref-dark-bg border-b border-ref-light-card-border dark:border-ref-dark-card-border transition-theme">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Use reference text colors */}
          <Link to="/" className="flex items-center space-x-2 space-x-reverse" onClick={closeMenu}>
            {/* Use accent color of the current active section for the logo icon */}
            <BookOpen className={cn('h-6 w-6 transition-colors', activeAccent ? `text-${activeAccent}` : 'text-ref-light-text-nav dark:text-ref-dark-text-nav')} />
            <span className="font-bold text-xl text-ref-light-text-hero dark:text-ref-dark-text">
              الإسلام حياة
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 space-x-reverse">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                // Apply base nav-link style and dynamic active style with border
                className={({ isActive }) =>
                  cn(
                    'nav-link flex items-center',
                    isActive
                      ? `border-${link.accent} font-semibold text-${link.accent}` // Active state: border and text color match accent
                      : 'text-ref-light-text-nav dark:text-ref-dark-text-nav' // Inactive state
                  )
                }
              >
                <link.icon className="ml-1.5 h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions: Theme Toggle Button - Use reference text colors and hover */}
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-ref-light-text-nav dark:text-ref-dark-text-nav hover:bg-gray-100 dark:hover:bg-gray-700 transition-theme"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 ml-2 rounded-md text-ref-light-text-nav dark:text-ref-dark-text-nav hover:bg-gray-100 dark:hover:bg-gray-700 transition-theme"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-ref-light-card-border dark:border-ref-dark-card-border"
          >
            {/* Use reference background for mobile menu */}
            <nav className="flex flex-col space-y-1 px-2 py-3 bg-ref-light-bg dark:bg-ref-dark-bg transition-theme">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center px-3 py-2 rounded-md text-base font-medium transition-theme',
                      isActive
                        ? `bg-${link.accent}/10 text-${link.accent} font-semibold` // Active state with accent background tint
                        : 'text-ref-light-text-nav dark:text-ref-dark-text-nav hover:bg-gray-100 dark:hover:bg-gray-700' // Inactive state
                    )
                  }
                  onClick={closeMenu} // Close menu on link click
                >
                  <link.icon className="ml-3 h-5 w-5" />
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

