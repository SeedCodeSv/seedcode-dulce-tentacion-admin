import { Button, Card, CardHeader } from '@heroui/react';
import { useContext, useEffect } from 'react';
import { Check, Pencil } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

import { ThemeContext } from '@/hooks/useTheme';
import { useThemeStore } from '@/store/theme.store';
import { Colors, ThemeData } from '@/types/themes.types';
import { IConfiguration } from '@/types/configuration.types';
import { get_token } from '@/storage/localStorage';
import { useConfigurationStore } from '@/store/perzonalitation.store';
import ButtonUi from '@/themes/ui/button-ui';
import { useTransmitterStore } from '@/store/transmitter.store';

interface Props {
  personalization: IConfiguration[];
}

const ThemesList = (props: Props) => {
  const { getPaginatedThemes, themes } = useThemeStore();
  const { context, toggleTheme } = useContext(ThemeContext);
  const { GetConfigurationByTransmitter } = useConfigurationStore();
  const { transmitter, gettransmitter } = useTransmitterStore();

  useEffect(() => {
    gettransmitter();
    getPaginatedThemes(1, 30);
  }, []);

  const updatePersonalization = (theme: ThemeData) => {
    axios
      .patch(
        `${import.meta.env.VITE_API_URL}/personalization/change-theme/${transmitter.id ?? 0}/${theme.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${get_token()}`,
          },
        }
      )
      .then(() => {
        GetConfigurationByTransmitter(transmitter.id ?? 0);
        toggleTheme(theme.theme);
      })
      .catch(() => {
        toast.error('Error al seleccionar el tema');
      });
  };

  const navigate = useNavigate();

  const handleSelectTheme = (theme: ThemeData) => {
    navigate(`/add-theme/${theme.id}`);
  };

  return (
    <>
      <div className="w-full">
        <p className="px-4 font-semibold text-xl">Temas disponibles</p>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {themes.map((theme) => (
            <Card
              key={theme.id}
              isBlurred
              isPressable
              className="space-y-4 border dark:border-gray-600"
              style={{
                background: theme.theme.colors[context].background,
                color: theme.theme.colors[context].textColor,
                padding: '1rem',
              }}
              onPress={() => updatePersonalization(theme)}
            >
              <CardHeader className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{theme.theme.name}</h3>
                <div className="flex gap-3 items-center">
                  {props.personalization.length > 0 &&
                    props.personalization[0].themeId === theme.id && (
                      <Check className="text-success" size={25} />
                    )}
                  <ButtonUi
                    isIconOnly
                    theme={Colors.Error}
                    onPress={() => handleSelectTheme(theme)}
                  >
                    <Pencil />
                  </ButtonUi>
                </div>
              </CardHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-medium">Menu</div>
                  <div
                    className="h-10 flex items-center px-3"
                    style={{
                      background: theme.theme.colors[context].menu.background,
                      color: theme.theme.colors[context].menu.textColor,
                    }}
                  >
                    Menu Item
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Table</div>
                  <div
                    className="h-10 flex items-center px-3"
                    style={{
                      background: theme.theme.colors[context].table.background,
                      color: theme.theme.colors[context].table.textColor,
                    }}
                  >
                    Table Cell
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Buttons</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(theme.theme.colors[context].buttons.colors).map(
                    ([key, color]) => (
                      <Button
                        key={key}
                        className="font-semibold"
                        style={{
                          background: color as string,
                          color:
                            key === 'default'
                              ? theme.theme.colors[context].buttons.textDefaultColor
                              : theme.theme.colors[context].buttons.textColor,
                        }}
                      >
                        {key}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default ThemesList;
