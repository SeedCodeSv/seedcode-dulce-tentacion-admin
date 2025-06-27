import { Button, Input, Tooltip } from "@heroui/react";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { global_styles } from "@/styles/global.styles";
import { useEmployeeStore } from "@/store/employee.store";
import { GenerateCodeCut } from "@/types/employees.types";

interface Props {
  id: number;
}

function GenerateCodeEmployee(props: Props) {
  const { generateCode } = useEmployeeStore()
  const [code, setCode] = useState({
    codeReferalNote: '',
    codeZ: ''
  });
  const [payload, setPayload] = useState<GenerateCodeCut>({
    codeReferalNote: true,
    cutZ: false
  })
  const [loading, setLoading] = useState(false);


  const handleGenerateCode = async () => {
    if (!props.id) {
      toast.error('El id del empleado no existe');

      return;
    }
    setLoading(true);
    try {

      const response = await generateCode(props.id, payload);

      if (response) {
        if (payload.codeReferalNote) {
          setCode({ ...code, codeReferalNote: response });

        }
        if (payload.cutZ) {
          setCode({ ...code, codeZ: response })
        }
        toast.success('Código generado con éxito');
      } else {
        toast.error('Error al generar el código');
      }
    } catch (error) {
      toast.error('Error en la generación del código: ');
    } finally {
      setLoading(false);
    }
  };

  const styles = global_styles()


  const handleCopyToClipboard = () => {
    const currentCode = payload.codeReferalNote ? code.codeReferalNote : code.codeZ;

    navigator.clipboard.writeText(currentCode || '').then(() => {
      toast.success('Código copiado al portapapeles');
    }).catch(() => {
      toast.error('Error al copiar el código');
    });
  };


  return (
    <div className='w-full h-full'>
      <div className="flex flex-row justify-center gap-6 mt-4">
        <button
          className={`
            rounded-xl p-2 flex justify-center border ${payload.codeReferalNote ? ' border-sky-200 text-sky-400' : 'text-gray-400 border-gray-200'}`}
          onClick={() => {
            setPayload({ ...payload, codeReferalNote: true, cutZ: false })
          }}
        >
          Notas de remision
        </button>
        <button
          className={`
          rounded-xl p-2 flex justify-center border ${payload.cutZ ? ' border-sky-200 text-sky-400' : 'text-gray-400 border-gray-200'}`}

          onClick={() => {
            setPayload({ ...payload, cutZ: true, codeReferalNote: false })
          }}
        >
          Corte de caja z
        </button>
      </div>
      <div className='flex mt-6 gap-4'>
        {payload.codeReferalNote ? (
          <Input
            readOnly
            className='bg-red'
            label="Codigo"
            labelPlacement='outside'
            placeholder='Codigo para el empleado'
            value={code.codeReferalNote}
          />
        ) : (
          <Input
            readOnly
            className='bg-red'
            label="Codigo"
            labelPlacement='outside'
            placeholder='Codigo para el empleado'
            value={code.codeZ}
          />
        )}

        <Tooltip content="Copiar al portapapeles">
          <Button
            isIconOnly
            className='mt-6'
            style={styles.secondaryStyle}
            onClick={handleCopyToClipboard}
          >
            <Copy />
          </Button>
        </Tooltip>
      </div>

      <Button
        className='w-full mt-6'
        disabled={loading}
        style={styles.thirdStyle}
        onClick={handleGenerateCode}
      >
        {loading ? 'Generando...' : 'Generar código'}
      </Button>
    </div>
  )
}
export default GenerateCodeEmployee;