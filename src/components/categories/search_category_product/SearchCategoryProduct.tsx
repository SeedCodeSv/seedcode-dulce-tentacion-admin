import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { useCategoriesStore } from '@/store/categories.store';
import { global_styles } from '@/styles/global.styles';
import { Button, Input } from '@nextui-org/react';
import { Filter, User } from 'lucide-react';
import { useContext, useState } from 'react'
import { IPropsSearchCategoryProduct } from '../types/mobile_view.types';
import { ThemeContext } from '@/hooks/useTheme';

function SearchCategoryProduct(props: IPropsSearchCategoryProduct) {
    const { getPaginatedCategories } =
        useCategoriesStore();
    const [nameCategoryProduct, setNameCategoryProduct] = useState("")


    const { theme } = useContext(ThemeContext);

    const [openVaul, setOpenVaul] = useState(false)
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
                                startContent={<User />}
                                  className="w-full border dark:border-white rounded-xl  dark:text-white"
                                variant="bordered"
                                labelPlacement="outside"
                                label="Nombre"
                                onChange={(e) => { setNameCategoryProduct(e.target.value), props.nameCategoryProduct(e.target.value) }}
                                classNames={{
                                    label: 'font-semibold text-gray-700',
                                    inputWrapper: 'pr-0',
                                }}


                                placeholder="Escribe para buscar..."
                                isClearable
                                onClear={() => {
                                    setNameCategoryProduct('');

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
                                    getPaginatedCategories(1, 5, nameCategoryProduct, 1)
                                    setOpenVaul(false);
                                }}
                            >
                                Buscar
                            </Button>
                       
                    </div>
                </BottomDrawer>
            </div>

        </div>
    )
}

export default SearchCategoryProduct