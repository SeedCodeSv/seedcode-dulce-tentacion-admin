import { AxiosError } from 'axios';
import { get_json_sale } from '../../services/sales.service';
import { IDTE } from '../../types/DTE/DTE.types';
import { useTransmitterStore } from '../../store/transmitter.store';
import { useEffect, useState } from 'react';
import { return_mh_token } from '../../storage/localStorage';
import { toast } from 'sonner';
import { Sale } from '../../types/report_contigence';
import { check_dte, get_json_from_space } from '../../services/DTE.service';
import { ICheckResponse } from '../../types/DTE/check.types';
import { Button } from '@heroui/react';
import { global_styles } from '../../styles/global.styles';
import { LoaderCircle } from 'lucide-react';

interface Props {
  sale: Sale;
  reload: () => void;
  onClose: () => void;
}

export const AddSealMH = (props: Props) => {
  useEffect(() => {
    gettransmitter();
  }, []);
  const { gettransmitter, transmitter } = useTransmitterStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  interface Data {
    quantity: number;
    discount: string | number;
    percentage: number;
    total: number;
    base_price: string | number;
  }

  const handleVerify = (sale: Sale) => {
    toast.info('Verificando documento...');
    setLoading(true);
    setMessage('Consultando en hacienda...');
    const payload = {
      nitEmisor: transmitter.nit,
      tdte: sale.tipoDte,
      codigoGeneracion: sale.codigoGeneracion,
    };
    const token_mh = return_mh_token();
    check_dte(payload, token_mh ?? '')
      .then((response) => {
        const selloRecibido = String(response.data.selloRecibido);
        toast.success(response.data.estado, {
          description: `Sello recibido: ${response.data.selloRecibido}`,
        });
        setMessage(`Sello recibido: ${response.data.selloRecibido}`);

        get_json_sale(sale.id).then((data) => {
          setMessage('Generando documento...');
          get_json_from_space(data.data.json)
            .then((response) => {
              const jsonData: IDTE = response.data;
              const data: Data[] = [];
              for (const item of jsonData.cuerpoDocumento) {
                data.push({
                  quantity: item.cantidad,
                  discount: Number(item.montoDescu),
                  percentage: Number(
                    ((Number(item.montoDescu) / Number(item.precioUni)) * 100).toFixed(2)
                  ),
                  total: Number(item.cantidad) * Number(item.precioUni),
                  base_price: Number(item.precioUni),
                });
              }

              jsonData.respuestaMH.selloRecibido = selloRecibido;
            })
            .catch(() => {
              setLoading(false);
            });
        });
      })
      .catch((error: AxiosError<ICheckResponse>) => {
        if (error.status === 500) {
          toast.error('NO ENCONTRADO', {
            description: 'DTE no encontrado en hacienda',
          });
          setLoading(false);
          props.onClose();
          return;
        }

        toast.error('ERROR', {
          description: `Error: ${
            error.response?.data.descripcionMsg ?? 'DTE no encontrado en hacienda'
          }`,
        });
        props.onClose();
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text- font-semibold">{props.sale.numeroControl}</p>
      <p className="text- font-semibold">
        Fecha: {props.sale.fecEmi} / {props.sale.horEmi}
      </p>
      <div className="flex justify-center">
        <Button
          style={global_styles().thirdStyle}
          onClick={() => handleVerify(props.sale)}
          disabled={loading}
          isLoading={loading}
          className=" w-1/2"
        >
          Verificar
        </Button>
      </div>

      {loading && (
        <div className="flex flex-row gap-3 mt-2">
          <p className="text-lg font-semibold">{message}</p>
          <LoaderCircle className="animate-spin" size={36} />
        </div>
      )}
    </div>
  );
};
