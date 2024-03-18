import { useContext } from "react";
import { ThemeContext } from "../hooks/useTheme";
import * as NextUI from "@nextui-org/react";

function Button() {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <NextUI.Button
        color="primary"
        style={{
          backgroundColor: theme.colors.danger,
          color: theme.colors.primary,
        }}
        className="font-semibold"
      >
        Button
      </NextUI.Button>
      <NextUI.Button
        color="primary"
        style={{
          backgroundColor: theme.colors.secondary,
          color: theme.colors.primary,
        }}
        className="font-semibold"
      >
        Button 2
      </NextUI.Button>
      <NextUI.Button
        color="primary"
        style={{
          backgroundColor: theme.colors.third,
          color: theme.colors.primary,
        }}
        className="font-semibold"
      >
        Button 3
      </NextUI.Button>
      <NextUI.Button
        color="primary"
        style={{
          backgroundColor: theme.colors.dark,
          color: theme.colors.primary,
        }}
        className="font-semibold"
      >
        Button 4
      </NextUI.Button>
      <NextUI.Button
        color="primary"
        style={{
          backgroundColor: theme.colors.warning,
          color: theme.colors.primary,
        }}
        className="font-semibold"
      >
        Button 4
      </NextUI.Button>
    </>
  );
}

export default Button;
