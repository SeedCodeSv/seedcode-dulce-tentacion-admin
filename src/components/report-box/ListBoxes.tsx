import { useEffect, useState } from 'react';
import { Input, Select, SelectItem } from '@heroui/react';
import classNames from 'classnames';

import { ResponsiveFilterWrapper } from '../global/ResposiveFilters';
import NoDataInventory from '../inventory_aqdjusment/NoDataInventory';
import Pagination from '../global/Pagination';

// import MovementsExportExcell from './MovementsExcell';

import ReportBoxesExcell from './ReportBoxesExcell';
import ReportBoxesPdf from './ReportBoxesPdf';

import { fechaActualString } from '@/utils/dates';
import { useBranchesStore } from '@/store/branches.store';
import { formatCurrency } from '@/utils/dte';
import { TableComponent } from '@/themes/ui/table-ui';
import DivGlobal from '@/themes/ui/div-global';
import { useReportBoxStore } from '@/store/report-box.store';




interface Props {
    actions: string[];
}

function ListBoxes({ actions }: Props) {
    const limit = 30
    const { paginated_report, OnGetPaginatedReportBox, report_boxes } = useReportBoxStore()


    const { branch_list, getBranchesList } = useBranchesStore();
    const [filter, setFilter] = useState({
        startDate: fechaActualString,
        endDate: fechaActualString,
        branches: [] as number[],
    });

    useEffect(() => {
        OnGetPaginatedReportBox(
            1,
            limit,
            filter.branches,
            filter.startDate,
            filter.endDate,

        );
        getBranchesList();
    }, []);



    const branchesOptions = [
        { label: 'Todos', value: 'all' },
        ...branch_list.map((option) => ({
            label: option.name,
            value: String(option.id),
        })),
    ];

    return (
        <DivGlobal>
            <div className="flex justify-between md:flex-col">
                <ResponsiveFilterWrapper onApply={() => OnGetPaginatedReportBox(
                    1,
                    limit,
                    filter.branches,
                    filter.startDate,
                    filter.endDate,
                )}>
                    <Input
                        className="dark:text-white"
                        classNames={{ base: 'font-semibold' }}
                        defaultValue={filter.startDate}
                        label="Fecha inicial"
                        labelPlacement="outside"
                        type="date"
                        value={filter.startDate}
                        variant="bordered"
                        onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                    />
                    <Input
                        className="dark:text-white"
                        classNames={{ base: 'font-semibold' }}
                        defaultValue={filter.endDate}
                        label="Fecha final"
                        labelPlacement="outside"
                        type="date"
                        value={filter.endDate}
                        variant="bordered"
                        onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                    />
                    <div className="w-full">

                        <div>
                            <Select
                                className="w-80 flex"
                                classNames={{
                                    label: 'font-semibold',
                                    innerWrapper: 'uppercase',
                                }}
                                label="Sucursales"
                                labelPlacement="outside"
                                placeholder="Selecciona una o más sucursales"
                                selectedKeys={new Set(filter.branches.map(id => id.toString()))}
                                selectionMode="multiple"
                                variant="bordered"
                                onSelectionChange={(keys) => {
                                    const selected = Array.from(keys);
                                    const allIds = branch_list.map((b) => b.id);
                                    const allSelected = filter.branches.length === allIds.length;

                                    if (selected.includes("all")) {
                                        if (allSelected) {
                                            setFilter({ ...filter, branches: [] });
                                        } else {
                                            setFilter({ ...filter, branches: allIds });
                                        }
                                    } else {
                                        const ids = selected.map(Number).filter((id) => !isNaN(id));

                                        setFilter({ ...filter, branches: ids });
                                    }
                                }}


                            >
                                {branchesOptions.map(({ label, value }) => (
                                    <SelectItem key={value.toString()} className="uppercase">
                                        {label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>


                    </div>

                </ResponsiveFilterWrapper>

                <div className="flex items-center gap-3 mt-3">
                    {actions.includes('Exportar PDF') && (
                        <ReportBoxesPdf filters={filter} />
                    )}
                    {actions.includes('Exportar Excel') && (
                        <ReportBoxesExcell
                        //  branch={user?.pointOfSale?.branch} 
                         filters={filter}
                        //   transmitter={transmitter} 
                         />
                    )}
                </div>
            </div>
            <TableComponent
                className='hidden xl:flex'
                headers={['Sucursal', 'Inicio', 'Final', 'Fecha', 'Hora', 'Total gastos', 'Total general ventas']}
            >
                {report_boxes.length > 0 ? (
                    <>
                        {report_boxes.map((box, index) => (
                            <tr key={index} className="border-b dark:border-slate-600 border-slate-200">
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                    {box?.pointOfSale?.branch?.name}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                    {box?.start}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                    {formatCurrency(Number(box?.totalSalesStatus ?? 0) + Number(box?.invalidatedTotal ?? 0))}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                    {box?.date}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                    {box?.time}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                    {box?.totalExpense}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                    {formatCurrency(Number(box?.totalSales))}
                                </td>
                            </tr>
                        ))}
                    </>
                ) : (
                    <tr>
                        <td colSpan={7}>
                            <NoDataInventory title="No se encontraron  movimientos" />
                        </td>
                    </tr>
                )}
            </TableComponent>


            {report_boxes.length > 0 ? (
                <div className="w-full xl:hidden  mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                    {report_boxes.map((box) => (
                        <div
                            key={box.id}
                            className={classNames(
                                'w-full shadow dark:border border-gray-600 hover:shadow-lg p-5 rounded-2xl'
                            )}
                        >
                            <p className="dark:text-white font-semibold">
                                Sucursal : {box?.pointOfSale?.branch?.name}
                            </p>
                            <div className="flex justify-between w-full gap-2 mt-2">
                                <p className="dark:text-white">Inicio : ${box?.start}</p>
                                <p className="dark:text-white">
                                    Final :{formatCurrency(Number(box?.totalSalesStatus ?? 0) + Number(box?.invalidatedTotal ?? 0))}
                                </p>
                            </div>

                            <div className="flex w-full justify-between gap-2 mt-3 ">
                                <p className="dark:text-white flex items-center justify-center">
                                    Fecha : {box?.date}
                                </p>
                                <p className="dark:text-white flex items-center justify-center">
                                    Hora : {box?.time}
                                </p>
                            </div>
                            <div className="flex w-full justify-between gap-2 mt-3 ">
                                <p className="dark:text-white flex items-center justify-center">
                                    Total invalidaciones : {formatCurrency(box?.invalidatedTotal)}
                                </p>
                                <p className="dark:text-white flex items-center justify-center">
                                    Estado : {box?.isActive === true ? 'ACTIVO' : 'INACTIVO'}
                                </p>
                            </div>
                            <div className="flex justify-between mt-5 w-ful">
                                <p className="dark:text-white">Total en gastos : ${box?.totalExpense}</p>
                                <p className="text-green-500 font-semibold">Total general ventas: ${box?.totalSalesStatus}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="md:flex flex xl:hidden justify-center items-end">
                    <NoDataInventory title="No se encontraron datos" />
                </div>
            )}
            {paginated_report.totalPag > 1 && (
                <div
                    className='mt-4'
                >
                    <Pagination
                        currentPage={paginated_report.currentPag}
                        nextPage={paginated_report.nextPag}
                        previousPage={paginated_report.prevPag}
                        totalPages={paginated_report.totalPag}
                        onPageChange={(page) => {
                            OnGetPaginatedReportBox(
                                // user?.transmitterId ?? 0,
                                page,
                                limit,
                                filter.branches,
                                filter.startDate,
                                filter.endDate,
                                // filter.typeOfInventory,
                                // filter.typeOfMoviment
                            );
                        }}
                    />
                </div>
            )}
        </DivGlobal>
    );
}

export default ListBoxes;
