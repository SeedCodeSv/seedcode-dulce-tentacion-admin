import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { useAuthStore } from '@/store/auth.store';
import { useCategoriesStore } from '@/store/categories.store';
import { useUsersStore } from '@/store/users.store';
import { global_styles } from '@/styles/global.styles';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { Autocomplete, AutocompleteItem, Button, Input } from '@heroui/react';
import { Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
function SearchBranchProduct() {
  const { categories_list, getListCategoriesList } = useCategoriesStore();
  useEffect(() => {
    getListCategoriesList();
  }, []);
  const [openVaul, setOpenVaul] = useState(false);
  const { getUsersPaginated } = useUsersStore();
  const [filter] = useState({
    nameProduct: '',
    codeProduct: '',
    categoryProduct: 0,
  });
  const { user } = useAuthStore();
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
                  textValue={category.name}
                >
                  {category.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <ButtonUi
              theme={Colors.Primary}
              className="font-semibold order-last mt-4"
              onPress={() => {
                getUsersPaginated(
                  user?.correlative?.branch.transmitterId ??
                    user?.pointOfSale?.branch.transmitterId ??
                    0,
                  1,
                  5,
                  filter.nameProduct,
                  filter.codeProduct
                );
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

export default SearchBranchProduct;
