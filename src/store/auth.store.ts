import { create } from "zustand";
import { IAuthStore } from "./types/auth_store.types";
import {
  get_token,
  get_user,
  is_authenticate,
  set_token,
  save_user,
  delete_user,
  delete_token,
  save_mh_token,
  delete_box,
  delete_mh_token,
  save_branch_id,
  delete_branch_id,
  post_box,
  return_seller_mode,
} from "../storage/localStorage";
import { post_login } from "../services/auth.service";
import { toast } from "sonner";
import { login_mh, get_transmitter } from "../services/transmitter.service";
import { ILoginMHFailed } from "../types/transmitter.types";
import { AxiosError } from "axios";
import { is_admin } from "../utils/filters";
export const useAuthStore = create<IAuthStore>((set, get) => ({
  token: get_token() ?? "",
  isAuth: is_authenticate(),
  user: get_user(),
  postLogin: async (payload) => {
    return await post_login(payload)
      .then(async ({ data }) => {
        const mode = return_seller_mode() ?? null;
        if (data.ok) {
          set_token(data.token);
          save_user(data.user);
          if (mode === "vendedor") {
            post_box(data.box.id.toString());
            save_branch_id(data.box.branchId.toString());
          }
          if (is_admin(data.user.role.name)) {
            await save_branch_id(String(data.user.employee.branch.id))
          }
          await get()
            .OnLoginMH(data.user.employee.branch.transmitterId, data.token)
            .catch((error) => {
              console.log(error)
              return;
            });
          toast.success("Bienvenido");
        } else {
          toast.error("Datos incorrectos");
        }
        return data;
      })
      .catch((error) => {
        console.log(error)
        delete_token();
        delete_user();
        toast.error("Datos incorrectos");
        return null;
      });
  },
  async OnLoginMH(id, token) {
    get_transmitter(id, token)
      .then(({ data }) => {
        login_mh(data.transmitter.nit, data.transmitter.clavePrivada)
          .then(async (login_mh) => {
            if (login_mh.data.status === "OK") {
              await save_mh_token(login_mh.data.body.token);
            } else {
              const data = login_mh as unknown as ILoginMHFailed;
              toast.error(`Error ${data}`);
              return;
            }
          })
          .catch((error: AxiosError<ILoginMHFailed>) => {
            toast.error(`Error ${error.response?.data.body.descripcionMsg}`);
            return;
          });
      })
      .catch(() => {
        toast.error("Aun no tienes datos asignados");
        return;
      });
  },
  makeLogout: async () => {
    set((state) => ({
      ...state,
      token: "",
      isAuth: false,
    })),
    await delete_mh_token();
    await delete_box();
    await delete_user();
    await delete_token();
    await delete_branch_id();
  },
}));
