import { Theme } from '../hooks/useTheme';
import * as NextUI from '@nextui-org/react';

interface Props {
  theme: Theme;
}

function Button({ theme }: Props) {
  return (
    <>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-5 lg:grid-cols-5 w-full">
        <div className="flex justify-center items-center p-1">
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
        </div>
        <div className="flex justify-center items-center p-1">
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
        </div>
        <div className="flex justify-center items-center p-1">
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
        </div>
        <div className="flex justify-center items-center p-1">
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
        </div>
        <div className="flex justify-center items-center p-1">
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
        </div>
      </div>
    </>
  );
}

export default Button;
