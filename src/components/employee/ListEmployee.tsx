import { useContext, useEffect, useState } from 'react';
import { useEmployeeStore } from '../../store/employee.store';
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
} from '@nextui-org/react';
import {
  TrashIcon,
  Table as ITable,
  CreditCard,
  List,
  EditIcon,
  User,
  Phone,
  RefreshCcw,
  FileText,
  Lock,
  ScanBarcode,
  Store,
} from 'lucide-react';

import { Employee, EmployeePayload } from '../../types/employees.types';
import AddButton from '../global/AddButton';
import Pagination from '../global/Pagination';
import { ThemeContext } from '../../hooks/useTheme';
import MobileView from './MobileView';
import AddEmployee from './AddEmployee';
import { global_styles } from '../../styles/global.styles';
import classNames from 'classnames';
import { useBranchesStore } from '../../store/branches.store';
import { limit_options } from '../../utils/constants';
import SmPagination from '../global/SmPagination';
import HeadlessModal from '../global/HeadlessModal';
import { useNavigate } from 'react-router';
import UpdateEmployee from './UpdateEmployee';
import TooltipGlobal from '../global/TooltipGlobal';
import NO_DATA from '@/assets/svg/no_data.svg';
import useWindowSize from '@/hooks/useWindowSize';
import { useAuthStore } from '@/store/auth.store';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import SearchEmployee from './search_employee/SearchEmployee';
import ProofSalary from './employees-pdfs/ProofSalary';
import { fechaActualString } from '@/utils/dates';
import ProofeOfEmployment from './employees-pdfs/ProofeOfEmployment';

interface Props {
  actions: string[];
}

function ListEmployee({ actions }: Props) {
  const { theme } = useContext(ThemeContext);
  const style = {
    backgroundColor: theme.colors.dark,
    color: theme.colors.primary,
  };
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

  const changePage = () => {
    getEmployeesPaginated(
      Number(user?.correlative.branch.transmitterId),
      1,
      limit,
      firstName,
      firstLastName,
      branch,
      phone,
      codeEmployee,
      active ? 1 : 0
    );
  };

  useEffect(() => {
    getBranchesList();
    getEmployeesPaginated(
      Number(user?.correlative.branch.transmitterId),
      1,
      limit,
      firstName,
      firstLastName,
      branch,
      phone,
      codeEmployee,
      active ? 1 : 0
    );
  }, [limit, active]);

  const handleActivate = (id: number) => {
    activateEmployee(id).then(() => {
      getEmployeesPaginated(
        Number(user?.correlative.branch.transmitterId),
        1,
        limit,
        '',
        '',
        '',
        '',
        '',
        active ? 1 : 0
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
          id={(id) => setDataUpdate({ ...dataUpdate, id: id })}
          data={dataUpdate as unknown as Employee}
        />
      ) : (
        <>
          <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
            <div className="w-full h-full border border-white p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
              <div className="flex justify-between items-end ">
                <SearchEmployee
                  branchName={(e) => setBranch(e)}
                  phoneEmployee={(e) => setPhone(e)}
                  nameEmployee={(e) => setFirstName(e)}
                ></SearchEmployee>
                {actions.includes('Agregar') && (
                  <AddButton
                    onClick={() => {
                      modalAdd.onOpen();
                      navigate('/AddEmployee');
                      setSelectedEmployee(undefined);
                    }}
                  />
                )}
              </div>
              <div className="hidden w-full gap-5 md:flex">
                <div className="grid w-full grid-cols-4 gap-3">
                  <Input
                    classNames={{
                      label: 'font-semibold text-gray-700',
                      inputWrapper: 'pr-0',
                    }}
                    labelPlacement="outside"
                    label="Nombre"
                    className="w-full dark:text-white border border-white rounded-xl"
                    placeholder="Buscar por nombre..."
                    startContent={<User />}
                    variant="bordered"
                    name="searchName"
                    id="searchName"
                    value={firstName}
                    autoComplete="search"
                    onChange={(e) => setFirstName(e.target.value)}
                    isClearable
                    onClear={() => setFirstName('')}
                  />

                  <Input
                    classNames={{
                      label: 'font-semibold text-gray-700',
                      inputWrapper: 'pr-0',
                    }}
                    labelPlacement="outside"
                    label="Código"
                    className="w-full dark:text-white border border-white rounded-xl"
                    placeholder="Buscar por código..."
                    startContent={<ScanBarcode />}
                    variant="bordered"
                    name="searchCodeEmployee"
                    id="searchNameCodeEmployee"
                    value={codeEmployee}
                    autoComplete="search"
                    onChange={(e) => setCodeEmployee(e.target.value)}
                    isClearable
                    onClear={() => setCodeEmployee('')}
                  />
                  <Input
                    classNames={{
                      label: 'font-semibold text-gray-700',
                      inputWrapper: 'pr-0',
                    }}
                    labelPlacement="outside"
                    label="Teléfono"
                    placeholder="Buscar por teléfono..."
                    startContent={<Phone size={20} />}
                    className="w-full dark:text-white border border-white rounded-xl"
                    variant="bordered"
                    name="searchPhone"
                    value={phone}
                    id="searchPhone"
                    onChange={(e) => setPhone(e.target.value)}
                    isClearable
                    onClear={() => setPhone('')}
                  />
                  <div className="w-full">
                    <label className="font-semibold dark:text-white text-sm">Sucursal</label>
                    <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          setBranch(key as string);
                        }
                      }}
                      startContent={<Store />}
                      className="w-full dark:text-white border border-white rounded-xl"
                      labelPlacement="outside"
                      placeholder="Selecciona una sucursal"
                      variant="bordered"
                      defaultSelectedKey={branch}
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      clearButtonProps={{
                        onClick: () => setBranch(''),
                      }}
                    >
                      {branch_list.map((bra) => (
                        <AutocompleteItem
                          value={bra.name}
                          className="dark:text-white"
                          key={bra.name}
                        >
                          {bra.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div>
                    <Input
                      type="date"
                      onChange={(e) => setStartDate(e.target.value)}
                      defaultValue={startDate}
                      variant="bordered"
                      labelPlacement="outside"
                      classNames={{
                        base: 'font-semibold dark:text-white text-sm',
                        label: 'font-semibold dark:text-white text-sm',
                      }}
                      label="Fecha Inicial"
                      className="w-full dark:text-white  rounded-xl"
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      onChange={(e) => setEndDate(e.target.value)}
                      defaultValue={endDate}
                      variant="bordered"
                      labelPlacement="outside"
                      classNames={{
                        base: 'font-semibold dark:text-white text-sm',
                        label: 'font-semibold dark:text-white text-sm',
                      }}
                      label="Fecha Final"
                      className="w-full dark:text-white  rounded-xl"
                    />
                  </div>
                  <Button
                    style={{
                      backgroundColor: theme.colors.secondary,
                      color: theme.colors.primary,
                    }}
                    className="hidden mt-6 font-semibold md:flex border border-white"
                    color="primary"
                    onClick={() => changePage()}
                  >
                    Buscar
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-3 lg:flex-row lg:justify-between lg:gap-10">
                <div className="flex justify-start order-2 lg:order-1">
                  <div className="xl:mt-10">
                    <Switch
                      onValueChange={(active) => setActive(active)}
                      isSelected={active}
                      classNames={{
                        thumb: classNames(active ? 'bg-blue-500' : 'bg-gray-400'),
                        wrapper: classNames(active ? '!bg-blue-300' : 'bg-gray-200'),
                      }}
                    >
                      <span className="text-sm sm:text-base whitespace-nowrap">
                        Mostrar {active ? 'inactivos' : 'activos'}
                      </span>
                    </Switch>
                  </div>
                </div>
                <div className="flex gap-10 w-full justify-between items-center lg:justify-end order-1 lg:order-2">
                  <div className="w-44">
                    <label className="font-semibold dark:text-white text-sm">Mostrar</label>
                    <Select
                      className="w-44 dark:text-white border border-white rounded-xl"
                      variant="bordered"
                      defaultSelectedKeys={['5']}
                      labelPlacement="outside"
                      classNames={{
                        label: 'font-semibold',
                      }}
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value !== '' ? e.target.value : '5'));
                      }}
                    >
                      {limit_options.map((option) => (
                        <SelectItem key={option} value={option} className="dark:text-white">
                          {option}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <ButtonGroup className="mt-4 border xl:hidden border-white rounded-xl">
                    <Button
                      isIconOnly
                      color="default"
                      style={{
                        backgroundColor: view === 'grid' ? theme.colors.third : '#e5e5e5',
                        color: view === 'grid' ? theme.colors.primary : '#3e3e3e',
                      }}
                      onClick={() => setView('grid')}
                    >
                      <CreditCard />
                    </Button>
                    <Button
                      isIconOnly
                      color="default"
                      style={{
                        backgroundColor: view === 'list' ? theme.colors.third : '#e5e5e5',
                        color: view === 'list' ? theme.colors.primary : '#3e3e3e',
                      }}
                      onClick={() => setView('list')}
                    >
                      <List />
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup className="mt-4 border xl:flex hidden border-white rounded-xl">
                    <Button
                      className=""
                      isIconOnly
                      color="secondary"
                      style={{
                        backgroundColor: view === 'table' ? theme.colors.third : '#e5e5e5',
                        color: view === 'table' ? theme.colors.primary : '#3e3e3e',
                      }}
                      onClick={() => setView('table')}
                    >
                      <ITable />
                    </Button>
                    <Button
                      isIconOnly
                      color="default"
                      style={{
                        backgroundColor: view === 'grid' ? theme.colors.third : '#e5e5e5',
                        color: view === 'grid' ? theme.colors.primary : '#3e3e3e',
                      }}
                      onClick={() => setView('grid')}
                    >
                      <CreditCard />
                    </Button>
                    <Button
                      isIconOnly
                      color="default"
                      style={{
                        backgroundColor: view === 'list' ? theme.colors.third : '#e5e5e5',
                        color: view === 'list' ? theme.colors.primary : '#3e3e3e',
                      }}
                      onClick={() => setView('list')}
                    >
                      <List />
                    </Button>
                  </ButtonGroup>
                </div>
              </div>

              {(view === 'grid' || view === 'list') && (
                <MobileView
                  OpenPdf={(employee) => {
                    OpenPdf(employee);
                  }}
                  deletePopover={DeletePopover}
                  openEditModal={(employee) => {
                    setDataUpdate(employee);
                  }}
                  layout={view as 'grid' | 'list'}
                  actions={actions}
                  handleActivate={handleActivate}
                />
              )}
              {view === 'table' && (
                <>
                  <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
                    <table className="w-full">
                      <thead className="sticky top-0 z-20 bg-white">
                        <tr>
                          <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                            No.
                          </th>
                          <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                            Nombre
                          </th>
                          <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                            Apellido
                          </th>
                          <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                            Teléfono
                          </th>
                          <th className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                            Sucursal
                          </th>
                          <th className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="max-h-[600px] w-full overflow-y-auto">
                        {loading_employees ? (
                          <tr>
                            <td colSpan={5} className="p-3 text-sm text-center text-slate-500">
                              <div className="flex flex-col items-center justify-center w-full h-64">
                                <div className="loader"></div>
                                <p className="mt-3 text-xl font-semibold">Cargando...</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <>
                            {employee_paginated.employees.length > 0 ? (
                              <>
                                {employee_paginated.employees.map((employee) => (
                                  <tr className="border-b border-slate-200">
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
                                    <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                                      <div className="flex w-full gap-5">
                                        {employee.isActive && actions.includes('Editar') ? (
                                          <>
                                            <TooltipGlobal text="Editar">
                                              <Button
                                                className="border border-white"
                                                onClick={() => {
                                                  setDataUpdate(employee);

                                                  // setIsOpenModalUpdate(true);
                                                }}
                                                isIconOnly
                                                style={{
                                                  backgroundColor: theme.colors.secondary,
                                                }}
                                              >
                                                <EditIcon
                                                  style={{
                                                    color: theme.colors.primary,
                                                  }}
                                                  size={20}
                                                />
                                              </Button>
                                            </TooltipGlobal>
                                          </>
                                        ) : (
                                          <Button
                                            type="button"
                                            disabled
                                            style={{
                                              backgroundColor: theme.colors.secondary,
                                            }}
                                            className="flex font-semibold border border-white  cursor-not-allowed"
                                            isIconOnly
                                          >
                                            <Lock />
                                          </Button>
                                        )}

                                        {actions.includes('Eliminar') && employee.isActive ? (
                                          <DeletePopover employee={employee} />
                                        ) : (
                                          <Button
                                            type="button"
                                            disabled
                                            style={{
                                              backgroundColor: theme.colors.danger,
                                            }}
                                            className="flex font-semibold border border-white  cursor-not-allowed"
                                            isIconOnly
                                          >
                                            <Lock />
                                          </Button>
                                        )}
                                        {actions.includes('Contrato de Trabajo') &&
                                        employee.isActive ? (
                                          <TooltipGlobal text="Generar Contrato de Trabajo">
                                            <Button
                                              className="border border-white"
                                              onClick={() => OpenPdf(employee)}
                                              isIconOnly
                                              style={{
                                                backgroundColor: theme.colors.dark,
                                              }}
                                            >
                                              <FileText
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

                                        {!employee.isActive && (
                                          <>
                                            {actions.includes('Activar') ? (
                                              <TooltipGlobal text="Activar">
                                                <Button
                                                  className="border border-white"
                                                  onClick={() => handleActivate(employee.id)}
                                                  isIconOnly
                                                  style={global_styles().thirdStyle}
                                                >
                                                  <RefreshCcw />
                                                </Button>
                                              </TooltipGlobal>
                                            ) : (
                                              <Button
                                                type="button"
                                                disabled
                                                style={global_styles().thirdStyle}
                                                className="flex font-semibold border border-white  cursor-not-allowed"
                                                isIconOnly
                                              >
                                                <Lock />
                                              </Button>
                                            )}
                                          </>
                                        )}
                                        <ProofSalary employee={employee}></ProofSalary>

                                        <ProofeOfEmployment
                                          employee={employee} actions={actions}
                                        ></ProofeOfEmployment>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </>
                            ) : (
                              <tr>
                                <td colSpan={5}>
                                  <div className="flex flex-col items-center justify-center w-full">
                                    <img src={NO_DATA} alt="X" className="w-32 h-32" />
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
                      previousPage={employee_paginated.prevPag}
                      nextPage={employee_paginated.nextPag}
                      currentPage={employee_paginated.currentPag}
                      totalPages={employee_paginated.totalPag}
                      onPageChange={(page) => {
                        getEmployeesPaginated(
                          Number(user?.correlative.branch.transmitterId),
                          page,
                          limit,
                          firstName,
                          firstLastName,
                          branch,
                          phone,
                          codeEmployee,
                          active ? 1 : 0
                        );
                      }}
                    />
                  </div>
                  <div className="flex w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-lg p-3">
                    <SmPagination
                      handleNext={() => {
                        getEmployeesPaginated(
                          Number(user?.correlative.branch.transmitterId),
                          employee_paginated.nextPag,
                          limit,
                          firstName,
                          firstLastName,
                          branch,
                          phone,
                          codeEmployee,
                          active ? 1 : 0
                        );
                      }}
                      handlePrev={() => {
                        getEmployeesPaginated(
                          Number(user?.correlative.branch.transmitterId),
                          employee_paginated.prevPag,
                          limit,
                          firstName,
                          firstLastName,
                          branch,
                          phone,
                          codeEmployee,
                          active ? 1 : 0
                        );
                      }}
                      currentPage={employee_paginated.currentPag}
                      totalPages={employee_paginated.totalPag}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <HeadlessModal
            isOpen={modalAdd.isOpen}
            onClose={modalAdd.onClose}
            title={selectedEmployee ? 'Editar Empleado' : 'Agregar Empleado'}
            size="w-[350px] md:w-full"
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
  const { theme } = useContext(ThemeContext);

  const { deleteEmployee } = useEmployeeStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    await deleteEmployee(employee.id);
    onClose();
  };

  return (
    <>
      <Popover
        className="border border-white rounded-2xl"
        isOpen={isOpen}
        onClose={onClose}
        backdrop="blur"
        showArrow
      >
        <PopoverTrigger>
          <Button
            className="border border-white"
            onClick={onOpen}
            isIconOnly
            style={{
              backgroundColor: theme.colors.danger,
            }}
          >
            <TooltipGlobal text="Eliminar">
              <TrashIcon
                style={{
                  color: theme.colors.primary,
                }}
                size={20}
              />
            </TooltipGlobal>
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
            <div className="mt-4">
              <Button className="border border-white" onClick={onClose}>
                No, cancelar
              </Button>
              <Button
                onClick={() => handleDelete()}
                className="ml-5 border border-white"
                style={{
                  backgroundColor: theme.colors.danger,
                  color: theme.colors.primary,
                }}
              >
                Si, eliminar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
