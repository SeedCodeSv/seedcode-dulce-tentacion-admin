import { create } from "zustand";
import { IGlobalBillingStore } from "./types/global.types";
import { cat_012_departamento } from "../../services/facturation/cat-012-departamento.service";
import { cat_013_municipio } from "../../services/facturation/cat-013-municipio.service";
import { cat_019_codigo_de_actividad_economica } from "../../services/facturation/cat-019-codigo-de-actividad-economica.service";
import {
  get_ambiente_destino,
  get_metodos_de_pago,
  get_tipos_de_documento,
  get_tipos_de_tributo,
} from "../../services/DTE.service";
import { get_tipos_de_contingencia } from "../../services/facturation/cat-005-tipos-de-contigencia.service";
import { get_units_of_measurement } from "../../services/facturation/cat-014-unidad-de-medida.service";
export const useBillingStore = create<IGlobalBillingStore>((set) => ({
  cat_012_departamento: [],
  cat_013_municipios: [],
  cat_019_codigo_de_actividad_economica: [],
  ambiente_destino: [],
  metodos_de_pago: [],
  tipos_de_documento: [],
  cat_014_unidad_de_medida: [],
  tipos_tributo: [],
  cat_005_tipo_de_contingencia: [],
  getCat005TipoDeContingencia() {
    get_tipos_de_contingencia().then(({ data }) => {
      set({ cat_005_tipo_de_contingencia: data.object })
    }).catch(()=>{
      set({ cat_005_tipo_de_contingencia: [] })
    })
  },
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
  OnGetTiposTributos() {
    get_tipos_de_tributo()
      .then(({ data }) => {
        set((state) => ({ ...state, tipos_tributo: data.object }));
      })
      .catch(() => {
        set((state) => ({ ...state, tipos_tributo: [] }));
      });
  },
  OnGetAmbienteDestino() {
    get_ambiente_destino()
      .then(({ data }) => {
        set((state) => ({ ...state, ambiente_destino: data.object }));
      })
      .catch(() => {
        set((state) => ({ ...state, ambiente_destino: [] }));
      });
  },
  getCat017FormasDePago() {
    get_metodos_de_pago().then(({ data }) => {
      set((state) => ({ ...state, metodos_de_pago: data.object }));
    }).catch(() => {
      set((state) => ({ ...state, metodos_de_pago: [] }));
    })
  },
  getCat02TipoDeDocumento() {
    get_tipos_de_documento().then(({ data }) => {
      set((state) => ({ ...state, tipos_de_documento: data.objects }));
    }).catch(() => {
      set((state) => ({ ...state, tipos_de_standard: [] }));
    })
  },
 getCat014UnidadDeMedida() {
   get_units_of_measurement()
     .then(({ data }) => {
       set((state) => ({ ...state, cat_014_unidad_de_medida: data.object }));
     })
     .catch(() => {
       set((state) => ({ ...state, cat_014_unidad_de_medida: [] }));
     });
 }
}));
