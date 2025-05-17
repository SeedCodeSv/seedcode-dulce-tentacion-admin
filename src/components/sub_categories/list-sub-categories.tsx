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
import classNames from 'classnames';

import AddButton from '../global/AddButton';
import { limit_options } from '../../utils/constants';
import HeadlessModal from '../global/HeadlessModal';
import { ISubCategory } from '../../types/sub_categories.types';
import { useSubCategoryStore } from '../../store/sub-category';
import TooltipGlobal from '../global/TooltipGlobal';
import Pagination from '../global/Pagination';
import EmptyTable from '../global/EmptyTable';

import AddSubCategory from './add-sub-category';
import CardSubCategory from './card-sub-category';

import useWindowSize from '@/hooks/useWindowSize';
import ThGlobal from '@/themes/ui/th-global';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import useThemeColors from '@/themes/use-theme-colors';
import DivGlobal from '@/themes/ui/div-global';


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
   <DivGlobal className="flex flex-col h-full overflow-y-auto ">
        <div className="w-full flex justify-between">
          <div className="flex gap-5">
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

        <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10">
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
                classNames={{
                  label: 'font-semibold',
                }}
                defaultSelectedKeys={'5'}
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

            <ButtonGroup className="mt-4 xl:flex hidden border border-white rounded-xl">
              <ButtonUi
                isIconOnly
                theme={view === 'table' ? Colors.Primary : Colors.Default}
                onPress={() => setView('table')}
              >
                <ITable />
              </ButtonUi>
              <ButtonUi
                isIconOnly
                theme={view === 'grid' ? Colors.Primary : Colors.Default}
                onPress={() => setView('grid')}
              >
                <CreditCard />
              </ButtonUi>
            </ButtonGroup>
          </div>
        </div>

        {(view === 'grid' || view === 'list') && (
          <CardSubCategory
            actions={actions}
            deletePopover={DeletePopUp}
            handleActive={handleActivate}
            handleEdit={(item) => {
              setSelectedCategory(item);
              modalAdd.onOpen();
            }}
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
                      <td className="p-3 text-sm text-center text-slate-500" colSpan={5}>
                        <div className="flex flex-col items-center justify-center w-full h-64">
                          <div className="loader" />
                          <p className="mt-3 text-xl font-semibold">Cargando...</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {sub_categories_paginated.SubCategories.length > 0 ? (
                        <>
                          {sub_categories_paginated.SubCategories.map((categories, key) => (
                            <tr key={key} className="border-b border-slate-200">
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
                                      isIconOnly
                                      theme={Colors.Success}
                                      onPress={() => {
                                        setSelectedCategory(categories);
                                        modalAdd.onOpen();
                                      }}
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
                                            isIconOnly
                                            theme={Colors.Info}
                                            onPress={() => handleActivate(categories.id)}
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
                          <td colSpan={4}>
                            <EmptyTable/>
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
            <div className="w-full mt-5">
              <Pagination
                currentPage={sub_categories_paginated.currentPag}
                nextPage={sub_categories_paginated.nextPag}
                previousPage={sub_categories_paginated.prevPag}
                totalPages={sub_categories_paginated.totalPag}
                onPageChange={(page) => {
                  getSubCategoriesPaginated(page, limit, search);
                }}
              />
            </div>
          </>
        )}
      <HeadlessModal
        isOpen={modalAdd.isOpen}
        size="w-[350px] md:w-[500px]"
        title={selectedCategory ? 'Editar sub categoría' : 'Nueva Sub-categoría'}
        onClose={modalAdd.onClose}
      >
        <AddSubCategory closeModal={modalAdd.onClose} subCategory={selectedCategory} />
      </HeadlessModal>
    </DivGlobal>
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
      <Popover {...deleteDisclosure} showArrow backdrop="blur">
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
