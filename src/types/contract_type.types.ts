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
export interface Action {
  id: number;
  action: {
    id: number;
    name: string;
    view: {
      id: number;
      name: string;
    };
  };
  role: {
    id: number;
    name: string;
  };
}

export interface GroupedAction {
  moduleName: string;
  actions: string[];
  role: string;
}
