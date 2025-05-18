import { useEffect, useState } from 'react';
import { ButtonGroup, useDisclosure } from '@heroui/react';
import { Edit, Pencil, Plus } from 'lucide-react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from '@heroui/react';
import { Image } from 'primereact/image';
import { Table as ITable, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router';
import { FaUserEdit } from 'react-icons/fa';
import { TbSettingsPlus } from 'react-icons/tb';

import { useThemeStore } from '../../store/theme.store';
import AddButton from '../global/AddButton';
import { useConfigurationStore } from '../../store/perzonalitation.store';
import { useAuthStore } from '../../store/auth.store';
import { IConfiguration } from '../../types/configuration.types';
import HeadlessModal from '../global/HeadlessModal';

import CreateConfiguration from './CreateConfiguration';
import UpdateFile from './UpdateFile';
import UpdateConfigurationName from './UpdateConfigurationName';
import MobileViewConfi from './MobileViewConfi';
import ThemesList from './themes-list';

import { global_styles } from '@/styles/global.styles';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Props {
  actions: string[];
}

const ConfigurationList = ({ actions }: Props) => {
  const [view, setView] = useState<'table' | 'grid' | 'list'>('table');
  const { getPaginatedThemes } = useThemeStore();
  const [logoId, setLogoId] = useState(0);
  const [selectedTheme] = useState('');
  const [selectedConfiguration, setSelectedConfiguration] = useState<IConfiguration>();
  const { personalization, GetConfigurationByTransmitter } = useConfigurationStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const tramsiter = user?.pointOfSale?.branch.transmitterId ?? 0;

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

  return (
    <>
      <div className=" w-full h-full p-5 bg-gray-50 dark:bg-gray-900">
        <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="flex justify-evenly gap-10 mt-5 ml-5 ">
            <div className="flex gap-4 justify-between w-full">
              <ButtonGroup className="mt-4">
                <ButtonUi
                  isIconOnly
                  theme={view === 'table' ? Colors.Primary : Colors.Default}
                  onPress={() => setView('table')}
                >
                  <ITable />
                </ButtonUi>
                <ButtonUi
                  isIconOnly
                  theme={view === 'grid' ? Colors.Primary : Colors.Default}
                  onPress={() => setView('grid')}
                >
                  <CreditCard />
                </ButtonUi>
              </ButtonGroup>

              {actions.includes('Agregar') && (
                <>
                  <ButtonUi
                    className="hidden font-semibold md:flex"
                    endContent={<Plus size={20} />}
                    theme={Colors.Info}
                    onPress={() => navigate('/add-theme')}
                  >
                    Agregar nuevo tema
                  </ButtonUi>
                  <ButtonUi
                    isIconOnly
                    showTooltip
                    className="flex font-semibold md:hidden"
                    theme={Colors.Info}
                    tooltipText="Agregar nuevo tema"
                    type="button"
                    onPress={() => navigate('/add-theme')}
                  >
                    <TbSettingsPlus size={25} />
                  </ButtonUi>
                </>
              )}

              {actions.includes('Agregar') && (
                <>
                  {personalization.length === 0 && <AddButton onClick={() => addLogo.onOpen()} />}
                </>
              )}

              {actions.includes('Editar') && (
                <>
                  {personalization.length > 0 &&
                    personalization.map((item) => (
                      <>
                        <ButtonUi
                          className="hidden font-semibold md:flex"
                          endContent={<Plus size={20} />}
                          theme={Colors.Primary}
                          onPress={() => {
                            UpdateImgModal.onOpen();
                            setLogoId(item.id || 0);
                          }}
                        >
                          Actualizar logo
                        </ButtonUi>
                        <ButtonUi
                          isIconOnly
                          showTooltip
                          className="flex font-semibold md:hidden"
                          theme={Colors.Primary}
                          tooltipText="Editar logo"
                          onPress={() => {
                            UpdateImgModal.onOpen();
                            setLogoId(item.id || 0);
                          }}
                        >
                          <Pencil />
                        </ButtonUi>
                      </>
                    ))}
                </>
              )}
              <div>
                <ButtonUi
                  isIconOnly
                  showTooltip
                  className="flex font-semibold md:hidden"
                  theme={Colors.Success}
                  tooltipText="Editar emisor"
                  onPress={() => navigate('/edit-transmitter-info')}
                >
                  <FaUserEdit size={20} />
                </ButtonUi>
                <ButtonUi
                  className="hidden font-semibold md:flex"
                  endContent={<Edit size={20} />}
                  theme={Colors.Success}
                  onPress={() => navigate('/edit-transmitter-info')}
                >
                  Editar emisor
                </ButtonUi>
              </div>
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
                    className="text-slate-600 dark:text-gray-100 mt-5 dark:bg-slate-700 bg-slate-200"
                    emptyMessage="No se encontraron resultados"
                    tableStyle={{ minWidth: '50rem' }}
                    value={personalization}
                  >
                    <Column
                      body={(rowData) => (
                        <Image
                          preview
                          alt={rowData.name}
                          src={rowData.logo}
                          style={{ width: '100px' }}
                        />
                      )}
                      field="logo"
                      header="Logo"
                      headerClassName="text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                    />
                    <Column
                      field="name"
                      header="Nombre"
                      headerClassName="text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                    />
                    <Column
                      body={(rowData) => (
                        <>
                          {actions.includes('Editar') && (
                            <Button
                              style={global_styles().secondaryStyle}
                              onClick={() => {
                                setSelectedConfiguration(rowData);
                                updateName.onOpen();
                              }}
                            >
                              Actualizar
                            </Button>
                          )}
                        </>
                      )}
                      header="Actualizar Nombre"
                      headerClassName="text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                    />
                  </DataTable>
                </>
              )}
            </div>
          </div>

          <ThemesList personalization={personalization} />
        </div>
      </div>

      <HeadlessModal
        isOpen={addLogo.isOpen}
        size="w-[350px] md:w-[500px]"
        title="Agregar logo y nombre"
        onClose={addLogo.onClose}
      >
        <CreateConfiguration theme={selectedTheme} />
      </HeadlessModal>

      <HeadlessModal
        isOpen={UpdateImgModal.isOpen}
        size="w-[350px] md:w-[500px]"
        title="Actualizar logo"
        onClose={UpdateImgModal.onClose}
      >
        <UpdateFile perzonalitationId={logoId} />
      </HeadlessModal>

      <HeadlessModal
        isOpen={updateName.isOpen}
        size="w-[350px] md:w-[500px]"
        title="Actualizar nombre"
        onClose={updateName.onClose}
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
