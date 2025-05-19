import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
 FileText,
} from 'lucide-react';

import { Employee } from '../../types/employees.types'

import { Colors } from '@/types/themes.types';
import ButtonUi from '@/themes/ui/button-ui';

function ContractPDF ({employee}: {employee: Employee}) {

  const OpenPdf = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RAMIREZ RIVERA, SANTIAGO ALEXANDER', 105, 24, { align: 'center' });

    doc.setFontSize(14);
    doc.text('CONTRATO INDIVIDUAL DE TRABAJO', 105, 32, { align: 'center' });

    // Información del Cargo
    // Datos del trabajador y empleador utilizando autoTable
    autoTable(doc, {
      startY: 39, // Margen superior
      theme: 'grid',
      head: [['1', '2']],
      body: [
        [
          {
            content: 'CARGO',
            styles: { fontStyle: 'bold', lineWidth: 0.2, lineColor: [0, 0, 0], minCellHeight: 6 },
          },
          {
            content: 'AGENTE DE VENTAS',
            styles: { lineWidth: 0.2, lineColor: [0, 0, 0], minCellHeight: 6 },
          },
        ],
      ],
      showHead: false,
    });

    autoTable(doc, {
      theme: 'grid',
      head: [['1', '2']],
      columnStyles: { 0: { cellWidth: 90.9 }, 1: { cellWidth: 90.9 } },
      body: [
        [
          { content: 'DATOS DEL TRABAJADOR', styles: { halign: 'center', fontStyle: 'bold' } },
          { content: 'DATOS DEL EMPLEADOR', styles: { halign: 'center', fontStyle: 'bold' } },
        ],
        [
          `Nombre: ${employee.firstName + ' ' + employee.secondName + ' ' + employee.firstLastName + ' ' + employee.secondLastName}`,
          `Nombre: ${employee.branch.transmitter?.nombre}`,
        ],
      ],
      showHead: false,
      styles: {
        cellPadding: 1.5,
        fontSize: 10,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        valign: 'middle',
        minCellHeight: 6, // Altura mínima de la celda
      },
    });
    const finalY = (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable.finalY;

    autoTable(doc, {
      startY: finalY,
      columnStyles: {
        0: { cellWidth: 45.4 }, // Ancho fijo para la primera columna
        1: { cellWidth: 45.5 },
        2: { cellWidth: 45.4 },
        3: { cellWidth: 45.5 },
      },
      theme: 'grid',
      head: [['1', '2', '3', '4']],
      body: [[`Edad: ${employee.age}`, `Genero:`, 'Edad: 36', 'Genero: Masculino']],
      showHead: false,
      styles: {
        cellPadding: 1.4,
        fontSize: 10,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        valign: 'middle',
        minCellHeight: 6, // Altura mínima de la celda
      },
    });

    const finalY0 = (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable.finalY;

    autoTable(doc, {
      startY: finalY0,
      theme: 'grid',
      head: [['1', '2']],
      columnStyles: { 0: { cellWidth: 90.9 }, 1: { cellWidth: 90.9 } },
      body: [[`Estado Familiar:`, `Estado Civil: Soltero`]],
      showHead: false,
      styles: {
        cellPadding: 1.4,
        fontSize: 10,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        valign: 'middle',
        minCellHeight: 6,
      },
    });
    //  -----------------------------------------------Profesion u Oficio
    const finalY1 = (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable.finalY;

    autoTable(doc, {
      startY: finalY1,
      theme: 'grid',
      head: [['1', '2']],
      columnStyles: { 0: { cellWidth: 90.9 }, 1: { cellWidth: 90.9 } },
      body: [[`Profesión u Oficio según DUI:`, `Profesión u Oficio: Estudiante`]],
      showHead: false,
      styles: {
        cellPadding: 1.4,
        fontSize: 10,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        valign: 'middle',
        minCellHeight: 6,
      },
    });
    //  -----------------------------------------------Domicilio en el Municipio de
    const finalY2 = (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable.finalY;

    autoTable(doc, {
      startY: finalY2,
      theme: 'grid',
      head: [['1', '2']],
      columnStyles: { 0: { cellWidth: 90.9 }, 1: { cellWidth: 90.9 } },
      body: [
        [
          `Domicilio en el Municipio de: ${employee.address?.nombreMunicipio ?? ''}`,
          `Domicilio: 4ª calle oriente, Local 17, Centro Comercial Libertad Centro Histórico San Salvador, San Salvador`,
        ],
      ],
      showHead: false,
      styles: {
        cellPadding: 1.4,
        fontSize: 10,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        valign: 'middle',
        minCellHeight: 6,
      },
    });
    //  ----------------------------------------------- Dirección de Residencia
    const finalY3 = (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable.finalY;

    autoTable(doc, {
      startY: finalY3,
      theme: 'grid',
      head: [['1', '2']],
      columnStyles: { 0: { cellWidth: 90.9 }, 1: { cellWidth: 90.9 } },
      body: [
        [
          `Dirección de Residencia: ${employee.address?.complemento ?? ''}`,
          `Residencia: San Salvador, San Salvador`,
        ],
      ],
      showHead: false,
      styles: {
        cellPadding: 1.4,
        fontSize: 10,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        valign: 'middle',
        minCellHeight: 6,
      },
    });
    //  ----------------------------------------------- Nacionalidad
    const finalY4 = (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable.finalY;

    autoTable(doc, {
      startY: finalY4,
      theme: 'grid',
      head: [['1', '2']],
      columnStyles: { 0: { cellWidth: 90.9 }, 1: { cellWidth: 90.9 } },
      body: [[`Nacionalidad: Salvadoreña`, `Nacionalidad: Salvadoreña`]],
      showHead: false,
      styles: {
        cellPadding: 1.4,
        fontSize: 10,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        valign: 'middle',
        minCellHeight: 6,
      },
    });

    //  ----------------------------------------------- Documento Único de Identidad
    const finalY5 = (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable.finalY;

    autoTable(doc, {
      startY: finalY5,
      theme: 'grid',
      head: [['1', '2']],
      columnStyles: { 0: { cellWidth: 90.9 }, 1: { cellWidth: 90.9 } },
      body: [
        [
          `Documento Único de Identidad:  ${employee.dui ?? ''}`,
          `Documento Único de Identidad: 04182832-8`,
        ],
      ],
      showHead: false,
      styles: {
        cellPadding: 1.4,
        fontSize: 10,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        valign: 'middle',
        minCellHeight: 6,
        font: 'helvetica',
      },
    });
    //  ----------------------------------------------- Lugar y Fecha de Expedición:
    const finalY6 = (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable.finalY;

    autoTable(doc, {
      startY: finalY6,
      theme: 'grid',
      head: [['1', '2']],
      columnStyles: { 0: { cellWidth: 90.9 }, 1: { cellWidth: 90.9 } },
      body: [[`Lugar y Fecha de Expedición:`, `Fecha de Expedición: 22/07/2020`]],
      showHead: false,
      styles: {
        cellPadding: 1.4,
        fontSize: 10,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        valign: 'middle',
        minCellHeight: 6,
      },
    });
    //  ----------------------------------------------- Otro
    const finalY7 = (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable.finalY;

    autoTable(doc, {
      startY: finalY7,
      theme: 'grid',
      head: [['1', '2']],
      columnStyles: { 0: { cellWidth: 90.9 }, 1: { cellWidth: 90.9 } },
      body: [
        [
          `( Opcional) Otros Datos de Identificación ( sólo en casos necesarios o cualquier información adicional que se requiera de acuerdo al perfil): 
-Licencia de Conducir número : 
`,

          {
            content: 'Actuando en calidad de Representante Patronal y máxima autoridad',
            styles: { halign: 'left' },
          },
        ],
      ],
      showHead: false,
      styles: {
        cellPadding: 1.4,
        fontSize: 10,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        valign: 'middle',
        minCellHeight: 6,
      },
    });

    const finalYTable = (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable.finalY;

    // Secciones del contrato
    doc.setFontSize(10);
    //---------------------------------SECCION 1 DEL CONTRATO INDIVIDUAL DE TRABAJO
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Nosotros: SANTIAGO ALEXANDER RAMIREZ RIVERA y ANGELA MARIA ROSA ASCENCIO de las generales arriba indicadas y actuando en el carácter que aparece expresado, que en lo sucesivo también podemos ser designados como el “Trabajador” y el “Empleador”, convenimos en celebrar el presente Contrato Individual de Trabajo sujeto a las estipulaciones siguientes:',
      14,
      finalYTable + 8,
      {
        maxWidth: 180,
        align: 'justify',
      }
    );
    //--------------------------------SECCION 2 - LITERAL A - DEL CONTRATO INDIVIDUAL DE TRABAJO
    doc.setFont('helvetica', 'bold');
    doc.text(' a) CLASES DE TRABAJO O SERVICIOS QUE PRESTARÁ:', 14, finalYTable + 28, {
      maxWidth: 180,
      align: 'justify',
    });
    doc.setFont('helvetica', 'normal');
    doc.text(
      'El trabajador se obliga a prestar sus servicios a la Empresa con el cargo de: Agente de Ventas, cuyas funciones serán mantener en orden y limpias las instalaciones, asesoramiento y venta de prendas de vestir, accesorios u otros productos que se comercialicen, fidelizar y ampliar la cartera de clientes de la tienda, además las obligaciones que le impongan las Leyes Laborales, el Reglamento Interno de Trabajo y cualquier otra normativa laboral relacionada, tendrán como obligaciones propias de su cargos las establecidas en el Manual de Puestos y Funciones y colaborará con las demás actividades que le sean requeridas por el Jefe inmediato superior, por cualquier acuerdo tomado en las reuniones con las gerencias, reuniones mensuales con las jefaturas y otras relativas al cargo y funciones desempeñadas, asimismo el trabajador se compromete expresamente a prestar colaboración en cualesquiera actividades en general, que le sean requerida en la sucursal para el normal desarrollo y funcionamiento del mismo. ',
      14,
      finalYTable + 38,
      {
        maxWidth: 180,
        align: 'justify',
      }
    );
    //---------------------------------SECCION 3 - LITERAL B - DEL CONTRATO INDIVIDUAL DE TRABAJO
    doc.setFont('helvetica', 'bold');
    doc.text(' b)  DURACIÓN DEL CONTRATO Y TIEMPO DE SERVICIO:', 14, finalYTable + 84, {
      maxWidth: 180,
      align: 'justify',
    });
    doc.setFont('helvetica', 'normal');
    doc.text(
      'El presente Contrato se celebra del día TRES DE ENERO DE DOS MIL VEINTICUATRO– INDEFINIDAMENTE. El Empleador reconoce que cuando la prestación de los servicios haya precedido al otorgamiento por escrito del presente contrato, se reconocerá la fecha real de la iniciación de las labores para cualquier cálculo laboral. Queda estipulado para trabajadores de nuevo ingreso que los primeros treinta días serán de prueba y dentro de este término cualquiera de las partes podrá dar por terminado el Contrato, sin expresión de causa y responsabilidad alguna.',
      14,
      finalYTable + 92,
      {
        maxWidth: 180,
        align: 'justify',
      }
    );
    //salto de pagina
    doc.addPage();

    //---------------------------------SECCION 4 - LITERAL C -  DEL CONTRATO INDIVIDUAL DE TRABAJO
    doc.setFont('helvetica', 'bold');
    doc.text(' c)   LUGAR DE PRESTACIÓN DE SERVICIOS Y ALOJAMIENTO:', 14, 24, {
      maxWidth: 180,
      align: 'justify',
    });
    doc.setFont('helvetica', 'normal');
    doc.text(
      'El trabajador se obliga a prestar sus servicios a la Empresa con el cargo de: Agente de Ventas, cuyas funciones serán mantener en orden y limpias las instalaciones, asesoramiento y venta de prendas de vestir, accesorios u otros productos que se comercialicen, fidelizar y ampliar la cartera de clientes de la tienda, además las obligaciones que le impongan las Leyes Laborales, el Reglamento Interno de Trabajo y cualquier otra normativa laboral relacionada, tendrán como obligaciones propias de su cargos las establecidas en el Manual de Puestos y Funciones y colaborara con las demás actividades que le sean requeridas por el Jefe inmediato superior, por cualquier acuerdo tomado en las reuniones con las gerencias, reuniones mensuales con las jefaturas y otras relativas al cargo y funciones desempeñadas, asimismo el trabajador se compromete expresamente a prestar colaboración en cualesquiera actividades en general, que le sean requerida en la sucursal para el normal desarrollo y funcionamiento del mismo. ',
      14,
      31,
      {
        maxWidth: 180,
        align: 'justify',
      }
    );

    //---------------------------------SECCION 4 - LITERAL D - DEL CONTRATO INDIVIDUAL DE TRABAJO
    doc.setFont('helvetica', 'bold');
    doc.text(' d)  JORNADAS Y HORARIO DE TRABAJO:', 14, 76, {
      maxWidth: 180,
      align: 'justify',
    });

    doc.setFont('helvetica', 'normal');
    doc.text(
      'El Horario y su correspondiente Jornada Laboral serán de: 9:00 AM A 6:00 PM de sábado a miércoles, viernes de 2:00pm a 6:00 pm, descanso para tomar alimentos 1:00 pm a 2:00pm , únicamente podrán ejecutarse trabajos en horas extraordinarias si son autorizados por la jefatura inmediata, el cual deberá constar de forma escrita, dichas labores serán remuneradas con el correspondiente recargo de ley. ',
      14,
      84,
      {
        maxWidth: 180,
        align: 'justify',
      }
    );
    //---------------------------------SECCION 4 - LITERAL E - DEL CONTRATO INDIVIDUAL DE TRABAJO
    doc.setFont('helvetica', 'bold');
    doc.text(' e)  SALARIO: FORMA, PERÍODO Y LUGAR DE PAGO', 14, 106, {
      maxWidth: 180,
      align: 'justify',
    });

    doc.setFont('helvetica', 'normal');
    doc.text(
      'La forma de estipulación de salarios del trabajador será por Unidad de Tiempo y el salario que recibirá el trabajador, por sus servicios será la suma de $182.50 DÓLARES  DE LOS ESTADOS UNIDOS DE NORTEAMÉRICA,La operación de pago de salarios y prestaciones en dinero, se realizarán cada quince y el último día del correspondiente mes, y cuando estos días sean domingo o día festivo, el salario se cancelará el día hábil inmediato anterior. El pago se efectuará en moneda de curso legal, a elección del Empleador podrá cancelarlo en depósito electrónico en cuenta bancaria, en cheque o inclusive en efectivo de acuerdo a la facilidad administrativa que se considere más viable.',
      14,
      115,
      {
        maxWidth: 180,
        align: 'justify',
      }
    );

    //---------------------------------SECCION 5 - LITERAL F - DEL CONTRATO INDIVIDUAL DE TRABAJO
    doc.setFont('helvetica', 'bold');
    doc.text(' f)  HERRAMIENTAS Y MATERIALES', 14, 147, {
      maxWidth: 180,
      align: 'justify',
    });
    doc.setFont('helvetica', 'normal');
    doc.text(
      'La forma de estipulación de salarios del trabajador será por Unidad de Tiempo y el salario que recibirá el trabajador, por sus servicios será la suma de   $ 182.50 DOLARES DE LOS ESTADOS UNIDOS DE NORTEAMERICA,La operación de pago de salarios y prestaciones en dinero, se realizarán cada quince y el último día del correspondiente mes, y cuando estos días sean domingo o día festivo, el salario se cancelará el día hábil inmediato anterior. El pago se efectuará en moneda de curso legal, a elección del Empleador podrá cancelarlo en depósito electrónico en cuenta bancaria, en cheque o inclusive en efectivo de acuerdo a la facilidad administrativa que se considere más viable.',
      14,
      155,
      {
        maxWidth: 180,
        align: 'justify',
      }
    );

    autoTable(doc, {
      startY: 195,
      theme: 'grid',
      head: [['1', '2', '3']],
      columnStyles: { 0: { cellWidth: 60.6 }, 1: { cellWidth: 60.6 }, 2: { cellWidth: 60.6 } },
      body: [
        [
          { content: 'Nombre Completo', styles: { halign: 'center', fontStyle: 'bold' } },
          { content: 'Parentesco', styles: { halign: 'center', fontStyle: 'bold' } },
          { content: 'Dirección y/o teléfono', styles: { halign: 'center', fontStyle: 'bold' } },
        ],
        [``, ``, ``],
      ],
      showHead: false,
      styles: {
        cellPadding: 1.5,
        fontSize: 10,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        valign: 'middle',
        minCellHeight: 6, // Altura mínima de la celda
      },
    });
    const finalYTabale2 = (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable.finalY;

    autoTable(doc, {
      startY: finalYTabale2,
      theme: 'grid',
      head: [['1', '2', '3']],
      columnStyles: { 0: { cellWidth: 60.6 }, 1: { cellWidth: 60.6 }, 2: { cellWidth: 60.6 } },
      body: [[``, ``, ``]],
      showHead: false,
      styles: {
        cellPadding: 1.4,
        fontSize: 10,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        valign: 'middle',
        minCellHeight: 6,
      },
    });
    const finalYTabale3 = (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable.finalY;

    //---------------------------------SECCION 12 DEL CONTRATO INDIVIDUAL DE TRABAJO
    doc.setFont('helvetica', 'bold');
    doc.text(' g)  PERSONAS QUE DEPENDEN ECONÓMICAMENTE DEL TRABAJADOR', 14, 187, {
      maxWidth: 180,
      align: 'justify',
    });
    autoTable(doc, {
      startY: finalYTabale3,
      theme: 'grid',
      head: [['1', '2', '3']],
      columnStyles: { 0: { cellWidth: 60.6 }, 1: { cellWidth: 60.6 }, 2: { cellWidth: 60.6 } },
      body: [[``, ``, ``]],
      showHead: false,
      styles: {
        cellPadding: 1.4,
        fontSize: 10,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        valign: 'middle',
        minCellHeight: 6,
      },
    });
    const finalYTable2 = (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable.finalY;

    doc.setFont('helvetica', 'bold');
    doc.text(' h) OTRAS ESTIPULACIONES:', 14, finalYTable2 + 8, {
      maxWidth: 180,
      align: 'justify',
    });

    doc.setFont('helvetica', 'normal');
    doc.text(
      'El trabajador se obliga a que en todo momento debe existir respeto por sus autoridades superiores, asimismo y por tratarse su Empleador de un lugar de atención a clientes, deberá en todo momento de esmerarse en realizar cada una de sus funciones con un lenguaje adecuado, con los valores y principios básicos de un ser humano. En el presente Contrato Individual de Trabajo se entenderán incluidos, según el caso, los derechos y deberes laborales emanados de cualquier normativa laboral que exista en su vigencia o de cualquier otra que sea de obligatorio cumplimiento con fecha posterior. Este Contrato sustituye a cualquier otro Convenio Individual de trabajo anterior, ya sea escrito o verbal, que haya estado vigente entre la Empresa y el Trabajador.',
      14,
      239,
      {
        maxWidth: 180,
        align: 'justify',
      }
    );

    //salto de pagina
    doc.addPage();
    doc.setFont('helvetica', 'normal');
    doc.text(
      'En fe de lo cual firmamos el presente documento por triplicado en Santa Ana, 01 de julio de 2024. ',
      14,
      24,
      {
        maxWidth: 180,
        align: 'justify',
      }
    );

    // Posición y estilo para la primera firma
    doc.text('F._______________________________', 20, 24 + 24); // Línea para firma
    doc.setFont('helvetica', 'bold'); // Cambiar a negrita
    doc.text('SANTIAGO ALEXANDER RAMIREZ RIVERA', 25, 24 + 32); // Nombre en negrita

    // Posición y estilo para la segunda firma
    doc.setFont('helvetica', 'normal'); // Volver a estilo normal para la línea
    doc.text('F._______________________________', 120, 24 + 24); // Línea para firma
    doc.setFont('helvetica', 'bold'); // Cambiar a negrita para el nombre
    doc.text('ANGELA MARIA ROSA ASCENCIO', 125, 24 + 32); // Nombre en negrita

    // Posición y estilo para el campo "SELLO"
    doc.setFont('helvetica', 'normal'); // Estilo normal para el texto "SELLO"
    doc.text('SELLO:', 220, finalYTable + 20); // Campo de sello

    // Guardar el PDF
    window.open(doc.output('bloburl'), '_blank');
  };

  return (
    <ButtonUi
      isIconOnly
      showTooltip
      className="border border-white"
      theme={Colors.Info}
      tooltipText='Contrato de Trabajo'
      onPress={() => OpenPdf()}
    >
      <FileText size={20} />
    </ButtonUi>
  );
}

export default ContractPDF;

