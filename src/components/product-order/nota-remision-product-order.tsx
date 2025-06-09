import { Autocomplete, AutocompleteItem, useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import { MdCancel, MdCheckCircle, MdWarning } from "react-icons/md";

import BranchProductSelectedOrder from "./branch-product-selected-order";

import { steps } from "@/shopping-branch-product/components/process/types/process.types";
import { Branches } from "@/types/branches.types";
import { useBranchesStore } from "@/store/branches.store";
import { useShippingBranchProductBranch } from "@/shopping-branch-product/store/shipping_branch_product.store";
import { verify_products_stock } from "@/services/branch_product.service";
import { ICheckStockResponse } from "@/types/branch_products.types";
import { SigningProcess } from "@/shopping-branch-product/components/process/SingningProcess";
import Layout from "@/layout/Layout";
import DivGlobal from "@/themes/ui/div-global";

interface Product {
    id: number,
    name: string,
    quantity: number,
}

export default function NotaRemisionProdutOrder() {
    const { getBranchesList, branch_list } = useBranchesStore();
    const { product_selected, branchDestiny } = useShippingBranchProductBranch();
    const [branchData, setBranchData] = useState<Branches>();
    const modalLoading = useDisclosure();
    const [currentState, setCurrentState] = useState(steps[0].title);
    const [titleError, setTitleError] = useState('');
    const [messageError, setMessageError] = useState<string[]>([]);
    const [response, setResponse] = useState<ICheckStockResponse>()

    useEffect(() => {
        getBranchesList()
    }, [])

    const verifyProducts = (branch: Branches) => {
        let products: Product[] = []

        product_selected.map((item) => {
            products.push({
                id: item.product.id,
                name: item.product.name,
                quantity: item.quantity ?? 1
            })
        })

        verify_products_stock(branch.id, products).then((data) => {
            if (data) {
                setResponse(data.data)
            }
        })
    }

    return (
        <Layout title="Nota de Remisón">
            <DivGlobal>

                <BranchProductSelectedOrder
                    branchData={branchData!}
                    branchDestiny={branchDestiny}
                    openModalSteps={modalLoading.onOpenChange}
                    response={response}
                    setCurrentStep={setCurrentState}
                    setErrors={setMessageError}
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
                                        verifyProducts(branch)
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
                        {response && response.results.length > 0 && (
                            <div className="lg:w-[30vw] rounded-lg bg-gray-100 p-4 space-y-2">
                                {response.results.map((item) => {
                                    let icon, color, message;

                                    switch (item.status) {
                                        case 'ok':
                                            icon = <span className="text-green-600"><MdCheckCircle /></span>;
                                            color = 'text-green-700';
                                            message = `${item.productName}: stock suficiente (${item.stock} disponibles, requiere ${item.required})`;
                                            break;
                                        case 'insufficient_stock':
                                            icon = <span className="text-yellow-600"><MdWarning /></span>;
                                            color = 'text-yellow-700';
                                            message = `${item.productName}: stock insuficiente (${item.stock} disponibles, requiere ${item.required})`;
                                            break;
                                        case 'not_found':
                                            icon = <span className="text-red-600"><MdCancel /></span>;
                                            color = 'text-red-700';
                                            message = `${item.productName}: no encontrado en esta sucursal`;
                                            break;
                                        default:
                                            icon = null;
                                            color = 'text-gray-700';
                                            message = item.productName;
                                    }

                                    return (
                                        <div key={item.productId} className={`flex items-center gap-2 ${color}`}>
                                            {icon}
                                            <span>{message}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                    </div>

                </BranchProductSelectedOrder>
                <SigningProcess
                    currentState={currentState}
                    errors={messageError}
                    isOpen={modalLoading.isOpen}
                    titleMessage={titleError}
                    onClose={() => modalLoading.onClose()}
                />
            </DivGlobal>
        </Layout>
    )
}