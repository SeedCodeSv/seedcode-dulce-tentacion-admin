import Layout from '@/layout/Layout';
import { Button } from '@nextui-org/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {  useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import globo from '../../assets/globo.png';
import { useEmployeeStore } from '@/store/employee.store';

function BirthdayCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const {OnGetBirthDays , birthdays} =useEmployeeStore();
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
  OnGetBirthDays()
},[])
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

 

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

  const navigate = useNavigate();

  return (
    <Layout title="Calendar">
      <div className="w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
        <div className="w-full h-full border-white border p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="w-full">
            <div className="flex justify-between">
              <div className="flex items-center cursor-pointer mb-4">
                <Button onClick={() => navigate(-1)} className="bg-transparent ">
                  <ArrowLeft className="" />
                  <p className="dark:text-white">Regresar</p>
                </Button>
              </div>
              <h2 className="text-xl font-bold dark:text-white">
                {months[currentMonth]} {currentYear}
              </h2>
              <div className="flex justify-between gap-2 items-center mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full"
                >
                  <ArrowLeft className="text-white" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700  rounded-full"
                >
                  <ArrowRight className="text-white" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 w-full gap-4 text-center font-semibold mb-4">
              {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((day) => (
                <div key={day} className="uppercase text-sm tracking-wider">
                  <p className="dark:text-white">{day}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={index} className="bg-transparent" />
              ))}
              {daysArray.map((day, index) => {
                const birthdayEvent = birthdays.find((employee) => {
                  const employeeBirthday = new Date(employee.dateOfBirth);
                  return (
                    employeeBirthday.getDate() === day &&
                    employeeBirthday.getMonth() === currentMonth &&
                    employeeBirthday.getFullYear() === currentYear
                  );
                });

                return birthdayEvent ? (
                  <div
                    key={index}
                    className="bg-green-100 border-l-4 border-green-400 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer relative h-32 flex flex-col justify-between"
                    
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-gray-800 dark:text-green-400">
                        {birthdayEvent.firstName} {birthdayEvent.firstLastName}
                      </div>
                      <img
                        src={globo}
                        className="w-12 h-12 object-contain text-xs text-gray-600 dark:text-white"
                        alt="balloon"
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-sm text-gray-500 dark:text-gray-400 flex justify-center items-center h-32"
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BirthdayCalendar;
