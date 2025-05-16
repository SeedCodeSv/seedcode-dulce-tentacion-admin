import React from 'react';
import { CheckCircle } from 'lucide-react';

type TimelineItemProps = {
  text: string;
  isLast?: boolean;
};

const TimelineItem: React.FC<TimelineItemProps> = ({ text, isLast = false }) => {
  return (
    <div className="flex dark:text-white">
      <div className="flex flex-col items-center mr-4">
        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        {!isLast && <div className="w-0.5 h-full bg-gray-200 mt-2" />}
      </div>
      <div className={`pb-${isLast ? '0' : '8'}`}>
        <p className="text-xs lg:text-sm text-gray-700 mt-1 dark:text-gray-100">{text}</p>
      </div>
    </div>
  );
};

export default TimelineItem;