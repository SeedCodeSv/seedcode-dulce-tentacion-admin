import { create } from "zustand";
import { IContingenciaCreditoStore } from "./types/contingencia_credito_store.types";
import { CreditoVenta } from "../entities/credito_venta";
import {
  add_credito_venta,
  get_credito_venta_by_codigo_generacion,
} from "../services/credito_venta.service";
import { AddressCredito } from "../entities/address_credito_fiscal";
import {
  save_address_credito,
  get_address_credito,
} from "../services/credito_address.service";
import { CreditoReceptor } from "../entities/credito_fiscal_receptor";
import {
  add_credito_receptor,
  geT_credito_receptor_by_venta,
} from "../services/credito_receptor.service";
import { CreditoPagos } from "../entities/pagos_credito_fiscal";
import {
  add_credito_pagos,
  get_credito_pagos_por_id,
} from "../services/credito_pagos.service";
import { CreditoResumen } from "../entities/resumen_credito_fiscal";
import {
  add_credito_resumen,
  get_credito_resumen_by_venta,
} from "../services/credito_resumen.service";
import { CreditoCuerpoDocumento } from "../entities/cuerpo_documento_credito_fiscal";
import {
  add_credito_cuerpo,
  get_credito_cuerpo_documento_by_venta,
} from "../services/credito_cuerpo_documento.service";

export const useContingenciaCreditoStore = create<IContingenciaCreditoStore>(
  () => ({
    createContingenciaCredito: async (DteJson) => {
      const credito_venta: CreditoVenta = {
        fecha: DteJson.dteJson.identificacion.fecEmi,
        total: Number(DteJson.dteJson.resumen.totalPagar),
        codigoGeneracion: DteJson.dteJson.identificacion.codigoGeneracion,
      };
      const result = await add_credito_venta(credito_venta);

      if (result?.id) {
        const credito_address: AddressCredito = {
          municipio: DteJson.dteJson.receptor.direccion.municipio,
          departamento: DteJson.dteJson.receptor.direccion.departamento,
          complemento: DteJson.dteJson.receptor.direccion.complemento,
        };
        const address_result = await save_address_credito(credito_address);

        if (address_result?.id) {
          const receptor: CreditoReceptor = {
            nombreComercial:
              DteJson.dteJson.receptor.nombreComercial === null
                ? "0"
                : DteJson.dteJson.receptor.nombreComercial,
            nit:
              DteJson.dteJson.receptor === null
                ? "0"
                : DteJson.dteJson.receptor.nit,
            tipoDocumento:
              DteJson.dteJson.receptor.tipoDocumento === null
                ? "0"
                : DteJson.dteJson.receptor.tipoDocumento,
            numDocumento:
              DteJson.dteJson.receptor.numDocumento === null
                ? "0"
                : DteJson.dteJson.receptor.numDocumento,
            nrc:
              DteJson.dteJson.receptor.nrc === null
                ? "0"
                : DteJson.dteJson.receptor.nrc,
            nombre:
              DteJson.dteJson.receptor.nombre === null
                ? "0"
                : DteJson.dteJson.receptor.nombre,
            codActividad:
              DteJson.dteJson.receptor.codActividad === null
                ? "0"
                : DteJson.dteJson.receptor.codActividad,
            descActividad:
              DteJson.dteJson.receptor.descActividad === null
                ? "0"
                : DteJson.dteJson.receptor.descActividad,
            telefono:
              DteJson.dteJson.receptor.telefono === null
                ? "0"
                : DteJson.dteJson.receptor.telefono,
            correo: DteJson.dteJson.receptor.correo,
            addressId: address_result.id,
            ventaId: result.id,
          };

          const receptor_result = await add_credito_receptor(receptor);

          if (receptor_result) {
            const pagos: CreditoPagos = {
              codigo: DteJson.dteJson.resumen.pagos[0].codigo,
              montoPago: DteJson.dteJson.resumen.pagos[0].montoPago,
              referencia:
                DteJson.dteJson.resumen.pagos[0].referencia === null
                  ? "0"
                  : DteJson.dteJson.resumen.pagos[0].referencia,
              plazo: DteJson.dteJson.resumen.pagos[0].plazo ?? "0",
              periodo: DteJson.dteJson.resumen.pagos[0].periodo ?? "0",
              ventaId: result.id,
            };

            const pagos_result = await add_credito_pagos(pagos);

            if (pagos_result?.id) {
              const resumen: CreditoResumen = {
                totalNoSuj: Number(DteJson.dteJson.resumen.totalNoSuj),
                totalExenta: Number(DteJson.dteJson.resumen.totalExenta),
                totalGravada: Number(DteJson.dteJson.resumen.totalGravada),
                subTotalVentas: Number(DteJson.dteJson.resumen.subTotalVentas),
                descuNoSuj: Number(DteJson.dteJson.resumen.descuNoSuj),
                descuExenta: Number(DteJson.dteJson.resumen.descuExenta),
                descuGravada: Number(DteJson.dteJson.resumen.descuGravada),
                porcentajeDescuento: Number(
                  DteJson.dteJson.resumen.porcentajeDescuento
                ),
                totalDescu: Number(DteJson.dteJson.resumen.totalDescu),
                tributos: "0",
                subTotal: Number(DteJson.dteJson.resumen.subTotal),
                ivaRete1: Number(DteJson.dteJson.resumen.ivaRete1),
                reteRenta: Number(DteJson.dteJson.resumen.reteRenta),
                totalIva: Number(DteJson.dteJson.resumen.totalIva),
                montoTotalOperacion: Number(
                  DteJson.dteJson.resumen.montoTotalOperacion
                ),
                totalNoGravado: Number(DteJson.dteJson.resumen.totalNoGravado),
                totalPagar: Number(DteJson.dteJson.resumen.totalPagar),
                totalLetras: DteJson.dteJson.resumen.totalLetras,
                saldoFavor: Number(DteJson.dteJson.resumen.saldoFavor),
                condicionOperacion: Number(
                  DteJson.dteJson.resumen.condicionOperacion
                ),
                numPagoElectronico: "0",
                ivaPerci1: Number(DteJson.dteJson.resumen.ivaPerci1),
                pagosId: pagos_result.id,
                ventaId: result.id,
              };

              const credito_resumen_result = await add_credito_resumen(resumen);

              if (credito_resumen_result?.id) {
                const credito_cuerpo_documento: CreditoCuerpoDocumento[] =
                  DteJson.dteJson.cuerpoDocumento.map((cuerpo) => {
                    return {
                      numItem: cuerpo.numItem,
                      tipoItem: cuerpo.tipoItem,
                      uniMedida: cuerpo.uniMedida,
                      numeroDocumento: cuerpo.numeroDocumento ?? "0",
                      cantidad: cuerpo.cantidad,
                      codigo: cuerpo.codigo ?? "0",
                      codTributo: cuerpo.codTributo ?? "0",
                      descripcion: cuerpo.descripcion,
                      precioUni: Number(cuerpo.precioUni),
                      montoDescu: Number(cuerpo.montoDescu),
                      ventaNoSuj: Number(cuerpo.ventaNoSuj),
                      ventaExenta: Number(cuerpo.ventaExenta),
                      ventaGravada: Number(cuerpo.ventaGravada),
                      ivaItem: Number(cuerpo.ivaItem),
                      tributos: "0",
                      psv: 0,
                      noGravado: 0,
                      ventaId: result.id!,
                    };
                  });
                add_credito_cuerpo(credito_cuerpo_documento).then(() => {
                  console.log("todo guardado");
                });
              }
            }
          }
        }
      }
    },
    async getCreditoVentaByCodigo(codigo) {
      const credito_venta = await get_credito_venta_by_codigo_generacion(
        codigo
      );

      if (credito_venta) {
        const credito_pagos = await get_credito_pagos_por_id(
          Number(credito_venta.id)
        );
        const credito_receptor = await geT_credito_receptor_by_venta(
          Number(credito_venta.id)
        );
        const credito_resumen = await get_credito_resumen_by_venta(
          Number(credito_venta.id)
        );
        const credito_cuerpo_documento =
          await get_credito_cuerpo_documento_by_venta(Number(credito_venta.id));
        const credito_address = await get_address_credito(
          Number(credito_receptor?.addressId)
        );

        if (
          !credito_pagos ||
          !credito_receptor ||
          !credito_resumen ||
          !credito_cuerpo_documento ||
          !credito_address
        ) {
          return undefined;
        }

        return {
          credito_pagos: credito_pagos!,
          credito_receptor: credito_receptor!,
          credito_resumen: credito_resumen!,
          credito_cuerpo_documento: credito_cuerpo_documento!,
          credito_venta: credito_venta!,
          credito_address: credito_address!,
        }
      }
      return undefined
    },
  })
);
