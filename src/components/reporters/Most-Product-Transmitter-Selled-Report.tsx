import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { salesReportStore } from "../../store/reports/sales_report.store"
import { useContext, useEffect, useState } from "react"
import { useAuthStore } from "../../store/auth.store"
import { ThemeContext } from "../../hooks/useTheme"
import { formatCurrency } from '../../utils/dte';
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react"
import { fechaActualString } from '../../utils/dates';
import { useBranchesStore } from "../../store/branches.store"


const MostProductTransmitterSelled = () => {
    const { theme } = useContext(ThemeContext);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { getProductMostSelledTable, products_most_selled } = salesReportStore()
    const { user } = useAuthStore();
    const [branchId,] = useState(0);
    const { getSalesByTransmitter } = salesReportStore();
    const { branch_list, getBranchesList } = useBranchesStore();
    useEffect(() => {
        getBranchesList();
        getSalesByTransmitter(user?.transmitterId || 0, fechaActualString, fechaActualString)
        getProductMostSelledTable(user?.employee.branch.transmitterId ?? 0, fechaActualString, fechaActualString)
    }, [startDate, endDate, branchId])
    const style = {
        backgroundColor: theme.colors.dark,
        color: theme.colors.primary,
    };
    return (
        <>

            <div className="col-span-3 bg-gray-100 p-5 dark:bg-gray-900 rounded-lg">
                <p className="pb-4 text-lg font-semibold dark:text-white">Producto mas vendido</p>
                <div className="grid grid-cols-2 gap-2 py-2">
                    <label className="text-sm font-semibold dark:text-white">Fecha inicial</label>
                    <label className="text-sm font-semibold dark:text-white">Fecha final</label>
                    <Input
                        onChange={(e) => setStartDate(e.target.value)}
                        defaultValue={fechaActualString}
                        className="w-full "
                        type="date"
                    ></Input>
                    <Input
                        onChange={(e) => setEndDate(e.target.value)}
                        defaultValue={fechaActualString}
                        className="w-full "
                        type="date"
                    ></Input>

                    <div className="">
                        <Autocomplete placeholder="Selecciona la sucursal">
                            {branch_list.map((branch) => (
                                <AutocompleteItem className="dark:text-white" key={branch.id} value={branch.id}>
                                    {branch.name}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>
                </div>
                <DataTable
                    className="w-full shadow"
                    emptyMessage="No se encontraron resultados"
                    value={products_most_selled}
                    tableStyle={{ minWidth: '50rem' }}
                    scrollable
                    scrollHeight="30rem"
                >
                    {/* <Column
                        headerClassName="text-sm font-semibold"
                        headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
                        field=""
                        header="Numero de control"
                    /> */}
                    <Column
                        headerClassName="text-sm font-semibold"
                        headerStyle={style}
                        field="box.branch.name"
                        header="Sucursal"
                    />
                    <Column
                        headerClassName="text-sm font-semibold"
                        headerStyle={style}
                        field="quantity"
                        header="Cantidad"
                        body={(rowData) => formatCurrency(Number(rowData.quantity))}
                    />
                    <Column
                        headerStyle={style}
                        field="montoTotalOperacion"
                        header="Total"
                        body={(rowData) => formatCurrency(Number(rowData.Total))}
                    />
                </DataTable>
            </div>
        </>
    )
}

export default MostProductTransmitterSelled