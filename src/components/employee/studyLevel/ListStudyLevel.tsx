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
  Switch,
} from "@heroui/react";
import { useContext, useEffect, useState } from 'react';
import {
  EditIcon,
  User,
  TrashIcon,
  Table as ITable,
  CreditCard,
  List,
  Filter,
  RefreshCcw,
  SearchIcon,
  Lock,
} from 'lucide-react';

import NO_DATA from '@/assets/svg/no_data.svg';
import classNames from 'classnames';
import { ThemeContext } from '../../../hooks/useTheme';
import { global_styles } from '../../../styles/global.styles';
import AddButton from '../../global/AddButton';
import Pagination from '../../global/Pagination';
import HeadlessModal from '../../global/HeadlessModal';
import SmPagination from '../../global/SmPagination';
import { limit_options } from '../../../utils/constants';
import MobileView from './MobileView';
import AddStudyLevel from './AddStudyLevel';
import { useStatusStudyLevel } from '@/store/studyLevel';
import { StudyLevel } from '@/types/study_level.types';
import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { ArrayAction } from '@/types/view.types';
import NotAddButton from '@/components/global/NoAdd';
import useWindowSize from '@/hooks/useWindowSize';

function ListStudyLevel({ actions }: ArrayAction) {
  const { theme } = useContext(ThemeContext);
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

  // const [view, setView] = useState<'table' | 'grid' | 'list'>('table');
  const { windowSize } = useWindowSize();
  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );

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
            <Button
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.primary,
              }}
              className="hidden mt-6 font-semibold md:flex border border-white rounded-xl"
              color="primary"
              startContent={<SearchIcon size={23} />}
              onClick={() => handleSearch(undefined)}
            >
              Buscar
            </Button>
          </div>

          <div className="flex  mt-6">
            <div className="justify-end w-full">
              {actions.includes('Agregar') ? (
                <AddButton
                  onClick={() => {
                    setSelectedStatusEmployee(undefined);
                    modalAdd.onOpen();
                  }}
                />
              ) : (
                <NotAddButton></NotAddButton>
              )}
            </div>
            <div className="md:hidden justify-start ">
              <TooltipGlobal text="Filtrar">
                <Button
                  className="border border-white rounded-xl"
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
                  <Button
                    style={{
                      backgroundColor: theme.colors.secondary,
                      color: theme.colors.primary,
                      fontSize: '16px',
                    }}
                    className="mt-6 font-semibold"
                    onClick={() => {
                      handleSearch(undefined);
                      setOpenVaul(false);
                    }}
                  >
                    Buscar
                  </Button>
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
            <ButtonGroup className="xl:flex hidden mt-4 border border-white rounded-xl ">
              <Button
                className="hidden md:inline-flex"
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
            <ButtonGroup className=" xl:hidden mt-4 border border-white rounded-xl ">
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
          <>
            <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
              <table className="w-full">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      No.
                    </th>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Nombre
                    </th>
                    <th className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Descripción
                    </th>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Acciones
                    </th>
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
                                  {actions.includes('Editar') && staudyLevel.isActive ? (
                                    <>
                                      {staudyLevel.isActive && (
                                        <TooltipGlobal text="Editar">
                                          <Button
                                            className="border border-white"
                                            onClick={() => {
                                              handleEdit(staudyLevel);

                                              modalAdd.onOpen();
                                            }}
                                            isIconOnly
                                            style={{
                                              backgroundColor: theme.colors.secondary,
                                            }}
                                          >
                                            <EditIcon
                                              style={{
                                                color: theme.colors.primary,
                                              }}
                                              size={20}
                                            />
                                          </Button>
                                        </TooltipGlobal>
                                      )}
                                    </>
                                  ) : (
                                    <Button
                                      className="border border-white"
                                      isIconOnly
                                      style={{
                                        backgroundColor: theme.colors.secondary,
                                        cursor: 'not-allowed',
                                      }}
                                    >
                                      <Lock style={{ color: theme.colors.primary }} size={20} />
                                    </Button>
                                  )}
                                  {actions.includes('Eliminar') && staudyLevel.isActive ? (
                                    <DeletePopUp studyLevel={staudyLevel} />
                                  ) : (
                                    <Button
                                      className="border border-white"
                                      isIconOnly
                                      style={{ backgroundColor: theme.colors.danger }}
                                    >
                                      <Lock
                                        style={{
                                          color: theme.colors.primary,
                                          cursor: 'not-allowed',
                                        }}
                                        size={20}
                                      />
                                    </Button>
                                  )}
                                  {staudyLevel.isActive === false && (
                                    <>
                                      {actions.includes('Activar') ? (
                                        <Button
                                          className="border border-white"
                                          onClick={() => handleActivate(staudyLevel.id)}
                                          isIconOnly
                                          style={global_styles().thirdStyle}
                                        >
                                          <RefreshCcw />
                                        </Button>
                                      ) : (
                                        <Button
                                          className="border border-white"
                                          isIconOnly
                                          style={{
                                            ...global_styles().thirdStyle,
                                            cursor: 'not-allowed',
                                          }}
                                        >
                                          <Lock />
                                        </Button>
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
        )}
        {paginated_study_level.totalPag > 1 && (
          <>
            <div className="hidden w-full mt-5 md:flex">
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
            <div className="flex w-full mt-5 md:hidden">
              <div className="flex w-full mt-5 md:hidden">
                <SmPagination
                  handleNext={() => {
                    getPaginatedStudyLevel(paginated_study_level.nextPag, limit, search);
                  }}
                  handlePrev={() => {
                    getPaginatedStudyLevel(paginated_study_level.prevPag, limit, search);
                  }}
                  currentPage={paginated_study_level.currentPag}
                  totalPages={paginated_study_level.totalPag}
                />
              </div>
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
  const { theme } = useContext(ThemeContext);

  const { deleteStudyLevel } = useStatusStudyLevel();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    await deleteStudyLevel(studyLevel.id);
    onClose();
  };

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
            onClick={onOpen}
            isIconOnly
            style={{
              backgroundColor: theme.colors.danger,
            }}
          >
            <TrashIcon
              style={{
                color: theme.colors.primary,
              }}
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
              <Button className="border border-white " onClick={onClose}>
                No, cancelar
              </Button>
              <Button
                onClick={() => handleDelete()}
                className="ml-5 border border-white"
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
