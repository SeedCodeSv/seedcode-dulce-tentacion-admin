export interface Correlativo {
	id: number;
	codigo: string;
	nombreDte: string;
	anterior: string;
	siguiente: string;
	isActive: boolean;
	emisorId: number;
}

export interface IGetCorrelativesByTransmitter {
	ok: boolean;
	status: number;
	correlativo: Correlativo;
}