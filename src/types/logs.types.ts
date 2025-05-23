export interface Logs {
  message: string;
  title: string;
  generationCode: string;
  table: string;
}

export interface Log {
  id: number;
  title: string;
  message: string;
  date: string;
  time: string;
  generationCode: string;
  isActive: boolean;
  table:string
}

export interface IGetLogByNumber {
  ok: boolean;
  logs: Log[];
  status: number;
}
