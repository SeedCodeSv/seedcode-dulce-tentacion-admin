import { Button } from "@nextui-org/react";
import React, { useContext, useState } from "react";
import { classNames } from "primereact/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { ThemeContext } from "../../hooks/useTheme";

interface PaginationProps {
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  nextPage: number;
  previousPage: number;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { theme } = useContext(ThemeContext);

  const activeStyle = {
    background: theme.colors.dark,
    color: theme.colors.primary,
  };
  
  const inactiveStyle = {
    background: theme.colors.primary,
    color: theme.context === "light" ? theme.colors.primary : theme.colors.dark,
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    onPageChange(pageNumber);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPages = 5; // Maximum visible pages (including first and last)

    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            size="lg"
            style={currentPage === i ? activeStyle : inactiveStyle}
            onClick={() => handlePageChange(i)}
            isIconOnly
            className={classNames(currentPage === i ? "active" : "", "px-2 font-semibold")}
          >
            {i}
          </Button>
        );
      }
    } else {
      const leftSide = Math.floor(maxPages / 2);
      const rightSide = Math.floor(maxPages / 2) + 1;
      let start = currentPage - leftSide;
      let end = currentPage + rightSide;

      if (start < 1) {
        start = 1;
        end = maxPages;
      } else if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxPages + 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(
            <Button
            key={i}
            size="lg"
            style={currentPage === i ? activeStyle : inactiveStyle}
            onClick={() => handlePageChange(i)}
            isIconOnly
            className={classNames(currentPage === i ? "active" : "", "px-2 font-semibold")}
          >
            {i}
          </Button>
        );
      }

      if (currentPage > leftSide + 1) {
        pages.unshift(<Button style={inactiveStyle} isIconOnly size="lg" key="leftDots">...</Button>);
      }
      if (currentPage < totalPages - rightSide) {
        pages.push(<Button style={inactiveStyle} isIconOnly size="lg" key="rightDots">...</Button>);
      }
    }

    return pages;
  };

  const goToFirstPage = () => {
    handlePageChange(1);
  };

  const goToLastPage = () => {
    handlePageChange(totalPages);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex gap-2 pagination">
      <Button style={activeStyle} size="lg" isIconOnly onClick={goToFirstPage}>
        <ChevronsLeft />
      </Button>
      <Button style={activeStyle} size="lg" isIconOnly onClick={goToPrevPage}>
        <ChevronLeft />
      </Button>
      {renderPageNumbers()}
      <Button style={activeStyle} size="lg" isIconOnly onClick={goToNextPage}>
        <ChevronRight />
      </Button>
      <Button style={activeStyle} size="lg" isIconOnly onClick={goToLastPage}>
        <ChevronsRight />
      </Button>
    </div>
  );
};

export default Pagination;
