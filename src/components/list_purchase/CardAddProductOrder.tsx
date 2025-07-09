import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem } from '@heroui/react';
// eslint-disable-next-line import/order
import { Copy, Trash } from 'lucide-react';

// import { IMobileViewOrderProducst } from './types/mobile-view.types';


// eslint-disable-next-line import/order
import { IMobileAddProdcutOrder } from '../products/types/mobile-view.types';

// import { RenderStatus, Status } from './render-order-status';

// import { formatEmployee } from '@/utils/dates';
import TooltipGlobal from '../global/TooltipGlobal';

import { FloatingButton } from './FloatingButton';

import { useBranchProductStore } from '@/store/branch_product.store';
import { global_styles } from '@/styles/global.styles';
import useWindowSize from '@/hooks/useWindowSize';


function CardAddProductOrder({
    // handleDetails,
    // onAddBydetail,
    // onAddBranchDestiny,
    // onAddOrderId,
    // addSelectedProducts,
    // selectedIds,
    // handleCheckboxChange
    handlePrint,
    handleSaveOrder
}: IMobileAddProdcutOrder) {
    const { windowSize } = useWindowSize()
    const {
        orders_by_supplier,
        onUpdateSupplier,
        updateQuantityOrders,
        updatePriceOrders,
        deleteProductOrder,
        onDuplicateProduct
    } = useBranchProductStore()


    // const [selectedIndex, setSelectedIndex] =useState(orders_by_supplier.map(()))

    return (
        <>
            {/* {orders_by_supplier[0]?.products.length > 0 && ( */}
            {windowSize.width < 780 && (
                <FloatingButton
                    handlePrint={handlePrint}
                    handleSave={handleSaveOrder}
                />
            )}

            {/* )} */}

           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-3 overflow-y-auto p-2">
                {orders_by_supplier.map((prd) => (
                    <>
                        {prd.products.map((item, valIndex) => {
                            return (
                                <Card key={valIndex}>
                                    <CardHeader className='flex justify-between'>
                                        <p>

                                            {item.id}</p>
                                        <p>
                                            <p className='flex font-semibold'>Codigo</p>
                                            {item.product.code}

                                        </p>

                                        <p>

                                            <p className='flex font-semibold'>Existencias</p>
                                            {item.stock}</p>

                                    </CardHeader>
                                    <CardBody className='bottom-4'>
                                        <p>
                                            <span className="font-semibold">Nombre:</span>
                                            {' '} {item?.product?.name ?? 'N/A'}
                                        </p>
                                        <p className='flex gap-2 mt-2 items-center'>
                                            <p className='dark:text-white font-semibold'>Cantidad:</p>

                                            <Input
                                                className="w-32"
                                                defaultValue={item.quantity.toString()}
                                                lang="es"
                                                type="number"
                                                variant="bordered"
                                                onChange={(e) => {
                                                    updateQuantityOrders(item.numItem, Number(e.target.value));
                                                }}
                                            />
                                        </p>

                                        <p className='flex gap-2 mt-2 items-center'>
                                            <p className='dark:text-white font-semibold'>Precio:</p>
                                            <Input
                                                className="w-32 text-green-600"
                                                defaultValue={item.price.toString()}
                                                lang="es"
                                                startContent="$"
                                                type="number"
                                                variant="bordered"
                                                onChange={(e) => {
                                                    updatePriceOrders(item.numItem, Number(e.target.value));
                                                }}
                                            />

                                        </p>
                                        <p className='flex gap-2 mt-2 items-center'>
                                            <p className='dark:text-white font-semibold'>Proveedor:</p>
                                            <Select
                                                className="w-72 dark:text-white mt-1"
                                                classNames={{ label: 'font-semibold' }}
                                                placeholder="Selecciona el proveedor"
                                                selectedKeys={[Number(item.supplier?.id).toString()]}
                                                size='sm'
                                                variant="bordered"
                                            >
                                                {item.suppliers.map((sup) => (
                                                    <SelectItem
                                                        key={sup.id}
                                                        className="dark:text-white"
                                                        onPress={() => onUpdateSupplier(item.numItem, sup)}
                                                    >
                                                        {sup.nombre}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </p>
                                    </CardBody>
                                    <CardHeader className="flex justify-between">

                                        <TooltipGlobal text="Eliminar">
                                            <Button
                                                isIconOnly
                                                style={global_styles().dangerStyles}
                                                onPress={() => deleteProductOrder(item.numItem)}
                                            >
                                                <Trash size={18} />
                                            </Button>
                                        </TooltipGlobal>
                                        <TooltipGlobal text="Duplicar fila">
                                            <Button
                                                isIconOnly
                                                style={global_styles().warningStyles}
                                                onPress={() => onDuplicateProduct(item)}
                                            >
                                                <Copy size={18} />
                                            </Button>
                                        </TooltipGlobal>

                                    </CardHeader>
                                </Card>
                            )
                        })}
                    </>
                ))}
            </div>
        </>

    );
}

export default CardAddProductOrder;
