import { Button, Card, CardBody, CardHeader } from '@heroui/react';
// eslint-disable-next-line import/order
import { AlignJustify, ClipboardCheck } from 'lucide-react';

// import { IMobileViewOrderProducst } from './types/mobile-view.types';


// eslint-disable-next-line import/order

// import { RenderStatus, Status } from './render-order-status';

// import { formatEmployee } from '@/utils/dates';
import { useNavigate } from 'react-router';

import TooltipGlobal from '../global/TooltipGlobal';
import useGlobalStyles from '../global/global.styles';

import { usePurchaseOrdersStore } from '@/store/purchase_orders.store';




function CardListPurcharseOrder({
    // handleDetails,
    // onAddBydetail,
    // onAddBranchDestiny,
    // onAddOrderId,
    // addSelectedProducts,
    // selectedIds,
    // handleCheckboxChange

    openModal,
    actions
}: { openModal: (id: number) => void, actions: string[]; }) {
    const {
        purchase_orders,
    } = usePurchaseOrdersStore();
    const styles = useGlobalStyles();

    const navigate = useNavigate()

    return (
        <>



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-3 overflow-y-auto p-2">
                {/* {purchase_orders.map((prd) => ( */}
                <>
                    {purchase_orders.map((item, valIndex) => {
                        return (
                            <Card key={valIndex}>
                                <CardHeader className='flex justify-between'>
                                    <p>

                                        {item.id}</p>
                                    <p>

                                        {item && item.state ? (
                                            <span className="bg-green-500 text-white px-3 py-1 rounded-lg w-32 text-center">
                                                COMPLETADO
                                            </span>
                                        ) : (
                                            <span className="bg-red-500 text-white px-5 py-1 rounded-lg w-32 text-center">
                                                PENDIENTE
                                            </span>
                                        )}
                                    </p>

                                </CardHeader>
                                <CardBody className='bottom-4'>
                                    <p>
                                        <span className="font-semibold">Sucursal:</span>
                                        {' '} {item?.branch?.name ?? 'N/A'}
                                    </p>
                                    <p className='flex gap-2 mt-2 items-center'>
                                        <p className='dark:text-white font-semibold'>Fecha:</p>

                                        {item.date}
                                    </p>



                                </CardBody>
                                <CardHeader className="flex justify-center">


                                    <>
                                        {!!item.state === false ? (
                                            <>
                                                {actions.includes('Completar Orden') && (
                                                    <TooltipGlobal text="Completar orden 111">
                                                        <Button
                                                            isIconOnly
                                                            style={styles.secondaryStyle}
                                                            onPress={() =>
                                                                navigate(`/update-purchase-detail/${item.id}`)
                                                            }
                                                        >
                                                            <ClipboardCheck />
                                                        </Button>
                                                    </TooltipGlobal>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <TooltipGlobal text="Editar">
                                                    <>
                                                        {actions.includes('Editar') && (
                                                            <Button
                                                                isDisabled
                                                                isIconOnly
                                                                style={styles.secondaryStyle}
                                                                onPress={() => openModal(item.id)}
                                                            >
                                                                <AlignJustify />
                                                            </Button>
                                                        )}
                                                    </>
                                                </TooltipGlobal>
                                            </>
                                        )}
                                    </>

                                </CardHeader>
                            </Card>
                        )
                    })}
                </>
                {/* ))} */}
            </div>
        </>

    );
}

export default CardListPurcharseOrder;
