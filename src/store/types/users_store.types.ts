import { IGetUserPaginated, User, UserPayload } from "../../types/users.types";

export interface UsersStore {
  users: User[];
  users_paginated: IGetUserPaginated
  saveUsers: (users: User[]) => void;
  getUsers: () => void;
  postUser: (payload: UserPayload) => Promise<boolean>;
  patchUser: (payload: UserPayload, id: number) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
  updatePassword: (id: number, password: string) => Promise<boolean>;
  getUsersPaginated: (id: number, page: number, limit: number, userName: string) => Promise<void>;
}