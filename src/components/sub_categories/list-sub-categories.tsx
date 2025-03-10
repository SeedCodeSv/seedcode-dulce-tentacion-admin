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
import AddSubCategory from './add-sub-category';
import AddButton from '../global/AddButton';
import { limit_options } from '../../utils/constants';
import SmPagination from '../global/SmPagination';
import HeadlessModal from '../global/HeadlessModal';
import { ISubCategory } from '../../types/sub_categories.types';
import { useSubCategoryStore } from '../../store/sub-category';
import TooltipGlobal from '../global/TooltipGlobal';
import NO_DATA from '@/assets/svg/no_data.svg';
import classNames from 'classnames';
import useWindowSize from '@/hooks/useWindowSize';
import ThGlobal from '@/themes/ui/th-global';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import useThemeColors from '@/themes/use-theme-colors';
import Pagination from '../global/Pagination';
import CardSubCategory from './card-sub-category';

interface PProps {
  actions: string[];
}

function ListSubCategory({ actions }: PProps) {
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
    <div className=" w-full h-full bg-white dark:bg-gray-900">
      <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
        <div className="w-full flex justify-between">
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
                onValueChange={(isActive) => setActive(isActive)}
                isSelected={isActive}
                classNames={{
                  thumb: classNames(isActive ? 'bg-blue-500' : 'bg-gray-400'),
                  wrapper: classNames(isActive ? '!bg-blue-300' : 'bg-gray-200'),
                }}
              >
                <span className="text-sm sm:text-base whitespace-nowrap dark:text-white">
                  Mostrar {isActive ? 'inactivos' : 'activos'}
                </span>
              </Switch>
            </div>
          </div>
          <div className="flex gap-10 w-full justify-between items-center lg:justify-end order-1 lg:order-2">
            <div className="w-44">
              <span className="font-semibold text-sm  dark:text-white">Mostrar</span>
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
                  <SelectItem key={option} className="dark:text-white">
                    {option}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <ButtonGroup className="mt-4 xl:flex hidden border border-white rounded-xl">
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
          <CardSubCategory
            handleActive={handleActivate}
            deletePopover={DeletePopUp}
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
                    <ThGlobal className="text-left p-3">No.</ThGlobal>
                    <ThGlobal className="text-left p-3">Nombre</ThGlobal>
                    <ThGlobal className="text-left p-3">Categoría</ThGlobal>
                    <ThGlobal className="text-left p-3">Acciones</ThGlobal>
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
                                  {categories.isActive && actions.includes('Editar') && (
                                    <ButtonUi
                                      theme={Colors.Success}
                                      onPress={() => {
                                        setSelectedCategory(categories);
                                        modalAdd.onOpen();
                                      }}
                                      isIconOnly
                                    >
                                      <EditIcon size={20} />
                                    </ButtonUi>
                                  )}
                                  {categories.isActive && actions.includes('Eliminar') && (
                                    <DeletePopUp subcategory={categories} />
                                  )}
                                  {!categories.isActive && (
                                    <>
                                      {actions.includes('Activar') && (
                                        <TooltipGlobal text="Activar">
                                          <ButtonUi
                                            theme={Colors.Info}
                                            onPress={() => handleActivate(categories.id)}
                                            isIconOnly
                                          >
                                            <RefreshCcw />
                                          </ButtonUi>
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

export const DeletePopUp = ({ subcategory }: Props) => {
  const { deleteSubCategory } = useSubCategoryStore();
  const deleteDisclosure = useDisclosure();

  const handleDelete = async () => {
    await deleteSubCategory(subcategory.id);
    deleteDisclosure.onClose();
  };

  const style = useThemeColors({ name: Colors.Error });

  return (
    <>
      <Popover {...deleteDisclosure} backdrop="blur" showArrow>
        <PopoverTrigger>
          <Button isIconOnly style={style}>
            <Trash />
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
              <ButtonUi theme={Colors.Default} onPress={deleteDisclosure.onClose}>
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
