import jsPDF from 'jspdf';
function ContractPDF() {
  const OpenPdf = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(16);
    doc.text('CONTRATO INDIVIDUAL DE TRABAJO', 105, 20, { align: 'center' });

    // Información del trabajador
    doc.setFontSize(12);
    doc.text('DATOS DEL TRABAJADOR', 14, 30);
    doc.text('Nombre: ANGELA MARIA ROSA ASCENCIO', 14, 40);
    doc.text('Edad: 18 años', 14, 45);
    doc.text('Género: Femenino', 14, 50);
    doc.text('Estado Familiar: Soltera', 14, 55);
    doc.text('Profesión u Oficio según DUI: ESTUDIANTE', 14, 60);
    doc.text('Domicilio: Santa Ana Santa Ana', 14, 65);

    // Información del empleador
    doc.text('DATOS DEL EMPLEADOR', 110, 30);
    doc.text('Nombre: Santiago Alexander Ramírez Rivera', 110, 40);
    doc.text('Edad: 36 años', 110, 45);
    doc.text('Género: Masculino', 110, 50);
    doc.text('Estado Civil: Soltero', 110, 55);
    doc.text('Profesión u Oficio: Estudiante', 110, 60);
    doc.text('Domicilio: San Salvador San Salvador', 110, 65);

    // Marco para los datos del contrato
    doc.rect(10, 30, 190, 50);

    // Secciones del contrato
    doc.setFontSize(10);
    doc.text('CLASES DE TRABAJO O SERVICIOS QUE PRESTARÁ:', 14, 90);
    doc.text(
      'El trabajador se obliga a prestar sus servicios a la Empresa con el cargo de Agente de Ventas...',
      14,
      95
    );
    // (Agregar el resto del contenido del contrato aquí)

    // Guardar el PDF
    window.open(doc.output('bloburl'), '_blank');
  };
  return (
    <>
    <p>data</p>
    </>
  );
}
export default ContractPDF;
