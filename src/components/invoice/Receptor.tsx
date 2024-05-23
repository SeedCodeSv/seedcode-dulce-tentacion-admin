import { View, Text } from '@react-pdf/renderer';
import { DteJson } from '../../types/DTE/DTE.types';

interface Props {
  DTE: DteJson;
}

export default function Receptor(props: Props) {
  return (
    <View style={{ width: '50%', display: 'flex', height: 'auto' }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 8,
          fontWeight: 'semibold',
        }}
      >
        Receptor
      </Text>
      <View
        style={{
          border: '1px solid #000',
          borderRadius: 10,
          padding: 10,
          height: 'auto',
        }}
      >
        <View style={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <Text
            style={{
              margin: 0,
              padding: 0,
              fontSize: 7,
              fontWeight: 'semibold',
              width: '35%',
            }}
          >
            Nombre o razón social:
          </Text>
          <Text style={{ margin: 0, padding: 0, fontSize: 7, width: '65%' }}>
            {props.DTE.dteJson.receptor.nombre}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            marginTop: 3,
          }}
        >
          <Text
            style={{
              margin: 0,
              padding: 0,
              fontSize: 7,
              fontWeight: 'semibold',
              width: '35%',
            }}
          >
            Numero documento:
          </Text>
          <Text style={{ margin: 0, padding: 0, fontSize: 7, width: '65%' }}>
            {props.DTE.dteJson.receptor.numDocumento}
          </Text>
        </View>
        {props.DTE.dteJson.receptor.nrc !== 'N/A' && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              marginTop: 3,
            }}
          >
            <Text
              style={{
                margin: 0,
                padding: 0,
                fontSize: 7,
                fontWeight: 'semibold',
                width: '35%',
              }}
            >
              NRC:
            </Text>
            <Text style={{ margin: 0, padding: 0, fontSize: 7, width: '65%' }}>
              {props.DTE.dteJson.receptor.nrc}
            </Text>
          </View>
        )}
        {props.DTE.dteJson.receptor.codActividad !== 'N/A' && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              marginTop: 3,
            }}
          >
            <Text
              style={{
                margin: 0,
                padding: 0,
                fontSize: 7,
                fontWeight: 'semibold',
                width: '35%',
              }}
            >
              Código actividad:
            </Text>
            <Text style={{ margin: 0, padding: 0, fontSize: 7, width: '65%' }}>
              {props.DTE.dteJson.receptor.codActividad}
            </Text>
          </View>
        )}
        {props.DTE.dteJson.receptor.descActividad !== 'N/A' && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              marginTop: 3,
            }}
          >
            <Text
              style={{
                margin: 0,
                padding: 0,
                fontSize: 7,
                fontWeight: 'semibold',
                width: '35%',
              }}
            >
              Descripción de actividad económica:
            </Text>
            <Text style={{ margin: 0, padding: 0, fontSize: 7, width: '65%' }}>
              {props.DTE.dteJson.receptor.descActividad}
            </Text>
          </View>
        )}
        {props.DTE.dteJson.receptor.nombreComercial !== 'N/A' && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              marginTop: 3,
            }}
          >
            <Text
              style={{
                margin: 0,
                padding: 0,
                fontSize: 7,
                fontWeight: 'semibold',
                width: '35%',
              }}
            >
              Nombre comercial:
            </Text>
            <Text style={{ margin: 0, padding: 0, fontSize: 7, width: '65%' }}>
              {props.DTE.dteJson.receptor.nombreComercial}
            </Text>
          </View>
        )}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            marginTop: 3,
          }}
        >
          <Text
            style={{
              margin: 0,
              padding: 0,
              fontSize: 7,
              fontWeight: 'semibold',
              width: '35%',
            }}
          >
            Correo electrónico:
          </Text>
          <Text style={{ margin: 0, padding: 0, fontSize: 7, width: '65%' }}>
            {props.DTE.dteJson.receptor.correo}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            marginTop: 3,
          }}
        >
          <Text
            style={{
              margin: 0,
              padding: 0,
              fontSize: 7,
              fontWeight: 'semibold',
              width: '35%',
            }}
          >
            Número de teléfono:
          </Text>
          <Text style={{ margin: 0, padding: 0, fontSize: 7, width: '65%' }}>
            {props.DTE.dteJson.receptor.telefono}
          </Text>
        </View>
      </View>
    </View>
  );
}
