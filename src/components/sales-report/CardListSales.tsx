import { Button, Card, CardBody, CardHeader, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
// eslint-disable-next-line import/order
import { CircleX, EllipsisVertical } from 'lucide-react';

// import { IMobileViewOrderProducst } from './types/mobile-view.types';

import { useNavigate } from 'react-router';


// import { RenderStatus, Status } from './render-order-status';

// import ResendEmail from '../reporters/ResendEmail';

import { IMobileListSales } from '../products/types/mobile-view.types';
import ResendEmail from '../reporters/ResendEmail';

import { formatEmployee } from '@/utils/dates';
import { useSalesStore } from '@/store/sales.store';
import { useAuthStore } from '@/store/auth.store';
import { verifyApplyAnulation } from '@/utils/filters';


function CardListSales({
    setUnseen,
    downloadJSON,
    handleShowPdf,
    downloadPDF,
    verifyNotes,
    pdfPath,
    isMovil,
    unseen,
    notes
}: IMobileListSales) {
    const { user } = useAuthStore()
    const { sales_dates } =
        useSalesStore();
    const navigation = useNavigate()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-3 overflow-y-auto p-2">
            {sales_dates?.map((sale, index) => (
                <Card key={index}>
                    <CardHeader className='flex justify-between'>
                        {sale.id}
                        {/* {RenderStatus({ status: prd.status as Status }) || prd.status} */}

                        {/* <Checkbox
                            key={prd.id}
                            checked={selectedIds.includes(prd.id)}
                            onValueChange={() => handleCheckboxChange(prd.id)}
                        /> */}
                    </CardHeader>
                    <CardBody>
                        <p>
                            <span className="font-semibold">No. control:</span>
                            {sale.numeroControl}
                        </p>

                        <p>
                            <span className="font-semibold">Cod. generación:</span>
                            {sale.codigoGeneracion}
                        </p>

                        <p className='flex gap-2 mt-2'>
                            <span className="font-semibold">Encargado:</span>
                            {/* {prd.employee.firstName} {prd.employee.secondName} {prd.employee.firstLastName}{' '}
              {prd.employee.secondLastName} */}
                            {formatEmployee(sale.employee as any)}
                        </p>
                    </CardBody>
                    <CardHeader className="flex justify-between">
                        {!pdfPath && (
                            <Popover
                                classNames={{
                                    content: unseen
                                        ? 'opacity-0 invisible pointer-events-none'
                                        : 'bg-white dark:bg-gray-800',
                                }}
                                showArrow={!unseen}
                                onOpenChange={(isOpen) => {
                                    if (isOpen && sale.tipoDte === '03') {
                                        verifyNotes(sale.id);
                                    }
                                }}
                            >
                                <PopoverTrigger>
                                    <Button isIconOnly>
                                        <EllipsisVertical size={20} />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-1 ">
                                    {sale.salesStatus.name === 'PROCESADO' && sale.tipoDte === '03' && (
                                        <Listbox
                                            aria-label="Actions"
                                            className="dark:text-white"
                                            onAction={(key) => {
                                                const routeMap: Record<string, string> = {
                                                    'debit-note': `/debit-note/${sale.id}`,
                                                    'show-debit-note': `/get-debit-note/${sale.id}`,
                                                    'credit-note': `/credit-note/${sale.id}`,
                                                    'show-credit-note': `/get-credit-note/${sale.id}`,
                                                };

                                                if (key in routeMap) {
                                                    navigation(routeMap[key]);
                                                }
                                            }}
                                        >
                                            {notes.debits > 0 ? (
                                                <ListboxItem
                                                    key="show-debit-note"
                                                    classNames={{ base: 'font-semibold' }}
                                                    color="primary"
                                                    variant="flat"
                                                >
                                                    Ver notas de débito
                                                </ListboxItem>
                                            ) : (
                                                <ListboxItem
                                                    key="debit-note"
                                                    classNames={{ base: 'font-semibold' }}
                                                    color="danger"
                                                    variant="flat"
                                                >
                                                    Nota de débito
                                                </ListboxItem>
                                            )}

                                            {notes.credits > 0 ? (
                                                <ListboxItem
                                                    key="show-credit-note"
                                                    classNames={{ base: 'font-semibold' }}
                                                    color="primary"
                                                    variant="flat"
                                                >
                                                    Ver notas de crédito
                                                </ListboxItem>
                                            ) : (
                                                <ListboxItem
                                                    key="credit-note"
                                                    classNames={{ base: 'font-semibold' }}
                                                    color="danger"
                                                    variant="flat"
                                                >
                                                    Nota de crédito
                                                </ListboxItem>
                                            )}
                                        </Listbox>
                                    )}

                                    {['PROCESADO'].includes(sale.salesStatus.name) && (
                                        <Listbox aria-label="Actions" className="dark:text-white">
                                            <ListboxItem
                                                key="show-pdf"
                                                classNames={{ base: 'font-semibold' }}
                                                color="danger"
                                                variant="flat"
                                                onPress={() => {
                                                    isMovil ? downloadPDF(sale) :
                                                        handleShowPdf(sale.id, sale.tipoDte)
                                                }}
                                            >
                                                Ver comprobante
                                            </ListboxItem>
                                            <ListboxItem
                                                key="download-json"
                                                classNames={{ base: 'font-semibold' }}
                                                color="danger"
                                                variant="flat"
                                                onPress={() => downloadJSON(sale)}
                                            >
                                                Descargar JSON
                                            </ListboxItem>
                                            <ListboxItem key="resend-email"
                                                onPress={() =>
                                                    setUnseen(true)
                                                }
                                            >
                                                <ResendEmail
                                                    customerId={sale.customerId}
                                                    id={user!.transmitterId}
                                                    path={sale.pathJson}
                                                    tipoDte={sale.tipoDte}
                                                    onClose={() => {
                                                        setUnseen(false)
                                                    }}
                                                />
                                            </ListboxItem>
                                            <ListboxItem key="annulation"
                                                onPress={() => {
                                                    const value = verifyApplyAnulation(
                                                        sale.tipoDte,
                                                        sale.fecEmi
                                                    )

                                                    if (value && sale?.tipoDte === '03') {
                                                        navigation('/annulation/03/' + sale.id)
                                                    }

                                                    if (value && sale?.tipoDte === '01') {
                                                        navigation('/annulation/01/' + sale.id)
                                                    }
                                                }
                                                }
                                            >
                                                Invalidar
                                            </ListboxItem>
                                        </Listbox>
                                    )}

                                    {sale.salesStatus.name === 'INVALIDADO' && (
                                        <Listbox aria-label="Actions" className="dark:text-white">
                                            <ListboxItem
                                                key="invalid"
                                                classNames={{ base: 'font-semibold' }}
                                                color="danger"
                                                variant="flat"
                                            >
                                                <CircleX size={20} />
                                            </ListboxItem>
                                        </Listbox>
                                    )}
                                </PopoverContent>

                            </Popover>
                        )}

                    </CardHeader>
                </Card>
            ))}
        </div>
    );
}

export default CardListSales;
