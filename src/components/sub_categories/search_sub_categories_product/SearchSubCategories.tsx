import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { ThemeContext } from '@/hooks/useTheme';
import { global_styles } from '@/styles/global.styles';
import { Button, Input } from '@nextui-org/react';
import { Filter, User } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { IPropsSearchSubCategoryProduct } from '../types/mobile_view.types';
import { useSubCategoryStore } from '@/store/sub-category';

function SearchSubCategories(props: IPropsSearchSubCategoryProduct) {
  const { theme } = useContext(ThemeContext);
  const [openVaul, setOpenVaul] = React.useState(false);
  const { getSubCategoriesPaginated } = useSubCategoryStore();
  const [nameSubCategoryProduct, setNameSubCategoryProduct] = useState('');
  return (
    <div className="flex items-center gap-5">
      <div className="block md:hidden">
        <TooltipGlobal text="Filtrar">
          <Button
            style={global_styles().thirdStyle}
            isIconOnly
            onClick={() => setOpenVaul(true)}
            type="button"
          >
            <Filter />
          </Button>
        </TooltipGlobal>
        <BottomDrawer
          open={openVaul}
          onClose={() => setOpenVaul(false)}
          title="Filtros disponibles"
        >
          <div className="flex flex-col  gap-2">
            <Input
              onChange={(e) => {
                setNameSubCategoryProduct(e.target.value),
                  props.nameSubCategoryProduct(e.target.value);
              }}
              startContent={<User />}
              className="w-full border dark:border-white rounded-xl  dark:text-white"
              variant="bordered"
              labelPlacement="outside"
              label="Nombre"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              placeholder="Escribe para buscar..."
              isClearable
              onClear={() => {
                setNameSubCategoryProduct('');
                props.nameSubCategoryProduct('');
                getSubCategoriesPaginated(1, 5, nameSubCategoryProduct, 1);
              }}
            />
            <Button
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.primary,
                fontSize: '16px',
              }}
              className=" font-semibold"
              onClick={() => {
                props.nameSubCategoryProduct('');
                setNameSubCategoryProduct('');
                getSubCategoriesPaginated(1, 5, nameSubCategoryProduct, 1);
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

export default SearchSubCategories;
