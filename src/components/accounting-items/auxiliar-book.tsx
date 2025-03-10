import { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
  Selection,
} from '@heroui/react';
import { useAuthStore } from '@/store/auth.store';
import { useItemsStore } from '@/store/items.store';
import { formatDate } from '@/utils/dates';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatMoney } from '@/utils/utils';
import { formatDdMmYyyy } from '@/utils/date';
import FullPageLayout from '../global/FullOverflowLayout';
import { X } from 'lucide-react';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import Pui from '@/themes/ui/p-ui';

type UseDisclosureReturn = ReturnType<typeof useDisclosure>;

interface Props {
  disclosure: UseDisclosureReturn;
}

function AuxiliarBook({ disclosure }: Props) {
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [accounts, setAccounts] = useState<Selection>(new Set([]));
  const {
    getMajorAccounts,
    majorAccounts,
    getItemsByDailyMajorAccount,
    dailyMajorItemsAccount,
    loadingDailyMajorAccount,
    loadingMajorAccount,
  } = useItemsStore();

  useEffect(() => {
    getMajorAccounts();
  }, []);

  const { user } = useAuthStore();

  const handleGetItems = () => {
    const transId = user?.correlative
      ? user.correlative.branch.transmitter.id
      : (user?.pointOfSale?.branch.transmitter.id ?? 0);

    const accountsArray = Array.from(accounts) as string[];

    getItemsByDailyMajorAccount(transId, startDate, endDate, accountsArray);
  };

  const [pdf, setPdf] = useState('');

  const generatePDF = (type: 'show' | 'download') => {
    setLoadingPdf(true);
    const doc = new jsPDF();
    const calcSaldo = (
      typeAccount: string,
      totalDbe: number,
      totalHber: number,
      saldoAnterior: number,
      index: number,
      lastSaldo: number
    ) => {
      const saldos: Record<string, number> = {
        Activo: 0, // O1
        Pasivo: 0, // O2
        Patrimonio: 0, // O3
        'Resultado Deudoras': 0, // O4
        'Resultado Acreedoras': 0, // O5
        'Cuentas de Cierre': 0, // O6
        'Orden Deudoras': 0, // O7
        'Orden Acreedoras': 0, // O8
      };

      saldos[typeAccount] = index === 0 ? saldoAnterior : lastSaldo;

      switch (typeAccount) {
        case 'Activo': // O1
          saldos[typeAccount] += totalDbe - totalHber;
          break;

        case 'Pasivo': // O2
          saldos[typeAccount] += totalHber - totalDbe;
          break;

        case 'Patrimonio': // O3
          saldos[typeAccount] += totalHber - totalDbe;
          break;

        case 'Resultado Deudoras': // O4 (Gastos)
          saldos[typeAccount] += totalDbe - totalHber;
          break;

        case 'Resultado Acreedoras': // O5 (Ingresos)
          saldos[typeAccount] += totalHber - totalDbe;
          break;

        case 'Cuentas de Cierre': // O6 (No afectan el saldo)
          break;

        case 'Orden Deudoras': // O7
          saldos[typeAccount] += totalDbe - totalHber;
          break;

        case 'Orden Acreedoras': // O8
          saldos[typeAccount] += totalHber - totalDbe;
          break;

        default:
          break;
      }

      return saldos[typeAccount];
    };
    for (const item of dailyMajorItemsAccount) {
      const saldoAnterior = +item.saldoAnterior;
      if (item.items.length > 0 || saldoAnterior !== 0) {
        const data = item.items.map((it) => {
          return [
            formatDdMmYyyy(it.item.date),
            it.item.noPartida,
            it.accountCatalog.code,
            it.conceptOfTheTransaction ?? it.accountCatalog.name,
            +it.should < 0 ? `(${formatMoney(-it.should)})` : formatMoney(+it.should),
            +it.see < 0 ? `(${formatMoney(-it.see)})` : formatMoney(+it.see),
          ];
        });

        const totalSee = item.items.reduce((acc, it) => acc + +it.see, 0);
        const totalShould = item.items.reduce((acc, it) => acc + +it.should, 0);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');

        let { lastAutoTable } = doc as unknown as {
          lastAutoTable: { finalY: number };
        };

        const canAddPage = lastAutoTable.finalY > 260;

        if (canAddPage) {
          doc.addPage();
        }

        autoTable(doc, {
          margin: {
            horizontal: 3,
            top: 35,
          },
          showHead: 'never',
          theme: 'plain',
          startY: canAddPage ? 30 : lastAutoTable ? lastAutoTable.finalY + 10 : 30,
          head: [['', '', '', '']],
          body: [
            [
              item.code,
              item.name,
              `Saldo Anterior $ `,
              saldoAnterior < 0 ? `(${formatMoney(saldoAnterior)})` : formatMoney(saldoAnterior),
            ],
          ],
          bodyStyles: {
            fontSize: 9,
            fontStyle: 'bold',
          },
          columnStyles: {
            0: { cellWidth: 30, font: 'helvetica', fontStyle: 'bold' },
            1: { cellWidth: 105 },
            2: { cellWidth: 30 },
            3: { cellWidth: 35, halign: 'right' },
          },
        });

        lastAutoTable = (
          doc as unknown as {
            lastAutoTable: { finalY: number };
          }
        ).lastAutoTable;

        autoTable(doc, {
          margin: {
            horizontal: 3,
            top: 35,
          },
          showHead: 'firstPage',
          showFoot: 'lastPage',
          head: [['Fecha', 'Numero', 'Código', 'Concepto', 'Debe', 'Haber']],
          body: data,
          bodyStyles: {
            fontSize: 8,
          },
          headStyles: {
            fontSize: 9,
          },
          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 20 },
            2: { cellWidth: 28 },
            3: { cellWidth: 'auto' },
            4: { cellWidth: 38, halign: 'right' },
            5: { cellWidth: 38, halign: 'right' },
          },
          theme: 'plain',
          startY: lastAutoTable ? lastAutoTable.finalY + 2 : 5,
          didParseCell: (data) => {
            if (data.section === 'head') {
              if (data.column.index === 4 || data.column.index === 5) {
                data.cell.styles.halign = 'right';
              }
            }
          },
          didDrawCell: (data) => {
            if (data.section === 'head') {
              doc.setDrawColor(0, 0, 0);
              doc.line(1, data.cell.y - 1, doc.internal.pageSize.width - 2, data.cell.y - 1);
              doc.line(1, data.cell.y, doc.internal.pageSize.width - 2, data.cell.y);
              doc.line(
                1,
                data.cell.y + data.cell.height,
                doc.internal.pageSize.width - 2,
                data.cell.y + data.cell.height
              );
            }
          },
          didDrawPage: () => {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('MADNESS', doc.internal.pageSize.width / 2, 10, {
              align: 'center',
            });
            doc.text('Libro auxiliar', doc.internal.pageSize.width / 2, 15, {
              align: 'center',
            });

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');

            doc.text(
              'del 3 de Marzo de 2024 al 3 de Marzo de 2025',
              doc.internal.pageSize.width / 2,
              20,
              {
                align: 'center',
              }
            );
            doc.text(`VALORES EXPRESADOS EN US DOLARES`, doc.internal.pageSize.width / 2, 25, {
              align: 'center',
            });
          },
        });

        lastAutoTable = (
          doc as unknown as {
            lastAutoTable: { finalY: number };
          }
        ).lastAutoTable;

        const saldo = calcSaldo(
          item.uploadAs,
          totalShould,
          totalSee,
          saldoAnterior,
          0,
          saldoAnterior
        );

        autoTable(doc, {
          margin: {
            horizontal: 3,
            top: 35,
          },
          startY: lastAutoTable ? lastAutoTable.finalY + 2 : 5,
          theme: 'plain',
          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 20 },
            2: { cellWidth: 28 },
            3: { cellWidth: 'auto', halign: 'right' },
            4: { cellWidth: 38, halign: 'right' },
            5: { cellWidth: 38, halign: 'right' },
          },
          bodyStyles: {
            fontSize: 9,
          },
          footStyles: {
            fontSize: 9,
          },
          head: [['', '', '', '', '', '']],
          showHead: 'never',
          body: [
            [
              '',
              '',
              '',
              'Subtotal $',
              +totalShould < 0 ? `(${formatMoney(-totalShould)})` : formatMoney(totalShould),
              +totalSee < 0 ? `(${formatMoney(-totalSee)})` : formatMoney(totalSee),
            ],
          ],
          foot: [
            [
              '',
              '',
              '',
              '',
              'Saldo final $',
              +saldo < 0 ? `(${formatMoney(-saldo)})` : formatMoney(saldo),
            ],
          ],
          didParseCell: (data) => {
            if (data.section === 'foot') {
              if (data.column.index === 4 || data.column.index === 5) {
                data.cell.styles.halign = 'right';
              }
            }
          },
          didDrawCell: (data) => {
            if (data.section === 'body') {
              if (data.row.index === 0) {
                doc.setDrawColor(0, 0, 0);
                doc.line(110, data.cell.y, doc.internal.pageSize.width - 2, data.cell.y);
              }
            }
            if (data.section === 'foot') {
              doc.setDrawColor(0, 0, 0);
              doc.line(110, data.cell.y, doc.internal.pageSize.width - 2, data.cell.y);
              doc.line(110, data.cell.y - 1, doc.internal.pageSize.width - 2, data.cell.y - 1);
              doc.line(
                170,
                data.cell.y + data.cell.height - 1,
                doc.internal.pageSize.width - 2,
                data.cell.y + data.cell.height - 1
              );
              doc.line(
                170,
                data.cell.y + data.cell.height,
                doc.internal.pageSize.width - 2,
                data.cell.y + data.cell.height
              );
            }
          },
        });
      }
    }

    if (type === 'download') {
      doc.save('libro-diario-mayor.pdf');
      return;
    }

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    setLoadingPdf(false);
    setPdf(url);
  };
  const handleShowPreview = () => {
    generatePDF('show');
    previewModal.onOpenChange();
  };

  const previewModal = useDisclosure();

  return (
    <>
      <FullPageLayout show={previewModal.isOpen}>
        <div className="w-[100vw] h-[100vh] bg-white rounded-2xl">
          <Button
            color="danger"
            onPress={() => previewModal.onClose()}
            className="absolute bottom-6 left-6"
            isIconOnly
          >
            <X />
          </Button>
          {loadingPdf ? (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="loader"></div>
              <p className="mt-5 text-xl">Cargando...</p>
            </div>
          ) : (
            <iframe className="w-full h-full" src={pdf}></iframe>
          )}
        </div>
      </FullPageLayout>
      <Modal {...disclosure} size="xl" isDismissable={false}>
        <ModalContent>
          <>
            <ModalHeader>
              <Pui>Generar libro diario mayor</Pui>
            </ModalHeader>
            <ModalBody>
              <Select
                classNames={{ base: 'font-semibold' }}
                selectionMode="multiple"
                variant="bordered"
                className="dark:text-white z-[800]"
                label="Cuenta mayor"
                labelPlacement="outside"
                placeholder="Seleccione una cuenta mayor"
                isLoading={loadingMajorAccount}
                selectedKeys={accounts}
                onSelectionChange={setAccounts}
              >
                {majorAccounts.map((account) => (
                  <SelectItem
                    className="dark:text-white"
                    key={account.code}
                    textValue={`${account.code} - ${account.name}`}
                  >
                    {account.code} - {account.name}
                  </SelectItem>
                ))}
              </Select>
              <div className="mt-5">
                <Input
                  labelPlacement="outside"
                  classNames={{ label: 'font-semibold' }}
                  label="Fecha inicial"
                  type="date"
                  variant="bordered"
                  value={startDate}
                  className="dark:text-white"
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <Input
                  labelPlacement="outside"
                  classNames={{ label: 'font-semibold' }}
                  label="Fecha final"
                  type="date"
                  variant="bordered"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <ButtonUi
                onPress={handleGetItems}
                isLoading={loadingDailyMajorAccount}
                theme={Colors.Primary}
                className="w-full"
              >
                Buscar
              </ButtonUi>
            </ModalBody>
            <ModalFooter>
              <ButtonUi
                onPress={disclosure.onClose}
                isLoading={loadingDailyMajorAccount}
                theme={Colors.Default}
                className="px-10"
              >
                Cancelar
              </ButtonUi>
              <ButtonUi
                onPress={handleShowPreview}
                isDisabled={dailyMajorItemsAccount.length === 0}
                isLoading={loadingDailyMajorAccount || loadingPdf}
                theme={Colors.Info}
                className="px-10"
              >
                Visualizar
              </ButtonUi>
              <ButtonUi
                onPress={() => generatePDF('download')}
                isDisabled={dailyMajorItemsAccount.length === 0}
                isLoading={loadingDailyMajorAccount}
                theme={Colors.Success}
                className="px-10"
              >
                Descargar PDF
              </ButtonUi>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AuxiliarBook;
