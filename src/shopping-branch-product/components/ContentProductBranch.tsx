import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@heroui/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { CiWarning } from 'react-icons/ci';

import { useShippingBranchProductBranch } from '../store/shipping_branch_product.store';
import { Branches } from '../types/shipping_branch_product.types';

import ShippingProductBranchSelected from './ShippingProductBranchSelected';
import { SigningProcess } from './process/SingningProcess';
import { steps } from './process/types/process.types';

import { useBranchesStore } from '@/store/branches.store';
import SelectProductNote from '@/components/note-remision/SelectProduct';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';



export default function ContentProductBranch() {
  const { getBranchesList, branch_list } = useBranchesStore();
  const [branchData, setBranchData] = useState<Branches>();
  const navigate = useNavigate()
  const [filter, setFilter] = useState({
    page: 1,
    limit: 30,
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
    product_selected,
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
  }, []);

  useEffect(() => {
    if (branchData?.id === 0) {
      setIsEnabled(false);
      OnClearProductSelectedAll();
    }
  }, [branchData]);

  const modalExit = useDisclosure()
  const autocomplete = React.useRef<HTMLInputElement>(null)


  useHotkeys('ctrl+f1', () => {
    autocomplete?.current?.focus()
  })

  useHotkeys('ctrl+f2', () => {
    if (!branchData) {
      toast.warning('Debes seleccionar una sucursal')

      return
    }
    modalProducts.onOpen()
  })

  useHotkeys(['Esc'], () => {
    if (product_selected[0]?.id) {
      modalExit.onOpen()

    } else {
      navigate(-1)

    }
  })

  useHotkeys('Enter', () => {
    if (modalExit.isOpen) {
      handleExit()
    }
  })

  const handleExit = () => {
    modalExit.onClose()
    OnClearProductSelectedAll();
    navigate(-1)
  }

  return (
    <>
      <Modal isDismissable isOpen={modalExit.isOpen} onClose={modalExit.onClose}>
        <ModalContent>

          <ModalHeader>
            <CiWarning color={'orange'} size={28} />
            <p className='dark:text-white'> Tienes productos seleccionados</p>
          </ModalHeader>
          <ModalBody>
            <h2 className='dark:text-white '>
              ¿Estás seguro de que quieres volver atrás?
              Al hacerlo, deberás seleccionar nuevamente los productos.
            </h2>
            <div className='flex justify-between'>
              <ButtonUi
                theme={Colors.Error}
                onPress={() => { modalExit.onClose() }
                }
              >
                Cancelar
              </ButtonUi>
              <ButtonUi
                theme={Colors.Success}
                onPress={() => {

                }}
              >
                Aceptar
              </ButtonUi>
            </div>
          </ModalBody>
        </ModalContent>

      </Modal>
      <div className="w-full ">
        <div className="space-y-6">
          <Button
            className="bg-transparent dark:text-white flex"
            onPress={() => navigate('/note-referal')}
          >
            <ArrowLeft /> Regresar
          </Button>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-3 gap-4">
              <Autocomplete
                ref={autocomplete}
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
