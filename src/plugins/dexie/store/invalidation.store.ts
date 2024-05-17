import { create } from "zustand";
import { IInvalidationStore } from "./types/invalidation_store.types";
import { firmarDocumentoInvalidacion, send_to_mh_invalidation } from "../../../services/DTE.service";
import { ISignInvalidationData } from "../../../types/DTE/invalidation.types";
import { ambiente } from "../../../utils/constants";
import { return_mh_token } from "../../../storage/localStorage";
import { toast } from "sonner";

export const useInvalidationStore = create<IInvalidationStore>((set) => ({
  isLoading: false,
  isError: false,
  errorMessage: "",

  OnCreateInvalidation: async (invalidationData: ISignInvalidationData) => {
    try {
      set({ isLoading: true, isError: false });
      firmarDocumentoInvalidacion(invalidationData)
        .then((res) => {
          if (res.status === 200) {
              send_to_mh_invalidation({ ambiente: ambiente, version: 2, idEnvio: 1, documento: res.data.body })

              set({ isLoading: false, isError: false });
              toast.success("Enviado a hacienda");
         
          } else {
            set({ isLoading: false, isError: true });
            console.log(`Error ${res.status}`);
            toast.error(`Error al enviar el documento a hacienda`);
          }
        })
    } catch (error) {
      set({ isLoading: false, isError: true });
      toast.error("Error al firmar el documento");
    }
  }
}))

