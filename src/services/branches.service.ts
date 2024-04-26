import axios from "axios";
import { API_URL } from "../utils/constants";
import {
  IBranchPayload,
  IGetBranchesList,
  IGetBranchesPaginated,
} from "../types/branches.types";
import { get_user } from "../storage/localStorage";

export const get_branches_pagination = (
  page: number,
  limit: number,
  name: string,
  phone: string,
  address: string
) => {
  const user = get_user()

  return axios.get<IGetBranchesPaginated>(
    API_URL +
    "/branches/list-paginated/" + user?.transmitterId + "?page=" +
    page +
    "&limit=" +
    limit +
    "&name=" +
    name +
    "&phone=" +
    phone +
    "&address=" +
    address
  );
};

export const get_branches_list = () => {
  const user = get_user()
  return axios.get<IGetBranchesList>(API_URL + `/branches/list-by-transmitter/${user?.employee.branch.transmitterId}`);
};

export const save_branch = (payload: IBranchPayload) => {
  return axios.post<{ ok: boolean }>(API_URL + "/branches", payload);
};

export const patch_branch = (payload: IBranchPayload, id: number) => {
  return axios.patch<{ ok: boolean }>(API_URL + "/branches/" + id, payload);
};

export const delete_branch = (id: number) => {
  return axios.delete<{ ok: boolean }>(API_URL + "/branches/" + id);
};
