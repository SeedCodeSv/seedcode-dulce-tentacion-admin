import { create } from "zustand";
import { IContingenciaStore } from "./types/contingencia_store.types";
import { Venta } from "../entities/venta";
import { add_venta, get_venta_by_codigo_generacion } from "../services/venta.service";
import { Address } from "../entities/address";
import { add_address, get_address_by_id } from "../services/address.service";
import { Receptor } from "../entities/factura-receptor";
import { add_receptor, get_receptor_by_venta } from "../services/factura_receptor.service";
import { Pagos } from "../entities/pagos";
import { add_pagos, get_pagos_por_id } from "../services/pagos.service";
import { Resumen } from "../entities/resumen";
import { add_resumen, get_resumen_by_venta } from "../services/resumen.service";
import { CuerpoDocumento } from "../entities/cuerpo_documento";
import { add_cuerpo, get_cuerpo_documento_by_venta } from "../services/cuerpo_documento.service";

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

                        const resumen_result = await add_resumen(resumen)

                        if (resumen_result?.id) {
                            const cuerpo_documento: CuerpoDocumento[] = DteJson.dteJson.cuerpoDocumento.map((cuerpo) => {
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
                                    ventaId: result.id!
                                }
                            })
                            add_cuerpo(cuerpo_documento).then(() => {
                                console.log("todo guardado")
                            })
                        }
                    }
                }
            }
        }
    },
    async getVentaByCodigo(codigo) {
        const venta = await get_venta_by_codigo_generacion(codigo)

        if (venta) {
            const pagos = await get_pagos_por_id(Number(venta.id))
            const receptor = await get_receptor_by_venta(Number(venta.id))
            const resumen = await get_resumen_by_venta(Number(venta.id))
            const cuerpo_documento = await get_cuerpo_documento_by_venta(Number(venta.id))
            const direccion = await get_address_by_id(Number(receptor?.addressId))

            if (!pagos || !receptor || !resumen || !cuerpo_documento || !direccion) {
                return undefined
            }

            return {
                pagos: pagos!,
                receptor: receptor!,
                resumen: resumen!,
                cuerpo_documento: cuerpo_documento!,
                venta: venta!,
                direccion_receptor: direccion!
            }

        }
        return undefined
    },
}))
