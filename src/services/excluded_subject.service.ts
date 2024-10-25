import { IGetContingenceExcludedSubjects } from "@/types/excluded_subjects.types";
import { API_URL } from "@/utils/constants";
import axios from "axios";

export const get_contingence_excluded_subject = (branchId: number) => {
    return axios.get<IGetContingenceExcludedSubjects>(API_URL + `/excluded-subject/list-contingence/${branchId}`);
  };