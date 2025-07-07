import {
  // Autocomplete,
  // AutocompleteItem,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  useDisclosure,
} from '@heroui/react';
import { Filter, SearchIcon } from 'lucide-react';
import React from 'react';

// import { useCategoriesStore } from '@/store/categories.store';
// import { useSubCategoryStore } from '@/store/sub-category';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

// type Key = string | number;

interface Props {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (value: string | undefined) => void;
  // code: string;
  // setCode: React.Dispatch<React.SetStateAction<string>>;
  // category: Key | null | undefined;
  // setCategory: React.Dispatch<React.SetStateAction<Key | null | undefined>>;
  // subcategory: Key | null | undefined;
  // setSubcategory: React.Dispatch<React.SetStateAction<Key | null | undefined>>;
}

function RenderCategoryFilters(props: Props) {
  const {
    search,
    setSearch,
    handleSearch,
    // code,
    // setCode,
    // category,
    // setCategory,
    // subcategory,
    // setSubcategory,
  } = props;

  //   const { sub_categories, getSubCategoriesList, getSubcategories, subcategories } = useSubCategoryStore();
  //   const { list_categories, getListCategories } = useCategoriesStore();

  //   useEffect(() => {
  //     getSubcategories(Number(category ?? 0));
  //   }, [category]);

  //   useEffect(() => {
  //     getListCategories();
  //     getSubCategoriesList();
  //   }, []);

  const modalFilters = useDisclosure();

  const renderFilter = () => {
    return (
      <>
        <div className='w-full'>
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
            value={search}
            variant="bordered"
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => {
              setSearch('');
              handleSearch('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(undefined);
              }
            }}
          />
        </div>

      
        <div className="flex self-center">
          

          <ButtonUi
            className="hidden w-full md:flex mt-6 "
            startContent={<SearchIcon className="w-10" />}
            theme={Colors.Primary}
            onPress={() => {
              handleSearch(undefined);
            }}
          >
            Buscar
          </ButtonUi>
        </div>

      </>
    );
  };

  return (
    <>
      <div className="hidden lg:grid grid-cols-2 gap-4 place-items-start w-full mt-2">
        {renderFilter()}
      </div>
      <ButtonUi isIconOnly className="lg:hidden" theme={Colors.Info} onPress={modalFilters.onOpen}>
        <Filter />
      </ButtonUi>
      <Drawer {...modalFilters} placement="bottom">
        <DrawerContent>
          <DrawerHeader>Buscar Categorias</DrawerHeader>
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

export default RenderCategoryFilters;
