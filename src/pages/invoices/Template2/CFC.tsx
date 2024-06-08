import {
  Document,
  Page,
  StyleSheet,
  View,
  Image,
  Text,
  Font,
} from "@react-pdf/renderer";
import { Theme } from "../../../hooks/useTheme";
import LOGO from "../../../assets/logoMIN.png";
import ROBOTO_BOLD from "../../../assets/fonts/Roboto-Bold.ttf";
import ROBOTO_REGULAR from "../../../assets/fonts/Roboto-Regular.ttf";
import { Table, TableCell, TableHeader, TableRow } from "../global/Table";
import { formatCurrency } from "../../../utils/dte";
import DTE from "../../../assets/json/20F6B3E1-4AA4-4A93-A169-7F718E9987E9.json";
import TableFooter from "../template_default_ccf/table_footer";
import { SVFC_CF_Firmado } from "../../../types/svf_dte/cf.types";

function CreditoFiscalTMP() {
  const theme = JSON.parse(localStorage.getItem("theme") ?? "{}") as Theme;

  Font.register({
    family: "Oswald",
    fonts: [
      {
        src: ROBOTO_BOLD,
        fontWeight: 800,
      },
      {
        src: ROBOTO_REGULAR,
        fontWeight: 400,
      },
    ],
  });

  const style = StyleSheet.create({
    page: {},
    titles: {
      fontSize: 8,
      fontFamily: "Oswald",
      fontWeight: 800,
      textTransform: "uppercase",
    },
    text_roboto_regular: {
      fontSize: 7,
      fontFamily: "Oswald",
      fontWeight: 400,
    },
    text_roboto_bold: {
      fontSize: 7,
      fontFamily: "Oswald",
      fontWeight: 800,
    },
    pageNumber: {
      width: "100%",
      position: "absolute",
      fontSize: 7,
      marginBottom: 20,
      bottom: 30,
      textAlign: "center",
      display: "flex",
      paddingHorizontal: 25,
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });

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
      <Page style={{ padding: 25 }}>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Image src={LOGO} style={{ maxWidth: 50, maxHeight: 50 }} />
            <Image
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=www.seedcodesv.com`}
              style={{ maxHeight: 50, maxWidth: 55, marginLeft: 20 }}
            ></Image>
          </View>
          <View style={{ display: "flex", flexDirection: "column" }}>
            <Text style={[style.titles, { textAlign: "right" }]}>
              DOCUMENTO DE CONSULTA PORTAL OPERATIVO
            </Text>
            <Text style={[style.titles, { marginTop: 3, textAlign: "right" }]}>
              DOCUMENTO TRIBUTARIO ELECTRÓNICO
            </Text>
            <Text style={[style.titles, { marginTop: 3, textAlign: "right" }]}>
              FACTURA
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text
                style={[
                  style.text_roboto_bold,
                  { textAlign: "left", width: 75 },
                ]}
              >
                Código de Generación:
              </Text>
              <Text
                style={[
                  style.text_roboto_regular,
                  { fontWeight: 500, textAlign: "left" },
                ]}
              >
                23FF0344-CD9B-4C52-A7D7-12D2245B8E85
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                marginTop: 3,
              }}
            >
              <Text
                style={[
                  style.text_roboto_bold,
                  { textAlign: "left", width: 75 },
                ]}
              >
                Número de Control:
              </Text>
              <Text
                style={[
                  style.text_roboto_regular,
                  { fontWeight: 500, textAlign: "left" },
                ]}
              >
                DTE-01-M002P001-000000000005026
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                marginTop: 3,
              }}
            >
              <Text
                style={[
                  style.text_roboto_bold,
                  { textAlign: "left", width: 75 },
                ]}
              >
                Sello de Recepción:
              </Text>
              <Text
                style={[
                  style.text_roboto_regular,
                  { fontWeight: 500, textAlign: "left" },
                ]}
              >
                202449E51CC7F66B410BBA0DFEF6DDE04A0BQXGX
              </Text>
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "column" }}>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text
                style={[
                  style.text_roboto_bold,
                  { textAlign: "left", width: 90 },
                ]}
              >
                Modelo de Facturación:
              </Text>
              <Text
                style={[
                  style.text_roboto_regular,
                  { fontWeight: 500, textAlign: "left" },
                ]}
              >
                Previo
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                marginTop: 3,
              }}
            >
              <Text
                style={[
                  style.text_roboto_bold,
                  { textAlign: "left", width: 90 },
                ]}
              >
                Tipo de Transmisión:
              </Text>
              <Text
                style={[
                  style.text_roboto_regular,
                  { fontWeight: 500, textAlign: "left" },
                ]}
              >
                Normal
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                marginTop: 3,
              }}
            >
              <Text
                style={[
                  style.text_roboto_bold,
                  { textAlign: "left", width: 90 },
                ]}
              >
                Fecha y Hora de Generación:
              </Text>
              <Text
                style={[
                  style.text_roboto_regular,
                  { fontWeight: 500, textAlign: "left" },
                ]}
              >
                2024-06-04 17:11:11
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <View style={{ width: "50%" }}>
            <Text
              style={[
                style.text_roboto_bold,
                {
                  textAlign: "center",
                  paddingVertical: 3,
                },
              ]}
            >
              EMISOR
            </Text>
            <View
              style={{
                paddingVertical: 10,
                borderTop: `1px solid ${theme.colors.secondary}`,
                height: "auto",
              }}
            >
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <Text style={style.text_roboto_bold}>
                  Nombre o razón social:
                </Text>
                <Text style={style.text_roboto_regular}>
                  HERNANDEZ MARQUEZ, JOSE MANUEL
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  marginTop: 2,
                }}
              >
                <Text style={style.text_roboto_bold}>NIT:</Text>
                <Text style={style.text_roboto_regular}>0316-090298-101-0</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  marginTop: 2,
                }}
              >
                <Text style={style.text_roboto_bold}>NRC:</Text>
                <Text style={style.text_roboto_regular}>316529-8</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  marginTop: 2,
                }}
              >
                <Text style={style.text_roboto_bold}>Actividad económica:</Text>
                <Text style={[style.text_roboto_regular, { maxWidth: 150 }]}>
                  Otras actividades de tegnologia de informacion y servicios de
                  computadora
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  marginTop: 2,
                }}
              >
                <Text style={style.text_roboto_bold}>Dirección:</Text>
                <Text style={[style.text_roboto_regular, { maxWidth: 160 }]}>
                  Avenida santa lucia Block K casa #5, SONZACATE, SONSONATE
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  marginTop: 2,
                }}
              >
                <Text style={style.text_roboto_bold}>Número de teléfono:</Text>
                <Text style={style.text_roboto_regular}>70245680</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  marginTop: 2,
                }}
              >
                <Text style={style.text_roboto_bold}>Correo electrónico:</Text>
                <Text style={style.text_roboto_regular}>
                  seedcodesv@gmail.com
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  marginTop: 2,
                }}
              >
                <Text style={style.text_roboto_bold}>
                  Tipo de establecimiento:
                </Text>
                <Text style={style.text_roboto_regular}>
                  Sucursal / Agencia
                </Text>
              </View>
            </View>
          </View>
          <View style={{ width: "50%" }}>
            <Text
              style={[
                style.text_roboto_bold,
                {
                  textAlign: "center",
                  paddingVertical: 3,
                },
              ]}
            >
              RECEPTOR
            </Text>
            <View
              style={{
                paddingVertical: 10,
                borderTop: `1px solid ${theme.colors.secondary}`,
                height: "auto",
              }}
            >
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <Text style={style.text_roboto_bold}>
                  Nombre o razón social:
                </Text>
                <Text style={style.text_roboto_regular}>
                  ALBERTO RODRIGUEZ, BILLY ALEXANDER
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  marginTop: 2,
                }}
              >
                <Text style={style.text_roboto_bold}>NIT:</Text>
                <Text style={style.text_roboto_regular}>0315-200576-101-3</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  marginTop: 2,
                }}
              >
                <Text style={style.text_roboto_bold}>Correo electrónico:</Text>
                <Text style={style.text_roboto_regular}>
                  marvinhcarbajal09@gmail.com
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  marginTop: 2,
                }}
              >
                <Text style={style.text_roboto_bold}>Dirección:</Text>
                <Text style={style.text_roboto_regular}>
                  Avenida santa lucia Block K casa #5, SONZACATE, SONSONATE
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 5,
                  marginTop: 2,
                }}
              >
                <Text style={style.text_roboto_bold}>Número de teléfono:</Text>
                <Text style={style.text_roboto_regular}>70245680</Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            borderTop: `1px solid ${theme.colors.third}`,
          }}
        ></View>
        <View>
          <Text
            style={[
              style.text_roboto_bold,
              { marginTop: 5, textAlign: "center", paddingBottom: 5 },
            ]}
          >
            VENTA A CUENTA DE TERCEROS
          </Text>
        </View>
        <View>
          <Table borderColor={theme.colors.third}>
            <TableHeader
              colorCell={theme.colors.dark}
              textColor={theme.colors.primary}
              borderColor={theme.colors.third}
              headers={["NIT", "Nombre, denominación o razón social"]}
              sizes={[50, 50]}
              fontSize={7}
            />
            <TableRow borderColor={theme.colors.third}>
              <TableCell size={50} borderColor={theme.colors.third}>
                <Text style={{ fontSize: 6.5, textAlign: "center" }}>-</Text>
              </TableCell>
              <TableCell size={50} borderColor={theme.colors.third}>
                <Text style={{ fontSize: 6.5, textAlign: "center" }}>-</Text>
              </TableCell>
            </TableRow>
          </Table>
        </View>
        <View>
          <Text
            style={[
              style.text_roboto_bold,
              { marginTop: 5, textAlign: "center", paddingBottom: 5 },
            ]}
          >
            DOCUMENTOS RELACIONADOS
          </Text>
        </View>
        <View>
          <Table borderColor={theme.colors.third}>
            <TableHeader
              colorCell={theme.colors.dark}
              textColor={theme.colors.primary}
              borderColor={theme.colors.third}
              headers={[
                "Tipo de Documento",
                "N° de Documento",
                "Fecha de Documento",
              ]}
              sizes={[33.33, 33.33, 33.33]}
              fontSize={7}
            />
            <TableRow borderColor={theme.colors.third}>
              <TableCell size={33.33} borderColor={theme.colors.third}>
                <Text style={{ fontSize: 6.5, textAlign: "center" }}>-</Text>
              </TableCell>
              <TableCell size={33.33} borderColor={theme.colors.third}>
                <Text style={{ fontSize: 6.5, textAlign: "center" }}>-</Text>
              </TableCell>
              <TableCell size={33.33} borderColor={theme.colors.third}>
                <Text style={{ fontSize: 6.5, textAlign: "center" }}>-</Text>
              </TableCell>
            </TableRow>
          </Table>
        </View>
        <View>
          <Text
            style={[
              style.text_roboto_bold,
              { marginTop: 5, textAlign: "center", paddingBottom: 5 },
            ]}
          >
            OTROS DOCUMENTOS ASOCIADOS
          </Text>
        </View>
        <View>
          <Table borderColor={theme.colors.third}>
            <TableHeader
              colorCell={theme.colors.dark}
              textColor={theme.colors.primary}
              borderColor={theme.colors.third}
              headers={["Identificación del documento", "Descripción"]}
              sizes={[35, 65]}
              fontSize={7}
            />
            <TableRow borderColor={theme.colors.third}>
              <TableCell size={35} borderColor={theme.colors.third}>
                <Text style={{ fontSize: 6.5, textAlign: "center" }}>-</Text>
              </TableCell>
              <TableCell size={65} borderColor={theme.colors.third}>
                <Text style={{ fontSize: 6.5, textAlign: "center" }}>-</Text>
              </TableCell>
            </TableRow>
          </Table>
        </View>
        <View style={{ marginTop: 5 }}>
          <Table borderColor={theme.colors.third}>
            <TableHeader
              colorCell={theme.colors.dark}
              textColor={theme.colors.primary}
              borderColor={theme.colors.third}
              headers={headers}
              sizes={[7.5, 41, 8, 8, 11, 8.5, 8, 8]}
              fontSize={7}
            />
            <TableRow>
              <TableCell size={7.5}>
                <Text style={{ fontSize: 6.5, textAlign: "center" }}>{23}</Text>
              </TableCell>
              <TableCell size={41}>
                <Text style={{ fontSize: 6.5, textAlign: "center" }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                  ratione voluptatum blanditiis tenetur magni voluptatibus vel
                  corrupti, laboriosam minus ipsam! Aliquid nesciunt reiciendis
                  omnis repudiandae consequatur quia tenetur culpa a!
                </Text>
              </TableCell>
              <TableCell size={8}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(23))}
                </Text>
              </TableCell>
              <TableCell size={8}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(43))}
                </Text>
              </TableCell>
              <TableCell size={11}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(0))}
                </Text>
              </TableCell>
              <TableCell size={8.5}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(0))}
                </Text>
              </TableCell>
              <TableCell size={8}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(0))}
                </Text>
              </TableCell>
              <TableCell size={8}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(34))}
                </Text>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell size={7.5}>
                <Text style={{ fontSize: 6.5, textAlign: "center" }}>{23}</Text>
              </TableCell>
              <TableCell size={41}>
                <Text style={{ fontSize: 6.5, textAlign: "center" }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                  ratione voluptatum blanditiis tenetur magni voluptatibus vel
                  corrupti, laboriosam minus ipsam! Aliquid nesciunt reiciendis
                  omnis repudiandae consequatur quia tenetur culpa a!
                </Text>
              </TableCell>
              <TableCell size={8}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(23))}
                </Text>
              </TableCell>
              <TableCell size={8}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(43))}
                </Text>
              </TableCell>
              <TableCell size={11}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(0))}
                </Text>
              </TableCell>
              <TableCell size={8.5}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(0))}
                </Text>
              </TableCell>
              <TableCell size={8}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(0))}
                </Text>
              </TableCell>
              <TableCell size={8}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(34))}
                </Text>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell size={7.5}>
                <Text style={{ fontSize: 6.5, textAlign: "center" }}>{23}</Text>
              </TableCell>
              <TableCell size={41}>
                <Text style={{ fontSize: 6.5, textAlign: "center" }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                  ratione voluptatum blanditiis tenetur magni voluptatibus vel
                  corrupti, laboriosam minus ipsam! Aliquid nesciunt reiciendis
                  omnis repudiandae consequatur quia tenetur culpa a!
                </Text>
              </TableCell>
              <TableCell size={8}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(23))}
                </Text>
              </TableCell>
              <TableCell size={8}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(43))}
                </Text>
              </TableCell>
              <TableCell size={11}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(0))}
                </Text>
              </TableCell>
              <TableCell size={8.5}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(0))}
                </Text>
              </TableCell>
              <TableCell size={8}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(0))}
                </Text>
              </TableCell>
              <TableCell size={8}>
                <Text style={{ fontSize: 6.5, textAlign: "right" }}>
                  {formatCurrency(Number(34))}
                </Text>
              </TableCell>
            </TableRow>
          </Table>
        </View>

        <View style={{ marginTop: 2 }}>
          <TableFooter dte={DTE as SVFC_CF_Firmado} />
        </View>
        <View style={style.pageNumber} fixed>
          <Text>Power By: SeedCodeSv - www.seedcodesv.com</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Pagina ${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

export default CreditoFiscalTMP;
