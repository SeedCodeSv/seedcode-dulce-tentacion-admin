import {
  Button,
  Chip,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { CircleX, EllipsisVertical, Eye, LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";

import Pagination from "../global/Pagination";
import ResendEmail from "../reporters/ResendEmail";
import RenderViewButton from "../global/render-view-button";

import Filters from "./filterSales";
import CardListSales from "./CardListSales";
import DetailSales from "./detail-sales";

import { formatCurrency } from "@/utils/dte";
import { formatDate } from "@/utils/dates";
import { global_styles } from "@/styles/global.styles";
import { useSalesStore } from "@/store/sales.store";
import { get_sale_pdf } from "@/services/sales.service";
import { limit_options, SPACES_BUCKET } from "@/utils/constants";
import DivGlobal from "@/themes/ui/div-global";
import { TableComponent } from "@/themes/ui/table-ui";
import { s3Client } from "@/plugins/s3";
import { SaleDates } from "@/types/sales.types";
import useIsMobileOrTablet from "@/hooks/useIsMobileOrTablet";
import { get_pdf_fe_cfe } from "@/services/pdf.service";
import { useAuthStore } from "@/store/auth.store";
import { verifyApplyAnulation } from "@/utils/filters";
import TdGlobal from "@/themes/ui/td-global";
import useWindowSize from "@/hooks/useWindowSize";
import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";

function ListSales() {
  const styles = global_styles();
  const [limit, setLimit] = useState(5);
  const [dateInitial, setDateInitial] = useState(formatDate());
  const [dateEnd, setDateEnd] = useState(formatDate());
  const [branch, setBranch] = useState(0);
  const [state, setState] = useState("PROCESADO");
  const [pointOfSale, setPointOfSale] = useState("");
  const [typeVoucher, setTypeVoucher] = useState("");
  const [notes, setNotes] = useState<{ debits: number; credits: number }>({
    debits: 0,
    credits: 0,
  });
  const { windowSize } = useWindowSize();
  const [view, setView] = useState<"grid" | "list" | "table">(
    windowSize.width < 768 ? "grid" : "table"
  );
  const [unseen, setUnseen] = useState(false);
  const { user } = useAuthStore();
  const isMovil = useIsMobileOrTablet();

  const [showDetail, setShowDetail] = useState(false); 
  const [selectedSale, setSelectedSale] = useState(0)

  const {
    sales_dates,
    getSalesByDatesAndStatus,
    sales_dates_pagination,
    getNotesOfSale,
  } = useSalesStore();
  const navigation = useNavigate();

  useEffect(() => {
    getSalesByDatesAndStatus(
      1,
      limit,
      branch ?? 0,
      dateInitial,
      dateEnd,
      state,
      typeVoucher,
      pointOfSale
    );
  }, [dateInitial, dateEnd, state, limit, branch, typeVoucher, pointOfSale]);

  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfPath, setPdfPath] = useState("");
  const showFullLayout = useDisclosure();

  const handleShowPdf = (saleId: number, typeDte: string) => {
    setLoadingPdf(true);
    showFullLayout.onOpen();
    get_sale_pdf(saleId, typeDte).then((res) => {
      setPdfPath(URL.createObjectURL(res.data));
      setLoadingPdf(false);
    });
  };

  const verifyNotes = (id: number) => {
    getNotesOfSale(id).then((res) => {
      const { debits, credits } = res;

      setNotes({ debits, credits });

      return;
    });
    setNotes({ debits: 0, credits: 0 });
  };

  const downloadJSON = async (sale: SaleDates) => {
    try {
      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: SPACES_BUCKET,
          Key: sale.pathJson,
        })
      );
      const response = await axios.get(url, { responseType: "json" });

      const jsonBlob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: "application/json",
      });

      const link = document.createElement("a");

      link.href = URL.createObjectURL(jsonBlob);
      link.download = `${sale.codigoGeneracion}.json`;
      link.click();
    } catch (error) {
      toast.error("No se pudo descargar el JSON");
    }
  };

  const downloadPDF = async (sale: SaleDates): Promise<void> => {
    setLoadingPdf(true);

    try {
      const res = await get_pdf_fe_cfe(sale.codigoGeneracion);
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");

      link.href = pdfUrl;
      link.download = `${sale.codigoGeneracion}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      toast.error("No se pudo descargar el PDF");
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <DivGlobal>
      <div className="flex justify-between">
        <Filters
          branch={branch}
          dateInitial={dateInitial}
          endDate={dateEnd}
          pointOfSale={pointOfSale}
          setBranch={setBranch}
          setDateInitial={setDateInitial}
          setEndDate={setDateEnd}
          setPointOfSale={setPointOfSale}
          setState={setState}
          setTypeVoucher={setTypeVoucher}
          state={state}
          typeVoucher={typeVoucher}
        />
        {windowSize.width < 768 && (
          <RenderViewButton setView={setView} view={view} />
        )}
      </div>

      <Modal
        isOpen={showDetail}
        scrollBehavior="inside"
        size="full"
        onClose={() => setShowDetail(false)}
      >
        <ModalContent>
          <ModalBody>
            <DetailSales id={selectedSale} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <div className="flex items-end justify-end mt-3">
        {windowSize.width > 768 && (
          <RenderViewButton setView={setView} view={view} />
        )}
        <div className="ml-2">
          <Select
            className="w-44"
            classNames={{
              label: "font-semibold",
            }}
            defaultSelectedKeys={["5"]}
            label="Cantidad a mostrar"
            labelPlacement="outside"
            placeholder="Selecciona la cantidad a mostrar"
            value={limit}
            variant="bordered"
            onChange={(e) => {
              setLimit(Number(e.target.value !== "" ? e.target.value : "5"));
            }}
          >
            {limit_options.map((limit) => (
              <SelectItem key={limit}>{limit}</SelectItem>
            ))}
          </Select>
        </div>
      </div>
      {view === "table" && (
        <TableComponent
          className="overflow-auto"
          headers={[
            "Nº",
            "Fecha - Hora",
            "Sucursal",
            "Número de control",
            "SubTotal",
            "IVA",
            "Estado",
            "Acciones",
          ]}
        >
          {sales_dates?.map((sale, index) => (
            <tr key={index} className="border-b border-slate-200">
              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                {sale.id}
              </td>
              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                {sale.fecEmi + " - " + sale.horEmi}
              </td>
              <TdGlobal>{sale.employee.branch.name}</TdGlobal>
              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                {sale.numeroControl}
              </td>
              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                {formatCurrency(Number(sale.montoTotalOperacion))}
              </td>
              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                {formatCurrency(Number(sale.totalIva))}
              </td>
              <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                <Chip
                  classNames={{
                    content: "text-white text-sm !font-bold px-3",
                  }}
                  color={
                    sale.salesStatus.name === "CONTINGENCIA"
                      ? "warning"
                      : sale.salesStatus.name === "PROCESADO"
                      ? "success"
                      : "danger"
                  }
                >
                  {sale.salesStatus.name}
                </Chip>
              </td>
              <td className="p-3 flex gap-5 text-sm text-slate-500 dark:text-slate-100">
                {!pdfPath && (
                  <Popover
                    classNames={{
                      content: unseen
                        ? "opacity-0 invisible pointer-events-none"
                        : "bg-white dark:bg-gray-800",
                    }}
                    showArrow={!unseen}
                    onOpenChange={(isOpen) => {
                      if (isOpen && sale.tipoDte === "03") {
                        verifyNotes(sale.id);
                      }
                    }}
                  >
                    <PopoverTrigger>
                      <Button isIconOnly>
                        <EllipsisVertical size={20} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-1 ">
                      {sale.salesStatus.name === "PROCESADO" &&
                        sale.tipoDte === "03" && (
                          <Listbox
                            aria-label="Actions"
                            className="dark:text-white"
                            onAction={(key) => {
                              const routeMap: Record<string, string> = {
                                "debit-note": `/debit-note/${sale.id}`,
                                "show-debit-note": `/get-debit-note/${sale.id}`,
                                "credit-note": `/credit-note/${sale.id}`,
                                "show-credit-note": `/get-credit-note/${sale.id}`,
                              };

                              if (key in routeMap) {
                                navigation(routeMap[key]);
                              }
                            }}
                          >
                            {notes.debits > 0 ? (
                              <ListboxItem
                                key="show-debit-note"
                                classNames={{ base: "font-semibold" }}
                                color="primary"
                                variant="flat"
                              >
                                Ver notas de débito
                              </ListboxItem>
                            ) : (
                              <ListboxItem
                                key="debit-note"
                                classNames={{ base: "font-semibold" }}
                                color="danger"
                                variant="flat"
                              >
                                Nota de débito
                              </ListboxItem>
                            )}

                            {notes.credits > 0 ? (
                              <ListboxItem
                                key="show-credit-note"
                                classNames={{ base: "font-semibold" }}
                                color="primary"
                                variant="flat"
                              >
                                Ver notas de crédito
                              </ListboxItem>
                            ) : (
                              <ListboxItem
                                key="credit-note"
                                classNames={{ base: "font-semibold" }}
                                color="danger"
                                variant="flat"
                              >
                                Nota de crédito
                              </ListboxItem>
                            )}
                          </Listbox>
                        )}

                      {["PROCESADO"].includes(sale.salesStatus.name) && (
                        <Listbox
                          aria-label="Actions"
                          className="dark:text-white"
                        >
                          <ListboxItem
                            key="show-pdf"
                            classNames={{ base: "font-semibold" }}
                            color="danger"
                            variant="flat"
                            onPress={() => {
                              isMovil
                                ? downloadPDF(sale)
                                : handleShowPdf(sale.id, sale.tipoDte);
                            }}
                          >
                            Ver comprobante
                          </ListboxItem>
                          <ListboxItem
                            key="download-json"
                            classNames={{ base: "font-semibold" }}
                            color="danger"
                            variant="flat"
                            onPress={() => downloadJSON(sale)}
                          >
                            Descargar JSON
                          </ListboxItem>
                          <ListboxItem
                            key="resend-email"
                            onPress={() => setUnseen(true)}
                          >
                            <ResendEmail
                              customerId={sale.customerId}
                              id={user!.transmitterId}
                              path={sale.pathJson}
                              tipoDte={sale.tipoDte}
                              onClose={() => {
                                setUnseen(false);
                              }}
                            />
                          </ListboxItem>
                          <ListboxItem
                            key="annulation"
                            onPress={() => {
                              const value = verifyApplyAnulation(
                                sale.tipoDte,
                                sale.fecEmi
                              );

                              if (value && sale.tipoDte === "03") {
                                navigation("/annulation/03/" + sale.id);
                              }

                              if (value && sale.tipoDte === "01") {
                                navigation("/annulation/01/" + sale.id);
                              }
                            }}
                          >
                            Invalidar
                          </ListboxItem>
                        </Listbox>
                      )}

                      {sale.salesStatus.name === "INVALIDADO" && (
                        <Listbox
                          aria-label="Actions"
                          className="dark:text-white"
                        >
                          <ListboxItem
                            key="invalid"
                            classNames={{ base: "font-semibold" }}
                            color="danger"
                            variant="flat"
                          >
                            <CircleX size={20} />
                          </ListboxItem>
                        </Listbox>
                      )}
                    </PopoverContent>
                  </Popover>
                )}
                <ButtonUi isIconOnly theme={Colors.Warning} onPress={() => {
                  setSelectedSale(sale.id);
                  setShowDetail(true);
                }}>
                  <Eye size={20} />
                </ButtonUi>
              </td>
            </tr>
          ))}
        </TableComponent>
      )}
      {view === "grid" && (
        <CardListSales
          // verifyApplyAnulation={verifyApplyAnulation}
          downloadJSON={downloadJSON}
          downloadPDF={downloadPDF}
          handleShowPdf={handleShowPdf}
          isMovil={isMovil}
          notes={notes}
          pdfPath={pdfPath}
          setUnseen={setUnseen}
          unseen={unseen}
          verifyNotes={verifyNotes}
        />
      )}

      {sales_dates_pagination.totalPag > 1 && (
        <div className="mt-5 w-full">
          <Pagination
            currentPage={sales_dates_pagination.currentPag}
            nextPage={sales_dates_pagination.prevPag}
            previousPage={sales_dates_pagination.nextPag}
            totalPages={sales_dates_pagination.totalPag}
            onPageChange={(page) => {
              getSalesByDatesAndStatus(
                page,
                limit,
                branch,
                dateInitial,
                dateEnd,
                state,
                typeVoucher,
                pointOfSale
              );
            }}
          />
        </div>
      )}
      {loadingPdf && (
        <div className="absolute z-[100] w-screen h-screen inset-0 bg-gray-50 dark:bg-gray-700">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <LoaderCircle className="animate-spin" size={100} />
            <p className="mt-4 text-lg font-semibold">Cargando...</p>
          </div>
        </div>
      )}
      {pdfPath && (
        <div className="absolute z-[100] w-screen h-screen inset-0 bg-gray-50 dark:bg-gray-700">
          <Button
            isIconOnly
            className="fixed bg-red-600 bottom-10 left-10"
            style={styles.dangerStyles}
            onPress={() => {
              setPdfPath("");
            }}
          >
            <X />
          </Button>
          {loadingPdf ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <LoaderCircle className="animate-spin" size={100} />
              <p className="mt-4 text-lg font-semibold">Cargando...</p>
            </div>
          ) : (
            <>
              {pdfPath !== "" ? (
                <div className="w-full h-full">
                  <iframe
                    className="w-screen h-screen z-[2000]"
                    src={pdfPath}
                    title="pdf"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <p>No hay información acerca de este PDF</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </DivGlobal>
  );
}
export default ListSales;
