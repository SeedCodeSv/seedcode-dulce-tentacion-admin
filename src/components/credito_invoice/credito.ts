// import SEEDCODE from "../../assets/seedcodesv.png"

export const MHQuery = (ambiente: string, codegen: string, fechaEmi: string) => {
  return `https://admin.factura.gob.sv/consultaPublica?ambiente=${ambiente}&codGen=${codegen}&fechaEmi=${fechaEmi}`;
};

export const CreditoInVoiceHTML = (qrCode: string, logo: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
    <style>
            #otros-documentos th {
                border: 0.1px solid #8d99ae;
                border-right:0;
            }
    
            #otros-documentos td {
                border: 0.1px solid #8d99ae;
                border-right:0;
                border-top: 0;
            }
            #otros-documentos td:last-child {
                border-right: 1px solid #8d99ae;
            }

            #otros-documentos th:last-child {
                border-right: 1px solid #8d99ae;
            }

            #otros-documentos {
                width: 560px;
                margin-top: 8px;
            }
    
            .text-normal {
                text-align: left;
                font-size: 7px;
                font-family: Arial, Helvetica, sans-serif;
            }
    
            .flex-center {
                display: flex;
                align-items: start;
                justify-content: center;
                padding: 3px
            }
        </style>
        <div style="width:100vw;font-family: Arial, Helvetica, sans-serif; padding:15px">
            <table style="width:100%;padding:10px">
                <tbody>
                    <tr style="display:flex">
                        <td
                            style="width:280px;font-family: Arial, Helvetica, sans-serif;display:flex; flex-direction:column; justify-content:center">
                            <p style="font-size:8px; font-family: Arial, Helvetica, sans-serif;">
                                DOCUMENTO DE CONSULTA PORTAL OPERATIVO
                            </p>
                            <p style="font-size:8px; font-family: Arial, Helvetica, sans-serif;">
                                DOCUMENTO TRIBUTARIO ELECTRÓNICO
                            </p>
                        </td>
                        <td
                            style="width: auto;font-family: Arial, Helvetica, sans-serif;display:flex; gap:10px; flex-direction:row; justify-content:center; align-items: end">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://wwww.seedcodesv.com')}" style="width:70px">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCode)}" style="width:70px;margin-left:10px">
                            <img src="${logo}" style="width:70px;margin-left:10px">
                        </td>
                    </tr>
                </tbody>
            </table>
            <table style="width:100%;margin-top:8px">
                <tbody>
                    <tr style="display:flex">
                        <td
                            style="width:280px;font-family: Arial, Helvetica, sans-serif;display:flex; flex-direction:column; justify-content:center">
                            <p style="font-size:7px; font-family: Arial, Helvetica, sans-serif;">
                                Código de Generación:
                                {{dte.identificacion.codigoGeneracion}}
                            </p>
                            <p style="font-size:7px; font-family: Arial, Helvetica, sans-serif;">
                                Número de Control:
                                {{dte.identificacion.numeroControl}}
                            </p>
                            <p style="font-size:7px; font-family: Arial, Helvetica, sans-serif;">
                                Sello de Recepción:
                                {{dte.respuestaMH.selloRecibido}}
                            </p>
                        </td>
                        <td
                            style="text-align:right;width:280px;font-family: Arial, Helvetica, sans-serif;display:flex; flex-direction:column; justify-content:center; align-items:end">
                            <p style="font-size:7px; font-family: Arial, Helvetica, sans-serif;">
                                Modelo de Facturación: Previo
                            </p>
                            <p style="text-align:right;font-size:7px; font-family: Arial, Helvetica, sans-serif;">
                                Tipo de Transmisión: Normal
                            <p style="text-align:right;font-size:7px; font-family: Arial, Helvetica, sans-serif;">
                                Fecha y Hora de Generación: {{dte.identificacion.fecEmi}}
                                {{dte.identificacion.horEmi}}
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table style="margin-top:8px;">
                <tbody>
                    <tr style="display:flex; justify-content: space-between;">
                        <td style="width:275px;">
                            <p style="text-align:center;font-size:9px; font-family: Arial, Helvetica, sans-serif;">Emisor
                            </p>
                            <div style="width:100%; border: solid 1px #8d99ae; border-radius:5px; padding:3px;margin-top:5px">
                                <p style="display:flex">
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:100px">Nombre
                                        o razón social:</span>
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:170px">{{dte.emisor.nombre}}</span>
                                </p>
                                <p style="display:flex">
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:100px">NIT:</span>
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:170px">{{dte.emisor.nit}}</span>
                                </p>
                                <p style="display:flex">
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:100px">NRC:</span>
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:170px">{{dte.emisor.nrc}}</span>
                                </p>
                                <p style="display:flex">
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:100px">Actividad
                                        económica:</span>
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:170px">{{dte.emisor.descActividad}}</span>
                                </p>
                                <p style="display:flex">
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:100px">Dirección:</span>
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:170px">{{direccion}}</span>
                                </p>
                                <p style="display:flex">
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:100px">Número
                                        de teléfono:</span>
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:170px">{{dte.emisor.telefono}}</span>
                                </p>
                                <p style="display:flex">
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:100px">Correo
                                        electrónico:</span>
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:170px">{{dte.emisor.correo}}</span>
                                </p>
                                <p style="height:8px"></p>
                            </div>
                        </td>
                        <td style="width:275px;margin-left:10px">
                            <p style="text-align:center;font-size:9px; font-family: Arial, Helvetica, sans-serif;">Receptor
                            </p>
                            <div style="width:100%; border: solid 1px #8d99ae; border-radius:5px; padding:3px;margin-top:5px">
                                <p style="display:flex">
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:100px">Nombre
                                        o razón social:</span>
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:170px">{{dte.receptor.nombre}}</span>
                                </p>
                                <p style="display:flex">
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:100px">Numero
                                        documento:</span>
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:170px">{{dte.receptor.numDocumento}}</span>
                                </p>
                                <p style="display:flex">
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:100px">NRC:</span>
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:170px">{{#if dte.receptor.nrc}} {{dte.receptor.nrc}} {{^}} No especificado {{/if}}</span>
                                </p>
                                <p style="display:flex">
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:100px">Código
                                        actividad:</span>
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:170px">{{#if dte.receptor.codActividad}} {{dte.receptor.codActividad}} {{^}} No especificado {{/if}}</span>
                                </p>
                                <p style="display:flex">
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:100px">Descripción
                                        de actividad económica:</span>
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:170px">{{#if dte.receptor.descActividad}} {{dte.receptor.descActividad}} {{^}} No especificado {{/if}}</span>
                                </p>
                                <p style="display:flex">
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:100px">Teléfono</span>
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:170px">{{#if dte.receptor.telefono}} {{dte.receptor.telefono}} {{^}} No especificado {{/if}}</span>
                                </p>
                                <p style="display:flex">
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:100px">Correo
                                        electrónico:</span>
                                    <span
                                        style="text-align:left;font-size:7px; font-family: Arial, Helvetica, sans-serif;width:170px">{{dte.receptor.correo}}</span>
                                </p>
                                <p style="height:8px"></p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table style="margin-top:8px;">
                <tbody>
                    <td>
                        <p
                            style="width:560px; text-align:center;font-size:8px; font-family: Arial, Helvetica, sans-serif; word-spacing: 5px;">
                            VENTA A CUENTA DE TERCEROS
                        <p>
                        <div
                            style="width:560px; border: solid 1px #8d99ae; border-radius:5px; padding:3px; display:flex;margin-top:8px">
                            <p style="width: 275px;font-size:7px; font-family: Arial, Helvetica, sans-serif;">
                                NIT:
                            </p>
                            <p
                                style="width: 275px;margin-left: 10px; display:flex; flex-direction:column;justify-content:center">
                                <span style="width:100px;font-size:7px; font-family: Arial, Helvetica, sans-serif;">Nombre,
                                    denominación o razón
                                    social:</span>
                            </p>
                        </div>
                    </td>
                </tbody>
            </table>
            <p
                style="width:560px; text-align:center;font-size:8px; font-family: Arial, Helvetica, sans-serif; word-spacing: 5px;">
                OTROS DOCUMENTOS ASOCIADOS
            <p>
    
            <table id="otros-documentos">
                <thead>
                    <tr style="display:flex">
                        <th class=" flex-center" style="width:186.66px;">
                            <p class="text-normal" style="padding-bottom: 3px">Tipo
                                de Documento</p>
                        </th>
                        <th class="flex-center" style="width:186.66px;">
                            <p class="text-normal" style="padding-bottom: 3px">N°
                                de Documento</p>
                        </th>
                        <th class="flex-center" style="width:186.66px;">
                            <p class="text-normal" style="padding-bottom: 3px">Fecha
                                de Documento</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="display:flex">
                        <td class="text-normal flex-center" style="width:186.66px;">-</td>
                        <td class="text-normal flex-center" style="width:186.66px;">-</td>
                        <td class="text-normal flex-center" style="width:186.66px;">-</td>
                    </tr>
                </tbody>
                </table>
                <table id="otros-documentos">
                    <thead>
                        <tr style="display:flex">
                            <th class=" flex-center" style="width:43.3px">
                                <p class="text-normal" style="padding-bottom: 3px;text-align: center;font-size:6px">No.</p>
                            </th>
                            <th class=" flex-center" style="width:43.3px">
                            <p class="text-normal" style="padding-bottom: 3px;text-align: center;font-size:6px">Cant.</p>
                        </th>
                            <th class="flex-center" style="width:43.3px;">
                                <p class="text-normal" style="padding-bottom: 3px;text-align: center;font-size:6px">Unidad M.</p>
                            </th>
                            <th class="flex-center" style="width:150px;">
                                <p class="text-normal" style="padding-bottom: 3px;text-align: center;font-size:6px">Descripción</p>
                            </th>
                             <th class="flex-center" style="width:46.6px;">
                                <p class="text-normal" style="padding-bottom: 3px;text-align: center;font-size:6px">Precio un.</p>
                            </th>
                            <th class="flex-center" style="width:46.6px;">
                                <p class="text-normal" style="padding-bottom: 3px;text-align: center;font-size:6px">Otros montos.</p>
                            </th>
                            <th class="flex-center" style="width:46.6px;">
                                <p class="text-normal" style="padding-bottom: 3px;text-align: center;font-size:6px">Descu.</p>
                            </th>
                            <th class="flex-center" style="width:46.6px;">
                                <p class="text-normal" style="padding-bottom: 3px;text-align: center;font-size:6px">Ventas no suj.</p>
                            </th>
                            <th class="flex-center" style="width:46.6px;">
                                <p class="text-normal" style="padding-bottom: 3px;text-align: center;font-size:6px">Ventas Exen.</p>
                            </th>
                            <th class="flex-center" style="width:46.6px;">
                                <p class="text-normal" style="padding-bottom: 3px;text-align: center;font-size:6px">Ventas Grav.</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {{#each dte.cuerpoDocumento}}
                        <tr style="display:flex">
                            <td class="text-normal flex-center" style="width:43.3px;">{{numItem}}</td>
                            <td class="text-normal flex-center" style="width:43.3px;">{{cantidad}}</td>
                            <td class="text-normal flex-center" style="width:43.3px;">{{uniMedida}}</td>
                            <td class="text-normal flex-center" style="width:150px;">{{descripcion}}</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{precioUni}}</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{noGravado}}</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{montoDescu}}</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{ventaNoSuj}}</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{ventaExenta}}</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{ventaGravada}}</td>
                        </tr>
                        {{/each}}
                        <tr style="display:flex">
                        <td class="text-normal flex-center" style="width:280px;border: 0;" col-span="4"></td>
                            <td class="text-normal flex-center" style="width:140px;text-align:right;justify-content: end;" colspan="3">Suma de ventas:</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{dte.resumen.totalNoSuj}}</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{dte.resumen.totalExenta}}</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{dte.resumen.totalGravada}}</td>
                        </tr>
                        <tr style="display:flex">
                            <td class="text-normal flex-center" style="width:280px;border: 0;" col-span="4"></td>
                            <td class="text-normal flex-center" style="width:233.33px;text-align:right;justify-content: end;" colspan="5">Sumatoria de ventas:</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{dte.resumen.subTotalVentas}}</td>
                        </tr>
                        <tr style="display:flex">
                            <td class="text-normal flex-center" style="width:280px;border: 0;" col-span="4"></td>
                            <td class="text-normal flex-center" style="width:233.33px;text-align:right;justify-content: end;" colspan="5">Monto global Desc., Rebajas y otros a ventas no sujetas:</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{dte.resumen.descuNoSuj}}</td>
                        </tr>
                        <tr style="display:flex">
                            <td class="text-normal flex-center" style="width:280px;border: 0;" col-span="4"></td>
                            <td class="text-normal flex-center" style="width:233.33px;text-align:right;justify-content: end;" colspan="5">Monto global Desc., Rebajas y otros a ventas Exentas:</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{dte.resumen.descuExenta}}</td>
                        </tr>
                        <tr style="display:flex">
                            <td class="text-normal flex-center" style="width:280px;border: 0;" col-span="4"></td>
                            <td class="text-normal flex-center" style="width:233.33px;text-align:right;justify-content: end;" colspan="5">Monto global Desc., Rebajas y otros a ventas gravadas:</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{dte.resumen.descuGravada}}</td>
                        </tr>
                        <tr style="display:flex">
                            <td class="text-normal flex-center" style="width:280px;border: 0;" col-span="4"></td>
                            <td class="text-normal flex-center" style="width:233.33px;text-align:right;justify-content: end;" colspan="5">Sub-Total:</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{dte.resumen.subTotal}}</td>
                        </tr>
                        <tr style="display:flex">
                            <td class="text-normal flex-center" style="width:280px;border: 0;" col-span="4"></td>
                            <td class="text-normal flex-center" style="width:233.33px;text-align:right;justify-content: end;" colspan="5">Impuesto al valor agregado 13%:</td>
                            <td class="text-normal flex-center" style="width:46.6px;">$0.13</td>
                        </tr>
                        <tr style="display:flex">
                            <td class="text-normal flex-center" style="width:280px;border: 0;" col-span="4"></td>
                            <td class="text-normal flex-center" style="width:233.33px;text-align:right;justify-content: end;" colspan="5">IVA Retenido:</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{dte.resumen.ivaRete1}}</td>
                        </tr>
                        <tr style="display:flex">
                            <td class="text-normal flex-center" style="width:280px;border: 0;" col-span="4"></td>
                            <td class="text-normal flex-center" style="width:233.33px;text-align:right;justify-content: end;" colspan="5">Retención Renta:</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{dte.resumen.reteRenta}}</td>
                        </tr>
                        <tr style="display:flex">
                            <td class="text-normal flex-center" style="width:280px;border: 0;" col-span="4"></td>
                            <td class="text-normal flex-center" style="width:233.33px;text-align:right;justify-content: end;" colspan="5">Monto Total de la Operación:</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{dte.resumen.montoTotalOperacion}}</td>
                        </tr>
                        <tr style="display:flex">
                            <td class="text-normal flex-center" style="width:280px;border: 0;" col-span="4"></td>
                            <td class="text-normal flex-center" style="width:233.33px;text-align:right;justify-content: end;" colspan="5">Total Otros Montos No Afectos:</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{dte.resumen.totalNoGravado}}</td>
                        </tr>
                        <tr style="display:flex">
                            <td class="text-normal flex-center" style="width:280px;border: 0;" col-span="4"></td>
                            <td class="text-normal flex-center" style="width:233.33px;text-align:right;justify-content: end;" colspan="5">Total a Pagar:</td>
                            <td class="text-normal flex-center" style="width:46.6px;">{{dte.resumen.totalPagar}}</td>
                        </tr>
                    </tbody>
                </table>
        </div>
    </body>
    </html>
    `;
};
