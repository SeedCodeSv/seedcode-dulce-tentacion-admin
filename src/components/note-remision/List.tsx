/* eslint-disable jsx-a11y/iframe-has-title */
import { Button, Checkbox, Chip, Input, Select, SelectItem, useDisclosure } from '@heroui/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import {
  PiFilePdf,
  PiFilePdfDuotone,
  PiMicrosoftExcelLogo,
  PiMicrosoftExcelLogoBold,
} from 'react-icons/pi';
import { Clipboard, ClipboardCheck, FileX2, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useHotkeys } from 'react-hotkeys-hook';
import { AiOutlineFilePdf } from 'react-icons/ai';
import axios from 'axios';

import useGlobalStyles from '../global/global.styles';
import LoadingTable from '../global/LoadingTable';
import Pagination from '../global/Pagination';
import TooltipGlobal from '../global/TooltipGlobal';
import { exportNotesReferal } from '../export-reports/ExportByNotesReferal';
import EmptyTable from '../global/EmptyTable';
import { ResponsiveFilterWrapper } from '../global/ResposiveFilters';
import RenderViewButton from '../global/render-view-button';

import { CompleteNoteModal } from './CompleteNoteRemision';
import InvalidateNoteReferal from './Invalidate04';
import DoublePdfExport from './ExportDoublePdf';
import DownloadPDFButton from './ConsolidadoNotaRemision';
import CardListNoteReferal from './CardListNoteReferal';

import { formatDate } from '@/utils/dates';
import { useAuthStore } from '@/store/auth.store';
import { ReferalNote } from '@/types/referal-note.types';
import { useReferalNote } from '@/store/referal-notes';
import { export_referal_note, get_pdf_nre } from '@/services/referal-notes.service';
import { usePermission } from '@/hooks/usePermission';
import { API_URL, limit_options } from '@/utils/constants';
import { estadosV } from '@/utils/utils';
import { ThemeContext } from '@/hooks/useTheme';
import { useBranchesStore } from '@/store/branches.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import DivGlobal from '@/themes/ui/div-global';
import { TableComponent } from '@/themes/ui/table-ui';
import { useTransmitterStore } from '@/store/transmitter.store';
import { ShippingReport } from '@/services/reports/shipping_report.service';
import { exportToExcel } from '@/pages/reports/shipping_report/exportExcel';
import { exportToPDF } from '@/pages/reports/shipping_report/exportPdf';
import useWindowSize from '@/hooks/useWindowSize';


function List() {
  const { roleActions, returnActionsByView } = usePermission();
  const { transmitter, gettransmitter } = useTransmitterStore();
  const { getBranchById, branch } = useBranchesStore();

  const actions = useMemo(() => returnActionsByView('Notas de remisión'), [roleActions]);
  const [state, setState] = useState({ label: 'TODOS', value: '' });
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [limit, setLimit] = useState(30);
  const { referalNotes, loading, onGetReferalNotes, pagination_referal_notes } = useReferalNote();
  const { user } = useAuthStore();
  const [branchId, setBranchId] = useState<number>(0);
  const { theme, context } = useContext(ThemeContext);
  const { colors } = theme;
  const navigate = useNavigate();
  const { windowSize } = useWindowSize()

  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  )
  const style = {
    backgroundColor: colors[context].buttons.colors.success,
    color: colors[context].buttons.textColor,
  };
  const [selectedNote, setSelectedNote] = useState<ReferalNote | null>(null);
  const [items, setItems] = useState<ReferalNote | undefined>(undefined);
  const modalInvalidate = useDisclosure();
  const modalComplete = useDisclosure();
  const { branch_list, getBranchesList } = useBranchesStore();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  // const [responseDate, setResponseData] = useState<[]>([]);

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };

  useEffect(() => {
    onGetReferalNotes(
      Number(user?.transmitterId),
      1,
      limit,
      startDate,
      endDate,
      state.value,
      branchId
    );
    getBranchById(branchId);
  }, [startDate, endDate, limit, state.value, branchId]);

  useEffect(() => {
    getBranchesList();
    gettransmitter();
  }, []);

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

  useHotkeys('ctrl+f2', () => navigate('/list-referal-notes'));

  const handleExportExcel = async (searchParam: string | undefined, value: number | undefined) => {
    await export_referal_note(
      Number(user?.transmitterId),
      1,
      99999999,
      searchParam ?? startDate,
      searchParam ?? endDate,
      searchParam ?? state.value,
      value ?? branchId
    )
      .then(({ data }) => {
        exportNotesReferal(data.referalNotes, startDate, endDate);
      })
      .catch(() => {
        toast.error('No se proceso la peticion');
      });
  };

  const getRaferalNoteReport = async (): Promise<ShippingReport[]> => {
    try {
      const response = await axios.post(API_URL + '/referal-note/shipping-report', {
        startDate: startDate,
        endDate: endDate,
        ids: selectedIds,
      });

      const responseData =
        typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      // setResponseData(responseData);

      return responseData.data;
    } catch (error) {
      toast.error('Errr al obtener los datos');
      throw error;
    }
  };

  const exportExcel = async () => {
    try {
      const reportData = await getRaferalNoteReport();

      if (reportData && reportData.length > 0) {
        await exportToExcel(reportData, startDate, endDate);
        toast.success('Exportado con éxito');
      } else {
        toast.error('No hay datos para exportar');
      }
    } catch (error) {
      toast.error('Error al exportar: ' + (error as Error).message);
    }
  };

  const exportPdf = async () => {
    try {
      const reportData = await getRaferalNoteReport();

      if (reportData && reportData.length > 0) {
        await exportToPDF(reportData, startDate, endDate);
        toast.success('Exportado con éxito');
      } else {
        toast.error('No hay datos para exportar');
      }
    } catch (error) {
      toast.error('Error al exportar: ' + (error as Error).message);
    }
  };

  return (
    <>
      <DivGlobal>
        <div className="flex flex-row justify-between w-full gap-5 lg:flex-col lg:gap-0">

          <ResponsiveFilterWrapper
          // onApply={() => handleSearch(undefined)}
          >
            <div className="w-full md:grid md:grid-cols-3 gap-2">
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
                  input: 'dark:text-white',
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
                  selectorIcon: 'dark:text-white',
                }}
                label="Sucursales"
                labelPlacement="outside"
                placeholder="Selecciona una sucursal"
                value={limit}
                variant="bordered"
                onChange={(e) => {
                  setBranchId(Number(e.target.value));
                }}
              >
                {branch_list.map((item) => (
                  <SelectItem key={item.id} className="dark:text-white">
                    {item.name}
                  </SelectItem>
                ))}
              </Select>

              <Select
                className="w-80"
                classNames={{ label: 'text-sm font-semibold dark:text-white ' }}
                label="Mostrar por estado"
                labelPlacement="outside"
                placeholder="Selecciona un estado"
                value={state.label}
                variant="bordered"
                onChange={(value) =>
                  setState({
                    label: value.target.value === '' ? value.target.value : 'TODOS',
                    value: value.target.value,
                  })
                }
              >
                {estadosV.map((e) => (
                  <SelectItem key={e.value} className="dark:text-white">
                    {e.label}
                  </SelectItem>
                ))}
              </Select>
              <div />
              {windowSize.width > 780 ? (
                <div className="flex flex-row ">

                  <Select
                    className="w-32"
                    classNames={{
                      label: 'font-semibold',
                      selectorIcon: 'dark:text-white',
                    }}
                    defaultSelectedKeys={[limit.toString()]}
                    label="Mostrar"
                    labelPlacement="outside"
                    placeholder="Mostrar"
                    value={limit}
                    variant="bordered"
                    onChange={(e) => {
                      setLimit(Number(e.target.value !== '' ? e.target.value : '30'));
                    }}
                  >
                    {limit_options.map((limit) => (
                      <SelectItem key={limit} className="dark:text-white">
                        {limit}
                      </SelectItem>
                    ))}
                  </Select>

                  <div className='ml-2 flex mt-6'>
                    <RenderViewButton setView={setView} view={view} />
                  </div>
                </div>
              ) : (
                <>
                  <Select
                    className="w-full"
                    classNames={{
                      label: 'font-semibold',
                      selectorIcon: 'dark:text-white',
                    }}
                    defaultSelectedKeys={[limit.toString()]}
                    label="Mostrar"
                    labelPlacement="outside"
                    placeholder="Mostrar"
                    value={limit}
                    variant="bordered"
                    onChange={(e) => {
                      setLimit(Number(e.target.value !== '' ? e.target.value : '30'));
                    }}
                  >
                    {limit_options.map((limit) => (
                      <SelectItem key={limit} className="dark:text-white">
                        {limit}
                      </SelectItem>
                    ))}
                  </Select>


                </>

              )}

            </div>
          </ResponsiveFilterWrapper>

        </div>

        <div className="flex justify-between gap-5 mt-2">

          <div className="flex gap-4 items-end grid grid-cols-2">
            {actions?.includes('Exportar Excel') && (
              <>
                <ButtonUi
                  startContent={<PiMicrosoftExcelLogo className="" size={25} />}
                  theme={Colors.Success}
                  onPress={() => {
                    exportExcel();
                  }}
                >
                  Exportar a excel
                </ButtonUi>
              </>
            )}
            <ButtonUi
              startContent={<PiFilePdfDuotone className="" size={25} />}
              theme={Colors.Error}
              onPress={() => {
                exportPdf();
              }}
            >
              Exportar a pdf
            </ButtonUi>
            {windowSize.width < 780 && (
              <div className="flex gap-4 items-end">
                {actions?.includes('Exportar Excel') && (
                  <>
                    {referalNotes?.length > 0 ? (
                      <ButtonUi
                        className="mt-4 font-semibold w-full"
                        color="success"
                        theme={Colors.Success}
                        onPress={() => {
                          handleExportExcel(undefined, undefined);
                        }}
                      >
                        {/* <p>Exportar Excel</p>{' '} */}
                        <PiMicrosoftExcelLogoBold color={'text-color'} size={24} />
                      </ButtonUi>
                    ) : (
                      <ButtonUi
                        className="mt-4 opacity-70 font-semibold flex-row gap-10 w-full"
                        color="success"
                        theme={Colors.Success}
                      >
                        {/* <p>Exportar Excel</p> */}
                        <PiMicrosoftExcelLogoBold className="text-white" size={24} />
                      </ButtonUi>
                    )}
                  </>
                )}
                {referalNotes?.length > 0 ? (
                  <DownloadPDFButton
                    branch={branch}
                    filters={{ startDate, endDate, branchId, type: state.value }}
                    transmitter={transmitter}
                  />
                ) : (
                  <ButtonUi isDisabled theme={Colors.Primary}>
                    <AiOutlineFilePdf className="" size={25} />{' '}
                    {/* <p className="font-medium hidden lg:flex"> Descargar PDF</p> */}
                  </ButtonUi>
                )}
              </div>
            )}

          </div>
          {windowSize.width < 780 && (
            <div className='top-20 absolute right-16'
            >
              <RenderViewButton setView={setView} view={view} />
            </div>
          )}

          <Button
            isIconOnly
            className='top-20 absolute right-4'
            style={{ ...style, justifySelf: 'end' }}
            type="button"
            onPress={() => navigate('/list-referal-notes')}
          >
            <Plus />
          </Button>

          {windowSize.width > 780 && (
            <div className="flex gap-4 items-end">
              {actions?.includes('Exportar Excel') && (
                <>
                  {referalNotes?.length > 0 ? (
                    <ButtonUi
                      className="mt-4 font-semibold w-48 "
                      color="success"
                      theme={Colors.Success}
                      onPress={() => {
                        handleExportExcel(undefined, undefined);
                      }}
                    >
                      <p>Exportar Excel</p>{' '}
                      <PiMicrosoftExcelLogoBold color={'text-color'} size={24} />
                    </ButtonUi>
                  ) : (
                    <ButtonUi
                      className="mt-4 opacity-70 font-semibold flex-row gap-10 w-48"
                      color="success"
                      theme={Colors.Success}
                    >
                      <p>Exportar Excel</p>
                      <PiMicrosoftExcelLogoBold className="text-white" size={24} />
                    </ButtonUi>
                  )}
                </>
              )}
              {referalNotes?.length > 0 ? (
                <DownloadPDFButton
                  branch={branch}
                  filters={{ startDate, endDate, branchId, type: state.value }}
                  transmitter={transmitter}
                />
              ) : (
                <ButtonUi isDisabled theme={Colors.Primary}>
                  <AiOutlineFilePdf className="" size={25} />{' '}
                  <p className="font-medium hidden lg:flex"> Descargar PDF</p>
                </ButtonUi>
              )}
            </div>
          )}

        </div>


        {view === 'table' && (
          <TableComponent
            className='overflow-auto'
            headers={[
              '',
              'No.',
              'Sucursal Origen',
              'Sucursal Destino',
              'Numero control',
              'Código generación',
              'Empleado',
              'Estado',
              'Acciones',
            ]}
          >
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
                          <Checkbox
                            key={item.id}
                            checked={selectedIds.includes(item.id)}
                            onValueChange={() => handleCheckboxChange(item.id)}
                          />
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{item.id}</td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100 ">
                          {item.branch?.name ?? ''}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100 ">
                          {item.receivingBranch.name}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100 ">
                          {item.numeroControl}
                        </td>
                        <td className="p-3 text-sm text-slate-500 dark:text-slate-100 ">
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
                          <DoublePdfExport note={item} transmitter={transmitter} />
                          {actions.includes('Ver comprobante') && (
                            <TooltipGlobal text="Ver comprobante">
                              <Button
                                isIconOnly
                                style={styles.dangerStyles}
                                onPress={() => handleShowPdf(item.codigoGeneracion)}
                              >
                                <PiFilePdf size={25} />
                              </Button>
                            </TooltipGlobal>
                          )}
                          {item?.status.name.includes('PROCESADO') && (
                            <TooltipGlobal text="Invalidar">
                              <Button
                                isIconOnly
                                style={styles.dangerStyles}
                                onPress={() => {
                                  modalInvalidate.onOpen();
                                  setItems(item);
                                }}
                              >
                                <FileX2 size={25} />
                              </Button>
                            </TooltipGlobal>
                          )}
                          {!!item.employee && item.status.name.includes('PENDIENTE') && (
                            <TooltipGlobal text={item?.isCompleted ? 'Completado' : 'Completar'}>
                              <Button
                                isIconOnly
                                style={
                                  !item?.isCompleted
                                    ? styles.darkStyle
                                    : { backgroundColor: '#2E8B57', color: 'white' }
                                }
                                onPress={() => {
                                  setSelectedNote(item);
                                  modalComplete.onOpen();
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
                    <td colSpan={8}>
                      <EmptyTable />
                    </td>
                  </tr>
                )}
              </>
            )}
          </TableComponent>
        )}

        {view === 'grid' && (
          <CardListNoteReferal
            actions={actions}
            handleShowPdf={handleShowPdf}
            modalComplete={modalComplete}
            modalInvalidate={modalInvalidate}
            setItems={setItems}
            setSelectedNote={setSelectedNote}
            transmitter={transmitter}
          />
        )}

        {pagination_referal_notes.totalPag > 1 && (
          <>
            <div className="w-full mt-5">
              <Pagination
                currentPage={pagination_referal_notes.currentPag}
                nextPage={pagination_referal_notes.nextPag}
                previousPage={pagination_referal_notes.prevPag}
                totalPages={pagination_referal_notes.totalPag}
                onPageChange={(page) => {
                  onGetReferalNotes(
                    Number(user?.transmitterId),
                    page,
                    limit,
                    startDate,
                    endDate,
                    state.value,
                    branchId
                  );
                }}
              />
            </div>
          </>
        )}

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
              onGetReferalNotes(
                Number(user?.branchId),
                1,
                limit,
                startDate,
                endDate,
                state.value,
                branchId
              );
            }}
            visibled={modalComplete}
            onClose={() => {
              setSelectedNote(null), modalComplete.onClose();
            }}
          />
        )}
      </DivGlobal>
      <InvalidateNoteReferal
        item={items}
        modalInvalidate={modalInvalidate}
        reload={() => {
          onGetReferalNotes(
            Number(user?.transmitterId),
            1,
            10,
            startDate,
            endDate,
            state.value,
            branchId
          );
        }}
      />
    </>
  );
}

export default List;
