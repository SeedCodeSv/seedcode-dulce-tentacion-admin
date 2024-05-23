import { Button } from '@nextui-org/react';
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
      <Button onClick={handlePrev} isIconOnly style={global_styles().darkStyle}>
        <ChevronLeft />
      </Button>
      <p className="text-center font-semibold dark:text-white">
        {currentPage} de {totalPages}
      </p>
      <Button onClick={handleNext} isIconOnly style={global_styles().darkStyle}>
        <ChevronRight />
      </Button>
    </div>
  );
}

export default SmPagination;
