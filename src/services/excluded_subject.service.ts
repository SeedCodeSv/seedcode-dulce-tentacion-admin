import { ExcludedSubjectByMonthBranch } from "@/types/excluded-subject.types";
import { IGetContingenceExcludedSubjects } from "@/types/excluded_subjects.types";
import { API_URL } from "@/utils/constants";
import axios from "axios";

export const get_contingence_excluded_subject = (branchId: number) => {
    return axios.get<IGetContingenceExcludedSubjects>(API_URL + `/excluded-subject/list-contingence/${branchId}`);
  };

  export const get_excluded_subject_by_month = (id: number, month: number, year: number) => {
    return axios.get<ExcludedSubjectByMonthBranch>(
      API_URL + `/reports/get-excluded-by-month/${id}?month=${month}&year=${year}`
    )
  }
  