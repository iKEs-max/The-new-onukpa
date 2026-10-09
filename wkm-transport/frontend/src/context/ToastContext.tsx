import React, { createContext, useContext, ReactNode } from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastContextType {
  success: (msg: string, options?: ToastOptions) => void;
  error: (msg: string, options?: ToastOptions) => void;
  info: (msg: string, options?: ToastOptions) => void;
  warn: (msg: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  const showSuccess = (msg: string, options?: ToastOptions) => toast.success(msg, options);
  const showError = (msg: string, options?: ToastOptions) => toast.error(msg, options);
  const showInfo = (msg: string, options?: ToastOptions) => toast.info(msg, options);
  const showWarn = (msg: string, options?: ToastOptions) => toast.warn(msg, options);

  const value = {
    success: showSuccess,
    error: showError,
    info: showInfo,
    warn: showWarn
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
