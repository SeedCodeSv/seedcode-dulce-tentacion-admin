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
  RefreshCcw,
  Lock,
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
import NO_DATA from '@/assets/svg/no_data.svg';
import classNames from 'classnames';
import SearchSubCategories from './search_sub_categories_product/SearchSubCategories';
import useWindowSize from '@/hooks/useWindowSize';

interface PProps {
  actions: string[];
}

function ListSubCategory({ actions }: PProps) {
  const { theme } = useContext(ThemeContext);
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
  const { windowSize } = useWindowSize();
  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );
  const handleActivate = (id: number) => {
    activateSubCategories(id).then(() => {
      getSubCategoriesPaginated(1, limit, search, isActive ? 1 : 0);
    });
  };
  return (
    <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
      <div className="w-full h-full border-white border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
        <div className="flex justify-between items-end ">
          <SearchSubCategories
            nameSubCategoryProduct={(name: string) => setSearch(name)}
          ></SearchSubCategories>
          {actions.includes('Agregar') && (
            <AddButton
              onClick={() => {
                setSelectedCategory(undefined);
                modalAdd.onOpen();
              }}
            />
          )}
        </div>

        <div className="hidden flex  grid w-full grid-cols-2 gap-5 md:flex">
          <Input
            startContent={<User />}
            className="w-full xl:w-96 dark:text-white border border-white rounded-xl"
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
            className="mt-6 font-semibold border border-white rounded-xl"
            color="primary"
            onClick={() => handleSearch(undefined)}
          >
            Buscar
          </Button>
        </div>

        <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10">
          <div className="flex justify-between justify-start order-2 lg:order-1">
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
            <div className="w-44">
              <span className="font-semibold text-sm ">Mostrar</span>
              <Select
                className="w-44 dark:text-white border border-white rounded-xl"
                variant="bordered"
                defaultSelectedKeys={'5'}
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
            </div>

            <ButtonGroup className="mt-4 xl:flex hidden border border-white rounded-xl">
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
            <ButtonGroup className="xl:hidden mt-4 border border-white rounded-xl">
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

                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                <div className="flex w-full gap-5">
                                  {categories.isActive && actions.includes('Editar') ? (
                                    <TooltipGlobal text="Editar">
                                      <Button
                                        className="border border-white rounded-xl"
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
                                  ) : (
                                    <Button
                                      type="button"
                                      disabled
                                      style={{
                                        backgroundColor: theme.colors.secondary,
                                      }}
                                      className="flex font-semibold border border-white  cursor-not-allowed"
                                      isIconOnly
                                    >
                                      <Lock className="text-white" />
                                    </Button>
                                  )}
                                  {categories.isActive && actions.includes('Eliminar') ? (
                                    <DeletePopUp subcategory={categories} />
                                  ) : (
                                    <Button
                                      type="button"
                                      disabled
                                      style={{
                                        backgroundColor: theme.colors.danger,
                                      }}
                                      className="flex font-semibold border border-white  cursor-not-allowed"
                                      isIconOnly
                                    >
                                      <Lock className="text-white" />
                                    </Button>
                                  )}
                                  {!categories.isActive && (
                                    <>
                                      {actions.includes('Activar') ? (
                                        <TooltipGlobal text="Activar">
                                          <Button
                                            className="border border-white rounded-xl"
                                            onClick={() => handleActivate(categories.id)}
                                            isIconOnly
                                            style={global_styles().thirdStyle}
                                          >
                                            <RefreshCcw />
                                          </Button>
                                        </TooltipGlobal>
                                      ) : (
                                        <Button
                                          type="button"
                                          disabled
                                          style={global_styles().thirdStyle}
                                          className="flex font-semibold  cursor-not-allowed border border-white"
                                          isIconOnly
                                        >
                                          <Lock />
                                        </Button>
                                      )}
                                    </>
                                  )}

                                  {/*  */}
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

export const DeletePopUp = ({ subcategory }: Props) => {
  const { theme } = useContext(ThemeContext);

  const { deleteSubCategory } = useSubCategoryStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    await deleteSubCategory(subcategory.id);
    onClose();
  };

  return (
    <>
      <Popover
        className="border border-white rounded-2xl"
        isOpen={isOpen}
        onClose={onClose}
        backdrop="blur"
        showArrow
      >
        <PopoverTrigger>
          <Button
            className="border border-white rounded-xl"
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
              <Button className="border border-white" onClick={onClose}>
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
