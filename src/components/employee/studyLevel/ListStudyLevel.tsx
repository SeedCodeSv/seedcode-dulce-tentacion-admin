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
import NO_DATA from '@/assets/svg/no_data.svg';
import classNames from 'classnames';
import AddButton from '../../global/AddButton';
import Pagination from '../../global/Pagination';
import { limit_options } from '../../../utils/constants';
import { useStatusStudyLevel } from '@/store/studyLevel';
import { StudyLevel } from '@/types/study_level.types';
import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { ArrayAction } from '@/types/view.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ThGlobal from '@/themes/ui/th-global';
import useThemeColors from '@/themes/use-theme-colors';
import HeadlessModal from '@/components/global/HeadlessModal';
import AddStudyLevel from './AddStudyLevel';

function ListStudyLevel({ actions }: ArrayAction) {
  const [openVaul, setOpenVaul] = useState(false);
  const [isActive, setActive] = useState(true);

  const { paginated_study_level, activateStudyLevel, getPaginatedStudyLevel, loading_study_level } =
    useStatusStudyLevel();

  const [selectedStatusEmployee, setSelectedStatusEmployee] = useState<
    { id: number; name: string; description: string } | undefined
  >();

  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    getPaginatedStudyLevel(1, limit, search, isActive ? 1 : 0);
  }, [limit, isActive]);

  const handleSearch = (name: string | undefined) => {
    getPaginatedStudyLevel(1, limit, name ?? search);
  };

  const modalAdd = useDisclosure();

  const handleEdit = (item: StudyLevel) => {
    setSelectedStatusEmployee({
      id: item.id,
      name: item.name,
      description: item.description,
    });
    modalAdd.onOpen();
  };

  const handleActivate = (id: number) => {
    activateStudyLevel(id).then(() => {
      getPaginatedStudyLevel(1, limit, search, isActive ? 1 : 0);
    });
  };

  return (
    <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
      <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
        <div className="grid w-full grid-cols-2 gap-5 md:flex">
          <div className="w-full flex gap-4">
            <Input
              startContent={<User />}
              className="w-full xl:w-96 dark:text-white border border-white rounded-xl font-semibold hidden md:flex"
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
              className="hidden mt-6 font-semibold md:flex border border-white rounded-xl"
              color="primary"
              startContent={<SearchIcon size={23} />}
              onPress={() => handleSearch(undefined)}
            >
              Buscar
            </ButtonUi>
          </div>

          <div className="flex  mt-6">
            <div className="justify-end w-full">
              {actions.includes('Agregar') && (
                <AddButton
                  onClick={() => {
                    setSelectedStatusEmployee(undefined);
                    modalAdd.onOpen();
                  }}
                />
              )}
            </div>
            <div className="md:hidden justify-start ">
              <TooltipGlobal text="Filtrar">
                <ButtonUi
                  className="border border-white rounded-xl"
                  theme={Colors.Info}
                  isIconOnly
                  onPress={() => setOpenVaul(true)}
                  type="button"
                >
                  <Filter />
                </ButtonUi>
              </TooltipGlobal>
              <BottomDrawer
                open={openVaul}
                onClose={() => setOpenVaul(false)}
                title="Filtros disponibles"
              >
                <div className="flex flex-col  gap-2">
                  <Input
                    startContent={<User />}
                    className="w-full xl:w-96 dark:text-white border border-white rounded-xl font"
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

        <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10">
          <div className="flex justify-start order-2 lg:order-1">
            <div className="xl:mt-10">
              <Switch
                onValueChange={(isActive) => setActive(isActive)}
                isSelected={isActive}
                classNames={{
                  thumb: classNames(isActive ? 'bg-blue-500' : 'bg-gray-400'),
                  wrapper: classNames(isActive ? '!bg-blue-300' : 'bg-gray-200'),
                }}
              >
                <span className="text-sm sm:text-base whitespace-nowrap">
                  Mostrar {isActive ? 'inactivos' : 'activos'}
                </span>
              </Switch>
            </div>
          </div>
          <div className="flex gap-10 w-full justify-between items-center lg:justify-end order-1 lg:order-2">
            <div className="w-[150px]">
              <label className="  font-semibold text-white text-sm">Mostrar</label>
              <Select
                className="w-44 dark:text-white border border-white rounded-xl"
                variant="bordered"
                labelPlacement="outside"
                defaultSelectedKeys={['5']}
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
          </div>
        </div>
        <>
          <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  <ThGlobal className="text-left p-3">No.</ThGlobal>
                  <ThGlobal className="text-left p-3">Nombre</ThGlobal>
                  <ThGlobal className="text-left p-3">Descripción</ThGlobal>
                  <ThGlobal className="text-left p-3">Acciones</ThGlobal>
                </tr>
              </thead>
              <tbody className="max-h-[600px] w-full overflow-y-auto">
                {loading_study_level ? (
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
                    {paginated_study_level.studyLevels.length > 0 ? (
                      <>
                        {paginated_study_level.studyLevels.map((staudyLevel) => (
                          <tr className="border-b border-slate-200">
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {staudyLevel.id}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                              {staudyLevel.name}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {staudyLevel.description}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              <div className="flex w-full gap-5">
                                {actions.includes('Editar') && staudyLevel.isActive && (
                                  <>
                                    {staudyLevel.isActive && (
                                      <ButtonUi
                                        className="border border-white"
                                        onPress={() => {
                                          handleEdit(staudyLevel);
                                          modalAdd.onOpen();
                                        }}
                                        isIconOnly
                                        theme={Colors.Success}
                                      >
                                        <EditIcon size={20} />
                                      </ButtonUi>
                                    )}
                                  </>
                                )}
                                {actions.includes('Eliminar') && staudyLevel.isActive && (
                                  <DeletePopUp studyLevel={staudyLevel} />
                                )}
                                {staudyLevel.isActive === false && (
                                  <>
                                    {actions.includes('Activar') && (
                                      <ButtonUi
                                        onPress={() => handleActivate(staudyLevel.id)}
                                        isIconOnly
                                        theme={Colors.Primary}
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
        </>
        {paginated_study_level.totalPag > 1 && (
          <>
            <div className="w-full mt-5 flex">
              <Pagination
                previousPage={paginated_study_level.prevPag}
                nextPage={paginated_study_level.nextPag}
                currentPage={paginated_study_level.currentPag}
                totalPages={paginated_study_level.totalPag}
                onPageChange={(page) => {
                  getPaginatedStudyLevel(page, limit, search);
                }}
              />
            </div>
          </>
        )}
      </div>
      <HeadlessModal
        size="w-[350px] md:w-[500px]"
        title={selectedStatusEmployee ? 'Editar nivel de estudio' : 'Nuevo nivel de estudio'}
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
      >
        <AddStudyLevel closeModal={modalAdd.onClose} studyLevel={selectedStatusEmployee} />
      </HeadlessModal>
    </div>
  );
}

export default ListStudyLevel;
interface Props {
  studyLevel: StudyLevel;
}

const DeletePopUp = ({ studyLevel }: Props) => {
  const { deleteStudyLevel } = useStatusStudyLevel();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    await deleteStudyLevel(studyLevel.id);
    onClose();
  };

  const style = useThemeColors({name: Colors.Error})

  return (
    <>
      <Popover
        isOpen={isOpen}
        className="border border-white rounded-xl"
        onClose={onClose}
        backdrop="blur"
        showArrow
      >
        <PopoverTrigger>
          <Button
            className="border border-white"
            onPress={onOpen}
            isIconOnly
            style={style}
          >
            <TrashIcon
              size={20}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="w-full p-5 flex flex-col items-center justify-cente">
            <p className="font-semibold text-gray-600 dark:text-white">
              Eliminar {studyLevel.name}
            </p>
            <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
              ¿Estas seguro de eliminar este registro?
            </p>
            <div className="mt-4 flex justify-center">
              <ButtonUi theme={Colors.Default} onPress={onClose}>
                No, cancelar
              </ButtonUi>
              <ButtonUi
                onPress={() => handleDelete()}
                className="ml-5"
                theme={Colors.Error}
              >
                Si, eliminar
              </ButtonUi>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
