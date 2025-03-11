import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { global_styles } from '@/styles/global.styles';
import { Button, Input } from "@heroui/react";
import { Filter, Phone, User } from 'lucide-react';
import { useState } from 'react';
import { IPropsSearchBranch } from '../types/mobile_view.types';
import { useBranchesStore } from '@/store/branches.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

function SearchBranch(props: IPropsSearchBranch) {
  const [openVaul, setOpenVaul] = useState(false);
  const { getBranchesPaginated } = useBranchesStore();
  const [filter, setFilter] = useState({
    nameBranch: '',
    phoneBranch: '',
    addressBranch: '',
  });
  const handleSearch = () => {
    getBranchesPaginated(1, 5, filter.nameBranch, filter.phoneBranch, filter.addressBranch);
  };
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
          <div className="flex flex-col  gap-2">
            <Input
              onClear={() => {
                setFilter({ ...filter, nameBranch: '' });

                handleSearch();
              }}
              isClearable
              onChange={(e) => {
                setFilter({ ...filter, nameBranch: e.target.value });
                props.nameBranch(e.target.value);
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
            />
            <Input
              onClear={() => {
                setFilter({ ...filter, phoneBranch: '' });
                handleSearch();
              }}
              isClearable
              onChange={(e) => {
                setFilter({ ...filter, phoneBranch: e.target.value });
                props.phoneBranch(e.target.value);
              }}
              startContent={<Phone />}
              className="w-full border dark:border-white rounded-xl  dark:text-white"
              variant="bordered"
              labelPlacement="outside"
              label="Telefono"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              placeholder="Escribe para buscar..."
            />
            <Input
              value={filter.addressBranch}
              onClear={() => {
                setFilter({ ...filter, addressBranch: '' });
                handleSearch();
              }}
              isClearable
              onChange={(e) => {
                setFilter({ ...filter, addressBranch: e.target.value });
                props.addressBranch(e.target.value);
              }}
              startContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-map-pin-house"
                >
                  <path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z" />
                  <path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2" />
                  <path d="M18 22v-3" />
                  <circle cx="10" cy="10" r="3" />
                </svg>
              }
              className="w-full border dark:border-white rounded-xl  dark:text-white"
              variant="bordered"
              labelPlacement="outside"
              label="Dirección"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              placeholder="Escribe para buscar..."
            />
            <ButtonUi
              theme={Colors.Primary}
              className="mb-10 font-semibold"
              color="primary"
              onPress={() => {
                handleSearch();
                setFilter({
                  nameBranch: '',
                  phoneBranch: '',
                  addressBranch: '',
                });
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

export default SearchBranch;
