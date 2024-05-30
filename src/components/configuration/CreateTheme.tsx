import { Select, SelectItem, Button as NButton, Input } from '@nextui-org/react';
import { ColorPicker } from 'primereact/colorpicker';
import { useContext, useEffect, useState } from 'react';
import { useThemeStore } from '../../store/theme.store';
import { ThemePayload } from '../../types/themes.types';
import { save_theme } from '../../services/theme.service';
import { toast } from 'sonner';
import { defaultTheme } from '../../utils/constants';
import { Theme, ThemeContext } from '../../hooks/useTheme';
import Button from '../Button';

function CreateTheme() {
  const [color, setColor] = useState(defaultTheme);
  const { getPaginatedThemes } = useThemeStore();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    getPaginatedThemes(1);
  }, []);

  const handleSave = () => {
    if (color.context) {
      const payload: ThemePayload = {
        name: color.name,
        context: color.context as 'light' | 'dark',
        colors: [
          {
            name: 'danger',
            color: color.colors.danger,
          },
          {
            name: 'dark',
            color: color.colors.dark,
          },
          {
            name: 'primary',
            color: color.colors.primary,
          },
          {
            name: 'secondary',
            color: color.colors.secondary,
          },
          {
            name: 'third',
            color: color.colors.third,
          },
          {
            name: 'warning',
            color: color.colors.warning,
          },
        ],
      };

      save_theme(payload)
        .then(() => {
          toast.success('Se guardo el tema');
          location.reload();
        })
        .catch(() => {
          toast.error('Error al guardar el tema');
        });
    }
  };

  return (
    <>
      <div className="ml-2">
        <div className="lg:ml-28 md:ml-60">
          <ColorPicker
            format="hex"
            pt={{
              input: () => {
                return {
                  className: '!h-44 !w-12',
                };
              },
            }}
            value={color.colors.danger}
            onChange={(e) => {
              setColor({
                ...color,
                colors: {
                  ...color.colors,
                  danger: ('#' + e.value) as string,
                },
              });
            }}
          />
          <ColorPicker
            format="hex"
            pt={{
              input: () => {
                return {
                  className: '!h-44 !w-12',
                };
              },
            }}
            value={color.colors.dark}
            onChange={(e) => {
              setColor({
                ...color,
                colors: {
                  ...color.colors,
                  dark: ('#' + e.value) as string,
                },
              });
            }}
          />
          <ColorPicker
            format="hex"
            pt={{
              input: () => {
                return {
                  className: '!h-44 !w-12',
                };
              },
            }}
            value={color.colors.primary}
            onChange={(e) => {
              setColor({
                ...color,
                colors: {
                  ...color.colors,
                  primary: ('#' + e.value) as string,
                },
              });
            }}
          />
          <ColorPicker
            format="hex"
            pt={{
              input: () => {
                return {
                  className: '!h-44 !w-12',
                };
              },
            }}
            value={color.colors.secondary}
            onChange={(e) => {
              setColor({
                ...color,
                colors: {
                  ...color.colors,
                  secondary: ('#' + e.value) as string,
                },
              });
            }}
          />
          <ColorPicker
            format="hex"
            pt={{
              input: () => {
                return {
                  className: '!h-44 !w-12',
                };
              },
            }}
            value={color.colors.third}
            onChange={(e) => {
              setColor({
                ...color,
                colors: {
                  ...color.colors,
                  third: ('#' + e.value) as string,
                },
              });
            }}
          />
          <ColorPicker
            format="hex"
            pt={{
              input: () => {
                return {
                  className: '!h-44 !w-12',
                };
              },
            }}
            value={color.colors.warning}
            onChange={(e) => {
              setColor({
                ...color,
                colors: {
                  ...color.colors,
                  warning: ('#' + e.value) as string,
                },
              });
            }}
          />
        </div>
        <div className="flex gap-5 mt-5">
          <Input
            label="Nombre"
            variant="bordered"
            className="w-full"
            labelPlacement="outside"
            placeholder="Ingrese un nombre"
            //   value={color.name}
            onChange={(e) => {
              setColor({ ...color, name: e.target.value });
            }}
          />
        </div>
        <div className="flex gap-5 mt-5">
          <Select
            label="Tema"
            placeholder="Seleccione un tema"
            labelPlacement="outside"
            variant="bordered"
            className="w-full"
            value={color.context}
            onChange={(e) => {
              setColor({ ...color, context: e.target.value });
            }}
          >
            <SelectItem value={'light'} key={'light'} className='dark:text-white'>
              Claro
            </SelectItem>
            <SelectItem value={'dark'} key={'dark'} className='dark:text-white'>
              Oscuro
            </SelectItem>
          </Select>
        </div>
        <div className="flex gap-5 mt-5">
          <Button theme={color as Theme} />
        </div>
        <div className="mt-5">
          <NButton
            className="w-full text-sm font-semibold"
            onClick={handleSave}
            style={{
              backgroundColor: theme.colors.third,
              color: theme.colors.primary,
            }}
          >
            Guardar
          </NButton>
        </div>
      </div>
    </>
  );
}

export default CreateTheme;
