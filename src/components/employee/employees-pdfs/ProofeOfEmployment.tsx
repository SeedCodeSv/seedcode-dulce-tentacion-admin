import { ThemeContext } from '@/hooks/useTheme';
import { Employee } from '@/types/employees.types';
import { Button } from "@heroui/react";
import jsPDF from 'jspdf';
import { Notebook } from 'lucide-react';
import { useContext } from 'react';
import logo from '@/assets/MADNESS.png';
import TooltipGlobal from '@/components/global/TooltipGlobal';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  employee: Employee;
  actions: string[];
}

function ProofSalary({ employee, actions }: Props) {
  const { theme } = useContext(ThemeContext);
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };

  const convertImageToBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
    });
  };

  const generatePDF = async () => {
    // const doc = new jsPDF();
    const doc = new jsPDF({
      format: 'letter', // Establece el tamaño de la página en formato carta
    });

    try {
      // Convertir el logo a base64
      const logoBase64 = await convertImageToBase64(logo);

      // Agregar logo al PDF
      const imgWidth = 40; // Ancho del logo
      const imgHeight = 20; // Alto del logo
      const imgX = 15; // Posición X (margen izquierdo)
      const imgY = 10; // Posición Y (margen superior)

      // Añadir la imagen del logo
      doc.addImage(logoBase64, 'PNG', imgX, imgY, imgWidth, imgHeight);
    } catch (error) {
      toast.error('Error al agregar el logo');
    }

    // Ajusta el tamaño del texto
    doc.setFontSize(11); // Cambia el tamaño de la fuente a un valor más pequeño

    // Mueve la fecha de emisión hacia la parte superior derecha
    doc.text('08 de septiembre de 2024', 180, 20, { align: 'right' });

    // Título del documento
    doc.setFontSize(18);
    doc.text('CONSTANCIA DE TRABAJO', 105, 40, { align: 'center' });

    // Información de ubicación y fecha
    doc.setFontSize(12);
    doc.text('San Salvador, El Salvador', 105, 50, { align: 'center' });
    // doc.text('Fecha de emisión: 08 de septiembre de 2024', 105, 60, { align: 'center' });

    // Espacio para margen izquierdo
    const marginLeft = 20;
    const maxLineWidth = 170;

    const employeeFullName = `${employee.firstName} ${employee.secondName || ''} ${employee.firstLastName} ${employee.secondLastName || ''}`;

    const paragraph1 = `${employee.branch.transmitter?.nombreComercial}, hace constar que el(la) señor(a) ${employeeFullName}, identificado(a) con el Documento Único de Identidad (DUI) número ${employee.dui}, ha laborado en nuestra empresa desde el ${employee.dateOfEntry}, desempeñándose en el cargo de ${employee.charge.name}.`;

    const paragraph2 = `Durante su tiempo en la empresa, el(la) señor(a) ${employeeFullName} ha demostrado un alto nivel de compromiso, responsabilidad y profesionalismo en el desarrollo de sus labores.`;

    const paragraph3 = `Actualmente, el(la) señor(a) ${employeeFullName} devenga un salario mensual de $${employee.salary} (dólares estadounidenses). Esta constancia se extiende a petición del interesado para los fines que estime convenientes.`;

    // Función para dividir el texto en líneas, simulando justificación
    const splitText = (text: string, lineWidth: number) => doc.splitTextToSize(text, lineWidth);

    // Agregar los párrafos justificados
    doc.setFontSize(12);
    doc.text(splitText(paragraph1, maxLineWidth), marginLeft, 70);
    doc.text(splitText(paragraph2, maxLineWidth), marginLeft, 100);
    doc.text(splitText(paragraph3, maxLineWidth), marginLeft, 130);

    // Firma centrada del empleador
    doc.text('__________________________', 105, 170, { align: 'center' });
    doc.text('Firma del Empleador', 105, 180, { align: 'center' });

    // Información de contacto centrada al final del documento
    doc.setFontSize(10); // Ajusta el tamaño del texto
    doc.text(`Dirección: Calle Falsa 123, San Salvador, El Salvador`, 105, 260, {
      align: 'center',
    });
    doc.text(`Teléfono: +503 ${employee.branch.transmitter?.telefono}`, 105, 265, {
      align: 'center',
    });
    doc.text(`Correo: ${employee.branch.transmitter?.correo}`, 105, 270, { align: 'center' });

    // Abrir el PDF en una nueva pestaña
    const pdfBlobUrl = doc.output('bloburl');
    window.open(pdfBlobUrl, '_blank'); // Abrir en nueva pestaña
  };

  return (
    <>
      {actions.includes('Constancia de Trabajo') && employee.isActive ? (
        <TooltipGlobal text="Generar Constancia de Trabajo">
          <Button
            className="border border-white"
            onClick={() => {
              generatePDF();
            }}
            isIconOnly
            style={{
              backgroundColor: theme.colors.third,
            }}
          >
            <Notebook
              style={{
                color: theme.colors.primary,
              }}
              size={20}
            />
          </Button>
        </TooltipGlobal>
      ) : (
        <>
          <Button
            type="button"
            disabled
            style={{ ...style, cursor: 'not-allowed' }}
            className="flex font-semibold border border-white "
            isIconOnly
          >
            <Lock />
          </Button>
        </>
      )}
    </>
  );
}

export default ProofSalary;
