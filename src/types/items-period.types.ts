export interface IFindPeriod {
  period: Period;
  ok: boolean;
}

export interface Period {
  id: number;
  branches: number[];
  startDate: string;
  endDate: string;
  item: Item;
}

export interface Item {
  id: number;
  noPartida: number;
  date: string;
  concepOfTheItem: string;
  totalDebe: string;
  totalHaber: string;
  difference: string;
  isActive: boolean;
  correlative: string;
  typeOfAccountId: number;
  transmitterId: number;
}
