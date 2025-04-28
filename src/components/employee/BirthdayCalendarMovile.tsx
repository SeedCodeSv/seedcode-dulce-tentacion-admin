import { Button } from "@heroui/react";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useEmployeeStore } from '@/store/employee.store';
function BirthdayCalendarMobile() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { OnGetBirthDays, birthdays } = useEmployeeStore();
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  useEffect(() => {
    OnGetBirthDays();
  }, [OnGetBirthDays]);
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const isBirthday = (day: number) => {
    return birthdays.some((employee) => {
      const employeeBirthday = new Date(employee.dateOfBirth);

      return (
        employeeBirthday.getDate() === day &&
        employeeBirthday.getMonth() === currentMonth &&
        employeeBirthday.getFullYear() === currentYear
      );
    });
  };

  return (
    <div className="w-full h-full p-5 bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out">
      <div className="w-full border border-gray-200 dark:border-gray-700 p-5 bg-white shadow-lg rounded-xl dark:bg-gray-900">
        <div className="flex justify-between items-center mb-4">
          <Button className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="text-gray-800 dark:text-white" />
            <p className="ml-2 text-gray-800 dark:text-white">Regresar</p>
          </Button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {months[currentMonth]} {currentYear}
          </h2>
          <div className="flex gap-4">
            <button
              className="w-10 h-10 flex items-center justify-center bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-full"
              onClick={handlePrevMonth}
            >
              <ArrowLeft className="text-gray-800 dark:text-white" />
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-full"
              onClick={handleNextMonth}
            >
              <ArrowRight className="text-gray-800 dark:text-white" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4 text-center font-semibold mb-4">
          {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((day) => (
            <div
              key={day}
              className="uppercase text-sm tracking-wider text-gray-600 dark:text-gray-300"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {daysArray.map((day) => (
            <div
              key={day}
              className={`relative bg-gray-100 dark:bg-gray-800 border rounded-lg p-4 h-16 flex justify-center items-center ${
                isBirthday(day) ? 'border-white' : 'border-gray-300 dark:border-gray-700'
              }`}
            >
              {day}
              {isBirthday(day) && (
                <span className="absolute bottom-2 right-2 w-2 h-2 bg-white rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BirthdayCalendarMobile;
