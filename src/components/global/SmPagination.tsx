import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { global_styles } from '../../styles/global.styles';

interface Props {
  handleNext: () => void;
  handlePrev: () => void;
  currentPage: number;
  totalPages: number;
}

function SmPagination({ handleNext, handlePrev, currentPage, totalPages }: Props) {
  return (
    <div className="flex w-full justify-between items-center">
      <Button isIconOnly style={global_styles().darkStyle} onClick={handlePrev}>
        <ChevronLeft />
      </Button>
      <p className="text-center font-semibold dark:text-white">
        {currentPage} de {totalPages}
      </p>
      <Button isIconOnly style={global_styles().darkStyle} onClick={handleNext}>
        <ChevronRight />
      </Button>
    </div>
  );
}

export default SmPagination;
