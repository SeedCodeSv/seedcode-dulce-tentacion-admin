import { Card, CardBody, CardHeader, Input, Modal, ModalBody, ModalContent, ModalHeader, Select, SelectItem, useDisclosure } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import SummaryCutExportExcell from "./SummaryCutExportExecll";
import SummaryCutExportPdf from "./SummaryCutExportPdf";
import SummaryCutReportTable from "./SummaryCutReportTable";

// import RenderViewButton from "@/components/global/render-view-button";
import { ResponsiveFilterWrapper } from "@/components/global/ResposiveFilters";
// import useIsMobileOrTablet from "@/hooks/useIsMobileOrTablet";
import { useBranchesStore } from "@/store/branches.store";
import { useCutReportStore } from "@/store/reports/cashCuts.store";
import { useTransmitterStore } from "@/store/transmitter.store";
import { limit_options } from "@/utils/constants";
import Pagination from "@/components/global/Pagination";
import useWindowSize from "@/hooks/useWindowSize";
import RenderViewButton from "@/components/global/render-view-button";
import LoadingTable from "@/components/global/LoadingTable";
import EmptyTable from "@/components/global/EmptyTable";
import { formatCurrency } from "@/utils/dte";
import { formatDate, formatDateSimple } from "@/utils/dates";
import { Branches } from "@/types/branches.types";
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";
import { Printer } from "lucide-react";



export default function GeneralCashCutReportComponent() {
    const { onGetCashCutReportSummary, cashCutsSummary } = useCutReportStore()
    const { getBranchesList, branch_list } = useBranchesStore();
    const [branchName, setBranchName] = useState<string[]>([]);
    const { transmitter, gettransmitter } = useTransmitterStore();
    const { windowSize } = useWindowSize()
    const [view, setView] = useState<'grid' | 'table' | 'list'>(
        windowSize.width < 768 ? 'grid' : 'table'
    )
    const currentDate = new Date();
    const defaultStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const [search, setSearch] = useState({
        page: 1,
        limit: 20,
        branchIds: [] as number[],
        dateFrom: defaultStartDate.toISOString().split('T')[0],
        dateTo: currentDate.toISOString().split('T')[0],
    });

    useEffect(() => {
        gettransmitter()
        getBranchesList()
        onGetCashCutReportSummary(search)
    }, [])

    useEffect(() => {
        onGetCashCutReportSummary(search)
    }, [search.limit])

    const changePage = (page: number) => {
        onGetCashCutReportSummary({ ...search, page });
    };

    const options_limit = [
        { label: 'Todos', value: cashCutsSummary.total },
        ...limit_options.map((option) => ({ label: option, value: option })),
    ];

    const branchesOptions = [
        { label: 'Todos', value: 'all' },
        ...branch_list.map((option) => ({
            label: option.name,
            value: String(option.id),
        })),
    ];

    const { onGetCuts, dataBoxes } = useCutReportStore();
    const [initialDate, setInitialDate] = useState(formatDate())

    useEffect(() => {
        getBranchesList();
        gettransmitter();
    }, []);

    const printCutZ = () => {
        if (!selectedBranch) {
            toast.warning("Debes seleccionar una sucursal")

            return
        }

        const iframe = document.createElement('iframe');

        iframe.style.height = '0';
        iframe.style.visibility = 'hidden';
        iframe.style.width = '0';
        iframe.setAttribute('srcdoc', '<html><body></body></html>');
        document.body.appendChild(iframe);
        iframe.contentWindow?.addEventListener('afterprint', () => {
            iframe.parentNode?.removeChild(iframe);
        });
        iframe.addEventListener('load', () => {
            const body = iframe.contentDocument?.body;

            if (!body) return;
            // Añadir estilos para ocultar encabezados y pies de página
            const style = document.createElement('style');

            style.innerHTML = `
          @page {
              margin: 0;
          }
          body {
              -webkit-print-color-adjust: exact;
              margin: 0;
          }
           

      `;
            iframe.contentDocument?.head.appendChild(style);
            body.style.textAlign = 'center';
            body.style.fontFamily = 'Arial, sans-serif';
            body.style.textAlign = 'center';
            const otherParent = document.createElement('div');

            otherParent.style.display = 'flex';
            otherParent.style.justifyContent = 'center';
            otherParent.style.alignItems = 'center';
            otherParent.style.width = '200%';
            otherParent.style.height = '200%';
            otherParent.style.padding = '5px';

            body.appendChild(otherParent);
            body.style.fontFamily = 'Arial, sans-serif';
            // const date = now.toLocaleDateString();
            // const time = now.toLocaleTimeString();
            // const Am = now.getHours() < 12 ? 'AM' : 'PM';
            const customContent = ` 
            
<div style="width: 300px; font-size: 11px; padding: 8px; margin: 0 auto; font-family: monospace;">
  <hr style="border-top: 1px dashed #000; margin: 4px 0;" />
  <hr style="border-top: 1px dashed #000; margin: 4px 0;" />
  <p style="text-align: center; margin: 4px 0;">REPORTE Z</p>
  <hr style="border-top: 1px dashed #000; margin: 4px 0;" />
  <hr style="border-top: 1px dashed #000; margin: 4px 0;" />

  <p style="text-align: center;">DULCE TENTACION</p>
  <p style="text-align: center;">${selectedBranch?.name}</p>
  <p style="text-align: center;">${selectedBranch?.address}</p>
  <p style="text-align: center;">INFORME DE CAJERO: ${dataBoxes[indexCut]?.cut?.employee.firstName + " " +
                dataBoxes[indexCut]?.cut?.employee.secondName + " " +
                dataBoxes[indexCut]?.cut?.employee.firstLastName + " " +
                dataBoxes[indexCut]?.cut?.employee.secondLastName}</p>
  <p style="text-align: center; margin-bottom: 10px;">FECHA: ${dataBoxes[indexCut]?.cut?.date} ${dataBoxes[indexCut]?.cut?.time}</p>

  <hr style="border-top: 1px dashed #000; margin: 4px 0;" />
  <hr style="border-top: 1px dashed #000; margin: 4px 0;" />
  <p style="text-align: center;">FORMAS DE PAGO</p>
  <hr style="border-top: 1px dashed #000; margin: 4px 0;" />

  <p style="display: flex; justify-content: space-between;">TOTAL EFECTIVO: <span>${formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalCash))}</span></p>
  <p style="display: flex; justify-content: space-between;">TOTAL TARJETA: <span>${formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalCard))}</span></p>
  <p style="display: flex; justify-content: space-between;">TOTAL OTRO: <span>${formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalOthers))}</span></p>
  <hr style="border-top: 1px dashed #000; margin: 4px 0;" />
  <p style="display: flex; justify-content: space-between;">SUB-TOTAL: <span>${formatCurrency(
                    Number(dataBoxes[indexCut]?.subTotal01) +
                    Number(dataBoxes[indexCut]?.subTotal03)
                )}</span></p>

  <hr style="border-top: 1px dashed #000; margin: 4px 0;" />
  <hr style="border-top: 1px dashed #000; margin: 4px 0;" />
  <p style="text-align: center;">DETALLE DE VENTAS</p>
  <hr style="border-top: 1px dashed #000; margin: 4px 0;" />

  <p style="text-align: center;">VENTAS CON FACTURAS</p>
  <p>N. INICIAL: ${dataBoxes[indexCut]?.cut?.initialF}</p>
  <p>N. FINAL: ${dataBoxes[indexCut]?.cut?.finalF}</p>
  <p style="display: flex; justify-content: space-between;">GRAVADAS: <span>${formatCurrency(
                    Number(dataBoxes[indexCut]?.cut?.totalCash) +
                    Number(dataBoxes[indexCut]?.cut?.totalCard) +
                    Number(dataBoxes[indexCut]?.cut?.totalOthers)
                )}</span></p>
  <p style="display: flex; justify-content: space-between;">EXENTAS: <span>${formatCurrency(dataBoxes[indexCut]?.totalExentos01)}</span></p>
  <p style="display: flex; justify-content: space-between;">NO SUJETAS: <span>${formatCurrency(dataBoxes[indexCut]?.totalNoSuj01)}</span></p>
  <p style="display: flex; justify-content: space-between;">TOTAL: <span>${formatCurrency(
                    Number(dataBoxes[indexCut]?.cut?.totalCash) +
                    Number(dataBoxes[indexCut]?.cut?.totalCard) +
                    Number(dataBoxes[indexCut]?.cut?.totalOthers)
                )}</span></p>

  <p style="text-align: center;">INVALIDACIONES DE FACTURA</p>
  <p style="display: flex; justify-content: space-between;">GRAVADAS: <span>${formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalInvF))}</span></p>
  ${dataBoxes[indexCut]?.cut?.ivaInvF ? `
    <p style="display: flex; justify-content: space-between;">IVA: <span>${formatCurrency(Number(dataBoxes[indexCut]?.cut?.ivaInvF))}</span></p>` : ''
                }
  <p style="display: flex; justify-content: space-between;">EXENTAS: <span>${formatCurrency(0)}</span></p>
  <p style="display: flex; justify-content: space-between;">NO SUJETAS: <span>${formatCurrency(0)}</span></p>
  <p style="display: flex; justify-content: space-between;">TOTAL: <span>${formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalInvF))}</span></p>

  <p style="text-align: center;">VENTAS CON CRÉDITO FISCAL</p>
  <p>N. INICIAL: ${dataBoxes[indexCut]?.cut?.initialCF}</p>
  <p>N. FINAL: ${dataBoxes[indexCut]?.cut?.finalCF}</p>
  <p style="display: flex; justify-content: space-between;">GRAVADAS: <span>${formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalCF))}</span></p>
  ${dataBoxes[indexCut]?.cut?.ivaInvCF ? `
    <p style="display: flex; justify-content: space-between;">IVA: <span>${formatCurrency(Number(dataBoxes[indexCut]?.cut?.ivaInvCF))}</span></p>` : ''
                }
  <p style="display: flex; justify-content: space-between;">EXENTAS: <span>${formatCurrency(dataBoxes[indexCut]?.totalExentos03)}</span></p>
  <p style="display: flex; justify-content: space-between;">NO SUJETAS: <span>${formatCurrency(Number(dataBoxes[indexCut]?.totalNoSuj03))}</span></p>
  <p style="display: flex; justify-content: space-between;">TOTAL: <span>${formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalCF))}</span></p>

  <p style="text-align: center;">INVALIDACIONES DE CRÉDITO FISCAL</p>
  <p style="display: flex; justify-content: space-between;">GRAVADAS: <span>${formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalInvCF))}</span></p>
  ${dataBoxes[indexCut]?.cut?.ivaInvCF ? `
    <p style="display: flex; justify-content: space-between;">IVA: <span>${formatCurrency(Number(dataBoxes[indexCut]?.cut?.ivaInvCF))}</span></p>` : ''
                }
  <p style="display: flex; justify-content: space-between;">EXENTAS: <span>${formatCurrency(0)}</span></p>
  <p style="display: flex; justify-content: space-between;">NO SUJETAS: <span>${formatCurrency(0)}</span></p>
  <p style="display: flex; justify-content: space-between;">TOTAL: <span>${formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalInvCF))}</span></p>

  <hr style="border-top: 1px dashed #000; margin: 4px 0;" />
  <p style="text-align: center;">TOTAL GENERAL</p>
  <p style="display: flex; justify-content: space-between;">MONTO INICIAL DE CAJA: <span>${formatCurrency(Number(dataBoxes[indexCut]?.box?.start))}</span></p>
  <p style="display: flex; justify-content: space-between;">GASTOS: <span>${formatCurrency(Number(dataBoxes[indexCut]?.box?.totalExpense))}</span></p>
  <p style="display: flex; justify-content: space-between;">GRAVADAS: <span>${formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalCash) +
                    Number(dataBoxes[indexCut]?.cut?.totalCard) +
                    Number(dataBoxes[indexCut]?.cut?.totalOthers))}</span></p>
  <p style="display: flex; justify-content: space-between;">EXENTAS: <span>${formatCurrency(Number(dataBoxes[indexCut]?.totalExentos01) + Number(dataBoxes[indexCut]?.totalExentos03))}</span></p>
  <p style="display: flex; justify-content: space-between;">NO SUJETAS: <span>${formatCurrency(Number(dataBoxes[indexCut]?.totalNoSuj01) + Number(dataBoxes[indexCut]?.totalNoSuj03))}</span></p>
  <p style="display: flex; justify-content: space-between;">RETENCIONES: <span>${formatCurrency(0)}</span></p>
  <p style="display: flex; justify-content: space-between;">TOTAL VENTAS: <span>${formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalCash) +
                        Number(dataBoxes[indexCut]?.cut?.totalCard) +
                        Number(dataBoxes[indexCut]?.cut?.totalOthers))}</span></p>
  <p style="display: flex; justify-content: space-between;">TOTAL FINAL: <span><strong>${formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalCash) +
                            Number(dataBoxes[indexCut]?.cut?.totalCard) +
                            Number(dataBoxes[indexCut]?.cut?.totalOthers))}</strong></span></p>
</div>


`;

            const div = document.createElement('div');

            div.innerHTML = customContent;
            body.appendChild(div);

            iframe.contentWindow?.print();
        });
    };

    const handleSearch = async () => {
        if (!selectedBranch) {
            toast.warning('Selecciona una sucursal');

            return;
        }

        onGetCuts(selectedBranch.id ?? 0, initialDate);
    };
    const [selectedBranch, setSelectedBranch] = useState<Branches>();

    const RePrinterCut = useDisclosure()
    const [indexCut, setIndexCut] = useState(0)


    const handleClose = async () => {
        RePrinterCut.onClose()
        setInitialDate(formatDate())
        setSelectedBranch(undefined)
        await onGetCuts(0, '')
        setIndexCut(0)
    }


    return (
        <>
            <Modal isOpen={RePrinterCut.isOpen} size='full' onClose={() => {
                handleClose()
            }}
            >
                <ModalContent>
                    <ModalHeader>
                        Reimprimir cortes
                    </ModalHeader>
                    <ModalBody>
                        <div className="h-screen w-full flex flex-col">
                            <div className="flex grid grid-cols-2 mb-2">
                                <div className="flex flex-row gap-2">
                                    <Select
                                        className="w-full"
                                        classNames={{
                                            label: 'font-semibold',
                                            innerWrapper: 'uppercase'
                                        }}
                                        label="Sucursales"
                                        labelPlacement="outside"
                                        placeholder="Selecciona una sucursal"
                                        // selectedKeys={ }
                                        // selectionMode="multiple"
                                        variant="bordered"
                                        onSelectionChange={(keys) => {
                                            const branch = branch_list.find(b => b.id === Number(keys!.anchorKey));

                                            setSelectedBranch(branch)
                                        }}

                                    >
                                        {branchesOptions.map(({ label, value }) => (
                                            <SelectItem key={value.toString()} className="uppercase">
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Input
                                        className="dark:text-white"
                                        classNames={{ label: 'font-semibold' }}
                                        label="Fecha inicial"
                                        labelPlacement="outside"
                                        type="date"
                                        value={initialDate}
                                        variant="bordered"
                                        onChange={(e) => {
                                            setInitialDate(e.currentTarget.value)
                                        }}
                                    />

                                </div>
                                <div className="flex flex-row gap-2 justify-center">
                                    {dataBoxes.length > 0 && (
                                        <Select
                                            className="w-52"
                                            classNames={{
                                                label: 'font-semibold',
                                                innerWrapper: 'uppercase'
                                            }}
                                            label="Corte z"
                                            labelPlacement="outside"
                                            placeholder="Selecciona un corte"
                                            selectedKeys={[indexCut?.toString()]}
                                            variant="bordered"
                                            onSelectionChange={(e) => {
                                                setIndexCut(Number(e.currentKey));
                                            }}
                                        >
                                            {dataBoxes?.map((item, index) =>
                                                item?.cut ? (
                                                    <SelectItem
                                                        key={index.toString()}
                                                        textValue={`${item.cut.date} - ${item.cut.time}`}
                                                    >
                                                        {item.cut.date} - {item.cut.time}
                                                    </SelectItem>
                                                ) : null
                                            )}
                                        </Select>
                                    )}


                                    <div className="flex flex-row gap-2 mt-6">
                                        <ButtonUi
                                            className="w-full"
                                            theme={Colors.Success}
                                            onPress={() => {
                                                handleSearch()
                                            }}
                                        >
                                            Buscar
                                        </ButtonUi>
                                        <ButtonUi
                                            className="w-full"
                                            theme={Colors.Primary}
                                            onPress={() => { printCutZ() }}
                                        >
                                            <Printer />
                                        </ButtonUi>

                                    </div>

                                </div>

                            </div>

                            <>
                                <div className="overflow-auto h-full mb-20">
                                    <div className="w-[576px] font-mono text-sm mx-auto p-4 border border-gray-300 bg-white">
                                        {/* Encabezado */}
                                        <hr className="my-2 border-t-2 border-dashed" />
                                        <hr className="my-2 border-t-2 border-dashed" />
                                        <p className="text-center text-sm mb-1">REPORTE {'Z'}</p>
                                        <hr className="my-2 border-t-2 border-dashed" />
                                        <hr className="my-2 border-t-2 border-dashed" />

                                        <p className="text-center">{'DULCE TENTACION'}</p>
                                        <p className="text-center">{selectedBranch?.name}</p>
                                        <p className="text-center">{selectedBranch?.address}</p>
                                        <p className="text-center">INFORME DE CAJERO: {
                                            dataBoxes[indexCut]?.cut?.employee.firstName + " " +
                                            dataBoxes[indexCut]?.cut?.employee.secondName + " " +
                                            dataBoxes[indexCut]?.cut?.employee.firstLastName + " " +
                                            dataBoxes[indexCut]?.cut?.employee.secondLastName
                                        }</p>
                                        <p className="text-center mb-4">FECHA: {dataBoxes[indexCut]?.cut?.date} {' '} {dataBoxes[indexCut]?.cut?.time}</p>

                                        <hr className="my-2 border-t-2 border-dashed " />
                                        <hr className="my-2 border-t-2 border-dashed" />
                                        <h2 className="text-center">FORMAS DE PAGO</h2>
                                        <hr className="my-2 border-t-2 border-dashed" />

                                        <div className="flex flex-row justify-between"><p>TOTAL EFECTIVO:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalCash))}</p> </div>
                                        {/* <p><strong>TOTAL TARJETA:</strong> {formatCurrency(0 + 0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>TOTAL TARJETA:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalCard))}</p> </div>
                                        <div className="flex flex-row justify-between"><p>TOTAL OTROS:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalOthers))}</p> </div>
                                        <hr className="my-2 border-t-2 border-dashed" />
                                        <div className="flex flex-row justify-between"><p>SUB-TOTAL:</p><p>{
                                            formatCurrency(
                                                Number(dataBoxes[indexCut]?.subTotal01) +
                                                Number(dataBoxes[indexCut]?.subTotal03)

                                            )
                                        }</p> </div>

                                        {/* <p><strong>SUB-TOTAL:</strong> {formatCurrency(0 + 0)}</p> */}

                                        <hr className="my-2 border-t-2 border-dashed" />
                                        <hr className="my-2 border-t-2 border-dashed" />
                                        <h2 className="text-center">DETALLE DE VENTAS</h2>
                                        <hr className="my-2 border-t-2 border-dashed" />

                                        {/* Sección Facturas */}
                                        <h3 className="flex justify-center mt-2">VENTAS CON FACTURAS</h3>
                                        <p>N. INICIAL: {dataBoxes[indexCut]?.cut?.initialF}</p>
                                        <p>N. FINAL: {dataBoxes[indexCut]?.cut?.finalF}</p>
                                        {/* <p>GRAVADAS: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>GRAVADAS:</p><p>{formatCurrency(
                                            Number(dataBoxes[indexCut]?.totalGravada01)
                                        )}</p> </div>

                                        {/* {isIVA && (
                                            // <p>IVA: {formatCurrency(0 - 0 / 1.13)}</p>
                                            <div className="flex flex-row justify-between"><p>IVA:</p><p>{formatCurrency(0 - 0 / 1.13)}</p> </div>

                                        )} */}
                                        {/* <p>EXENTAS: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>EXENTAS:</p><p>{formatCurrency(dataBoxes[indexCut]?.totalExentos01)}</p> </div>

                                        {/* <p>NO SUJETAS: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>NO SUJETAS:</p><p>{formatCurrency(dataBoxes[indexCut]?.totalNoSuj01)}</p> </div>

                                        {/* <p>TOTAL: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>TOTAL:</p><p>{
                                            formatCurrency(
                                                Number(dataBoxes[indexCut]?.cut?.totalF)
                                            )
                                        }</p> </div>


                                        {/* Invalidaciones Factura */}
                                        <h3 className="flex justify-center mt-2">INVALIDACIONES DE FACTURA</h3>
                                        {/* <p>GRAVADAS: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>GRAVADAS:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalInvF))}</p> </div>

                                        {dataBoxes[indexCut]?.cut?.ivaInvF && (
                                            // <p>IVA: {formatCurrency(0 - 0 / 1.13)}</p>
                                            <div className="flex flex-row justify-between"><p>IVA:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.cut?.ivaInvF))}</p> </div>

                                        )}
                                        {/* <p>EXENTAS: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>EXENTAS:</p><p>{formatCurrency(0)}</p> </div>

                                        {/* <p>NO SUJETAS: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>NO SUJETAS:</p><p>{formatCurrency(0)}</p> </div>

                                        {/* <p>TOTAL: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>TOTAL:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalInvF))}</p> </div>

                                        {/* Créditos Fiscales */}
                                        <h3 className="flex justify-center mt-4">VENTAS CON CRÉDITO FISCAL</h3>
                                        <p>N. INICIAL: {dataBoxes[indexCut]?.cut?.initialCF}</p>
                                        <p>N. FINAL: {dataBoxes[indexCut]?.cut?.finalCF}</p>
                                        {/* <p>GRAVADAS: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>GRAVADAS:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.totalGravada03))}</p> </div>

                                        {dataBoxes[indexCut]?.cut?.ivaInvCF && (
                                            // <p>IVA: {formatCurrency(0 - 0 / 1.13)}</p>
                                            <div className="flex flex-row justify-between"><p>IVA:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.cut?.ivaInvCF))}</p> </div>

                                        )}
                                        {/* <p>EXENTAS: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>EXENTAS:</p><p>{formatCurrency(dataBoxes[indexCut]?.totalExentos03)}</p> </div>

                                        {/* <p>NO SUJETAS: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>NO SUJETAS:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.totalNoSuj03))}</p> </div>

                                        {/* <p>TOTAL: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>TOTAL:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalCF))}</p> </div>

                                        {/* Invalidaciones Crédito */}
                                        <h3 className="flex justify-center mt-2">INVALIDACIONES DE CRÉDITO FISCAL</h3>
                                        {/* <p>GRAVADAS: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>GRAVADAS:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalInvCF))}</p> </div>

                                        {dataBoxes[indexCut]?.cut?.ivaInvCF && (
                                            // <p>IVA: {formatCurrency(0 - 0 / 1.13)}</p>
                                            <div className="flex flex-row justify-between"><p>IVA:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.cut?.ivaInvCF))}</p> </div>

                                        )}
                                        {/* <p>EXENTAS: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>EXENTAS:</p><p>{formatCurrency(0)}</p> </div>

                                        {/* <p>NO SUJETAS: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>NO SUJETAS:</p><p>{formatCurrency(0)}</p> </div>

                                        {/* <p>TOTAL: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>TOTAL:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalInvCF))}</p> </div>


                                        {/* Totales Finales */}
                                        <hr className="my-2 border-t-2 border-dashed" />
                                        <h2 className="text-center">TOTAL GENERAL</h2>
                                        {/* <p>MONTO INICIAL DE CAJA: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>MONTO INICIAL DE CAJA:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.box?.start))}</p> </div>

                                        {/* <p>GASTOS: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>GASTOS:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.box?.totalExpense))}</p> </div>

                                        {/* <p>GRAVADAS: {formatCurrency(totalGeneral)}</p> */}
                                        <div className="flex flex-row justify-between"><p>GRAVADAS:</p><p>{formatCurrency(
                                            Number(dataBoxes[indexCut]?.cut?.totalCash) +
                                            Number(dataBoxes[indexCut]?.cut?.totalCard) +
                                            Number(dataBoxes[indexCut]?.cut?.totalOthers)

                                        )}</p> </div>

                                        {/* <p>EXENTAS: {formatCurrency(0 + 0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>EXENTAS:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.totalExentos01) + Number(dataBoxes[indexCut]?.totalExentos03))}</p> </div>

                                        {/* <p>NO SUJETAS: {formatCurrency(0 + 0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>NO SUJETAS:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.totalNoSuj01) + Number(dataBoxes[indexCut]?.totalNoSuj03))}</p> </div>

                                        {/* <p>RETENCIONES: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>RETENCIONES:</p><p>{formatCurrency(0)}</p> </div>

                                        {/* <p>TOTAL VENTAS: {formatCurrency(totalGeneral)}</p>
                                         */}
                                        <div className="flex flex-row justify-between"><p>TOTAL VENTAS:</p><p>{
                                            formatCurrency(
                                                Number(dataBoxes[indexCut]?.cut?.totalCash) +
                                                Number(dataBoxes[indexCut]?.cut?.totalCard) +
                                                Number(dataBoxes[indexCut]?.cut?.totalOthers))
                                        }
                                        </p> </div>

                                        {/* <p className="font-bold">TOTAL FINAL: {formatCurrency(0)}</p> */}
                                        <div className="flex flex-row justify-between"><p>TOTAL FINAL:</p><p>{formatCurrency(Number(dataBoxes[indexCut]?.cut?.totalCash) +
                                            Number(dataBoxes[indexCut]?.cut?.totalCard) +
                                            Number(dataBoxes[indexCut]?.cut?.totalOthers))}</p> </div>


                                        {/* Footer */}
                                        {/* <hr className="my-2 border-t-2 border-dashed" />
                                        <p className="text-center mt-6 text-base font-bold">¡Gracias por su trabajo!</p>
                                        <p className="text-center text-sm">SeedCodeSV</p>
                                        <p className="text-center text-sm">www.seedcodesv.com</p> */}
                                    </div>


                                </div>
                            </>


                        </div>

                    </ModalBody>
                </ModalContent>
            </Modal>
            <ResponsiveFilterWrapper classButtonLg="w-1/2" onApply={() => changePage(1)}>
                <Select
                    className="w-full"
                    classNames={{
                        label: 'font-semibold',
                        innerWrapper: 'uppercase'
                    }}
                    label="Sucursales"
                    labelPlacement="outside"
                    placeholder="Selecciona una o más sucursales"
                    selectedKeys={new Set(search.branchIds.map(id => id.toString()))}
                    selectionMode="multiple"
                    variant="bordered"
                    onSelectionChange={(keys) => {
                        const selected = Array.from(keys);
                        const allIds = branch_list.map((b) => b.id);
                        const allSelected = search.branchIds.length === allIds.length;

                        if (selected.includes("all")) {
                            if (allSelected) {
                                setSearch({ ...search, branchIds: [] });
                                setBranchName([]);
                            } else {
                                setSearch({ ...search, branchIds: allIds });
                                const allNames = branch_list.map((b) => b.name);

                                setBranchName(allNames);
                            }
                        } else {
                            const ids = selected.map(Number).filter((id) => !isNaN(id));

                            setSearch({ ...search, branchIds: ids });

                            // Obtener los nombres de las sucursales seleccionadas
                            const selectedNames = branch_list
                                .filter((b) => ids.includes(b.id))
                                .map((b) => b.name);

                            setBranchName(selectedNames);
                        }

                    }}

                >
                    {branchesOptions.map(({ label, value }) => (
                        <SelectItem key={value.toString()} className="uppercase">
                            {label}
                        </SelectItem>
                    ))}
                </Select>
                <Input
                    className="dark:text-white"
                    classNames={{ label: 'font-semibold' }}
                    label="Fecha inicial"
                    labelPlacement="outside"
                    type="date"
                    value={search.dateFrom}
                    variant="bordered"
                    onChange={(e) => {
                        setSearch({ ...search, dateFrom: e.target.value });
                    }}
                />
                <Input
                    className="dark:text-white"
                    classNames={{ label: 'font-semibold' }}
                    label="Fecha final"
                    labelPlacement="outside"
                    type="date"
                    value={search.dateTo}
                    variant="bordered"
                    onChange={(e) => {
                        setSearch({ ...search, dateTo: e.target.value });
                    }}
                />
            </ResponsiveFilterWrapper>
            <div className="w-full py-2 flex gap-5 justify-between items-end">
                <div className="flex w-full items-end gap-2">
                    <Select
                        disallowEmptySelection
                        className="max-w-[20vw] lg:max-w-[10vw] dark:text-white "
                        classNames={{
                            label: 'font-semibold',
                        }}
                        defaultSelectedKeys={[search.limit.toString()]}
                        label="Mostrar"
                        labelPlacement="outside"
                        size="md"
                        value={search.limit}
                        variant="bordered"
                        onChange={(e) => {
                            setSearch({ ...search, limit: Number(e.target.value) });
                        }}
                    >
                        {options_limit.map((limit) => (
                            <SelectItem key={limit.value} className="dark:text-white">
                                {limit.label}
                            </SelectItem>
                        ))}
                    </Select>
                    {/* <RenderViewButton setView={setView} view={view} /> */}
                </div>
                <div className="flex gap-2">
                    <div className="flex gap-1">
                        <ButtonUi
                            className="w-24"
                            theme={Colors.Secondary}
                            onPress={() => RePrinterCut.onOpen()}
                        >
                            <Printer />

                        </ButtonUi>
                        <SummaryCutExportExcell branch={branchName} comercialName={transmitter.nombreComercial} params={search} />
                        <SummaryCutExportPdf branch={branchName} comercialName={transmitter.nombreComercial} params={search} />

                    </div>

                    <RenderViewButton setView={setView} view={view} />
                </div>
            </div>

            {view === 'table' && (
                <SummaryCutReportTable />

            )}

            {view === 'grid' && (
                <SummaryCutReportCard />
            )}
            {cashCutsSummary.totalPag > 1 && (
                <Pagination
                    currentPage={cashCutsSummary.currentPag}
                    nextPage={cashCutsSummary.nextPag}
                    previousPage={cashCutsSummary.prevPag}
                    totalPages={cashCutsSummary.totalPag}
                    onPageChange={(page) => changePage(page)}
                />
            )}
        </>
    )
}

const SummaryCutReportCard = () => {
    const { cashCutsSummary, loadindSummary } = useCutReportStore()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-3 h-auto p-2">
            {loadindSummary ? (
                <div className="col-span-full flex justify-center items-center">
                    <LoadingTable />
                </div>
            ) : cashCutsSummary.cash_cuts_summary.length === 0 ? (
                <div className="col-span-full flex justify-center items-center">
                    <EmptyTable />
                </div>
            ) : (
                cashCutsSummary.cash_cuts_summary.map((item, index) => (
                    <Card key={index} className="border shadow-sm">
                        <CardHeader>
                            <h3 className="text-md font-bold text-gray-800">Día: {formatDateSimple(item.date)}</h3>
                        </CardHeader>
                        <CardBody className="text-sm space-y-1 bottom-4">
                            <p><span className="font-semibold">Total Venta:</span> {formatCurrency(Number(item.sumTotalSales))}</p>
                            <p><span className="font-semibold">Total Efectivo:</span> {formatCurrency(Number(item.sumTotalCash ?? 0))}</p>
                            <p><span className="font-semibold">Total Tarjeta:</span> {formatCurrency(Number(item.sumTotalCard ?? 0))}</p>
                            <p><span className="font-semibold">Otro Tipo de Pago:</span> {formatCurrency(Number(item.sumTotalOthers ?? 0))}</p>
                            <p><span className="font-semibold">Total Entregado:</span> {formatCurrency(Number(item.sumCashDelivered ?? 0))}</p>
                            <p><span className="font-semibold">Total Gastos:</span> {formatCurrency(Number(item.sumExpenses ?? 0))}</p>
                        </CardBody>
                    </Card>
                ))
            )}
        </div>

    )
}