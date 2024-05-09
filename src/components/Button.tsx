import { useContext } from "react";
import { Theme, ThemeContext } from "../hooks/useTheme";
import * as NextUI from "@nextui-org/react";

interface Props {
  theme: Theme;
}

function Button({ theme }: Props) {
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
        Danger
      </NextUI.Button>
      <NextUI.Button
        color="primary"
        style={{
          backgroundColor: theme.colors.dark,
          color: theme.colors.primary,
        }}
        className="font-semibold"
      >
        Dark
      </NextUI.Button>
      <NextUI.Button
        color="primary"
        style={{
          backgroundColor: theme.colors.secondary,
          color: theme.colors.primary,
        }}
        className="font-semibold"
      >
        Secondary
      </NextUI.Button>
      <NextUI.Button
        color="primary"
        style={{
          backgroundColor: theme.colors.third,
          color: theme.colors.primary,
        }}
        className="font-semibold"
      >
        Third
      </NextUI.Button>

      <NextUI.Button
        color="primary"
        style={{
          backgroundColor: theme.colors.warning,
          color: theme.colors.primary,
        }}
        className="font-semibold"
      >
        Warning
      </NextUI.Button>
    </>
  );
}

export default Button;
