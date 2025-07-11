import { Input, Autocomplete, AutocompleteItem, Chip, Popover, PopoverTrigger, Button, PopoverContent, Listbox, ListboxItem, SelectItem, Select } from "@heroui/react";
import { EllipsisVertical, X, LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import EmptyTable from "@/components/global/EmptyTable";
import LoadingTable from "@/components/global/LoadingTable";
import { ResponsiveFilterWrapper } from "@/components/global/ResposiveFilters";
import { get_sale_pdf_debit_note } from "@/services/sales.service";
import { useBranchesStore } from "@/store/branches.store";
import ButtonUi from "@/themes/ui/button-ui";
import DivGlobal from "@/themes/ui/div-global";
import { TableComponent } from "@/themes/ui/table-ui";
import TdGlobal from "@/themes/ui/td-global";
import { Colors } from "@/types/themes.types";
import { getElSalvadorDateTime } from "@/utils/dates";
import { formatCurrency } from "@/utils/dte";
import { useDebitNotes } from "@/store/notes_debit.store";
import { estadosV } from "@/utils/utils";
import useWindowSize from "@/hooks/useWindowSize";

export default function ListDebitNoteComponent() {
   const { getBranchesList, branch_list } = useBranchesStore();
   const { debit_notes_list, onGetDebitNotesPaginated, loading } = useDebitNotes()
   const [pdfPath, setPdfPath] = useState('');
   const [loadingPdf, setLoadingPdf] = useState(false);
   const navigation = useNavigate();
   const { windowSize } = useWindowSize()
   const [params, setParams] = useState(
      {
         page: 1,
         limit: 10,
         startDate: getElSalvadorDateTime().fecEmi,
         endDate: getElSalvadorDateTime().fecEmi,
         branchId: 0,
         status: ''
      }
   )

   useEffect(() => {
      getBranchesList()
      onGetDebitNotesPaginated(params)
   }, [])

   const handleSearch = () => {
      onGetDebitNotesPaginated(params)
   }

   const handleGetPDF = (saleId: number, typeDte: string) => {
      setLoadingPdf(true);
      get_sale_pdf_debit_note(saleId, typeDte).then((res) => {
         setPdfPath(URL.createObjectURL(res.data));
         setLoadingPdf(false);
      });
   };

   useEffect(() => {
      onGetDebitNotesPaginated(params)
   }, [params.status])

   return (
      <DivGlobal>
         <ResponsiveFilterWrapper onApply={handleSearch}>
            <Input
               className="dark:text-white"
               classNames={{ base: 'font-semibold' }}
               label="Fecha inicial"
               labelPlacement="outside"
               type="date"
               value={params.startDate}
               variant="bordered"
               onChange={(e) => {
                  setParams({ ...params, startDate: e.target.value });
               }}
            />
            <Input
               className="dark:text-white"
               classNames={{ base: 'font-semibold' }}
               label="Fecha final"
               labelPlacement="outside"
               type="date"
               value={params.endDate}
               variant="bordered"
               onChange={(e) => {
                  setParams({ ...params, endDate: e.target.value });
               }}
            />
            <Autocomplete
               className="font-semibold"
               label="Sucursal"
               labelPlacement="outside"
               placeholder="Selecciona la sucursal"
               variant="bordered"
            >
               {branch_list.map((item) => (
                  <AutocompleteItem
                     key={item.id}
                     onPress={() => {
                        setParams({ ...params, branchId: item.id })
                     }}
                  >
                     {item.name}
                  </AutocompleteItem>
               ))}
            </Autocomplete>
         </ResponsiveFilterWrapper>
         <Select
            className={`${windowSize.width < 768 ? 'dark:text-white py-4 w-36' : 'dark:text-white py-4 w-1/4'}`}
            classNames={{
               label: 'text-sm font-semibold dark:text-white',
            }}
            label="Mostrar por estado"
            labelPlacement="outside"
            placeholder="Selecciona un estado"
            selectedKeys={[params.status.toString()]}
            value={params.status}
            variant="bordered"
            onChange={(e) => setParams({ ...params, status: e.target.value })}
         >
            {estadosV.map((e) => (
               <SelectItem key={e.value} className="dark:text-white">
                  {e.label}
               </SelectItem>
            ))}
         </Select>
         <TableComponent
            className="overflow-auto"
            headers={['No.', 'Fecha - Hora', 'Número de control', 'Sello recibido', 'Estado', 'SubTotal', 'Acciones']}
         >
            {loading ?
               <tr>
                  <TdGlobal className='p-6' colSpan={7}>
                     <LoadingTable />
                  </TdGlobal>
               </tr> :
               debit_notes_list.debit_notes.length === 0 ?
                  <tr>
                     <TdGlobal className='p-6' colSpan={7}>
                        <EmptyTable />
                     </TdGlobal>
                  </tr>
                  : debit_notes_list.debit_notes.map((sale, index) => (
                     <tr key={index} className="border-b border-slate-200">
                        <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">{sale.id}</TdGlobal>
                        <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
                           {sale.fecEmi} - {sale.horEmi}
                        </TdGlobal>
                        <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
                           {sale.numeroControl}
                        </TdGlobal>
                        <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
                           {sale.selloRecibido}
                        </TdGlobal>
                        <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
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
                        </TdGlobal>
                        <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
                           {formatCurrency(Number(sale.montoTotalOperacion))}
                        </TdGlobal>
                        <TdGlobal className="p-3 text-sm text-slate-500 dark:text-slate-100">
                           {!pdfPath && (
                              <Popover showArrow>
                                 <PopoverTrigger>
                                    <Button isIconOnly>
                                       <EllipsisVertical size={20} />
                                    </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="p-1">
                                    <Listbox
                                       aria-label="Actions"
                                       className="dark:text-white"
                                    >
                                       <ListboxItem
                                          key="show-pdf"
                                          classNames={{ base: 'font-semibold' }}
                                          color="danger"
                                          variant="flat"
                                          onPress={handleGetPDF.bind(null, sale.id, sale.tipoDte)}
                                       >
                                          Ver comprobante
                                       </ListboxItem>
                                       <>
                                          {sale.salesStatus.name === "PROCESADO" &&
                                             <ListboxItem
                                                key="invalidate"
                                                classNames={{ base: 'font-semibold' }}
                                                color="danger"
                                                variant="flat"
                                                onPress={() => navigation('/annulation/06/' + sale.id)}
                                             >
                                                Invalidar
                                             </ListboxItem>
                                          }
                                       </>
                                    </Listbox>
                                 </PopoverContent>
                              </Popover>
                           )}
                        </TdGlobal>
                     </tr>
                  ))}
         </TableComponent>
         {pdfPath && (
            <div className="absolute z-[100] w-screen h-screen inset-0 bg-gray-50 dark:bg-gray-700">
               <ButtonUi
                  isIconOnly
                  className="fixed bg-red-600 bottom-10 left-10"
                  theme={Colors.Error}
                  onPress={() => {
                     setPdfPath('');
                  }}
               >
                  <X />
               </ButtonUi>
               {loadingPdf ? (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                     <LoaderCircle className="animate-spin" size={100} />
                     <p className="mt-4 text-lg font-semibold">Cargando...</p>
                  </div>
               ) : pdfPath !== '' ? (
                  <div className="w-full h-full">
                     <iframe className="w-screen h-screen z-[2000]" src={pdfPath} title="PDF" />
                  </div>
               ) : (
                  <div className="flex items-center justify-center w-full h-full">
                     <p>No hay información acerca de este PDF</p>
                  </div>

               )}
            </div>
         )}
      </DivGlobal>
   )
}