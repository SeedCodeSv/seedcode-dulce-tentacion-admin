
import { ContractType } from "../../types/contract_type.types";

export interface IContractTypeStore{
    contract_type: ContractType[];
    GetContractType: () => void;
}