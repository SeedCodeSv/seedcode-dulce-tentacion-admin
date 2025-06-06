import {
  Button,
  useDisclosure,
  Card,
  CardBody,
  Input,
  Modal,
  ModalContent,
  ModalBody,
} from '@heroui/react';
import { Fragment, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { ColorPicker, useColor } from 'react-color-palette';
import axios from 'axios';
import { toast } from 'sonner';

import 'react-color-palette/css';
import HeadlessModal from '../global/HeadlessModal';

import { IPropsColorPicker } from './types/color.types';
import { ColorInput } from './color-input';
import { formatNameColor } from './utils';

import { Colors, Context, ITheme, ThemeData } from '@/types/themes.types';
import defaultTheme from '@/themes/default-theme.json';
import { API_URL } from '@/utils/constants';
import { useConfigurationStore } from '@/store/perzonalitation.store';
import { ThemeContext } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/auth.store';
import DivGlobal from '@/themes/ui/div-global';
import ButtonUi from '@/themes/ui/button-ui';

interface Props {
  theme: ThemeData | undefined;
}

function CreateTheme(props: Props) {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState(props.theme?.theme ?? defaultTheme);
  const [selectedMode, setSelectedMode] = useState<'light' | 'dark'>('light');
  const { user } = useAuthStore();

  const updateTheme = <K extends keyof Context>(path: K[], value: string) => {
    setCurrentTheme((prev) => {
      const newTheme = { ...prev };
      let current: Context = newTheme.colors[selectedMode];
      const lastKey = path[path.length - 1] as K;

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i] as keyof Context] as Context;
      }

      (current[lastKey as keyof Context] as Context[K]) = value as Context[K];

      return newTheme;
    });
  };

  const navigation = useNavigate();

  const [isShowPreview, setIsShowPreview] = useState(false);

  useEffect(() => {
    if (props.theme) {
      setCurrentTheme(props.theme.theme);
    }
  }, [props]);
  const { GetConfigurationByTransmitter, personalization } = useConfigurationStore();
  const { toggleTheme } = useContext(ThemeContext);
  const handleSaveOrUpdateTheme = () => {
    if (currentTheme.name === '') {
      toast.error('El nombre del tema no puede estar vació');

      return;
    }

    if (props.theme) {
      axios
        .patch(API_URL + '/theme/' + props.theme.id, {
          theme: currentTheme,
          transmitterId: user?.transmitterId,
        })
        .then(() => {
          toast.success('Tema actualizado');
          GetConfigurationByTransmitter(Number(user?.transmitterId));

          if (personalization.length > 0 && personalization[0].themeId === props.theme?.id) {
            toggleTheme(currentTheme as ITheme);
          }

          navigation('/configuration');
        });
    } else {
      axios
        .post(API_URL + '/theme', { theme: currentTheme, transmitterId: user?.transmitterId })
        .then(() => {
          toast.success('Tema creado');
          GetConfigurationByTransmitter(Number(user?.transmitterId));
          navigation('/configuration');
        });
    }
  };

  return (
    <DivGlobal>
      <div className="pb-10">
        <div className="flex justify-between">
          <div
            className="flex cursor-pointer w-24"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/configuration')}
            onKeyDown={() => navigate('/configuration')}
          >
            <ArrowLeft className="mr-2 dark:text-white" />
            <p className="text-lg font-semibold dark:text-white"> Regresar </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`p-2 rounded-lg ${selectedMode === 'light' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
              onClick={() => setSelectedMode('light')}
            >
              <Sun size={20} />
            </button>
            <button
              className={`p-2 rounded-lg ${selectedMode === 'dark' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
              onClick={() => setSelectedMode('dark')}
            >
              <Moon size={20} />
            </button>
          </div>
        </div>
        <Card className="space-y-4 mt-3 dark:bg-background/30 dark:border dark:border-gray-600 shadow">
          <CardBody>
            <h2 className="text-lg font-semibold">General</h2>
            <div className="mt-4">
              <Input
                classNames={{ label: 'font-semibold' }}
                label="Nombre"
                labelPlacement="outside"
                value={currentTheme.name}
                variant="bordered"
                onChange={({ currentTarget }) =>
                  setCurrentTheme((prev) => ({ ...prev, name: currentTarget.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-5 mt-4">
              <ColorInput
                label="Color de fondo"
                value={currentTheme.colors[selectedMode].background}
                onChange={(value) => updateTheme(['background'], value)}
              />
              <ColorInput
                label="Color del texto"
                value={currentTheme.colors[selectedMode].textColor}
                onChange={(value) => updateTheme(['textColor'], value)}
              />
            </div>
          </CardBody>
        </Card>
        <Card className="space-y-4 mt-3 dark:bg-background/30 dark:border dark:border-gray-600 shadow">
          <CardBody>
            <h2 className="text-lg font-semibold">Menu</h2>
            <div className="grid grid-cols-2 gap-5 mt-4">
              <ColorInput
                label="Color del menu"
                value={currentTheme.colors[selectedMode].menu.background}
                onChange={(value) => updateTheme(['menu', 'background'], value)}
              />
              <ColorInput
                label="Color del texto del menu"
                value={currentTheme.colors[selectedMode].menu.textColor}
                onChange={(value) => updateTheme(['menu', 'textColor'], value)}
              />
            </div>
          </CardBody>
        </Card>

        <Card className="space-y-4 mt-3 dark:bg-background/30 dark:border dark:border-gray-600 shadow">
          <CardBody>
            <h2 className="text-lg font-semibold">Tablas</h2>
            <div className="grid grid-cols-2 gap-5 mt-4">
              <ColorInput
                label="Color de fondo del encabezado"
                value={currentTheme.colors[selectedMode].table.background}
                onChange={(value) => updateTheme(['table', 'background'], value)}
              />
              <ColorInput
                label="Color del texto"
                value={currentTheme.colors[selectedMode].table.textColor}
                onChange={(value) => updateTheme(['table', 'textColor'], value)}
              />
            </div>
          </CardBody>
        </Card>
        <Card className="space-y-4 mt-3 dark:bg-background/30 dark:border dark:border-gray-600 shadow">
          <CardBody>
            <h2 className="text-lg font-semibold">Botones</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {Object.entries(currentTheme.colors[selectedMode].buttons.colors).map(
                ([key, value]) => (
                  <ColorInput
                    key={key}
                    label={`Botton ${formatNameColor(key)}`}
                    value={value}
                    onChange={(newValue) =>
                      updateTheme(
                        ['buttons', 'colors', key] as unknown as (keyof Context)[],
                        newValue
                      )
                    }
                  />
                )
              )}
            </div>
            <div>
              <p className="text-lg font-semibold my-3">Texto de botones</p>
              <div className="grid grid-cols-2 gap-5">
                <ColorInput
                  label="Color del texto de botones"
                  value={currentTheme.colors[selectedMode].buttons.textColor}
                  onChange={(value) => updateTheme(['buttons', 'textColor'], value)}
                />
                <ColorInput
                  label="Color del texto de botones por defecto"
                  value={currentTheme.colors[selectedMode].buttons.textDefaultColor}
                  onChange={(value) =>
                    updateTheme(
                      ['buttons', 'textDefaultColor'] as unknown as (keyof Context)[],
                      value
                    )
                  }
                />
              </div>
            </div>
          </CardBody>
        </Card>
        <div className="mt-4 flex justify-end gap-5">
          <ButtonUi
            className="px-10 font-semibold"
            theme={Colors.Info}
            onPress={() => setIsShowPreview(true)}
          >
            Mostrar Previsualización
          </ButtonUi>
          <ButtonUi
            className="px-10 font-semibold"
            theme={Colors.Primary}
            onPress={handleSaveOrUpdateTheme}
          >
            Guardar
          </ButtonUi>
        </div>
      </div>
      <Modal isOpen={isShowPreview} size="full" onClose={() => setIsShowPreview(false)}>
        <ModalContent>
          <ModalBody>
            <div className="w-full flex rounded-xl h-full bg-white">
              <div
                className="w-96 h-full"
                style={{
                  background: currentTheme.colors[selectedMode].menu.background,
                }}
              >
                <ul className="p-5 pl-10">
                  <li
                    className="h-10 text-xl"
                    style={{
                      color: currentTheme.colors[selectedMode].menu.textColor,
                    }}
                  >
                    Opción 1
                  </li>
                  <li
                    className="h-10 text-xl"
                    style={{
                      color: currentTheme.colors[selectedMode].menu.textColor,
                    }}
                  >
                    Opción 2
                  </li>
                  <li
                    className="h-10 text-xl"
                    style={{
                      color: currentTheme.colors[selectedMode].menu.textColor,
                    }}
                  >
                    Opción 3
                  </li>
                  <li
                    className="h-10 text-xl"
                    style={{
                      color: currentTheme.colors[selectedMode].menu.textColor,
                    }}
                  >
                    Opción 4
                  </li>
                  <li
                    className="h-10 text-xl"
                    style={{
                      color: currentTheme.colors[selectedMode].menu.textColor,
                    }}
                  >
                    Opción 5
                  </li>
                  <li
                    className="h-10 text-xl"
                    style={{
                      color: currentTheme.colors[selectedMode].menu.textColor,
                    }}
                  >
                    Opción 6
                  </li>
                  <li
                    className="h-10 text-xl"
                    style={{
                      color: currentTheme.colors[selectedMode].menu.textColor,
                    }}
                  >
                    Opción 7
                  </li>
                  <li
                    className="h-10 text-xl"
                    style={{
                      color: currentTheme.colors[selectedMode].menu.textColor,
                    }}
                  >
                    Opción 8
                  </li>
                </ul>
              </div>
              <div
                className="w-full h-full flex flex-col"
                style={{ background: currentTheme.colors[selectedMode].background }}
              >
                <div className="flex justify-between p-5">
                  <h1
                    className="text-3xl font-bold"
                    style={{ color: currentTheme.colors[selectedMode].textColor }}
                  >
                    Titulo
                  </h1>
                  <div className="flex items-center gap-2">
                    <button
                      className={`p-2 rounded-lg ${selectedMode === 'light' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                      onClick={() => setSelectedMode('light')}
                    >
                      <Sun size={20} />
                    </button>
                    <button
                      className={`p-2 rounded-lg ${selectedMode === 'dark' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                      onClick={() => setSelectedMode('dark')}
                    >
                      <Moon size={20} />
                    </button>
                  </div>
                </div>
                <div className="w-full p-5">
                  <h1 className="text-lg font-semibold">Ejemplo de tabla</h1>
                  <table className="w-full mt-2">
                    <thead>
                      <tr>
                        <td
                          className="p-3"
                          style={{
                            backgroundColor: currentTheme.colors[selectedMode].table.background,
                            color: currentTheme.colors[selectedMode].table.textColor,
                          }}
                        >
                          Celda 1
                        </td>
                        <td
                          className="p-3"
                          style={{
                            backgroundColor: currentTheme.colors[selectedMode].table.background,
                            color: currentTheme.colors[selectedMode].table.textColor,
                          }}
                        >
                          Celda 2
                        </td>
                        <td
                          className="p-3"
                          style={{
                            backgroundColor: currentTheme.colors[selectedMode].table.background,
                            color: currentTheme.colors[selectedMode].table.textColor,
                          }}
                        >
                          Celda 3
                        </td>
                        <td
                          className="p-3"
                          style={{
                            backgroundColor: currentTheme.colors[selectedMode].table.background,
                            color: currentTheme.colors[selectedMode].table.textColor,
                          }}
                        >
                          Celda 4
                        </td>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div className="w-full p-5">
                  <h1 className="text-lg font-semibold">Ejemplo de botones</h1>
                  <div className="grid grid-cols-4 gap-5">
                    {Object.entries(currentTheme.colors[selectedMode].buttons.colors).map(
                      ([key, value]) => (
                        <Fragment key={key}>
                          {key === 'default' ? (
                            <>
                              <Button
                                key={key}
                                style={{
                                  backgroundColor: value,
                                  color: currentTheme.colors[selectedMode].buttons.textDefaultColor,
                                }}
                              >
                                {key}
                              </Button>
                            </>
                          ) : (
                            <Button
                              key={key}
                              style={{
                                backgroundColor: value,
                                color: currentTheme.colors[selectedMode].buttons.textColor,
                              }}
                            >
                              {key}
                            </Button>
                          )}
                        </Fragment>
                      )
                    )}
                  </div>
                </div>
                <div className="h-full w-full flex p-5 justify-end items-end">
                  <ButtonUi
                    className="px-10"
                    theme={Colors.Success}
                    onPress={() => setIsShowPreview(false)}
                  >
                    Aceptar
                  </ButtonUi>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </DivGlobal>
  );
}

export default CreateTheme;

export const ColorForm = (props: IPropsColorPicker) => {
  const [color, setColor] = useColor(props.colors);
  const showModalColors = useDisclosure();

  const handleColor = () => {
    props.setColor(color.hex);
    showModalColors.onClose();
  };

  return (
    <>
      <HeadlessModal
        isOpen={showModalColors.isOpen}
        size="p-5"
        title="Primary"
        onClose={showModalColors.onClose}
      >
        <div className="w-96">
          <ColorPicker
            hideAlpha
            color={color}
            height={100}
            hideInput={['hsv', 'rgb']}
            onChange={setColor}
          />
        </div>
        <Button className="w-full  mt-4" onClick={handleColor}>
          Aplicar
        </Button>
      </HeadlessModal>
      <div
        className="h-40 w-full hover:scale-x-150 transition-all duration-75 cursor-pointer"
        role="button"
        style={{ background: props.colors }}
        tabIndex={0}
        onClick={showModalColors.onOpen}
        onKeyDown={showModalColors.onOpen}
      />
    </>
  );
};
