import { Button, ButtonGroup, useDisclosure } from '@nextui-org/react';
import { Table as ITable, CreditCard, List } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../hooks/useTheme';
import AddButton from '../global/AddButton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import AddActionRol from './AddActionRol';
import { useActionsRolStore } from '../../store/actions_rol.store';
import HeadlessModal from '../global/HeadlessModal';
import { get_user } from '@/storage/localStorage';
const ListActionRol = () => {
  const { theme } = useContext(ThemeContext);
  const [view, setView] = useState<'table' | 'grid' | 'list'>('table');
  const [rolId, setRolId] = useState(0);
  const modalAdd = useDisclosure();

  const { OnGetActionsRoleList, roleActions } = useActionsRolStore();
  useEffect(() => {
    const getRolId = () => {
      const rolId = get_user();
      if (rolId) {
        setRolId(rolId.role.id as number);
      }
    };
    getRolId();
    OnGetActionsRoleList();
  }, [rolId]);
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
  const uniqueRoles = [...new Set(roleActions.map((item) => item.role?.name))];

  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
            <div className="flex items-start gap-3"></div>
            <div className="flex w-full">
              <div className="flex items-end justify-end">
                <AddButton
                  onClick={() => {
                    modalAdd.onOpen();
                  }}
                />
              </div>
            </div>
          </div>
          <div className="grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5">
            {uniqueRoles.map((role) => (
              <div className="w-full shadow-sm hover:shadow-lg p-8 dark:border dark:border-gray-600 rounded-2xl">
                <p className="font-semibold dark:text-white">{role}</p>
                <div className="flex justify-between mt-5 w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <HeadlessModal
        title={'Asignar nuevas acciones'}
        onClose={modalAdd.onClose}
        size="w-full md:w-[500px]"
        isOpen={modalAdd.isOpen}
      >
        <AddActionRol closeModal={modalAdd.onClose} />
      </HeadlessModal>
    </>
  );
};

export default ListActionRol;

//  <div className="items-start justify-between w-full gap-10 lg:justify-start">
//    <ButtonGroup>
//      <Button
//        isIconOnly
//        color="secondary"
//        style={{
//          backgroundColor: view === 'table' ? theme.colors.third : '#e5e5e5',
//          color: view === 'table' ? theme.colors.primary : '#3e3e3e',
//        }}
//        onClick={() => setView('table')}
//      >
//        <ITable />
//      </Button>
//      <Button
//        isIconOnly
//        color="default"
//        style={{
//          backgroundColor: view === 'grid' ? theme.colors.third : '#e5e5e5',
//          color: view === 'grid' ? theme.colors.primary : '#3e3e3e',
//        }}
//        onClick={() => setView('grid')}
//      >
//        <CreditCard />
//      </Button>
//      <Button
//        isIconOnly
//        color="default"
//        style={{
//          backgroundColor: view === 'list' ? theme.colors.third : '#e5e5e5',
//          color: view === 'list' ? theme.colors.primary : '#3e3e3e',
//        }}
//        onClick={() => setView('list')}
//      >
//        <List />
//      </Button>
//    </ButtonGroup>
//  </div>;
