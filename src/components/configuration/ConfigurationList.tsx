import { useContext, useEffect, useState } from 'react';
import { ButtonGroup, Card, useDisclosure } from '@nextui-org/react';
import { useThemeStore } from '../../store/theme.store';
import { Theme, ThemeContext } from '../../hooks/useTheme';
import { Check, Edit, Plus } from 'lucide-react';
import AddButton from '../global/AddButton';
import CreateConfiguration from './CreateConfiguration';
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
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { global_styles } from '@/styles/global.styles';

interface Props {
  actions: string[];
}

const ConfigurationList = ({ actions }: Props) => {
  const [view, setView] = useState<'table' | 'grid' | 'list'>('table');
  const { getPaginatedThemes, themes } = useThemeStore();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [logoId, setLogoId] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedConfiguration, setSelectedConfiguration] = useState<IConfiguration>();
  const { personalization, GetConfigurationByTransmitter } = useConfigurationStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const idConfig = personalization?.find((config) => config?.id)?.id || 0;
  const tramsiter =
    user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0;

  useEffect(() => {
    GetConfigurationByTransmitter(tramsiter || 0);
    getPaginatedThemes(1, 30);
  }, []);

  const reloadData = () => {
    GetConfigurationByTransmitter(tramsiter || 0);
  };

  // const modalAdd = useDisclosure();
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
        toast.success('Tema seleccionado');
      });
  };

  return (
    <>
      <div className=" w-full h-full p-5 bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="flex justify-evenly gap-10 mt-5 ml-5 ">
            <div className="flex gap-4 justify-between w-full">
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

              {actions.includes('Agregar') ? (
                <>
                  <Button
                    onClick={() => navigate('/add-theme')}
                    // onClick={() => modalAdd.onOpen()}
                    endContent={<Plus size={20} />}
                    style={global_styles().thirdStyle}
                    className="hidden font-semibold md:flex"
                    type="button"
                  >
                    Agregar nuevo tema
                  </Button>
                  <Button
                    type="button"
                    onClick={() => navigate('/add-theme')}
                    style={global_styles().thirdStyle}
                    className="flex font-semibold md:hidden"
                    isIconOnly
                  >
                    <Plus />
                  </Button>
                </>
              ) : (
                <Button
                  className=" lg:flex"
                  isIconOnly
                  style={{
                    backgroundColor: theme.colors.third,
                    color: theme.colors.primary,
                    opacity: 0.9,
                    cursor: 'not-allowed',
                  }}
                  endContent={
                    <Lock
                      style={{
                        color: theme.colors.primary,
                      }}
                      size={20}
                    />
                  }
                  disabled
                ></Button>
              )}

              {actions.includes('Agregar') ? (
                <>
                  {personalization.length === 0 && <AddButton onClick={() => addLogo.onOpen()} />}
                </>
              ) : (
                <Button
                  className=" lg:flex"
                  isIconOnly
                  style={{
                    backgroundColor: theme.colors.third,
                    color: theme.colors.primary,
                    opacity: 0.9,
                    cursor: 'not-allowed',
                  }}
                  endContent={
                    <Lock
                      style={{
                        color: theme.colors.primary,
                      }}
                      size={20}
                    />
                  }
                  disabled
                ></Button>
              )}

              {actions.includes('Editar') ? (
                <>
                  {personalization.length > 0 &&
                    personalization.map((item) => (
                      <>
                        <Button
                          onClick={() => {
                            UpdateImgModal.onOpen();
                            setLogoId(item.id || 0);
                          }}
                          endContent={<Plus size={20} />}
                          style={global_styles().thirdStyle}
                          className="hidden font-semibold md:flex"
                          type="button"
                        >
                          Actualizar logo
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            UpdateImgModal.onOpen();
                            setLogoId(item.id || 0);
                          }}
                          style={global_styles().thirdStyle}
                          className="flex font-semibold md:hidden"
                          isIconOnly
                        >
                          <Plus />
                        </Button>
                      </>
                    ))}
                </>
              ) : (
                <Button
                  className=" lg:flex"
                  isIconOnly
                  style={{
                    backgroundColor: theme.colors.secondary,
                    color: theme.colors.primary,
                    opacity: 0.9,
                    cursor: 'not-allowed',
                  }}
                  endContent={
                    <Lock
                      style={{
                        color: theme.colors.primary,
                      }}
                      size={20}
                    />
                  }
                  disabled
                ></Button>
              )}
              <Button style={global_styles().secondaryStyle}
                onClick={() => navigate('/edit-transmitter-info')}
                className="hidden font-semibold md:flex" endContent={<Edit size={20} />} >Editar emisor</Button>
            </div>
          </div>

          <div className="flex justify-center p-">
            <div className=" w-full dark:text-white">
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
                  <DataTable
                    value={personalization}
                    className="text-slate-600 dark:text-gray-100 mt-5 dark:bg-slate-700 bg-slate-200"
                    emptyMessage="No se encontraron resultados"
                    tableStyle={{ minWidth: '50rem' }}
                  >
                    <Column
                      headerClassName="text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                      field="logo"
                      header="Logo"
                      body={(rowData) => (
                        <Image
                          preview
                          src={rowData.logo}
                          alt={rowData.name}
                          style={{ width: '100px' }}
                        />
                      )}
                    />
                    <Column
                      headerClassName="text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                      field="name"
                      header="Nombre"
                    />
                    <Column
                      headerClassName="text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                      header="Actualizar Nombre"
                      body={(rowData) => (
                        <>
                          {actions.includes('Editar') ? (
                            <Button
                              onClick={() => {
                                setSelectedConfiguration(rowData);
                                updateName.onOpen();
                              }}
                              style={global_styles().secondaryStyle}
                            >
                              Actualizar
                            </Button>
                          ) : (
                            <Button
                              className=" lg:flex"
                              isIconOnly
                              style={{
                                backgroundColor: theme.colors.secondary,
                                color: theme.colors.primary,
                                opacity: 0.9,
                                cursor: 'not-allowed',
                              }}
                              endContent={
                                <Lock
                                  style={{
                                    color: theme.colors.primary,
                                  }}
                                  size={20}
                                />
                              }
                              disabled
                            ></Button>
                          )}
                        </>
                      )}
                    />
                  </DataTable>
                </>
              )}
            </div>
          </div>

          <div className="dark:bg-gray-900 w-full">
            <div className="p-4 ">
              <div className="p-5 dark:bg-gray-900">
                <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {themes.map((themeS, index) => (
                    <Card
                      key={index}
                      className="grid w-full grid-cols-6 border shadow"
                      isPressable
                      onClick={() => {
                        handleUpdate(themeS), setSelectedTheme(themeS.name);
                      }}
                    // onClick={() => toggleTheme(themeS as Theme)}
                    >
                      <span className="col-span-6 font-semibold">{themeS.name}</span>
                      <div className="absolute top-5 right-5">
                        {themeS.name === theme.name && <Check size={30} color="#fff" />}
                      </div>
                      <span
                        className="w-full h-44"
                        style={{ backgroundColor: themeS.colors.danger }}
                      ></span>
                      <span
                        className="w-full h-44"
                        style={{ backgroundColor: themeS.colors.dark }}
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
                        style={{ backgroundColor: themeS.colors.warning }}
                      ></span>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
};

export default ConfigurationList;
