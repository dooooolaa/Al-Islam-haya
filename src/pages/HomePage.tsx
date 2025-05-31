import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, BookText, Heart, AtSign, Calendar, Compass } from 'lucide-react';

const HomePage = () => {
  const sections = [
    {
      id: 'quran',
      title: 'القرآن الكريم',
      description: 'تصفح القرآن الكريم كاملاً مع تفسير الآيات والاستماع إلى التلاوات بأصوات مختلفة',
      icon: BookOpen,
      color: 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100',
      path: '/quran'
    },
    {
      id: 'hadith',
      title: 'الحديث الشريف',
      description: 'مجموعة من الأحاديث النبوية الصحيحة مصنفة حسب الأبواب الفقهية',
      icon: BookText,
      color: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100',
      path: '/hadith'
    },
    {
      id: 'adhkar',
      title: 'الأذكار',
      description: 'أذكار الصباح والمساء وأذكار بعد الصلاة وأذكار النوم وغيرها',
      icon: Heart,
      color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100',
      path: '/adhkar'
    },
    {
      id: 'dua',
      title: 'الأدعية',
      description: 'مجموعة من الأدعية المأثورة عن النبي صلى الله عليه وسلم',
      icon: AtSign,
      color: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100',
      path: '/dua'
    },
    {
      id: 'calendar',
      title: 'التقويم الهجري',
      description: 'التقويم الهجري مع المناسبات الإسلامية والأيام الفضيلة',
      icon: Calendar,
      color: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100',
      path: '/calendar'
    },
    {
      id: 'qibla',
      title: 'اتجاه القبلة',
      description: 'تحديد اتجاه القبلة بناءً على موقعك الحالي',
      icon: Compass,
      color: 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-100',
      path: '/qibla'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div>
      {/* Hero Section */}
      <motion.section 
        className="py-16 px-4 text-center bg-pattern-light dark:bg-pattern-dark transition-theme"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-title font-bold mb-6">
            <span className="text-light-accent dark:text-dark-accent">الإسلام حياة</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-700 dark:text-gray-300">
            موقع إسلامي شامل يجمع القرآن الكريم والأحاديث النبوية والأذكار والأدعية والمزيد
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/quran" 
              className="btn btn-primary"
            >
              <BookOpen className="inline-block ml-1" size={18} />
              تصفح القرآن الكريم
            </Link>
            <Link 
              to="/adhkar" 
              className="btn btn-outline"
            >
              <Heart className="inline-block ml-1" size={18} />
              الأذكار اليومية
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Main Sections */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-title font-bold mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            أقسام الموقع
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {sections.map((section) => (
              <motion.div key={section.id} variants={item}>
                <Link 
                  to={section.path}
                  className="block group h-full"
                >
                  <div className="card h-full flex flex-col group-hover:shadow-lg transition-all duration-300">
                    <div className={`p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6 ${section.color}`}>
                      <section.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-light-accent dark:group-hover:text-dark-accent transition-theme">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 flex-grow">
                      {section.description}
                    </p>
                    <div className="mt-4 text-light-accent dark:text-dark-accent font-medium">
                      تصفح القسم →
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-light-accent dark:bg-dark-accent text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-title font-bold mb-6">
            احرص على قراءة القرآن وذكر الله كل يوم
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            قال تعالى: ﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/quran" 
              className="bg-white text-light-accent dark:text-dark-accent hover:bg-gray-100 font-medium py-3 px-6 rounded-md transition-theme"
            >
              ابدأ بقراءة القرآن
            </Link>
            <Link 
              to="/adhkar" 
              className="bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-6 rounded-md transition-theme"
            >
              اقرأ الأذكار اليومية
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;