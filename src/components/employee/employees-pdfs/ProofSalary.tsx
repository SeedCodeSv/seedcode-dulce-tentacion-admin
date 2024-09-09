import { ThemeContext } from '@/hooks/useTheme';
import { Button } from '@nextui-org/react';
import jsPDF from 'jspdf';
import { Wallet } from 'lucide-react';
import { useContext } from 'react';
import logo from '../../../assets/MADNESS.png';
function ProofSalary() {
  const { theme } = useContext(ThemeContext);
  const img = new Image();
  img.src = logo;
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.addImage(img, 'PNG', 10, 10, 60, 30);

    doc.setFontSize(12);

    doc.setFont('helvetica', 'bold');
    doc.text('CONTRATO INDIVIDUAL DE TRABAJO', 105, 24, { align: 'center' });
    doc.text('REPRESENTANTE PATRONAL', 20, 40);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Nombre:', 20, 50);
    doc.text('JOSE LOPEZ', 110, 50);
    doc.text('Edad:', 20, 55);
    doc.text('39 AÑOS', 110, 55);
    doc.text('Sexo:', 20, 60);
    doc.text('MASCULINO', 110, 60);
    doc.text('Estado civil:', 20, 65);
    doc.text('CASADO', 110, 65);
    doc.text('Profesión u oficio:', 20, 70);
    doc.text('ADMINISTRADOR DE EMPRESAS', 110, 70);
    doc.text('Domicilio y residencia:', 20, 75);
    doc.text('CALLE NACIONAL N° 1, SAN SALVADOR', 110, 75);
    doc.text('Nacionalidad:', 20, 80);
    doc.text('SALVADOREÑO', 110, 80);
    doc.text('Tipo de documento de identidad:', 20, 85);
    doc.text('DUI', 110, 85);
    doc.text('Número de documento de identidad:', 20, 90);
    doc.text('00112233-4', 110, 90);
    doc.text('Expedido en:', 20, 95);
    doc.text('SAN SALVADOR', 110, 95);
    doc.text('Fecha de expedición:', 20, 100);
    doc.text('29 DE FEBRERO DE 2009', 110, 100);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 105, 190, 105);
    doc.setFont('helvetica', 'bold');
    doc.text('EMPLEADO', 20, 115);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Nombre:', 20, 125);
    doc.text('MARIA JOSEFINA MARTINEZ DE LOPEZ', 110, 125);
    doc.text('Edad:', 20, 130);
    doc.text('19 AÑOS', 110, 130);
    doc.text('Sexo:', 20, 135);
    doc.text('FEMENINO', 110, 135);
    doc.text('Estado civil:', 20, 140);
    doc.text('CASADA', 110, 140);
    doc.text('Profesión u oficio:', 20, 145);
    doc.text('BACHILLER EN COMERCIO Y ADMINISTRACION', 110, 145);
    doc.text('Domicilio y residencia:', 20, 150);
    doc.text('CALLE PRINCIPAL N° 100, SAN SALVADOR', 110, 150);
    doc.text('Nacionalidad:', 20, 155);
    doc.text('SALVADOREÑA', 110, 155);
    doc.text('Tipo de documento de identidad:', 20, 160);
    doc.text('DUI', 110, 160);
    doc.text('Número de documento de identidad:', 20, 165);
    doc.text('00332211-4', 110, 165);
    doc.text('Expedido en:', 20, 170);
    doc.text('SAN SALVADOR', 110, 170);
    doc.text('Fecha de expedición:', 20, 175);
    doc.text('9 DE SEPTIEMBRE DE 2009', 110, 175);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('1. Clase de trabajo o servicio', 20, 190);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('El trabajador se obliga a prestar sus servicios a la empresa como', 20, 195);
    doc.text('SECRETARIA RECEPCIONISTA.', 20, 200);
    doc.text('__________________________', 20, 240);
    doc.text('Firma del Empleador', 20, 250);
    doc.text('__________________________', 120, 240);
    doc.text('Firma del Empleado', 120, 250);
    const pdfBlobUrl = doc.output('bloburl');
    window.open(pdfBlobUrl, '_blank');
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
