import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { salesReportStore } from "../../store/reports/sales_report.store"
import { useContext, useEffect, useState } from "react"
import { useAuthStore } from "../../store/auth.store"
import { ThemeContext } from "../../hooks/useTheme"
import { formatCurrency } from '../../utils/dte';



const MostProductTransmitterSelled = () => {
    const { theme } = useContext(ThemeContext);
    const [fechaInicio,] = useState("");
    const [fechaFin,] = useState("");
    const { getProductMostSelledTable, products_most_selled } = salesReportStore()
    const { user } = useAuthStore();
    useEffect(() => {
        getProductMostSelledTable(user?.employee.branch.transmitterId ?? 0, fechaInicio, fechaFin)
    }, [fechaInicio, fechaFin])
    const style = {
        backgroundColor: theme.colors.dark,
        color: theme.colors.primary,
    };
    return (
        <>

            <div className="col-span-3 bg-gray-100 p-5 dark:bg-gray-900 rounded-lg">
                <p className="pb-4 text-lg font-semibold dark:text-white">Producto mas vendido</p>
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
                        body={(rowData) => formatCurrency(Number(rowData.montoTotalOperacion))}
                    />
                </DataTable>
            </div>
        </>
    )
}

export default MostProductTransmitterSelled