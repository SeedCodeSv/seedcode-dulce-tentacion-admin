import { useEffect, useState } from 'react'
import { Input, Select, SelectItem } from '@heroui/react'
import { toast } from 'sonner'
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi'

import { formatDate } from '../../utils/dates'
import LoadingTable from '../global/LoadingTable'
import Pagination from '../global/Pagination'
import { exportInvalidationsToExcel } from '../export-reports/ExportInvalidations'
import { ResponsiveFilterWrapper } from '../global/ResposiveFilters'
import RenderViewButton from '../global/render-view-button'
import EmptyTable from '../global/EmptyTable'

import { limit_options } from '@/utils/constants'
import { TypesVentas } from '@/utils/utils'
import ThGlobal from '@/themes/ui/th-global'
import { useAnnulations } from '@/store/annulations.store'
import { get_list_invalidations } from '@/services/innvalidations.services'
import ButtonUi from '@/themes/ui/button-ui'
import { Colors } from '@/types/themes.types'
import { useViewsStore } from '@/store/views.store'
import useWindowSize from '@/hooks/useWindowSize'
import DivGlobal from '@/themes/ui/div-global'

function ListAnnulations(): JSX.Element {
    const { actions } = useViewsStore()
    const { windowSize } = useWindowSize()
    const [view, setView] = useState<'grid' | 'table' | 'list'>(
        windowSize.width < 768 ? 'grid' : 'table'
    )
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
            <DivGlobal>
                {/* <Filters
                        dateInitial={startDate}
                        endDate={endDate}
                        setDateInitial={setStartDate}
                        setEndDate={setEndDate}
                    /> */}
                <div className={`${windowSize.width < 768 && 'flex justify-between'}`}>

                    <ResponsiveFilterWrapper
                        onApply={() => handleSearch(undefined)}

                    >
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
                            value={startDate}
                            variant="bordered"
                            onChange={(e) => setStartDate(e.target.value)}
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
                            value={endDate}
                            variant="bordered"
                            onChange={(e) => setEndDate(e.target.value)}
                        />

                    </ResponsiveFilterWrapper>
                    {windowSize.width < 768 && (
                        <RenderViewButton setView={setView} view={view} />

                    )}                    </div>

                <div className="flex flex-row justify-between mt-3">
                    {windowSize.width > 768 && (
                        <RenderViewButton setView={setView} view={view} />

                    )}

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

                        {/* <ButtonUi
                                className="mt-6 hidden font-semibold lg:flex"
                                color="primary"
                                endContent={<SearchIcon size={15} />}
                                theme={Colors.Info}
                                onPress={() => {
                                    handleSearch(undefined);
                                }}
                            >
                                Buscar
                            </ButtonUi> */}

                    </div>
                </div>
                {view === 'table' && (
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
                                ) : innvalidations.length > 0 ? (
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
                                                    {item?.tipoDte === "04" && 'NOTA DE REMISIÓN' || item?.tipoDte === "05" && 'NOTA DE CRÉDITO' || item?.tipoDte === '06' && 'NOTA DE DÉBITO' || item?.tipoDte === "14" && "SUJETO EXCLUIDO" || item?.tipoDte === "01" && 'FACTURA' || item?.tipoDte === "03" && "CRÉDITO FISCAL"}
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
                                            <EmptyTable />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {view === 'grid' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {is_loading ? (
                            <div className="col-span-full flex justify-center items-center">
                                <LoadingTable />
                            </div>
                        ) : innvalidations.length === 0 ? (
                            <EmptyTable />
                        ) : (
                            innvalidations.map((item, index) => (
                                <div key={index} className="rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-4 shadow-sm">
                                    <p className="text-sm text-slate-500 dark:text-slate-300"><span className="font-semibold">NO.:</span> {item.id}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-300"><span className="font-semibold">FECHA - HORA:</span> {item?.fecAnula} - {item?.horAnula}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-300"><span className="font-semibold">N° CONTROL:</span> {item.numeroControl}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-300"><span className="font-semibold">CÓD. GENERACIÓN:</span> {item.codigoGeneracion}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-300"><span className="font-semibold">TIPO:</span> {{
                                        "04": "NOTA DE REMISIÓN",
                                        "05": "NOTA DE CRÉDITO",
                                        "06": "NOTA DE DÉBITO",
                                        "14": "SUJETO EXCLUIDO",
                                        "01": "FACTURA",
                                        "03": "CRÉDITO FISCAL"
                                    }[item.tipoDte] ?? item.tipoDte}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-300"><span className="font-semibold">ESTADO:</span> INVALIDADO</p>
                                </div>
                            ))
                        )}
                    </div>

                )}
                {innvalidations_page.totalPag > 1 &&
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
                }
            </DivGlobal >

        </>
    )
}

export default ListAnnulations

// interface FiltersProps {
//     dateInitial: string
//     setDateInitial: Dispatch<SetStateAction<string>>
//     endDate: string
//     setEndDate: Dispatch<SetStateAction<string>>
// }

// const Filters = (props: FiltersProps): JSX.Element => {
//     return (
//         <div className="flex w-full gap-5 py-5 md:p-0">

//         </div>
//     )
// }
