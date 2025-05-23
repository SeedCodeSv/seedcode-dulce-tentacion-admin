

import { Checkbox, Input, Switch } from '@heroui/react';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import UpdateRecipeBook from './UpdateRecipeBook';

import { Menu, ProductMenu, ProductsMenu, Receipe, UpdateMenuDetails } from '@/types/menu.types';
import { useMenuStore } from '@/store/menu.store';
import { useAuthStore } from '@/store/auth.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { IGetBranchProduct } from '@/types/branches.types';

type ProductOrder = ProductMenu & { menuDetailId: number, quantity: number; uniMedidaExtra: string, isActive: boolean };


interface Props {
    branch_products?: IGetBranchProduct;
    onClose: () => void;
    reloadData(): void;
}

function MenuUpdate({ branch_products, onClose, reloadData }: Props) {
    const [hasInMenu, setHasInMenu] = useState(false);
    const [initialValues, setInitialValues] = useState<Menu | null>(null)
    const { getMenuByBranchProduct, menu, MenuDetails } = useMenuStore()
    const { user } = useAuthStore()
    const [detailMenuUpdate, setMenuUpdate] = useState<ProductOrder[]>([])
    const { updateMenu, } = useMenuStore()

    useEffect(() => {
        setInitialValues(null);
        setMenuUpdate([]);
    }, [])


    const handleSave = async (values: Menu) => {
        const formatVal = detailMenuUpdate.map((i) => {
            const data: ProductsMenu = {
                id: i.menuDetailId,
                productId: i.id,
                quantity: i.quantity,
                uniMedidaExtra: i.uniMedidaExtra,
                isActive: i.isActive
            }

            return data
        })
        const { id, branchProduct, branchProductId, applyDiscount, ...newValues } = values;


        const formatValues: UpdateMenuDetails = {
            menu: newValues,
            receipt: [] as Receipe[],
            products: formatVal,

        }

        updateMenu(branch_products?.id ?? 0, branch_products?.branch?.id ?? 0, formatValues).then(() => {
            onClose()
            reloadData()

        }).catch(() => {
            toast.error('No se proceso la solicitud')
        })
    }

    useEffect(() => {
        getMenuByBranchProduct(branch_products?.id ?? 0, user?.branchId ?? 0)
    }, [branch_products?.id, user?.branchId])

    useEffect(() => {
        if (menu) {
            setInitialValues({
                id: menu.id,
                addToMenu: menu.addToMenu,
                applyDiscount: menu.applyDiscount,
                noDeadline: menu.noDeadline,
                deDate: menu.deDate,
                alDate: menu.alDate,
                deTime: menu.deTime,
                alTime: menu.alTime,
                mon: menu.mon,
                tue: menu.tue,
                wed: menu.wed,
                thu: menu.thu,
                fri: menu.fri,
                sat: menu.sat,
                sun: menu.sun,
                isActive: menu.isActive,
                branchProduct: menu.branchProduct,
                branchProductId: menu.branchProductId
            })
            setHasInMenu(menu.addToMenu)

        }
    }, [menu])

    const getActiveDaysCount = (values: Menu): number => {
        return [
            values.mon,
            values.tue,
            values.wed,
            values.thu,
            values.fri,
            values.sat,
            values.sun
        ].filter(Boolean).length;
    };


    return (
        <>
            {initialValues ? (<>
                <Formik
                    enableReinitialize={true}

                    initialValues={initialValues}

                    onSubmit={handleSave}

                >
                    {({
                        values,
                        setFieldValue,
                        handleSubmit

                    }) => (
                        <>
                            <div className="w-full border shadow rounded-[12px] p-5 mt-3">
                                <div className="flex cursor-pointer mb-5 w-24"
                                >
                                    <ArrowLeft className="mr-2 dark:text-white" onClick={onClose}
                                    />
                                    <p className="font-semibold dark:text-white">Regresar</p>
                                </div>
                                <Checkbox
                                    checked={values.addToMenu}
                                    isSelected={values.addToMenu}
                                    size="lg"
                                    onValueChange={(val) => {
                                        if (!val) {
                                            toast.warning('No puedes desactivar esta opción.');

                                            return;
                                        }

                                        setHasInMenu(true);
                                        setFieldValue('addToMenu', true);
                                    }}
                                >
                                    <span className="dark:text-white font-semibold">Agregar al menú</span>
                                </Checkbox>

                                {hasInMenu && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 gap-y-3 mt-4">
                                        <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-3">
                                            <p className="font-semibold dark:text-white py-3">Dias de la semana</p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                                                <Checkbox
                                                    isSelected={values.mon}
                                                    onValueChange={(val) => {
                                                        const activeCount = getActiveDaysCount(values);

                                                        if (!val && activeCount <= 1) {
                                                            toast.warning('Debe haber al menos un día activo.');

                                                            return;
                                                        }
                                                        setFieldValue('mon', val);
                                                    }}
                                                >
                                                    <span className="font-semibold text-sm">Lunes</span>
                                                </Checkbox>
                                                <Checkbox
                                                    isSelected={values.tue}
                                                    onValueChange={(val) => {
                                                        const activeCount = getActiveDaysCount(values);

                                                        if (!val && activeCount <= 1) {
                                                            toast.warning('Debe haber al menos un día activo.');

                                                            return;
                                                        }
                                                        setFieldValue('tue', val);
                                                    }}
                                                >
                                                    <span className="font-semibold text-sm">Martes</span>
                                                </Checkbox>
                                                <Checkbox
                                                    isSelected={values.wed}
                                                    onValueChange={(val) => {
                                                        const activeCount = getActiveDaysCount(values);

                                                        if (!val && activeCount <= 1) {
                                                            toast.warning('Debe haber al menos un día activo.');

                                                            return;
                                                        }
                                                        setFieldValue('wed', val);
                                                    }}
                                                >
                                                    <span className="font-semibold text-sm">Miércoles</span>
                                                </Checkbox>
                                                <Checkbox
                                                    isSelected={values.thu}
                                                    onValueChange={(val) => {
                                                        const activeCount = getActiveDaysCount(values);

                                                        if (!val && activeCount <= 1) {
                                                            toast.warning('Debe haber al menos un día activo.');

                                                            return;
                                                        }
                                                        setFieldValue('thu', val);
                                                    }}
                                                >
                                                    <span className="font-semibold text-sm">Jueves</span>
                                                </Checkbox>

                                                <Checkbox
                                                    isSelected={values.fri}
                                                    onValueChange={(val) => {
                                                        const activeCount = getActiveDaysCount(values);

                                                        if (!val && activeCount <= 1) {
                                                            toast.warning('Debe haber al menos un día activo.');

                                                            return;
                                                        }
                                                        setFieldValue('fri', val);
                                                    }}
                                                >
                                                    <span className="font-semibold text-sm">Viernes</span>
                                                </Checkbox>
                                                <Checkbox
                                                    isSelected={values.sat}
                                                    onValueChange={(val) => {
                                                        const activeCount = getActiveDaysCount(values);

                                                        if (!val && activeCount <= 1) {
                                                            toast.warning('Debe haber al menos un día activo.');

                                                            return;
                                                        }
                                                        setFieldValue('sat', val);
                                                    }}
                                                >
                                                    <span className="font-semibold text-sm">Sábado</span>
                                                </Checkbox>

                                                <Checkbox
                                                    isSelected={values.sun}
                                                    onValueChange={(val) => {
                                                        const activeCount = getActiveDaysCount(values);

                                                        if (!val && activeCount <= 1) {
                                                            toast.warning('Debe haber al menos un día activo.');

                                                            return;
                                                        }
                                                        setFieldValue('sun', val);
                                                    }}
                                                >
                                                    <span className="font-semibold text-sm">Domingo</span>
                                                </Checkbox>
                                            </div>
                                        </div>
                                        <div className="py-4">
                                            <Switch
                                                isSelected={values.noDeadline}
                                                onValueChange={(val) => setFieldValue('noDeadline', val)}
                                            >
                                                <span className="font-semibold">
                                                    {values.noDeadline ? 'Desactivar' : 'Activar'} fecha de vigencia
                                                </span>
                                            </Switch>
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 col-span-1 md:col-span-2 lg:col-span-3">
                                            <Input
                                                className='dark:text-white'
                                                classNames={{ label: 'font-semibold' }}
                                                disabled={!values.noDeadline}
                                                label="Fecha inicio de vigencia"
                                                labelPlacement="outside"
                                                name='deDate'
                                                type="date"
                                                value={values.deDate ?? ''}
                                                variant="bordered"
                                                onChange={(e) => {
                                                    setFieldValue('deDate', e.currentTarget.value)
                                                }}
                                            />
                                            <Input
                                                className='dark:text-white'
                                                classNames={{ label: 'font-semibold' }}
                                                disabled={!values.noDeadline}
                                                label="Fecha fin de vigencia"
                                                labelPlacement="outside"
                                                name='alDate'
                                                type="date"
                                                value={values.alDate ?? ''}
                                                variant="bordered"
                                                onChange={(e) => {
                                                    setFieldValue('alDate', e.currentTarget.value)
                                                }}

                                            />
                                            <Input
                                                className='dark:text-white'
                                                classNames={{ label: 'font-semibold' }}
                                                defaultValue={values.deTime ?? ''}
                                                disabled={!values.noDeadline}
                                                label="Hora inicio de vigencia"
                                                labelPlacement="outside"
                                                name='deTime'
                                                type="time"
                                                value={values.deTime ?? ''}
                                                variant="bordered"
                                                onChange={(e) => {
                                                    setFieldValue('deTime', e.currentTarget.value)
                                                }}

                                            />
                                            <Input
                                                className='dark:text-white'
                                                classNames={{ label: 'font-semibold' }}
                                                defaultValue={values.alTime ?? ''}
                                                disabled={!values.noDeadline}
                                                label="Hora fin de vigencia"
                                                labelPlacement="outside"
                                                name='alTime'
                                                type="time"
                                                value={values.alTime ?? ''}
                                                variant="bordered"
                                                onChange={(e) => {
                                                    setFieldValue('alTime', e.currentTarget.value)
                                                }}

                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            {hasInMenu && <UpdateRecipeBook menuDetails={MenuDetails} setSelecteMenu={setMenuUpdate} />}
                            <div className='flex row gap-10 justify-end mt-4 mb-4 mr-2'>
                                <ButtonUi
                                    theme={Colors.Default}
                                >

                                    Cancelar
                                </ButtonUi>
                                <ButtonUi theme={Colors.Primary} onPress={() => handleSubmit()}>
                                    Actualizar
                                </ButtonUi>
                            </div>

                        </>
                    )}

                </Formik>
            </>) : (<>

                <p>Cargando...</p></>)}
        </>
    );
}

export default MenuUpdate;
