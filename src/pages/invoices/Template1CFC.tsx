import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./template_default_ccf/style";
import TransmitterReceptor from "./template_default_cfc/transmitter_receptor";
import Header from "./template_default_cfc/header";
import OtherDocuments from "./template_default_cfc/other_documents";
import SaleOnAccount from "./template_default_cfc/sale_on_account";
import RelationsDocuments from "./template_default_cfc/relations_documents";
import TableFooter from "./template_default_cfc/table_footer";
import { TableCell, TableHeader, TableRow, Table } from "./Table";
import { useMemo } from "react";
import { formatCurrency } from "../../utils/dte";
import { SVFC_FC_Firmado } from "../../types/svf_dte/fc.types";

interface ICFCProps {
  dte: SVFC_FC_Firmado;
}

export default function Template1CFC({ dte }: ICFCProps) {
  const firstPageItems = useMemo(() => {
    return dte.cuerpoDocumento.slice(0, 18);
  }, [dte]);

  const restOfTheItems = useMemo(() => {
    return dte.cuerpoDocumento.slice(18);
  }, [dte]);

  const pages = [];

  // Divide the remaining items into groups of 20
  for (let i = 0; i < restOfTheItems.length; i += 30) {
    pages.push(restOfTheItems.slice(i, i + 30));
  }

  const headers = [
    "Cantidad",
    "Descripción",
    `Precio 
    Unitario`,
    `Descuento 
    por ítem`,
    `Otros montos no 
    afectos`,
    `Ventas No 
    Sujetas`,
    `Ventas 
    Exentas`,
    `Ventas 
    Gravadas`,
  ];

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <View
          fixed
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid black",
            borderRadius: 15,
            left: 10,
            top: 10,
            position: "absolute",
          }}
        ></View>
        <View style={{ padding: 15 }}>
          <Header dte={dte} />
          <TransmitterReceptor dte={dte} />
          <OtherDocuments />
          <SaleOnAccount />
          <RelationsDocuments />
          <View style={{ marginTop: 10 }}>
            <Table>
              <TableHeader
                headers={headers}
                sizes={[7.5, 41, 8, 8, 11, 8.5, 8, 8]}
                fontSize={6}
              />
              {firstPageItems.map((item, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell size={7.5}>
                    <Text style={{ fontSize: 6.5, textAlign: "center" }}>
                      {item.cantidad}
                    </Text>
                  </TableCell>
                  <TableCell size={41}>
                    <Text style={{ fontSize: 6.5, textAlign: "center" }}>
                      {item.descripcion}
                    </Text>
                  </TableCell>
                  <TableCell size={8}>
                    <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                      {formatCurrency(Number(item.precioUni))}
                    </Text>
                  </TableCell>
                  <TableCell size={8}>
                    <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                      {formatCurrency(Number(item.noGravado))}
                    </Text>
                  </TableCell>
                  <TableCell size={11}>
                    <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                      {formatCurrency(Number(item.montoDescu))}
                    </Text>
                  </TableCell>
                  <TableCell size={8.5}>
                    <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                      {formatCurrency(Number(item.ventaNoSuj))}
                    </Text>
                  </TableCell>
                  <TableCell size={8}>
                    <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                      {formatCurrency(Number(item.ventaExenta))}
                    </Text>
                  </TableCell>
                  <TableCell size={8}>
                    <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                      {formatCurrency(Number(item.ventaGravada))}
                    </Text>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
            {dte.cuerpoDocumento.length <= 10 && (
              <View style={{ marginTop: 2 }}>
                <TableFooter dte={dte} />
              </View>
            )}
          </View>
          {/* <View fixed style={{ height: 60, width: "100%" }}></View> */}
        </View>
        <View style={styles.pageNumber} fixed>
          <Text>Power By: SeedCodeSv - www.seedcodesv.com</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Pagina ${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </Page>

      <>
        {dte.cuerpoDocumento.length > 10 && dte.cuerpoDocumento.length <= 18 && (
          <Page size="A4" style={styles.body}>
            <View
              fixed
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid black",
                borderRadius: 15,
                left: 10,
                top: 10,
                position: "absolute",
              }}
            ></View>

            <View style={{ padding: 15 }}>
              <Header dte={dte} />
              <View style={{ marginTop: 2 }}>
                <TableFooter dte={dte} />
              </View>
            </View>
            <View style={styles.pageNumber} fixed>
              <Text>Power By: SeedCodeSv - www.seedcodesv.com</Text>
              <Text
                render={({ pageNumber, totalPages }) =>
                  `Pagina ${pageNumber} de ${totalPages}`
                }
              />
            </View>
          </Page>
        )}
      </>

      <>
        {dte.cuerpoDocumento.length > 8 &&
          pages.map((pageItems, pageIndex) => (
            <Page size="A4" style={styles.body} key={pageIndex + 1}>
              <View
                fixed
                style={{
                  width: "100%",
                  height: "100%",
                  border: "1px solid black",
                  borderRadius: 15,
                  left: 10,
                  top: 10,
                  position: "absolute",
                }}
              ></View>

              <View style={{ padding: 15 }}>
                <Header dte={dte} />
                <Table>
                  <TableHeader
                    headers={headers}
                    sizes={[7.5, 41, 8, 8, 11, 8.5, 8, 8]}
                    fontSize={6}
                  />
                  {pageItems.map((item, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell size={7.5}>
                        <Text style={{ fontSize: 6.5, textAlign: "center" }}>
                          {item.cantidad}
                        </Text>
                      </TableCell>
                      <TableCell size={41}>
                        <Text style={{ fontSize: 6.5, textAlign: "center" }}>
                          {item.descripcion}
                        </Text>
                      </TableCell>
                      <TableCell size={8}>
                        <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                          {formatCurrency(Number(item.precioUni))}
                        </Text>
                      </TableCell>
                      <TableCell size={8}>
                        <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                          {formatCurrency(Number(item.noGravado))}
                        </Text>
                      </TableCell>
                      <TableCell size={11}>
                        <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                          {formatCurrency(Number(item.montoDescu))}
                        </Text>
                      </TableCell>
                      <TableCell size={8.5}>
                        <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                          {formatCurrency(Number(item.ventaNoSuj))}
                        </Text>
                      </TableCell>
                      <TableCell size={8}>
                        <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                          {formatCurrency(Number(item.ventaExenta))}
                        </Text>
                      </TableCell>
                      <TableCell size={8}>
                        <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                          {formatCurrency(Number(item.ventaGravada))}
                        </Text>
                      </TableCell>
                    </TableRow>
                  ))}
                </Table>
                {pageIndex === pages.length - 1 && pageItems.length <= 22 && (
                  <TableFooter dte={dte} />
                )}
              </View>
              <View style={styles.pageNumber} fixed>
                <Text>Power By: SeedCodeSv - www.seedcodesv.com</Text>
                <Text
                  render={({ pageNumber, totalPages }) =>
                    `Pagina ${pageNumber} de ${totalPages}`
                  }
                />
              </View>
            </Page>
          ))}

        {pages.length > 0 && pages[pages.length - 1].length > 22 && (
          <Page size="A4" style={styles.body}>
            <View
              fixed
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid black",
                borderRadius: 15,
                left: 10,
                top: 10,
                position: "absolute",
              }}
            ></View>

            <View style={{ padding: 15 }}>
              <Header dte={dte} />
              <View style={{ marginTop: 2 }}>
                <TableFooter dte={dte} />
              </View>
            </View>
            <View style={styles.pageNumber} fixed>
              <Text>Power By: SeedCodeSv - www.seedcodesv.com</Text>
              <Text
                render={({ pageNumber, totalPages }) =>
                  `Pagina ${pageNumber} de ${totalPages}`
                }
              />
            </View>
          </Page>
        )}
      </>
    </Document>
  );
}
