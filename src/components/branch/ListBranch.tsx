import { useState, useEffect } from 'react';
import { useBranchesStore } from '../../store/branches.store';
import {
  Button,
  ButtonGroup,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Switch,
  useDisclosure,
} from '@heroui/react';
import {
  Edit,
  ShoppingBag,
  PhoneIcon,
  User,
  MapPinIcon,
  Table as ITable,
  CreditCard,
  RefreshCcw,
  Store,
  Trash,
} from 'lucide-react';
import AddButton from '../global/AddButton';
import Pagination from '../global/Pagination';
import AddBranch from './AddBranch';
import { limit_options, messages } from '../../utils/constants';
import TableBranch from './TableBranch';
import MobileView from './MobileView';
import { Branches } from '../../types/branches.types';
import { toast } from 'sonner';
import ListBranchProduct from './branch_product/ListBranchProduct';
import BoxBranch from './BoxBranch';
import classNames from 'classnames';
import HeadlessModal from '../global/HeadlessModal';
import TooltipGlobal from '../global/TooltipGlobal';
import SmPagination from '../global/SmPagination';
import { ArrayAction } from '@/types/view.types';
import useWindowSize from '@/hooks/useWindowSize';
import SearchBranch from './search_branch/SearchBranch';
import AddPointOfSales from './AddPointOfSales';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import useThemeColors from '@/themes/use-theme-colors';

function ListBranch({ actions }: ArrayAction) {
  const { getBranchesPaginated, branches_paginated, disableBranch } = useBranchesStore();
  const [name, setName] = useState('');
  const modalAddPointOfSales = useDisclosure();
  const [selectedBranchId, setSelectedBranchId] = useState<number>(0);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [limit, setLimit] = useState(5);
  const [active, setActive] = useState<1 | 0>(1);
  const [BranchId, setBranchId] = useState(0);
  const { windowSize } = useWindowSize();
  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );
  useEffect(() => {
    getBranchesPaginated(1, limit, name, phone, address, active);
  }, [limit, active]);

  const modalAdd = useDisclosure();
  const modalBranchProduct = useDisclosure();
  const modalBoxBranch = useDisclosure();

  const handlePointOfSales = (id: number) => {
    setSelectedBranchId(id);
    modalAddPointOfSales.onOpen();
  };

  const handleSearch = () => {
    getBranchesPaginated(1, limit, name, phone, address);
  };
  const [selectedBranch, setSelectedBranch] = useState<Branches>();
  const [Branch, setBranch] = useState<Branches>();
  const handleEdit = (item: Branches) => {
    setSelectedBranch(item);
    modalAdd.onOpen();
  };
  const handleBox = (item: Branches) => {
    setBranch(item);
    modalBoxBranch.onOpen();
  };
  const handleBranchProduct = (id: number) => {
    setBranchId(id);
    modalBranchProduct.onOpen();
  };
  const handleInactive = (item: Branches) => {
    disableBranch(item.id, !item.isActive);
  };
  const clearClose = () => {
    setBranch(undefined);
  };
  return (
    <>
      {BranchId >= 1 ? (
        <ListBranchProduct onclick={() => setBranchId(0)} id={BranchId} />
      ) : (
        <div className=" w-full h-full bg-white dark:bg-gray-900">
          <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
            <div className="flex justify-between items-end ">
              <SearchBranch
                nameBranch={setName}
                phoneBranch={setPhone}
                addressBranch={setAddress}
              ></SearchBranch>
              {actions.includes('Agregar') && <AddButton onClick={() => modalAdd.onOpen()} />}
            </div>
            <div className="hidden w-full gap-5 md:flex">
              <div className="grid w-full grid-cols-4 gap-3">
                <Input
                  startContent={<User />}
                  className="w-full dark:text-white border border-white rounded-xl"
                  variant="bordered"
                  labelPlacement="outside"
                  label="Nombre"
                  classNames={{
                    label: 'font-semibold text-gray-700',
                    inputWrapper: 'pr-0',
                  }}
                  isClearable
                  value={name}
                  placeholder="Escribe para buscar..."
                  onChange={(e) => setName(e.target.value)}
                  onClear={() => {
                    setName('');
                    getBranchesPaginated(1, limit, '', phone, address, active);
                  }}
                />

                <Input
                  labelPlacement="outside"
                  label="Teléfono"
                  placeholder="Escribe para buscar..."
                  startContent={<PhoneIcon />}
                  className="w-full dark:text-white border border-white rounded-xl"
                  classNames={{
                    label: 'font-semibold text-gray-700',
                    inputWrapper: 'pr-0',
                  }}
                  variant="bordered"
                  isClearable
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onClear={() => {
                    setPhone('');
                    getBranchesPaginated(1, limit, name, '', address, active);
                  }}
                />

                <Input
                  placeholder="Escribe para buscar..."
                  startContent={<MapPinIcon />}
                  className="w-full dark:text-white border border-white rounded-xl"
                  variant="bordered"
                  isClearable
                  labelPlacement="outside"
                  label="Dirección"
                  classNames={{
                    label: 'font-semibold text-gray-700',
                    inputWrapper: 'pr-0',
                  }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onClear={() => {
                    setAddress('');
                    getBranchesPaginated(1, limit, name, phone, '', active);
                  }}
                />
                <ButtonUi
                  theme={Colors.Primary}
                  className="hidden mt-6 font-semibold md:flex border border-white rounded-xl"
                  color="primary"
                  onPress={() => handleSearch()}
                  type="button"
                >
                  Buscar
                </ButtonUi>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10">
              <div className="flex justify-start order-2 lg:order-1">
                <Switch
                  classNames={{
                    thumb: classNames(active ? 'bg-blue-500' : 'bg-gray-400'),
                    wrapper: classNames(active ? '!bg-blue-300' : 'bg-gray-200'),
                  }}
                  onValueChange={(isSelected) => setActive(isSelected ? 1 : 0)}
                >
                  <span className="text-sm sm:text-base whitespace-nowrap">
                    Mostrar {active ? 'inactivos' : 'activos'}
                  </span>
                </Switch>
              </div>
              <div className="flex gap-10 w-full justify-between items-center lg:justify-end order-1 lg:order-2">
                <div>
                  <label className="dark:text-white font-semibold text-sm">Mostrar</label>
                  <Select
                    className="w-44 dark:text-white border border-white rounded-xl"
                    variant="bordered"
                    labelPlacement="outside"
                    classNames={{
                      label: 'font-semibold',
                    }}
                    defaultSelectedKeys={['5']}
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                    }}
                  >
                    {limit_options.map((option) => (
                      <SelectItem className="w-full dark:text-white" key={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
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
              </div>
            </div>

            {view === 'table' && (
              <TableBranch
                actionsElement={(item) => (
                  <>
                    <div className="flex w-full gap-5">
                      {actions.includes('Editar') && item.isActive && (
                        <>
                          <ButtonUi
                            onPress={() => {
                              handleEdit(item);
                            }}
                            isIconOnly
                            theme={Colors.Success}
                          >
                            <Edit />
                          </ButtonUi>
                        </>
                      )}
                      {actions.includes('Ver Productos') && item.isActive && (
                        <ButtonUi
                          onPress={() => {
                            setBranchId(item.id);
                            modalBranchProduct.onOpen();
                          }}
                          isIconOnly
                          theme={Colors.Primary}
                        >
                          <ShoppingBag />
                        </ButtonUi>
                      )}
                      {actions.includes('Eliminar') && (
                        <>{item.isActive && <DeletePopUp branch={item} />}</>
                      )}

                      <TooltipGlobal text="Asignar punto de venta">
                        <ButtonUi
                          onPress={() => {
                            handlePointOfSales(item.id);
                          }}
                          isIconOnly
                          theme={Colors.Primary}
                        >
                          <Store />
                        </ButtonUi>
                      </TooltipGlobal>
                      {actions.includes('Activar Sucursal') && !item.isActive && (
                        <TooltipGlobal text="Activar la sucursal">
                          <ButtonUi
                            onPress={() => {
                              handleInactive(item);
                            }}
                            isIconOnly
                            theme={Colors.Info}
                          >
                            <RefreshCcw />
                          </ButtonUi>
                        </TooltipGlobal>
                      )}
                    </div>
                  </>
                )}
              />
            )}
            {(view === 'grid' || view === 'list') && (
              <>
                <MobileView
                  actions={actions}
                  handleActive={() => {
                    handleInactive;
                  }}
                  deletePopover={DeletePopUp}
                  handleEdit={handleEdit}
                  handleBranchProduct={handleBranchProduct}
                  handleBox={handleBox}
                  layout={view as 'grid' | 'list'}
                />
              </>
            )}
            {branches_paginated.totalPag > 1 && (
              <>
                <div className="hidden w-full mt-5 md:flex">
                  <Pagination
                    previousPage={branches_paginated.prevPag}
                    nextPage={branches_paginated.nextPag}
                    currentPage={branches_paginated.currentPag}
                    totalPages={branches_paginated.totalPag}
                    onPageChange={(page) => {
                      getBranchesPaginated(page, limit, name, phone, address, active);
                    }}
                  />
                </div>
                <div className="flex w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-lg p-3">
                  <SmPagination
                    handleNext={() => {
                      getBranchesPaginated(
                        branches_paginated.nextPag,
                        limit,
                        name,
                        phone,
                        address,
                        active
                      );
                    }}
                    handlePrev={() => {
                      getBranchesPaginated(
                        branches_paginated.prevPag,
                        limit,
                        name,
                        phone,
                        address,
                        active
                      );
                    }}
                    currentPage={branches_paginated.currentPag}
                    totalPages={branches_paginated.totalPag}
                  />
                </div>
              </>
            )}
          </div>
          <HeadlessModal
            isOpen={modalAdd.isOpen}
            onClose={() => {
              modalAdd.onClose();
              setSelectedBranch(undefined);
            }}
            title={selectedBranch ? 'Editar sucursal' : 'Nueva sucursal'}
            size="w-[90vw] md:w-[600px]"
          >
            <AddBranch branch={selectedBranch} closeModal={modalAdd.onClose} />
          </HeadlessModal>

          <HeadlessModal
            title=""
            isOpen={modalBoxBranch.isOpen}
            onClose={() => {
              clearClose();
              modalBoxBranch.onClose();
            }}
            size="w-[350px] md:w-[500px]"
          >
            <BoxBranch branch={Branch} closeModal={modalBoxBranch.onClose} setBranch={setBranch} />
          </HeadlessModal>
          <HeadlessModal
            isOpen={modalAddPointOfSales.isOpen}
            onClose={modalAddPointOfSales.onClose}
            title="Agregar punto de venta"
            size="w-[380px] md:w-[700px] p-1"
          >
            <AddPointOfSales onClose={modalAddPointOfSales.onClose} branchId={selectedBranchId} />
          </HeadlessModal>
        </div>
      )}
    </>
  );
}

export default ListBranch;

interface Props {
  branch: Branches;
}

const DeletePopUp = ({ branch }: Props) => {
  const { deleteBranch, disableBranch } = useBranchesStore();
  const deleteDisclosure = useDisclosure();

  const handleDelete = () => {
    if (branch.isActive) {
      disableBranch(branch.id, !branch.isActive).then((res) => {
        if (res) {
          toast.success(messages.success);
          deleteDisclosure.onClose();
        } else {
          toast.error(messages.error);
        }
      });
    } else {
      deleteBranch(branch.id).then((res) => {
        if (res) {
          toast.success(messages.success);
          deleteDisclosure.onClose();
        } else {
          toast.error(messages.error);
        }
      });
    }
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
            <p className="font-semibold text-gray-600 dark:text-white">Eliminar {branch.name}</p>
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
