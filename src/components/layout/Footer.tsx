import { Link } from 'react-router-dom';

// Footer navigation links (adjust if different from main nav)
const footerLinks = [
  { to: '/quran', label: 'القرآن الكريم' },
  { to: '/hadith', label: 'الحديث الشريف' },
  { to: '/adhkar', label: 'الأذكار' },
  { to: '/dua', label: 'الأدعية' },
  { to: '/calendar', label: 'التقويم الهجري' },
  { to: '/qibla', label: 'اتجاه القبلة' },
];

// Source links
const sourceLinks = [
  { href: 'https://quran.com/api', label: 'API القرآن الكريم' },
  { href: 'https://dorar.net', label: 'موقع الدرر السنية' },
  { href: 'https://hisnmuslim.com', label: 'حصن المسلم' }, // Updated URL if needed
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // Apply reference footer background and text colors
    <footer className="footer">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Site Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-ref-light-text-hero dark:text-ref-dark-text">
              الإسلام حياة
            </h3>
            <p className="text-sm">
              موقع إسلامي شامل يهدف إلى تقديم المحتوى الإسلامي الصحيح بطريقة سهلة وميسرة.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-ref-light-text-hero dark:text-ref-dark-text">
              روابط سريعة
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm hover:underline transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources and References */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-ref-light-text-hero dark:text-ref-dark-text">
              المصادر
            </h3>
            <ul className="space-y-2">
              {sourceLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:underline transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright - Apply reference border and text colors */}
        <div className="mt-8 pt-6 border-t border-ref-light-card-border dark:border-ref-dark-card-border text-center text-sm">
          <p>
            © {currentYear} جميع الحقوق محفوظة لـ 
            <a href="https://github.com/MohamedAdel011" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline mx-1">
              Mohamed Adel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

