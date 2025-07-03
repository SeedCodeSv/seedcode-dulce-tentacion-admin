import { Button, Checkbox, Input, Tooltip } from "@heroui/react";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { global_styles } from "@/styles/global.styles";
import { useEmployeeStore } from "@/store/employee.store";
import { GenerateCodeCut, IResponseCodes } from "@/types/employees.types";

interface Props {
  id: number;
  code: IResponseCodes
  isResponsableCutz?: boolean
}

function GenerateCodeEmployee(props: Props) {
  const { generateCode } = useEmployeeStore()


  const [payload, setPayload] = useState<GenerateCodeCut>({
    codeReferalNote: true,
    cutZ: false,
    codeZValue: props?.code?.codes?.codeCutZ ?? '',
    codeReferalNoteValue: props?.code?.codes?.codeReferal ?? ''
  })

  useEffect(() => {
    setPayload(prev => ({
      ...prev,
      codeReferalNoteValue: props?.code?.codes?.codeReferal ?? '',
      codeZValue: props?.code?.codes?.codeCutZ ?? ''
    }));
  }, [props.code]);

  const [loading, setLoading] = useState(false);
  const [isManual, setIsManual] = useState(false)
  const handleGenerateCode = async () => {

    if (!props.id) {
      toast.error('El id del empleado no existe');

      return;
    }


    setLoading(true);
    try {
      if (isManual === false) {
        if (payload.codeReferalNote && payload.codeReferalNoteValue.trim() === '') {
          toast.warning('Debes ingresar un código manual para nota de remisión');

          return;
        }
        if (payload.cutZ && payload.codeZValue.trim() === '') {
          toast.warning('Debes ingresar un código manual para corte Z');

          return;
        }
      }


      const val = {
        ...payload,
        isGenerated: isManual
      }
      const response = await generateCode(props.id, val);

      if (response) {
        if (payload.codeReferalNote) {
          setPayload({ ...payload, codeReferalNoteValue: response });

        }
        if (payload.cutZ) {
          setPayload({ ...payload, codeZValue: response })
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
    const currentCode = payload.codeReferalNote ? payload.codeReferalNoteValue : payload.codeZValue;

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
        {props.isResponsableCutz && (
          <button
            className={`
          rounded-xl p-2 flex justify-center border ${payload.cutZ ? ' border-sky-200 text-sky-400' : 'text-gray-400 border-gray-200'}`}

            onClick={() => {
              setPayload({ ...payload, cutZ: true, codeReferalNote: false })
            }}
          >
            Corte de caja z
          </button>
        )}
        <div className="flex flex-row gap-1 items-center align-center">
          <Checkbox
            checked={isManual}
            color={'warning'}
            size="md"
            onChange={() => {
              setIsManual(!isManual)
              if (isManual === false) {
                setPayload({ ...payload, codeReferalNoteValue: '', codeZValue: '' })
              }
            }}


          />
          <p className="dark:text-white ">{`${isManual ? 'Generar codigo' : 'Ingresar codigo'}`}</p>
        </div>


      </div>
      <div className='flex mt-6 gap-4'>
        {props.isResponsableCutz ?
          (<>
            {payload.codeReferalNote ?
              <Input
                className='bg-red'
                label="Codigo"
                labelPlacement='outside'
                placeholder='Codigo para el empleado'
                readOnly={isManual}
                value={payload.codeReferalNoteValue}
                onChange={(e) => {
                  setPayload({ ...payload, codeReferalNoteValue: e.currentTarget.value.toLocaleUpperCase() })
                }}
              />
              :
              <Input
                // readOnly
                className='bg-red'
                label="Codigo"
                labelPlacement='outside'
                placeholder='Codigo para el empleado'
                readOnly={isManual}
                value={payload.codeZValue}
                onChange={(e) => {
                  setPayload({ ...payload, codeZValue: e.currentTarget.value.toLocaleUpperCase() })
                }}
              />
            }
          </>) : (<>
            <Input
              // readOnly
              className='bg-red'
              label="Codigo"
              labelPlacement='outside'
              placeholder='Codigo para el empleado nota remision'
              readOnly={isManual}
              value={payload.codeReferalNoteValue}
              onChange={(e) => {
                setPayload({ ...payload, codeReferalNoteValue: e.currentTarget.value.toLocaleUpperCase() })
              }}
            />
          </>)
        }
        <Tooltip content="Copiar al portapapeles">
          <Button
            isIconOnly
            className='mt-6'
            style={styles.secondaryStyle}
            onPress={() => { handleCopyToClipboard() }}
          >
            <Copy />
          </Button>
        </Tooltip>
      </div>

      <Button
        className='w-full mt-6'
        disabled={loading}
        style={styles.thirdStyle}
        onPress={() => { handleGenerateCode() }}
      >
        {loading ? 'Generando...' : 'Generar o crear código '}
      </Button>
    </div>
  )
}
export default GenerateCodeEmployee;