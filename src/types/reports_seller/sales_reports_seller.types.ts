//report sales by category
export interface SaleCategory {
    category: string
    quantity: string
    total: string
  }
  
  export interface IGetSalesByCategory {
    ok: boolean
    categories: SaleCategory[]
  }
  
  //report sales by year
  export interface SaleYear {
    month: number
    total: number
  }
  
  export interface IGetSalesByYear {
    ok: boolean
    sales: SaleYear[]
  }
  //Report sales by product and branch
  export interface SaleByProduct {
    branchProduct: {
      name: string
      code: string
      price: string
      id: number
    }
    quantity: string
    total: string
  }
  export interface IGetReportSalesByProduct {
    ok: boolean
    products: SaleByProduct[]
  }
  
  //Report sales by days
  export interface SaleByDay {
    day: number
    total: number
  }
  
  export interface IGetReportSalesByDay {
    ok: boolean
    salesByDay: SaleByDay[]
  }
  
  export interface ISalesByDay {
    day: string
    total: string
  }
  
  export interface IResponseSalesDay {
    ok: boolean
    salesByDay: ISalesByDay[]
  }
  
  export interface Branch {
    id: number
    name: string
    address: string
    phone: string
    isActive: boolean
    transmitterId: number
  }
  export interface Box {
    id: number
    start: string
    end: string
    totalSales: string
    totalExpense: string
    totalIva: string
    date: string
    time: string
    isActive: boolean
    branch: Branch
    branchId: number
  }
  
  export interface SaleTableDay {
    id: number
    numeroControl: string
    codigoGeneracion: string
    tipoDte: string
    fecEmi: string
    horEmi: string
    selloRecibido: string
    selloInvalidacion: string
    sello: boolean
    codeEmployee: string
    totalNoSuj: string
    totalExenta: string
    totalGravada: string
    subTotalVentas: string
    descuNoSuj: string
    descuExenta: string
    descuGravada: string
    porcentajeDescuento: string
    totalDescu: string
    subTotal: string
    totalIva: string
    montoTotalOperacion: string
    totalPagar: string
    totalLetras: string
    pathPdf: string
    pathJson: string
    isActivated: boolean
    box: Box
    boxId: number
    customerId: number
    employeeId: number
    paymentTypeId?: any
    salesStatusId?: any
  }
  
  export interface IGetSalesByDayTable {
    ok: boolean
    sales: SaleTableDay[]
    expenses: number
    total: number
  }
  