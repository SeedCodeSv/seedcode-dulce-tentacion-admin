/* eslint-disable react-hooks/rules-of-hooks*/

import { useContext } from 'react';
import { ThemeContext } from '../hooks/useTheme';

export const global_styles = () => {
  const { theme,context } = useContext(ThemeContext);

  return {
    darkStyle: {
      backgroundColor: theme.colors[context].background,
      color: theme.colors[context].textColor,
    },
    secondaryStyle: {
      backgroundColor: theme.colors[context].buttons.colors.secondary,
      color: theme.colors[context].textColor,
    },
    thirdStyle: {
      backgroundColor: theme.colors[context].buttons.colors.info,
      color: theme.colors[context].textColor,
    },
    dangerStyles: {
      backgroundColor: theme.colors[context].buttons.colors.error,
      color: theme.colors[context].textColor,
    },
    warningStyles: {
      backgroundColor: theme.colors[context].buttons.colors.warning,
      color: theme.colors[context].textColor,
    },
  };
};
