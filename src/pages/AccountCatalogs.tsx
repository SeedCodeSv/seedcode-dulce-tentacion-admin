import useGlobalStyles from "@/components/global/global.styles"
import Layout from "@/layout/Layout"
import { useAccountCatalogsStore } from "@/store/accountCatalogs.store"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import NO_DATA from '../assets/no.png'
import Pagination from "@/components/global/Pagination"
import SmPagination from "@/components/global/SmPagination"
import { Select, SelectItem } from "@nextui-org/react"
import { limit_options } from "@/utils/constants"
import AddButton from "@/components/global/AddButton"

function AddAccountCatalogs() {
    const [limit, setLimit] = useState(5);
    const { getAccountCatalogs, account_catalog_pagination, loading } = useAccountCatalogsStore()
    useEffect(() => {
        getAccountCatalogs(1, limit)
    }, [limit])

    const navigate = useNavigate();
    const styles = useGlobalStyles()
    return (
        <Layout title="Catalogos de Cuentas">
            <>
                <div className="w-full h-full flex flex-col overflow-y-auto p-5 bg-white dark:bg-gray-800">
                    <div className="w-full flex pb-5 mt-10">
                        <Link to="/" className=" dark:text-white flex">
                            <ArrowLeft /> Regresar
                        </Link>

                        {/* <AddButton
                            onClick={() => {
                                navigate('/add-account-catalog');
                            }}
                        /> */}
                    </div>
                    <div className="w-full mt-2">
                        <div className="w-full flex justify-between gap-5">
                            <div className="w-44">
                                <label className="font-semibold dark:text-white text-sm">Mostrar</label>
                                <Select
                                    className="w-44 dark:text-white border border-white rounded-xl"
                                    variant="bordered"
                                    defaultSelectedKeys={['5']}
                                    labelPlacement="outside"
                                    classNames={{
                                        label: 'font-semibold',
                                    }}
                                    value={limit}
                                    onChange={(e) => {
                                        setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                                    }}
                                >
                                    {limit_options.map((option) => (
                                        <SelectItem key={option} value={option} className="dark:text-white">
                                            {option}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="w-full max-h-[500px] lg:max-h-[600px] xl:max-h-[700px] 2xl:max-h-[800px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
                            {loading ? (
                                <div className="w-full flex justify-center p-20 items-center flex-col">
                                    <div className="loader"></div>
                                    <p className="mt-5 dark:text-white text-gray-600 text-xl">Cargando...</p>
                                </div>
                            ) : (
                                <>
                                    {account_catalog_pagination.accountCatalogs.length > 0 ? (
                                        <>
                                            <table className="w-full">
                                                <thead className="sticky top-0 z-20 bg-white">
                                                    <tr>
                                                        <th
                                                            style={styles.darkStyle}
                                                            className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                                                        >
                                                            Id
                                                        </th>
                                                        <th
                                                            style={styles.darkStyle}
                                                            className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                                                        >
                                                            Codigo
                                                        </th>
                                                        <th
                                                            style={styles.darkStyle}
                                                            className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                                                        >
                                                            Nombre
                                                        </th>
                                                        <th
                                                            style={styles.darkStyle}
                                                            className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                                                        >
                                                            Cuenta Mayor
                                                        </th>
                                                        <th
                                                            style={styles.darkStyle}
                                                            className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                                                        >
                                                            Nivel de cuenta
                                                        </th>
                                                        <th
                                                            style={styles.darkStyle}
                                                            className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                                                        >
                                                            Tipo de Cuenta
                                                        </th>
                                                        {/* <th
                                                            style={styles.darkStyle}
                                                            className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                                                        >
                                                            Sub Cuenta
                                                        </th> */}
                                                        <th
                                                            style={styles.darkStyle}
                                                            className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                                                        >
                                                            Item
                                                        </th>
                                                        <th
                                                            style={styles.darkStyle}
                                                            className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                                                        >
                                                            Acciones
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {account_catalog_pagination.accountCatalogs.map((shop, index) => (
                                                        <tr key={index} className="border-b border-slate-200">

                                                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                                {shop.id}
                                                            </td>
                                                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                                {shop.code}
                                                            </td>
                                                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                                {shop.name}
                                                            </td>
                                                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                                {shop.majorAccount}
                                                            </td>
                                                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                                {shop.accountLevel}
                                                            </td>
                                                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                                {shop.accountType}
                                                            </td>
                                                            {/* <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                                {shop.subAccount}
                                                            </td> */}

                                                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                                {shop.item}
                                                            </td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {account_catalog_pagination.totalPag > 1 && (
                                                <>
                                                    <div className="hidden w-full mt-5 md:flex">
                                                        <Pagination
                                                            previousPage={account_catalog_pagination.prevPag}
                                                            nextPage={account_catalog_pagination.nextPag}
                                                            currentPage={account_catalog_pagination.currentPag}
                                                            totalPages={account_catalog_pagination.totalPag}
                                                            onPageChange={(page) => {
                                                                getAccountCatalogs(
                                                                    page,
                                                                    limit,
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-lg p-3">
                                                        <SmPagination
                                                            handleNext={() => {
                                                                getAccountCatalogs(
                                                                    account_catalog_pagination.nextPag,
                                                                    limit,
                                                                );
                                                            }}
                                                            handlePrev={() => {
                                                                getAccountCatalogs(
                                                                    account_catalog_pagination.prevPag,
                                                                    limit,

                                                                );
                                                            }}
                                                            currentPage={account_catalog_pagination.currentPag}
                                                            totalPages={account_catalog_pagination.totalPag}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-full h-full flex dark:bg-gray-600 p-10 flex-col justify-center items-center">
                                                <img className="w-44 mt-10" src={NO_DATA} alt="" />
                                                <p className="mt-5 dark:text-white text-gray-600 text-xl">
                                                    No se encontraron resultados
                                                </p>
                                            </div>
                                        </>
                                    )}



                                </>
                            )}
                        </div>





                    </div>

                </div>
            </>
        </Layout>
    )
}

export default AddAccountCatalogs