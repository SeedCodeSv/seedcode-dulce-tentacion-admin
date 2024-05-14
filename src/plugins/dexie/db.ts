import Dexie, { Table } from "dexie";
import { Address } from "./entities/address";
import { Receptor } from "./entities/factura-receptor";
import { Pagos } from "./entities/pagos";
import { CuerpoDocumento } from "./entities/cuerpo_documento";
import { Resumen } from "./entities/resumen";
import { Venta } from "./entities/venta";

export class SeedCodeSvDB extends Dexie {
    venta!: Table<Venta>;
    direccion!: Table<Address>;
    factura_receptor!: Table<Receptor>;
    pagos!: Table<Pagos>;
    cuerpo_documento!: Table<CuerpoDocumento>;
    resumen!: Table<Resumen>;

    constructor() {
        super("seedcodeERP");
        this.version(1).stores({
            venta: "++id, fecha, total,codigoGeneracion",
            direccion: "++id, departamento, municipio, complemento",
            factura_receptor:
                "++id, tipoDocumento, numDocumento,nrc,nombre,codActividad,descActividad,telefono,correo, addressId, ventaId",
            pagos: "++id, montoPago, referencia, plazo, periodo,ventaId",
            cuerpo_documento:
                "++id, numItem, tipoItem, uniMedida, numeroDocumento, cantidad, codigo, codTributo, descripcion, precioUni, montoDescu, ventaNoSuj, ventaExenta, ventaGravada, ivaItem, tributos, psv, noGravado,ventaId",
            resumen:
                "++id, totalNoSuj, totalExenta, totalGravada, subTotalVentas, descuNoSuj, descuExenta, descuGravada, porcentajeDescuento, totalDescu, tributos, subTotal, ivaRete1, reteRenta, totalIva, montoTotalOperacion, totalNoGravado, totalPagar, totalLetras, saldoFavor, condicionOperacion, numPagoElectronico,ventaId",
        });
    }
}

export const db = new SeedCodeSvDB();
