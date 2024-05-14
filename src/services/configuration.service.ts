import { GetByTransmitter, IGetConfiguration } from "./../types/configuration.types";
import axios from "axios";
import { API_URL } from "../utils/constants";
import { get_token } from "../storage/localStorage";

export const create_configuration = async (
  configuration: IGetConfiguration
) => {
  const formData = new FormData();
  if (configuration.file) {
    formData.append("file", configuration.file);
  }
  formData.append("name", configuration.name);
  formData.append("themeId", configuration.themeId.toLocaleString());
  formData.append("transmitterId", configuration.transmitterId.toLocaleString());
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

export const get_by_transmitter = (transmitter_id: number) => {
  const token = get_token() ?? "";
  return axios.get<GetByTransmitter>(`${API_URL}/personalization${transmitter_id}`, {
      headers: {
          Authorization: `Bearer ${token}`,
      },
  });
}