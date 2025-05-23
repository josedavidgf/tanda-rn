import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info' | 'warning';

const iconMap: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
};

export function useToast() {
  const showToast = (message: string, type: ToastType = 'success') => {
    Toast.show({
      type: 'custom',
      position: 'bottom',
      text1: `${iconMap[type]}  ${message}`,
      visibilityTime: 2500,
    });
  };

  return {
    showSuccess: (msg: string) => showToast(msg, 'success'),
    showError: (msg: string) => showToast(msg, 'error'),
    showInfo: (msg: string) => showToast(msg, 'info'),
    showWarning: (msg: string) => showToast(msg, 'warning'),
  };
}
