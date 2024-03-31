import { View, Text } from "@react-pdf/renderer";

export default function Receptor() {
  return (
    <View style={{ width: "50%", display:"flex", height:"auto" }}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 8,
          fontWeight: "semibold",
        }}
      >
        Receptor
      </Text>
      <View
        style={{
          border: "1px solid #000",
          borderRadius: 10,
          padding: 10,
          height:"auto"
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
            ALBERTO RODRIGUEZ, BILLY ALEXANDER
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
            Código actividad:
          </Text>
          <Text style={{ margin: 0, padding: 0, fontSize: 7, width: "65%" }}>
            96030
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
            Descripción de actividad económica:
          </Text>
          <Text style={{ margin: 0, padding: 0, fontSize: 7, width: "65%" }}>
            Pompas fúnebres y actividades conexas
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
            Nombre comercial:
          </Text>
          <Text style={{ margin: 0, padding: 0, fontSize: 7, width: "65%" }}>
            Funeraria El Lirio De Los Valles
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
