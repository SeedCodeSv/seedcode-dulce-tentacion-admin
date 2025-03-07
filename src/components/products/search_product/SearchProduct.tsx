import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { ThemeContext } from '@/hooks/useTheme';
import { useCategoriesStore } from '@/store/categories.store';
import { useProductsStore } from '@/store/products.store';
import { useSubCategoriesStore } from '@/store/sub-categories.store';
import { useSubCategoryStore } from '@/store/sub-category';
import { global_styles } from '@/styles/global.styles';
import { CategoryProduct } from '@/types/categories.types';
import { Autocomplete, AutocompleteItem, Button, Input } from "@heroui/react";
import { Filter, SearchIcon } from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { IPropsSearchProduct } from '../types/mobile-view.types';

function SearchProduct(props: IPropsSearchProduct) {
  const { getSubcategories, subcategories } = useSubCategoriesStore();
  const [categoryId, setCategoryId] = useState(0);
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
  const { theme } = useContext(ThemeContext);
  return (
    <div className="flex items-center gap-5">
      <div className="block md:hidden">
        <TooltipGlobal text="Filtros disponibles" color="primary">
          <Button
            className="border border-white"
            style={global_styles().thirdStyle}
            isIconOnly
            type="button"
            onClick={() => setOpenVaul(true)}
          >
            <Filter />
          </Button>
        </TooltipGlobal>
        <BottomDrawer
          title="Filtros disponibles"
          open={openVaul}
          onClose={() => setOpenVaul(false)}
        >
          <div className="flex flex-col  gap-2">
            <Input
              startContent={<SearchIcon />}
              className="w-full border dark:border-white rounded-xl  dark:text-white"
              variant="bordered"
              labelPlacement="outside"
              label="Nombre"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value), props.nameProduct(e.target.value);
              }}
              placeholder="Escribe para buscar..."
              isClearable
              onClear={() => {
                setSearch('');
              }}
            />
            <Input
              startContent={<SearchIcon />}
              className="w-full border  dark:border-white rounded-xl dark:text-white"
              variant="bordered"
              labelPlacement="outside"
              label="Código"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              value={code}
              onChange={(e) => {
                setCode(e.target.value), props.codeProduct(e.target.value);
              }}
              placeholder="Escribe para buscar..."
              isClearable
              onClear={() => {
                setCode('');
              }}
            />
            <label className="font-semibold dark:text-white text-gray-700">Categoría</label>
            <Autocomplete
              onSelectionChange={(key) => {
                if (key) {
                  const branchSelected = JSON.parse(key as string) as CategoryProduct;
                  setCategory(branchSelected.name);
                  setCategoryId(branchSelected.id);
                  props.categoryProduct(branchSelected.name);
                }
              }}
              className="dark:text-white border dark:border-white rounded-xl "
              classNames={{
                base: 'font-semibold text-sm',
              }}
              labelPlacement="outside"
              placeholder="Selecciona la categoría"
              variant="bordered"
              value={category}
              defaultSelectedKey={category}
              clearButtonProps={{
                onClick: () => {
                  setCategory('');
                  setCategoryId(0);
                },
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
            <label className="font-semibold dark:text-white text-gray-700">Sub categoría</label>
            <Autocomplete
              onSelectionChange={(key) => {
                if (key) {
                  const branchSelected = JSON.parse(key as string) as CategoryProduct;
                  setSubCategory(branchSelected.name);
                  props.subCategoryProduct(branchSelected.name);
                }
              }}
              className="w-full dark:text-white border dark:border-white rounded-xl "
              labelPlacement="outside"
              placeholder="Selecciona la sub categoría"
              variant="bordered"
              classNames={{
                base: 'font-semibold text-gray-500 text-sm',
              }}
              defaultSelectedKey={subCategory}
              clearButtonProps={{
                onClick: () => {
                  setSubCategory('');
                },
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
            <Button
              color="primary"
              onClick={() => {
                handleSearch();
                setOpenVaul(false);
              }}
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.primary,
                fontSize: '16px',
              }}
              className=" font-semibold"
            >
              Buscar
            </Button>
          </div>
        </BottomDrawer>
      </div>
    </div>
  );
}

export default SearchProduct;
