export interface IGetStatusEmployeePaginated {
    ok: boolean
    employeeStatus: statusEmployee[]
    total: number
    totalPag: number
    currentPag: number
    nextPag: number
    prevPag: number
    status: number
  }
  
  export interface statusEmployee {
    id: number
    name: string
    isActive: boolean
  }
  