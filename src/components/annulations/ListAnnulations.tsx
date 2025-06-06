import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Input, Select, SelectItem } from '@heroui/react'
import { toast } from 'sonner'
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi'
import { SearchIcon } from 'lucide-react'

import { formatDate } from '../../utils/dates'
import LoadingTable from '../global/LoadingTable'
import Pagination from '../global/Pagination'
import { exportInvalidationsToExcel } from '../export-reports/ExportInvalidations'

import { limit_options } from '@/utils/constants'
import { TypesVentas } from '@/utils/utils'
import ThGlobal from '@/themes/ui/th-global'
import { useAnnulations } from '@/store/annulations.store'
import { get_list_invalidations } from '@/services/innvalidations.services'
import ButtonUi from '@/themes/ui/button-ui'
import { Colors } from '@/types/themes.types'
import { useViewsStore } from '@/store/views.store'


function ListAnnulations(): JSX.Element {
    const { actions } = useViewsStore()

    const invalidations = actions.find((view) => view.view.name === 'Ver invalidaciones')
    const actionsView = invalidations?.actions?.name || []

    const [startDate, setStartDate] = useState(formatDate())
    const [endDate, setEndDate] = useState(formatDate())
    const [state, setState] = useState('')

    const { getInnvalidations, innvalidations, is_loading, innvalidations_page } = useAnnulations()
    const [limit, setLimit] = useState(10)

    useEffect(() => {
        getInnvalidations(1, limit, startDate, endDate, state)
    }, [limit])


    const handleSearch = (searchParam: string | undefined) => {
        getInnvalidations(
            1,
            limit,
            searchParam ?? startDate,
            searchParam ?? endDate,
            searchParam ?? state
        );
    };

    const handleData = async (searchParam: string | undefined) => {
        await get_list_invalidations(
            1,
            99999,
            searchParam ?? startDate,
            searchParam ?? endDate,
            searchParam ?? state,
        ).then(({ data }) => {
            if (data) {
                exportInvalidationsToExcel(data.innvalidations, startDate, endDate)
            }
        }).catch(() => {
            toast.error('No se proceso la solicitud')
        })

    }

    return (
        <>
            <div className="w-full h-full p-0 md:p-5 bg-gray-100 dark:bg-gray-800">
                <div className="w-full flex flex-col h-full p-3 mt-3 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
                    <Filters
                        dateInitial={startDate}
                        endDate={endDate}
                        setDateInitial={setStartDate}
                        setEndDate={setEndDate}
                    />
                    <div className="flex flex-row justify-between mt-3">
                        <div className="flex justify-between gap-5" />
                        <div className="flex gap-5">
                            {actionsView?.includes("Exportar Excel") && (
                                <>
                                    {innvalidations?.length > 0 ?
                                        <ButtonUi
                                            className="mt-4 font-semibold w-48 "
                                            color="success"
                                            theme={Colors.Success}
                                            onPress={() => {
                                                handleData(undefined)
                                            }}
                                        >
                                            <p>Exportar Excel</p> <PiMicrosoftExcelLogoBold color={'text-color'} size={24} />
                                        </ButtonUi>
                                        :
                                        <ButtonUi
                                            className="mt-4 opacity-70 font-semibold flex-row gap-10"
                                            color="success"
                                            theme={Colors.Success}
                                        >
                                            <p>Exportar Excel</p>
                                            <PiMicrosoftExcelLogoBold className="text-white" size={24} />
                                        </ButtonUi>
                                    }
                                </>
                            )}
                            <Select
                                className="w-44"
                                classNames={{
                                    label: 'text-sm font-semibold dark:text-white'
                                }}
                                defaultSelectedKeys={[limit.toString()]}
                                label="Cantidad a mostrar"
                                labelPlacement="outside"
                                placeholder="Selecciona una cantidad"
                                value={state}
                                variant="bordered"
                                onChange={(e) => setLimit(+e.target.value)}
                            >
                                {limit_options.map((e) => (
                                    <SelectItem key={e}
                                        className='dark:text-white'

                                    >{e}</SelectItem>
                                ))}
                            </Select>

                            <Select
                                className="w-44"
                                classNames={{
                                    label: 'text-sm font-semibold dark:text-white'
                                }}
                                label="Mostrar por tipo"
                                labelPlacement="outside"
                                placeholder="Selecciona un item"
                                value={state}
                                variant="bordered"
                                onChange={(e) => setState(e.target.value)}
                            >
                                {TypesVentas.map((e) => (
                                    <SelectItem key={e.value}
                                        className='dark:text-white'
                                    >{e.label}</SelectItem>
                                ))}
                            </Select>

                            <ButtonUi
                                className="mt-6 hidden font-semibold lg:flex"
                                color="primary"
                                endContent={<SearchIcon size={15} />}
                                theme={Colors.Info}
                                onPress={() => {
                                    handleSearch(undefined);
                                }}
                            >
                                Buscar
                            </ButtonUi>

                        </div>
                    </div>
                    <div className="overflow-x-auto h-full custom-scrollbar mt-4">
                        <table className="w-full">
                            <thead className="sticky top-0 z-20 bg-white">
                                <tr>
                                    <ThGlobal className="p-3 text-sm font-semibold text-left " >
                                        NO.
                                    </ThGlobal>
                                    <ThGlobal className="p-3 text-sm font-semibold text-left ">
                                        FECHA - HORA
                                    </ThGlobal>
                                    <ThGlobal className="p-3 text-sm font-semibold text-left ">
                                        NÚMERO DE CONTROL
                                    </ThGlobal>
                                    <ThGlobal className="p-3 text-sm font-semibold text-left ">
                                        CODIGO DE GENERACION
                                    </ThGlobal>
                                    <ThGlobal className="p-3 text-sm font-semibold text-left ">
                                        TIPO
                                    </ThGlobal>
                                    <ThGlobal className="p-3 text-sm font-semibold text-left ">
                                        ESTADO
                                    </ThGlobal>

                                </tr>
                            </thead>
                            <tbody className="max-h-[600px] w-full overflow-y-auto">
                                {is_loading ? (
                                    <tr>
                                        <td className="p-3 text-sm text-center text-slate-500" colSpan={6}>
                                            <LoadingTable />
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {innvalidations.length > 0 ? (
                                            <>
                                                {innvalidations.map((item, index) => (
                                                    <tr key={index} className="border-b border-slate-200">
                                                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                            {item.id}
                                                        </td>
                                                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                            {item?.fecAnula} - {item?.horAnula}
                                                        </td>
                                                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100 ">
                                                            {item.numeroControl}
                                                        </td>
                                                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                            {item.codigoGeneracion}
                                                        </td>

                                                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                            {item?.tipoDte === "04" && 'NOTA DE REMISIÓN' || item?.tipoDte === "05" && 'NOTA DE CRÉDITO' || item?.tipoDte === '06' && 'NOTA DE DÉBITO' || item?.tipoDte === "14" && "SUJETO EXCLUIDO" || item?.tipoDte === "01" && 'FACTURA COMERCIAL' || item?.tipoDte === "03" && "CRÉDITO FISCAL"}
                                                        </td>
                                                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">

                                                            {'INVALIDADO'}
                                                        </td>

                                                    </tr>
                                                ))}
                                            </>
                                        ) : (
                                            <tr>
                                                <td colSpan={6}>
                                                    <div className="flex flex-col justify-center items-center">
                                                        <p className="text-2xl dark:text-white">No se encontraron resultados</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-5 w-full">
                    <Pagination
                        currentPage={innvalidations_page.currentPag}
                        nextPage={innvalidations_page.prevPag}
                        previousPage={innvalidations_page.nextPag}
                        totalPages={innvalidations_page.totalPag}
                        onPageChange={(page) => {

                            getInnvalidations(page, limit, startDate, endDate, state)
                        }}
                    />
                </div>
            </div >

        </>
    )
}

export default ListAnnulations

interface FiltersProps {
    dateInitial: string
    setDateInitial: Dispatch<SetStateAction<string>>
    endDate: string
    setEndDate: Dispatch<SetStateAction<string>>
}

const Filters = (props: FiltersProps): JSX.Element => {
    return (
        <div className="flex w-full gap-5 py-5 md:p-0">
            <Input
                classNames={{
                    input: 'dark:text-white dark:border-gray-600',
                    label: 'text-sm font-semibold dark:text-white'
                }}
                defaultValue={formatDate()}
                label="Fecha inicial"
                labelPlacement="outside"
                placeholder="Buscar por nombre..."
                type="date"
                value={props.dateInitial}
                variant="bordered"
                onChange={(e) => props.setDateInitial(e.target.value)}
            />
            <Input
                classNames={{
                    input: 'dark:text-white dark:border-gray-600',
                    label: 'text-sm font-semibold dark:text-white'
                }}
                label="Fecha final"
                labelPlacement="outside"
                placeholder="Buscar por nombre..."
                type="date"
                value={props.endDate}
                variant="bordered"
                onChange={(e) => props.setEndDate(e.target.value)}
            />
        </div>
    )
}
