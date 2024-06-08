import { Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import ROBOTO_BOLD from "../../../assets/fonts/Roboto-Bold.ttf";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: ROBOTO_BOLD,
      fontWeight: 800,
    },
  ],
});

const styles = StyleSheet.create({
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 2,
    fontWeight: "bold",
    paddingVertical: 3,
  },
  tableCell: {
    margin: 2,
    fontSize: 10,
  },
  textRobotoBold: {
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
});

interface Props {
  children: React.ReactNode;
  borderColor: string;
}

export const Table = ({ children, borderColor = "#000" }: Props) => {
  return <View style={[styles.table, { borderColor }]}>{children}</View>;
};

interface TableProps {
  headers: string[];
  sizes: number[];
  fontSize: string | number;
  colorCell?: string;
  borderColor?: string;
  textColor?: string;
}

export const TableHeader = ({
  headers,
  sizes,
  fontSize,
  colorCell = "#f5f5f5",
  borderColor = "#000",
  textColor = "#000",
}: TableProps) => (
  <View style={[styles.tableRow, { borderColor }]}>
    {headers.map((header, index) => (
      <View
        style={{
          ...styles.tableCol,
          width: `${sizes[index]}%`,
          fontSize,
          backgroundColor: colorCell,
          borderColor
        }}
        key={index}
      >
        <Text
          style={[
            styles.tableCellHeader,
            styles.textRobotoBold,
            { fontSize, textAlign: "center", color: textColor },
          ]}
        >
          {header}
        </Text>
      </View>
    ))}
  </View>
);

interface TdProps {
  size: number;
  children: React.ReactNode;
  borderColor?: string;
}

export const TableCell = ({ children, size, borderColor = "#000" }: TdProps) => (
  <View
    style={{
      ...styles.tableCol,
      width: `${size}%`,
      height: 20,
      display: "flex",
      justifyContent: "center",
      padding: 2,
      borderColor,
    }}
  >
    {children}
  </View>
);

export interface RowProps {
  children: React.ReactNode;
  borderColor?: string;
}

export const TableRow = ({ children, borderColor = "#000" }: RowProps) => (
  <View style={[styles.tableRow, { borderColor }]}>{children}</View>
);
