import { Autocomplete, AutocompleteItem, Drawer, DrawerBody, DrawerContent, DrawerHeader, useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import { MdCancel, MdCheckCircle, MdWarning } from "react-icons/md";

import { steps } from "@/shopping-branch-product/components/process/types/process.types";
import ShippingProductBranchSelected from "@/shopping-branch-product/components/ShippingProductBranchSelected";
import useColors from "@/themes/use-colors";
import { Branches } from "@/types/branches.types";
import { useBranchesStore } from "@/store/branches.store";
import { useShippingBranchProductBranch } from "@/shopping-branch-product/store/shipping_branch_product.store";
import { verify_products_stock } from "@/services/branch_product.service";
import { ICheckStockResponse } from "@/types/branch_products.types";


type DisclosureProps = ReturnType<typeof useDisclosure>;

interface Props {
    disclousure: DisclosureProps
}

interface Product {
    id: number,
    name: string,
    quantity: number,
}

export default function NotaRemisionProdutOrder({ disclousure }: Props) {
    const { getBranchesList, branch_list } = useBranchesStore();
    const { product_selected } = useShippingBranchProductBranch();
    const { backgroundColor, textColor } = useColors()
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
        <Drawer isOpen={disclousure.isOpen} placement="right" size="full" onClose={() => disclousure.onClose()}>
            <DrawerContent style={{ ...backgroundColor, ...textColor }}>
                <DrawerHeader>Nota de Remision</DrawerHeader>
                <DrawerBody>
                    <div className="flex gap-4 ">
                        <Autocomplete
                            className="dark:text-white"
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
                            <div className="w-full rounded-lg bg-gray-100 p-4 space-y-2">
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
                    <span className="hidden">
                        {currentState}
                        {messageError}
                    </span>
                    <ShippingProductBranchSelected
                        branchData={branchData!}
                        openModalSteps={modalLoading.onOpenChange}
                        setCurrentStep={setCurrentState}
                        setErrors={setMessageError}
                        setTitleString={setTitleError}
                        titleError={titleError}
                    />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}