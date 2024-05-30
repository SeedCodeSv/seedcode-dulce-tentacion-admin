import { Button, ButtonGroup, useDisclosure } from '@nextui-org/react';
import { Table as ITable, CreditCard, List, CirclePlus, Trash, Pencil, Eye } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../hooks/useTheme';
import AddButton from '../global/AddButton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ModalGlobal from '../global/ModalGlobal';
import AddActionRol from './AddActionRol';
import { useActionsRolStore } from '../../store/actions_rol.store';
import MobileView from './MobileView';
interface Props {
  actions: string[];
}
const ListActionRol = ({ actions }: Props) => {
  const { theme } = useContext(ThemeContext);
  const [view, setView] = useState<'table' | 'grid' | 'list'>('table');
  // const [limit, setLimit] = useState(8);
  const modalAdd = useDisclosure();
  const [idCounter] = useState(1);
  const { OnGetActionsRoleList, actions_roles_grouped } = useActionsRolStore();
  useEffect(() => {
    OnGetActionsRoleList();
  }, []);

  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
            <div className="flex items-start gap-3"></div>

            <div className="flex w-full">
              <div className="items-start justify-between w-full gap-10 lg:justify-start">
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
              </div>
              <div className="flex items-end justify-end">
                <AddButton
                  onClick={() => {
                    modalAdd.onOpen();
                  }}
                />
              </div>
            </div>
          </div>
          {/* <div className="flex justify-end w-full mb-5">
            <Select
              className="w-44"
              variant="bordered"
              label="Mostrar"
              labelPlacement="outside"
              classNames={{
                label: 'font-semibold',
              }}
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
              }}
            >
              <SelectItem key={'5'}>5</SelectItem>
              <SelectItem key={'10'}>10</SelectItem>
              <SelectItem key={'20'}>20</SelectItem>
              <SelectItem key={'30'}>30</SelectItem>
              <SelectItem key={'40'}>40</SelectItem>
              <SelectItem key={'50'}>50</SelectItem>
              <SelectItem key={'100'}>100</SelectItem>
            </Select>
          </div> */}

          {(view === 'grid' || view === 'list') && (
            <MobileView layout={view as 'grid' | 'list'} actions={actions} />
          )}

          {view === 'table' && (
            <DataTable
              className="w-full shadow "
              emptyMessage="No se encontraron resultados"
              value={actions_roles_grouped}
              tableStyle={{ minWidth: '50rem' }}
            >
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
                field="id"
                className="text-center justify-center"
                body={(rowData) => {
                  const actionId = idCounter + actions_roles_grouped.indexOf(rowData);
                  return actionId;
                }}
                header="No."
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="role"
                header="Rol"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                field="view"
                header="Modulo"
              />
              <Column
                headerClassName="text-sm font-semibold"
                headerStyle={style}
                body={(rowData) => {
                  const actionOrder = ['Agregar', 'Eliminar', 'Editar', 'Mostrar'];
                  const sortedActions = actionOrder.filter((action) =>
                    rowData.action.includes(action)
                  );

                  return (
                    <div className="flex gap-3">
                      {sortedActions.map((action, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                          {action === 'Agregar' && (
                            <div className="flex justify-center items-center w-10 h-10 rounded-full bg-[#457b9d]">
                              <CirclePlus className="text-white" size={20} />{' '}
                            </div>
                          )}
                          {action === 'Eliminar' && (
                            <div className="flex justify-center items-center w-10 h-10 rounded-full bg-red-500">
                              <Trash size={20} className="text-white" />
                            </div>
                          )}
                          {action === 'Editar' && (
                            <div className="flex justify-center items-center w-10 h-10 rounded-full bg-green-400">
                              <Pencil size={20} className="text-white" />
                            </div>
                          )}
                          {action === 'Mostrar' && (
                            <div className="flex justify-center items-center w-10 h-10 rounded-full bg-blue-400">
                              <Eye size={20} className="text-white" />
                            </div>
                          )}
                          <span style={{ marginLeft: '0.5rem' }}>{action}</span>
                        </div>
                      ))}
                    </div>
                  );
                }}
                header="Permisos"
              />
            </DataTable>
          )}
        </div>
      </div>
      <ModalGlobal
        title={'Asignar nuevas acciones'}
        onClose={modalAdd.onClose}
        size="w-full md:w-[500px]"
        isOpen={modalAdd.isOpen}
      >
        <AddActionRol closeModal={modalAdd.onClose} />
      </ModalGlobal>
    </>
  );
};

export default ListActionRol;
