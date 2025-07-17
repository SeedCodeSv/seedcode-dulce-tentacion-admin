
export interface IResponseCut {
    dataBoxes: DataBoxCut[]
    ok: boolean
    status: number
    message: string
}

export interface DataBoxCut {
    box: Box,
    totalExentos01: number
    totalExentos03: number
    totalGravada01: number
    totalGravada03: number
    subTotal01: number
    subTotal03: number
    totalNoSuj01: number
    totalNoSuj03: number
    totalSales01Cash: number
    totalSales01Card: number
    firtsSale: string
    lastSale: string
    totalSales03Cash: any
    totalSales03Card: any
    firtsSale03: any
    lastSale03: any
    invalidation01: any
    invalidation03: any
    firstInvalidation01: any
    firstInvalidation03: any
    lastInvalidation01: any
    lastInvalidation03: any
    employees: Employee[]
    totalsEmployees: TotalsEmployees
    categories: Categories
    cut: Cut
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
    pointOfSale: PointOfSale
    pointOfSaleId: number
}

export interface PointOfSale {
    id: number
    code: string
    typeVoucher: string
    description: string
    resolution: string
    serie: string
    from: string
    to: string
    prev: number
    next: number
    codPuntoVentaMH: any
    codPuntoVenta: string
    isActive: boolean
    branchId: number
}

export interface Employee {
    employeeId: number
    employeeName: string
    saleCount: string
    totalSales: string
}

export interface TotalsEmployees {
    totalSalesAmount: number
    totalSaleCount: number
}

export interface Categories {
    list: List[]
    totalGeneral: string
    totalQuantityGeneral: number
}

export interface List {
    category: string
    quantity: number
    total: string
}

export interface Cut {
    id: number
    date: string
    typeCut: string
    time: string
    zCutRatioAtZero: string
    numberCut: number
    initialF: string
    finalF: string
    ivaF: string
    totalF: string
    initialCF: string
    finalCF: string
    ivaCF: string
    totalCF: string
    ivaInvF: string
    totalInvF: string
    ivaInvCF: string
    totalInvCF: string
    total: string
    writtenTotal: string
    diference: string
    totalCash: string
    totalCard: string
    totalOthers: string
    pettyCash: string
    box: Box2
    employee: Employee2
    boxId: number
    employeeId: number
}

export interface Box2 {
    id: number
    start: string
    end: string
    totalSales: string
    totalExpense: string
    totalIva: string
    date: string
    time: string
    isActive: boolean
    pointOfSaleId: number
}

export interface Employee2 {
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
    codeCutZ: string
    codeReferal: string
    salary: string
    dateOfBirth: string
    dateOfEntry: string
    dateOfExit: any
    responsibleContact: string
    isActive: boolean
    isResponsibleCutZ: boolean
    chargeId: number
    branchId: number
    employeeStatusId: number
    studyLevelId: number
    contractTypeId: number
    addressId: any
}
