import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { eachDayOfInterval, format, parseISO } from 'date-fns';

const daysOfWeek = [
  { label: 'Lunes', value: 'Monday' },
  { label: 'Martes', value: 'Tuesday' },
  { label: 'Miércoles', value: 'Wednesday' },
  { label: 'Jueves', value: 'Thursday' },
  { label: 'Viernes', value: 'Friday' },
  { label: 'Sábado', value: 'Saturday' },
  { label: 'Domingo', value: 'Sunday' },
];

export interface WeekSelectorProps {
  startDate: string;
  endDate: string;
  //  eslint-disable-next-line no-unused-vars
  onDaysSelected: (selectedDays: string[]) => void;
}

const WeekSelector: React.FC<WeekSelectorProps> = ({ startDate, endDate, onDaysSelected }) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [daysInRange, setDaysInRange] = useState<string[]>([]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const days = eachDayOfInterval({ start, end }).map((date) => format(date, 'EEEE'));
      setDaysInRange(days.length > 7 ? daysOfWeek.map((day) => day.value) : days);
    }
  }, [startDate, endDate]);

  const handleDayClick = (day: string) => {
    const updatedSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(updatedSelectedDays);
    onDaysSelected(updatedSelectedDays);
  };

  return (
    <div className="flex space-x-2">
      {daysInRange.map((day) => (
        <Button
          key={day}
          onClick={() => handleDayClick(day)}
          className={`${
            selectedDays.includes(day) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
          }`}
        >
          {day}
        </Button>
      ))}
    </div>
  );
};

export default WeekSelector;

// import React, { useState } from 'react';
// import { Button } from '@nextui-org/react';

// const daysOfWeek = [
//   { label: 'Lunes', value: 'Monday' },
//   { label: 'Martes', value: 'Tuesday' },
//   { label: 'Miércoles', value: 'Wednesday' },
//   { label: 'Jueves', value: 'Thursday' },
//   { label: 'Viernes', value: 'Friday' },
//   { label: 'Sábado', value: 'Saturday' },
//   { label: 'Domingo', value: 'Sunday' },
// ];

// export interface WeekSelectorProps {
//   //  eslint-disable-next-line no-unused-vars
//   onDaysSelected: (selectedDays: string[]) => void;
// }

// const WeekSelector: React.FC<WeekSelectorProps> = ({ onDaysSelected }) => {
//   const [selectedDays, setSelectedDays] = useState<string[]>([]);

//   const handleDayClick = (day: string) => {
//     const updatedSelectedDays = selectedDays.includes(day)
//       ? selectedDays.filter((d) => d !== day)
//       : [...selectedDays, day];
//     setSelectedDays(updatedSelectedDays);
//     onDaysSelected(updatedSelectedDays);
//   };

//   return (
//     <div className="flex space-x-2">
//       {daysOfWeek.map((day) => (
//         <Button
//           key={day.label}
//           onClick={() => handleDayClick(day.value)}
//           className={`${
//             selectedDays.includes(day.value) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
//           }`}
//         >
//           {day.label}
//         </Button>
//       ))}
//     </div>
//   );
// };

// export default WeekSelector;
