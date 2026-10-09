import { useUIStore } from '@/store/ui.store';

export const useToast = () => {
  const { addToast, removeToast, toasts } = useUIStore();

  const success = (message: string) => addToast({ type: 'success', message });
  const error = (message: string) => addToast({ type: 'error', message });
  const info = (message: string) => addToast({ type: 'info', message });
  const warning = (message: string) => addToast({ type: 'warning', message });

  return { success, error, info, warning, removeToast, toasts };
};
