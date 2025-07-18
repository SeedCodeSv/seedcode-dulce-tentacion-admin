import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { X } from 'lucide-react';

import FullPageLayout from '../global/FullOverflowLayout';

import { formatDate, formatDateForReports } from '@/utils/dates';
import { useItemsStore } from '@/store/items.store';
import { useAuthStore } from '@/store/auth.store';
import { Item } from '@/types/items.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import Pui from '@/themes/ui/p-ui';
import { useTransmitterStore } from '@/store/transmitter.store';

type UseDisclosureReturn = ReturnType<typeof useDisclosure>;

interface Props {
  disclosure: UseDisclosureReturn;
}

function DailyBook({ disclosure }: Props) {
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [loadingPdf, setLoadingPdf] = useState(false);
  const { transmitter, gettransmitter } = useTransmitterStore()
  const { getItemsByDates, items, loadingItems } = useItemsStore();

  const { user } = useAuthStore();

  const handleGetItems = () => {
    const transId = (user?.pointOfSale?.branch.transmitter.id ?? 0);

    getItemsByDates(transId, startDate, endDate);
  };

  const [hasIncludeSignature, setHasIncludeSignature] = useState(false);
  const [hasNumberPages, setHasNumberPages] = useState(false);
  const [hasSaltOfPage, setHasSaltOfPage] = useState(false);

  const [pdf, setPdf] = useState('');

  const generatePDF = (type: 'show' | 'download') => {
    setLoadingPdf(true);
    const doc = new jsPDF();

    const $totalDebe = items.reduce((total, item) => total + +item.totalDebe, 0);
    const $totalHaber = items.reduce((total, item) => total + +item.totalHaber, 0);

    const itemsList = items.map((item) => {
      return {
        title: 'Tabla',
        data: item.details.flatMap((detail, index) => {
          if (detail.conceptOfTheTransaction !== '' && detail.conceptOfTheTransaction !== 'N/A') {
            return [
              [
                index === 0 ? item.correlative : '',
                index === 0 ? item.date : '',
                detail.accountCatalog.code,
                detail.accountCatalog.name,
                '',
                '',
              ],
              [
                '',
                '',
                '',
                detail.conceptOfTheTransaction,
                Number(detail.should) > 0 ? detail.should : '',
                Number(detail.see) > 0 ? detail.see : '',
              ],
            ];
          } else {
            return [
              [
                index === 0 ? item.correlative : '',
                index === 0 ? item.date : '',
                detail.accountCatalog.code,
                detail.accountCatalog.name,
                Number(detail.should) > 0 ? detail.should : '',
                Number(detail.see) > 0 ? detail.see : '',
              ],
            ];
          }
        }),
      };
    });

    const header = (doc: jsPDF, item: Item | undefined) => {
      if (hasNumberPages) {
        doc.setFontSize(8);
        doc.text(`Pagina ${doc.getNumberOfPages()}`, doc.internal.pageSize.getWidth() - 20, 10);
      }
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(`${transmitter.nombreComercial}`, doc.internal.pageSize.getWidth() / 2, 15, {
        align: 'center',
      });
      doc.setFontSize(10);
      doc.text('Libro Diario', doc.internal.pageSize.getWidth() / 2, 20, {
        align: 'center',
      });
      doc.setFont('helvetica', 'normal');
      doc.text(
        item ? formatDateForReports(startDate, endDate) : '',
        doc.internal.pageSize.getWidth() / 2,
        25,
        {
          align: 'center',
        }
      );
      doc.text('VALORES EXPRESADOS EN US DOLARES', doc.internal.pageSize.getWidth() / 2, 30, {
        align: 'center',
      });
    };

    const searchItem = (code: string) => {
      return items.find((item) => item.correlative === code);
    };

    const footer = (doc: jsPDF, starty: number, item: Item | undefined) => {
      doc.line(2, starty, doc.internal.pageSize.getWidth() - 3, starty); // Línea arriba del footer
      autoTable(doc, {
        startY: starty,
        theme: 'plain',
        margin: { horizontal: 3, top: 35 },
        bodyStyles: {
          fontSize: 8,
        },
        columnStyles: {
          0: {
            cellWidth: 'auto',
            fontStyle: 'bold',
            valign: 'middle',
          },
          1: {
            cellWidth: 50,
            fontStyle: 'bold',
            valign: 'middle',
          },
          2: {
            cellWidth: 33,
            halign: 'right',
            cellPadding: { horizontal: 5 },
            valign: 'middle',
          },
          3: {
            cellWidth: 28,
            halign: 'right',
            cellPadding: { horizontal: 5 },
            valign: 'middle',
          },
        },
        body: [
          [
            'Concepto de la partida:',
            'Totales de la partida:',
            item?.totalDebe ?? 0,
            item?.totalHaber ?? 0,
          ],
        ],
      });
      autoTable(doc, {
        startY: starty + 5,
        theme: 'plain',
        margin: { horizontal: 3, top: 35 },
        bodyStyles: {
          fontSize: 9,
        },
        columnStyles: {
          0: {
            cellWidth: 'auto',
            valign: 'middle',
          },
          1: {
            cellWidth: 50,
          },
          2: {
            cellWidth: 33,
          },
          3: {
            cellWidth: 28,
          },
        },
        body: [[item?.concepOfTheItem ?? '', '', '', '']],
      });
    };
    let startY = 35;

    itemsList.forEach((table, index) => {
      if (hasSaltOfPage) {
        if (index > 0) doc.addPage();
      } else {
        const pageHeight = doc.internal.pageSize.getHeight();
        const remainingSpace = pageHeight - startY;

        if (remainingSpace < 50) {
          doc.addPage();
          startY = 35;
        }
      }
      autoTable(doc, {
        margin: { horizontal: 3, top: 35 },
        startY: hasSaltOfPage ? 35 : startY,
        theme: 'plain',
        head: [['# Partida', 'Fecha', 'Cuenta', 'Concepto de la transacción', 'Debe', 'Haber']],
        columnStyles: {
          0: {
            cellWidth: 25,
          },
          1: {
            cellWidth: 20,
          },
          2: {
            cellWidth: 25,
          },
          3: {
            cellWidth: 'auto',
          },
          4: {
            cellWidth: 33,
            halign: 'right',
            cellPadding: { horizontal: 5 },
          },
          5: {
            cellWidth: 28,
            halign: 'right',
            cellPadding: { horizontal: 5 },
          },
        },
        bodyStyles: {
          fontSize: 8,
        },
        headStyles: {
          fontSize: 9,
        },
        body: table.data,
        didDrawPage: function () {
          header(doc, searchItem(table.data[0][0]));
        },
        didDrawCell: function (data) {
          if (data.section === 'head') {
            doc.setDrawColor(0, 0, 0);
            doc.roundedRect(2, data.cell.y, doc.internal.pageSize.getWidth() - 3, 6, 2, 2);
          }
        },
      });
      let finalY =
        (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || 30;

      footer(doc, finalY, searchItem(table.data[0][0]));
      finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
      startY = finalY + 5;
      if (index === itemsList.length - 1) {
        autoTable(doc, {
          margin: { horizontal: 3, top: startY },
          startY: finalY,
          theme: 'plain',
          head: [['', '', '', '']],
          showHead: false,
          body: [['', 'Total cargos y abonos:', $totalDebe.toFixed(2), $totalHaber.toFixed(2)]],
          bodyStyles: {
            fontSize: 8,
          },
          columnStyles: {
            0: {
              cellWidth: 'auto',
              fontStyle: 'bold',
              valign: 'middle',
            },
            1: {
              cellWidth: 50,
              fontStyle: 'bold',
              valign: 'middle',
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
            2: {
              cellWidth: 33,
              halign: 'right',
              cellPadding: { horizontal: 5 },
              valign: 'middle',
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
            3: {
              cellWidth: 28,
              halign: 'right',
              cellPadding: { horizontal: 5 },
              valign: 'middle',
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
          didDrawCell: function (data) {
            if (data.column.index === 2 || data.column.index === 1 || data.column.index === 3) {
              doc.line(
                data.cell.x,
                data.cell.y + data.cell.height,
                data.cell.x + data.cell.width,
                data.cell.y + data.cell.height
              );
              doc.line(
                data.cell.x,
                data.cell.y + data.cell.height + 1,
                data.cell.x + data.cell.width,
                data.cell.y + data.cell.height + 1
              );
            }
          },
        });
        finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
        if (hasIncludeSignature) {
          autoTable(doc, {
            startY: finalY + 20,
            margin: { horizontal: 3 },
            bodyStyles: {
              halign: 'center',
            },
            columnStyles: {
              0: {
                cellWidth: 'auto',
                halign: 'center',
              },
              1: {
                cellWidth: 'auto',
                halign: 'center',
              },
              2: {
                cellWidth: 'auto',
                halign: 'center',
              },
            },
            body: [['Hecho por', 'Revisado por', 'Autorizado']],
            head: [['', '', '']],
            showHead: false,
            theme: 'plain',
            didDrawCell: function (data) {
              if ([0, 1, 2].includes(data.column.index)) {
                doc.setDrawColor(0, 0, 0);
                doc.line(
                  data.cell.x + 10,
                  data.cell.y,
                  data.cell.x + data.cell.width - 10,
                  data.cell.y
                );
              }
            },
          });
        }
      }
    });

    if (type === 'download') {
      doc.save('libro-diario.pdf');

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

  useEffect(() => {
      gettransmitter()
    }, [])

  return (
    <>
      <FullPageLayout show={previewModal.isOpen}>
        <div className="w-[100vw] h-[100vh] bg-white rounded-2xl">
          <Button
            isIconOnly
            className="absolute bottom-6 left-6"
            color="danger"
            onPress={() => previewModal.onClose()}
          >
            <X />
          </Button>
          {loadingPdf ? (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="loader" />
              <p className="mt-5 text-xl">Cargando...</p>
            </div>
          ) : (
            <iframe className="w-full h-full" src={pdf} title='pdf' />
          )}
        </div>
      </FullPageLayout>
      <Modal {...disclosure} isDismissable={false} size="xl">
        <ModalContent>
          <>
            <ModalHeader>
              <Pui>Generar libro diario</Pui>
            </ModalHeader>
            <ModalBody>
              <Input
                className='dark:text-white'
                classNames={{ label: 'font-semibold' }}
                label="Fecha inicial"
                labelPlacement="outside"
                type="date"
                value={startDate}
                variant="bordered"
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                className='dark:text-white'
                classNames={{ label: 'font-semibold' }}
                label="Fecha final"
                labelPlacement="outside"
                type="date"
                value={endDate}
                variant="bordered"
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Checkbox
                lineThrough
                checked={hasNumberPages}
                isSelected={hasNumberPages}
                size="lg"
                onValueChange={(e) => setHasNumberPages(e)}
              >
                Numerar paginas {hasNumberPages ? '✓' : ''}
              </Checkbox>
              <Checkbox
                lineThrough
                checked={hasIncludeSignature}
                isSelected={hasIncludeSignature}
                size="lg"
                onValueChange={(e) => setHasIncludeSignature(e)}
              >
                Incluir firmantes {hasIncludeSignature ? '✓' : ''}
              </Checkbox>
              <Checkbox
                lineThrough
                checked={hasSaltOfPage}
                isSelected={hasSaltOfPage}
                size="lg"
                onValueChange={(e) => setHasSaltOfPage(e)}
              >
                Incluir saltos de pagina por partida {hasSaltOfPage ? '✓' : ''}
              </Checkbox>
              <ButtonUi
                className="w-full"
                isLoading={loadingItems}
                theme={Colors.Primary}
                onPress={handleGetItems}
              >
                Buscar
              </ButtonUi>
            </ModalBody>
            <ModalFooter>
              <ButtonUi className="px-10" isLoading={loadingItems} theme={Colors.Default} onPress={disclosure.onClose}>
                Cancelar
              </ButtonUi>
              <ButtonUi
                className="px-10"
                isDisabled={items.length === 0}
                isLoading={loadingItems || loadingPdf}
                theme={Colors.Info}
                onPress={handleShowPreview}
              >
                Visualizar
              </ButtonUi>
              <ButtonUi
                className="px-10"
                isDisabled={items.length === 0}
                isLoading={loadingItems}
                theme={Colors.Success}
                onPress={() => generatePDF('download')}
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

export default DailyBook;
