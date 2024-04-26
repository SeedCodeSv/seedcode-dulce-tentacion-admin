import {
  Branches,
  IBranchPayload,
  IGetBranchesPaginated,
} from "../../types/branches.types";

export interface IBranchStore {
  branches_paginated: IGetBranchesPaginated;
  branch_list: Branches[];
  saveBranchesPaginated: (data: IGetBranchesPaginated) => void;
  getBranchesPaginated: (
    page: number,
    limit: number,
    name: string,
    phone: string,
    address: string
  ) => void;
  getBranchesList: () => Promise<void>;
  postBranch: (paylad: IBranchPayload) => Promise<boolean>;
  patchBranch: (paylad: IBranchPayload, id: number) => Promise<boolean>;
  deleteBranch: (id: number) => Promise<boolean>;
}
