import { Select, SelectItem, Input } from "@heroui/react";
import { ColorPicker } from 'primereact/colorpicker';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

import { useThemeStore } from '../../store/theme.store';
import { defaultTheme } from '../../utils/constants';

import Layout from '@/layout/Layout';
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import DivGlobal from "@/themes/ui/div-global";

function CreateTheme() {
  const [color, setColor] = useState(defaultTheme);
  const { getPaginatedThemes } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    getPaginatedThemes(1);
  }, []);

  const handleSave = () => {
    if (color.context) {
     
    }
  };

  return (
    <>
      <Layout title="Agregar tema">
        <>
          <DivGlobal className="flex flex-col h-full overflow-y-auto ">
              <button className="flex cursor-pointer" onClick={() => navigate('/configuration')}>
                <ArrowLeft className="mr-2 dark:text-white" />
                <p className="text-lg font-semibold dark:text-white"> Regresar </p>
              </button>
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
                    className="w-64"
                    label="Nombre"
                    labelPlacement="outside"
                    placeholder="Ingrese un nombre"
                    variant="bordered"
                    onChange={(e) => {
                      setColor({ ...color, name: e.target.value });
                    }}
                  />
                  <Select
                    className="w-64"
                    label="Tema"
                    labelPlacement="outside"
                    placeholder="Seleccione un tema"
                    value={color.context}
                    variant="bordered"
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
                {/* <Table theme={color} /> */}
              </div>
              <div className="mt-5">
                <ButtonUi
                  className="w-full text-sm font-semibold"
                  theme={Colors.Primary}
                  onPress={handleSave}
                >
                  Guardar
                </ButtonUi>
              </div>
          </DivGlobal>
        </>
      </Layout>
    </>
  );
}

export default CreateTheme;
