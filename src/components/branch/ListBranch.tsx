import { useState, useEffect, useContext, useMemo } from 'react';
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
} from '@nextui-org/react';
import {
  Edit,
  ShoppingBag,
  PhoneIcon,
  User,
  TrashIcon,
  MapPinIcon,
  Table as ITable,
  CreditCard,
  List,
  Filter,
  RefreshCcw,
} from 'lucide-react';
import { ThemeContext } from '../../hooks/useTheme';
import AddButton from '../global/AddButton';
import Pagination from '../global/Pagination';
import AddBranch from './AddBranch';
import { global_styles } from '../../styles/global.styles';
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
function ListBranch({ actions }: ArrayAction) {
  const { theme } = useContext(ThemeContext);
  const { getBranchesPaginated, branches_paginated, disableBranch } = useBranchesStore();
  const [name, setName] = useState('');
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
  const changePage = (page: number) => {
    getBranchesPaginated(page, limit, name, phone, address, active);
  };
  const modalAdd = useDisclosure();
  const modalBranchProduct = useDisclosure();
  const modalBoxBranch = useDisclosure();
  const filters = useMemo(() => {
    return <></>;
  }, [name, setName, phone, setPhone, address, setAddress]);
  const [openVaul, setOpenVaul] = useState(false);
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
        <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
          <div className="w-full h-full border-white border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
            <div className="flex justify-between items-end ">
              <SearchBranch
                nameBranch={setName}
                phoneBranch={setPhone}
                addressBranch={setAddress}
              ></SearchBranch>
              {actions.includes('Agregar') && <AddButton onClick={() => modalAdd.onOpen()} />}
            </div>
            <div className="hidden w-full gap-5 md:flex">
              <div className="grid w-full grid-cols-5 gap-3">
                <Input
                  startContent={<User />}
                  className="w-full dark:text-white"
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
                  className="w-full dark:text-white"
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
                  className="w-full dark:text-white"
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
                <Button
                  style={{
                    backgroundColor: theme.colors.secondary,
                    color: theme.colors.primary,
                  }}
                  className="hidden mt-6 font-semibold md:flex"
                  color="primary"
                  onClick={() => handleSearch()}
                  type="button"
                >
                  Buscar
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10">
              <div className="flex justify-between justify-start order-2 lg:order-1">
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
                <Select
                  className="w-44 dark:text-white"
                  variant="bordered"
                  label="Mostrar"
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
                    <SelectItem className="w-full dark:text-white" key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </Select>
                <ButtonGroup className="mt-4">
                  <Button
                    className="hidden md:inline-flex"
                    isIconOnly
                    color="secondary"
                    style={{
                      backgroundColor: view === 'table' ? theme.colors.third : '#e5e5e5',
                      color: view === 'table' ? theme.colors.primary : '#3e3e3e',
                    }}
                    onClick={() => setView('table')}
                    type="button"
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
                    type="button"
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
                    type="button"
                  >
                    <List />
                  </Button>
                </ButtonGroup>
              </div>
            </div>

            {view === 'table' && (
              <TableBranch
                actionsElement={(item) => (
                  <>
                    <div className="flex w-full gap-5">
                      {actions.includes('Ver Productos') && item.isActive && (
                        <Button
                          onClick={() => {
                            setBranchId(item.id);
                            modalBranchProduct.onOpen();
                          }}
                          isIconOnly
                          style={global_styles().thirdStyle}
                        >
                          <ShoppingBag />
                        </Button>
                      )}
                      {actions.includes('Editar') && item.isActive && (
                        <>
                          <Button
                            onClick={() => {
                              handleEdit(item);
                            }}
                            isIconOnly
                            style={global_styles().secondaryStyle}
                          >
                            <Edit />
                          </Button>
                        </>
                      )}
                      {actions.includes('Eliminar') && (
                        <>{item.isActive && <DeletePopUp branch={item} />}</>
                      )}
                      {actions.includes('Activar Sucursal') && !item.isActive && (
                        <TooltipGlobal text="Activar la sucursal">
                          <Button
                            onClick={() => {
                              handleInactive(item);
                            }}
                            isIconOnly
                            style={global_styles().thirdStyle}
                          >
                            <RefreshCcw />
                          </Button>
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
                  layout={view as 'grid' | 'list'}
                  deletePopover={DeletePopUp}
                  handleEdit={handleEdit}
                  handleBranchProduct={handleBranchProduct}
                  handleBox={handleBox}
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
                      changePage(page);
                    }}
                  />
                </div>
                <div className="flex w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-lg p-3">
                  <SmPagination
                    handleNext={() => {
                      changePage(branches_paginated.nextPag);
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
                      changePage(branches_paginated.prevPag);
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
            size="w-[90vw] md:w-[500px]"
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
  const { theme } = useContext(ThemeContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = () => {
    if (branch.isActive) {
      disableBranch(branch.id, !branch.isActive).then((res) => {
        if (res) {
          toast.success(messages.success);
          onClose();
        } else {
          toast.error(messages.error);
        }
      });
    } else {
      deleteBranch(branch.id).then((res) => {
        if (res) {
          toast.success(messages.success);
          onClose();
        } else {
          toast.error(messages.error);
        }
      });
    }
  };

  return (
    <>
      <Popover isOpen={isOpen} onClose={onClose} backdrop="blur" showArrow>
        <PopoverTrigger>
          <Button
            onClick={onOpen}
            isIconOnly
            style={{
              backgroundColor: theme.colors.danger,
            }}
          >
            <TooltipGlobal text="Eliminar la sucursal" color="primary">
              <TrashIcon
                style={{
                  color: theme.colors.primary,
                }}
                size={20}
              />
            </TooltipGlobal>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="w-full p-5">
            <p className="font-semibold text-gray-600 dark:text-white">Eliminar {branch.name}</p>
            <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
              ¿Estas seguro de eliminar este registro?
            </p>
            <div className="mt-4">
              <Button onClick={onClose}>No, cancelar</Button>
              <Button
                onClick={() => handleDelete()}
                className="ml-5"
                style={{
                  backgroundColor: theme.colors.danger,
                  color: theme.colors.primary,
                }}
              >
                Si, eliminar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
