export interface IGetContractTypePaginated {
    ok: boolean
    contractTypes: ContractType[]
    total: number
    totalPag: number
    currentPag: number
    nextPag: number
    prevPag: number
    status: number
  }
  
  export interface ContractType {
    id: number
    name: string
    isActive: boolean
  }
  