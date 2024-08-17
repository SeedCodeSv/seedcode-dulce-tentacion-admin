export interface FEMonth {
    day: number
    firstCorrelative: null | string
    lastCorrelative: null | string
    firstNumeroControl: string
    lastNumeroControl: string
    totalSales: number
    type: "F" | "T"
    code: string
  }
  
  export interface IGetFacturasByMonth {
    ok: boolean
    salesByDay: FEMonth[]
    status: number
  }
  