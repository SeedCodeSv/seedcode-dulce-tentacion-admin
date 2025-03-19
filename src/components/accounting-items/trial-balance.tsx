import { useAuthStore } from '@/store/auth.store';
import { useItemsStore } from '@/store/items.store';
import ButtonUi from '@/themes/ui/button-ui';
import Pui from '@/themes/ui/p-ui';
import { AccountCatalogWithTotals } from '@/types/items.types';
import { Colors } from '@/types/themes.types';
import { formatDate, formatDateForReports } from '@/utils/dates';
import { formatMoney } from '@/utils/utils';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';
import FullPageLayout from '../global/FullOverflowLayout';
import { X } from 'lucide-react';

type UseDisclosureReturn = ReturnType<typeof useDisclosure>;

interface Props {
  disclosure: UseDisclosureReturn;
}

function TrialBalance({ disclosure }: Props) {
  const [startDate, setStartDate] = useState(formatDate());
  const [endDate, setEndDate] = useState(formatDate());
  const [loadingPdf, setLoadingPdf] = useState(false);

  const [balance, setBalance] = useState(false);
  const [balanceComprobatorio, setBalanceComprobatorio] = useState(false);

  const { accounts, loadingAccounts, getItemsForBalance } = useItemsStore();

  const [pdf, setPdf] = useState('');
  const previewModal = useDisclosure();

  const { user } = useAuthStore();

  const handleGetItems = () => {
    const transId = user?.correlative
      ? user.correlative.branch.transmitter.id
      : (user?.pointOfSale?.branch.transmitter.id ?? 0);

    getItemsForBalance(transId, startDate, endDate);
  };

  function groupAccountsByPrefix(
    accounts: AccountCatalogWithTotals[],
    isNormal: boolean = false
  ): { code: string; name: string; items: AccountCatalogWithTotals[] }[] {
    const majorAccounts = accounts.filter(
      (account: AccountCatalogWithTotals) => account.code.length === 1
    );
    const groupedAccounts = majorAccounts.map((majorAccount: AccountCatalogWithTotals) => {
      const items = accounts.filter((account: AccountCatalogWithTotals) =>
        account.code.startsWith(majorAccount.code)
      );

      return {
        code: majorAccount.code,
        name: majorAccount.name,
        items: items.map((account: AccountCatalogWithTotals) => ({
          ...account,
          totalDebe: calcSaldoDorH(
            +account.totalDebe,
            +account.totalHaber,
            account.code.slice(0, 1),
            isNormal
          ).totalDebe,
          totalHaber: calcSaldoDorH(
            +account.totalDebe,
            +account.totalHaber,
            account.code.slice(0, 1),
            isNormal
          ).totalHaber,
          saldoAnterior: +account.saldoAnterior,
        })),
      };
    });
    return groupedAccounts;
  }

  const calcSaldoDorH = (
    totalDebe: number,
    totalHaber: number,
    type: string,
    isNormal: boolean = false
  ) => {
    switch (type) {
      case '1':
        return {
          totalDebe: isNormal ? totalDebe : totalDebe - totalHaber,
          totalHaber: isNormal ? totalHaber : 0,
        };
      case '2':
        return {
          totalDebe: isNormal ? totalDebe : 0,
          totalHaber: isNormal ? totalHaber : totalHaber - totalDebe,
        };
      case '3':
        return {
          totalDebe: isNormal ? totalDebe : 0,
          totalHaber: isNormal ? totalHaber : totalHaber - totalDebe,
        };
      case '4':
        return {
          totalDebe: isNormal ? totalDebe : totalDebe - totalHaber,
          totalHaber: isNormal ? totalHaber : 0,
        };
      case '5':
        return {
          totalDebe: isNormal ? totalDebe : 0,
          totalHaber: isNormal ? totalHaber : totalHaber - totalDebe,
        };
      default:
        return {
          totalDebe: 0,
          totalHaber: 0,
        };
    }
  };

  const calcSaldoWithSaldoAnterior = (
    totalDebe: number,
    totalHaber: number,
    saldoAnterior: number,
    type: string
  ) => {
    return calcSaldoDorH(totalDebe, totalHaber, type).totalDebe + saldoAnterior;
  };

  const generatePDF = (type: 'show' | 'download') => {
    const jsPdf = new jsPDF();
    let sInicialFinal = 0;
    let tDebeFinal = 0;
    let tHaberFinal = 0;
    let sFinalFinal = 0;
    const items = groupAccountsByPrefix(accounts, !balance && !balanceComprobatorio);

    for (const item of items) {
      const dataFormat = item.items
        .sort((a, b) => a.code.localeCompare(b.code))
        .map((it, index) => {
          const newSaldo = calcSaldoWithSaldoAnterior(
            +it.totalDebe,
            +it.totalHaber,
            +it.saldoAnterior,
            it.code.slice(0, 1)
          );

          if (
            balanceComprobatorio &&
            (it.code.slice(0, 1) === '2' || it.code.slice(0, 1) === '5' || it.code.slice(0, 1) === '3')
          ) {
            const saldoAnterior = -Number(it.saldoAnterior);

            const saldoFinal =
              Number(saldoAnterior) +
              Math.abs(Number(it.totalDebe)) -
              Math.abs(Number(it.totalHaber));

            const saldoInicial = Number(+it.totalHaber) - Math.abs(saldoFinal);

            if (index === 0) {
              sInicialFinal = saldoInicial;
              tDebeFinal = Number(it.totalDebe);
              tHaberFinal = Number(it.totalHaber);
              sFinalFinal = Number(saldoFinal);
            }

            return [
              it.code,
              it.name,
              Number(saldoInicial),
              Number(it.totalDebe),
              Number(it.totalHaber),
              Number(saldoFinal),
            ];
          }

          if (balanceComprobatorio && index === 0) {
            sInicialFinal = Number(it.saldoAnterior);
            tDebeFinal = Number(it.totalDebe);
            tHaberFinal = Number(it.totalHaber);
            sFinalFinal = Number(newSaldo);
          }

          return [
            it.code,
            it.name,
            Number(it.saldoAnterior),
            Number(it.totalDebe),
            Number(it.totalHaber),
            Number(newSaldo),
          ];
        });

      const data = dataFormat.map((it) => {
        return [
          it[0],
          it[1],
          Number(it[2]) < 0
            ? `(${formatMoney(Math.abs(Number(it[2])))})`
            : formatMoney(Number(it[2])),
          Number(it[3]) < 0
            ? `(${formatMoney(Math.abs(Number(it[3])))})`
            : formatMoney(Number(it[3])),
          Number(it[4]) < 0
            ? `(${formatMoney(Math.abs(Number(it[4])))})`
            : formatMoney(Number(it[4])),
          Number(it[5]) < 0
            ? `(${formatMoney(Math.abs(Number(it[5])))})`
            : formatMoney(Number(it[5])),
        ];
      });

      let { lastAutoTable } = jsPdf as unknown as {
        lastAutoTable: { finalY: number };
      };
      const spaceNeededForTitleAndHeader = 20; // Espacio estimado para el título y el encabezado
      const currentY = lastAutoTable ? lastAutoTable.finalY : 30;

      if (currentY + spaceNeededForTitleAndHeader > jsPdf.internal.pageSize.height - 20) {
        jsPdf.addPage(); // Forzar salto de página si no cabe
        lastAutoTable = {
          finalY: 30,
        };
      }

      const formatName = (code: string) => {
        switch (code) {
          case '1':
            return 'Activo';
          case '2':
            return 'Pasivo';
          case '3':
            return 'Patrimonio';
          case '4':
            return 'Gastos';
          case '5':
            return 'Ingresos';
          default:
            return item.name;
        }
      };

      jsPdf.setFontSize(10);
      jsPdf.setFont('helvetica', 'bold');
      jsPdf.text(formatName(item.code), 5, lastAutoTable ? lastAutoTable.finalY + 10 : 30);
      jsPdf.setFont('helvetica', 'normal');

      const saldo = calcSaldoWithSaldoAnterior(
        +item.items[0].totalDebe,
        +item.items[0].totalHaber,
        +item.items[0].saldoAnterior,
        item.code.slice(0, 1)
      );

      const foot = balanceComprobatorio
        ? [
            [
              '',
              '',
              sInicialFinal < 0
                ? `(${formatMoney(Math.abs(sInicialFinal))})`
                : formatMoney(sInicialFinal),
              tDebeFinal < 0 ? `(${formatMoney(Math.abs(tDebeFinal))})` : formatMoney(tDebeFinal),
              tHaberFinal < 0
                ? `(${formatMoney(Math.abs(tHaberFinal))})`
                : formatMoney(tHaberFinal),
              sFinalFinal < 0
                ? `(${formatMoney(Math.abs(sFinalFinal))})`
                : formatMoney(sFinalFinal),
            ],
          ]
        : [
            [
              '',
              '',
              Number(item.items[0].saldoAnterior) < 0
                ? `(${formatMoney(Math.abs(item.items[0].saldoAnterior))})`
                : formatMoney(item.items[0].saldoAnterior),
              `$${
                +item.items[0].totalDebe < 0
                  ? `(${formatMoney(Math.abs(-item.items[0].totalDebe))})`
                  : formatMoney(+item.items[0].totalDebe)
              }`,
              `$${
                +item.items[0].totalHaber < 0
                  ? `(${formatMoney(Math.abs(-item.items[0].totalHaber))})`
                  : formatMoney(+item.items[0].totalHaber)
              }`,
              `$${saldo < 0 ? `(${formatMoney(Math.abs(saldo))})` : formatMoney(saldo)}`,
            ],
          ];

      autoTable(jsPdf, {
        margin: {
          horizontal: 3,
          top: 35,
        },
        startY: (lastAutoTable ? lastAutoTable.finalY + 10 : 30) + 3,
        showHead: 'firstPage',
        showFoot: 'lastPage',
        head: [['Código', 'Nombre', 'Saldo inicial', 'Debe', 'Haber', 'Saldo']],
        foot: foot,
        body: data,
        bodyStyles: {
          fontSize: 7,
        },
        headStyles: {
          fontSize: 8,
        },
        footStyles: {
          fontSize: 7,
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
        },
        theme: 'plain',
        didDrawCell: (data) => {
          if (data.section === 'head') {
            jsPdf.setDrawColor(0, 0, 0);
            jsPdf.line(1, data.cell.y - 1, jsPdf.internal.pageSize.width - 2, data.cell.y - 1);
            jsPdf.line(1, data.cell.y, jsPdf.internal.pageSize.width - 2, data.cell.y);
            jsPdf.line(
              1,
              data.cell.y + data.cell.height,
              jsPdf.internal.pageSize.width - 2,
              data.cell.y + data.cell.height
            );
          }
          if (data.section === 'foot') {
            jsPdf.setDrawColor(0, 0, 0);
            jsPdf.line(85, data.cell.y, jsPdf.internal.pageSize.width - 2, data.cell.y);
          }
        },
        didDrawPage: () => {
          jsPdf.setFontSize(12);
          jsPdf.setFont('helvetica', 'bold');
          jsPdf.text('MADNESS', jsPdf.internal.pageSize.width / 2, 10, {
            align: 'center',
          });
          jsPdf.text('Balance de comprobación', jsPdf.internal.pageSize.width / 2, 15, {
            align: 'center',
          });

          jsPdf.setFontSize(10);
          jsPdf.setFont('helvetica', 'normal');

          jsPdf.text(
            formatDateForReports(startDate, endDate),
            jsPdf.internal.pageSize.width / 2,
            20,
            {
              align: 'center',
            }
          );
        },
      });
    }
    if (type === 'download') {
      jsPdf.save('balance-de-comprobacion.pdf');
      return;
    }

    const blob = jsPdf.output('blob');
    const url = URL.createObjectURL(blob);
    setLoadingPdf(false);
    setPdf(url);
  };

  const handleShowPreview = () => {
    generatePDF('show');
    previewModal.onOpenChange();
  };

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
              <Pui>Generar libro mayor</Pui>
            </ModalHeader>
            <ModalBody>
              <Input
                labelPlacement="outside"
                classNames={{ label: 'font-semibold' }}
                label="Fecha inicial"
                type="date"
                variant="bordered"
                className="dark:text-white"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                labelPlacement="outside"
                classNames={{ label: 'font-semibold' }}
                label="Fecha final"
                type="date"
                variant="bordered"
                className="dark:text-white"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Checkbox
                checked={balance}
                isSelected={balance}
                onValueChange={(value) => {
                  if (value) {
                    setBalanceComprobatorio(false);
                  }
                  setBalance(value);
                }}
              >
                Balance de saldos
              </Checkbox>
              <Checkbox
                checked={balanceComprobatorio}
                isSelected={balanceComprobatorio}
                onValueChange={(value) => {
                  if (value) {
                    setBalance(false);
                  }
                  setBalanceComprobatorio(value);
                }}
              >
                Balance de saldos comprobatorio
              </Checkbox>
              <ButtonUi
                onPress={handleGetItems}
                isLoading={loadingAccounts}
                theme={Colors.Primary}
                className="w-full"
              >
                Buscar
              </ButtonUi>
            </ModalBody>
            <ModalFooter>
              <ButtonUi
                onPress={disclosure.onClose}
                isLoading={loadingAccounts}
                theme={Colors.Default}
                className="px-10"
              >
                Cancelar
              </ButtonUi>
              <ButtonUi
                onPress={handleShowPreview}
                isDisabled={accounts.length === 0}
                isLoading={loadingAccounts || loadingPdf}
                theme={Colors.Info}
                className="px-10"
              >
                Visualizar
              </ButtonUi>
              <ButtonUi
                onPress={() => generatePDF('download')}
                isDisabled={accounts.length === 0}
                isLoading={loadingAccounts}
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

export default TrialBalance;
