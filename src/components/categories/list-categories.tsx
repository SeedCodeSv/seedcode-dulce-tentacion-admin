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
} from '@heroui/react';
import { useEffect, useState } from 'react';
import {
  EditIcon,
  User,
  Table as ITable,
  CreditCard,
  RefreshCcw,
  SearchIcon,
  Trash,
} from 'lucide-react';
import { useCategoriesStore } from '../../store/categories.store';
import AddCategory from './add-category';
import AddButton from '../global/AddButton';
import Pagination from '../global/Pagination';
import { CategoryProduct } from '../../types/categories.types';
import classNames from 'classnames';
import { limit_options } from '../../utils/constants';
import SmPagination from '../global/SmPagination';
import NO_DATA from '@/assets/svg/no_data.svg';
import ThGlobal from '@/themes/ui/th-global';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import useThemeColors from '@/themes/use-theme-colors';
import CardCategory from './card-category';
interface PProps {
  actions: string[];
}
function ListCategories({ actions }: PProps) {
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
  const [view, setView] = useState<'table' | 'grid' | 'list'>('table');
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
        <div className="flex justify-between gap-5">
          <div className="flex gap-5">
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
            <div className="flex items-end">
              <ButtonUi
                theme={Colors.Primary}
                startContent={<SearchIcon className="w-10" />}
                onPress={() => handleSearch(undefined)}
              >
                Buscar
              </ButtonUi>
            </div>
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
                label="Cantidad a mostrar"
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

        {(view === 'grid' || view === 'list') && (
          <CardCategory
            handleActive={handleActivate}
            deletePopover={DeletePopUp}
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
                    <ThGlobal className="text-left p-3">No.</ThGlobal>
                    <ThGlobal className="text-left p-3">Nombre</ThGlobal>
                    <ThGlobal className="text-left p-3">Acciones</ThGlobal>
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
                                  {cat.isActive && actions.includes('Editar') && (
                                    <ButtonUi
                                      theme={Colors.Success}
                                      onPress={() => handleEdit(cat)}
                                      isIconOnly
                                    >
                                      <EditIcon size={20} />
                                    </ButtonUi>
                                  )}
                                  {cat.isActive && actions.includes('Eliminar') && (
                                    <DeletePopUp category={cat} />
                                  )}

                                  {cat.isActive === false && (
                                    <>
                                      {actions.includes('Activar') && (
                                        <ButtonUi
                                          theme={Colors.Info}
                                          onPress={() => handleActivate(cat.id)}
                                          isIconOnly
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
      <AddCategory
        isOpen={modalAdd.isOpen}
        closeModal={modalAdd.onClose}
        category={selectedCategory}
      />
    </div>
  );
}

export default ListCategories;
interface Props {
  category: CategoryProduct;
}

export const DeletePopUp = ({ category }: Props) => {
  const style = useThemeColors({ name: Colors.Error });

  const { deleteCategory } = useCategoriesStore();
  const deleteDisclosure = useDisclosure();

  const handleDelete = async () => {
    await deleteCategory(category.id);
    deleteDisclosure.onClose();
  };

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
          <div className="w-full p-5">
            <p className="font-semibold text-gray-600 dark:text-white">Eliminar {category.name}</p>
            <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
              ¿Estas seguro de eliminar este registro?
            </p>
            <div className="flex justify-center gap-5 mt-4">
              <ButtonUi theme={Colors.Default} onPress={() => deleteDisclosure.onClose()}>
                No, cancelar
              </ButtonUi>
              <ButtonUi onPress={() => handleDelete()} theme={Colors.Error}>
                Si, eliminar
              </ButtonUi>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
