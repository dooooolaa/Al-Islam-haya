import { Link } from 'react-router-dom';
import { BookOpen, BookText, Heart, AtSign, Calendar, Compass } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 transition-theme pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Site Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">الإسلام حياة</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              موقع إسلامي شامل يهدف إلى تقديم المحتوى الإسلامي الصحيح بطريقة سهلة وميسرة.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/quran" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-dark-accent transition-theme">
                  <BookOpen className="ml-2 h-4 w-4" />
                  القرآن الكريم
                </Link>
              </li>
              <li>
                <Link to="/hadith" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-dark-accent transition-theme">
                  <BookText className="ml-2 h-4 w-4" />
                  الحديث الشريف
                </Link>
              </li>
              <li>
                <Link to="/adhkar" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-dark-accent transition-theme">
                  <Heart className="ml-2 h-4 w-4" />
                  الأذكار
                </Link>
              </li>
              <li>
                <Link to="/dua" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-dark-accent transition-theme">
                  <AtSign className="ml-2 h-4 w-4" />
                  الأدعية
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-dark-accent transition-theme">
                  <Calendar className="ml-2 h-4 w-4" />
                  التقويم الهجري
                </Link>
              </li>
              <li>
                <Link to="/qibla" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-dark-accent transition-theme">
                  <Compass className="ml-2 h-4 w-4" />
                  اتجاه القبلة
                </Link>
              </li>
            </ul>
          </div>

          {/* Sources and References */}
          <div>
            <h3 className="text-xl font-bold mb-4">المصادر</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://api.quran.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-dark-accent transition-theme"
                >
                  <BookOpen className="ml-2 h-4 w-4" />
                  API القرآن الكريم
                </a>
              </li>
              <li>
                <a 
                  href="https://dorar.net" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-dark-accent transition-theme"
                >
                  <BookText className="ml-2 h-4 w-4" />
                  موقع الدرر السنية
                </a>
              </li>
              <li>
                <a 
                  href="https://www.muslimfortress.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-dark-accent transition-theme"
                >
                  <Heart className="ml-2 h-4 w-4" />
                  حصن المسلم
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 text-center text-gray-600 dark:text-gray-400">
          <p>© {currentYear} جميع الحقوق محفوظة لـ <a href="https://mohamed-adel-portfolio.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-light-accent dark:text-dark-accent hover:underline">Mohamed Adel</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;