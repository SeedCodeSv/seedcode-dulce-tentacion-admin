import { View, Text } from "@react-pdf/renderer";

export default function Emisor() {
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
            HERNANDEZ MARQUEZ, JOSE MANUEL
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
            03160902981010
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
            3165298
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
            Otras actividades de tegnologia de informacion y servicios de
            computadora
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
            Avenida santa lucia Block K casa #5 , 16 , 03
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
            70245680
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
            seedcodesv@gmail.com
          </Text>
        </View>
      </View>
    </View>
  );
}
