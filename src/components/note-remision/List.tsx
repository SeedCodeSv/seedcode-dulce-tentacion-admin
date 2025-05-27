/* eslint-disable jsx-a11y/iframe-has-title */
import { Button, Chip, Input, Select, SelectItem, useDisclosure } from '@heroui/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import Lottie from 'lottie-react';
import { PiFilePdf } from 'react-icons/pi';
import { Clipboard, ClipboardCheck, FileX2, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router';

import useGlobalStyles from '../global/global.styles';
import LoadingTable from '../global/LoadingTable';
import Pagination from '../global/Pagination';
import SmPagination from '../global/SmPagination';
import TooltipGlobal from '../global/TooltipGlobal';

import { CompleteNoteModal } from './CompleteNoteRemision';
import InvalidateNoteReferal from './Invalidate04';

import { formatDate } from '@/utils/dates';
import EMPTY from '@/assets/animations/Animation - 1724269736818.json';
import { useAuthStore } from '@/store/auth.store';
import { ReferalNote } from '@/types/referal-note.types';
import { useReferalNote } from '@/store/referal-notes';
import { get_pdf_nre } from '@/services/referal-notes.service';
import { usePermission } from '@/hooks/usePermission';
import { limit_options } from '@/utils/constants';
import { estadosV } from '@/utils/utils';
import { ThemeContext } from '@/hooks/useTheme';
import ThGlobal from '@/themes/ui/th-global';

function List() {
  const { roleActions, returnActionsByView } = usePermission();

  const actions = useMemo(() => returnActionsByView('Notas de remisión'), [roleActions]);
  const [state, setState] = useState({ label: 'TODOS', value: '' })
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [limit, setLimit] = useState(10)
  const { referalNotes, loading, onGetReferalNotes, pagination_referal_notes } = useReferalNote();
  const { user } = useAuthStore();
  const { theme, context } = useContext(ThemeContext)
  const { colors } = theme
  const navigate = useNavigate()

  const style = {
    backgroundColor: colors[context].buttons.colors.success,
    color: colors[context].buttons.textColor
  }
  const [selectedNote, setSelectedNote] = useState<ReferalNote | null>(null);
  const [items, setItems] = useState<ReferalNote | undefined>(undefined)
  const modalInvalidate = useDisclosure()
  const modalComplete = useDisclosure()

  useEffect(() => {
    onGetReferalNotes(Number(user?.transmitterId), 1, limit, startDate, endDate, state.value);
  }, [startDate, endDate, limit, state.value]);

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
          <div className="grid grid-cols-3 gap-5">
            <Input
              classNames={{ label: 'font-semibold dark:text-white', input: 'dark:text-white' }}
              label="Fecha inicial"
              labelPlacement="outside"
              type="date"
              value={startDate}
              variant="bordered"
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              classNames={{
                label: 'font-semibold dark:text-white',
                input: 'dark:text-white'
              }}
              label="Fecha final"
              labelPlacement="outside"
              type="date"
              value={endDate}
              variant="bordered"
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Select
              classNames={{
                label: 'font-semibold',
                selectorIcon: 'dark:text-white'
              }}
              label="Mostrar"
              labelPlacement="outside"
              placeholder="Mostrar"
              value={limit}
              variant="bordered"
              onChange={(e) => {
                setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
              }}
            >
              {limit_options.map((limit) => (
                <SelectItem key={limit} className="dark:text-white">
                  {limit}
                </SelectItem>
              ))}
            </Select>
            <Select
              className="w-44"
              classNames={{ label: 'text-sm font-semibold dark:text-white ' }}
              label="Mostrar por estado"
              labelPlacement="outside"
              placeholder="Selecciona un estado"
              value={state.label}
              variant="bordered"
              onChange={(value) => setState({ label: value.target.value === '' ? value.target.value : "TODOS", value: value.target.value })}
            >
              {estadosV.map((e) => (
                <SelectItem key={e.value} className="dark:text-white">
                  {e.label}
                </SelectItem>
              ))}
            </Select>
            <div />
            <Button
              isIconOnly

              style={{ ...style, justifySelf: "end" }}

              type="button"
              onClick={() => navigate('/list-referal-notes')}
            >
              <Plus />
            </Button>
          </div>
          <div className="overflow-x-auto custom-scrollbar mt-4">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  <ThGlobal
                    className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                  >
                    No.
                  </ThGlobal>
                  <ThGlobal
                    className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                  >
                    Numero control
                  </ThGlobal>
                  <ThGlobal
                    className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                  >
                    Código generación
                  </ThGlobal>
                  <ThGlobal
                    className="p-3 text-sm font-semibold text-left max-w-[200px] text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                  >
                    Empleado
                  </ThGlobal>
                  <ThGlobal
                    className="p-3 text-sm font-semibold text-left max-w-[200px] text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                  >
                    Estado
                  </ThGlobal>
                  <ThGlobal
                    className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                  >
                    Acciones
                  </ThGlobal>
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
                              {item.employee
                                ? item?.employee?.firstName + ' ' + item?.employee?.secondName
                                : 'N/A'}
                            </td>
                            <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                              <Chip
                                classNames={{
                                  content: 'text-white text-sm !font-bold px-3',
                                }}
                                color={(() => {
                                  switch (item.status.name) {
                                    case 'PROCESADO':
                                      return 'success';
                                    case 'ANULADA':
                                      return 'danger';
                                    case 'CONTINGENCIA':
                                      return 'warning';
                                    case 'PENDIENTE':
                                      return 'primary';
                                    default:
                                      return 'default';
                                  }
                                })()}
                              >
                                {item.status.name}
                              </Chip>
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
                              <TooltipGlobal text="Invalidar">
                                {item.status.name !== 'PROCESADO' ? (
                                  <Button

                                    isIconOnly
                                    style={{ backgroundColor: "gray", color: 'white' }}
                                  >
                                    <FileX2 size={25} />
                                  </Button>
                                ) : (
                                  <Button
                                    isIconOnly
                                    style={styles.dangerStyles}
                                    onPress={() => {
                                      modalInvalidate.onOpen()
                                      setItems(item)
                                    }}
                                  >
                                    <FileX2 size={25} />
                                  </Button>
                                )}

                              </TooltipGlobal>
                              {!!item.employee && item.status.name.includes('PENDIENTE') && (
                                <TooltipGlobal
                                  text={item?.isCompleted ? 'Completado' : 'Completar'}
                                >
                                  <Button
                                    isIconOnly
                                    style={
                                      !item?.isCompleted
                                        ? styles.darkStyle
                                        : { backgroundColor: '#2E8B57', color: 'white' }
                                    }
                                    onClick={() => {
                                      setSelectedNote(item)
                                      modalComplete.onOpen()
                                    }}
                                  >
                                    {!item?.isCompleted ? (
                                      <Clipboard size={25} />
                                    ) : (
                                      <ClipboardCheck size={25} />
                                    )}
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
                    onGetReferalNotes(Number(user?.transmitterId), page, 10, startDate, endDate, state.value);
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
                      endDate,
                      state.value
                    );
                  }}
                  handlePrev={() => {
                    onGetReferalNotes(
                      Number(user?.transmitterId),
                      pagination_referal_notes.prevPag,
                      10,
                      startDate,
                      endDate,
                      state.value
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
          <CompleteNoteModal
            note={selectedNote}
            reload={() => {
              onGetReferalNotes(Number(user?.branchId), 1, limit, startDate, endDate, state.value)
            }}
            visibled={modalComplete}
            onClose={() => {
              setSelectedNote(null), modalComplete.onClose()
            }}
          />
        )}
      </div>
      <InvalidateNoteReferal
        item={items}
        modalInvalidate={modalInvalidate}
        reload={() => {
          onGetReferalNotes(Number(user?.transmitterId), 1, 10, startDate, endDate, state.value)
        }}
      />
    </>
  );
}

export default List;
