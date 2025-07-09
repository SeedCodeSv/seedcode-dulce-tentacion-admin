export const hexToRgba = (hex: string, alpha: number = 1): string => {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '');

  // Parse r, g, b values
  let r = 0,
    g = 0,
    b = 0;

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    throw new Error('Invalid hex format');
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const returnTitleByPathname = (pathname: string) => {
  switch (pathname) {
    case '/products':
      return 'PRODUCTOS';
    case '/categories':
      return 'CATEGORÍAS';
    case '/sub-categories':
      return 'SUB-CATEGORÍAS';
    case '/production-orders':
      return 'ORDENES DE PRODUCCIÓN';
    case '/order-products':
      return 'ORDENES DE PRODUCTO';
    case '/shopping':
      return 'COMPRAS';
    case '/inventary-adjustment':
      return 'AJUSTE DE INVENTARIO';
    case '/purchase-orders':
      return 'ORDENES DE COMPRA';
    case '/note-referal':
      return 'NOTAS DE REMISIÓN';
    case '/users':
      return 'USUARIOS';
    case '/employees':
      return 'EMPLEADOS';
    case '/suppliers':
      return 'PROVEEDORES';
    case '/branches':
      return 'SUCURSALES';
    case '/clients':
      return 'CLIENTES';
    case '/action-rol':
      return 'ACCIONES POR ROL';
    case '/points-of-sales':
      return 'PUNTOS DE VENTA';
    case '/sales':
      return 'VENTAS';
    case '/sales-by-period':
      return 'VENTAS POR PERIODO';
    case '/reports/sales-by-product':
      return 'VENTAS POR PRODUCTO';
    case '/contingence-section':
      return 'SECCIÓN DE CONTINGENCIA';
    case '/OP-report':
      return 'REPORTE DE ORDENES DE PRODUCCIÓN';
    case '/products-selled':
      return 'PRODUCTOS VENDIDOS';
    case '/movement':
      return 'MOVIMIENTOS DE INVENTARIO';
    case '/kardex':
      return 'KARDEX';
    case '/cash-cuts':
      return 'CORTES DE CAJA';
    case '/list-invalidations':
      return 'LISTA DE INVALIDACIONES';
    case '/credit-notes':
      return 'NOTAS DE CRÉDITO';
    case '/debit-notes':
      return 'NOTAS DE DÉBITO';
    case '/study-level':
      return 'NIVEL DE ESTUDIO';
    case '/contract-types':
      return 'TIPOS DE CONTRATO';
    case '/status-employee':
      return 'ESTADO DE EMPLEADO';
    case '/anexos-iva-compras':
      return 'ANEXOS IVA COMPRAS';
    case '/anexos-fe/anexos-fe':
      return 'ANEXOS FE';
    case '/anexos-ccfe/anexos-ccfe':
      return 'ANEXOS CCFE';
    case '/iva/shopping-book':
      return 'LIBRO DE IVA DE COMPRAS';
    case '/iva/ccf-book':
      return 'LIBRO DE IVA DE CCF';
    case '/iva/fe-book':
      return 'LIBRO DE IVA DE FE';
    case '/cash-cuts-big-z':
      return 'CORTES DE CAJA GRAN Z';
    case '/cash-cuts-z':
      return 'CORTES DE CAJA Z';
    case '/cash-cuts-x':
      return 'CORTES DE CAJA X';
    case '/correlative':
      return 'CORRELATIVO';
    case '/account-catalogs':
      return 'CATÁLOGO DE CUENTAS';
    case '/type-accounting':
      return 'TIPOS DE CUENTAS';
    case '/accounting-items':
      return 'PARTIDAS CONTABLES';
    case '/report-accounting':
      return 'REPORTES   CONTABLES';

    //added
    case '/':
      return 'INICIO';
    case '/add-production-order':
      return 'AGREGAR ORDEN DE PRODUCCIÓN';
    case '/add-product':
      return 'AGREGAR PRODUCTO';
    case '/order-products-nota':
      return 'NOTA DE REMISIÓN';
    case '/order-products-production':
      return 'ORDEN DE PRODUCCIÓN - PRODUCTOS';
    case '/add-account-catalog':
      return 'AGREGAR CATÁLOGO DE CUENTAS';
    case '/create-shopping':
      return 'CREAR COMPRA';
    case '/add-employee':
      return 'AGREGAR EMPLEADO';
    case '/add-supplier-normal':
      return 'AGREGAR PROVEEDOR';
    case '/update-supplier-normal/:id':
      return 'ACTUALIZAR PROVEEDOR';
    case '/add-supplier-tribute':
      return 'AGREGAR PROVEEDOR TRIBUTARIO';
    case '/update-supplier-tribute/:id':
      return 'ACTUALIZAR PROVEEDOR TRIBUTARIO';
    case '/add-client-contributor/:id':
      return 'EDITAR CLIENTE CONTRIBUYENTE';
    case '/add-client':
      return 'AGREGAR CLIENTE';
    case '/add-customer/:id/:type':
      return 'EDITAR CLIENTE';
    case '/add-client-contributor':
      return 'AGREGAR CLIENTE CONTRIBUYENTE';
    case '/update-client-contributor/:id':
      return 'ACTUALIZAR CLIENTE CONTRIBUYENTE';
    case '/add-promotions':
      return 'AGREGAR PROMOCIÓN';
    case '/add-product-recipe/:id/:recipe':
      return 'AGREGAR RECETA DE PRODUCTO';
    case '/list-referal-notes':
      return 'NUEVA NOTA DE REMISIÓN';
    case '/get-debit-note/:id':
      return 'NOTA DE DÉBITO';
    case '/get-credit-note/:id':
      return 'NOTA DE CRÉDITO';
    case '/annulation/:tipoDte/:id':
      return 'ANULACIÓN';
    case '/edit-shopping/:id/:controlNumber':
      return 'EDITAR COMPRA';
    case '/update-account-catalog/:id':
      return 'EDITAR CATÁLOGO DE CUENTAS';
    case '/edit-transmitter-info':
      return 'EDITAR DATOS DEL EMISOR';
    case '/add-accounting-items':
      return 'AGREGAR PARTIDA CONTABLE';
    case '/add-item-by-sales':
      return 'AGREGAR PARTIDA DESDE VENTA';
    case '/edit-accounting-items/:id':
      return 'EDITAR PARTIDA CONTABLE';
    case '/anexos-doc-anulados':
      return 'ANEXO DOCUMENTOS ANULADOS';
    case '/anexos-compras-sujetoexcluido':
      return 'ANEXO COMPRAS SUJETO EXCLUIDO';
    case '/verificar-faltantes':
      return 'VERIFICADOR DE CORRELATIVOS';
    case '/add-purchase-order':
      return 'AGREGAR ORDEN DE COMPRA';
    case '/update-purchase-detail/:purchaseId':
      return 'EDITAR DETALLE DE COMPRA';
    case '/add-product-purchase-order':
      return 'AGREGAR PRODUCTO A ORDEN DE COMPRA';
    case '/MWSC':
      return 'CONTROL DE EXISTENCIAS';
    case '/create-branch-product/:id':
      return 'CREAR PRODUCTO POR SUCURSAL';
    case '/birthday-calendar':
      return 'CUMPLEAÑOS DE EMPLEADOS';
    case '/configuration':
      return 'CONFIGURACIÓN';
    case '/production-report':
      return 'REPORTE DE PRODUCCIÓN';
    case '/shipping-report':
      return 'REPORTE DE ENVIOS';

    default:
      return 'Dulce Tentación';
  }
};
