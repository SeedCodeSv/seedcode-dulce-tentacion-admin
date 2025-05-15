/* eslint-disable jsx-a11y/iframe-has-title */
import { Button, Input, useDisclosure } from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import Lottie from 'lottie-react';
import { PiFilePdf } from 'react-icons/pi';
import { ClipboardCheck, X } from 'lucide-react';

import useGlobalStyles from '../global/global.styles';
import LoadingTable from '../global/LoadingTable';
import Pagination from '../global/Pagination';
import SmPagination from '../global/SmPagination';
import TooltipGlobal from '../global/TooltipGlobal';

import { CompleteNoteModal } from './CompleteNoteRemision';

import { formatDate } from '@/utils/dates';
import EMPTY from '@/assets/animations/Animation - 1724269736818.json';
import { useAuthStore } from '@/store/auth.store';
import { ReferalNote } from '@/types/referal-note.types';
import { useReferalNote } from '@/store/referal-notes';
import { get_pdf_nre } from '@/services/referal-notes.service';
import { usePermission } from '@/hooks/usePermission';

function List() {
  const { roleActions, returnActionsByView } = usePermission();

  const actions = useMemo(() => returnActionsByView('Notas de remisión'), [roleActions]);

  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());

  const { referalNotes, loading, onGetReferalNotes, pagination_referal_notes } = useReferalNote();
  const { user } = useAuthStore();

  const [selectedNote, setSelectedNote] = useState<ReferalNote | null>(null);

  useEffect(() => {
    onGetReferalNotes(Number(user?.transmitterId), 1, 10, startDate, endDate);
  }, [startDate, endDate]);

  const styles = useGlobalStyles();

  const [pdf, setPdf] = useState('');
  const [loadingPdf, setLoadingPdf] = useState(false);

  const modalPdf = useDisclosure();

  const handleShowPdf = (code: string) => {
    setLoadingPdf(true);
    modalPdf.onOpen();
    get_pdf_nre(code)
      .then((res) => {
        setPdf(URL.createObjectURL(res.data));
        setLoadingPdf(false);
      })
      .catch(() => setLoadingPdf(false));
  };

  return (
    <>
      <div className="w-full h-full bg-gray-50 dark:bg-gray-800">
        <div className="w-full h-full p-5 flex flex-col mt-2 rounded-xl overflow-y-auto bg-white custom-scrollbar shadow border dark:border-gray-700 dark:bg-gray-900">
          <div className="grid grid-cols-2 gap-5">
            <Input
              classNames={{ label: 'font-semibold' }}
              label="Fecha inicial"
              labelPlacement="outside"
              type="date"
              value={startDate}
              variant="bordered"
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              classNames={{ label: 'font-semibold' }}
              label="Fecha final"
              labelPlacement="outside"
              type="date"
              value={endDate}
              variant="bordered"
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto custom-scrollbar mt-4">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  <th
                    className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                    style={styles.darkStyle}
                  >
                    No.
                  </th>
                  <th
                    className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                    style={styles.darkStyle}
                  >
                    Numero control
                  </th>
                  <th
                    className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                    style={styles.darkStyle}
                  >
                    Código generación
                  </th>
                  <th
                    className="p-3 text-sm font-semibold text-left max-w-[200px] text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                    style={styles.darkStyle}
                  >
                    Cliente
                  </th>
                  <th
                    className="p-3 text-sm font-semibold text-left max-w-[200px] text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                    style={styles.darkStyle}
                  >
                    Empleado
                  </th>
                  <th
                    className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                    style={styles.darkStyle}
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="max-h-[600px] w-full overflow-y-auto">
                {loading ? (
                  <tr>
                    <td className="p-3 text-sm text-center text-slate-500" colSpan={6}>
                      <LoadingTable />
                    </td>
                  </tr>
                ) : (
                  <>
                    {referalNotes.length > 0 ? (
                      <>
                        {referalNotes.map((item) => (
                          <tr key={item.id} className="border-b border-slate-200">
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {item.id}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100 ">
                              {item.numeroControl}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {item.codigoGeneracion}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {item.customer ? item?.customer?.nombre : 'N/A'}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              {item.employee
                                ? item?.employee?.firstName + ' ' + item?.employee?.secondName
                                : 'N/A'}
                            </td>
                            <td className="p-3 text-sm flex gap-5 text-slate-500 dark:text-slate-100">
                              {actions.includes('Ver comprobante') && (
                                <TooltipGlobal text="Ver comprobante">
                                  <Button
                                    isIconOnly
                                    style={styles.dangerStyles}
                                    onClick={() => handleShowPdf(item.codigoGeneracion)}
                                  >
                                    <PiFilePdf size={25} />
                                  </Button>
                                </TooltipGlobal>
                              )}

                              {!!item.employee && (
                                <TooltipGlobal text="Completar">
                                  <Button
                                    isIconOnly
                                    style={styles.thirdStyle}
                                    onClick={() => setSelectedNote(item)}
                                  >
                                    <ClipboardCheck size={25} />
                                  </Button>
                                </TooltipGlobal>
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <tr>
                        <td colSpan={6}>
                          <div className="flex flex-col justify-center items-center">
                            <Lottie animationData={EMPTY} className="w-80" />
                            <p className="text-2xl dark:text-white">No se encontraron resultados</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
          {pagination_referal_notes.totalPag > 1 && (
            <>
              <div className="hidden w-full mt-5 md:flex">
                <Pagination
                  currentPage={pagination_referal_notes.currentPag}
                  nextPage={pagination_referal_notes.nextPag}
                  previousPage={pagination_referal_notes.prevPag}
                  totalPages={pagination_referal_notes.totalPag}
                  onPageChange={(page) => {
                    onGetReferalNotes(Number(user?.transmitterId), page, 10, startDate, endDate);
                  }}
                />
              </div>
              <div className="flex w-full mt-5 md:hidden">
                <SmPagination
                  currentPage={pagination_referal_notes.currentPag}
                  handleNext={() => {
                    onGetReferalNotes(
                      Number(user?.transmitterId),
                      pagination_referal_notes.nextPag,
                      10,
                      startDate,
                      endDate
                    );
                  }}
                  handlePrev={() => {
                    onGetReferalNotes(
                      Number(user?.transmitterId),
                      pagination_referal_notes.prevPag,
                      10,
                      startDate,
                      endDate
                    );
                  }}
                  totalPages={pagination_referal_notes.totalPag}
                />
              </div>
            </>
          )}
        </div>

        {modalPdf.isOpen && (
          <div className="fixed inset-0 z-50">
            {loadingPdf ? (
              <div className="w-full h-full flex flex-col bg-white justify-center items-center">
                <div className="loader" />
                <p className="mt-5 text-xl">Cargando...</p>
              </div>
            ) : (
              <>
                <Button
                  isIconOnly
                  className="absolute bottom-6 left-6"
                  color="danger"
                  onPress={() => {
                    modalPdf.onClose();
                    setPdf('');
                  }}
                >
                  <X />
                </Button>
                <iframe className="w-full h-screen" src={pdf} />
              </>
            )}
          </div>
        )}

        {!!selectedNote && (
          <CompleteNoteModal note={selectedNote} onClose={() => setSelectedNote(null)} />
        )}
      </div>
    </>
  );
}

export default List;
