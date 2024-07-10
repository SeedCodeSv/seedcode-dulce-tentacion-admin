import { ContractType } from '../../../../types/contract_type.types';

export interface MobileViewProps {
  layout: 'grid' | 'list';
  deletePopover: ({ ContractTypes }: { ContractTypes: ContractType }) => JSX.Element;
  handleEdit: (ContractTypes: ContractType) => void;
  actions: string[];
  handleActive: (id: number) => void;
}

export interface GridProps {
  ContractTypes: ContractType;
  layout: 'grid' | 'list';
  deletePopover: ({ ContractTypes }: { ContractTypes: ContractType }) => JSX.Element;
  handleEdit: (ContractTypes: ContractType) => void;
  actions: string[];
  handleActive: (id: number) => void;
}
