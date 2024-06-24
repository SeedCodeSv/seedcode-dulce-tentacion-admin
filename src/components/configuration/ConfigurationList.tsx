import { useContext, useEffect, useState } from 'react';
import { ButtonGroup, Card, useDisclosure } from '@nextui-org/react';
import { useThemeStore } from '../../store/theme.store';
import { Theme, ThemeContext } from '../../hooks/useTheme';
import { Check } from 'lucide-react';
import AddButton from '../global/AddButton';
import ModalGlobal from '../global/ModalGlobal';
import CreateConfiguration from './CreateConfiguration';
import CreateTheme from './CreateTheme';
import { useConfigurationStore } from '../../store/perzonalitation.store';
import { useAuthStore } from '../../store/auth.store';
import UpdateFile from './UpdateFile';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import UpdateConfigurationName from './UpdateConfigurationName';
import { Button } from '@nextui-org/react';
import { Image } from 'primereact/image';
import { Table as ITable, CreditCard, List } from 'lucide-react';
import MobileViewConfi from './MobileViewConfi';
import { IConfiguration } from '../../types/configuration.types';
import HeadlessModal from '../global/HeadlessModal';
import { update_theme } from '../../services/configuration.service';
import { toast } from 'sonner';

function ConfigurationList() {
  const [view, setView] = useState<'table' | 'grid' | 'list'>('table');
  const { getPaginatedThemes, themes } = useThemeStore();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [logoId, setLogoId] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('')

  const [selectedConfiguration, setSelectedConfiguration] = useState<IConfiguration>();

  const { personalization, GetConfigurationByTransmitter } = useConfigurationStore();
  const { user } = useAuthStore();

  const idConfig = personalization?.find((config) => config?.id)?.id || 0;
  const tramsiter = user?.employee?.branch?.transmitterId;

  useEffect(() => {
    GetConfigurationByTransmitter(tramsiter || 0);
    getPaginatedThemes(1);
  }, []);

  const reloadData = () => {
    GetConfigurationByTransmitter(tramsiter || 0);
  };

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const modalAdd = useDisclosure();
  const addLogo = useDisclosure();
  const UpdateImgModal = useDisclosure();
  const updateName = useDisclosure();

  const handleUpdate = (theme: Theme) => {
    toggleTheme(theme);
    update_theme(idConfig, theme.name)
    .then(() => {
      toast.success('Se actualizo el tema');
    })
    .catch(() => {
      toast.success('Tema seleccionado')
    })
  }

  return (
    <>
      <div className="p-4 dark:bg-gray-800">
        <div className="flex items-end justify-between gap-10 mt lg:justify-end mt-5 mr-5">
          <ButtonGroup>
            <Button
              isIconOnly
              color="secondary"
              style={{
                backgroundColor: view === 'table' ? theme.colors.third : '#e5e5e5',
                color: view === 'table' ? theme.colors.primary : '#3e3e3e',
              }}
              onClick={() => setView('table')}
            >
              <ITable />
            </Button>
            <Button
              isIconOnly
              color="default"
              style={{
                backgroundColor: view === 'grid' ? theme.colors.third : '#e5e5e5',
                color: view === 'grid' ? theme.colors.primary : '#3e3e3e',
              }}
              onClick={() => setView('grid')}
            >
              <CreditCard />
            </Button>
            <Button
              isIconOnly
              color="default"
              style={{
                backgroundColor: view === 'list' ? theme.colors.third : '#e5e5e5',
                color: view === 'list' ? theme.colors.primary : '#3e3e3e',
              }}
              onClick={() => setView('list')}
            >
              <List />
            </Button>
          </ButtonGroup>

          {personalization.length === 0 && <AddButton onClick={() => addLogo.onOpen()} />}
          {personalization.length > 0 &&
            personalization.map((item) => (
              <AddButton
                key={item.id}
                onClick={() => {
                  UpdateImgModal.onOpen();
                  setLogoId(item.id || 0);
                }}
              />
            ))}
        </div>

        <div className="flex justify-center p-5 bg-gray-50 dark:bg-gray-800">
          <div className="bg-gray-50 w-full dark:bg-gray-800 dark:text-white">
            {(view === 'grid' || view === 'list') && (
              <MobileViewConfi
                handleEdit={(config) => {
                  setSelectedConfiguration(config);
                  updateName.onOpen();
                }}
                layout={view as 'grid' | 'list'}
              />
            )}

            {view == 'table' && (
              <>
                {personalization.length === 0 ? (
                  <span>no ay datos de logo ni nombre...</span>
                ) : (
                  <DataTable
                    value={personalization}
                    className="shadow"
                    tableStyle={{ minWidth: '50rem' }}
                  >
                    <Column
                      field="logo"
                      header="Logo"
                      headerStyle={style}
                      body={(rowData) => (
                        <Image
                          preview
                          src={rowData.logo}
                          alt={rowData.name}
                          style={{ width: '100px' }}
                        />
                      )}
                    />
                    <Column field="name" header="Nombre" headerStyle={style} />
                    <Column
                      headerStyle={style}
                      header="Actualizar Nombre"
                      body={(rowData) => (
                        <Button
                          onClick={() => {
                            setSelectedConfiguration(rowData);
                            updateName.onOpen();
                          }}
                          style={style}
                        >
                          Actualizar
                        </Button>
                      )}
                    />
                  </DataTable>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 w-full">
        <div className="p-4 ">
          <div className="flex items-end justify-between gap-10 mt lg:justify-end mt-5 mr-5">
            <AddButton onClick={() => modalAdd.onOpen()} />
          </div>
          <div className="p-5 bg-gray-50 dark:bg-gray-800">
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {themes.map((themeS, index) => (
                <Card
                  key={index}
                  className="grid w-full grid-cols-6 border shadow"
                  isPressable
                  onClick={() => {handleUpdate(themeS),
                    setSelectedTheme(themeS.name)
                  }}
                  // onClick={() => toggleTheme(themeS as Theme)}
                >
                  {/* <h1>{themeS.name}</h1> */}
                  <div className="absolute top-5 right-5">
                    {themeS.name === theme.name && <Check size={30} color="#fff" />}
                  </div>
                  <span
                    className="w-full h-44"
                    style={{ backgroundColor: themeS.colors.danger }}
                  ></span>
                  <span
                    className="w-full h-44"
                    style={{ backgroundColor: themeS.colors.warning }}
                  ></span>
                  <span
                    className="w-full h-44"
                    style={{ backgroundColor: themeS.colors.primary }}
                  ></span>
                  <span
                    className="w-full h-44"
                    style={{ backgroundColor: themeS.colors.secondary }}
                  ></span>
                  <span
                    className="w-full h-44"
                    style={{ backgroundColor: themeS.colors.third }}
                  ></span>
                  <span
                    className="w-full h-44"
                    style={{ backgroundColor: themeS.colors.dark }}
                  ></span>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ModalGlobal
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
        title="Agregar tema"
        size="w-full lg:w-[600px]"
      >
        <CreateTheme />
      </ModalGlobal>

      <HeadlessModal
        isOpen={addLogo.isOpen}
        onClose={addLogo.onClose}
        title="Agregar logo y nombre"
        size="w-[350px] md:w-[500px]"
      >
        <CreateConfiguration theme={selectedTheme} />
      </HeadlessModal>

      <HeadlessModal
        isOpen={UpdateImgModal.isOpen}
        onClose={UpdateImgModal.onClose}
        title="Actualizar logo"
        size="w-[350px] md:w-[500px]"
      >
        <UpdateFile perzonalitationId={logoId} />
      </HeadlessModal>

      <HeadlessModal
        isOpen={updateName.isOpen}
        onClose={updateName.onClose}
        title="Actualizar nombre"
        size="w-[350px] md:w-[500px]"
      >
        <UpdateConfigurationName
          name={selectedConfiguration}
          reloadData={reloadData}
          onClose={updateName.onClose}
        />
      </HeadlessModal>
    </>
  );
}

export default ConfigurationList;
