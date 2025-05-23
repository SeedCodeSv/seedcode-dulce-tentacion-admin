import React, { createContext, useContext, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';

import { AlertOptions, AlertContextType } from './alert.types';
import { AlertModal } from './AlertModal';

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<AlertOptions | null>(null);

  const show = useCallback((options: AlertOptions) => {
    setAlert({ ...options, key: Date.now().toString() });
  }, []);

  const close = useCallback(() => {
    setAlert(null);
  }, []);

  return (
    <AlertContext.Provider value={{ show, close }}>
      {children}
      {alert &&
        ReactDOM.createPortal(
          <AlertModal {...alert} onClose={close} />,
          document.getElementById('alert-root')!
        )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }

  return context;
};
