export interface ZCashCutsResponse {
    Ticket: {
        inicio: number;
        fin: number;
        total: number;
    };
    Factura: {
        inicio: number;
        fin: number;
        total: number;
    };
    CreditoFiscal: {
        inicio: number;
        fin: number;
        total: number;
    };
    DevolucionNC: {
        inicio: number;
        fin: number;
        total: number;
    };
    DevolucionT: {
        inicio: number;
        fin: number;
        total: number;
    };
    totalGeneral: number;
}
export interface ZCashCutsRequest {
    ok: boolean
    data: ZCashCutsResponse
    status: number
}


export interface IZCashCutsStore {
    data: ZCashCutsResponse
    OnGetCashCutsZ: ( startDate?: string, endDate?: string) => void

}




export interface CloseZ {
    posId: number;
    numberCut: number;
    inicioTkt: number;
    finTkt: number;
    typeCut : string
    totalTkt: number;
    inicioF: number;
    finF: number;
    totalF: number;
    inicioCF: number;
    finCF: number;
    totalCF: number
    inicioDevNC: number;
    finDevNC: number
    totalDevNC: number;
    ivaDevTkt: number;
    totalDevTkt: number;
    totalGeneral: number;
  }
  