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
import { return_branch_id } from "../../storage/localStorage"


const MostProductTransmitterSelled = () => {
    const { theme } = useContext(ThemeContext);
    const style = {
        backgroundColor: theme.colors.dark,
        color: theme.colors.primary,
    };
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { getProductMostSelledTable, products_most_selled } = salesReportStore()
    const { user } = useAuthStore();
    const [branchId, setBranchId] = useState(0);
    const { branch_list, getBranchesList } = useBranchesStore();

    useEffect(() => {
        return_branch_id()
        getBranchesList();
        getProductMostSelledTable(user?.employee.branch.transmitterId ?? 0, startDate, endDate, branchId)
    }, [startDate, endDate, branchId])

    return (
        <>
            <div className="w-full h-full p-28 bg-gray-50 dark:bg-gray-800">
                <p className="pb-4 text-xl font-semibold dark:text-white">Producto mas vendido</p>
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
                                <AutocompleteItem onClick={() => setBranchId(branch.id)} className="dark:text-white" key={branch.id} value={branch.id}>
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
                    <Column
                        headerClassName="text-sm font-semibold"
                        headerStyle={style}
                        field="branchProduct.product.name"
                        header="Producto"
                    />
                    <Column
                        headerClassName="text-sm font-semibold"
                        headerStyle={style}
                        field="branchProduct.product.price"
                        header="Precio"
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
                        field="total"
                        header="Total"
                        body={(rowData) => formatCurrency(Number(rowData.total))}
                    />
                </DataTable>
            </div>
        </>
    )
}

export default MostProductTransmitterSelled