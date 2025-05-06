import { IPagination } from "./global.types"

export interface GetProductionOrders extends IPagination {
    productionOrders: ProductionOrder[]
  }
  
  export interface ProductionOrder {
    id: number
    statusOrder: string
    observations: string
    moreInformation: string
    date: string
    time: string
    endDate: string
    endTime: string
    destinationBranch: DestinationBranch
    receptionBranch: ReceptionBranch
    employee: Employee
    productionOrderType: ProductionOrderType
    productionOrderTypeId: number
    employeeOrderId: number
    receptionBranchId: number
    destinationBranchId: number
  }
  
  export interface DestinationBranch {
    id: number
    name: string
    address: string
    phone: string
    isActive: boolean
    codEstableMH: string
    codEstable: string
    tipoEstablecimiento: string
    transmitterId: number
  }
  
  export interface ReceptionBranch {
    id: number
    name: string
    address: string
    phone: string
    isActive: boolean
    codEstableMH: string
    codEstable: string
    tipoEstablecimiento: string
    transmitterId: number
  }
  
  export interface Employee {
    id: number
    firstName: string
    secondName: string
    firstLastName: string
    secondLastName: string
    bankAccount: string
    nit: string
    dui: string
    isss: string
    afp: string
    code: string
    phone: string
    age: number
    salary: string
    dateOfBirth: string
    dateOfEntry: string
    dateOfExit: string
    responsibleContact: string
    isActive: boolean
    chargeId: number
    branchId: number
    employeeStatusId: number
    studyLevelId: number
    contractTypeId: number
    addressId: number
  }
  
  export interface ProductionOrderType {
    id: number
    name: string
    isActive: boolean
  }
  