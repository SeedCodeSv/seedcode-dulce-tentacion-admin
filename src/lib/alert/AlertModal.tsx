import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
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
  isAutoClose = true,
  buttonOptions,
  content
}) => {
  useEffect(() => {
    if (isAutoClose && timer) {
      const timeout = setTimeout(onClose, timer);

      return () => clearTimeout(timeout);
    }
  }, [timer, onClose, isAutoClose]);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[99999999999] flex items-center justify-center p-4 bg-black/50"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
    >
      <motion.div
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[20px] shadow-xl w-full max-w-md transform transition-all"
        exit={{ scale: 0.9, opacity: 0 }}
        initial={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.1 }}
      >
        <div className="relative p-6">
          <button
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4">{icons[type]}</div>

            {title && <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>}

            {message && <p className="text-gray-600 mb-6">{message}</p>}

            {content && content}

            <div className="flex gap-3">
              {(onCancel || cancelText) && (
                <button
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    onCancel?.();
                    onClose();
                  }}
                >
                  {cancelText || 'Cancel'}
                </button>
              )}

              {buttonOptions ? (
                buttonOptions
              ) : (
                <button
                  className="px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                  onClick={() => {
                    onConfirm?.();
                    onClose();
                  }}
                >
                  {confirmText}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
