import {
  Autocomplete,
  AutocompleteItem,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  useDisclosure,
} from '@heroui/react';
import { Filter, SearchIcon } from 'lucide-react';
import { useEffect } from 'react';

import { useCategoriesStore } from '@/store/categories.store';
import { useSubCategoryStore } from '@/store/sub-category';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { SearchProduct } from '@/types/products.types';

interface Props {
  handleSearch: (value: string | undefined) => void;
  params: SearchProduct
  setParams: (params: SearchProduct) => void
}

function RenderProductsFilters(props: Props) {
  const {
    handleSearch,
    setParams,
    params
  } = props;

  const { sub_categories, getSubCategoriesList, getSubcategories, subcategories } = useSubCategoryStore();
  const { list_categories, getListCategories } = useCategoriesStore();

  useEffect(() => {
    getSubcategories(Number(params.category ?? 0));
  }, [params.category]);

  useEffect(() => {
    getListCategories();
    getSubCategoriesList();
  }, []);

  const modalFilters = useDisclosure();

  const renderFilter = () => {
    return (
      <>
        <Input
          isClearable
          className="w-full text-gray-900 dark:text-white  border border-white rounded-xl"
          classNames={{
            label: 'font-semibold text-gray-700',
            inputWrapper: 'pr-0',
          }}
          label="Nombre"
          labelPlacement="outside"
          placeholder="Escribe para buscar..."
          startContent={<SearchIcon />}
          value={params.name}
          variant="bordered"
          onChange={(e) => setParams({ ...params, name: e.target.value })}
          onClear={() => {
            setParams({ ...params, name: '' });
            handleSearch('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(undefined);
            }
          }}
        />
        <Input
          isClearable
          className="w-full dark:text-white border border-white rounded-xl"
          classNames={{
            label: 'font-semibold text-gray-700',
            inputWrapper: 'pr-0',
          }}
          label="Código"
          labelPlacement="outside"
          placeholder="Escribe para buscar..."
          startContent={<SearchIcon />}
          value={params.code}
          variant="bordered"
          onChange={(e) => setParams({ ...params, code: e.target.value })}
          onClear={() => {
            setParams({ ...params, code: "" });
            handleSearch('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(undefined);
            }
          }}
        />
        <Autocomplete
          className="w-full dark:text-white rounded-xl"
          classNames={{
            base: 'font-semibold text-gray-500 dark:text-gray-50 text-sm',
          }}
          label="Categoría"
          placeholder="Selecciona la categoría"
          selectedKey={params.category ? String(params.category) : undefined}
          variant="bordered"
          onSelectionChange={(key) => {
            if (key) {
              const cat = Number(key);

              setParams({ ...params, category: cat, subCategory: 0});
            }else{
              setParams({...params, category: 0, subCategory: 0})
            }
          }}
        >
          {list_categories.map((item) => (
            <AutocompleteItem key={String(item.id)} className="dark:text-white">
              {item.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>

        <Autocomplete
          className="w-full dark:text-white"
          classNames={{
            base: 'font-semibold text-gray-500 text-sm',
          }}
          items={subcategories.length > 0 || Number(params.category) > 0 ? subcategories : sub_categories}
          label="Sub Categoría"
          labelPlacement="outside"
          placeholder="Selecciona la sub categoría"
          selectedKey={params.subCategory ? String(params.subCategory) : undefined}
          variant="bordered"
          onSelectionChange={(key) => {
            if (key) {
              const subCat = Number(key);

              setParams({ ...params, subCategory: subCat });
            }else{
              setParams({ ...params, subCategory: 0 });
            }
          }}
        >
          {(item) => (
            <AutocompleteItem key={String(item.id)} className="dark:text-white">
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>

        <ButtonUi
          className="hidden w-full md:flex "
          startContent={<SearchIcon className="w-10" />}
          theme={Colors.Primary}
          onPress={() => {
            handleSearch(undefined);
          }}
        >
          Buscar
        </ButtonUi>
      </>
    );
  };

  return (
    <>
      <div className="hidden lg:grid grid-cols-5 gap-4 place-items-end w-full mt-2">
        {renderFilter()}
      </div>
      <ButtonUi isIconOnly className="lg:hidden" theme={Colors.Info} onPress={modalFilters.onOpen}>
        <Filter />
      </ButtonUi>
      <Drawer {...modalFilters} placement="bottom">
        <DrawerContent>
          <DrawerHeader>Buscar productos</DrawerHeader>
          <DrawerBody>{renderFilter()}</DrawerBody>
          <DrawerFooter>
            <ButtonUi
              className="px-10 w-full"
              theme={Colors.Primary}
              onPress={() => {
                modalFilters.onClose();
                handleSearch(undefined);
              }}
            >
              Buscar
            </ButtonUi>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default RenderProductsFilters;
