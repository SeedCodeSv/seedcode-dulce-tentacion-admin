// components/WeekSelector.tsx
import React, { useState } from 'react';
import { Button } from '@nextui-org/react';

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const WeekSelector: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((d) => d !== day)
        : [...prevSelectedDays, day]
    );
  };

  return (
    <div className="flex space-x-2">
      {daysOfWeek.map((day) => (
        <Button
          key={day}
          onClick={() => toggleDay(day)}
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
