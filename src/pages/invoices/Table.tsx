import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Styles,
} from "@react-pdf/renderer";
import { styles as SStyles } from "./template_default_ccf/style";

const styles = StyleSheet.create({
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
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
    borderColor: "black",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 2,
    fontWeight: "bold",
  },
  tableCell: {
    margin: 2,
    fontSize: 10,
  },
});

export const Table = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.table}>{children}</View>
);

interface TableProps {
  headers: string[];
  sizes: number[];
  fontSize: string | number;
}

export const TableHeader = ({ headers, sizes, fontSize }: TableProps) => (
  <View style={styles.tableRow}>
    {headers.map((header, index) => (
      <View
        style={{ ...styles.tableCol, width: `${sizes[index]}%`, fontSize }}
        key={index}
      >
        <Text
          style={[
            styles.tableCellHeader,
            SStyles.subtitleNormal,
            { fontSize, textAlign: "center" },
          ]}
        >
          {header}
        </Text>
      </View>
    ))}
  </View>
);

interface ThProps {
  styles: Styles;
  name: string;
}

export const Th = (props: ThProps) => {
  return (
    <View style={props.styles}>
      <Text style={styles.tableCellHeader}>{props.name}</Text>
    </View>
  );
};

export const TableRow = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.tableRow}>{children}</View>
);

interface TdProps {
  size: number;
  children: React.ReactNode;
}

export const TableCell = ({ children, size }: TdProps) => (
  <View
    style={{
      ...styles.tableCol,
      width: `${size}%`,
      height: 20,
      display: "flex",
      justifyContent: "center",
      padding: 2,
    }}
  >
    {children}
  </View>
);

export interface TdPropsWithoutBorder {
  size: number;
  children: React.ReactNode;
  border?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

export const TableCellWithoutBorder = ({
  children,
  size,
  border,
}: TdPropsWithoutBorder) => (
  <View
    style={{
      ...styles.tableCol,
      borderColor: "#000",
      borderStyle: "solid",
      width: `${size}%`,
      display: "flex",
      justifyContent: "center",
      paddingHorizontal: 5,
      paddingVertical: 2,
      ...(border
        ? {
            borderLeftWidth: border.left ?? 0,
            borderTopWidth: border.top ?? 0,
            borderRightWidth: border.right ?? 0,
            borderBottomWidth: border.bottom ?? 0,
          }
        : { border: 0 }),
    }}
  >
    {children}
  </View>
);

export const TableWithoutBorder = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <View style={{ ...styles.table, border: 0 }}>{children}</View>;
};
