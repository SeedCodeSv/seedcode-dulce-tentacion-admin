import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import useGlobalStyles from '../global/global.styles';
import { formatDate } from '@/utils/dates';
import { useState } from 'react';
import { useItemsStore } from '@/store/items.store';
import { useAuthStore } from '@/store/auth.store';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Item } from '@/types/items.types';
import FullPageLayout from '../global/FullOverflowLayout';
import { X } from 'lucide-react';

function DailyBook() {
  const styles = useGlobalStyles();
  const modal = useDisclosure();

  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [loadingPdf, setLoadingPdf] = useState(false);

  const { getItemsByDates, items, loadingItems } = useItemsStore();

  const { user } = useAuthStore();

  const handleGetItems = () => {
    const transId = user?.correlative
      ? user.correlative.branch.transmitter.id
      : (user?.pointOfSale?.branch.transmitter.id ?? 0);

    getItemsByDates(transId, startDate, endDate);
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const [pdf, setPdf] = useState('');

  const generatePDF = (type: 'show' | 'download') => {
    setLoadingPdf(true);
    const doc = new jsPDF();
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
              ['', '', '', detail.conceptOfTheTransaction, detail.should, detail.see],
            ];
          } else {
            return [
              [
                index === 0 ? item.correlative : '',
                index === 0 ? item.date : '',
                detail.accountCatalog.code,
                detail.accountCatalog.name,
                detail.should,
                detail.see,
              ],
            ];
          }
        }),
      };
    });

    const header = (doc: jsPDF, item: Item | undefined) => {
      doc.setFontSize(8);
      doc.text(`Pagina ${doc.getNumberOfPages()}`, doc.internal.pageSize.getWidth() - 20,   10);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('MADNESS', doc.internal.pageSize.getWidth() / 2, 15, {
        align: 'center',
      });
      doc.setFontSize(10);
      doc.text('Libro Diario', doc.internal.pageSize.getWidth() / 2, 20, {
        align: 'center',
      });
      doc.setFont('helvetica', 'normal');
      doc.text(
        item ? `del ${formatFecha(item.date)} al ${formatFecha(item.date)}` : '',
        doc.internal.pageSize.getWidth() / 2,
        25,
        {
          align: 'center',
        }
      );
      doc.text('VALORES EXPRESADOS EN US DOLARES', doc.internal.pageSize.getWidth() / 2, 30, {
        align: 'center',
      });

      doc.roundedRect(2, 35, doc.internal.pageSize.getWidth() - 3, 6, 2, 2);
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
          fontSize: 9,
        },
        columnStyles: {
          0: {
            cellWidth: 'auto',
            fontStyle: 'bold',
            valign: 'middle',
          },
          1: {
            cellWidth: 60,
            fontStyle: 'bold',
            valign: 'middle',
          },
          2: {
            cellWidth: 30,
            halign: 'right',
            cellPadding: { horizontal: 5 },
            valign: 'middle',
          },
          3: {
            cellWidth: 25,
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
            cellWidth: 60,
          },
          2: {
            cellWidth: 30,
          },
          3: {
            cellWidth: 25,
          },
        },
        body: [[item?.concepOfTheItem ?? '', '', '', '']],
      });
    };

    itemsList.forEach((table, index) => {
      if (index > 0) doc.addPage();
      autoTable(doc, {
        margin: { horizontal: 3, top: 35 },
        startY: 35,
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
            cellWidth: 30,
            halign: 'right',
            cellPadding: { horizontal: 5 },
          },
          5: {
            cellWidth: 25,
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
      });
      const finalY =
        (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || 30;
      footer(doc, finalY, searchItem(table.data[0][0]));
    });

    if (type === 'download') {
      doc.save('libro-diario.pdf');
      return;
    }

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);

    setPdf(url);
    setLoadingPdf(false);
  };

  const handleShowPreview = () => {
    setLoadingPdf(true);
    generatePDF('show');
    previewModal.onOpenChange();
  };

  const previewModal = useDisclosure();

  return (
    <>
      <Button style={styles.secondaryStyle} onPress={modal.onOpenChange}>
        Generar libro diario
      </Button>
      <FullPageLayout show={previewModal.isOpen}>
        <div className="w-[100vw] h-[100vh] bg-white rounded-2xl">
          <Button
            color="danger"
            onClick={() => previewModal.onClose()}
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
      <Modal {...modal} size="lg" isDismissable={false}>
        <ModalContent>
          <>
            <ModalHeader>Generar libro diario</ModalHeader>
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
              <Button
                onPress={handleGetItems}
                isLoading={loadingItems}
                style={styles.secondaryStyle}
                className="w-full"
              >
                Buscar
              </Button>
            </ModalBody>
            <ModalFooter>
              <Button isLoading={loadingItems} style={styles.dangerStyles} className="px-10">
                Cancelar
              </Button>
              <Button
                onPress={handleShowPreview}
                isDisabled={items.length === 0}
                isLoading={loadingItems || loadingPdf}
                style={styles.darkStyle}
                className="px-10"
              >
                Visualizar
              </Button>
              <Button
                onPress={() => generatePDF('download')}
                isDisabled={items.length === 0}
                isLoading={loadingItems}
                style={styles.thirdStyle}
                className="px-10"
              >
                Descargar PDF
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DailyBook;
