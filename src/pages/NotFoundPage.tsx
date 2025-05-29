import { Link } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="container-page min-h-[70vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-7xl font-bold mb-4 text-[var(--color-accent)] dark:text-[var(--color-dark-accent)]">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--color-heading)] dark:text-[var(--color-dark-heading)]">الصفحة غير موجودة</h2>
      <p className="text-[var(--color-text)] dark:text-[var(--color-dark-text)] max-w-md mb-8">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/" className="btn btn-primary flex items-center">
          <Home className="ml-2" size={18} />
          العودة للرئيسية
        </Link>
        <button 
          onClick={() => window.history.back()} 
          className="btn btn-outline flex items-center"
        >
          <ArrowRight className="ml-2" size={18} />
          الرجوع للخلف
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;