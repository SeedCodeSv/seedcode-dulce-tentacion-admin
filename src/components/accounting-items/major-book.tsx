import { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
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

type UseDisclosureReturn = ReturnType<typeof useDisclosure>;

interface Props {
  disclosure: UseDisclosureReturn;
}

function MajorBook({ disclosure }: Props) {
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [loadingPdf, setLoadingPdf] = useState(false);

  const { getItemsByMajor, majorItems, loadingMajorAccount } = useItemsStore();

  const { user } = useAuthStore();

  const handleGetItems = () => {
    const transId = user?.correlative
      ? user.correlative.branch.transmitter.id
      : (user?.pointOfSale?.branch.transmitter.id ?? 0);

    getItemsByMajor(transId, startDate, endDate);
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

    let allTotalSee = 0;
    let allTotalShould = 0;

    for (const item of majorItems) {
      let saldoAnterior = +item.saldoAnterior;

      let data: string[][] = [];

      if (item.items.length > 0 || saldoAnterior !== 0) {
        data = item.items.map((it, index) => {
          saldoAnterior = calcSaldo(
            item.uploadAs,
            +it.totalDebe,
            +it.totalHaber,
            saldoAnterior,
            index,
            saldoAnterior
          );
          const itemsRes = [
            formatDdMmYyyy(it.day),
            'Transacciones del día',
            formatMoney(+it.totalDebe),
            formatMoney(+it.totalHaber),
            +saldoAnterior < 0
              ? `(${formatMoney(Math.abs(saldoAnterior))})`
              : formatMoney(saldoAnterior),
          ];

          return itemsRes;
        });

        const totalSee = item.items.reduce((acc, it) => acc + +it.totalDebe, 0);
        const totalShould = item.items.reduce((acc, it) => acc + +it.totalHaber, 0);
        allTotalSee += totalSee;
        allTotalShould += totalShould;
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
          head: [['', '']],
          body: [
            ['Cuenta:', item.code],
            ['Nombre de Cuenta:', item.name],
          ],
          columnStyles: {
            0: { cellWidth: 38, font: 'helvetica', fontStyle: 'bold' },
            1: { cellWidth: 'auto' },
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
          foot: [
            [
              '',
              'Total Cuenta:',
              formatMoney(totalSee),
              formatMoney(totalShould),
              data.length > 0
                ? data[data.length - 1][4]
                : item.saldoAnterior < 0
                  ? `(${Math.abs(item.saldoAnterior).toFixed(2)})`
                  : item.saldoAnterior.toFixed(2),
            ],
          ],
          body: [
            [
              '',
              '',
              '',
              'Saldo anterior:',
              item.saldoAnterior < 0
                ? `(${Math.abs(item.saldoAnterior).toFixed(2)})`
                : item.saldoAnterior.toFixed(2),
            ],
            ...data,
          ],
          theme: 'plain',
          head: [['Fecha', 'Concepto', 'Debe', 'Haber', 'Saldo']],
          startY: lastAutoTable ? lastAutoTable.finalY + 2 : 5,
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 38 },
            3: { cellWidth: 38 },
            4: { cellWidth: 38 },
          },
          didDrawCell: (data) => {
            if (data.section === 'foot') {
              doc.setDrawColor(0, 0, 0);
              doc.setLineWidth(0.1);
              doc.line(60, data.cell.y, doc.internal.pageSize.width - 2, data.cell.y);
            }
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
            doc.text('Libro mayor', doc.internal.pageSize.width / 2, 15, {
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
      }
    }

    const lastAutoTable = (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable;

    autoTable(doc, {
      margin: {
        horizontal: 3,
        top: 35,
      },
      showHead: 'never',
      theme: 'plain',
      startY: lastAutoTable ? lastAutoTable.finalY + 15 : 10,
      head: [['', '', '', '', '']],
      body: [['', 'Total General:', formatMoney(allTotalSee), formatMoney(allTotalShould), '']],
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 'auto', halign: 'right' },
        2: { cellWidth: 38 },
        3: { cellWidth: 38 },
        4: { cellWidth: 38 },
      },
      didDrawCell(data) {
        if (data.section === 'body') {
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.1);
          doc.line(60, data.cell.y, doc.internal.pageSize.width - 20, data.cell.y);
          doc.line(60, data.cell.y - 1, doc.internal.pageSize.width - 20, data.cell.y - 1);
        }
      },
    });

    if (type === 'download') {
      doc.save('libro-mayor.pdf');
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
            <ModalHeader>Generar libro mayor</ModalHeader>
            <ModalBody>
              <Input
                labelPlacement="outside"
                classNames={{ label: 'font-semibold' }}
                label="Fecha inicial"
                type="date"
                variant="bordered"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                labelPlacement="outside"
                classNames={{ label: 'font-semibold' }}
                label="Fecha final"
                type="date"
                variant="bordered"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <ButtonUi
                onPress={handleGetItems}
                isLoading={loadingMajorAccount}
                theme={Colors.Primary}
                className="w-full"
              >
                Buscar
              </ButtonUi>
            </ModalBody>
            <ModalFooter>
              <ButtonUi isLoading={loadingMajorAccount} theme={Colors.Default} className="px-10">
                Cancelar
              </ButtonUi>
              <ButtonUi
                onPress={handleShowPreview}
                isDisabled={majorItems.length === 0}
                isLoading={loadingMajorAccount || loadingPdf}
                theme={Colors.Info}
                className="px-10"
              >
                Visualizar
              </ButtonUi>
              <ButtonUi
                onPress={() => generatePDF('download')}
                isDisabled={majorItems.length === 0}
                isLoading={loadingMajorAccount}
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

export default MajorBook;
