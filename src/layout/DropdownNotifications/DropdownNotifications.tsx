import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, BellIcon, BellRing, BellRingIcon, PanelLeftClose } from 'lucide-react'
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Checkbox,
    Popover,
    PopoverContent,
    PopoverTrigger,
    useDisclosure
} from '@heroui/react'
import { toast } from 'sonner'

import { useAuthStore } from '../../store/auth.store'

import { useReferalNote, useReferalNoteStore } from '@/store/referal-notes'
import { Notifications_Referal, ReferalNote } from '@/types/referal-note.types'
import { IPagination } from '@/types/global.types'
import { formatDate } from '@/utils/dates'
import { DataNotification } from '@/store/types/referal-notes.types.store'
import useWindowSize from '@/hooks/useWindowSize'

const DropdownNotifications = () => {
    const { user } = useAuthStore()
    const { getReferalNoteByBranch,
        referalNote,
        pagination_referal_notesNot,
        hasNewNotification
    } = useReferalNote()
    const [search, setSearch] = useState<{ page: number; limit: number, important: boolean }>({
        page: 1,
        limit: 5,
        important: false
    })
    const { INVALIDATIONS_NOTIFICATIONS, OTHERS_NOTIFICATIONS } = useReferalNoteStore()

    useEffect(() => {
        if (hasNewNotification) {
            toast.success('Nota de remision entrante')
        }
    }, [hasNewNotification])

    useEffect(() => {
        getReferalNoteByBranch(user?.branchId ?? 0, search.page, search.limit, search.important)
    }, [user?.branchId, search.page, search.limit, search.important])

    const total = Number(pagination_referal_notesNot?.total ?? 0) + Number(INVALIDATIONS_NOTIFICATIONS?.length ?? 0) + (OTHERS_NOTIFICATIONS?.length ?? 0)
    const data_notifications: Notifications_Referal = {
        referalNote: referalNote,
        others: OTHERS_NOTIFICATIONS
    }

    return (
        <Popover showArrow backdrop="blur" placement="bottom" >
            <PopoverTrigger >
                <Button
                    isIconOnly
                    className={`relative ${hasNewNotification ? 'animate-bounce' : ''}`}
                    style={{
                        backgroundColor: 'transparent',
                        color: 'white'
                    }}
                >
                    <BellRing size={32} />

                    {total > 0 ? (
                        <span
                            className='bg-emerald-500 rounded-xl w-6'
                        >
                            {total}
                        </span>
                    ) : (<span
                        className='bg-emerald-500 rounded-xl w-6'
                    >
                        0
                    </span>)}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1">
                <UserTwitterCard
                    INVALIDATIONS_NOTIFICATIONS={INVALIDATIONS_NOTIFICATIONS}
                    branchId={user?.branchId ?? 0}
                    getReferalNoteByBranch={getReferalNoteByBranch}
                    limit={search}
                    pagination_referal_notesNot={pagination_referal_notesNot}
                    referalNote={data_notifications}
                    setSearch={setSearch}
                />
            </PopoverContent>
        </Popover>
    )
}

export default DropdownNotifications

export const UserTwitterCard = ({
    referalNote, limit, setSearch,
    INVALIDATIONS_NOTIFICATIONS,
}: {
    referalNote: Notifications_Referal
    pagination_referal_notesNot: IPagination
    getReferalNoteByBranch: (id: number, page: number, limit: number, important: boolean) => void
    branchId: number,
    limit: {
        page: number;
        limit: number;
        important: boolean
    },
    setSearch: Dispatch<SetStateAction<{
        page: number;
        limit: number;
        important: boolean
    }>>
    ,
    INVALIDATIONS_NOTIFICATIONS: DataNotification[]
}) => {
    const modalDetails = useDisclosure()
    const navigate = useNavigate()

    function validation(value: ReferalNote) {
        const data = value?.fecEmi !== formatDate()

        if (data) {
            return `border border-red-400`
        }

        return `border border-teal-400`
    }

    function validationDate(value: ReferalNote) {
        const data = value?.fecEmi !== formatDate()

        if (data) {
            return <AlertTriangle className="w-4 h-4" color={'orange'} />
        }

        return <BellIcon className="w-4 h-4" />
    }
    const [typeNoti, setTypeNoti] = useState<'entrada' | 'salida'>('entrada')
    const [view, setView] = useState<'card' | 'view'>('card')

    const { windowSize } = useWindowSize()
    const widthSize = windowSize.width < 768 ? 'w-80' : 'w-96'

    return (
        <>
            {view === 'card' && (
                <Card
                    className="w-[280px] dark:bg-black shadow-lg border-gray-200 bg-gradient-to-br from-white via-blue-50 to-white z-[10]"
                    shadow="lg"
                >
                    <CardHeader className="justify-between px-4 py-2 dark:bg-black" />

                    <CardBody className="px-4 py-3 space-y-3 dark:bg-black">
                        <Button
                            className="w-full text-sm dark:bg-black font-medium text-blue-600 border border-blue-400 bg-white hover:bg-blue-50"
                            size="sm"
                            variant="flat"
                            onPress={() => navigate('/note-referal')}
                        >
                            <PanelLeftClose /> Ir a notas de remisión
                        </Button>

                        <Button
                            className="w-full dark:bg-black text-sm font-medium text-emerald-600 border border-emerald-400 bg-white hover:bg-blue-50"
                            size="sm"
                            variant="flat"
                            onPress={() => {
                                modalDetails.onOpen(),
                                    setView('view')
                            }}
                        >
                            <BellRing />Historial de notificaciones
                        </Button>

                    </CardBody>
                </Card>
            )}
            <>
                {view === 'view' && (
                    <Card className={`${widthSize} border-none bg-transparent z-[10]`} shadow="none">
                        <CardHeader className="justify-between z-[10] justify-end">
                            <div className='flex fex-row gap-4'>
                                <button className={`flex flex-row p-2 justify-between items-center h-10 w-24 rounded-xl
                                        ${typeNoti.includes('entrada') ?
                                        `border-sky-400 border-1` : 'border-gray-400 border-1'}`}
                                    type='button'
                                    onClick={() => setTypeNoti('entrada')}

                                >
                                    <p className={`text-[12px] ${typeNoti.includes('entrada') && `text-sky-400`}`}>
                                        Entrantes
                                    </p>
                                    <BellRingIcon color={typeNoti.includes('entrada') ? `#00BFFF` : `gray`} size={16} />

                                </button>
                                <button
                                    className={`flex flex-row p-2 justify-between  w-24 h-10 rounded-xl
                                    ${typeNoti.includes('salida')
                                            ? `border-red-400 border-1 ` : `border-gray-400 border-1`} `}
                                    type='button'
                                    onClick={() => setTypeNoti('salida')}

                                >
                                    <p className={`text-[12px] ${typeNoti.includes('salida') && `text-red-400`}`}
                                    >
                                        Salidas
                                    </p>
                                    <BellRingIcon color={typeNoti.includes('salida') ? `#FF3333` : `gray`} size={16} />

                                </button>


                            </div>

                        </CardHeader>
                        <CardBody className="px-5 py-4 dark:bg-black">
                            <div className='flex flex-row justify-between'>
                                <button
                                    className="text-emerald-500 justify-start flex flex-row gap-2 text-sm cursor-pointer"
                                    onClick={() => {
                                        modalDetails.onClose();
                                        setView('card');
                                    }}
                                >
                                    <ArrowLeft /> <p>Regresar</p>
                                </button>
                                {typeNoti.includes('entrada') && (
                                    <div className="flex flex-row gap-2">
                                        <div className='flex flex-row justify-center items-center'>
                                            <Checkbox
                                                isSelected={limit.important}
                                                size="sm"
                                                onValueChange={(e) => {
                                                    setSearch((prev) => ({
                                                        ...prev,
                                                        important: e,
                                                    }));
                                                }}
                                            />

                                            <p className='text-cyan-700 text-[12px]'>
                                                Importantes
                                            </p>

                                        </div>
                                        <div className='flex flex-row justify-center items-center gap-1'>
                                            <input
                                                className='w-10 border-1 rounded-md items-center justify-center text-center text-[12px]'
                                                value={limit.limit.toString()}
                                                onChange={(e) => {
                                                    setSearch((prev) => ({
                                                        ...prev,
                                                        limit: Number(e.target.value),
                                                    }));
                                                }}
                                            />
                                            <p className='text-sky-400 text-[12px]'>
                                                Cantidad
                                            </p>
                                        </div>
                                    </div>
                                )}

                            </div>
                            {typeNoti === 'entrada' && (

                                <div
                                    className="max-h-[160px] overflow-y-auto mt-4 pr-2 space-y-2 scroll-smooth"
                                >

                                    {referalNote.referalNote.length > 0 ? (
                                        <>
                                            {referalNote.referalNote.slice(0, 20).map((item, index) => (
                                                <div
                                                    key={`referal-${index}`}
                                                    className={`flex items-start gap-3 p-3 bg-white dark:bg-black rounded-xl shadow-md ${limit.important ? validation(item) : 'border border-teal-400'
                                                        } hover:shadow-lg transition-all`}
                                                >
                                                    <div className="text-emerald-500 mt-1">{validationDate(item)}</div>
                                                    <div className="text-[12px]">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="text-gray-700 dark:text-white">
                                                                <strong>Código:</strong> {item?.codigoGeneracion}
                                                            </p>
                                                            <span className="bg-teal-500 text-white text-[10px] px-2 py-[1px] rounded-full">
                                                                Entrantes
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-500 dark:text-white">
                                                            <strong>Fecha:</strong> {item?.fecEmi} - {item?.horEmi}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}

                                            {referalNote.others.map((dat, index) => (
                                                <div
                                                    key={`other-${index}`}
                                                    className="flex items-start gap-3 p-3 bg-white dark:bg-black rounded-xl shadow-md border border-teal-400 hover:shadow-lg transition-all"
                                                >
                                                    <div className="text-emerald-500 mt-1">{''}</div>
                                                    <div className="text-[12px]">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="bg-teal-500 text-white text-[10px] px-2 py-[1px] rounded-full">
                                                                Entrantes
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-500 dark:text-white">
                                                            <strong>Descripcion:</strong> {dat?.descripcion}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                        // )}
                                    ) : (<p className='dark:text-white'>No hay datos</p>)}
                                </div>)}
                            {typeNoti === 'salida' && (
                                <div
                                    className="max-h-[160px] overflow-y-auto mt-4 pr-2 space-y-2 scroll-smooth"
                                >

                                    {INVALIDATIONS_NOTIFICATIONS.length > 0 ? (<> {
                                        INVALIDATIONS_NOTIFICATIONS.slice(0, 20).map((item, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-start gap-3 p-3 bg-white dark:bg-black rounded-xl shadow-md ${limit.important ? validation(item?.data) : `border border-red-400 `} hover:shadow-lg transition-all`}
                                            >
                                                <div className="text-red-500 mt-1">
                                                    {validationDate(item?.data)}
                                                </div>
                                                <div className="text-[12px]">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-gray-700 dark:text-white">
                                                            <strong>Código:</strong> {item.data?.codigoGeneracion}
                                                        </p>
                                                        <span className="bg-red-500 text-white text-[10px] px-2 py-[1px] rounded-full ">
                                                            Salidas
                                                        </span>
                                                    </div>

                                                    <p className="text-gray-500 dark:text-white">
                                                        <strong>Fecha:</strong> {item?.data?.fecEmi} - {item?.data?.horEmi}
                                                    </p>
                                                    <p className="text-gray-500 dark:text-white">
                                                        {item?.descripcion.length > 65
                                                            ? item.descripcion.slice(0, 65) + '...'
                                                            : item.descripcion}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}</>) : (<p className='dark:text-white'>No hay datos</p>)}

                                </div>
                            )}

                        </CardBody>
                    </Card>
                )}
            </>
        </>
    )
}
