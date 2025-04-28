import { Button } from "@heroui/react";
import React, { useContext } from 'react';
import classNames from 'classnames';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { ThemeContext } from '../../hooks/useTheme';

/* eslint-disable no-unused-vars */
interface PaginationProps {
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  nextPage: number;
  previousPage: number;
  currentPage: number;
  totalItems?: number;
}
/* eslint-enable no-unused-vars */

const Pagination: React.FC<PaginationProps> = (props) => {
  const { totalPages, onPageChange, totalItems = 5 } = props;

  const { theme, context } = useContext(ThemeContext);

  const activeStyle = {
    background: theme.colors[context].buttons.colors.primary,
    color: theme.colors[context].buttons.textColor,
  };

  const inactiveStyle = {
    background: theme.colors[context].buttons.colors.default,
    color: theme.colors[context].buttons.textDefaultColor,
  };

  const handlePageChange = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPages = totalItems;

    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            isIconOnly
            className={classNames(props.currentPage === i ? 'active' : '', 'px-2 font-semibold')}
            style={props.currentPage === i ? activeStyle : inactiveStyle}
            onPress={() => handlePageChange(i)}
          >
            {i}
          </Button>
        );
      }
    } else {
      const leftSide = Math.floor(maxPages / 2);
      const rightSide = Math.floor(maxPages / 2) + 1;
      let start = props.currentPage - leftSide;
      let end = props.currentPage + rightSide;

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
            isIconOnly
            className={classNames(props.currentPage === i ? 'active' : '', 'px-2 font-semibold')}
            style={props.currentPage === i ? activeStyle : inactiveStyle}
            onPress={() => handlePageChange(i)}
          >
            {i}
          </Button>
        );
      }

      if (props.currentPage > leftSide + 1) {
        pages.unshift(
          <Button key="leftDots" isIconOnly style={inactiveStyle}>
            ...
          </Button>
        );
      }
      if (props.currentPage < totalPages - rightSide) {
        pages.push(
          <Button key="rightDots" isIconOnly style={inactiveStyle}>
            ...
          </Button>
        );
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
    if (props.currentPage > 1) {
      handlePageChange(props.currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (props.currentPage < totalPages) {
      handlePageChange(props.currentPage + 1);
    }
  };

  return (
    <>
      <div className="hidden lg:flex gap-2 pagination w-full">
        <Button isIconOnly style={activeStyle} onPress={goToFirstPage}>
          <ChevronsLeft />
        </Button>
        <Button isIconOnly style={activeStyle} onPress={goToPrevPage}>
          <ChevronLeft />
        </Button>
        {renderPageNumbers()}
        <Button isIconOnly style={activeStyle} onPress={goToNextPage}>
          <ChevronRight />
        </Button>
        <Button isIconOnly style={activeStyle} onPress={goToLastPage}>
          <ChevronsRight />
        </Button>
      </div>
      <div className='flex lg:hidden w-full'>
        <div className="flex justify-between w-full lg:hidden gap-2 pagination">

          <Button isIconOnly style={activeStyle} onPress={goToPrevPage}>
            <ChevronLeft />
          </Button>
          {props.currentPage} de {totalPages}
          <Button isIconOnly style={activeStyle} onPress={goToNextPage}>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Pagination;
