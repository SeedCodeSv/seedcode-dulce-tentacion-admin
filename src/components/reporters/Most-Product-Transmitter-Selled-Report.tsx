import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { salesReportStore } from "../../store/reports/sales_report.store"
import { useEffect } from "react"
import { useAuthStore } from "../../store/auth.store"


const MostProductTransmitterSelled = () => {

    const { getProductMostSelledTable } = salesReportStore()
    const { user } = useAuthStore();
    useEffect(() => {
        getProductMostSelledTable(user?.employee.branch.transmitterId ?? 0)
    }, [])



    return (
        <>
            <div className="col-span-3 bg-gray-100 p-5 dark:bg-gray-900 rounded-lg">
                <p className="pb-4 text-lg font-semibold dark:text-white">Producto mas vendido</p>
                <DataTable
                    className="w-full shadow"
                    emptyMessage="No se encontraron resultados"
                    // value={sales_table_day}
                    tableStyle={{ minWidth: '50rem' }}
                    scrollable
                    scrollHeight="30rem"
                >
                    <Column
                        headerClassName="text-sm font-semibold"
                        // headerStyle={{ ...style, borderTopLeftRadius: '10px' }}
                        field="numeroControl"
                        header="Numero de control"
                    />
                    <Column
                        headerClassName="text-sm font-semibold"
                        // headerStyle={style}
                        field="box.branch.name"
                        header="Sucursal"
                    />
                    <Column
                        headerClassName="text-sm font-semibold"
                        // headerStyle={style}
                        field="totalDescu"
                        header="Descuento"
                    // body={(rowData) => formatCurrency(Number(rowData.totalDescu))}
                    />
                    <Column
                        headerClassName="text-sm font-semibold"
                        // headerStyle={style}
                        field="montoTotalOperacion"
                        header="Total"
                    // body={(rowData) => formatCurrency(Number(rowData.montoTotalOperacion))}
                    />
                </DataTable>
            </div>
        </>
    )
}

export default MostProductTransmitterSelled