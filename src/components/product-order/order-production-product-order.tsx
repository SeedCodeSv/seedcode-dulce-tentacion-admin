import {
    Drawer, DrawerBody, DrawerContent, DrawerHeader, SelectItem, useDisclosure, Select,
    Button,
} from "@heroui/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { PackageX, Store } from "lucide-react";

import AddProductionOrderByProductOrder from "./add-production-order-product-order";

import useColors from "@/themes/use-colors";
import { useProductionOrderStore } from "@/store/production-order.store";
import { useBranchesStore } from "@/store/branches.store";
import { Branches } from "@/types/branches.types";
import { ResponseVerifyProduct } from "@/types/production-order.types";
import { useShippingBranchProductBranch } from "@/shopping-branch-product/store/shipping_branch_product.store";
import Pui from "@/themes/ui/p-ui";
import { useAlert } from "@/lib/alert";

type DisclosureProps = ReturnType<typeof useDisclosure>;

interface Props {
    disclosure?: DisclosureProps
}

type ProductRecipe = ResponseVerifyProduct & {
    quantity: number;
};


export default function OrderProductionProductOrder({ disclosure }: Props) {
    const { backgroundColor, textColor } = useColors()
    const { selectedProducts, handleVerifyProduct } = useProductionOrderStore()
    const [selectedBranch, setSelectedBranch] = useState<Branches>();
    const [selectedProduct, setSelectedProduct] = useState<ProductRecipe>();
    const { branchDestiny } = useShippingBranchProductBranch();
    const modalAdd = useDisclosure();
    const { show } = useAlert()


    const { getBranchesList, branch_list } = useBranchesStore();


    const OnVerifyProduct = async (id: number) => {

        const res = await handleVerifyProduct({
            branchDestinationId: branchDestiny.id,
            branchDepartureId: Number(selectedBranch?.id ?? 0),
            productId: id,
        });

        if (!res.ok && res.message?.includes("No se encontró el producto")) {
            toast.error('No se encontró el producto')

            return
        }

        if (!res.ok && res.message?.includes("TypeError: Cannot read properties of null (reading 'productRecipeBookDetails')")) {
            toast.error('Este producto no tiene receta')

            return
        }

        if (!res.ok && res.errors && selectedProduct?.branchProduct.id !== res.branchProduct.id) {

            const bProduct = selectedProducts.find(item => item.product.id === id)

            show({
                type: 'warning',
                content: (
                    <div className="flex flex-col gap-2 py-2">
                        <p className="font-bold text-orange-500">
                            {`Problemas con los insumos del producto seleccionado ( ${bProduct?.product.name}): `}
                        </p>

                        {res.errors.map((item, index) => (
                            <span key={index} className="flex items-center gap-2 text-gray-700">
                                {item.exist === false ? (
                                    <Store className="text-red-500" size={20} />
                                ) : (
                                    <PackageX className="text-yellow-500" size={20} />
                                )}
                                <p className="font-semibold">{item.nameProduct}</p> - {item.description}
                            </span>
                        ))}
                    </div>
                ),
            });



            return
        }

        await handleAddProductRecipe(res)
        modalAdd.onOpen()
    }

    const handleAddProductRecipe = async (recipe: ResponseVerifyProduct): Promise<void> => {
        setSelectedProduct(
            {
                ...recipe,
                quantity: 1,
            },
        );
        toast.success(`Se agregó ${recipe.branchProduct?.product?.name} con éxito`);
    };

    useEffect(() => {
        getBranchesList()
    }, [])

    return (
        <>
            <Drawer {...disclosure} isDismissable={false} size="xl" onClose={() => {
                disclosure?.onClose()
                setSelectedProduct(undefined)
            }}>
                <DrawerContent>
                    <>
                        <DrawerHeader>
                            <Pui>Elige un producto para iniciar la producción</Pui>
                        </DrawerHeader>
                        <DrawerBody className="flex flex-col gap-4">
                            <div className="flex items-center gap-1">
                                <Select
                                    required
                                    className="dark:text-white w-full"
                                    classNames={{ label: 'font-semibold' }}
                                    errorMessage={selectedBranch === undefined ? 'Debes seleccionar una sucursal para continuar' : ''}
                                    isInvalid={selectedBranch === undefined}
                                    label="Extraer producto de"
                                    placeholder="Selecciona la sucursal de origen"
                                    selectedKeys={selectedBranch?.id ? [String(selectedBranch.id)] : []}
                                    variant="bordered"
                                    onSelectionChange={(keys) => {
                                        const key = Array.from(keys)[0];
                                        const branch = branch_list.find((item) => item.id === Number(key));

                                        if (branch) {
                                            setSelectedBranch(branch);
                                        } else {
                                            setSelectedBranch(undefined);
                                            setSelectedProduct(undefined);
                                        }
                                    }}
                                >
                                    {branch_list.map((b) => (
                                        <SelectItem key={b.id.toString()} className="dark:text-white">
                                            {b.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                {selectedProducts.length > 0 && selectedProducts.map((item) => (
                                    <Button
                                        key={item.id}
                                        className="p-7 bg-white border-gray-200"
                                        isDisabled={selectedBranch === undefined}
                                        variant="bordered"
                                        onPress={() => OnVerifyProduct(item.product.id)}
                                    >
                                        <span className="text-lg text-gray-700">
                                            {item.product.name}
                                        </span>
                                    </Button>
                                ))}
                            </div>
                        </DrawerBody>

                    </>
                </DrawerContent>
            </Drawer>
            <Drawer {...modalAdd} placement="right" size="full" onClose={() =>{
                modalAdd.onClose()
                setSelectedProduct(undefined)
            }}>
                <DrawerContent style={{ ...backgroundColor, ...textColor }}>
                    <DrawerHeader>Orden de Producción</DrawerHeader>
                    <DrawerBody>
                        <AddProductionOrderByProductOrder
                            branchOrigin={selectedBranch!}
                            disclosure={modalAdd}
                            selectedProduct={selectedProduct!}
                            setSelectedProduct={(product) => setSelectedProduct(product)}
                        />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </>
    )
}