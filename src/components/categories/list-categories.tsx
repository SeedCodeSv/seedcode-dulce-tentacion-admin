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
import { EditIcon, User, RefreshCcw, SearchIcon, Trash } from 'lucide-react';
import classNames from 'classnames';

import { useCategoriesStore } from '../../store/categories.store';
import AddButton from '../global/AddButton';
import Pagination from '../global/Pagination';
import { CategoryProduct } from '../../types/categories.types';
import { limit_options } from '../../utils/constants';
import EmptyTable from '../global/EmptyTable';
import LoadingTable from '../global/LoadingTable';

import AddCategory from './add-category';
import CardCategory from './card-category';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import useThemeColors from '@/themes/use-theme-colors';
import DivGlobal from '@/themes/ui/div-global';
import { TableComponent } from '@/themes/ui/table-ui';
import DisplayView from '@/themes/ui/display-view';
import TdGlobal from '@/themes/ui/td-global';
interface PProps {
  actions: string[];
}
function ListCategories({ actions }: PProps) {
  const { paginated_categories, getPaginatedCategories, activateCategory, loading_categories } =
    useCategoriesStore();
  const [selectedCategory, setSelectedCategory] = useState<
    { id: number; name: string; showSale: boolean } | undefined
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
  const [view, setView] = useState<'table' | 'grid'>('table');
  const handleEdit = (item: CategoryProduct) => {
    setSelectedCategory({
      id: item.id,
      name: item.name,
      showSale: item.showSale
    });
    modalAdd.onOpen();
  };
  const handleActivate = (id: number) => {
    activateCategory(id).then(() => {
      getPaginatedCategories(1, limit, search, active ? 1 : 0);
    });
  };

  return (
    <DivGlobal className="flex flex-col h-full overflow-y-auto ">
      <div className="flex justify-between gap-5">
        <div className="flex gap-5">
          <Input
            isClearable
            className="w-full xl:w-96 dark:text-white"
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
          <div className="flex items-end">
            <ButtonUi
              startContent={<SearchIcon className="w-10" />}
              theme={Colors.Primary}
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

      <div className="flex mt-3 flex-row justify-between items-end gap-10">
        <div className="flex justify-start">
          <div className="xl:mt-10">
            <Switch
              classNames={{
                thumb: classNames(active ? 'bg-blue-500' : 'bg-gray-400'),
                wrapper: classNames(active ? '!bg-blue-300' : 'bg-gray-200'),
              }}
              isSelected={active}
              onValueChange={(active) => setActive(active)}
            >
              <span className="text-sm sm:text-base whitespace-nowrap">
                Mostrar {active ? 'inactivos' : 'activos'}
              </span>
            </Switch>
          </div>
        </div>
        <div className="flex gap-10 w-full justify-between items-end lg:justify-end">
          <div className="w-[150px]">
            <Select
              className="max-w-44 dark:text-white"
              classNames={{
                label: 'font-semibold',
              }}
              defaultSelectedKeys={['5']}
              label="Cantidad a mostrar"
              labelPlacement="outside"
              value={limit}
              variant="bordered"
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

          <DisplayView setView={setView} view={view} />
        </div>
      </div>

      {view === 'grid' && (
        <CardCategory
          actions={actions}
          deletePopover={DeletePopUp}
          handleActive={handleActivate}
          handleEdit={handleEdit}
        />
      )}
      {view === 'table' && (
        <>
          <TableComponent headers={['Nº', 'Nombre', 'Acciones']}>
            {loading_categories ? (
              <tr>
                <td className="p-3 text-sm text-center text-slate-500" colSpan={5}>
                  <LoadingTable />
                </td>
              </tr>
            ) : (
              <>
                {paginated_categories.categoryProducts.length > 0 ? (
                  <>
                    {paginated_categories.categoryProducts.map((cat) => (
                      <tr key={cat.id}>
                        <TdGlobal className="p-3">{cat.id}</TdGlobal>
                        <TdGlobal className="p-3">{cat.name}</TdGlobal>
                        <TdGlobal className="p-3">
                          <div className="flex gap-6">
                            {cat.isActive && actions.includes('Editar') && (
                              <ButtonUi
                                isIconOnly
                                theme={Colors.Success}
                                onPress={() => handleEdit(cat)}
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
                                    isIconOnly
                                    theme={Colors.Info}
                                    onPress={() => handleActivate(cat.id)}
                                  >
                                    <RefreshCcw />
                                  </ButtonUi>
                                )}
                              </>
                            )}
                          </div>
                        </TdGlobal>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={3}>
                      <EmptyTable />
                    </td>
                  </tr>
                )}
              </>
            )}
          </TableComponent>
        </>
      )}
      {paginated_categories.totalPag > 1 && (
        <>
          <div className="w-full mt-5">
            <Pagination
              currentPage={paginated_categories.currentPag}
              nextPage={paginated_categories.nextPag}
              previousPage={paginated_categories.prevPag}
              totalPages={paginated_categories.totalPag}
              onPageChange={(page) => {
                getPaginatedCategories(page, limit, search);
              }}
            />
          </div>
        </>
      )}
      <AddCategory
        category={selectedCategory}
        closeModal={modalAdd.onClose}
        isOpen={modalAdd.isOpen}
      />
    </DivGlobal>
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
        showArrow
        backdrop="blur"
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
