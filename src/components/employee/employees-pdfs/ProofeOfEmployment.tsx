import jsPDF from 'jspdf';
import { Notebook } from 'lucide-react';
import { toast } from 'sonner';

import { Employee } from '@/types/employees.types';
import DEFAULT_LOGO from '@/assets/dulce-logo.png';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { getElSalvadorDateTimeText } from '@/utils/dates';
import { useConfigurationStore } from '@/store/perzonalitation.store';
import { convertImageToBase64 } from '@/utils/utils';

interface Props {
  employee: Employee;
  actions: string[];
}

function ProofSalary({ employee, actions }: Props) {

  const { personalization } = useConfigurationStore();

  const generatePDF = async () => {
    const doc = new jsPDF({
      format: 'letter',
    });

    try {
      const logo = personalization && personalization[0]?.logo ? personalization[0].logo : DEFAULT_LOGO;

      const logoBase64 = await convertImageToBase64(logo);

      const imgWidth = 25;
      const imgHeight = 25;
      const imgX = 15;
      const imgY = 10;

      doc.addImage(logoBase64, 'PNG', imgX, imgY, imgWidth, imgHeight);
    } catch (error) {
      toast.error('Error al agregar el logo');
    }

    doc.setFontSize(11);

    doc.text(getElSalvadorDateTimeText().fecEmi, 180, 20, { align: 'right' });

    doc.setFontSize(18);
    doc.text('CONSTANCIA DE TRABAJO', 105, 40, { align: 'center' });

    doc.setFontSize(12);
    doc.text('San Salvador, El Salvador', 105, 50, { align: 'center' });

    const marginLeft = 20;
    const maxLineWidth = 170;

    const employeeFullName = `${employee.firstName} ${employee.secondName || ''} ${employee.firstLastName} ${employee.secondLastName || ''}`;

    const paragraph1 = `${employee.branch.transmitter?.nombreComercial}, hace constar que el(la) señor(a) ${employeeFullName}, identificado(a) con el Documento Único de Identidad (DUI) número ${employee.dui}, ha laborado en nuestra empresa desde el ${employee.dateOfEntry}, desempeñándose en el cargo de ${employee.charge.name}.`;

    const paragraph2 = `Durante su tiempo en la empresa, el(la) señor(a) ${employeeFullName} ha demostrado un alto nivel de compromiso, responsabilidad y profesionalismo en el desarrollo de sus labores.`;

    const paragraph3 = `Actualmente, el(la) señor(a) ${employeeFullName} devenga un salario mensual de $${employee.salary} (dólares estadounidenses). Esta constancia se extiende a petición del interesado para los fines que estime convenientes.`;

    const splitText = (text: string, lineWidth: number) => doc.splitTextToSize(text, lineWidth);

    doc.setFontSize(12);
    doc.text(splitText(paragraph1, maxLineWidth), marginLeft, 70);
    doc.text(splitText(paragraph2, maxLineWidth), marginLeft, 100);
    doc.text(splitText(paragraph3, maxLineWidth), marginLeft, 130);

    doc.text('__________________________', 105, 170, { align: 'center' });
    doc.text('Firma del Empleador', 105, 180, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Dirección: Calle Falsa 123, San Salvador, El Salvador`, 105, 260, {
      align: 'center',
    });
    doc.text(`Teléfono: +503 ${employee.branch.transmitter?.telefono}`, 105, 265, {
      align: 'center',
    });
    doc.text(`Correo: ${employee.branch.transmitter?.correo}`, 105, 270, { align: 'center' });

    const pdfBlobUrl = doc.output('bloburl');

    window.open(pdfBlobUrl, '_blank');
  };

  return (
    <>
      {actions.includes('Constancia de Trabajo') && employee.isActive && (
        <ButtonUi
          isIconOnly
          showTooltip
          className="border border-white"
          theme={Colors.Warning}
          tooltipText='Generar Constancia de Trabajo'
          onPress={() => {
            generatePDF();
          }}
        >
          <Notebook size={20} />
        </ButtonUi>
      )}
    </>
  );
}

export default ProofSalary;
