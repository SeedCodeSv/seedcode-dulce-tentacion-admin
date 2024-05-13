import { IGetConfiguration } from "./../types/configuration.types";
import axios from "axios";
import { API_URL } from "../utils/constants";

export const create_configuration = async (
  configuration: IGetConfiguration
) => {
  const formData = new FormData();
  if (configuration.file) {
    formData.append("file", configuration.file);
  }
  formData.append("logo", configuration.logo);
  formData.append("ext", configuration.ext);
  formData.append("ext", configuration.name);
  formData.append("themeId", configuration.themeId.toString());
  formData.append("transmitterId", configuration.transmitterId.toString());
  return axios.post<{ ok: boolean; status: number }>(
    API_URL + "/personalization",
    formData,
    {
      headers: {
        Authorization: "Bearer" + localStorage.getItem("token"),
      },
    }
  );
};
