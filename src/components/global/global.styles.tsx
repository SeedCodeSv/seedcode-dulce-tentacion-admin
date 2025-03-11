import { ThemeContext } from '@/hooks/useTheme';
import { useContext } from 'react';

const useGlobalStyles = () => {
  const { theme, context } = useContext(ThemeContext);
  return {
    darkStyle: {
      backgroundColor: theme.colors[context].buttons.colors.primary,
      color: theme.colors[context].buttons.textColor,
    },
    secondaryStyle: {
      backgroundColor: theme.colors[context].buttons.colors.secondary,
      color: theme.colors[context].buttons.textColor,
    },
    thirdStyle: {
      backgroundColor: theme.colors[context].buttons.colors.info,
      color: theme.colors[context].buttons.textColor,
    },
    dangerStyles: {
      backgroundColor: theme.colors[context].buttons.colors.error,
      color: theme.colors[context].buttons.textColor,
    },
    warningStyles: {
      backgroundColor: theme.colors[context].buttons.colors.warning,
      color: theme.colors[context].buttons.textColor,
    },
  };
};

export default useGlobalStyles;
