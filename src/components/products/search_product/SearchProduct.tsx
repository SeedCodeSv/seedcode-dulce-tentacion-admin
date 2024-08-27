import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { ThemeContext } from '@/hooks/useTheme';
import { useCategoriesStore } from '@/store/categories.store';
import { useProductsStore } from '@/store/products.store';
import { useSubCategoriesStore } from '@/store/sub-categories.store';
import { useSubCategoryStore } from '@/store/sub-category';
import { global_styles } from '@/styles/global.styles';
import { CategoryProduct } from '@/types/categories.types';
import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { Filter, SearchIcon } from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react';

function SearchProduct() {
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
  const [page, serPage] = useState(1);
  const [openVaul, setOpenVaul] = useState(false);
  const { getPaginatedProducts, paginated_products, activateProduct, loading_products } =
    useProductsStore();
  const itemSubCategories = useMemo(() => {
    if (subcategories.length > 0) return subcategories;
    return sub_categories;
  }, [sub_categories, subcategories]);
  const handleSearch = (searchParam: string | undefined) => {
    getPaginatedProducts(
      page,
      5,
      searchParam ?? category,
      searchParam ?? subCategory,
      searchParam ?? search,
      searchParam ?? code,
      1
    );
  };
  const { theme } = useContext(ThemeContext);

  return (
    <div className="flex items-center gap-5">
      <div className="block md:hidden">
        <TooltipGlobal text="Filtros disponibles" color="primary">
          <Button
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
          <Input
            startContent={<SearchIcon />}
            className="w-full dark:text-white"
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
              // handleSearch("");
              setSearch('');
            }}
          />
          <Input
            startContent={<SearchIcon />}
            className="w-full dark:text-white"
            variant="bordered"
            labelPlacement="outside"
            label="Código"
            classNames={{
              label: 'font-semibold text-gray-700',
              inputWrapper: 'pr-0',
            }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Escribe para buscar..."
            isClearable
            onClear={() => {
              // handleSearch("");
              setCode('');
            }}
          />
          <Autocomplete
            onSelectionChange={(key) => {
              if (key) {
                const branchSelected = JSON.parse(key as string) as CategoryProduct;
                setCategory(branchSelected.name);
                setCategoryId(branchSelected.id);
              }
            }}
            className="w-full dark:text-white"
            label="Categoría producto"
            labelPlacement="outside"
            placeholder="Selecciona la categoría"
            variant="bordered"
            classNames={{
              base: 'font-semibold text-gray-500 text-sm',
            }}
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
                value={bra.name}
                key={JSON.stringify(bra)}
                className="dark:text-white"
              >
                {bra.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          <Autocomplete
            onSelectionChange={(key) => {
              if (key) {
                const branchSelected = JSON.parse(key as string) as CategoryProduct;
                setSubCategory(branchSelected.name);
              }
            }}
            className="w-full dark:text-white"
            label="Sub Categoría"
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
                value={item.name}
                key={JSON.stringify(item)}
                className="dark:text-white"
              >
                {item.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Button
            color="primary"
            onClick={() => {
              handleSearch(undefined);
              setOpenVaul(false);
            }}
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.colors.primary,
              fontSize: '16px',
            }}
            className="mb-10 font-semibold"
          >
            Buscar
          </Button>
        </BottomDrawer>
      </div>
    </div>
  );
}

export default SearchProduct;
