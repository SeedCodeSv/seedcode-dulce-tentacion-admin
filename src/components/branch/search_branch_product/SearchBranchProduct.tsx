import { Autocomplete, AutocompleteItem, Button, Input } from '@heroui/react';
import { Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { useAuthStore } from '@/store/auth.store';
import { useCategoriesStore } from '@/store/categories.store';
import { useUsersStore } from '@/store/users.store';
import { global_styles } from '@/styles/global.styles';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
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
        <TooltipGlobal color="primary" text="Buscar por filtros">
          <Button
            isIconOnly
            className="border border-white rounded-xl"
            style={global_styles().thirdStyle}
            type="button"
            onClick={() => setOpenVaul(true)}
          >
            <Filter />
          </Button>
        </TooltipGlobal>
        <BottomDrawer
          open={openVaul}
          title="Filtros disponibles"
          onClose={() => setOpenVaul(false)}
        >
          <div className="flex flex-col gap-2">
            <Input
              isClearable
              autoComplete="search"
              className="w-full order-1"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              id="searchName"
              label="Nombre"
              labelPlacement="outside"
              name="searchName"
              placeholder="Buscar por nombre..."
              startContent={<Search />}
              variant="bordered"
            />
            <Input
              isClearable
              autoComplete="search"
              className="w-full order-2"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              id="searchCode"
              label="Código"
              labelPlacement="outside"
              name="searchCode"
              placeholder="Buscar por código..."
              startContent={<Search />}
              variant="bordered"
            />

            <Autocomplete
              className="w-full order-3 dark:text-white"
              label="Categoría"
              labelPlacement="outside"
              placeholder="Selecciona la categoría"
              variant="bordered"
            >
              {categories_list.map((category) => (
                <AutocompleteItem
                  key={category.id}
                  className="dark:text-white"
                  textValue={category.name}
                >
                  {category.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <ButtonUi
              className="font-semibold order-last mt-4"
              theme={Colors.Primary}
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
