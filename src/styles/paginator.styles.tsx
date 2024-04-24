import { PaginatorPassThroughOptions } from "primereact/paginator";
import { useContext } from "react";
import { ThemeContext } from "../hooks/useTheme";

export const paginator_styles = (currentPage:number): PaginatorPassThroughOptions => {
  const { theme } = useContext(ThemeContext);

  return {
    pageButton: (item) => {
      console.log(item)
      return {
        className: "!rounded-full font-semibold",
        style: {
          backgroundColor: currentPage === item?.props.first ? theme.colors.dark : "#fff",
          color: currentPage === item?.props.first
            ? theme.colors.primary
            : theme.context === "dark"
            ? theme.colors.dark
            : theme.colors.primary,
          borderWidth: 1,
          borderColor: currentPage === item?.props.first
            ? theme.colors.dark
            : theme.colors.dark,
        },
      };
    },
    prevPageButton: () => ({
        className: "!rounded-full font-semibold",
        style: {
          backgroundColor: theme.colors.dark,
          color: theme.colors.primary,
        },
      }),
      nextPageButton: () => ({
        className: "!rounded-full font-semibold",
        style: {
          backgroundColor: theme.colors.dark,
          color: theme.colors.primary,
        },
      }),
      firstPageButton: () => ({
        className: "!rounded-full font-semibold",
        style: {
          backgroundColor: theme.colors.dark,
          color: theme.colors.primary,
        },
      }),
      lastPageButton: () => ({
        className: "!rounded-full font-semibold",
        style: {
          backgroundColor: theme.colors.dark,
          color: theme.colors.primary,
        },
      }),
    
  };
};
