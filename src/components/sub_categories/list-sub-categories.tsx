import {
  Button,
  useDisclosure,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { EditIcon, Filter, RefreshCcw, Trash } from 'lucide-react';

import AddButton from '../global/AddButton';
import { limit_options } from '../../utils/constants';
import { ISubCategory } from '../../types/sub_categories.types';
import { useSubCategoryStore } from '../../store/sub-category';
import TooltipGlobal from '../global/TooltipGlobal';
import Pagination from '../global/Pagination';
import EmptyTable from '../global/EmptyTable';
import LoadingTable from '../global/LoadingTable';

import AddSubCategory from './add-sub-category';
import CardSubCategory from './card-sub-category';
import { SearchSubCategoryProduct, Filters } from './search-sub-category-products';

import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import useThemeColors from '@/themes/use-theme-colors';
import DivGlobal from '@/themes/ui/div-global';
import { TableComponent } from '@/themes/ui/table-ui';
import TdGlobal from '@/themes/ui/td-global';
import DisplayView from '@/themes/ui/display-view';

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
  const [view, setView] = useState<'table' | 'grid'>('table');
  const handleActivate = (id: number) => {
    activateSubCategories(id).then(() => {
      getSubCategoriesPaginated(1, limit, search, isActive ? 1 : 0);
    });
  };

  const dislosureFilters = useDisclosure();

  return (
    <DivGlobal className="flex flex-col h-full overflow-y-auto ">
      <div className="hidden md:flex">
        <Filters
          active={isActive}
          handleSearch={handleSearch}
          search={search}
          setActive={setActive}
          setSearch={setSearch}
        />
      </div>
      <SearchSubCategoryProduct
        active={isActive}
        disclosure={dislosureFilters}
        handleSearch={handleSearch}
        search={search}
        setActive={setActive}
        setSearch={setSearch}
      />
      <div className="flex w-full mt-3 flex-row justify-between">
        <div className="w-44">
          <Select
            className="w-44 dark:text-white"
            classNames={{
              label: 'font-semibold',
            }}
            defaultSelectedKeys={'5'}
            label="Cantidad a mostrar"
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

        <div className="flex gap-10 items-end">
          <DisplayView setView={setView} view={view} />
          <div className="flex md:hidden">
            <ButtonUi isIconOnly theme={Colors.Info} onPress={dislosureFilters.onOpen}>
              <Filter />
            </ButtonUi>
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

      {view === 'grid' && (
        <CardSubCategory
          DeletePopover={DeletePopUp}
          actions={actions}
          handleActive={handleActivate}
          handleEdit={(item) => {
            setSelectedCategory(item);
            modalAdd.onOpen();
          }}
        />
      )}
      {view === 'table' && (
        <>
          <TableComponent headers={['Nº', 'Nombre', 'Categoría', 'Acciones']}>
            {loading_sub_categories ? (
              <tr>
                <td className="p-3 text-sm text-center text-slate-500" colSpan={5}>
                  <LoadingTable />
                </td>
              </tr>
            ) : (
              <>
                {sub_categories_paginated.SubCategories.length > 0 ? (
                  <>
                    {sub_categories_paginated.SubCategories.map((categories, key) => (
                      <tr key={key}>
                        <TdGlobal className="p-3">{categories.id}</TdGlobal>
                        <TdGlobal className="p-3">{categories.name}</TdGlobal>
                        <TdGlobal className="p-3">{categories.categoryProduct.name}</TdGlobal>

                        <TdGlobal className="p-3">
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
                        </TdGlobal>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <EmptyTable />
                    </td>
                  </tr>
                )}
              </>
            )}
          </TableComponent>
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
      <Modal {...modalAdd}>
        <ModalContent>
          <ModalHeader className="dark:text-white">
            {selectedCategory ? 'Editar sub categoría' : 'Nueva Sub-categoría'}
          </ModalHeader>
          <ModalBody>
            <AddSubCategory closeModal={modalAdd.onClose} subCategory={selectedCategory} />
          </ModalBody>
        </ModalContent>
      </Modal>
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
