import { Button } from '@nextui-org/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useEmployeeStore } from '@/store/employee.store';
import Layout from '@/layout/Layout';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/globo.png';
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
  const getBirthdays = (day: number) => {
    return birthdays.filter((employee) => {
      const employeeBirthday = new Date(employee.dateOfBirth);
      return (
        employeeBirthday.getDate() === day &&
        employeeBirthday.getMonth() === currentMonth &&
        employeeBirthday.getFullYear() === currentYear
      );
    });
  };

  const navigate = useNavigate();
  return (
    <Layout title="Calendario de cumpleaños">
      <div className="w-full h-full p-4 bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out">
        <div className="w-full border border-gray-200 dark:border-gray-700 p-4 bg-white shadow-lg rounded-xl dark:bg-gray-900 flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-center mb-3">
              <Button
                onClick={() => navigate(-1)}
                className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
              >
                <ArrowLeft className="text-gray-800 dark:text-white" />
                <p className="ml-2 text-gray-800 dark:text-white text-sm">Regresar</p>
              </Button>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                {months[currentMonth]} {currentYear}
              </h2>
              <div className="hidden sm:flex gap-4">
                <button
                  onClick={handlePrevMonth}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-full transition-all ease-in-out"
                >
                  <ArrowLeft className="text-gray-800 dark:text-white" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-full transition-all ease-in-out"
                >
                  <ArrowRight className="text-gray-800 dark:text-white" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 md:gap-3 text-center font-semibold mb-3">
              {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((day) => (
                <div
                  key={day}
                  className="uppercase text-xs sm:text-sm tracking-wider text-gray-600 dark:text-gray-300"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-4">
              {daysArray.map((day) => {
                const birthdayPeople = getBirthdays(day);
                return (
                  <div
                    key={day}
                    className={`relative bg-gray-100 dark:bg-gray-800 border rounded-lg p-4 h-40 flex justify-center items-center text-lg ${
                      birthdayPeople.length > 0
                        ? 'border-blue-500 bg-blue-100 dark:bg-blue-900'
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {day}
                    {birthdayPeople.length > 0 && (
                      <>
                        <span className="absolute bottom-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></span>
                        <div className="absolute top-2 left-2 text-xs text-blue-700 dark:text-white">
                          {birthdayPeople.map((person) => (
                            <div key={person.id}>{person.firstName}</div>
                          ))}
                        </div>
                        <img
                          src={logo}
                          alt="icon"
                          className="hidden xl:flex absolute top-2 right-2 w-10 h-10"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex sm:hidden justify-center gap-5 mt-4">
            <button
              onClick={handlePrevMonth}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-full transition-all ease-in-out"
            >
              <ArrowLeft className="text-gray-800 dark:text-white" />
            </button>
            <button
              onClick={handleNextMonth}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-full transition-all ease-in-out"
            >
              <ArrowRight className="text-gray-800 dark:text-white" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BirthdayCalendarMobile;
