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
} from 'lucide-react';
import { ThemeContext } from '../../hooks/useTheme';
import AddSubCategory from './AddSubCategory';
import AddButton from '../global/AddButton';
import MobileView from './MobileView';
import Pagination from '../global/Pagination';
import { global_styles } from '../../styles/global.styles';
import { limit_options } from '../../utils/constants';
import SmPagination from '../global/SmPagination';
import HeadlessModal from '../global/HeadlessModal';
import { ISubCategory } from '../../types/sub_categories.types';
import { useSubCategoryStore } from '../../store/sub-category';
import TooltipGlobal from '../global/TooltipGlobal';
import BottomDrawer from '../global/BottomDrawer';
import NO_DATA from '@/assets/svg/no_data.svg';
import classNames from 'classnames';

interface PProps {
  actions: string[];
}

function ListSubCategory({ actions }: PProps) {
  const { theme } = useContext(ThemeContext);
  const [openVaul, setOpenVaul] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ISubCategory>();
  const {
    sub_categories_paginated,
    loading_sub_categories,
    getSubCategoriesPaginated,
    activateSubCategories,
  } = useSubCategoryStore();

  const modalAdd = useDisclosure();
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(5);
  const [isActive, setActive] = useState(true);

  useEffect(() => {
    getSubCategoriesPaginated(1, limit, search, isActive ? 1 : 0);
  }, [limit, isActive]);

  const handleSearch = (name: string | undefined) => {
    getSubCategoriesPaginated(1, limit, name ?? search);
  };

  // const style = {
  //   backgroundColor: theme.colors.dark,
  //   color: theme.colors.primary,
  // };

  const [view, setView] = useState<'table' | 'grid' | 'list'>('table');

  const handleActivate = (id: number) => {
    activateSubCategories(id).then(() => {
      getSubCategoriesPaginated(1, limit, search, isActive ? 1 : 0);
    });
  };

  return (
    <div className=" w-full h-full xl:p-10  p-5 bg-gray-50 dark:bg-gray-900">
      <div className="w-full h-full border-white border border-white p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
        <div className="flex flex-col justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
          <div className="flex items-end gap-3">
            <div className="hidden w-full gap-3 md:flex">
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
                className="mt-6 font-semibold"
                color="primary"
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
                      <Button
                        // style={{
                        //   backgroundColor: theme.colors.secondary,
                        //   color: theme.colors.primary,
                        // }}
                        className="mt-6 font-semibold"
                        // color="primary"
                        onClick={() => {
                          handleSearch(undefined);
                          setOpenVaul(false);
                        }}
                      >
                        Buscar
                      </Button>
                    </div>
                  </div>
                </BottomDrawer>
              </div>
            </div>
            {actions.includes('Agregar') && (
              <AddButton
                onClick={() => {
                  setSelectedCategory(undefined);
                  modalAdd.onOpen();
                }}
              />
            )}
          </div>
        </div>
        <div className="flex items-end justify-end w-full gap-5 mb-5">
          <Select
            className="w-44 dark:text-white"
            variant="bordered"
            defaultSelectedKeys={'5'}
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
          {/* <div className="items-center hidden">
            <Switch onValueChange={(active) => setActive(active)} isSelected={active}>
              <span className="text-sm sm:text-base whitespace-nowrap">
                Mostrar {active ? 'inactivos' : 'activos'}
              </span>
            </Switch>
          </div> */}
        </div>
        {(view === 'grid' || view === 'list') && (
          <MobileView
            handleActive={handleActivate}
            deletePopover={DeletePopUp}
            layout={view as 'grid' | 'list'}
            handleEdit={(item) => {
              setSelectedCategory(item);
              modalAdd.onOpen();
            }}
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
                      Sub categoría
                    </th>
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="max-h-[600px] w-full overflow-y-auto">
                  {loading_sub_categories ? (
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
                      {sub_categories_paginated.SubCategories.length > 0 ? (
                        <>
                          {sub_categories_paginated.SubCategories.map((categories) => (
                            <tr className="border-b border-slate-200">
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {categories.id}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                {categories.name}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {categories.categoryProduct.name}
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
                                          setSelectedCategory(categories);

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
                                      {categories.isActive ? (
                                        <DeletePopUp subcategory={categories} />
                                      ) : (
                                        <TooltipGlobal text="Activar">
                                          <Button
                                            onClick={() => handleActivate(categories.id)}
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

        )}
        {sub_categories_paginated.totalPag > 1 && (
          <>
            <div className="hidden w-full mt-5 md:flex">
              <Pagination
                previousPage={sub_categories_paginated.prevPag}
                nextPage={sub_categories_paginated.nextPag}
                currentPage={sub_categories_paginated.currentPag}
                totalPages={sub_categories_paginated.totalPag}
                onPageChange={(page) => {
                  getSubCategoriesPaginated(page, limit, search);
                }}
              />
            </div>
            <div className="flex w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-lg p-3">

                <SmPagination
                  handleNext={() => {
                    getSubCategoriesPaginated(sub_categories_paginated.nextPag, limit, search);
                  }}
                  handlePrev={() => {
                    getSubCategoriesPaginated(sub_categories_paginated.prevPag, limit, search);
                  }}
                  currentPage={sub_categories_paginated.currentPag}
                  totalPages={sub_categories_paginated.totalPag}
                />
            
            </div>
          </>
        )}
      </div>
      <HeadlessModal
        size="w-[350px] md:w-[500px]"
        title={selectedCategory ? 'Editar sub categoría' : 'Nueva Sub-categoría'}
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
      >
        <AddSubCategory closeModal={modalAdd.onClose} subCategory={selectedCategory} />
      </HeadlessModal>
    </div>
  );
}

export default ListSubCategory;
interface Props {
  subcategory: ISubCategory;
}

const DeletePopUp = ({ subcategory }: Props) => {
  const { theme } = useContext(ThemeContext);

  const { deleteSubCategory } = useSubCategoryStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    await deleteSubCategory(subcategory.id);
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
          <div className="flex flex-col items-center justify-center w-full p-5">
            <p className="font-semibold text-gray-600 dark:text-white">
              Eliminar {subcategory.name}
            </p>
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
