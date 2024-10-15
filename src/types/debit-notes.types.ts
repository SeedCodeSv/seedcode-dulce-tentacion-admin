export interface Debit {
    id: number;
    pathJson: string;
    sale: {
      id: number;
    };
  }
  
  export interface IGetDebitNote {
    ok: boolean;
    status: number;
    debit: Debit;
  }
  
  export interface Sale {
    id: number;
  }
  
  export interface NotaDebito {
    id: number;
    numeroControl: string;
    codigoGeneracion: string;
    fecEmi: string;
    horEmi: string;
    sale: Sale;
  }
  
  export interface IRecentDebitNotes {
    ok: boolean;
    status: number;
    notaDebito: NotaDebito[];
  }
  
  export interface AnnulationSalePayload {
    nameResponsible: string;
    nameApplicant: string;
    docNumberResponsible: string;
    docNumberApplicant: string;
    typeDocResponsible: string;
    typeDocApplicant: string;
  }

  export interface DebitContingence {
	id: number;
	numeroControl: string;
	codigoGeneracion: string;
	tipoDte: string;
	fecEmi: string;
	horEmi: string;
	selloRecibido: string;
	selloInvalidacion?: any;
	sello: boolean;
	totalNoSuj: string;
	ivaPerci1: string;
	descuNoSuj: string;
	totalLetras: string;
	ivaRete1: string;
	subTotalVentas: string;
	subTotal: string;
	reteRenta: string;
	descuExenta: string;
	totalDescu: string;
	descuGravada: string;
	totalGravada: string;
	montoTotalOperacion: string;
	totalExenta: string;
	pathPdf: string;
	pathJson: string;
	isActivated: boolean;
	saleId: number;
	salesStatusId: number;
}

export interface IGetAllDebitNotes {
	ok: boolean;
	status: number;
	debits: DebitContingence[];
}
  