import { Link } from 'react-router-dom';
import { BookOpen, BookText, Heart, AtSign, Calendar, Compass } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#b0afaf] dark:bg-[#10341e] transition-theme pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Site Information */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#262931] dark:text-[#446149]">الإسلام حياة</h3>
            <p className="text-[#262931] dark:text-[#446149] mb-4">
              موقع إسلامي شامل يهدف إلى تقديم المحتوى الإسلامي الصحيح بطريقة سهلة وميسرة.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#262931] dark:text-[#446149]">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/quran" className="text-[#262931] dark:text-[#446149] hover:text-[#6f737e] dark:hover:text-[#34383f] transition-theme">
                  القرآن الكريم
                </Link>
              </li>
              <li>
                <Link to="/hadith" className="text-[#262931] dark:text-[#446149] hover:text-[#6f737e] dark:hover:text-[#34383f] transition-theme">
                  الحديث الشريف
                </Link>
              </li>
              <li>
                <Link to="/adhkar" className="text-[#262931] dark:text-[#446149] hover:text-[#6f737e] dark:hover:text-[#34383f] transition-theme">
                  الأذكار
                </Link>
              </li>
              <li>
                <Link to="/dua" className="text-[#262931] dark:text-[#446149] hover:text-[#6f737e] dark:hover:text-[#34383f] transition-theme">
                  <AtSign className="ml-2 h-4 w-4" />
                  الأدعية
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="text-[#262931] dark:text-[#446149] hover:text-[#6f737e] dark:hover:text-[#34383f] transition-theme">
                  <Calendar className="ml-2 h-4 w-4" />
                  التقويم الهجري
                </Link>
              </li>
              <li>
                <Link to="/qibla" className="text-[#262931] dark:text-[#446149] hover:text-[#6f737e] dark:hover:text-[#34383f] transition-theme">
                  <Compass className="ml-2 h-4 w-4" />
                  اتجاه القبلة
                </Link>
              </li>
            </ul>
          </div>

          {/* Sources and References */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#262931] dark:text-[#446149]">المصادر</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://api.quran.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#262931] dark:text-[#446149] hover:text-[#6f737e] dark:hover:text-[#34383f] transition-theme"
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
                  className="text-[#262931] dark:text-[#446149] hover:text-[#6f737e] dark:hover:text-[#34383f] transition-theme"
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
                  className="text-[#262931] dark:text-[#446149] hover:text-[#6f737e] dark:hover:text-[#34383f] transition-theme"
                >
                  <Heart className="ml-2 h-4 w-4" />
                  حصن المسلم
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#2b3138] dark:border-[#334155] text-center">
          <p className="text-[#262931] dark:text-[#446149]">
            © {currentYear} الإسلام حياة. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;