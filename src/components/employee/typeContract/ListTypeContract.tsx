import {
  Input,
  Button,
  useDisclosure,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Switch,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import {
  EditIcon,
  User,
  TrashIcon,
  Filter,
  RefreshCcw,
  SearchIcon,
} from 'lucide-react';
import classNames from 'classnames';

import AddButton from '../../global/AddButton';
import Pagination from '../../global/Pagination';
import HeadlessModal from '../../global/HeadlessModal';
import SmPagination from '../../global/SmPagination';
import { limit_options } from '../../../utils/constants';
import { statusEmployee } from '../../../types/statusEmployee.types';
import { useContractTypeStore } from '../../../store/contractType';
import { ContractType } from '../../../types/contarctType.types';

import AddTypeContract from './AddTypeContract';

import TooltipGlobal from '@/components/global/TooltipGlobal';
import BottomDrawer from '@/components/global/BottomDrawer';
import { ArrayAction } from '@/types/view.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ThGlobal from '@/themes/ui/th-global';
import useThemeColors from '@/themes/use-theme-colors';
import DivGlobal from '@/themes/ui/div-global';
import EmptyTable from '@/components/global/EmptyTable';
import useWindowSize from '@/hooks/useWindowSize';

function ListContractType({ actions }: ArrayAction) {
  const [openVaul, setOpenVaul] = useState(false);

  const {
    paginated_contract_type,
    activateContractType,
    getPaginatedContractType,
    loading_contract_type,
  } = useContractTypeStore();

  const [selectedContractType, setContractType] = useState<
    { id: number; name: string } | undefined
  >();

  const { windowSize } = useWindowSize()

  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(5);
  const [isActive, setActive] = useState(true);

  useEffect(() => {
    getPaginatedContractType(1, limit, search, isActive ? 1 : 0);
  }, [limit, isActive]);

  const handleSearch = (name: string | undefined) => {
    getPaginatedContractType(1, limit, name ?? search);
  };

  const modalAdd = useDisclosure();
  const handleEdit = (item: ContractType) => {
    setContractType({
      id: item.id,
      name: item.name,
    });
    modalAdd.onOpen();
  };
  const handleActivate = (id: number) => {
    activateContractType(id).then(() => {
      getPaginatedContractType(1, limit, search, isActive ? 1 : 0);
    });
  };

  return (
    <DivGlobal>
      <div className="flex justify-between items-end ">
        <div className="grid w-full grid-cols-2 gap-5 md:flex ">
          <div className="w-full flex gap-4">
            <Input
              isClearable
              className="w-full xl:w-96 dark:text-white border border-white rounded-xl hidden md:flex"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              label="Nombre"
              labelPlacement="outside"
              placeholder="Escribe para buscar..."
              startContent={<User />}
              value={search}
              variant="bordered"
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => {
                setSearch('');
                handleSearch('');
              }}
            />
            {windowSize.width > 768 && (
              <ButtonUi
                startContent={<SearchIcon className="w-10" />}
                theme={Colors.Primary}
                onPress={() => handleSearch(undefined)}
              >
                Buscar
              </ButtonUi>
            )}

          </div>

          <div className="flex mt-6">
            <div className={`${windowSize.width < 768 ?'ml-20 mr-2':'w-full justify-end'}`}>
              {actions.includes('Agregar') && (
                <AddButton
                  onClick={() => {
                    setContractType(undefined);
                    modalAdd.onOpen();
                  }}
                />
              )}
            </div>
            <div className="block md:hidden">
              <TooltipGlobal text="Filtrar">
                <ButtonUi isIconOnly theme={Colors.Info} onPress={() => setOpenVaul(true)}>
                  <Filter />
                </ButtonUi>
              </TooltipGlobal>
              <BottomDrawer
                open={openVaul}
                title="Filtros disponibles"
                onClose={() => setOpenVaul(false)}
              >
                <div className="flex flex-col  gap-2">
                  <Input
                    isClearable
                    className="w-full xl:w-96 dark:text-white border border-white rounded-xl"
                    classNames={{
                      label: 'font-semibold text-gray-700',
                      inputWrapper: 'pr-0',
                    }}
                    label="Nombre"
                    labelPlacement="outside"
                    placeholder="Escribe para buscar..."
                    startContent={<User />}
                    value={search}
                    variant="bordered"
                    onChange={(e) => setSearch(e.target.value)}
                    onClear={() => {
                      setSearch('');
                      handleSearch('');
                    }}
                  />

                  <ButtonUi
                    className="mt-6 font-semibold border border-white rounded-xl"
                    startContent={<SearchIcon className="w-10" />}
                    theme={Colors.Primary}
                    onPress={() => {
                      handleSearch(undefined);
                      setOpenVaul(false);
                    }}
                  >
                    Buscar
                  </ButtonUi>
                </div>
              </BottomDrawer>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10 ">
        <div className="flex justify-start order-2 lg:order-1">
          <div className="xl:mt-10">
            <Switch
              classNames={{
                thumb: classNames(isActive ? 'bg-blue-500' : 'bg-gray-400'),
                wrapper: classNames(isActive ? '!bg-blue-300' : 'bg-gray-200'),
              }}
              isSelected={isActive}
              onValueChange={(isActive) => setActive(isActive)}
            >
              <span className="text-sm sm:text-base whitespace-nowrap">
                Mostrar {isActive ? 'inactivos' : 'activos'}
              </span>
            </Switch>
          </div>
        </div>
        <div className="flex gap-10 w-full justify-between items-center lg:justify-end order-1 lg:order-2">
          <div className="w-[150px]">
            <span className="  font-semibold text-white text-sm">Mostrar</span>
            <Select
              className="w-44 dark:text-white border border-white rounded-xl"
              classNames={{
                label: 'font-semibold',
              }}
              defaultSelectedKeys={['5']}
              labelPlacement="outside"
              value={limit}
              variant="bordered"
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
        </div>
      </div>
      <>
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
              {loading_contract_type ? (
                <tr>
                  <td className="p-3 text-sm text-center text-slate-500" colSpan={5}>
                    <div className="flex flex-col items-center justify-center w-full h-64">
                      <div className="loader" />
                      <p className="mt-3 text-xl font-semibold">Cargando...</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {paginated_contract_type.contractTypes.length > 0 ? (
                    <>
                      {paginated_contract_type.contractTypes.map((contractType, index) => (
                        <tr key={index} className="border-b border-slate-200">
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {contractType.id}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                            {contractType.name}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            <div className="flex w-full gap-5">
                              {actions.includes('Editar') && contractType.isActive && (
                                <>
                                  <ButtonUi
                                    isIconOnly
                                    theme={Colors.Success}
                                    onPress={() => {
                                      handleEdit(contractType);
                                      modalAdd.onOpen();
                                    }}
                                  >
                                    <EditIcon size={20} />
                                  </ButtonUi>
                                </>
                              )}
                              {actions.includes('Eliminar') && contractType.isActive && (
                                <DeletePopUp ContractTypes={contractType} />
                              )}
                              {contractType.isActive === false && (
                                <>
                                  {actions.includes('Activar') && (
                                    <ButtonUi
                                      isIconOnly
                                      theme={Colors.Primary}
                                      onPress={() => handleActivate(contractType.id)}
                                    >
                                      <RefreshCcw />
                                    </ButtonUi>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        <EmptyTable />
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </>
      {paginated_contract_type.totalPag > 1 && (
        <>
          <div className="hidden w-full mt-5 md:flex">
            <Pagination
              currentPage={paginated_contract_type.currentPag}
              nextPage={paginated_contract_type.nextPag}
              previousPage={paginated_contract_type.prevPag}
              totalPages={paginated_contract_type.totalPag}
              onPageChange={(page) => {
                getPaginatedContractType(page, limit, search);
              }}
            />
          </div>
          <div className="flex w-full mt-5 md:hidden">
            <div className="flex w-full mt-5 md:hidden">
              <SmPagination
                currentPage={paginated_contract_type.currentPag}
                handleNext={() => {
                  getPaginatedContractType(paginated_contract_type.nextPag, limit, search);
                }}
                handlePrev={() => {
                  getPaginatedContractType(paginated_contract_type.prevPag, limit, search);
                }}
                totalPages={paginated_contract_type.totalPag}
              />
            </div>
          </div>
        </>
      )}
      <HeadlessModal
        isOpen={modalAdd.isOpen}
        size="w-[350px] md:w-[500px]"
        title={selectedContractType ? 'Editar tipo de contrato' : 'Nuevo tipo de contrato'}
        onClose={modalAdd.onClose}
      >
        <AddTypeContract ContractTypes={selectedContractType} closeModal={modalAdd.onClose} />
      </HeadlessModal>
    </DivGlobal>
  );
}

export default ListContractType;
interface Props {
  ContractTypes: statusEmployee;
}

const DeletePopUp = ({ ContractTypes }: Props) => {
  const { deleteContractType } = useContractTypeStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    await deleteContractType(ContractTypes.id);
    onClose();
  };

  const style = useThemeColors({ name: Colors.Error });

  return (
    <>
      <Popover showArrow backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>
          <Button isIconOnly style={style} onPress={onOpen}>
            <TrashIcon size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="w-full p-5 flex flex-col items-center justify-cente">
            <p className="font-semibold text-gray-600 dark:text-white">
              Eliminar {ContractTypes.name}
            </p>
            <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
              ¿Estas seguro de eliminar este registro?
            </p>
            <div className="mt-4 flex justify-center">
              <ButtonUi theme={Colors.Default} onPress={onClose}>
                No, cancelar
              </ButtonUi>
              <ButtonUi className="ml-5" theme={Colors.Error} onPress={() => handleDelete()}>
                Si, eliminar
              </ButtonUi>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
