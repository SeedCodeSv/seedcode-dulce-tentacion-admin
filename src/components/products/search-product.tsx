import { Autocomplete, AutocompleteItem, Input } from '@heroui/react';
import { Filter, SearchIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { IPropsSearchProduct } from './types/mobile-view.types';

import BottomDrawer from '@/components/global/BottomDrawer';
import { useCategoriesStore } from '@/store/categories.store';
import { useProductsStore } from '@/store/products.store';
import { useSubCategoriesStore } from '@/store/sub-categories.store';
import { useSubCategoryStore } from '@/store/sub-category';
import { CategoryProduct } from '@/types/categories.types';
import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';

function SearchProduct(props: IPropsSearchProduct) {
  const { getSubcategories, subcategories } = useSubCategoriesStore();
  const [categoryId, setCategoryId] = useState(0)
  const { sub_categories, getSubCategoriesList } = useSubCategoryStore();

  useEffect(() => {
    getSubcategories(categoryId);
  }, [categoryId]);
  const [code, setCode] = useState('');
  const [search, setSearch] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const { list_categories, getListCategories } = useCategoriesStore();

  useEffect(() => {
    getListCategories();
    getSubCategoriesList();
  }, []);
  const [category, setCategory] = useState('');

  const [openVaul, setOpenVaul] = useState(false);
  const { getPaginatedProducts } = useProductsStore();
  const itemSubCategories = useMemo(() => {
    if (subcategories.length > 0) return subcategories;

    return sub_categories;
  }, [sub_categories, subcategories]);
  const handleSearch = () => {
    getPaginatedProducts(1, 5, category, subCategory, search, code, 1);
  };

  return (
    <div className="flex items-center gap-5">
      <div className="block md:hidden">
        <ButtonUi isIconOnly theme={Colors.Info} type="button" onClick={() => setOpenVaul(true)}>
          <Filter />
        </ButtonUi>
        <BottomDrawer
          open={openVaul}
          title="Filtros disponibles"
          onClose={() => setOpenVaul(false)}
        >
          <div className="flex flex-col  gap-2">
            <Input
              isClearable
              className="w-full border text-black dark:border-white rounded-xl  dark:text-white"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
            
              }}
              label="Nombre"
              labelPlacement="outside"
              placeholder="Escribe para buscar..."
              startContent={<SearchIcon />}
              value={search}
              variant="bordered"
              onChange={(e) => {
                setSearch(e.target.value), props.nameProduct(e.target.value);
              }}
              onClear={() => {
                setSearch('');
              }}
            />
            <Input
              isClearable
              className="w-full border text-black dark:border-white rounded-xl dark:text-white"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              label="Código"
              labelPlacement="outside"
              placeholder="Escribe para buscar..."
              startContent={<SearchIcon />}
              value={code}
              variant="bordered"
              onChange={(e) => {
                setCode(e.target.value), props.codeProduct(e.target.value);
              }}
              onClear={() => {
                setCode('');
              }}
            />
           <span className="font-semibold dark:text-white text-gray-700">Categoría</span>
            <Autocomplete
              className="dark:text-white border dark:border-white rounded-xl "
              classNames={{
                base: 'font-semibold text-sm',
              }}
              clearButtonProps={{
                onClick: () => {
                  setCategory('');
                  setCategoryId(0);
                },
              }}
              defaultSelectedKey={category}
              labelPlacement="outside"
              placeholder="Selecciona la categoría"
              value={category}
              variant="bordered"
              onSelectionChange={(key) => {
                if (key) {
                  const branchSelected = JSON.parse(key as string) as CategoryProduct;

                  setCategory(branchSelected.name);
                  setCategoryId(branchSelected.id);
                  props.categoryProduct(branchSelected.name);
                }
              }}
            >
              {list_categories.map((bra) => (
                <AutocompleteItem
                  key={JSON.stringify(bra)}
                  className="dark:text-white  border dark:border-white rounded-xl"
                >
                  {bra.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <span className="font-semibold dark:text-white text-gray-700">Sub categoría</span>
            <Autocomplete
              className="w-full dark:text-white border dark:border-white rounded-xl "
              classNames={{
                base: 'font-semibold text-gray-500 text-sm',
              }}
              clearButtonProps={{
                onClick: () => {
                  setSubCategory('');
                },
              }}
              defaultSelectedKey={subCategory}
              labelPlacement="outside"
              placeholder="Selecciona la sub categoría"
              variant="bordered"
              onSelectionChange={(key) => {
                if (key) {
                  const branchSelected = JSON.parse(key as string) as CategoryProduct;

                  setSubCategory(branchSelected.name);
                  props.subCategoryProduct(branchSelected.name);
                }
              }}
            >
              {itemSubCategories.map((item) => (
                <AutocompleteItem
                  key={JSON.stringify(item)}
                  className="dark:text-white  border dark:border-white rounded-xl"
                >
                  {item.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <ButtonUi
              theme={Colors.Primary}
              onPress={() => {
                handleSearch();
                setOpenVaul(false);
              }}
            >
              Buscar
            </ButtonUi>
          </div>
        </BottomDrawer>
      </div>
    </div>
  );
}

export default SearchProduct;
