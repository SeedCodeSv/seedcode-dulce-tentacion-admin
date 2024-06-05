import React, { useState } from 'react';
import { Button } from '@nextui-org/react';

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
  //  eslint-disable-next-line no-unused-vars
  onDaysSelected: (selectedDays: string[]) => void;
}

const WeekSelector: React.FC<WeekSelectorProps> = ({ onDaysSelected }) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((d) => d !== day)
        : [...prevSelectedDays, day]
    );
  };

  const handleDayClick = (day: string) => {
    toggleDay(day);
    onDaysSelected(selectedDays);
  };

  return (
    <div className="flex space-x-2">
      {daysOfWeek.map((day) => (
        <Button
          key={day.label}
          onClick={() => handleDayClick(day.value)}
          className={`${
            selectedDays.includes(day.value) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
          }`}
        >
          {day.label}
        </Button>
      ))}
    </div>
  );
};

export default WeekSelector;
