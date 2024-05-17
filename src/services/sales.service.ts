import axios from "axios";
import { API_URL } from "../utils/constants";
import { get_token } from "../storage/localStorage";
import { IInvalidationResponse } from "../types/DTE/invalidation.types";

export const post_sales = (
  pdf: string,
  dte: string,
  cajaId: number,
  codigoEmpleado: string,
  sello: string
) => {
  const token = get_token() ?? "";
  return axios.post(
    API_URL + "/sales/factura-sale",
    { pdf, dte, cajaId, codigoEmpleado, sello },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const invalidate_sale = (id: number, selloInvalidacion: string) => {
  const token = get_token()
  return axios.patch<IInvalidationResponse>(API_URL + `/sales/invalidate/${id}`, { selloInvalidacion },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
