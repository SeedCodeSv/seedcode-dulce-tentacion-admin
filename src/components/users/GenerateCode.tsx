import { useUsersStore } from "@/store/users.store";
import { global_styles } from "@/styles/global.styles";
import { Button, Input, Tooltip } from "@heroui/react";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
                label="Codigo"
                labelPlacement='outside'
                placeholder='Codigo de usuario'
                className='bg-red'
                value={code}
                readOnly
              />
              <Tooltip content="Copiar al portapapeles">
                <Button 
                    isIconOnly 
                    className='mt-6'
                    onClick={handleCopyToClipboard}
                    style={styles.secondaryStyle}
                >
                    <Copy />
                </Button>
              </Tooltip>
            </div>
            <Button
              className='w-full mt-6'
              onClick={handleGenerateCode}
              disabled={loading}
              style={styles.thirdStyle}
            >
              {loading ? 'Generando...' : 'Generar código'}
            </Button>
          </div>
    )
}
export default GenerateCode;