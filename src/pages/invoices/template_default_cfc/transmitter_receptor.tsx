import { View, Text } from "@react-pdf/renderer";
import { styles } from "./style";
import { SeedcodeCatalogosMhService } from "seedcode-catalogos-mh";
import { SVFC_FC_Firmado } from "../../../types/svf_dte/fc.types";

interface ICFCProps {
  dte: SVFC_FC_Firmado;
}

function transmitter_receptor({ dte }: ICFCProps) {
  const return_adrress = (codMun: string, codDep: string) => {
    const service = new SeedcodeCatalogosMhService();

    const dep = service
      .get012Departamento()
      .find((dep) => dep.codigo === codDep);

    if (dep) {
      const mun = service.get013Municipio(codDep);

      if (mun) {
        const adrres = mun.find((mun) => mun.codigo === codMun);

        if (adrres) {
          return adrres.valores + ", " + dep.valores;
        }

        return dep.valores;
      }
      return dep.valores;
    }
    return "";
  };

  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: 10,
        }}
      >
        <View
          style={{
            width: "50%",
          }}
        >
          <Text style={styles.subtitle}>EMISOR</Text>
          <View
            style={{
              width: "100%",
              border: "1px solid black",
              borderRadius: 15,
              padding: 10,
              marginTop: 5,
            }}
          >
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text
                style={[
                  styles.textBold,
                  { fontSize: 6, width: 80, textAlign: "right" },
                ]}
              >
                Nombre o razón social:
              </Text>
              <Text style={{ fontSize: 6, width: 150 }}>
                {dte.emisor.nombre}
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
                  styles.textBold,
                  { fontSize: 6, width: 80, textAlign: "right" },
                ]}
              >
                NIT:
              </Text>
              <Text style={{ fontSize: 6, width: 150 }}>{dte.emisor.nit}</Text>
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
                  styles.textBold,
                  { fontSize: 6, width: 80, textAlign: "right" },
                ]}
              >
                NRC:
              </Text>
              <Text style={{ fontSize: 6, width: 150 }}>{dte.emisor.nrc}</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                marginTop: 3,
              }}
            >
              <Text style={[styles.textBold, { fontSize: 6, width: 80, textAlign:"right" }]}>
                Actividad económica :
              </Text>
              <Text style={{ fontSize: 6, width: 150 }}>
                {dte.emisor.descActividad}
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
                  styles.textBold,
                  { fontSize: 6, width: 80, textAlign: "right" },
                ]}
              >
                Dirección:
              </Text>
              <Text style={{ fontSize: 6, width: 150 }}>
                {dte.emisor.direccion.complemento},{" "}
                {return_adrress(
                  dte.emisor.direccion.municipio,
                  dte.emisor.direccion.departamento
                )}
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
                  styles.textBold,
                  { fontSize: 6, width: 80, textAlign: "right" },
                ]}
              >
                Número de teléfono:
              </Text>
              <Text style={{ fontSize: 6, width: 150 }}>
                {dte.emisor.telefono}
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
                  styles.textBold,
                  { fontSize: 6, width: 80, textAlign: "right" },
                ]}
              >
                Correo electrónico:
              </Text>
              <Text style={{ fontSize: 6, width: 150 }}>
                {dte.emisor.correo}
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
                  styles.textBold,
                  { fontSize: 6, width: 80, textAlign: "right" },
                ]}
              >
                Tipo de establecimiento:{" "}
              </Text>
              <Text style={{ fontSize: 6, width: 150 }}>
                {dte.emisor.tipoEstablecimiento}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: "50%",
          }}
        >
          <Text style={styles.subtitle}>RECEPTOR</Text>
          <View
            style={{
              marginTop: 5,
              width: "100%",
              border: "1px solid black",
              borderRadius: 15,
              padding: 5,
            }}
          >
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text
                style={[
                  styles.textBold,
                  { fontSize: 6, width: 80, textAlign: "right" },
                ]}
              >
                Nombre o razón social:
              </Text>
              <Text style={{ fontSize: 6, width: 150 }}>
                {dte.receptor.nombre}
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
                  styles.textBold,
                  { fontSize: 6, width: 80, textAlign: "right" },
                ]}
              >
                NRC:
              </Text>
              <Text style={{ fontSize: 6, width: 150 }}>
                {dte.receptor.nrc !== "0" && dte.receptor.nrc !== "N/A"
                  ? dte.receptor.nrc
                  : "No especificado"}
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
                  styles.textBold,
                  { fontSize: 6, width: 80, textAlign: "right" },
                ]}
              >
                Actividad económica:
              </Text>
              <Text style={{ fontSize: 6, width: 150 }}>
                {dte.receptor.descActividad !== "0" &&
                dte.receptor.descActividad !== "N/A"
                  ? dte.receptor.descActividad
                  : "No especificado"}
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
                  styles.textBold,
                  { fontSize: 6, width: 80, textAlign: "right" },
                ]}
              >
                Dirección
              </Text>
              {dte.receptor.direccion ? (
                <Text style={{ fontSize: 6, width: 150 }}>
                  {dte.receptor.direccion.complemento},{" "}
                  {return_adrress(
                    dte.emisor.direccion.municipio,
                    dte.emisor.direccion.departamento
                  )}
                </Text>
              ) : (
                <>
                  <Text style={{ fontSize: 6, width: 150 }}>
                    No especificado
                  </Text>
                </>
              )}
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
                  styles.textBold,
                  { fontSize: 6, width: 80, textAlign: "right" },
                ]}
              >
                Número de teléfono:
              </Text>
              <Text style={{ fontSize: 6, width: 150 }}>
                {dte.receptor.telefono}
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
                  styles.textBold,
                  { fontSize: 6, width: 80, textAlign: "right" },
                ]}
              >
                Correo electrónico:
              </Text>
              <Text style={{ fontSize: 6, width: 150 }}>
                {dte.receptor.correo}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

export default transmitter_receptor;
