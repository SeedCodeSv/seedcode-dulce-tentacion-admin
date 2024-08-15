export interface FEMonth {
    day: number
    firstCorrelative: null | string
    lastCorrelative: null | string
    firstNumeroControl: string
    lastNumeroControl: string
    totalSales: number
  }
  
  export interface IGetFacturasByMonth {
    ok: boolean
    salesByDay: FEMonth[]
    status: number
  }
  