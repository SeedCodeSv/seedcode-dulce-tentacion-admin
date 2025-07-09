import { UseDisclosureProps } from '@heroui/react';
import { Dispatch, SetStateAction } from 'react';

import { User } from '../../../types/users.types';

export interface IMobileViewProps {
  DeletePopover: ({ user }: { user: User }) => JSX.Element;
  openEditModal: (user: User) => void;
  openKeyModal: (user: User) => void;
  actions: string[];
  handleActivate: (id: number) => void;
  setSelectedId: Dispatch<SetStateAction<number>>
  generateCodeModal: UseDisclosureProps
}

export interface GridProps extends IMobileViewProps {
  user: User;
}

export interface IPropsSearchUser {
  nameUser: (name: string) => void;
  nameRol: (name: string) => void;
  active: boolean;
  setActive: (active: boolean) => void;

}
