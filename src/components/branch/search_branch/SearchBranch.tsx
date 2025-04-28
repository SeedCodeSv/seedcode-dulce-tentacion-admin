import { Button, Input } from "@heroui/react";
import { Filter, Phone, User } from 'lucide-react';
import { useState } from 'react';

import { IPropsSearchBranch } from '../types/mobile_view.types';

import { global_styles } from '@/styles/global.styles';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import BottomDrawer from '@/components/global/BottomDrawer';
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
          <div className="flex flex-col  gap-2">
            <Input
              isClearable
              className="w-full border dark:border-white rounded-xl  dark:text-white"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              label="Nombre"
              labelPlacement="outside"
              placeholder="Escribe para buscar..."
              startContent={<User />}
              variant="bordered"
              onChange={(e) => {
                setFilter({ ...filter, nameBranch: e.target.value });
                props.nameBranch(e.target.value);
              }}
              onClear={() => {
                setFilter({ ...filter, nameBranch: '' });

                handleSearch();
              }}
            />
            <Input
              isClearable
              className="w-full border dark:border-white rounded-xl  dark:text-white"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              label="Telefono"
              labelPlacement="outside"
              placeholder="Escribe para buscar..."
              startContent={<Phone />}
              variant="bordered"
              onChange={(e) => {
                setFilter({ ...filter, phoneBranch: e.target.value });
                props.phoneBranch(e.target.value);
              }}
              onClear={() => {
                setFilter({ ...filter, phoneBranch: '' });
                handleSearch();
              }}
            />
            <Input
              isClearable
              className="w-full border dark:border-white rounded-xl  dark:text-white"
              classNames={{
                label: 'font-semibold text-gray-700',
                inputWrapper: 'pr-0',
              }}
              label="Dirección"
              labelPlacement="outside"
              placeholder="Escribe para buscar..."
              startContent={
                <svg
                  className="lucide lucide-map-pin-house"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z" />
                  <path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2" />
                  <path d="M18 22v-3" />
                  <circle cx="10" cy="10" r="3" />
                </svg>
              }
              value={filter.addressBranch}
              variant="bordered"
              onChange={(e) => {
                setFilter({ ...filter, addressBranch: e.target.value });
                props.addressBranch(e.target.value);
              }}
              onClear={() => {
                setFilter({ ...filter, addressBranch: '' });
                handleSearch();
              }}
            />
            <ButtonUi
              className="mb-10 font-semibold"
              color="primary"
              theme={Colors.Primary}
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
