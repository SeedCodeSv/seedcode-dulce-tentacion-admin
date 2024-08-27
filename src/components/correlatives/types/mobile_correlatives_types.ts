import { Correlatives } from '@/types/correlatives.types';

export interface IMobileViewProps {
  layout: 'grid' | 'list';

  openEditModal: (correlative: Correlatives) => void;

  actions: string[];
}

export interface GridProps extends IMobileViewProps {
  correlative: Correlatives;
}

export interface IPropsSearchCorrelative {
  typeVoucher: (name: string) => void;
  branchName: (name: string) => void;
}
