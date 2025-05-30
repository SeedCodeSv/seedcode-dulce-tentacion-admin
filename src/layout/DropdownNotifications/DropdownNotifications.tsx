import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BellIcon, BellRing, PanelLeftClose } from 'lucide-react'
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

import { useReferalNote } from '@/store/referal-notes'
import { ReferalNote } from '@/types/referal-note.types'
import { IPagination } from '@/types/global.types'
import { formatDate } from '@/utils/dates'

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

    useEffect(() => {
        if (hasNewNotification) {
            toast.success('Nota de remision entrante')
        }
    }, [hasNewNotification])

    useEffect(() => {
        getReferalNoteByBranch(user?.branchId ?? 0, search.page, search.limit, search.important)
    }, [user?.branchId, search.page, search.limit, search.important])


    return (
        <Popover showArrow backdrop="blur" placement="bottom">
            <PopoverTrigger>
                <Button
                    isIconOnly
                    className={`relative ${hasNewNotification ? 'animate-bounce' : ''}`}
                    style={{
                        backgroundColor: 'transparent',
                        color: 'white'
                    }}
                >
                    <BellRing size={32} />

                    {pagination_referal_notesNot?.total > 0 ? (
                        <span
                            className='bg-emerald-500 rounded-xl w-6'
                        >
                            {pagination_referal_notesNot.total}
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
                    branchId={user?.branchId ?? 0}
                    getReferalNoteByBranch={getReferalNoteByBranch}
                    limit={search}
                    pagination_referal_notesNot={pagination_referal_notesNot}
                    referalNote={referalNote}
                    setSearch={setSearch}
                />
            </PopoverContent>
        </Popover>
    )
}

export default DropdownNotifications

export const UserTwitterCard = ({
    referalNote, limit, setSearch
}: {
    referalNote: ReferalNote[]
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
}) => {
    const modalDetails = useDisclosure()
    const navigate = useNavigate()

    function validation(value: ReferalNote) {
        const data = value.fecEmi !== formatDate()

        if (data) {
            return `border border-red-400`
        }

        return `border border-teal-400`
    }
    const [view, setView] = useState<'card' | 'view'>('card')

    return (
        <>
            {view === 'card' && (
                <Card
                    className="w-[280px] rounded-xl shadow-lg border border-gray-200 bg-gradient-to-br from-white via-blue-50 to-white z-[10]"
                    shadow="lg"
                >
                    <CardHeader className="justify-between px-4 py-2 border-b border-gray-100" />

                    <CardBody className="px-4 py-3 space-y-3">
                        <Button
                            className="w-full text-sm font-medium text-blue-600 border border-blue-400 bg-white hover:bg-blue-50"
                            size="sm"
                            variant="flat"
                            onPress={() => navigate('/note-referal')}
                        >
                            <PanelLeftClose /> Ir a notas de remisión
                        </Button>

                        <Button
                            className="w-full text-sm font-medium text-emerald-600 border border-emerald-400 bg-white hover:bg-blue-50"
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
                    <Card className="w-96 border-none bg-transparent z-[10]" shadow="none">
                        <CardHeader className="justify-between z-[10]" />
                        <CardBody className="px-5 py-4">
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
                            </div>
                            <div
                                className="max-h-[160px] overflow-y-auto mt-4 pr-2 space-y-2 scroll-smooth"
                            >
                                {referalNote.slice(0, 20).map((item, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-start gap-3 p-3 bg-white rounded-md shadow-md ${limit.important ? validation(item) : `border border-teal-400 `} hover:shadow-lg transition-all`}
                                    >
                                        <div className="text-emerald-500 mt-1">
                                            <BellIcon className="w-4 h-4" />
                                        </div>
                                        <div className="text-[12px]">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-gray-700">
                                                    <strong>Código:</strong> {item.codigoGeneracion}
                                                </p>
                                                <span className="bg-teal-500 text-white text-[10px] px-2 py-[1px] rounded-full">
                                                    Entrantes
                                                </span>
                                            </div>

                                            <p className="text-gray-500">
                                                <strong>Fecha:</strong> {item.fecEmi} - {item.horEmi}
                                            </p>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                )}
            </>
        </>
    )
}
