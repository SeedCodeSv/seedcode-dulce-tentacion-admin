import { ThemeContext } from '@/hooks/useTheme';
import { Button } from '@nextui-org/react';
import jsPDF from 'jspdf';
import { Wallet } from 'lucide-react';
import { useContext } from 'react';

function ProofSalary() {
  const { theme } = useContext(ThemeContext);
  const generatePDF = () => {
    const doc = new jsPDF();

    // Título del contrato
    doc.setFontSize(18);
    doc.text('RAMIREZ RIVERA, SANTIAGO ALEXANDER', 105, 24, { align: 'center' });
    // Información del empleador
    doc.setFontSize(12);
    doc.text('Empleador:', 20, 40);
    doc.text('Empresa XYZ S.A.', 20, 50);
    doc.text('Dirección: Calle 123, Ciudad, País', 20, 60);
    doc.text('Teléfono: +123456789', 20, 70);

    // Información del empleado
    doc.text('Empleado:', 20, 90);
    doc.text('Nombre: Juan Pérez', 20, 100);
    doc.text('Dirección: Calle Ejemplo 456, Ciudad, País', 20, 110);
    doc.text('Teléfono: +987654321', 20, 120);

    // Términos del contrato
    doc.setFontSize(14);
    doc.text('Términos del Contrato:', 20, 140);
    doc.setFontSize(12);
    const terms = `
    1. El empleado, Juan Pérez, será contratado por la Empresa XYZ S.A. en el 
    puesto de Desarrollador de Software.
    2. El salario mensual acordado es de $2000, pagadero al final de cada mes.
    3. El empleado se compromete a trabajar 40 horas semanales, de lunes a viernes.
    4. La duración del contrato es indefinida, con un período de prueba de 3 meses.
    5. Ambas partes pueden rescindir este contrato con un aviso de 30 días.
    6. Cualquier incumplimiento por parte del empleado podrá ser motivo de rescisión inmediata.`;

    // Agregar los términos al PDF
    doc.text(terms, 20, 150, { maxWidth: 170 });

    // Firma
    doc.text('__________________________', 20, 240);
    doc.text('Firma del Empleador', 20, 250);
    doc.text('__________________________', 120, 240);
    doc.text('Firma del Empleado', 120, 250);

    // Abrir el PDF en una nueva pestaña
    const pdfBlobUrl = doc.output('bloburl');
    window.open(pdfBlobUrl, '_blank'); // Abrir en nueva pestaña
  };

  return (
    <Button
      className="border border-white"
      onClick={() => {
        generatePDF();
      }}
      isIconOnly
      style={{
        backgroundColor: theme.colors.secondary,
      }}
    >
      <Wallet
        style={{
          color: theme.colors.primary,
        }}
        size={20}
      />
    </Button>
  );
}

export default ProofSalary;
