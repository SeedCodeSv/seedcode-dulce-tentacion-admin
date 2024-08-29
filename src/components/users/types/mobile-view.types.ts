import { User } from '../../../types/users.types';

export interface IMobileViewProps {
  layout: 'grid' | 'list';
  deletePopover: ({ user }: { user: User }) => JSX.Element;
  openEditModal: (user: User) => void;
  openKeyModal: (user: User) => void;
  actions: string[];
  handleActivate: (id: number) => void;
}

export interface GridProps extends IMobileViewProps {
  user: User;
}

export interface IPropsSearchUser {
  nameUser: (name: string) => void;
  nameRol: (name: string) => void;
}
