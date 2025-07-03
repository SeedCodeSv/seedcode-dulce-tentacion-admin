import { Autocomplete, AutocompleteItem, Tooltip, useDisclosure } from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import { MdWarning } from 'react-icons/md';
import { toast } from 'sonner';

import BranchProductSelectedOrder from './branch-product-selected-order';

import { steps } from '@/shopping-branch-product/components/process/types/process.types';
import { Branches } from '@/types/branches.types';
import { useBranchesStore } from '@/store/branches.store';
import { useShippingBranchProductBranch } from '@/shopping-branch-product/store/shipping_branch_product.store';
import { verify_products_stock } from '@/services/branch_product.service';
import { SigningProcess } from '@/shopping-branch-product/components/process/SingningProcess';
import DivGlobal from '@/themes/ui/div-global';
import SelectProductNote from '@/components/note-remision/SelectProduct';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

interface Product {
  id: number;
  name: string;
  quantity: number;
}

export default function NotaRemisionProdutOrder() {
  const { getBranchesList, branch_list } = useBranchesStore();
  const { product_selected, branchDestiny, setResponse, response, OnGetShippinProductBranch } =
    useShippingBranchProductBranch();
  const [branchData, setBranchData] = useState<Branches>();
  const modalLoading = useDisclosure();
  const [currentState, setCurrentState] = useState(steps[0].title);
  const [titleError, setTitleError] = useState('');
  const [messageError, setMessageError] = useState<string[]>([]);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 30,
    name: '',
    category: '',
    supplier: '',
    code: '',
  });
  const modalProducts = useDisclosure()

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

  const verifyProducts = (branch: Branches) => {
    let products: Product[] = [];

    product_selected.map((item) => {
      products.push({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity ?? 1,
      });
    });

    verify_products_stock(branch.id, products).then((data) => {
      if (data) {
        setResponse(data.data);
      }
    });
  };

  const getProblemSummary = useMemo(() => {
    const results = response.results;
    const notFound = results.filter((item) => item.status === 'not_found');
    const insufficient = results.filter((item) => item.status === 'insufficient_stock');

    const tooltipContent = (
      <div className="text-sm space-y-1">
        {notFound.length > 0 && (
          <div>
            <strong className="text-red-600 block">No existen en la sucursal:</strong>
            {notFound.map((item) => (
              <div key={item.productId} className="text-red-700">
                {item.productName}
              </div>
            ))}
          </div>
        )}
        {insufficient.length > 0 && (
          <div className="mt-2">
            <strong className="text-yellow-600 block">Stock insuficiente:</strong>
            {insufficient.map((item) => (
              <div key={item.productId} className="text-yellow-700">
                {item.productName} ({item.stock} disponibles, requiere {item.required})
              </div>
            ))}
          </div>
        )}
      </div>
    );

    return {
      hasIssues: notFound.length > 0 || insufficient.length > 0,
      tooltipContent,
    };
  }, [response]);

  return (
    <>
      <DivGlobal>
        <BranchProductSelectedOrder
          branchData={branchData!}
          branchDestiny={branchDestiny}
          openModalSteps={modalLoading.onOpenChange}
          setCurrentStep={setCurrentState}
          setErrors={setMessageError}
          setResponse={setResponse}
          setTitleString={setTitleError}
          titleError={titleError}
        >
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start w-full">
            <Autocomplete
              className="max-w-72 dark:text-white"
              classNames={{
                base: 'font-semibold text-sm text-gray-900 dark:text-white',
              }}
              clearButtonProps={{
                onClick: () => {
                  setBranchData(undefined);
                },
              }}
              label="Seleccione la sucursal de Origen"
              labelPlacement="outside"
              placeholder="Seleccioné la sucursal de Origen"
              variant="bordered"
              onSelectionChange={(key) => {
                if (key) {
                  const branch = branch_list.find((b) => b.id === Number(key));

                  if (branch) {
                    setBranchData(branch as any);
                    verifyProducts(branch);
                  }
                }
              }}
            >
              {branch_list.map((b) => (
                <AutocompleteItem key={b.id} className="dark:text-white">
                  {b.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            {response &&
              response?.results?.length > 0 &&
              (() => {
                const { hasIssues, tooltipContent } = getProblemSummary;

                if (!hasIssues) return null;

                return (
                  <div className="lg:w-[30vw] rounded-lg bg-yellow-50 p-4 text-sm flex items-start gap-2">
                    <MdWarning className="text-yellow-600 mt-1" size={20} />
                    <div>
                      <div className="text-yellow-800">
                        Se encontraron productos con problemas: algunos no existen en la sucursal y
                        otros tienen stock insuficiente.
                      </div>
                      <Tooltip content={tooltipContent} placement="right">
                        <button className="text-blue-600 underline text-xs mt-1">
                          Ver detalles
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                );
              })()}
            <ButtonUi
              theme={!branchData ? Colors.Warning : Colors.Success}
              onPress={() => {
                if(!branchData){
                  toast.error('Debes Seleccionar la sucursal de origen') 

                  return 
                }
                modalProducts.onOpen();
              }}
              
            >
              Seleccionar productos
            </ButtonUi>
          </div>
        </BranchProductSelectedOrder>
        <SigningProcess
          currentState={currentState}
          errors={messageError}
          isOpen={modalLoading.isOpen}
          titleMessage={titleError}
          onClose={() => modalLoading.onClose()}
        />
        <SelectProductNote
          filter={filter}
          modalProducts={modalProducts}
          selectedBranch={branchData ?? ({} as Branches)}
          setFilter={setFilter}

        />
      </DivGlobal>
    </>
  );
}
