export interface IGetItemsDates {
    items: Item[]
    ok: boolean
  }
  
  export interface Item {
    id: number
    noPartida: number
    date: string
    concepOfTheItem: string
    totalDebe: string
    totalHaber: string
    difference: string
    isActive: boolean
    correlative: string
    typeOfAccountId: number
    transmitterId: number
    details: Detail[]
  }
  
  export interface Detail {
    id: number
    numberItem: string
    conceptOfTheTransaction: string
    should: string
    see: string
    isActive: boolean
    accountCatalog: AccountCatalog
    accountCatalogId: number
    branchId: number
    itemId: number
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
  