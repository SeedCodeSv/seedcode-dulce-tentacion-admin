import axios from "axios";

import { get_token } from "../storage/localStorage";
import { IGetStudyLevel } from "../types/study_level.types";
import { API_URL } from "../utils/constants";

export const get_study_levels = async () => {
    const token = get_token();

    return await axios.get<IGetStudyLevel>(API_URL + `/study-level`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };