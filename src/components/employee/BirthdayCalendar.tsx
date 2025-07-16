import { Button } from '@heroui/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/globo.png';
import SlideInModalGlobal from '../global/SlideInModalGlobal';

import ParticipantList from './ContentBirthday';

import { useEmployeeStore } from '@/store/employee.store';
import { MonthsAttendance } from '@/types/employees.types';
import { useViewsStore } from '@/store/views.store';
import DivGlobal from '@/themes/ui/div-global';

function BirthdayCalendarMobile() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { OnGetBirthDays, birthdays } = useEmployeeStore();
  const [selectedParticipants, setSelectedParticipants] = useState<MonthsAttendance[]>([]);
  const [openModal, setOpenModal] = useState(false);
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
  const getBirthdays = (day: number) => {
    return birthdays.filter((employee) => {
      const employeeBirthday = new Date(employee.dateOfBirth);
      const birthdayDay = employeeBirthday.getUTCDate();
      const birthdayMonth = employeeBirthday.getUTCMonth();

      return (
        birthdayDay === day &&
        birthdayMonth === currentMonth &&
        employeeBirthday.getUTCFullYear() === currentYear
      );
    });
  };
  const handleDayClick = (day: number) => {
    const birthdayPeople = getBirthdays(day);

    if (birthdayPeople.length > 0) {
      setSelectedParticipants(birthdayPeople);
      setOpenModal(true);
    }
  };
  const navigate = useNavigate();
  const { actions } = useViewsStore();
  const empleadosView = actions.find((view) => view.view.name === 'Empleados');
  const actionsView = empleadosView?.actions?.name || [];

  return (
    <>
      {actionsView.includes('Cumpleaños') ? (
        <DivGlobal>
          <div>
            <div className="flex justify-between items-center mb-3">
              <Button
                className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                onPress={() => navigate(-1)}
              >
                <ArrowLeft className="text-gray-800 dark:text-white" />
                <p className="ml-2 text-gray-800 dark:text-white text-sm">Regresar</p>
              </Button>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                {months[currentMonth]} {currentYear}
              </h2>
              <div className="flex sm:flex gap-4">
                <button
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-full transition-all ease-in-out"
                  onClick={handlePrevMonth}
                >
                  <ArrowLeft className="text-gray-800 dark:text-white" />
                </button>
                <button
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-full transition-all ease-in-out"
                  onClick={handleNextMonth}
                >
                  <ArrowRight className="text-gray-800 dark:text-white" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 md:gap-3 text-center font-semibold mb-3">
              {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((day) => (
                <div
                  key={day}
                  className="uppercase text-xs sm:text-sm tracking-wider text-gray-600 dark:text-white"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 w-full gap-2 md:gap-3 h-[calc(100vh-200px)] auto-rows-fr">
              {daysArray.map((day) => {
                const birthdayPeople = getBirthdays(day);

                return (
                  <button
                    key={day}
                    className={`relative border rounded-lg p-2 h-full w-full flex justify-center items-center text-lg cursor-pointer `}
                    onClick={() => handleDayClick(day)}
                  >
                    <div
                      className={`${
                        birthdayPeople.length > 0
                          ? 'bg-blue-500 text-white dark:bg-blue-500 dark:text-white flex justify-center items-center w-10 h-10 rounded-full'
                          : 'dark:text-white'
                      }`}
                    >
                      <p className="dark:text-white text-grey-800"> {day}</p>
                    </div>
                    {birthdayPeople.length > 0 && (
                      <>
                        <img
                          alt="icon"
                          className="hidden xl:flex absolute top-2 right-2 w-10 h-10"
                          src={logo}
                        />
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <SlideInModalGlobal open={openModal} setOpen={setOpenModal} title="Empleados">
            <ParticipantList employee={selectedParticipants} />
          </SlideInModalGlobal>
        </DivGlobal>
      ) : (
        <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent flex justify-center items-center">
            <p className="text-lg font-semibold dark:text-white">
              No tiene permisos para ver este modulo
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default BirthdayCalendarMobile;
