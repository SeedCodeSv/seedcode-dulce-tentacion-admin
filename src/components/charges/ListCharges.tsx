import {
  Input,
  Button,
  useDisclosure,
  ButtonGroup,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import {
  User,
  Table as ITable,
  CreditCard,
  Filter,
  EditIcon,
  Trash,
} from 'lucide-react';
import { useChargesStore } from '../../store/charges.store';
import ChargesForm from './ChargesForm';
import NO_DATA from '@/assets/svg/no_data.svg';
import AddButton from '../global/AddButton';
import MobileView from './MobileView';
import { ICharge } from '../../types/charges.types';
import { global_styles } from '../../styles/global.styles';
import { limit_options } from '../../utils/constants';
import SmPagination from '../global/SmPagination';
import HeadlessModal from '../global/HeadlessModal';
import Pagination from '../global/Pagination';
import TooltipGlobal from '../global/TooltipGlobal';
import useWindowSize from '@/hooks/useWindowSize';
import BottomDrawer from '../global/BottomDrawer';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ThGlobal from '@/themes/ui/th-global';
import useThemeColors from '@/themes/use-theme-colors';

interface IProps {
  actions: string[];
}

function ListCharges({ actions }: IProps) {
  const [openVaul, setOpenVaul] = useState(false);
  const { windowSize } = useWindowSize();
  const { charges_paginated, getChargesPaginated, activateCharge, loading } = useChargesStore();

  const [selectedCharge, setSelectedCharge] = useState<{ id: number; name: string } | undefined>();

  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(5);
  const [active] = useState(true);

  useEffect(() => {
    getChargesPaginated(1, limit, search, active ? 1 : 0);
  }, [limit, active]);

  const handleSearch = (name: string | undefined) => {
    getChargesPaginated(1, limit, name ?? search);
  };

  const modalAdd = useDisclosure();

  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );

  const handleEdit = (item: ICharge) => {
    setSelectedCharge({
      id: item.id,
      name: item.name,
    });
    modalAdd.onOpen();
  };

  const handleActivate = (id: number) => {
    activateCharge(id).then(() => {
      getChargesPaginated(1, limit, search, active ? 1 : 0);
    });
  };

  return (
    <div className="w-full h-full px-5 py-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex flex-col w-full p-5 bg-white shadow rounded-xl dark:bg-gray-900">
        <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
          <div className="flex items-end gap-3">
            <div className="hidden w-full md:flex gap-3">
              <Input
                startContent={<User />}
                className="w-full xl:w-96 dark:text-white"
                variant="bordered"
                labelPlacement="outside"
                label="Nombre"
                classNames={{
                  label: 'font-semibold text-gray-700',
                  inputWrapper: 'pr-0',
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Escribe para buscar..."
                isClearable
                onClear={() => {
                  setSearch('');
                  handleSearch('');
                }}
              />
              <ButtonUi
                theme={Colors.Primary}
                className="mt-6 font-semibold"
                onPress={() => handleSearch(undefined)}
              >
                Buscar
              </ButtonUi>
            </div>
          </div>
          <div className="flex items-end justify-between w-full gap-10 lg:justify-end">
            <ButtonGroup className="mt-4">
              <ButtonUi
                theme={view === 'table' ? Colors.Primary : Colors.Default}
                isIconOnly
                onPress={() => setView('table')}
              >
                <ITable />
              </ButtonUi>
              <ButtonUi
                theme={view === 'grid' ? Colors.Primary : Colors.Default}
                isIconOnly
                onPress={() => setView('grid')}
              >
                <CreditCard />
              </ButtonUi>
            </ButtonGroup>
            <div className="flex items-center gap-5">
              <div className="block md:hidden">
                <TooltipGlobal text="Buscar por filtros">
                  <Button
                    style={global_styles().thirdStyle}
                    isIconOnly
                    onClick={() => setOpenVaul(true)}
                    type="button"
                  >
                    <Filter />
                  </Button>
                </TooltipGlobal>
                <BottomDrawer
                  open={openVaul}
                  title="Filtros disponibles"
                  onClose={() => setOpenVaul(false)}
                >
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-t-[10px] flex-1">
                    <div className="flex flex-col gap-3">
                      <Input
                        startContent={<User />}
                        className="w-full xl:w-96 dark:text-white"
                        variant="bordered"
                        labelPlacement="outside"
                        label="Nombre"
                        classNames={{
                          label: 'font-semibold text-gray-700',
                          inputWrapper: 'pr-0',
                        }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Escribe para buscar..."
                        isClearable
                        onClear={() => {
                          setSearch('');
                          handleSearch('');
                        }}
                      />
                      <ButtonUi
                        theme={Colors.Primary}
                        className="mt-6 font-semibold"
                        color="primary"
                        onPress={() => {
                          handleSearch(undefined);
                          setOpenVaul(false);
                        }}
                      >
                        Buscar
                      </ButtonUi>
                    </div>
                  </div>
                </BottomDrawer>
              </div>
              <AddButton
                onClick={() => {
                  setSelectedCharge(undefined);
                  modalAdd.onOpen();
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end items-end w-full mb-5 gap-5">
          <Select
            className="w-44 dark:text-white"
            variant="bordered"
            label="Mostrar"
            labelPlacement="outside"
            classNames={{
              label: 'font-semibold',
            }}
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value !== '' ? e.target.value : '8'));
            }}
          >
            {limit_options.map((option) => (
              <SelectItem key={option} className="dark:text-white">
                {option}
              </SelectItem>
            ))}
          </Select>
        </div>
        {(view === 'grid' || view === 'list') && (
          <MobileView
            handleActive={handleActivate}
            deletePopover={DeletePopUp}
            layout={view as 'grid' | 'list'}
            handleEdit={handleEdit}
            actions={actions}
          />
        )}
        {view === 'table' && (
          <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  <ThGlobal className="text-left p-3">No.</ThGlobal>
                  <ThGlobal className="text-left p-3">Nombre</ThGlobal>
                  <ThGlobal className="text-left p-3">Acciones</ThGlobal>
                </tr>
              </thead>
              <tbody className="max-h-[600px] w-full overflow-y-auto">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-3 text-sm text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center w-full h-64">
                        <div className="loader"></div>
                        <p className="mt-3 text-xl font-semibold">Cargando...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {charges_paginated.charges.length > 0 ? (
                      <>
                        {charges_paginated.charges.map((item) => (
                          <tr className="border-b border-slate-200">
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {item.id}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {item.name}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              <div className="flex w-full gap-5">
                                <ButtonUi
                                  onPress={() => handleEdit(item)}
                                  isIconOnly
                                  theme={Colors.Success}
                                >
                                  <EditIcon size={20} />
                                </ButtonUi>
                                {item.isActive && <DeletePopUp charges={item} />}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <tr>
                        <td colSpan={5}>
                          <div className="flex flex-col items-center justify-center w-full">
                            <img src={NO_DATA} alt="X" className="w-32 h-32" />
                            <p className="mt-3 text-xl">No se encontraron resultados</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
        {charges_paginated.totalPag > 1 && (
          <>
            <div className="hidden w-full mt-5 md:flex">
              <Pagination
                previousPage={charges_paginated.prevPag}
                nextPage={charges_paginated.nextPag}
                currentPage={charges_paginated.currentPag}
                totalPages={charges_paginated.totalPag}
                onPageChange={(page) => {
                  getChargesPaginated(page, limit, search);
                }}
              />
            </div>
            <div className="flex w-full mt-5 md:hidden">
              <div className="flex w-full mt-5 md:hidden">
                <SmPagination
                  handleNext={() => {
                    getChargesPaginated(charges_paginated.nextPag, limit, search);
                  }}
                  handlePrev={() => {
                    getChargesPaginated(charges_paginated.prevPag, limit, search);
                  }}
                  currentPage={charges_paginated.currentPag}
                  totalPages={charges_paginated.totalPag}
                />
              </div>
            </div>
          </>
        )}
      </div>
      <HeadlessModal
        size="w-[350px] md:w-[500px]"
        title={selectedCharge ? 'Editar cargo' : 'Nuevo cargo'}
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
      >
        <ChargesForm closeModal={modalAdd.onClose} charges={selectedCharge} />
      </HeadlessModal>
    </div>
  );
}

export default ListCharges;
interface Props {
  charges: ICharge;
}

const DeletePopUp = ({ charges }: Props) => {
  const { deleteCharge } = useChargesStore();
  const deleteDisclosure = useDisclosure();

  const handleDelete = async () => {
    await deleteCharge(charges.id);
    deleteDisclosure.onClose();
  };

  const style = useThemeColors({ name: Colors.Error });

  return (
    <>
      <Popover
        className="border border-white rounded-2xl"
        {...deleteDisclosure}
        backdrop="blur"
        showArrow
      >
        <PopoverTrigger>
          <Button isIconOnly style={style}>
            <Trash />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col items-center justify-center w-full p-5">
            <p className="font-semibold text-gray-600 dark:text-white">Eliminar {charges.name}</p>
            <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
              ¿Estas seguro de eliminar este registro?
            </p>
            <div className="flex justify-center mt-4 gap-5">
              <ButtonUi
                theme={Colors.Default}
                onPress={deleteDisclosure.onClose}
                className="border border-white"
              >
                No, cancelar
              </ButtonUi>
              <ButtonUi theme={Colors.Error} onPress={() => handleDelete()}>
                Si, eliminar
              </ButtonUi>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
