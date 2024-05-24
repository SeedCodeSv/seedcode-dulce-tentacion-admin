import { useContext, useEffect, useMemo, useState } from 'react';
import { useBranchesStore } from '../../../store/branches.store';
import {
  Button,
  Input,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
} from '@nextui-org/react';
import { Search, Filter } from 'lucide-react';
import { ThemeContext } from '../../../hooks/useTheme';
import MobileView from './MobileView';
import { Drawer } from 'vaul';
import { global_styles } from '../../../styles/global.styles';
import { CategoryProduct } from '../../../types/categories.types';
import { useCategoriesStore } from '../../../store/categories.store';
interface Props {
  id: number;
}
function ListEmployee({ id }: Props) {
  const { theme } = useContext(ThemeContext);

  const { getBranchProducts } = useBranchesStore();
  const { list_categories, getListCategories } = useCategoriesStore();

  const [category, setCategory] = useState('');

  const [name, setName] = useState('');
  const [limit, setLimit] = useState(8);
  const [openVaul, setOpenVaul] = useState(false);

  //   const modalAdd = useDisclosure();

  const changePage = () => {
    getBranchProducts(id, name, category);
  };

  useEffect(() => {
    getBranchProducts(id, name, category);
  }, []);
  useEffect(() => {
    getListCategories();
  }, []);
  const filters = useMemo(() => {
    return (
      <>
        <Input
          classNames={{
            label: 'font-semibold text-gray-700',
            inputWrapper: 'pr-0',
          }}
          className="w-full xl:w-96"
          placeholder="Buscar por nombre..."
          startContent={<Search />}
          variant="bordered"
          name="searchName"
          id="searchName"
          value={name}
          autoComplete="search"
          onChange={(e) => setName(e.target.value)}
          isClearable
          onClear={() => setName('')}
        />
        <Autocomplete
          onSelectionChange={(key) => {
            if (key) {
              const branchSelected = JSON.parse(key as string) as CategoryProduct;
              setCategory(branchSelected.name);
            }
          }}
          className="w-full xl:w-80"
          labelPlacement="outside"
          placeholder="Selecciona la categoría"
          variant="bordered"
          classNames={{
            base: 'font-semibold text-gray-500 text-sm',
          }}
          value={category}
          clearButtonProps={{
            onClick: () => setCategory(''),
          }}
        >
          {list_categories.map((bra) => (
            <AutocompleteItem value={bra.name} key={JSON.stringify(bra)}>
              {bra.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </>
    );
  }, [name, category]);

  return (
    <>
      <div className="w-full max-h-full p-6 py-10 pt-1 flex flex-row bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-auto p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="hidden w-full grid-cols-2 gap-5 mb-4 md:grid ">{filters}</div>
          <div className="grid w-full grid-cols-1 gap-5  md:grid-cols-2">
            <div className="hidden md:flex">
              <Button
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.primary,
                }}
                className="w-full xl:w-72"
                color="primary"
                onClick={() => changePage()}
              >
                Buscar
              </Button>
            </div>
            <Select
              className="w-full xl:w-80"
              variant="bordered"
              // label="Mostrar"
              placeholder="Mostrar"
              labelPlacement="outside"
              classNames={{
                label: 'font-semibold',
              }}
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
              }}
            >
              <SelectItem key={'5'}>5</SelectItem>
              <SelectItem key={'10'}>10</SelectItem>
              <SelectItem key={'20'}>20</SelectItem>
              <SelectItem key={'30'}>30</SelectItem>
              <SelectItem key={'40'}>40</SelectItem>
              <SelectItem key={'50'}>50</SelectItem>
              <SelectItem key={'100'}>100</SelectItem>
            </Select>
            <div className="flex items-end justify-between gap-10 mt lg:justify-end">
              <div className="flex items-center gap-5">
                <div className="block md:hidden">
                  <Drawer.Root
                    shouldScaleBackground
                    open={openVaul}
                    onClose={() => setOpenVaul(false)}
                  >
                    <Drawer.Trigger asChild>
                      <Button
                        style={global_styles().thirdStyle}
                        isIconOnly
                        onClick={() => setOpenVaul(true)}
                      >
                        <Filter />
                      </Button>
                    </Drawer.Trigger>
                    <Drawer.Portal>
                      <Drawer.Overlay
                        className="fixed inset-0 bg-black/40 z-[60]"
                        onClick={() => setOpenVaul(false)}
                      />
                      <Drawer.Content className="bg-gray-100 z-[60] flex flex-col rounded-t-[10px] h-auto mt-24 max-h-[80%] fixed bottom-0 left-0 right-0">
                        <div className="p-4 bg-white rounded-t-[10px] flex-1">
                          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                          <Drawer.Title className="mb-4 font-medium">
                            Filtros disponibles
                          </Drawer.Title>
                          <div className="flex flex-col gap-3">
                            {filters}
                            <Button
                              style={global_styles().secondaryStyle}
                              className="mb-10 font-semibold"
                              onClick={() => {
                                changePage();
                                setOpenVaul(false);
                              }}
                            >
                              Aplicar
                            </Button>
                          </div>
                        </div>
                      </Drawer.Content>
                    </Drawer.Portal>
                  </Drawer.Root>
                </div>
              </div>
            </div>
          </div>
          <MobileView layout={'grid'} />
        </div>
      </div>
    </>
  );
}
export default ListEmployee;
