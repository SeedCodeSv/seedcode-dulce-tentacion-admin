import useGlobalStyles from "@/components/global/global.styles"
import Layout from "@/layout/Layout"
import { useAccountCatalogsStore } from "@/store/accountCatalogs.store"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import NO_DATA from '../assets/no.png'
import { Button } from "@nextui-org/react"
import AddButton from "@/components/global/AddButton"
import { PiMicrosoftExcelLogoBold } from "react-icons/pi"
import { generate_catalog_de_cuentas } from "@/components/accountCatalogs/accountCatalogs"

function AddAccountCatalogs() {
    const { getAccountCatalogs, account_catalog_pagination, loading } = useAccountCatalogsStore()
    useEffect(() => {
        getAccountCatalogs(1, 5);
    }, [])
    const exportAnnexes = async () => {
        // const month = months.find((month) => month.value === monthSelected)?.name || ""
        const blob = await generate_catalog_de_cuentas(account_catalog_pagination.accountCatalogs)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `CATALOGO_DE_CUENTAS.xlsx`
        link.click()
    }

    const navigate = useNavigate();
    const styles = useGlobalStyles()

    return (
        <Layout title="Catalogos de Cuentas">
            <>
                <div className="w-full h-full flex flex-col overflow-y-auto p-5 bg-white dark:bg-gray-800">

                    <div className="w-full mt-2">
                        <div className="w-full flex justify-between gap-5 mt-4">
                            <div className="w-44">

                                <div className="mt-6">
                                    <Button
                                        className="px-10 "
                                        endContent={<PiMicrosoftExcelLogoBold size={20} />}
                                        onClick={() => exportAnnexes()}
                                        color="secondary"
                                    >
                                        Exportar anexo
                                    </Button>
                                </div>
                            </div>
                            <div className="w-full flex justify-end pb-5 mt-6">


                                <AddButton
                                    onClick={() => {
                                        navigate('/add-account-catalog');
                                    }}
                                />
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
                                                            N
                                                        </th>
                                                        <th
                                                            style={styles.darkStyle}
                                                            className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                                                        >
                                                            Código
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
                                                            Cuenta Principal
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

                                                        <th
                                                            style={styles.darkStyle}
                                                            className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                                                        >
                                                            Elemento
                                                        </th>
                                                        <th
                                                            style={styles.darkStyle}
                                                            className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                                                        >
                                                            Cargado como
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

                                                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                                {shop.item}
                                                            </td>
                                                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                                                {shop.uploadAs}
                                                            </td>


                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
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