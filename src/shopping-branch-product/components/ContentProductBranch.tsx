import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Autocomplete, AutocompleteItem, Button, Input, useDisclosure } from '@heroui/react';

import { useShippingBranchProductBranch } from '../store/shipping_branch_product.store';
import { Branches } from '../types/shipping_branch_product.types';

import ShippingProductBranchSelected from './ShippingProductBranchSelected';
import { SigningProcess } from './process/SingningProcess';
import { steps } from './process/types/process.types';

import { useCategoriesStore } from '@/store/categories.store';
import { useBranchesStore } from '@/store/branches.store';
import SelectProductNote from '@/components/note-remision/SelectProduct';
export default function ContentProductBranch() {
  const { getBranchesList, branch_list } = useBranchesStore();
  const { list_categories, getListCategories } = useCategoriesStore();
  const [branchData, setBranchData] = useState<Branches>();
  const [filter, setFilter] = useState({
    page: 1,
    limit: 5,
    name: '',
    category: '',
    supplier: '',
    code: '',
  });
  const [currentState, setCurrentState] = useState(steps[0].title);
  const [titleError, setTitleError] = useState('');
  const [messageError, setMessageError] = useState<string[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const modalLoading = useDisclosure();
  const modalProducts = useDisclosure();

  const {
    OnGetShippinProductBranch,
    OnClearProductSelectedAll,
  } = useShippingBranchProductBranch();

  useEffect(() => {
    OnGetShippinProductBranch(
      branchData?.id ?? 0,
      filter.page,
      filter.limit,
      filter.name,
      filter.category,
      filter.supplier,
      filter.code
    );
  }, [filter, branchData]);

  useEffect(() => {
    getBranchesList();
    getListCategories();
  }, []);


  useEffect(() => {
    if (branchData?.id === 0) {
      setIsEnabled(false);
      OnClearProductSelectedAll();
    }
  }, [branchData]);

  return (
    <>
      <div className="w-full ">
        <div className="space-y-6">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-3 gap-4">
              <Autocomplete
                className="dark:text-white"
                classNames={{
                  base: 'font-semibold text-sm text-gray-900 dark:text-white',
                }}
                clearButtonProps={{
                  onClick: () => {
                    setIsEnabled(false);
                    setBranchData(undefined);
                    OnClearProductSelectedAll();
                  },
                }}
                label="Seleccione la sucursal de Origen"
                labelPlacement="outside"
                placeholder="Seleccioné la sucursal de Origen"
                variant="bordered"
                onSelectionChange={(key) => {
                  if (key) {
                    const branch = branch_list.find((b) => b.id === Number(key));

                    if (!branch) {
                      toast.error('Sucursal no encontrada');

                      return;
                    }
                    setBranchData(branch as any);
                    setIsEnabled(true);
                    OnClearProductSelectedAll();
                  }
                }}
              >
                {branch_list.map((b) => (
                  <AutocompleteItem key={b.id} className="dark:text-white">
                    {b.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>

              <Autocomplete
                className="dark:text-white"
                classNames={{
                  base: 'font-semibold text-sm text-gray-900 dark:text-white',
                }}
                clearButtonProps={{
                  onClick: () => {
                    setFilter({ ...filter, category: '' });
                  },
                }}
                label="Selecciona la categoria"
                labelPlacement="outside"
                placeholder="Seleccione la categoria"
                variant="bordered"
                onSelectionChange={(key) => {
                  if (key) {
                    setFilter({ ...filter, category: String(key) });
                  }
                }}
              >
                {list_categories.map((b) => (
                  <AutocompleteItem key={b.name} className="dark:text-white">
                    {b.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              <Input
                className="dark:text-white"
                classNames={{
                  base: 'font-semibold text-sm text-gray-900 dark:text-white',
                }}
                label="Código"
                labelPlacement="outside"
                placeholder="Codigo"
                variant="bordered"
                onChange={(e) => setFilter({ ...filter, code: e.target.value })}
              />
              <Input
                className="dark:text-white"
                classNames={{
                  base: 'font-semibold text-sm text-gray-900 dark:text-white',
                }}
                defaultValue={filter?.name}
                label="Nombre del producto"
                labelPlacement="outside"
                placeholder="Buscar por nombre del producto"
                variant="bordered"
                onChange={(e) => setFilter({ ...filter, name: e.target.value })}
              />
              <div />
              <Button
                isDisabled={!isEnabled}
                style={{
                  backgroundColor: isEnabled ? '#2E8B57' : 'gray',
                  color: 'white',
                  width: '50%',
                  justifySelf: 'end',
                }}
                onPress={() => {
                  isEnabled && modalProducts.onOpen();
                }}
              >
                Seleccionar productos
              </Button>
            </div>
          
            {branchData && (
              <ShippingProductBranchSelected
                branchData={branchData}
                openModalSteps={modalLoading.onOpenChange}
                setCurrentStep={setCurrentState}
                setErrors={setMessageError}
                setTitleString={setTitleError}
                titleError={titleError}
              />
            )}
          </motion.div>
        </div>
        <SigningProcess
          currentState={currentState}
          errors={messageError}
          isOpen={modalLoading.isOpen}
          titleMessage={titleError}
          onClose={() => modalLoading.onClose()}
        />
      </div>
      <SelectProductNote
        filter={filter}
        modalProducts={modalProducts}
        selectedBranch={branchData ?? ({} as Branches)}
        setFilter={setFilter}
       
      />
    </>
  );
}
