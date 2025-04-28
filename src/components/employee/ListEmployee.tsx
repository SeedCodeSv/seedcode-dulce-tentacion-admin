import { useEffect, useState } from 'react';
import {
  Button,
  Input,
  useDisclosure,
  Select,
  SelectItem,
  ButtonGroup,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Autocomplete,
  AutocompleteItem,
  Switch,
} from '@heroui/react';
import {
  Table as ITable,
  CreditCard,
  EditIcon,
  User,
  Phone,
  RefreshCcw,
  FileText,
  ScanBarcode,
  Store,
  Trash,
} from 'lucide-react';
import classNames from 'classnames';
import { useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { useEmployeeStore } from '../../store/employee.store';
import { Employee, EmployeePayload } from '../../types/employees.types';
import AddButton from '../global/AddButton';
import Pagination from '../global/Pagination';
import { global_styles } from '../../styles/global.styles';
import { useBranchesStore } from '../../store/branches.store';
import { limit_options } from '../../utils/constants';
import SmPagination from '../global/SmPagination';
import HeadlessModal from '../global/HeadlessModal';

import AddEmployee from './AddEmployee';
import MobileView from './MobileView';
import UpdateEmployee from './update-employee';
import SearchEmployee from './search_employee/SearchEmployee';
import ProofSalary from './employees-pdfs/ProofSalary';
import ProofeOfEmployment from './employees-pdfs/ProofeOfEmployment';

import NO_DATA from '@/assets/svg/no_data.svg';
import useWindowSize from '@/hooks/useWindowSize';
import { useAuthStore } from '@/store/auth.store';
import { fechaActualString } from '@/utils/dates';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ThGlobal from '@/themes/ui/th-global';
import useThemeColors from '@/themes/use-theme-colors';

interface Props {
  actions: string[];
}

function ListEmployee({ actions }: Props) {
  const { user } = useAuthStore();
  const { getEmployeesPaginated, employee_paginated, activateEmployee, loading_employees } =
    useEmployeeStore();
  const [startDate, setStartDate] = useState(fechaActualString);
  const [endDate, setEndDate] = useState(fechaActualString);
  const [firstName, setFirstName] = useState('');
  const [firstLastName] = useState('');
  const [branch, setBranch] = useState('');
  const [phone, setPhone] = useState('');
  const [limit, setLimit] = useState(5);
  const [codeEmployee, setCodeEmployee] = useState('');
  const { windowSize } = useWindowSize();
  const [view, setView] = useState<'table' | 'grid' | 'list'>(
    windowSize.width < 768 ? 'grid' : 'table'
  );
  const [active, setActive] = useState(true);

  const { getBranchesList, branch_list } = useBranchesStore();
  const modalAdd = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>();

  const [isDate, setDate] = useState(false);
  const changePage = () => {
    getEmployeesPaginated(
      Number(
        user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0
      ),
      1,
      limit,
      firstName,
      firstLastName,
      branch,
      phone,
      codeEmployee,
      active ? 1 : 0,
      isDate ? startDate : '',
      isDate ? endDate : ''
    );
  };

  useEffect(() => {
    getBranchesList();
    getEmployeesPaginated(
      Number(
        user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0
      ),
      1,
      limit,
      firstName,
      firstLastName,
      branch,
      phone,
      codeEmployee,
      active ? 1 : 0,
      '',
      ''
    );
  }, [limit, active]);

  const handleActivate = (id: number) => {
    activateEmployee(id).then(() => {
      getEmployeesPaginated(
        Number(
          user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0
        ),
        1,
        limit,
        '',
        '',
        '',
        '',
        '',
        active ? 1 : 0,
        startDate,
        endDate
      );
    });
  };
  const navigate = useNavigate();
  const OpenPdf = (employee: Employee) => {
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

  //estado para capturar ;la data actualizada
  const [dataUpdate, setDataUpdate] = useState<EmployeePayload>({
    firstName: '',
    secondName: '',
    firstLastName: '',
    secondLastName: '',
    bankAccount: '',
    chargeId: 0,
    nit: '',
    dui: '',
    isss: '',
    afp: '',
    code: '',
    phone: '',
    age: '',
    salary: '',
    dateOfBirth: '',
    dateOfEntry: '',
    dateOfExit: '',
    responsibleContact: '',
    statusId: 0,
    // addressId: 0,
    studyLevelId: 0,
    contractTypeId: 0,
    department: '',
    departmentName: '',
    municipality: '',
    municipalityName: '',
    complement: '',
    branchId: 0,
  });

  return (
    <>
      {dataUpdate.id ? (
        <UpdateEmployee
          data={dataUpdate as unknown as Employee}
          id={(id) => setDataUpdate({ ...dataUpdate, id: id })}
        />
      ) : (
        <>
          <div className=" w-full h-full bg-white dark:bg-gray-900">
            <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
              <div className="flex justify-between items-end ">
                <SearchEmployee
                  branchName={(e) => setBranch(e)}
                  codeEmpleyee={(e) => setCodeEmployee(e)}
                  endDate={(e) => setEndDate(e)}
                  nameEmployee={(e) => setFirstName(e)}
                  phoneEmployee={(e) => setPhone(e)}
                  startDate={(e) => setStartDate(e)}
                 />
                {actions.includes('Agregar') && (
                  <AddButton
                    onClick={() => {
                      modalAdd.onOpen();
                      navigate('/add-employee');
                      setSelectedEmployee(undefined);
                    }}
                  />
                )}
              </div>
              <div className="hidden w-full gap-5 md:flex">
                <div className="grid w-full grid-cols-4 gap-3">
                  <Input
                    isClearable
                    autoComplete="search"
                    className="w-full dark:text-white border border-white rounded-xl"
                    classNames={{
                      label: 'font-semibold text-gray-700',
                      inputWrapper: 'pr-0',
                    }}
                    id="searchName"
                    label="Nombre"
                    labelPlacement="outside"
                    name="searchName"
                    placeholder="Buscar por nombre..."
                    startContent={<User />}
                    value={firstName}
                    variant="bordered"
                    onChange={(e) => setFirstName(e.target.value)}
                    onClear={() => setFirstName('')}
                  />

                  <Input
                    isClearable
                    autoComplete="search"
                    className="w-full dark:text-white border border-white rounded-xl"
                    classNames={{
                      label: 'font-semibold text-gray-700',
                      inputWrapper: 'pr-0',
                    }}
                    id="searchNameCodeEmployee"
                    label="Código"
                    labelPlacement="outside"
                    name="searchCodeEmployee"
                    placeholder="Buscar por código..."
                    startContent={<ScanBarcode />}
                    value={codeEmployee}
                    variant="bordered"
                    onChange={(e) => setCodeEmployee(e.target.value)}
                    onClear={() => setCodeEmployee('')}
                  />
                  <Input
                    isClearable
                    className="w-full dark:text-white border border-white rounded-xl"
                    classNames={{
                      label: 'font-semibold text-gray-700',
                      inputWrapper: 'pr-0',
                    }}
                    id="searchPhone"
                    label="Teléfono"
                    labelPlacement="outside"
                    name="searchPhone"
                    placeholder="Buscar por teléfono..."
                    startContent={<Phone size={20} />}
                    value={phone}
                    variant="bordered"
                    onChange={(e) => setPhone(e.target.value)}
                    onClear={() => setPhone('')}
                  />

                  <div className="w-full">
                    <span className="font-semibold dark:text-white text-sm">Sucursal</span>
                    <Autocomplete
                      className="w-full dark:text-white border border-white rounded-xl"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      clearButtonProps={{
                        onClick: () => setBranch(''),
                      }}
                      defaultSelectedKey={branch}
                      labelPlacement="outside"
                      placeholder="Selecciona una sucursal"
                      startContent={<Store />}
                      variant="bordered"
                      onSelectionChange={(key) => {
                        if (key) {
                          setBranch(key as string);
                        }
                      }}
                    >
                      {branch_list.map((bra) => (
                        <AutocompleteItem key={bra.name} className="dark:text-white">
                          {bra.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  {isDate && (
                    <>
                      <div>
                        <span className="font-semibold dark:text-white text-sm">
                          Fecha Inicial
                        </span>

                        <Input
                          className="w-full dark:text-white  rounded-xl border border-white"
                          classNames={{
                            base: 'font-semibold dark:text-white text-sm',
                            label: 'font-semibold dark:text-white text-sm',
                          }}
                          defaultValue={startDate}
                          labelPlacement="outside"
                          type="date"
                          variant="bordered"
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <span className="font-semibold dark:text-white text-sm">Fecha Final</span>
                        <Input
                          className="w-full dark:text-white  rounded-xl border border-white"
                          classNames={{
                            base: 'font-semibold dark:text-white text-sm',
                            label: 'font-semibold dark:text-white text-sm',
                          }}
                          defaultValue={endDate}
                          labelPlacement="outside"
                          type="date"
                          variant="bordered"
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                  <ButtonUi
                    className="hidden mt-6 font-semibold md:flex border border-white"
                    color="primary"
                    theme={Colors.Primary}
                    onPress={() => changePage()}
                  >
                    Buscar
                  </ButtonUi>

                  <ButtonUi
                    className="hidden mt-6 font-semibold md:flex border border-white"
                    theme={Colors.Primary}
                    onPress={() => setDate(!isDate)}
                  >
                    Filtrar Fechas
                  </ButtonUi>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10">
                <div className="flex justify-between order-2 lg:order-1">
                  <div className="xl:mt-10">
                    <Switch
                      classNames={{
                        thumb: classNames(active ? 'bg-blue-500' : 'bg-gray-400'),
                        wrapper: classNames(active ? '!bg-blue-300' : 'bg-gray-200'),
                      }}
                      isSelected={active}
                      onValueChange={(active) => setActive(active)}
                    >
                      <span className="text-sm sm:text-base whitespace-nowrap">
                        Mostrar {active ? 'inactivos' : 'activos'}
                      </span>
                    </Switch>
                  </div>
                  {actions.includes('Cumpleaños') && (
                    <ButtonUi
                      className="xl:hidden md:hidden border border-white"
                      theme={Colors.Primary}
                      onPress={() => navigate('/birthday-calendar')}
                    >
                      <p className="text-sm sm:text-base">Cumpleaños</p>
                    </ButtonUi>
                  )}
                </div>
                <div className="flex gap-10 w-full justify-between items-center lg:justify-end order-1 lg:order-2">
                  {actions.includes('Cumpleaños') && (
                    <ButtonUi
                      className=" xl:flex md:flex hidden border mt-7 border-white"
                      theme={Colors.Primary}
                      onPress={() => navigate('/birthday-calendar')}
                    >
                      <p className="text-sm sm:text-base">Cumpleaños</p>
                    </ButtonUi>
                  )}

                  <div className="w-44">
                    <span className="font-semibold dark:text-white text-sm">Mostrar</span>
                    <Select
                      className="w-44 dark:text-white border border-white rounded-xl"
                      classNames={{
                        label: 'font-semibold',
                      }}
                      defaultSelectedKeys={['5']}
                      labelPlacement="outside"
                      value={limit}
                      variant="bordered"
                      onChange={(e) => {
                        setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                      }}
                    >
                      {limit_options.map((option) => (
                        <SelectItem key={option} className="dark:text-white">
                          {option}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <ButtonGroup className="mt-4">
                    <ButtonUi
                      isIconOnly
                      theme={view === 'table' ? Colors.Primary : Colors.Default}
                      onPress={() => setView('table')}
                    >
                      <ITable />
                    </ButtonUi>
                    <ButtonUi
                      isIconOnly
                      theme={view === 'grid' ? Colors.Primary : Colors.Default}
                      onPress={() => setView('grid')}
                    >
                      <CreditCard />
                    </ButtonUi>
                  </ButtonGroup>
                </div>
              </div>

              {(view === 'grid' || view === 'list') && (
                <MobileView
                  DeletePopover={DeletePopover}
                  WorkConstancy={(employee) => OpenPdf(employee)}
                  actions={actions}
                  handleActivate={handleActivate}
                  openEditModal={(employee) => {
                    setDataUpdate(employee);
                  }}
                />
              )}
              {view === 'table' && (
                <>
                  <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
                    <table className="w-full">
                      <thead className="sticky top-0 z-20 bg-white">
                        <tr>
                          <ThGlobal className="text-left p-3">No.</ThGlobal>
                          <ThGlobal className="text-left p-3">Nombre</ThGlobal>
                          <ThGlobal className="text-left p-3">Apellido</ThGlobal>
                          <ThGlobal className="text-left p-3">Teléfono</ThGlobal>
                          <ThGlobal className="text-left p-3">Sucursal</ThGlobal>
                          <ThGlobal className="text-left p-3">Codigo</ThGlobal>
                          <ThGlobal className="text-left p-3">Acciones</ThGlobal>
                        </tr>
                      </thead>
                      <tbody className="max-h-[600px] w-full overflow-y-auto">
                        {loading_employees ? (
                          <tr>
                            <td className="p-3 text-sm text-center text-slate-500" colSpan={5}>
                              <div className="flex flex-col items-center justify-center w-full h-64">
                                <div className="loader" />
                                <p className="mt-3 text-xl font-semibold">Cargando...</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <>
                            {employee_paginated.employees.length > 0 ? (
                              <>
                                {employee_paginated.employees.map((employee, key) => (
                                  <tr key={key} className="border-b border-slate-200">
                                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                      {employee.id}
                                    </td>
                                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                      {employee.firstName} {employee.secondName}
                                    </td>
                                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100 whitespace-nowrap">
                                      {employee.firstLastName} {employee.secondLastName}
                                    </td>
                                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                      {employee.phone}
                                    </td>
                                    <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100">
                                      {employee.branch.name}
                                    </td>
                                    <td className="p-3 text-sm text-slate-500 whitespace-nowrap dark:text-slate-100">
                                      {employee.code}
                                    </td>
                                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                      <div className="flex w-full gap-5">
                                        {employee.isActive && actions.includes('Editar') && (
                                          <>
                                            <ButtonUi
                                              isIconOnly
                                              className="border border-white"
                                              theme={Colors.Success}
                                              onClick={() => {
                                                setDataUpdate(employee);
                                              }}
                                            >
                                              <EditIcon size={20} />
                                            </ButtonUi>
                                          </>
                                        )}

                                        {actions.includes('Eliminar') && employee.isActive && (
                                          <DeletePopover employee={employee} />
                                        )}
                                        {actions.includes('Contrato de Trabajo') &&
                                          employee.isActive && (
                                            <ButtonUi
                                              isIconOnly
                                              className="border border-white"
                                              theme={Colors.Info}
                                              onPress={() => OpenPdf(employee)}
                                            >
                                              <FileText size={20} />
                                            </ButtonUi>
                                          )}

                                        {!employee.isActive && (
                                          <>
                                            {actions.includes('Activar') && (
                                              <Button
                                                isIconOnly
                                                className="border border-white"
                                                style={global_styles().thirdStyle}
                                                onPress={() => handleActivate(employee.id)}
                                              >
                                                <RefreshCcw />
                                              </Button>
                                            )}
                                          </>
                                        )}
                                        <ProofSalary
                                          actions={actions}
                                          employee={employee}
                                         />

                                        <ProofeOfEmployment
                                          actions={actions}
                                          employee={employee}
                                         />
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </>
                            ) : (
                              <tr>
                                <td colSpan={5}>
                                  <div className="flex flex-col items-center justify-center w-full">
                                    <img alt="X" className="w-32 h-32" src={NO_DATA} />
                                    <p className="mt-3 text-xl">No se encontraron resultados</p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              {employee_paginated.totalPag > 1 && (
                <>
                  <div className="hidden w-full mt-5 md:flex">
                    <Pagination
                      currentPage={employee_paginated.currentPag}
                      nextPage={employee_paginated.nextPag}
                      previousPage={employee_paginated.prevPag}
                      totalPages={employee_paginated.totalPag}
                      onPageChange={(page) => {
                        getEmployeesPaginated(
                          Number(
                            user?.correlative?.branch.transmitterId ??
                              user?.pointOfSale?.branch.transmitterId ??
                              0
                          ),
                          page,
                          limit,
                          firstName,
                          firstLastName,
                          branch,
                          phone,
                          codeEmployee,
                          active ? 1 : 0,
                          isDate ? startDate : '',
                          isDate ? endDate : ''
                        );
                      }}
                    />
                  </div>
                  <div className="flex w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-lg p-3">
                    <SmPagination
                      currentPage={employee_paginated.currentPag}
                      handleNext={() => {
                        getEmployeesPaginated(
                          Number(
                            user?.correlative?.branch.transmitterId ??
                              user?.pointOfSale?.branch.transmitterId ??
                              0
                          ),
                          employee_paginated.nextPag,
                          limit,
                          firstName,
                          firstLastName,
                          branch,
                          phone,
                          codeEmployee,
                          active ? 1 : 0,
                          isDate ? startDate : '',
                          isDate ? endDate : ''
                        );
                      }}
                      handlePrev={() => {
                        getEmployeesPaginated(
                          Number(
                            user?.correlative?.branch.transmitterId ??
                              user?.pointOfSale?.branch.transmitterId ??
                              0
                          ),
                          employee_paginated.prevPag,
                          limit,
                          firstName,
                          firstLastName,
                          branch,
                          phone,
                          codeEmployee,
                          active ? 1 : 0,
                          isDate ? startDate : '',
                          isDate ? endDate : ''
                        );
                      }}
                      totalPages={employee_paginated.totalPag}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <HeadlessModal
            isOpen={modalAdd.isOpen}
            size="w-[350px] md:w-full"
            title={selectedEmployee ? 'Editar Empleado' : 'Agregar Empleado'}
            onClose={modalAdd.onClose}
          >
            <AddEmployee />
          </HeadlessModal>
        </>
      )}
    </>
  );
}
export default ListEmployee;

interface PopProps {
  employee: Employee;
}

export const DeletePopover = ({ employee }: PopProps) => {
  const { deleteEmployee } = useEmployeeStore();
  const deleteDisclosure = useDisclosure();

  const handleDelete = async () => {
    await deleteEmployee(employee.id);
    deleteDisclosure.onClose();
  };

  const style = useThemeColors({ name: Colors.Error });

  return (
    <>
      <Popover
        className="border border-white rounded-2xl"
        {...deleteDisclosure}
        showArrow
        backdrop="blur"
      >
        <PopoverTrigger>
          <Button isIconOnly style={style}>
            <Trash />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col items-center justify-center w-full p-5">
            <p className="font-semibold text-gray-600 dark:text-white">
              Eliminar {employee.firstName}
            </p>
            <p className="mt-3 text-center text-gray-600 dark:text-white w-72">
              ¿Estas seguro de eliminar este registro?
            </p>
            <div className="flex justify-center mt-4 gap-5">
              <ButtonUi
                className="border border-white"
                theme={Colors.Default}
                onPress={deleteDisclosure.onClose}
              >
                No, cancelar
              </ButtonUi>
              <ButtonUi theme={Colors.Error} onPress={() => handleDelete()}>
                Si, eliminar
              </ButtonUi>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
