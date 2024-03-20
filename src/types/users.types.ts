export interface IGetUsers {
    ok: boolean;
    message: string;
    users: User[];
  }
  
  export interface UserPayload {
    userName: string;
    password: string;
    roleId: number;
    employeeId: number;
  }
  
  export interface Role {
      id: number;
      name: string;
      isActive: boolean;
  }
  
  export interface Employee {
      id: number;
      fullName: string;
      phone: string;
      isActive: boolean;
      branchId: number;
  }
  
  export interface User {
      id: number;
      userName: string;
      active: boolean;
      role: Role;
      employee: Employee;
      roleId: number;
      employeeId: number;
  }
  
  export interface RootObject {
      ok: boolean;
      message: string;
      users: User[];
  }