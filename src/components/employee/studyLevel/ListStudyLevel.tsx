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
} from '@nextui-org/react';
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

interface PProps {
  actions: string[];
}

function ListStudyLevel({ actions }: PProps) {
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
  // const [isActive, setActive] = useState(true);

  useEffect(() => {
    getPaginatedStudyLevel(1, limit, search, isActive ? 1 : 0);
  }, [limit, isActive]);

  const handleSearch = (name: string | undefined) => {
    getPaginatedStudyLevel(1, limit, name ?? search);
  };

  const modalAdd = useDisclosure();

  // const style = {
  //   backgroundColor: theme.colors.dark,
  //   color: theme.colors.primary,
  // };

  const [view, setView] = useState<'table' | 'grid' | 'list'>('table');

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
    <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
      <div className="flex flex-col w-full p-5 rounded">
        <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-5 lg:flex-row lg:gap-0">
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
              <Button
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.primary,
                }}
                className="hidden mt-6 font-semibold md:flex"
                color="primary"
                endContent={<SearchIcon size={15} />}
                onClick={() => handleSearch(undefined)}
              >
                Buscar
              </Button>
            </div>
          </div>
          <div className="flex items-end justify-between w-full gap-10 lg:justify-end">
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
            <div className="flex items-center gap-5">
              <div className="block md:hidden">
                <TooltipGlobal text="Filtrar">
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
                  onClose={() => setOpenVaul(false)}
                  title="Filtros disponibles"
                >
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-t-[10px] flex-1">
                    <div className="flex flex-col gap-3" />

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
                    <Button
                      // style={{
                      //   backgroundColor: theme.colors.secondary,
                      //   color: theme.colors.primary,
                      // }}
                      className="mt-6 w-full font-semibold"
                      // color="primary"
                      // endContent={<SearchIcon size={15} />}
                      onClick={() => {
                        handleSearch(undefined);
                        setOpenVaul(false);
                      }}
                    >
                      Aplicar filtros
                    </Button>
                  </div>
                </BottomDrawer>
              </div>
            </div>
            {actions.includes('Agregar') && (
              <AddButton
                onClick={() => {
                  setSelectedStatusEmployee(undefined);
                  modalAdd.onOpen();
                }}
              />
            )}
          </div>
        </div>
        <div className="flex justify-end items-end w-full mb-4 gap-5">
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
              <SelectItem key={option} value={option} className="dark:text-white">
                {option}
              </SelectItem>
            ))}
          </Select>
          <div className="flex items-center">
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
                    {/* <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                        Código
                      </th> */}
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
                              {/* <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100">
                                {categories.subCategory.name}
                              </td> */}
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                <div className="flex w-full gap-5">
                                  {actions.includes('Editar') && (
                                    <TooltipGlobal text="Editar">
                                      <Button
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
                                  {actions.includes('Eliminar') && (
                                    <>
                                      {staudyLevel.isActive ? (
                                        <DeletePopUp studyLevel={staudyLevel} />
                                      ) : (
                                        <TooltipGlobal text="Activar">
                                          <Button
                                            onClick={() => handleActivate(staudyLevel.id)}
                                            isIconOnly
                                            style={global_styles().thirdStyle}
                                          >
                                            <RefreshCcw />
                                          </Button>
                                        </TooltipGlobal>
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
          // <DataTable
          //   className="w-full shadow"
          //   emptyMessage="No se encontraron resultados"
          //   value={paginated_study_level.studyLevels}
          //   tableStyle={{ minWidth: '50rem' }}
          //   loading={loading_study_level}
          // >
          //   <Column
          //     headerClassName="text-sm font-semibold"
          //     headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
          //     field="id"
          //     bodyClassName={'dark:text-white'}
          //     header="No."
          //   />
          //   <Column
          //     headerClassName="text-sm font-semibold"
          //     headerStyle={style}
          //     field="name"
          //     bodyClassName={'dark:text-white'}
          //     header="Nombre"
          //   />
          //   <Column
          //     headerClassName="text-sm font-semibold"
          //     headerStyle={style}
          //     field="description"
          //     bodyClassName={'dark:text-white'}
          //     header="Descripción"
          //   />
          //   <Column
          //     headerStyle={{ ...style, borderTopRightRadius: '10px' }}
          //     header="Acciones"
          //     body={(item) => (
          //       <div className="flex gap-6">
          //         {actions.includes('Editar') && (
          //           <TooltipGlobal text="Editar el registro" color="primary">
          //             <Button
          //               onClick={() => handleEdit(item)}
          //               isIconOnly
          //               style={{
          //                 backgroundColor: theme.colors.secondary,
          //               }}
          //             >
          //               <EditIcon style={{ color: theme.colors.primary }} size={20} />
          //             </Button>
          //           </TooltipGlobal>
          //         )}
          //         {actions.includes('Eliminar') && (
          //           <>
          //             {/* <DeletePopUp statusEmployees={item} /> */}
          //             {item.isActive ? (
          //               <DeletePopUp studyLevel={item} />
          //             ) : (
          //               <TooltipGlobal text="Activar la categoría" color="primary">
          //                 <Button
          //                   onClick={() => handleActivate(item.id)}
          //                   isIconOnly
          //                   style={global_styles().thirdStyle}
          //                 >
          //                   <RefreshCcw />
          //                 </Button>
          //               </TooltipGlobal>
          //             )}
          //           </>
          //         )}
          //       </div>
          //     )}
          //   />
          // </DataTable>
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
      <Popover isOpen={isOpen} onClose={onClose} backdrop="blur" showArrow>
        <PopoverTrigger>
          <Button
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
