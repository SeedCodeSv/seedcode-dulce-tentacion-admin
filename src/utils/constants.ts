export const API_URL = import.meta.env.VITE_API_URL
export const WS_URL = import.meta.env.VITE_WS_URL
export const FACTURACION_API = 'https://cats-facturacion-43ay7.ondigitalocean.app/api';
export const MH_QUERY = import.meta.env.VITE_MH_QUERY
export const ambiente = import.meta.env.VITE_AMBIENTE_MH
export const version = 2;
export const API_FIRMADOR = import.meta.env.VITE_API_FIRMADOR;
export const MH_DTE = import.meta.env.VITE_MH_DTE;
export const MH_URL = import.meta.env.VITE_MH_URL;
export const AUTH_MH = import.meta.env.VITE_AUTH_MH;
export const CHECK_URL = import.meta.env.VITE_CHECK_URL;
export const SPACES_BUCKET = import.meta.env.VITE_SPACES_BUCKET;
export const VITE_MH_FILTERS = import.meta.env.VITE_MH_FILTERS

export const messages = {
  error: 'Ocurrió un error al procesar la petición',
  success: 'Petición procesada con éxito',
};
export const limit_options = ['5', '10', '20', '30', '40', '50', '75', '100'];
export const priority = ['LOW', 'MEDIUM', 'HIGH'];
export const typesDocumento = [
  { value: 1, name: 'DUI', code: '13' },
  { value: 2, name: 'PASAPORTE', code: '03' },
  { value: 3, name: 'NIT', code: '36' },
  { value: 4, name: 'CARNET DE RESIDENTE', code: '02' },
  { value: 5, name: 'OTRO', code: '37' },
];
export const Tipos_Promotions = ['Productos', 'Categorias', 'Sucursales'];
export const operadores = [
  { label: '= igual', value: '=' },
  { label: '> mayor', value: '>' },
  { label: '< menor', value: '<' },
  { label: '>= mayor o igual', value: '>=' },
  { label: '<= menor o igual', value: '<=' },
];
export const typeOrden = [
  { label: 'Ascendente', value: 'ASC' },
  { label: 'Descendente', value: 'DESC' }
];

export const Motivos_Complet = [
  { label: "Satisfactorio", value: '00' },
  { label: "Normal", value: "01" }
]
export const defaultTheme = {
  name: 'theme1',
  context: 'dark',
  colors: {
    danger: '#e57373',
    primary: '#f4b6ba',
    secondary: '#a5d6a7',
    third: '#f4a261',
    warning: '#d38b19',
    dark: '#000814',
  },
};

export const CRP = import.meta.env.VITE_CRP;

export const views_enabled = [
  'Usuarios',
  'Inicio',
  'Inicio de ventas',
  'Productos',
  'Permisos',
  'Categorias',
  'Cargos',
  'Sub Categorias',
  'Sucursales',
  'Empleados',
  'Clientes',
  'Reportes',
  'Categoria de gastos',
  'Gastos',
  'Ventas',
  'Reporte de ventas',
  'Modulos',
  'Proveedores',
  'Ordenes de compra',
  'Descuentos',
  'Creditos de clientes',
  'Nivel de estudio',
  'Estado del empleado',
  'Tipo de contratacion',
  'Sub Categorias',
  'Cargos de Empleados',
];

export const views_seller = [
  'Inicio de ventas',
  'Gastos',
  'Ventas',
  'Productos',
  'Reporte de ventas',
  'Creditos de clientes',
];

export const months = [
  { value: 1, name: 'Enero' },
  { value: 2, name: 'Febrero' },
  { value: 3, name: 'Marzo' },
  { value: 4, name: 'Abril' },
  { value: 5, name: 'Mayo' },
  { value: 6, name: 'Junio' },
  { value: 7, name: 'Julio' },
  { value: 8, name: 'Agosto' },
  { value: 9, name: 'Septiembre' },
  { value: 10, name: 'Octubre' },
  { value: 11, name: 'Noviembre' },
  { value: 12, name: 'Diciembre' },
];

export const sending_steps = [
  {
    label: 'Firmando el documento',
    description: 'Espere mientras se firma el documento',
  },
  {
    label: 'Validando en hacienda',
    description: 'Hacienda esta validando el documento',
  },
  {
    label: 'Guardando DTE',
    description: 'Estamos guardando el documento',
  },
];

export const contingence_steps = [
  {
    label: 'Firmando lote de contingencia',
    description: 'Espere mientras se firma el lote de contingencia',
  },
  {
    label: 'Validando en hacienda',
    description: 'Hacienda esta validando el lote de contingencia',
  },
  {
    label: 'Enviando DTEs',
    description: 'Estamos enviando el lote de DTEs',
  },
];


export const typesProduct = ['PRODUCTO DE VENTA', 'INSUMO/INGREDIENTE'];