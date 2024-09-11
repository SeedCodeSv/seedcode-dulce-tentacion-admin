import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { ThemeContext } from '@/hooks/useTheme';
import { useCategoriesStore } from '@/store/categories.store';
import { useUsersStore } from '@/store/users.store';
import { global_styles } from '@/styles/global.styles';
import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';
import { Filter, Search } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
function SearchBranchProduct() {
  const { categories_list, getListCategoriesList } = useCategoriesStore();
  useEffect(() => {
    getListCategoriesList();
  }, []);
  const [openVaul, setOpenVaul] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { getUsersPaginated } = useUsersStore();
  const [filter] = useState({
    nameProduct: '',
    codeProduct: '',
    categoryProduct: 0,
  });
  return (
    <div className="flex items-center gap-5">
      <div className="block md:hidden">
        <TooltipGlobal text="Buscar por filtros" color="primary">
          <Button
            className="border border-white rounded-xl"
            style={global_styles().thirdStyle}
            isIconOnly
            onClick={() => setOpenVaul(true)}
            type="button"
          >
            <Filter />
          </Button>
        </TooltipGlobal>
        <BottomDrawer
          title="Filtros disponibles"
          open={openVaul}
          onClose={() => setOpenVaul(false)}
        >
          <div className="flex flex-col gap-2">
            <Input
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              className="w-full order-1"
              placeholder="Buscar por nombre..."
              startContent={<Search />}
              variant="bordered"
              label="Nombre"
              labelPlacement="outside"
              name="searchName"
              id="searchName"
              autoComplete="search"
              isClearable
            />
            <Input
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              className="w-full order-2"
              placeholder="Buscar por código..."
              startContent={<Search />}
              variant="bordered"
              name="searchCode"
              label="Código"
              labelPlacement="outside"
              id="searchCode"
              autoComplete="search"
              isClearable
            />

            <Autocomplete
              className="w-full order-3 dark:text-white"
              labelPlacement="outside"
              label="Categoría"
              placeholder="Selecciona la categoría"
              variant="bordered"
            >
              {categories_list.map((category) => (
                <AutocompleteItem
                  className="dark:text-white"
                  key={category.id}
                  value={category.id}
                  textValue={category.name}
                >
                  {category.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <Button
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.primary,
                fontSize: '16px',
              }}
              className="font-semibold order-last mt-4"
              color="primary"
              onClick={() => {
                // getUsersPaginated(1, 5, filter.nameProduct, filter.codeProduct);
                setOpenVaul(false);
              }}
            >
              Buscar
            </Button>
          </div>
        </BottomDrawer>
      </div>
    </div>
  );
}

export default SearchBranchProduct;
