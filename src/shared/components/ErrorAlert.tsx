import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  title?: string;
  message: string;
  details?: string[];
  onClose?: () => void;
}

export default function ErrorAlert({ title = 'Error', message, details, onClose }: ErrorAlertProps) {
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 mb-1">
            {title}
          </h3>
          <p className="text-sm text-red-700">
            {message}
          </p>
          
          {details && details.length > 0 && (
            <ul className="mt-2 space-y-1">
              {details.map((detail, index) => (
                <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
