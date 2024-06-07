import { Font, StyleSheet } from "@react-pdf/renderer";
import ROBOTO_BOLD from "../../../assets/fonts/Roboto-Bold.ttf";

Font.register({
    family: "Oswald",
    fonts: [
      {
        src: ROBOTO_BOLD,
        fontWeight: 800,
      },
    ],
  });
  
  export const styles = StyleSheet.create({
    body: {
      padding: 10,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    title: {
      fontSize: 24,
      textAlign: "center",
      fontFamily: "Oswald",
    },
    author: {
      fontSize: 12,
      textAlign: "center",
      marginBottom: 40,
    },
    subtitle: {
      fontSize: 7,
      textAlign: "center",
      paddingHorizontal: 5,
      textTransform: "uppercase",
      fontFamily: "Oswald",
      fontWeight: 800,
    },
    subtitleNormal: {
      fontSize: 7,
      fontFamily: "Oswald",
      fontWeight: 800,
    },
    text: {
      margin: 12,
      fontSize: 14,
      textAlign: "justify",
      fontFamily: "Times-Roman",
    },
    image: {
      marginVertical: 15,
      marginHorizontal: 100,
    },
    header: {
      fontSize: 10,
      marginBottom: 20,
      textAlign: "center",
      color: "#000",
    },
    pageNumber: {
      width: "100%",
      position: "absolute",
      fontSize: 7,
      marginBottom: 20,
      bottom: 30,
      textAlign: "center",
      display: "flex",
      paddingHorizontal: 30,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    textBold: {
      fontFamily: "Oswald",
      fontWeight: "bold",
    },
    td_without_border: {
        fontSize: 7,
        padding: 3,
        textAlign: 'center',
        justifyContent: 'center',
        border: '1px solid #fff',
      },
      td_with_border: {
        fontSize: 7,
        padding: 3,
        textAlign: 'center',
        justifyContent: 'center',
        border: '1px solid #000',
      },
  });