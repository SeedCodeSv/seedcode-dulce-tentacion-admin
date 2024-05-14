import { create } from "zustand";
import { IContingenciaStore } from "./types/contingencia_store.types";
import { Venta } from "../entities/venta";
import { add_venta } from "../services/venta.service";
import { Address } from "../entities/address";
import { add_address } from "../services/address.service";
import { Receptor } from "../entities/factura-receptor";
import { add_receptor } from "../services/factura_receptor.service";
import { Pagos } from "../entities/pagos";
import { add_pagos } from "../services/pagos.service";
import { Resumen } from "../entities/resumen";

export const useContingenciaStore = create<IContingenciaStore>(() => ({
    createContingencia: async (DteJson) => {
        const venta: Venta = {
            fecha: DteJson.dteJson.identificacion.fecEmi,
            total: Number(DteJson.dteJson.resumen.totalPagar),
            codigoGeneracion: DteJson.dteJson.identificacion.codigoGeneracion
        }

        const result = await add_venta(venta);

        if (result?.id) {
            const direccion: Address = {
                municipio: DteJson.dteJson.receptor.direccion.municipio,
                departamento: DteJson.dteJson.receptor.direccion.departamento,
                complemento: DteJson.dteJson.receptor.direccion.complemento
            }

            const direccion_result = await add_address(direccion)

            if (direccion_result?.id) {
                const receptor: Receptor = {
                    tipoDocumento: DteJson.dteJson.receptor.tipoDocumento === null ? "0" : DteJson.dteJson.receptor.tipoDocumento,
                    numDocumento: DteJson.dteJson.receptor.numDocumento === null ? "0" : DteJson.dteJson.receptor.numDocumento,
                    nrc: DteJson.dteJson.receptor.nrc === null ? "0" : DteJson.dteJson.receptor.nrc,
                    nombre: DteJson.dteJson.receptor.nombre === null ? "0" : DteJson.dteJson.receptor.nombre,
                    codActividad: DteJson.dteJson.receptor.codActividad === null ? "0" : DteJson.dteJson.receptor.codActividad,
                    descActividad: DteJson.dteJson.receptor.descActividad === null ? "0" : DteJson.dteJson.receptor.descActividad,
                    telefono: DteJson.dteJson.receptor.telefono === null ? "0" : DteJson.dteJson.receptor.telefono,
                    correo: DteJson.dteJson.receptor.correo,
                    addressId: direccion_result.id,
                    ventaId: result.id
                }

                const receptor_result = await add_receptor(receptor)

                if (receptor_result) {
                    const pagos: Pagos = {
                        codigo: DteJson.dteJson.resumen.pagos[0].codigo,
                        montoPago: DteJson.dteJson.resumen.pagos[0].montoPago,
                        referencia: DteJson.dteJson.resumen.pagos[0].referencia === null ? "0" : DteJson.dteJson.resumen.pagos[0].referencia,
                        plazo: DteJson.dteJson.resumen.pagos[0].plazo ?? "0",
                        periodo: DteJson.dteJson.resumen.pagos[0].periodo ?? "0",
                        ventaId: result.id
                    }

                    const pagos_result = await add_pagos(pagos)

                    if (pagos_result?.id) {
                        const resumen: Resumen = {
                            totalNoSuj: Number(DteJson.dteJson.resumen.totalNoSuj),
                            totalExenta: Number(DteJson.dteJson.resumen.totalExenta),
                            totalGravada: Number(DteJson.dteJson.resumen.totalGravada),
                            subTotalVentas: Number(DteJson.dteJson.resumen.subTotalVentas),
                            descuNoSuj: Number(DteJson.dteJson.resumen.descuNoSuj),
                            descuExenta: Number(DteJson.dteJson.resumen.descuExenta),
                            descuGravada: Number(DteJson.dteJson.resumen.descuGravada),
                            porcentajeDescuento: Number(DteJson.dteJson.resumen.porcentajeDescuento),
                            totalDescu: Number(DteJson.dteJson.resumen.totalDescu),
                            tributos: "0",
                            subTotal: Number(DteJson.dteJson.resumen.subTotal),
                            ivaRete1: Number(DteJson.dteJson.resumen.ivaRete1),
                            reteRenta: Number(DteJson.dteJson.resumen.reteRenta),
                            totalIva: Number(DteJson.dteJson.resumen.totalIva),
                            montoTotalOperacion: Number(DteJson.dteJson.resumen.montoTotalOperacion),
                            totalNoGravado: Number(DteJson.dteJson.resumen.totalNoGravado),
                            totalPagar: Number(DteJson.dteJson.resumen.totalPagar),
                            totalLetras: DteJson.dteJson.resumen.totalLetras,
                            saldoFavor: Number(DteJson.dteJson.resumen.saldoFavor),
                            condicionOperacion: Number(DteJson.dteJson.resumen.condicionOperacion),
                            numPagoElectronico: "0",
                            ventaId: result.id
                        }
                    }
                }
            }
        }
    }
}))