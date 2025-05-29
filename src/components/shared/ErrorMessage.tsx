import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  retry?: () => void;
}

const ErrorMessage = ({ 
  message = 'حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.',
  retry 
}: ErrorMessageProps) => {
  return (
    <div className="rounded-md bg-[var(--color-error-bg)] dark:bg-[var(--color-dark-error-bg)] p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-[var(--color-error-icon)] dark:text-[var(--color-dark-error-icon)]" />
        </div>
        <div className="mr-3">
          <p className="text-sm font-medium text-[var(--color-error-text)] dark:text-[var(--color-dark-error-text)]">
            {message}
          </p>
        </div>
      </div>
      {retry && (
        <div className="mt-3">
          <button
            onClick={retry}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-[var(--color-error-button-text)] dark:text-[var(--color-dark-error-button-text)] bg-[var(--color-error-button-bg)] dark:bg-[var(--color-dark-error-button-bg)] hover:bg-[var(--color-error-button-hover-bg)] dark:hover:bg-[var(--color-dark-error-button-hover-bg)] transition-theme"
          >
            <RefreshCw className="ml-1.5 h-4 w-4" />
            إعادة المحاولة
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;