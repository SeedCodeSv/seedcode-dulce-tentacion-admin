export interface ContractType {
  id: number;
  name: string;
  isActive: boolean;
}

export interface IGetContractType {
  ok: boolean;
  status: number;
  contractTypes: ContractType[];
}
