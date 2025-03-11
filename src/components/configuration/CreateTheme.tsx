import { Select, SelectItem, Input } from "@heroui/react";
import { ColorPicker } from 'primereact/colorpicker';
import { useEffect, useState } from 'react';
import { useThemeStore } from '../../store/theme.store';
import { defaultTheme } from '../../utils/constants';
import Layout from '@/layout/Layout';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import Table from '../Table';
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";

function CreateTheme() {
  const [color, setColor] = useState(defaultTheme);
  const { getPaginatedThemes } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    getPaginatedThemes(1);
  }, []);

  const handleSave = () => {
    if (color.context) {
      // const payload: ThemePayload = {
      //   name: color.name,
      //   context: color.context as 'light' | 'dark',
      //   colors: [
      //     {
      //       name: 'danger',
      //       color: color.colors.danger,
      //     },
      //     {
      //       name: 'dark',
      //       color: color.colors.dark,
      //     },
      //     {
      //       name: 'primary',
      //       color: color.colors.primary,
      //     },
      //     {
      //       name: 'secondary',
      //       color: color.colors.secondary,
      //     },
      //     {
      //       name: 'third',
      //       color: color.colors.third,
      //     },
      //     {
      //       name: 'warning',
      //       color: color.colors.warning,
      //     },
      //   ],
      // };

      // save_theme(payload)
      //   .then(() => {
      //     toast.success('Se guardo el tema');
      //     location.href = '/configuration';
      //   })
      //   .catch(() => {
      //     toast.error('Error al guardar el tema');
      //   });
    }
  };

  return (
    <>
      <Layout title="Agregar tema">
        <>
          <div className=" w-full h-full p-5 bg-gray-50 dark:bg-gray-900">
            <div className="w-full h-full border-white border p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
              <div className="flex cursor-pointer" onClick={() => navigate('/configuration')}>
                <ArrowLeft className="mr-2 dark:text-white" />
                <p className="text-lg font-semibold dark:text-white"> Regresar </p>
              </div>
              <div className="flex items-center justify-center">
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

                <div className="flex flex-col gap-5 mt-5 justify-center items-center ml-5">
                  <Input
                    label="Nombre"
                    variant="bordered"
                    className="w-64"
                    labelPlacement="outside"
                    placeholder="Ingrese un nombre"
                    //   value={color.name}
                    onChange={(e) => {
                      setColor({ ...color, name: e.target.value });
                    }}
                  />
                  <Select
                    label="Tema"
                    placeholder="Seleccione un tema"
                    labelPlacement="outside"
                    variant="bordered"
                    className="w-64"
                    value={color.context}
                    onChange={(e) => {
                      setColor({ ...color, context: e.target.value });
                    }}
                  >
                    <SelectItem  key={'light'} className="dark:text-white">
                      Claro
                    </SelectItem>
                    <SelectItem  key={'dark'} className="dark:text-white">
                      Oscuro
                    </SelectItem>
                  </Select>
                </div>
              </div>
              <div className="mt-5">
                {/* <Button theme={color as Theme} /> */}
                <Table theme={color} />
              </div>
              <div className="mt-5">
                <ButtonUi
                  className="w-full text-sm font-semibold"
                  onPress={handleSave}
                  theme={Colors.Primary}
                >
                  Guardar
                </ButtonUi>
              </div>
            </div>
          </div>
        </>
      </Layout>
    </>
  );
}

export default CreateTheme;
