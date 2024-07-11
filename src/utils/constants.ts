  // export const API_URL = 'https://shark-app-wcoqq.ondigitalocean.app/api';
 export const WS_URL = 'ws://shark-app-wcoqq.ondigitalocean.app/sales-gateway';
export const FACTURACION_API = 'https://cats-facturacion-43ay7.ondigitalocean.app/api';
export const MH_QUERY = 'https://admin.factura.gob.sv/consultaPublica';
export const ambiente = '00';
export const version = 2;
 export const API_URL = 'http://localhost:8080/api';

// export const WS_URL = 'ws://shark-app-wcoqq.ondigitalocean.app/sales-gateway';
export const API_FIRMADOR = 'https://firmadorseedcodesv.online/firmardocumento/';
export const MH_DTE = 'https://apitest.dtes.mh.gob.sv/fesv/recepciondte';
export const MH_URL = 'https://apitest.dtes.mh.gob.sv/fesv/';
export const AUTH_MH = 'https://apitest.dtes.mh.gob.sv/seguridad/auth';
export const CHECK_URL = 'https://apitest.dtes.mh.gob.sv/fesv/recepcion/consultadte/';
export const messages = {
  error: 'Ocurrió un error al procesar la petición',
  success: 'Petición procesada con éxito',
};

export const limit_options = ['5', '10', '20', '30', '40', '50', '75', '100'];

export const priority = ['LOW', 'MEDIUM', 'HIGH'];

export const Tipos_Promotions = ['Productos', 'Categorias', 'Sucursales'];
// export const operadores = ['=', '>', '<', '>=', '<='];

export const operadores = [
  { label: '= igual', value: '=' },
  { label: '> mayor', value: '>' },
  { label: '< menor', value: '<' },
  { label: '>= mayor o igual', value: '>=' },
  { label: '<= menor o igual', value: '<=' },
];

export const defaultTheme = {
  name: 'theme1',
  context: 'dark',
  colors: {
    danger: '#e63946',
    primary: '#f1faee',
    secondary: '#5eb8e0',
    third: '#457b9d',
    warning: '#f35b04',
    dark: '#1d3557',
  },
};

export const CRP = 'YzJhxGPKCwc7dxyhsgst ';

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
];

export const views_seller = [
  'Inicio de ventas',
  'Gastos',
  'Ventas',
  'Productos',
  'Reporte de ventas',
  'Creditos de clientes',
];
