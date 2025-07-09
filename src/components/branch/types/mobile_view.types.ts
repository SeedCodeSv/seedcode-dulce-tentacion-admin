import { Branches } from '../../../types/branches.types';

export interface MobileViewProps {
  actions: string[];
  layout: 'grid' | 'list';
  deletePopover: ({ branch }: { branch: Branches }) => JSX.Element;
  handleEdit: (branch: Branches) => void;
  handleBranchProduct: (id: number) => void;
  handleBox: (branch: Branches) => void;
  handleActive: (id: number) => void;
  handlePointOfSales?: (id: number) => void
  handleInactive?: (branches: Branches) => void
}

export interface GridProps extends MobileViewProps {
  branch: Branches;
}
export interface IPropsSearchBranch {
  nameBranch: (name: string) => void;
  phoneBranch: (phone: string) => void;
  addressBranch: (address: string) => void;
}
