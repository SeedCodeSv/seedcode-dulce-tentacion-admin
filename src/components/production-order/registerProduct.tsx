import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import * as yup from 'yup';
import { useFormik } from "formik";
import { toast } from "sonner";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";

import { useBranchesStore } from "@/store/branches.store";
import { ProductAndRecipe } from "@/types/products.types";
import { IPayloadBranchProduct } from "@/types/branch_products.types";
import { preventLetters } from "@/utils";
import { create_branch_product } from "@/services/products.service";
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";

interface Props {
    productToCreate: ProductAndRecipe
    close: () => void;
}

export default function RegisterProduct({ close, productToCreate }: Props) {
    const { branch } = useBranchesStore()
    const [warning, setWarning] = useState(false)

    const formik = useFormik({
        initialValues: {
            productId: productToCreate.id,
            costoUnitario: 1,
            branchId: branch.id,
            minimumStock: 1,
            stock: 1,
            price: 0,
            priceA: 1,
            priceB: 2,
            priceC: 3,
        },
        validationSchema: yup.object({
            costoUnitario: yup.number().required("Campo requerido"),
            minimumStock: yup.number().required("Campo requerido"),
            stock: yup.number().required("Campo requerido"),
            price: yup.number().required("Campo requerido"),
            priceA: yup.number().required("Campo requerido"),
            priceB: yup.number().required("Campo requerido"),
            priceC: yup.number().required("Campo requerido"),
        }),
        onSubmit: async (values) => {
            const payload: IPayloadBranchProduct = {
                ...values,
                productId: productToCreate.id,
                branchId: branch.id,
            };

            if (!warning && values.price === 0) {
                setWarning(true)
                
                return;
            }

            await submitProduct(payload);
        },
    });

    const submitProduct = async (payload: IPayloadBranchProduct) => {
        try {
            const success = await create_branch_product(payload);

            if (success) {
                toast.success("Producto creado correctamente");
                close();
            } else {
                toast.error("No se pudo crear el producto");
            }
        } catch (error) {
            toast.error("Error al crear producto");
        }
    };


    return (
        <ModalContent>
            <ModalHeader className='flex gap-4'>Crear Producto</ModalHeader>
            {!warning ? (
                <>
                    <ModalBody className="flex flex-col gap-4">
                        <div className='grid grid-cols-3 gap-4 text-[15px]'>
                            <p>Nombre: <strong>{productToCreate.name}</strong></p>
                            <p>Sucursal: <strong>{branch.name}</strong></p>
                        </div>
                        <div className='grid grid-cols-3 gap-4'>
                            <Input
                                isRequired
                                className="dark:text-white"
                                classNames={{ label: 'font-semibold' }}
                                label="Costo unitario"
                                labelPlacement="outside"
                                placeholder="Ingresa el costo unitario del producto"
                                variant="bordered"
                                {...formik.getFieldProps('costoUnitario')}
                                errorMessage={formik.errors.costoUnitario}
                                isInvalid={!!formik.errors.costoUnitario && !!formik.touched.costoUnitario}
                                onKeyDown={preventLetters}
                            />
                            <Input
                                isRequired
                                className="dark:text-white"
                                classNames={{ label: 'font-semibold' }}
                                label="Cantidad minima"
                                labelPlacement="outside"
                                placeholder="Ingresa la cantidad minima del producto"
                                variant="bordered"
                                {...formik.getFieldProps('minimumStock')}
                                errorMessage={formik.errors.minimumStock}
                                isInvalid={!!formik.errors.minimumStock && !!formik.touched.minimumStock}
                                onKeyDown={preventLetters}
                            />
                            <Input
                                isRequired
                                className="dark:text-white"
                                classNames={{ label: 'font-semibold' }}
                                label="Stock"
                                labelPlacement="outside"
                                placeholder="Ingresa el stock del producto"
                                variant="bordered"
                                {...formik.getFieldProps('stock')}
                                errorMessage={formik.errors.stock}
                                isInvalid={!!formik.errors.stock && !!formik.touched.stock}
                                onKeyDown={preventLetters}
                            />
                            <Input
                                isRequired
                                className="dark:text-white"
                                classNames={{ label: 'font-semibold' }}
                                label="Precio"
                                labelPlacement="outside"
                                placeholder="Ingresa el precio del producto"
                                variant="bordered"
                                {...formik.getFieldProps('price')}
                                errorMessage={formik.errors.price}
                                isInvalid={!!formik.errors.price && !!formik.touched.price}
                                onKeyDown={preventLetters}
                            />
                            <Input
                                isRequired
                                className="dark:text-white"
                                classNames={{ label: 'font-semibold' }}
                                label="PrecioA"
                                labelPlacement="outside"
                                placeholder="Ingresa el precio A del producto"
                                variant="bordered"
                                {...formik.getFieldProps('priceA')}
                                errorMessage={formik.errors.priceA}
                                isInvalid={!!formik.errors.priceA && !!formik.touched.priceA}
                                onKeyDown={preventLetters}
                            />
                            <Input
                                isRequired
                                className="dark:text-white"
                                classNames={{ label: 'font-semibold' }}
                                label="Precio B"
                                labelPlacement="outside"
                                placeholder="Ingresa el precio B del producto"
                                variant="bordered"
                                {...formik.getFieldProps('priceB')}
                                errorMessage={formik.errors.priceB}
                                isInvalid={!!formik.errors.priceB && !!formik.touched.priceB}
                                onKeyDown={preventLetters}
                            />
                            <Input
                                isRequired
                                className="dark:text-white"
                                classNames={{ label: 'font-semibold' }}
                                label="Precio C"
                                labelPlacement="outside"
                                placeholder="Ingresa el precio C del producto"
                                variant="bordered"
                                {...formik.getFieldProps('priceC')}
                                errorMessage={formik.errors.priceC}
                                isInvalid={!!formik.errors.priceC && !!formik.touched.priceC}
                                onKeyDown={preventLetters}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={() => close()}>Cancelar</Button>
                        <Button
                            color="primary"
                            onPress={() => formik.handleSubmit()}
                        >
                            Guardar
                        </Button>

                    </ModalFooter>
                </>
            ) : (
                 <ModalBody className="flex flex-col gap-4 items-center pb-5">
                    <span className="flex flex-col items-center">
                        <TriangleAlert className='text-yellow-600 pb-2' size={50} />
                    <p className="text-[15px]">Estás creando un producto con precio 0.</p>
                     <p className="text-[15px]">¿Deseas continuar?</p>
                    </span>
                    <div className="flex gap-4 w-2/3">
                     <ButtonUi
                    className="w-1/2"
                        theme={Colors.Info}
                        onPress={() => setWarning(false)}
                    >
                        Cancelar
                    </ButtonUi>
                    <ButtonUi
                    className="w-1/2"
                        theme={Colors.Error}
                        onPress={() => formik.handleSubmit()}
                    >
                        Continuar
                    </ButtonUi>
                    </div>
                </ModalBody>
            )}
        </ModalContent>
    )

}