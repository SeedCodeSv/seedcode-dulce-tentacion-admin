export interface IGetAccountCatalog {
    ok: boolean
    accountCatalogs: AccountCatalog[]
   
    total: number;
    totalPag: number;
    currentPag: number;
    nextPag: number;
    prevPag: number;
    status: number;
  }
  
  export interface AccountCatalog {
    id: number
    code: string
    name: string
    majorAccount: string
    accountLevel: string
    accountType: string
    uploadAs: string
    subAccount: boolean
    item: string
    isActive: boolean
  }
  