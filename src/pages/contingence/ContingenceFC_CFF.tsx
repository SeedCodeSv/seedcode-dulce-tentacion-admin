import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import axios from 'axios';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@heroui/react";
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';

import { generate_contingencias } from './contingencia_facturacion.ts';

import useGlobalStyles from '@/components/global/global.styles';
import { return_mh_token } from '@/storage/localStorage';
import { useAuthStore } from '@/store/auth.store';
import { useCorrelativesDteStore } from '@/store/correlatives_dte.store';
import { useEmployeeStore } from '@/store/employee.store';
import { useSalesStore } from '@/store/sales.store';
import { useTransmitterStore } from '@/store/transmitter.store';
import { IContingencia } from '@/types/DTE/contingencia.types';
import { formatDate } from '@/utils/dates';
import { firmarDocumentoContingencia, send_to_mh_contingencia } from '@/services/DTE.service.ts';
import { processSaleCCF, processSaleFCF } from '@/utils/sendDte.ts';
import { contingence_steps } from '@/utils/constants.ts';
import { formatCurrency } from '@/utils/dte.ts';
import { Employee } from '@/types/employees.types.ts';
import { useBranchesStore } from '@/store/branches.store.ts';

function ContingenceFC_CCF() {
  const { employee_list } = useEmployeeStore();
  const { getSalesInContingence, contingence_sales } = useSalesStore();
  const { getTransmitter, transmitter } = useTransmitterStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { getCorrelativesByDte } = useCorrelativesDteStore();
  const [startDate, setStartDate] = useState(formatDate());
  const [motivo, setMotivo] = useState('2');
  const [observaciones, setObservaciones] = useState('');
  const [nombreRes, setNombreRes] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [startTime, setStartTime] = useState(contingence_sales[0]?.horEmi);
  const [endDate, setEndDate] = useState(formatDate());
  const [endTime, setEndTime] = useState(contingence_sales[contingence_sales.length - 1]?.horEmi);
  const { getBranchesList, branch_list } = useBranchesStore();
  const navigation = useNavigate();
  const styles = useGlobalStyles();
  const [branchId, setBranchId] = useState<string | undefined>('');
  const [error, setError] = useState({
    nombreRes: '',
    motivo: '',
    observaciones: '',
  });
  const service = new SeedcodeCatalogosMhService();

  const filteredEmployees = useMemo(() => {
    return branchId ? employee_list.filter((emp) => emp.branchId === Number(branchId)) : [];
  }, [branchId]);

  useEffect(() => {
    getSalesInContingence(Number(user?.pointOfSale?.branch.id));
    getTransmitter(Number(user?.pointOfSale?.branch.transmitterId));
    getBranchesList();
  }, []);

  useEffect(() => {
    getSalesInContingence(Number(branchId));
  }, [branchId])
  const timeStart = useMemo(() => {
    if (contingence_sales.length > 0) {
      setStartTime(contingence_sales[0]?.horEmi);

      return contingence_sales[0]?.horEmi;
    }

    return '';
  }, [contingence_sales]);

  const timeEnd = useMemo(() => {
    if (contingence_sales.length > 0) {
      setEndTime(contingence_sales[contingence_sales.length - 1]?.horEmi);

      return contingence_sales[contingence_sales.length - 1]?.horEmi;
    }

    return '';
  }, [contingence_sales]);

  useEffect(() => {
    if (motivo !== '') {
      setError((prev) => ({ ...prev, motivo: '' }));
    }
    if (nombreRes !== '') {
      setError((prev) => ({ ...prev, nombreRes: '' }));
    }
    if (motivo !== '5') {
      setError((prev) => ({ ...prev, observaciones: '' }));
    }
  }, [motivo, nombreRes, observaciones]);

  const handleError = () => {
    if (motivo === '') {
      setError((prev) => ({ ...prev, motivo: 'Selecciona el motivo' }));

      return;
    } else if (nombreRes === '') {
      setError((prev) => ({ ...prev, nombreRes: 'Selecciona el responsable' }));

      return;
    } else if (motivo === '5' && observaciones === '') {
      setError((prev) => ({ ...prev, observaciones: 'Debes rellenar la información adicional' }));

      return;
    }
  };
  const handleFinishProccess = () => {
    setCurrentStep(0);
    navigation(0);
  }
  const handleProcessContingence = async () => {
    try {
      setLoading(true);
      setCurrentStep(0);

      const correlatives = contingence_sales.map((sale, index) => ({
        noItem: index + 1,
        codigoGeneracion: sale.codigoGeneracion,
        tipoDoc: sale.tipoDte,
      }));

      const correlativesDte = await getCorrelativesByDte(Number(user?.id), 'FE');

      if (!correlativesDte) {
        toast.error('Error al obtener correlativos');
        setLoading(false);

        return;
      }
      const token_mh = return_mh_token();

      if (!token_mh) {
        toast.error('Error al obtener token de hacienda');
        setLoading(false);

        return;
      }

      const contingence_send: IContingencia = generate_contingencias(
        transmitter,
        correlatives,
        motivo,
        observaciones,
        nombreRes,
        numeroDocumento,
        tipoDocumento,
        startDate,
        endDate,
        startTime,
        endTime,
        correlativesDte!.codPuntoVenta,
        correlativesDte!.tipoEstablecimiento
      );
      const firma = await firmarDocumentoContingencia(contingence_send);
      const send = { nit: transmitter.nit, documento: firma.data.body };

      setCurrentStep(1);
      const source = axios.CancelToken.source();
      const respuesta = await send_to_mh_contingencia(send, token_mh, source);

      if (respuesta.data.estado === 'RECHAZADO') {
        toast.error('Contingencia rechazada', {
          description: respuesta.data.observaciones.join(', '),
        });
        setLoading(false);
        setCurrentStep(0);

        return;
      } else {
        toast.success('Contingencia enviada con éxito');

        const promises = contingence_sales.map(async (sale, saleIndex) =>
          sale.tipoDte === '01'
            ? await processSaleFCF(
              sale,
              saleIndex,
              token_mh,
              Number(motivo),
              transmitter.nit,
              transmitter.clavePrivada,
            )
            : await processSaleCCF(
              sale,
              saleIndex,
              token_mh,
              Number(motivo),
              transmitter.nit,
              transmitter.clavePrivada,
            )
        );

        await Promise.all(promises)
          .then(async () => {
            toast.success('Contingencia procesada');
            setLoading(false);
            await handleFinishProccess()
          })
          .catch(() => {

            toast.error('Error al procesar la contingencia');
            setLoading(false);
            setCurrentStep(0);
          })
      }
    } catch (error) {
      toast.error('Error al procesar la contingencia');
      setLoading(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="w-full shadow p-4">
      {loading && (
        <div className="absolute z-[100] left-0 bg-white/80 top-0 h-screen w-screen flex flex-col justify-center items-center">
          <Spinner className="w-24 h-24 animate-spin" />
          <p className="text-lg font-semibold mt-4">Enviando lote de contingencia</p>
          <div className="flex flex-col">
            {contingence_steps.map((step, index) => (
              <div key={index} className="flex items-start py-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 border-2 rounded-full transition duration-500 ${index <= currentStep
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                    }`}
                >
                  {index + 1}
                </div>
                <div className="ml-4">
                  <div
                    className={`font-semibold ${index <= currentStep ? 'text-green-600' : 'text-gray-500'
                      }`}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs font-semibold text-gray-700">{step.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <p className="font-semibold text-xl dark:text-white">Resumen</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-3 mt-5">
          <Input
            className="dark:text-white mb-2"
            classNames={{ label: 'font-semibold text-sm' }}
            label="Fecha inicial"
            labelPlacement="outside"
            type="date"
            value={startDate}
            variant="bordered"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            isReadOnly
            className="dark:text-white"
            classNames={{ label: 'font-semibold text-sm' }}
            label="Hora inicial"
            labelPlacement="outside"
            type="time"
            value={timeStart}
            variant="bordered"
          />
          <Input
            className="dark:text-white"
            classNames={{ label: 'font-semibold text-sm' }}
            label="Fecha de fin"
            labelPlacement="outside"
            type="date"
            value={endDate}
            variant="bordered"
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Input
            isReadOnly
            className="dark:text-white"
            classNames={{ label: 'font-semibold text-sm' }}
            label="Hora de fin"
            labelPlacement="outside"
            type="time"
            value={timeEnd}
            variant="bordered"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-2 gap-10 gap-y-3">
          <div className="flex flex-col gap-3">
            <Select
              className="dark:text-white"
              classNames={{ label: 'font-semibold text-sm' }}
              defaultSelectedKeys={[motivo.toString()]}
              errorMessage={error.motivo}
              isInvalid={!!error.motivo}
              label="Motivo"
              labelPlacement="outside"
              placeholder="Selecciona el motivo"
              value={motivo}
              variant="bordered"
              onChange={(e) => setMotivo(e.target.value)}
            >
              {service.get005TipoDeContingencum().map((item) => (
                <SelectItem key={item.codigo} className="dark:text-white">
                  {item.valores}
                </SelectItem>
              ))}
            </Select>
            <Textarea
              className="dark:text-white"
              classNames={{ label: 'font-semibold text-sm' }}
              errorMessage={error.observaciones}
              isInvalid={!!error.observaciones}
              label="Información adicional"
              labelPlacement="outside"
              placeholder="Ingresa tus observaciones e información adicional"
              value={observaciones}
              variant="bordered"
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>
          <div className="flex flex-col-2 gap-4">
            <Autocomplete
              className="dark:text-white font-semibold"
              classNames={{
                base: 'font-semibold text-gray-500 text-sm',
              }}
              label="Sucursal"
              labelPlacement="outside"
              placeholder='Selecciona la sucursal'
              value={branchId}
              variant="bordered"
              onSelectionChange={(value) => setBranchId((value as string) || '')}
            >
              {branch_list.map((bra) => (
                <AutocompleteItem
                  key={bra.id.toString()}
                  className="dark:text-white"
                >
                  {bra.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <Autocomplete
              className="dark:text-white font-semibold text-sm"
              errorMessage={error.nombreRes}
              isInvalid={!!error.nombreRes}
              label="Responsable"
              labelPlacement="outside"
              placeholder="Selecciona al responsable"
              variant="bordered"
              onSelectionChange={(key) => {
                if (key) {
                  const employee = JSON.parse(key as string) as Employee;

                  setNombreRes(
                    `${employee.firstName} ${employee.secondName} ${employee.firstLastName} ${employee.secondLastName}`
                  );
                  setNumeroDocumento(employee.dui);
                  setTipoDocumento('13');
                }
              }}
            >
              {filteredEmployees.map((item) => (
                <AutocompleteItem
                  key={JSON.stringify(item)}
                  className=" dark:text-white"
                >
                  {`${item.firstName} ${item.secondName} ${item.firstLastName} ${item.secondLastName}`}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between">
            <p className="font-semibold text-lg dark:text-white">
              Listado de ventas en contingencia
            </p>
            {loading ? (
              <>
                <Spinner className="animate-spin" />
              </>
            ) : (
              <>
                {motivo === '' || nombreRes === '' || contingence_sales.length === 0 ? (
                  <Button
                    className="px-10 font-semibold"
                    style={styles.dangerStyles}
                    onClick={handleError}
                  >
                    Procesar contingencia
                  </Button>
                ) : (
                  <Button
                    className="px-10 font-semibold"
                    style={styles.thirdStyle}
                    onClick={handleProcessContingence}
                  >
                    Procesar contingencia
                  </Button>
                )}
              </>
            )}
          </div>
          <div className="overflow-x-auto overflow-y-auto custom-scrollbar mt-4">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-white">
                <tr>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    No.
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Fecha - Hora
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Tipo DTE
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Correlativo
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Código de generación
                  </th>
                  <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                    Monto total
                  </th>
                </tr>
              </thead>
              <tbody className="max-h-[600px] w-full overflow-y-auto">
                {contingence_sales.map((sale, index) => (
                  <tr key={index} className="border-b border-slate-200">
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">{sale.id}</td>
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                      {sale.fecEmi + ' - ' + sale.horEmi}
                    </td>
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                      {sale.tipoDte === '01' ? 'Factura' : 'Comprobante crédito fiscal'}
                    </td>
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                      {sale.numeroControl}
                    </td>
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                      {sale.codigoGeneracion}
                    </td>
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                      {formatCurrency(Number(sale.montoTotalOperacion))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ContingenceFC_CCF;
