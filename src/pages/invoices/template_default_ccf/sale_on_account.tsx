import { Text, View } from "@react-pdf/renderer";
import { styles } from "./style";

function sale_on_account() {
  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 15,
        marginTop: 5,
      }}
    >
      <Text style={[styles.subtitle, { fontSize: 6.5 }]}>
        VENTA A CUENTA DE TERCEROS
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: 5,
          border: "1px solid black",
          borderRadius: 15,
        }}
      >
        <View
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "row",
            padding: 5,
          }}
        >
          <Text style={{ fontSize: 6.5 }}>NIT:</Text>
          <Text style={{ marginLeft: 30, fontSize: 6.5 }}>-</Text>
        </View>
        <View
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "row",
            padding: 5,
          }}
        >
          <Text style={{ width: 100, fontSize: 6.5 }}>
            Nombre, denominación o razón social:
          </Text>
          <Text style={{ marginLeft: 30, fontSize: 6.5 }}>-</Text>
        </View>
      </View>
    </View>
  );
}

export default sale_on_account;
