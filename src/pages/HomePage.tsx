import { Link } from 'react-router-dom';
import { BookOpen, BookText, Heart, AtSign, Calendar, Compass } from 'lucide-react';

// Define section data with reference styles
const sections = [
  {
    id: 'quran',
    title: 'القرآن الكريم',
    description: 'تصفح القرآن الكريم كاملاً مع تفسير الآيات والاستماع إلى التلاوات بأصوات مختلفة',
    icon: BookOpen,
    accentColor: 'accent-quran', // Use accent color name
    lightBg: 'light-card-bg-quran',
    path: '/quran'
  },
  {
    id: 'hadith',
    title: 'الحديث الشريف',
    description: 'مجموعة من الأحاديث النبوية الصحيحة مصنفة حسب الأبواب الفقهية',
    icon: BookText,
    accentColor: 'accent-hadith',
    lightBg: 'light-card-bg-hadith',
    path: '/hadith'
  },
  {
    id: 'adhkar',
    title: 'الأذكار',
    description: 'أذكار الصباح والمساء وأذكار بعد الصلاة وأذكار النوم وغيرها',
    icon: Heart,
    accentColor: 'accent-adhkar',
    lightBg: 'light-card-bg-adhkar',
    path: '/adhkar'
  },
  {
    id: 'dua',
    title: 'الأدعية',
    description: 'مجموعة من الأدعية المأثورة عن النبي صلى الله عليه وسلم',
    icon: AtSign,
    accentColor: 'accent-dua',
    lightBg: 'light-card-bg-dua',
    path: '/dua'
  },
  {
    id: 'calendar',
    title: 'التقويم الهجري',
    description: 'التقويم الهجري مع المناسبات الإسلامية والأيام الفضيلة',
    icon: Calendar,
    accentColor: 'accent-calendar',
    lightBg: 'light-card-bg-calendar',
    path: '/calendar'
  },
  {
    id: 'qibla',
    title: 'اتجاه القبلة',
    description: 'تحديد اتجاه القبلة بناءً على موقعك الحالي',
    icon: Compass,
    accentColor: 'accent-qibla',
    lightBg: 'light-card-bg-qibla',
    path: '/qibla'
  }
];

const HomePage = () => {
  return (
    <main className="flex-grow">
      {/* Hero Section - Match reference background and text colors */}
      <section className="py-16 px-4 text-center bg-gray-50 dark:bg-ref-dark-bg transition-theme">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-ref-light-btn1-bg dark:text-ref-dark-text">
            الإسلام حياة
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-ref-light-text-hero dark:text-ref-dark-text-nav">
            موقع إسلامي شامل يجمع القرآن الكريم والأحاديث النبوية والأذكار والأدعية والمزيد
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/quran"
              className="btn btn-ref-primary"
            >
              <BookOpen className="inline-block ml-2" size={18} />
              تصفح القرآن الكريم
            </Link>
            <Link
              to="/adhkar"
              className="btn btn-ref-secondary"
            >
              <Heart className="inline-block ml-2" size={18} />
              الأذكار اليومية
            </Link>
          </div>
        </div>
      </section>

      {/* Main Sections - Use standard light/dark background */}
      <section className="py-12 px-4 bg-ref-light-bg dark:bg-ref-dark-bg transition-theme">
        <div className="container mx-auto">
          <h2 className="section-title">
            أقسام الموقع
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sections.map((section) => (
              <Link
                key={section.id}
                to={section.path}
                className="block group h-full"
              >
                {/* Apply dynamic light background and border color */}
                <div className={`card h-full flex flex-col bg-${section.lightBg} dark:bg-ref-dark-card-bg border-${section.accentColor} group-hover:shadow-xl transition-all duration-300 hover-lift`}>
                  {/* Icon background matches accent color */}
                  <div className={`p-3 rounded-full w-14 h-14 flex items-center justify-center mb-5 bg-${section.accentColor}/10 dark:bg-${section.accentColor}/20 text-${section.accentColor}`}>
                    <section.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-ref-light-text-hero dark:text-ref-dark-text transition-theme">
                    {section.title}
                  </h3>
                  <p className="text-ref-light-text-nav dark:text-ref-dark-text-nav flex-grow text-sm">
                    {section.description}
                  </p>
                  {/* Link text matches accent color */}
                  <div className={`mt-4 text-${section.accentColor} font-medium text-sm group-hover:underline`}>
                    تصفح القسم ←
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Use mid-section styles */}
      <section className="mid-section">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            احرص على قراءة القرآن وذكر الله كل يوم
          </h2>
          <p className="text-lg max-w-3xl mx-auto mb-8 font-quran">
            قال تعالى: ﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Buttons in mid-section need specific styling (likely white/light bg) */}
            <Link
              to="/quran"
              className="btn bg-white text-ref-light-mid-bg dark:bg-gray-100 dark:text-ref-dark-mid-bg hover:bg-opacity-90 dark:hover:bg-opacity-90 border-transparent"
            >
              ابدأ بقراءة القرآن
            </Link>
            <Link
              to="/adhkar"
              className="btn bg-white/20 text-white border-white/50 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/30"
            >
              اقرأ الأذكار اليومية
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;

