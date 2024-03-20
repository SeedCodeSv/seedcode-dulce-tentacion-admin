import { User, UserPayload } from "../../types/users.types";

export interface UsersStore {
  users: User[];
  saveUsers: (users: User[]) => void;
  getUsers: () => void;
  postUser: (payload: UserPayload) => Promise<boolean>;
  patchUser: (payload: UserPayload, id: number) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
  updatePassword:(id: number, password: string) => Promise<boolean>;
}