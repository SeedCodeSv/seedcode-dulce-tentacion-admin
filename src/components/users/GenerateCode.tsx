import { Button, Input, Tooltip } from "@heroui/react";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { global_styles } from "@/styles/global.styles";
import { useUsersStore } from "@/store/users.store";

interface Props {
    id: number;
  }

function GenerateCode(props: Props) {
    const { generateCode } = useUsersStore()
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);


  const handleGenerateCode = async () => {
    if (!props.id) {
      toast.error('El ID del usuario no existe');

      return;
    }
    setLoading(true);
    try {
      const response = await generateCode(props.id);
      
      if (response) {
        setCode(response);
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
    navigator.clipboard.writeText(code).then(() => {
      toast.success('Código copiado al portapapeles');
    }).catch(() => {
      toast.error('Error al copiar el código');
    });
  };

    return (
        <div className='w-full h-full'>
            <div className='flex mt-6 gap-4'>
              <Input
                readOnly
                className='bg-red'
                label="Codigo"
                labelPlacement='outside'
                placeholder='Codigo de usuario'
                value={code}
              />
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
export default GenerateCode;