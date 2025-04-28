import { useContext } from 'react';

import { ThemeContext } from '@/hooks/useTheme';

function useColors() {
  const { theme, context } = useContext(ThemeContext);

  return {
    textColor: {
      color: theme.colors[context].textColor,
    },
    backgroundColor: {
      background: theme.colors[context].background,
    },
    tableColor: {
      color: theme.colors[context].table.textColor,
    },
    tableBackground: {
      background: theme.colors[context].table.background,
    },
  };
}

export default useColors;
