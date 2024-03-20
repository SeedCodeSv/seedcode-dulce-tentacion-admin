import { create } from "zustand";
import { IGlobalBillingStore } from "./types/global.types";
import { cat_012_departamento } from "../../services/facturation/cat-012-departamento.service";
import { cat_013_municipio } from "../../services/facturation/cat-013-municipio.service";
import { cat_019_codigo_de_actividad_economica } from "../../services/facturation/cat-019-codigo-de-actividad-economica.service";

export const useBillingStore = create<IGlobalBillingStore>((set) => ({
  cat_012_departamento: [],
  cat_013_municipios: [],
  cat_019_codigo_de_actividad_economica: [],
  getCat012Departamento: () => {
    cat_012_departamento()
      .then(({ data }) => {
        set((state) => ({ ...state, cat_012_departamento: data.object }));
      })
      .catch(() => {
        set((state) => ({ ...state, cat_012_departamento: [] }));
      });
  },
  getCat013Municipios() {
    cat_013_municipio()
      .then(({ data }) => {
        set((state) => ({ ...state, cat_013_municipios: data.object }));
      })
      .catch(() => {
        set((state) => ({ ...state, cat_013_municipios: [] }));
      });
  },
  getCat019CodigoActividadEconomica() {
    cat_019_codigo_de_actividad_economica()
      .then(({ data }) => {
        set((state) => ({
          ...state,
          cat_019_codigo_de_actividad_economica: data.object,
        }));
      })
      .catch(() => {
        set((state) => ({
          ...state,
          cat_019_codigo_de_actividad_economica: [],
        }));
      });
  },
}));
