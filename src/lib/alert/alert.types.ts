export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertOptions {
  type?: AlertType;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  timer?: number;
  key?: string
  isAutoClose?: boolean;
}

/* eslint-disable no-unused-vars */
export interface AlertContextType {
  show: (options: AlertOptions) => void;
  close: () => void;
}