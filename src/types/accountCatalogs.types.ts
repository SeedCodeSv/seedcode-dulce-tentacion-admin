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
export interface IGetAccountCatalogUpdate {
  ok: boolean
  accountCatalogs: AccountCatalog
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


export interface AccountCatalogPayload {
 
  code: string
  hasSub: boolean
  item: string
  level: string
  loadAs: string
  majorAccount: string
  name: string
  type: string

}

