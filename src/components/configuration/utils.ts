export const formatNameColor = (color: string) => {
  switch (color) {
    case 'primary':
      return 'Primario';
    case 'secondary':
      return 'Secundario';
    case 'error':
      return 'Error';
    case 'warning':
      return 'Alerta';
    case 'success':
      return 'Éxito';
    case 'info':
      return 'Información';
    case 'default':
      return 'Por defecto';
  }
};