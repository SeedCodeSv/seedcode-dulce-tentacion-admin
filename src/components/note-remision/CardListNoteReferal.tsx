
import { Button, Card, CardBody, CardHeader, Chip, UseDisclosureProps } from '@heroui/react';
// eslint-disable-next-line import/order
import { ClipboardCheck, Clipboard, FileX2 } from 'lucide-react';

// import { IMobileViewOrderProducst } from './types/mobile-view.types';


// eslint-disable-next-line import/order

// import { RenderStatus, Status } from './render-order-status';

// import { formatEmployee } from '@/utils/dates';
import { PiFilePdf } from 'react-icons/pi';
import { Dispatch, SetStateAction } from 'react';

import TooltipGlobal from '../global/TooltipGlobal';

// import { FloatingButton } from './FloatingButton';

import useGlobalStyles from '../global/global.styles';

import DoublePdfExport from './ExportDoublePdf';

import { useReferalNote } from '@/store/referal-notes';
import { ITransmitter } from '@/types/transmitter.types';
import { ReferalNote } from '@/types/referal-note.types';



function CardListNoteReferal({
    actions,
    handleShowPdf,
    transmitter,
    modalComplete,
    setSelectedNote,
    modalInvalidate,
    setItems
}: {
    actions: string[],
    handleShowPdf: (data: string) => void,
    transmitter: ITransmitter,
    modalComplete: UseDisclosureProps,
    setSelectedNote: (value: SetStateAction<ReferalNote | null>) => void,
    modalInvalidate: UseDisclosureProps,
    setItems: Dispatch<SetStateAction<ReferalNote | undefined>>

}) {
    // const { windowSize } = useWindowSize()
    const { referalNotes } = useReferalNote();

    const styles = useGlobalStyles();


    // const [selectedIndex, setSelectedIndex] =useState(orders_by_supplier.map(()))

    return (
        <>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-3 overflow-y-auto p-2">
                {/* {orders_by_supplier.map((prd) => ( */}
                <>
                    {referalNotes.map((item, valIndex) => {
                        return (
                            <Card key={valIndex}>
                                <CardHeader className='flex justify-between'>
                                    <p>

                                        {item.id}</p>
                                    <p>
                                        <p className='flex font-semibold'>Ori. sucursal</p>
                                        {item?.receivingBranch?.name}

                                    </p>

                                    <p>

                                        <p className='flex font-semibold'>Desti. Sucursal</p>
                                        {item?.branch?.name}</p>

                                </CardHeader>
                                <CardBody className='bottom-4'>
                                    <p>
                                        <span className="font-semibold">Cod. generación:</span>
                                        {item?.codigoGeneracion ?? 'N/A'}
                                    </p>
                                    <p className='flex gap-2 mt-2 items-center'>
                                        <p className='dark:text-white font-semibold'>No. Control:</p>

                                        {item?.numeroControl}
                                    </p>

                                    <p className='flex gap-2 mt-2 items-center'>
                                        <p className='dark:text-white font-semibold'>Estado:</p>
                                        <Chip
                                            classNames={{
                                                content: 'text-white text-sm !font-bold px-3',
                                            }}
                                            color={(() => {
                                                switch (item.status.name) {
                                                    case 'PROCESADO':
                                                        return 'success';
                                                    case 'ANULADA':
                                                        return 'danger';
                                                    case 'CONTINGENCIA':
                                                        return 'warning';
                                                    case 'PENDIENTE':
                                                        return 'primary';
                                                    default:
                                                        return 'default';
                                                }
                                            })()}
                                        >
                                            {item.status.name}
                                        </Chip>
                                    </p>

                                </CardBody>
                                <CardHeader className="flex justify-between">

                                    <DoublePdfExport note={item} transmitter={transmitter} />
                                    {actions.includes('Ver comprobante') && (
                                        <TooltipGlobal text="Ver comprobante">
                                            <Button
                                                isIconOnly
                                                style={styles.dangerStyles}
                                                onPress={() => handleShowPdf(item.codigoGeneracion)}
                                            >
                                                <PiFilePdf size={25} />
                                            </Button>
                                        </TooltipGlobal>
                                    )}
                                    {item?.status.name.includes('PROCESADO') && (
                                        <TooltipGlobal text="Invalidar">
                                            <Button
                                                isIconOnly
                                                style={styles.dangerStyles}
                                                onPress={() => {
                                                    modalInvalidate.onOpen!();
                                                    setItems(item);
                                                }}
                                            >
                                                <FileX2 size={25} />
                                            </Button>
                                        </TooltipGlobal>
                                    )}
                                    {!!item.employee && item.status.name.includes('PENDIENTE') && (
                                        <TooltipGlobal text={item?.isCompleted ? 'Completado' : 'Completar'}>
                                            <Button
                                                isIconOnly
                                                style={
                                                    !item?.isCompleted
                                                        ? styles.darkStyle
                                                        : { backgroundColor: '#2E8B57', color: 'white' }
                                                }
                                                onPress={() => {
                                                    setSelectedNote(item);
                                                    // if (modalComplete) {
                                                    modalComplete.onOpen!()

                                                    // }
                                                }}
                                            >
                                                {!item?.isCompleted ? (
                                                    // eslint-disable-next-line react/jsx-no-undef
                                                    <Clipboard size={25} />
                                                ) : (
                                                    <ClipboardCheck size={25} />
                                                )}
                                            </Button>
                                        </TooltipGlobal>
                                    )}
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

export default CardListNoteReferal;
