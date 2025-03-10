import { ThemeContext } from '@/hooks/useTheme';
import { Colors } from '@/types/themes.types';
import { useContext } from 'react';
import DefaultTheme from './default-theme.json';

function useThemeColors({ name }: { name: Colors }) {
  const { theme, context } = useContext(ThemeContext);

  if (theme.colors) {
    if (name === Colors.Default)
      return {
        backgroundColor: theme.colors[context].buttons.colors.default,
        color: theme.colors[context].buttons.textDefaultColor,
      };
    return {
      backgroundColor: theme.colors[context].buttons.colors[name],
      color: theme.colors[context].buttons.textColor,
    };
  }

  if (name === Colors.Default)
    return {
      backgroundColor: DefaultTheme.colors[context].buttons.colors.default,
      color: DefaultTheme.colors[context].buttons.textDefaultColor,
    };
  return {
    backgroundColor: DefaultTheme.colors[context].buttons.colors[name],
    color: DefaultTheme.colors[context].buttons.textColor,
  };
}

export default useThemeColors;
