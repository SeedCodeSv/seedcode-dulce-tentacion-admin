// import { ThemeContext } from "@/hooks/useTheme";
import { useReportNoteSalesStore } from "@/store/report_notes_sale.store";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
// import jsPDF from "jspdf";
// import { useConfigurationStore } from "@/store/perzonalitation.store";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { s3Client } from "@/plugins/s3";
// import { GetObjectCommand } from "@aws-sdk/client-s3";
// import { SPACES_BUCKET } from "@/utils/constants";
// import axios from "axios";
// import { SVFE_ND_Firmado } from "@/types/svf_dte/nd.types";
import Layout from "@/layout/Layout";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import { Button, Chip, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { formatCurrency } from "@/utils/dte";

function NotesDebitBySale() {
    const {id} = useParams();
    const {notasDebitos, OnGetNotasDebitos} = useReportNoteSalesStore();
    // const [loadingPdf, setLoadingPdf] = useState(false);
    // const {personalization} = useConfigurationStore();
    const navigation = useNavigate();
    // const {theme} = useContext(ThemeContext);
    // const style = {
    //     backgroundColor: theme.colors.dark,
    //     color: theme.colors.primary,
    // };

    useEffect(() => {
        OnGetNotasDebitos(Number(id))
    }, [])

    // const handleGetPDF = async (json: string) => {
    //     setLoadingPdf(true);
    //     const url = await getSignedUrl(
    //         s3Client,
    //         new GetObjectCommand({
    //             Bucket: SPACES_BUCKET,
    //             Key: json,
    //         })
    //     ); 

    //     axios
    //         .get<SVFE_ND_Firmado>(url, {responseType: 'json'})
    //         .then(async ( response) => {
    //             const doc = new jsPDF();
    //             const QR = QR_URL(
    //                 response.data.identificacion.codigoGeneracion,
    //                 response.data.identificacion.fecEmi
    //             )

    //             let logoUrl = DEFA
    //         })
    // }

    return (
        <Layout title="NOTAS DE DÉBITO">
            <>
                <div className="flex flex-col p-10 overflow-x-hidden bg-gray-50 dark:bg-gray-800">
                    <div className="grid w-full grid-cols-3 gap-5">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigation(-1)}>
                        <ArrowLeft className='dark:text-white' />
                        <p className=" whitespace-nowrap dark:text-white">Regresar</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar mt-10">
                        <table className="w-full">
                        <thead className="sticky top-0 z-20 bg-white">
                            <tr>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                No.
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                Fecha - Hora
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                Número de control
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                Sello recibido
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                Estado
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                SubTotal
                            </th>
                            <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                                Acciones
                            </th>
                            </tr>
                        </thead>
                        <tbody className="max-h-[600px] w-full overflow-y-auto">
                            {notasDebitos.map((sale, index) => (
                            <tr className="border-b border-slate-200" key={index}>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{sale.id}</td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {sale.fecEmi} - {sale.horEmi}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {sale.numeroControl}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {sale.selloRecibido}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                <Chip
                                    classNames={{
                                    content: 'text-white text-sm !font-bold px-3',
                                    }}
                                    color={(() => {
                                    switch (sale.salesStatus.name) {
                                        case 'PROCESADO':
                                        return 'success';
                                        case 'ANULADA':
                                        return 'danger';
                                        case 'CONTINGENCIA':
                                        return 'warning';
                                        default:
                                        return 'default';
                                    }
                                    })()}
                                >
                                    {sale.salesStatus.name}
                                </Chip>
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                {formatCurrency(Number(sale.montoTotalOperacion))}
                                </td>
                                <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                <Popover showArrow>
                                    <PopoverTrigger>
                                    <Button isIconOnly>
                                        <EllipsisVertical size={20} />
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-1">
                                    <Listbox
                                        className="dark:text-white"
                                        aria-label="Actions"
                                        // onAction={(key) => {
                                        //   if (key === 'show-pdf') {
                                        //     handleGetPDF(sale.pathJson);
                                        //   }
                                        // }}
                                    >
                                        <ListboxItem
                                        classNames={{ base: 'font-semibold' }}
                                        variant="flat"
                                        color="danger"
                                        key="show-pdf"
                                        >
                                        Ver comprobante
                                        </ListboxItem>
                                    </Listbox>
                                    {sale.salesStatus.name === 'PROCESADO' && (
                                        <Listbox
                                        className="dark:text-white"
                                        aria-label="Actions"
                                        onAction={(key) => {
                                            if (key === 'invalidate') {
                                            navigation('/annulation/06/' + sale.id);
                                            }
                                        }}
                                        >
                                        <ListboxItem
                                            classNames={{ base: 'font-semibold' }}
                                            variant="flat"
                                            color="danger"
                                            key="invalidate"
                                        >
                                            Invalidar
                                        </ListboxItem>
                                        </Listbox>
                                    )}
                                    </PopoverContent>
                                </Popover>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
            </>
        </Layout>
    )
    

}
export default NotesDebitBySale;