import BottomDrawer from '@/components/global/BottomDrawer';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { useBranchesStore } from '@/store/branches.store';
import { useCorrelativesStore } from '@/store/correlatives-store/correlatives.store';
import { global_styles } from '@/styles/global.styles';
import { correlativesTypes } from '@/types/correlatives/correlatives_data.types';
import { Autocomplete, AutocompleteItem, Button } from "@heroui/react";
import { Filter } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { IPropsSearchCorrelative } from '../types/mobile_correlatives_types';
import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';

function SearchCorrelative(props: IPropsSearchCorrelative) {
  const [openVaul, setOpenVaul] = React.useState(false);
  const [filter, setFilter] = useState({
    branchName: '',
    correlativeType: '',
  });
  const { OnGetByBranchAndTypeVoucherCorrelatives } = useCorrelativesStore();
  const { getBranchesList, branch_list } = useBranchesStore();
  useEffect(() => {
    getBranchesList();
  }, []);
  return (
    <div className="flex items-center gap-5">
      <div className="block md:hidden">
        <TooltipGlobal text="Buscar por filtros" color="primary">
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
          title="Filtros disponibles"
          open={openVaul}
          onClose={() => setOpenVaul(false)}
        >
          <div className="flex flex-col  gap-3">
            <div className="w-full">
              <label className="text-sm font-semibold dark:text-white">Sucursal</label>
              <Autocomplete
                onSelectionChange={(e) => {
                  const selectNameBranch = branch_list.find(
                    (bra) => bra.name === new Set([e]).values().next().value
                  );
                  setFilter({ ...filter, branchName: selectNameBranch?.name || '' });
                  props.branchName(selectNameBranch?.name || '');
                }}
                labelPlacement="outside"
                placeholder="Selecciona la sucursal"
                variant="bordered"
                className="dark:text-white border border-white rounded-xl"
                classNames={{
                  base: 'font-semibold text-sm',
                }}
              >
                {branch_list.map((bra) => (
                  <AutocompleteItem className="dark:text-white" key={bra.name}>
                    {bra.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <div className="w-full">
              <label className="text-sm font-semibold dark:text-white">Tipo de Factura</label>
              <Autocomplete
                onSelectionChange={(e) => {
                  const selectCorrelativeType = correlativesTypes.find(
                    (dep) => dep.value === new Set([e]).values().next().value
                  );
                  setFilter({ ...filter, correlativeType: selectCorrelativeType?.value || '' });
                  props.typeVoucher(selectCorrelativeType?.value || '');
                }}
                labelPlacement="outside"
                placeholder="Selecciona el Tipo de Factura"
                variant="bordered"
                className="dark:text-white border border-white rounded-xl"
                classNames={{
                  base: 'text-gray-500 text-sm',
                }}
              >
                {correlativesTypes.map((dep) => (
                  <AutocompleteItem className="dark:text-white" key={dep.value}>
                    {dep.value + ' - ' + dep.label}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <ButtonUi
              theme={Colors.Primary}
              className="mb-10 font-semibold border border-white rounded-xl"
              color="primary"
              onClick={() => {
                OnGetByBranchAndTypeVoucherCorrelatives(
                  1,
                  5,
                  filter.branchName,
                  filter.correlativeType
                );
                setFilter({ ...filter, branchName: '', correlativeType: '' });
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

export default SearchCorrelative;
