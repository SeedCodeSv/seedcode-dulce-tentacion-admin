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
  RefreshCcw,
  Lock,
  SearchIcon,
} from 'lucide-react';
import { useCategoriesStore } from '../../store/categories.store';
import { ThemeContext } from '../../hooks/useTheme';
import AddCategory from './AddCategory';
import AddButton from '../global/AddButton';
import MobileView from './MobileView';
import Pagination from '../global/Pagination';
import { CategoryProduct } from '../../types/categories.types';
import { global_styles } from '../../styles/global.styles';
import classNames from 'classnames';
import { limit_options } from '../../utils/constants';
import SmPagination from '../global/SmPagination';
import HeadlessModal from '../global/HeadlessModal';
import useWindowSize from '@/hooks/useWindowSize';
import TooltipGlobal from '../global/TooltipGlobal';
import NO_DATA from '@/assets/svg/no_data.svg';
import SearchCategoryProduct from './search_category_product/SearchCategoryProduct';
interface PProps {
  actions: string[];
}
function ListCategories({ actions }: PProps) {
  const { theme } = useContext(ThemeContext);
  const { paginated_categories, getPaginatedCategories, activateCategory, loading_categories } =
    useCategoriesStore();
  const [selectedCategory, setSelectedCategory] = useState<
    { id: number; name: string } | undefined
  >();
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(5);
  const [active, setActive] = useState(true);
  useEffect(() => {
    getPaginatedCategories(1, limit, search, active ? 1 : 0);
  }, [limit, active]);
  const handleSearch = (name: string | undefined) => {
    getPaginatedCategories(1, limit, name ?? search);
  };
  const modalAdd = useDisclosure();
  const { windowSize } = useWindowSize();
  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );
  const handleEdit = (item: CategoryProduct) => {
    setSelectedCategory({
      id: item.id,
      name: item.name,
    });
    modalAdd.onOpen();
  };
  const handleActivate = (id: number) => {
    activateCategory(id).then(() => {
      getPaginatedCategories(1, limit, search, active ? 1 : 0);
    });
  };

  return (
    <div className=" w-full h-full bg-white dark:bg-gray-900">
      <div className="w-full h-full  border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
        <div className="flex justify-between items-end ">
          <div>
            <SearchCategoryProduct
              nameCategoryProduct={(name) => setSearch(name)}
            ></SearchCategoryProduct>
          </div>
        </div>
        <div className="flex justify-between gap-5 md:flex">
          <div className="flex gap-5">
            <Input
              startContent={<User />}
              className="w-full xl:w-96 dark:text-white border border-white rounded-xl hidden md:flex "
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
              startContent={<SearchIcon className="w-10" />}
              onClick={() => handleSearch(undefined)}
            >
              Buscar
            </Button>
          </div>

          <div className="flex gap-5 mt-6">
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

        <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10">
          <div className="flex justify-start order-2 lg:order-1">
            <div className="xl:mt-10">
              <Switch
                onValueChange={(active) => setActive(active)}
                isSelected={active}
                classNames={{
                  thumb: classNames(active ? 'bg-blue-500' : 'bg-gray-400'),
                  wrapper: classNames(active ? '!bg-blue-300' : 'bg-gray-200'),
                }}
              >
                <span className="text-sm sm:text-base whitespace-nowrap">
                  Mostrar {active ? 'inactivos' : 'activos'}
                </span>
              </Switch>
            </div>
          </div>
          <div className="flex gap-10 w-full justify-between items-center lg:justify-end order-1 lg:order-2">
            <div className="w-[150px]">
              <label className="  font-semibold text-white text-sm">Mostrar</label>
              <Select
                className="max-w-44 dark:text-white border border-white rounded-xl "
                variant="bordered"
                labelPlacement="outside"
                defaultSelectedKeys={['5']}
                classNames={{
                  label: 'font-semibold',
                }}
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                }}
              >
                {limit_options.map((limit) => (
                  <SelectItem key={limit} className="dark:text-white">
                    {limit}
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
                    <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="max-h-[600px] w-full overflow-y-auto">
                  {loading_categories ? (
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
                      {paginated_categories.categoryProducts.length > 0 ? (
                        <>
                          {paginated_categories.categoryProducts.map((cat) => (
                            <tr className="border-b border-slate-200" key={cat.id}>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {cat.id}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                {cat.name}
                              </td>
                              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                <div className="flex gap-6">
                                  {cat.isActive && actions.includes('Editar') ? (
                                    <TooltipGlobal text="Editar el registro" color="primary">
                                      <Button
                                        className="border border-white"
                                        onClick={() => handleEdit(cat)}
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
                                      <Lock />
                                    </Button>
                                  )}
                                  {cat.isActive && actions.includes('Eliminar') ? (
                                    <DeletePopUp category={cat} />
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
                                      <Lock />
                                    </Button>
                                  )}

                                  {cat.isActive === false && (
                                    <>
                                      {actions.includes('Activar') ? (
                                        <TooltipGlobal text="Activar la categoría" color="primary">
                                          <Button
                                            className="border border-white"
                                            onClick={() => handleActivate(cat.id)}
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
                                          className="flex font-semibold  cursor-not-allowed"
                                          isIconOnly
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
        {paginated_categories.totalPag > 1 && (
          <>
            <div className="hidden w-full mt-5 md:flex">
              <Pagination
                previousPage={paginated_categories.prevPag}
                nextPage={paginated_categories.nextPag}
                currentPage={paginated_categories.currentPag}
                totalPages={paginated_categories.totalPag}
                onPageChange={(page) => {
                  getPaginatedCategories(page, limit, search);
                }}
              />
            </div>
            <div className="flex w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-lg p-3">
              <SmPagination
                handleNext={() => {
                  getPaginatedCategories(paginated_categories.nextPag, limit, search);
                }}
                handlePrev={() => {
                  getPaginatedCategories(paginated_categories.prevPag, limit, search);
                }}
                currentPage={paginated_categories.currentPag}
                totalPages={paginated_categories.totalPag}
              />
            </div>
          </>
        )}
      </div>
      <HeadlessModal
        size="w-[350px] md:w-[500px]"
        title={selectedCategory ? 'Editar categoría' : 'Nueva categoría'}
        isOpen={modalAdd.isOpen}
        onClose={modalAdd.onClose}
      >
        <AddCategory closeModal={modalAdd.onClose} category={selectedCategory} />
      </HeadlessModal>
    </div>
  );
}

export default ListCategories;
interface Props {
  category: CategoryProduct;
}

export const DeletePopUp = ({ category }: Props) => {
  const { theme } = useContext(ThemeContext);

  const { deleteCategory } = useCategoriesStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    await deleteCategory(category.id);
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
            className="border border-white"
            onClick={onOpen}
            isIconOnly
            style={{
              backgroundColor: theme.colors.danger,
            }}
          >
            <TooltipGlobal text="Eliminar la categoría" color="primary">
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
            <p className="font-semibold text-gray-600 dark:text-white">Eliminar {category.name}</p>
            <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
              ¿Estas seguro de eliminar este registro?
            </p>
            <div className="flex justify-center mt-4">
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
