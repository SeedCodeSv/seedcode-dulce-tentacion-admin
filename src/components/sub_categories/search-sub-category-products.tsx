import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  Switch,
  useDisclosure,
} from '@heroui/react';
import classNames from 'classnames';
import { User } from 'lucide-react';
import React from 'react';

import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';

interface SearchSubCategoryProductProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (value: string | undefined) => void;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filters = ({
  search,
  setSearch,
  handleSearch,
  active,
  setActive,
}: SearchSubCategoryProductProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between w-full gap-10">
      <div className="flex flex-col md:flex-row gap-10">
        <Input
          isClearable
          className="w-full xl:w-96 dark:text-white"
          classNames={{
            label: 'font-semibold text-gray-700',
            inputWrapper: 'pr-0',
          }}
          label="Nombre"
          labelPlacement="outside"
          placeholder="Escribe para buscar..."
          startContent={<User />}
          value={search}
          variant="bordered"
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => {
            setSearch('');
            handleSearch('');
          }}
        />

        <Switch
          className="mt-4"
          classNames={{
            thumb: classNames(active ? 'bg-blue-500' : 'bg-gray-400'),
            wrapper: classNames(active ? '!bg-blue-300' : 'bg-gray-200'),
          }}
          isSelected={active}
          onValueChange={(isActive) => setActive(isActive)}
        >
          <span className="text-sm sm:text-base whitespace-nowrap dark:text-white">
            Mostrar {active ? 'inactivos' : 'activos'}
          </span>
        </Switch>
      </div>
      <div className="hidden md:flex justify-end items-end">
        <ButtonUi className="px-10" theme={Colors.Primary} onPress={() => handleSearch(undefined)}>
          Aplicar filtros
        </ButtonUi>
      </div>
    </div>
  );
};

type DisclosureProps = ReturnType<typeof useDisclosure>;

interface DrawerProps extends SearchSubCategoryProductProps {
  disclosure: DisclosureProps;
}

function SearchSubCategoryProduct({ ...props }: DrawerProps) {
  return (
    <>
      <Drawer {...props.disclosure} placement="bottom">
        <DrawerContent>
          <DrawerHeader>Filtros disponibles</DrawerHeader>
          <DrawerBody>{Filters({ ...props })}</DrawerBody>
          <DrawerFooter>
            <ButtonUi
              className="px-10"
              theme={Colors.Primary}
              onPress={() => {
                props.disclosure.onClose();
                props.handleSearch(undefined)
              }}
            >
              Aplicar filtros
            </ButtonUi>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export { SearchSubCategoryProduct, Filters };
