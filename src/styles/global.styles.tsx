import { useContext } from "react";
import { ThemeContext } from "../hooks/useTheme";

export const global_styles = () => {
  const { theme } = useContext(ThemeContext);

  return {
    darkStyle: {
      backgroundColor: theme.colors.dark,
      color: theme.colors.primary,
    },
    secondaryStyle: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.primary,
    },
    thirdStyle: {
      backgroundColor: theme.colors.third,
      color: theme.colors.primary,
    },
    dangerStyles: {
      backgroundColor: theme.colors.danger,
      color: theme.colors.primary,
    },
  };
};
