import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';
import { AlertOptions } from './alert.types';

const icons = {
  success: <CheckCircle className="w-12 h-12 text-green-500" />,
  error: <XCircle className="w-12 h-12 text-red-500" />,
  warning: <AlertCircle className="w-12 h-12 text-yellow-500" />,
  info: <Info className="w-12 h-12 text-blue-500" />,
};

export const AlertModal: React.FC<AlertOptions & { onClose: () => void }> = ({
  type = 'info',
  title,
  message,
  confirmText = 'OK',
  cancelText,
  onConfirm,
  onCancel,
  onClose,
  timer,
}) => {
  useEffect(() => {
    if (timer) {
      const timeout = setTimeout(onClose, timer);
      return () => clearTimeout(timeout);
    }
  }, [timer, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              {icons[type]}
            </div>
            
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
            )}
            
            {message && (
              <p className="text-gray-600 mb-6">
                {message}
              </p>
            )}
            
            <div className="flex gap-3">
              {(onCancel || cancelText) && (
                <button
                  onClick={() => {
                    onCancel?.();
                    onClose();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {cancelText || 'Cancel'}
                </button>
              )}
              
              <button
                onClick={() => {
                  onConfirm?.();
                  onClose();
                }}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
