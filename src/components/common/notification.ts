import { toast, ToastPosition, Theme } from 'react-toastify';

const toastPosition: ToastPosition = 'top-center';
const toastTheme: Theme = 'dark';
const toastAutoCloseAfter = 1_800;

const defaultToastConfig = {
  position: toastPosition,
  theme: toastTheme,
  autoClose: toastAutoCloseAfter,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined  
};

export const info = (message: string): void => {
    toast.info(message, { ...defaultToastConfig });
};

export const success = (message: string): void => {
  toast.success(message, { ...defaultToastConfig });
};

export const error = (message: string): void => {
  toast.error(message, { ...defaultToastConfig, autoClose: false, hideProgressBar: true });
};
