import { IGetUserPaginated, User, UserPayload, UserUpdate } from '../../types/users.types';

export interface UsersStore {
  users: User[];
  users_paginated: IGetUserPaginated;
  active_filter: number;
  loading_users: boolean;
  saveUsers: (users: User[]) => void;
  getUsers: () => void;
  postUser: (payload: UserPayload) => Promise<boolean>;
  patchUser: (payload: UserUpdate, id: number) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
  updatePassword: (id: number, password: string) => Promise<boolean>;
  activateUser: (id: number) => Promise<void>;
  getUsersPaginated: (
    transmitter: number,
    page: number,
    limit: number,
    userName: string,
    role: string,
    active?: number
  ) => Promise<void>;
}
