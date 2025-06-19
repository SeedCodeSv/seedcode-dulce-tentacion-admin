import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Autocomplete, AutocompleteItem, Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from '@heroui/react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { ArrowLeft, Box, ChevronLeft, ChevronRight, Loader, Search } from 'lucide-react';
import { toast } from 'sonner';
import classNames from 'classnames';

import { useCategoriesStore } from '../../../store/categories.store';
import { useSupplierStore } from '../../../store/supplier.store';
import { TipoDeItem } from '../../../types/billing/cat-011-tipo-de-item.types';
import { IUnitOfMeasurement } from '../../../types/billing/cat-014-tipos-de-medida.types';

import { useBranchProductStore } from '@/store/branch_product.store';
import { UpdateBranchProductOrder, UpdateSuppliersBranchP } from '@/types/products.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { Supplier } from '@/types/supplier.types';
import { formatSuppliers } from '@/utils/formatters';
import { IGetBranchProduct } from '@/types/branches.types';
import { useSubCategoryStore } from '@/store/sub-category';


interface Props {
    branch_products?: IGetBranchProduct;
    onClose: () => void;
    reloadData(): void;
}

function UpdateBranchProduct({ branch_products, onClose, reloadData }: Props) {

    const unidadDeMedidaList = new SeedcodeCatalogosMhService().get014UnidadDeMedida();
    const tipoItemList = new SeedcodeCatalogosMhService().get011TipoDeItem();
    const [selectedSuppliers, setSelectedSuppliers] = useState<UpdateSuppliersBranchP[]>([]);
    const { getSupplierPagination, supplier_pagination } = useSupplierStore();
    const { list_categories, getListCategories } = useCategoriesStore();
    const { getBranchProductRecipeSupplier, branchProductRecipeSupplier,
        patchBranchProduct } = useBranchProductStore();
    const typeSearch = ['NOMBRE', 'CORREO', 'NIT', 'NRC'];
    const [selectedTypeSearch, setSelectedTypeSearch] = useState<'NOMBRE' | 'CORREO' | 'NRC' | 'NIT'>(
        'NOMBRE'
    );
    const [selectedKeyCategory, setSelectedKeyCategory] = useState('');
    const [selectedKeySubCategory, setSelectedKeySubCategory] = useState('');

    useEffect(() => {
        const catId = branchProductRecipeSupplier[0]?.product?.subCategory?.categoryProductId?.toString() || '';
        const subId = branchProductRecipeSupplier[0]?.product?.subCategory?.id?.toString() || '';

        setSelectedKeyCategory(catId);
        setSelectedKeySubCategory(subId);
    }, [branchProductRecipeSupplier]);


    const [category, setCategory] = useState<string | null>(branch_products?.product?.subCategory.categoryProductId.toString() || null)
    const { getSubcategories, subcategories } = useSubCategoryStore();

    const [initialValues, setInitialValues] = useState<UpdateBranchProductOrder | null>(null);
    const [search, setSearch] = useState('');
    const modalSuppliers = useDisclosure();

    useEffect(() => {
        getListCategories();
        getSupplierPagination(1, 10, '', '', '', '', '', 1);
        getBranchProductRecipeSupplier(branch_products?.branchId ?? 0, branch_products?.id ?? 0, 1, 10, '', '', '', '')
    }, [branch_products?.id]);

    useEffect(() => {
        getSubcategories(Number(category) ?? 0,)
    }, [category])


    const handleSearch = (page = 1) => {
        getSupplierPagination(
            page,
            10,
            selectedTypeSearch === 'NOMBRE' ? search : '',
            selectedTypeSearch === 'CORREO' ? search : '',
            selectedTypeSearch === 'NIT' ? search : '',
            selectedTypeSearch === 'NRC' ? search : '',
            '',
            1
        );
    };

    const handleAddSupplier = (supplier: Supplier) => {
        setSelectedSuppliers((prev) => {
            const index = prev.findIndex((s) => s.supplierId === supplier.id);

            if (index !== -1) {
                const existing = prev[index];

                if (existing.id === 0 && existing.isActive) {
                    return prev.filter((s) => s.supplierId !== supplier.id);
                }

                return prev.map((s) =>
                    s.supplierId === supplier.id
                        ? { ...s, isActive: !s.isActive }
                        : s
                );
            }

            return [
                ...prev,
                {
                    id: 0,
                    supplierId: supplier.id,
                    branchProductId: branch_products!.id,
                    name: supplier.nombre,
                    isActive: true,
                },
            ];
        });
    };

    const checkIsSelectedSupplier = (id: number) => {
        return selectedSuppliers.some((ssp) => ssp.supplierId === id && ssp.isActive);
    };

    useEffect(() => {

        if (branchProductRecipeSupplier.length > 0) {
            const product = branchProductRecipeSupplier[0];

            if (
                list_categories.length > 0 &&
                subcategories.length > 0
            ) {
                const valu = formatSuppliers(product?.productSuppliers);

                setInitialValues({
                    name: product?.product?.name ?? '',
                    stock: Number(product.stock) || 0,
                    price: Number(product?.price) || 0,
                    priceA: product?.priceA || '',
                    priceB: product?.priceB || '',
                    priceC: product?.priceC || '',
                    minimumStock: product?.minimumStock || 0,
                    description: product?.product.description ?? '',
                    tipoItem: product?.product?.tipoItem || '',
                    tipoDeItem: product?.product?.tipoDeItem || '',
                    uniMedida: product?.product?.uniMedida || '',
                    unidaDeMedida: product?.product?.unidaDeMedida || '',
                    code: product.product?.code || '',
                    costoUnitario: Number(product?.costoUnitario).toFixed(2) || '',
                    subCategoryId: product!.product!.subCategory?.id ?? "0",
                    suppliers: valu || [],
                });
            }
        }
    }, [branchProductRecipeSupplier, list_categories, subcategories, branch_products?.id]);

    useEffect(() => {
        if (branchProductRecipeSupplier.length > 0) {
            const suppliersFromProduct = formatSuppliers(branchProductRecipeSupplier[0].productSuppliers);

            setSelectedSuppliers(suppliersFromProduct);
        }
    }, [branchProductRecipeSupplier]);

    useEffect(() => {
        if (initialValues) {
            setInitialValues({
                ...initialValues,
                suppliers: selectedSuppliers,
            });
        }
    }, [selectedSuppliers]);

    const validationSchema = yup.object().shape({
        name: yup.string().required(' El nombre es requerido '),
        description: yup.string().required(' La descripcion es requerida '),
        price: yup.number().required(' El precio es requerido '),
        costoUnitario: yup.number().required(' Coste unitario es requerido '),
        minimumStock: yup
            .number()
            .required(' La cantidad es requerida ')
            .typeError(' La cantidad es requerida '),
        code: yup.string().required('**El codigo es requerido**'),
        subCategoryId: yup.string().required(' Debes seleccionar la categoría '),
        tipoItem: yup
            .string()
            .required(' Debes seleccionar el tipo item ')
            .min(1, ' Debes seleccionar el tipo item '),
        uniMedida: yup
            .string()
            .required(' Debes seleccionar la unidad de medida ')
            .min(1, ' Debes seleccionar la unidad de medida '),

    });



    const [codigo, setCodigo] = useState(branch_products?.product?.code || '');
    const [isClicked, setIsClicked] = useState(false);
    const button = useRef<HTMLButtonElement>(null);
    const handleSave = async (values: UpdateBranchProductOrder) => {
        try {
            if (button.current) button.current.disabled = false;

            const valuesToSend = {
                ...values,
                suppliers: selectedSuppliers
            };

            await patchBranchProduct(branch_products?.id || 0, valuesToSend)
                .then(() => {
                    onClose();
                    reloadData();

                }).catch(() => {
                    toast.error('No se logro realizar la peticion')
                    setIsClicked(false);
                })

        } catch (error) {
            toast.error('No se proceso la solicitud')

        }
    };

    const selectedKeyUnidadDeMedida = useMemo(() => {
        if (branch_products) {
            const unidadDeMedida = unidadDeMedidaList.find(
                (unidad) => unidad.codigo === branch_products?.product.uniMedida
            );

            return JSON.stringify(unidadDeMedida);
        }

        return '';
    }, [branch_products, unidadDeMedidaList]);

    const selectedKeyTipoDeItem = useMemo(() => {
        if (branch_products) {
            const tipoDeItem = tipoItemList.find(
                (item) => item.codigo === branch_products?.product.tipoItem
            );

            return JSON.stringify(tipoDeItem);
        }

        return '';
    }, [branch_products, tipoItemList]);

    const generarCodigo = (name: string) => {
        if (!name) {
            toast.error('Necesitas ingresar el nombre del producto para generar el código.');

            return '';
        }

        const productNameInitials = name.slice(0, 4).toUpperCase();
        const makeid = (length: number) => {
            let result = '';
            const characters = '0123456789';
            const charactersLength = characters.length;
            let counter = 0;

            while (counter < length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }

            return result;
        };

        const randomNumber = makeid(4);
        const codigoGenerado = `${productNameInitials}${randomNumber}`;

        return codigoGenerado;
    };

    return (
        <>
            {initialValues ? (
                <>
                    <Formik
                        enableReinitialize={true}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSave}

                    >
                        {({
                            values,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            errors,
                            touched,

                            validateForm,
                        }) => (
                            <div className="w-full h-full p-4 bg-gray-50 dark:bg-gray-800">
                                <div className="w-full h-full p-5 md:p-10 mt-2 overflow-y-auto bg-white custom-scrollbar shadow border dark:bg-gray-900">

                                    <div className="flex cursor-pointer mb-5 w-24"
                                    >
                                        <ArrowLeft className="mr-2 dark:text-white" onClick={onClose}
                                        />
                                        <p className="font-semibold dark:text-white">Regresar</p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            <Input
                                                className='dark:text-white'
                                                classNames={{ label: 'font-semibold text-sm', base: 'font-semibold' }}
                                                errorMessage={errors?.name}
                                                isInvalid={!!touched?.name && !!errors?.name}
                                                label="Nombre"
                                                labelPlacement="outside"
                                                name="name"
                                                placeholder="Ingresa el nombre"
                                                value={values?.name}
                                                variant="bordered"
                                                onBlur={handleBlur('name')}
                                                onChange={(e) => {
                                                    handleChange('name')(e);
                                                }}
                                            />

                                        </div>

                                        {/* Segunda columna */}
                                        <div className="grid xl:grid-cols-2 gap-4">
                                            <Input
                                                className='dark:text-white'
                                                classNames={{ label: 'font-semibold text-sm', base: 'font-semibold' }}
                                                errorMessage={errors?.code}
                                                isInvalid={!!touched?.code && !!errors?.code}
                                                label="Código"
                                                labelPlacement="outside"
                                                name="code"
                                                placeholder="Ingresa o genera el código"
                                                value={codigo || values.code}
                                                variant="bordered"
                                                onBlur={handleBlur('code')}
                                                onChange={(e) => {
                                                    handleChange('code')(e);
                                                    setCodigo(e.target.value);
                                                }}
                                            />

                                            <Button
                                                className="text-sm font-semibold w-fulL xl:mt-6"
                                                onPress={async () => {
                                                    await Promise.resolve();
                                                    const code = await generarCodigo(values.name);

                                                    if (code) {
                                                        handleChange('code')(code);
                                                        setCodigo(code);
                                                    }
                                                }}
                                            >
                                                Generar Código
                                            </Button>


                                        </div>
                                    </div>


                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-5">
                                        <Input
                                            className='dark:text-white'
                                            classNames={{ label: 'font-semibold text-sm', base: 'font-semibold' }}
                                            errorMessage={errors?.price}
                                            isInvalid={!!touched?.price && !!errors?.price}
                                            label="Precio"
                                            labelPlacement="outside"
                                            name="price"
                                            value={values!.price!.toString()}
                                            variant="bordered"
                                            onBlur={handleBlur('price')}
                                            onChange={handleChange('price')}
                                        />
                                        <Input
                                            className='dark:text-white'
                                            classNames={{ label: 'font-semibold text-sm', base: 'font-semibold' }}
                                            errorMessage={errors?.costoUnitario}
                                            isInvalid={!!touched?.costoUnitario && !!errors?.costoUnitario}
                                            label="costoUnitario"
                                            labelPlacement="outside"
                                            name="costoUnitario"
                                            value={values!.costoUnitario!.toString()}
                                            variant="bordered"
                                            onBlur={handleBlur('costoUnitario')}
                                            onChange={handleChange('costoUnitario')}
                                        />
                                        <Input
                                            className='dark:text-white'
                                            classNames={{ label: 'font-semibold text-sm', base: 'font-semibold' }}
                                            errorMessage={errors?.stock}
                                            isInvalid={!!touched?.stock && !!errors?.stock}
                                            label="Stock"
                                            labelPlacement="outside"
                                            name="stock"
                                            placeholder="Ingresa el stock"
                                            value={values.stock
                                                .toString()}
                                            variant="bordered"

                                            onBlur={handleBlur('stock')}
                                            onChange={handleChange('stock')}
                                        />
                                        <Input
                                            className='dark:text-white'
                                            classNames={{ label: 'font-semibold text-sm', base: 'font-semibold' }}
                                            errorMessage={errors?.minimumStock}
                                            isInvalid={!!touched?.minimumStock
                                                && !!errors?.minimumStock}
                                            label="Cantidad mínima"
                                            labelPlacement="outside"
                                            name="minimumStock"
                                            placeholder="Ingresa la cantidad mínima"
                                            value={values.minimumStock.toString()}
                                            variant="bordered"
                                            onBlur={handleBlur('minimumStock')}
                                            onChange={handleChange('minimumStock')}
                                        />
                                        <Input
                                            className='dark:text-white'
                                            classNames={{ label: 'font-semibold text-sm' }}
                                            label="Precio A"
                                            labelPlacement="outside"
                                            name="priceA"
                                            placeholder="Ingresa el precio A"
                                            value={values!.priceA.toString()}
                                            variant="bordered"
                                            onBlur={handleBlur('priceA')}
                                            onChange={handleChange('priceA')}
                                        />
                                        <Input
                                            className='dark:text-white'
                                            classNames={{ label: 'font-semibold text-sm' }}
                                            label="Precio B"
                                            labelPlacement="outside"
                                            name="priceB"
                                            placeholder="Ingresa el precio B"
                                            value={values!.priceB.toString()}
                                            variant="bordered"
                                            onBlur={handleBlur('priceB')}
                                            onChange={handleChange('priceB')}
                                        />
                                        <Input
                                            className='dark:text-white'
                                            classNames={{ label: 'font-semibold text-sm' }}
                                            label="Precio C"
                                            labelPlacement="outside"
                                            name="priceC"
                                            placeholder="Ingresa el precio C"
                                            value={values!.priceC.toString()}
                                            variant="bordered"
                                            onBlur={handleBlur('priceC')}
                                            onChange={handleChange('priceC')}
                                        />

                                        <Autocomplete
                                            className='dark:text-white'
                                            classNames={{ base: 'font-semibold text-gray-500 text-sm' }}
                                            errorMessage={errors?.subCategoryId}
                                            isInvalid={!!touched?.subCategoryId && !!errors?.subCategoryId}
                                            label="Categoría producto"
                                            labelPlacement="outside"
                                            name="Category"
                                            placeholder={'Selecciona la categoría'}
                                            selectedKey={selectedKeyCategory}
                                            value={selectedKeyCategory}
                                            variant="bordered"
                                            onBlur={handleBlur('subCategoryId')}
                                            onSelectionChange={(key) => {
                                                if (key) {
                                                    setSelectedKeyCategory(key as string);
                                                    const category = list_categories.find(cat => cat.id.toString() === key);

                                                    if (category) {
                                                        setCategory(category.id.toString());
                                                    }
                                                }
                                            }}
                                        >
                                            {list_categories.map((category) => (
                                                <AutocompleteItem key={category.id.toString()}>
                                                    {category.name}
                                                </AutocompleteItem>
                                            ))}
                                        </Autocomplete>

                                        <Autocomplete
                                            className='dark:text-white'
                                            classNames={{ base: 'font-semibold text-gray-500 text-sm' }}
                                            errorMessage={errors?.name}
                                            isInvalid={!!touched?.name && !!errors?.name}
                                            label="Sub Categoría producto"
                                            labelPlacement="outside"
                                            name="subCategoryId"
                                            placeholder={'Selecciona la sub categoria'}
                                            selectedKey={selectedKeySubCategory}
                                            value={selectedKeySubCategory}
                                            variant="bordered"
                                            onBlur={handleBlur('subCategoryId')}
                                            onSelectionChange={(key) => {
                                                if (key) {
                                                    setSelectedKeySubCategory(key as string);
                                                    const subCategorySelected = subcategories.find(sub => sub.id.toString() === key);

                                                    if (subCategorySelected) {
                                                        handleChange('subCategoryId')(subCategorySelected.id.toString());
                                                    }
                                                }
                                            }}
                                        >
                                            {subcategories.map((sub) => (
                                                <AutocompleteItem key={sub.id.toString()}>
                                                    {sub.name}
                                                </AutocompleteItem>
                                            ))}
                                        </Autocomplete>

                                        <Input
                                            className='dark:text-white'
                                            classNames={{ label: 'font-semibold text-sm' }}
                                            label="Minimo stock"
                                            labelPlacement="outside"
                                            name="minimumStock"
                                            placeholder="Ingresa el minimo stock"
                                            value={values!.minimumStock.toString()}
                                            variant="bordered"
                                            onBlur={handleBlur('minimumStock')}

                                            onChange={handleChange('minimumStock')}
                                        />
                                        <div className="flex gap-5 items-end col-span-2 md:col-span-1">

                                            <Input
                                                readOnly
                                                className="w-full dark:text-white"
                                                classNames={{
                                                    label: 'font-semibold dark:text-white text-gray-500 text-sm',
                                                }}
                                                isInvalid={!!errors.suppliers && !!touched.suppliers}
                                                label="Proveedores"
                                                labelPlacement="outside"
                                                placeholder="Selecciona los proveedores"
                                                value={selectedSuppliers
                                                    .filter((supp) => supp.isActive)
                                                    .map((supp) => supp.name)
                                                    .join(', ')
                                                } variant="bordered"
                                            />
                                            <ButtonUi isIconOnly theme={Colors.Info} onPress={modalSuppliers.onOpen}>
                                                <Search />
                                            </ButtonUi>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className="mt-5">
                                            <Autocomplete
                                                className='dark:text-white'
                                                classNames={{ base: 'font-semibold text-gray-500 text-sm' }}
                                                defaultSelectedKey={selectedKeyTipoDeItem}
                                                errorMessage={errors.tipoItem}
                                                isInvalid={touched.tipoItem && !!errors.tipoItem}
                                                label="Tipo de item"
                                                labelPlacement="outside"
                                                name="tipoItem"
                                                placeholder={branch_products?.product.tipoDeItem || 'Selecciona el item'}
                                                value={branch_products?.product.tipoDeItem}
                                                variant="bordered"
                                                onSelectionChange={(key) => {
                                                    if (key) {
                                                        const typeItem = JSON.parse(key as string) as TipoDeItem;

                                                        handleChange('tipoItem')(typeItem.codigo);
                                                        handleChange('tipoDeItem')(typeItem.valores);
                                                    }
                                                }}
                                            >
                                                {tipoItemList.map((item) => (
                                                    <AutocompleteItem
                                                        key={JSON.stringify(item)}
                                                        className="dark:text-white"
                                                    >
                                                        {item.valores}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete>
                                        </div>
                                        <div className="flex gap-4 mt-5">
                                            <Autocomplete
                                                className='dark:text-white'
                                                classNames={{ base: 'font-semibold text-gray-500 text-sm' }}
                                                defaultSelectedKey={selectedKeyUnidadDeMedida}
                                                errorMessage={errors.uniMedida}
                                                isInvalid={touched.uniMedida && !!errors.uniMedida}
                                                label="Unidad de medida"
                                                labelPlacement="outside"
                                                name="unidaMedida"
                                                placeholder='Selecciona unidad de medida'
                                                value={branch_products?.product.unidaDeMedida}
                                                variant="bordered"
                                                onSelectionChange={(key) => {
                                                    if (key) {
                                                        const medida = JSON.parse(key as string) as IUnitOfMeasurement;

                                                        handleChange('uniMedida')(medida.codigo);
                                                        handleChange('unidaDeMedida')(medida.valores);
                                                    }
                                                }}
                                            >
                                                {unidadDeMedidaList.map((item) => (
                                                    <AutocompleteItem
                                                        key={JSON.stringify(item)}
                                                        className="dark:text-white"
                                                    >
                                                        {item.valores}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete>

                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        <Textarea
                                            className='dark:text-white'
                                            classNames={{
                                                label: 'font-semibold text-gray-500 text-sm',
                                                base: 'font-semibold w-full',
                                            }}
                                            errorMessage={errors.description}
                                            isInvalid={touched.description && !!errors.description}
                                            label="Descripción"
                                            labelPlacement="outside"
                                            name="description"
                                            placeholder="Ingresa la descripción"
                                            value={values.description}
                                            variant="bordered"
                                            onBlur={handleBlur('description')}
                                            onChange={handleChange('description')}
                                        />
                                    </div>
                                    <div className="flex row justify-end gap-10 mt-2">
                                        <ButtonUi
                                            theme={Colors.Warning}
                                            type="submit"
                                            onPress={() => {
                                                onClose()
                                                reloadData()
                                            }}
                                        >
                                            Cancelar
                                        </ButtonUi>
                                        {isClicked ? (
                                            <div className="mt-4 flex justify-center items-center">
                                                <Loader className="animate-spin dark:text-white" size={35} />
                                            </div>
                                        ) : (
                                            <ButtonUi
                                                theme={Colors.Primary}

                                                type="submit"
                                                onPress={async () => {
                                                    const valid = await validateForm().then((error) => !error);

                                                    if (valid) {
                                                        setIsClicked(true);
                                                    }
                                                    handleSubmit();
                                                }}
                                            >
                                                Guardar
                                            </ButtonUi>
                                        )}
                                    </div>

                                </div>
                            </div>

                        )}
                    </Formik></>) : (<p>Cargando los datos...</p>)
            }

            <Modal {...modalSuppliers} scrollBehavior="inside" size="xl">
                <ModalContent>
                    <ModalHeader>Selecciona los proveedores</ModalHeader>
                    <ModalBody className="flex flex-col h-full overflow-y-auto">
                        <div className="flex gap-5 items-end">
                            <Input
                                className="dark:text-white"
                                classNames={{
                                    label: 'font-semibold',
                                }}
                                endContent={
                                    <div className="flex items-center">
                                        <label className="sr-only" htmlFor="currency">
                                            Currency
                                        </label>
                                        <select
                                            className="outline-none border-0 bg-transparent text-default-400 text-small"
                                            id="currency"
                                            name="currency"
                                            onChange={(e) => {
                                                setSelectedTypeSearch(e.currentTarget.value as 'NOMBRE');
                                            }}
                                        >
                                            {typeSearch.map((tpS) => (
                                                <option key={tpS} value={tpS}>
                                                    {tpS}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                }
                                label="Buscar proveedor"
                                labelPlacement="outside"
                                placeholder="Escribe para buscar"
                                startContent={<Search />}
                                type="text"
                                value={search}
                                variant="bordered"
                                onValueChange={setSearch}
                            />
                            <ButtonUi theme={Colors.Primary} onPress={() => handleSearch(1)}>
                                Buscar
                            </ButtonUi>
                        </div>
                        <div className="flex flex-col overflow-y-auto h-full w-full gap-3">
                            {supplier_pagination.suppliers.map((sup) => (
                                <button
                                    key={sup.id}
                                    className={classNames(
                                        checkIsSelectedSupplier(sup.id)
                                            ? 'shadow-green-100 dark:shadow-gray-500 border-green-400 dark:border-gray-800 bg-green-50 dark:bg-gray-950'
                                            : '',
                                        'shadow border dark:border-gray-600 w-full flex flex-col justify-start rounded-[12px] p-4'
                                    )}
                                    onClick={() => handleAddSupplier(sup)}
                                >
                                    <div className="flex justify-between gap-5 w-full">
                                        <p className="text-sm font-semibold dark:text-white">{sup.nombre}</p>
                                        <Checkbox
                                            checked={checkIsSelectedSupplier(sup.id)}
                                            isSelected={checkIsSelectedSupplier(sup.id)}
                                            onValueChange={() => {
                                                handleAddSupplier(sup);
                                            }}
                                        />
                                    </div>
                                    <div className="w-full dark:text-white flex flex-col justify-start text-left mt-2">
                                        <p className="w-full dark:text-white">Correo: {sup.correo}</p>
                                        <p className="w-full dark:text-white">NRC: {sup.nrc}</p>
                                        <p className="w-full dark:text-white">NIT: {sup.nit}</p>
                                    </div>
                                </button>
                            ))}
                            {supplier_pagination.suppliers.length === 0 && (
                                <div className="flex flex-col justify-center items-center mt-5">
                                    <Box size={100} />
                                    <p className="text-sm font-semibold mt-6">No se encontraron proveedores</p>
                                </div>
                            )}
                        </div>
                    </ModalBody>
                    <ModalFooter className="w-full flex justify-between">
                        <ButtonUi
                            isIconOnly
                            theme={Colors.Primary}
                            onPress={() => {
                                handleSearch(supplier_pagination.prevPag);
                            }}
                        >
                            <ChevronLeft />
                        </ButtonUi>
                        <span className='text-sm font-semibold dark:text-white'>{supplier_pagination.currentPag} / {supplier_pagination.totalPag}</span>
                        <ButtonUi
                            isIconOnly
                            theme={Colors.Primary}
                            onPress={() => {
                                handleSearch(supplier_pagination.nextPag);
                            }}
                        >
                            <ChevronRight />
                        </ButtonUi>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default UpdateBranchProduct;
