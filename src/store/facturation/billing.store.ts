import { create } from 'zustand';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';

import { IGlobalBillingStore } from './types/global.types';

const service = new SeedcodeCatalogosMhService();

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
  cat_022_tipo_de_documentoDeIde: [],
  getCat005TipoDeContingencia() {
    set({
      cat_005_tipo_de_contingencia: service
        .get005TipoDeContingencum()
        .map((item) => ({ ...item, isActivated: item.isActivated === 1 })),
    });
  },
  getCat012Departamento: () => {
    set({
      cat_012_departamento: service
        .get012Departamento()
        .map((item) => ({ ...item, isActivated: item.isActivated === 1 })),
    });
  },
  getCat013Municipios(depCode) {
    const municipios = service.get013Municipio(depCode);

    if (municipios) {
      set({
        cat_013_municipios: municipios.map((item) => ({
          ...item,
          isActivated: item.isActivated === 1,
        })),
      });
    }
  },
  getCat019CodigoActividadEconomica(name) {
    set({
      cat_019_codigo_de_actividad_economica: service
        .get019CodigoDeActividaEcono(name)
        .map((item) => ({ ...item, isActivated: item.isActivated === 1 })),
    });
  },

  getCat022TipoDeDocumentoDeIde() {
    set({
      cat_022_tipo_de_documentoDeIde: service
        .get022TipoDeDocumentoDeIde()
        .map((item) => ({ ...item, isActivated: item.isActivated === 1 })),
    });
  },
  OnGetTiposTributos() {
    set({
      tipos_tributo: service
        .get015Tributo()
        .map((item) => ({ ...item, isActivated: item.isActivated === 1 })),
    });
  },
  OnGetAmbienteDestino() {
    set({
      ambiente_destino: service
        .get001AmbienteDeDestino()
        .map((item) => ({ ...item, isActivated: item.isActivated === 1 })),
    });
  },
  getCat017FormasDePago() {
    set({
      metodos_de_pago: service
        .get017FormaDePago()
        .map((item) => ({ ...item, isActivated: item.isActivated === 1 })),
    });
  },
  getCat02TipoDeDocumento() {
    set({
      tipos_de_documento: service
        .get002TipoDeDocumento()
        .map((item) => ({ ...item, isActivated: item.isActivated === 1 })),
    });
  },
  getCat014UnidadDeMedida() {
    set({
      cat_014_unidad_de_medida: service
        .get014UnidadDeMedida()
        .map((item) => ({ ...item, isActivated: item.isActivated === 1 })),
    });
  },
}));
