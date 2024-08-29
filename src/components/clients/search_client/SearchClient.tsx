import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { global_styles } from '@/styles/global.styles';
import { Autocomplete, Button, Input } from '@nextui-org/react';
import { Filter, Mail, User } from 'lucide-react';
import { useState } from 'react';

function SearchClient() {
  const [openVaul, setOpenVaul] = useState(false);
  return (
    <div className="flex items-center gap-5">
      <div className="block md:hidden">
        <TooltipGlobal text="Buscar por filtros" color="primary">
          <Button
            onClick={() => setOpenVaul(true)}
            style={global_styles().thirdStyle}
            isIconOnly
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
          <div className="flex flex-col gap-3">
            <Input
              startContent={<User />}
              className="w-full dark:text-white"
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
                // handleSearch("");
              }}
            />
            <Autocomplete
              onSelectionChange={(_key) => {}}
              className="w-full dark:text-white"
              label="Sucursal"
              labelPlacement="outside"
              placeholder="Selecciona una sucursal"
              variant="bordered"
              classNames={{
                base: 'font-semibold text-gray-500 text-sm',
              }}
              clearButtonProps={{}}
            >
              <></>
              {/* {branch_list.map((bra) => (
                <AutocompleteItem value={bra.name} className="dark:text-white" key={bra.name}>
                  {bra.name}
                </AutocompleteItem>
              ))} */}
            </Autocomplete>
            <Input
              startContent={<Mail />}
              className="w-full dark:text-white"
              variant="bordered"
              labelPlacement="outside"
              label="Correo"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              placeholder="Escribe para buscar..."
              isClearable
              onClear={() => {
                // handleSearch("");
              }}
            />

            <Button
              style={{}}
              className="font-semibold"
              color="primary"
              onClick={() => {
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

export default SearchClient;
