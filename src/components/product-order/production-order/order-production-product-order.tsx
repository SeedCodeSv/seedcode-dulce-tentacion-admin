import {
    Drawer, DrawerBody, DrawerContent, DrawerHeader, SelectItem, useDisclosure, Select,
    Button,
    ModalBody,
    ModalContent,
    Modal,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Check, ChevronLeft, PackageX, Store, TriangleAlert } from "lucide-react";

import AddProductionOrderByProductOrder from "./add-production-order-product-order";

import { useProductionOrderStore } from "@/store/production-order.store";
import { useBranchesStore } from "@/store/branches.store";
import { Branches } from "@/types/branches.types";
import { ResponseVerifyProduct } from "@/types/production-order.types";
import { useShippingBranchProductBranch } from "@/shopping-branch-product/store/shipping_branch_product.store";
import Pui from "@/themes/ui/p-ui";
import Layout from "@/layout/Layout";
import DivGlobal from "@/themes/ui/div-global";
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import { TableComponent } from "@/themes/ui/table-ui";
import TdGlobal from "@/themes/ui/td-global";


type ProductRecipe = ResponseVerifyProduct & {
    quantity: number;
};

export default function OrderProductionProductOrder() {
    const { selectedProducts, handleVerifyProduct, errors, verified_product } = useProductionOrderStore()
    const [selectedBranch, setSelectedBranch] = useState<Branches>();
    const [selectedProduct, setSelectedProduct] = useState<ProductRecipe>();
    const { branchDestiny } = useShippingBranchProductBranch();
    const [isOpen, setIsOpen] = useState(true)
    const modalError = useDisclosure()

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
            modalError.onOpen()

            return
        }

        await handleAddProductRecipe(res)
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
            <Layout title="Orden de Prodcucción">
                <DivGlobal className="flex h-full">
                    <Drawer isOpen={isOpen} size="xl" onClose={() => {
                        setIsOpen(false)
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
                                                }
                                                setSelectedProduct(undefined);
                                            }}
                                        >
                                            {branch_list.map((b) => (
                                                <SelectItem key={b.id.toString()} className="dark:text-white">
                                                    {b.name}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                    <div>
                                        <TableComponent
                                            headers={['Producto', 'Cant. Solicitada','Cant. Entregada', 'Seleccionar']}
                                        >
                                            {selectedProducts.length > 0 && selectedProducts.map((item) => (
                                                <tr key={item.id}>
                                                    <TdGlobal className="p-3">{item.product.name}</TdGlobal>
                                                    <TdGlobal>{Number(item.quantity).toFixed(0)}</TdGlobal>
                                                    <TdGlobal>{Number(item.finalQuantitySend).toFixed(0)}</TdGlobal>
                                                    <TdGlobal>
                                                        <Button
                                                            key={item.id}
                                                            isIconOnly
                                                            className={`bg-white rounded-xl flex flex-col ${selectedProduct?.branchProduct.id === item.id ? 'bg-green-600 border-green-600' : 'border-gray-200'}`}
                                                            isDisabled={selectedBranch === undefined || item.completedRequest}
                                                            size="sm"
                                                            variant="bordered"
                                                            onPress={() => OnVerifyProduct(item.product.id)}
                                                        >
                                                            {selectedProduct?.branchProduct.id === item.id ?
                                                                <Check className="text-white-500" /> : ''
                                                            }
                                                        </Button>
                                                    </TdGlobal>
                                                </tr>
                                            ))}
                                        </TableComponent>
                                    </div>
                                </DrawerBody>

                            </>
                        </DrawerContent>
                    </Drawer>
                    <AddProductionOrderByProductOrder
                        branchOrigin={selectedBranch!}
                        selectedProduct={selectedProduct!}
                        setSelectedProduct={(product) => setSelectedProduct(product)}
                    />
                    <ButtonUi
                        isIconOnly
                        showTooltip
                        className="mt-10"
                        theme={Colors.Success}
                        tooltipText="Ver Productos"
                        onPress={() => setIsOpen(true)}
                    ><ChevronLeft /></ButtonUi>
                    <Modal {...modalError}>
                        <ModalContent>
                            <ModalHeader className='flex gap-2'>
                                <TriangleAlert className='text-orange-500' size={26} /> Advertencia
                            </ModalHeader>
                            <ModalBody>
                                <strong>
                                    {`Problemas con los insumos del producto seleccionado: `}
                                </strong>
                                {errors && errors.length > 0 && errors.map((item, index) => (
                                    <span key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-100">
                                        {item.exist === false ? (
                                            <Store className="text-red-500" size={20} />
                                        ) : (
                                            <PackageX className="text-yellow-500" size={20} />
                                        )}
                                        <p className="font-semibold">{item.nameProduct}</p> - {item.description}
                                    </span>
                                ))}
                            </ModalBody>
                            <ModalFooter className='flex w-full justify-start items-start'>
                                <ButtonUi
                                    theme={Colors.Success}
                                    onPress={() => {
                                        modalError.onClose()
                                    }}
                                >
                                    Cancelar
                                </ButtonUi>
                                <ButtonUi
                                    theme={Colors.Info}
                                    onPress={() => {
                                        if (errors.some((item) => item.exist === false)) {
                                            toast.error("Algunos productos no existen en la sucursal de origen. Verifica tu selección.", { duration: 7000 })

                                            return
                                        }
                                        handleAddProductRecipe(verified_product)
                                        modalError.onClose()
                                    }}
                                >
                                    Continuar de todas formas
                                </ButtonUi>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </DivGlobal>
            </Layout>
        </>
    )
}