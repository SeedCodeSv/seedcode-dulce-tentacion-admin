import { View, Text } from "@react-pdf/renderer";
import { DteJson } from "../../types/DTE/DTE.types";

interface Props {
  DTE: DteJson;
}

export default function Emisor(props: Props) {
  return (
    <View style={{ width: "50%", display: "flex", height: "auto" }}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 8,
          fontWeight: "semibold",
        }}
      >
        Emisor
      </Text>
      <View
        style={{
          border: "1px solid #000",
          borderRadius: 10,
          padding: 10,
          height: "auto",
        }}
      >
        <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Text
            style={{
              margin: 0,
              padding: 0,
              fontSize: 7,
              fontWeight: "semibold",
              width: "35%",
            }}
          >
            Nombre o razón social:
          </Text>
          <Text style={{ margin: 0, padding: 0, fontSize: 7, width: "65%" }}>
            {props.DTE.dteJson.emisor.nombre}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            marginTop: 3,
          }}
        >
          <Text
            style={{
              margin: 0,
              padding: 0,
              fontSize: 7,
              fontWeight: "semibold",
              width: "35%",
            }}
          >
            NIT:
          </Text>
          <Text style={{ margin: 0, padding: 0, fontSize: 7, width: "65%" }}>
            {props.DTE.dteJson.emisor.nit}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            marginTop: 3,
          }}
        >
          <Text
            style={{
              margin: 0,
              padding: 0,
              fontSize: 7,
              fontWeight: "semibold",
              width: "35%",
            }}
          >
            NRC:
          </Text>
          <Text style={{ margin: 0, padding: 0, fontSize: 7, width: "65%" }}>
            {props.DTE.dteJson.emisor.nrc}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            marginTop: 3,
          }}
        >
          <Text
            style={{
              margin: 0,
              padding: 0,
              fontSize: 7,
              fontWeight: "semibold",
              width: "35%",
            }}
          >
            Actividad económica:
          </Text>
          <Text style={{ margin: 0, padding: 0, fontSize: 7, width: "65%" }}>
            {props.DTE.dteJson.emisor.descActividad}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            marginTop: 3,
          }}
        >
          <Text
            style={{
              margin: 0,
              padding: 0,
              fontSize: 7,
              fontWeight: "semibold",
              width: "35%",
            }}
          >
            Dirección:
          </Text>
          <Text style={{ margin: 0, padding: 0, fontSize: 7, width: "65%" }}>
            {props.DTE.dteJson.emisor.direccion.departamento},{" "}
            {props.DTE.dteJson.emisor.direccion.municipio},{" "}
            {props.DTE.dteJson.emisor.direccion.complemento}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            marginTop: 3,
          }}
        >
          <Text
            style={{
              margin: 0,
              padding: 0,
              fontSize: 7,
              fontWeight: "semibold",
              width: "35%",
            }}
          >
            Número de teléfono:
          </Text>
          <Text style={{ margin: 0, padding: 0, fontSize: 7, width: "65%" }}>
            {props.DTE.dteJson.emisor.telefono}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            marginTop: 3,
          }}
        >
          <Text
            style={{
              margin: 0,
              padding: 0,
              fontSize: 7,
              fontWeight: "semibold",
              width: "35%",
            }}
          >
            Correo electrónico:
          </Text>
          <Text style={{ margin: 0, padding: 0, fontSize: 7, width: "65%" }}>
            {props.DTE.dteJson.emisor.correo}
          </Text>
        </View>
      </View>
    </View>
  );
}
