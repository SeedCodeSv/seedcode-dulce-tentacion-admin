import Layout from '@/layout/Layout';
import React, { useState } from 'react';

function BirthdayCalendar() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Estado para el mes actual
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Estado para el año actual

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

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Calcula los días en el mes actual
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // Día de la semana en que comienza el mes
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1); // Días del mes actual

  // Datos de eventos con fecha completa
  const events = [
    {
      title: 'Project Continue',
      date: new Date(2023, 0, 1), // 1 de Enero de 2023
      time: '09:00 - 11:00',
      color: 'bg-green-100',
      borderColor: 'border-green-400',
      participants: ['avatar1', 'avatar2'],
    },
    {
      title: 'Finishing Project',
      date: new Date(2023, 0, 2), // 2 de Enero de 2023
      time: '08:30 - 09:30',
      color: 'bg-red-100',
      borderColor: 'border-red-400',
      participants: ['avatar1', 'avatar2', 'avatar3'],
    },
    {
      title: 'Consultation Project',
      date: new Date(2023, 1, 3), // 3 de Febrero de 2023
      time: '11:30 - 12:30',
      color: 'bg-blue-100',
      borderColor: 'border-blue-400',
      participants: ['avatar1', 'avatar2', 'avatar3', 'avatar4'],
    },
  ];

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  // Funciones para cambiar el mes y el año
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

  return (
    <Layout title="Calendar">
      <div className="w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
        <div className="w-full h-full border-white border p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="w-full">
            {/* Controles para el mes y el año */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handlePrevMonth}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
              >
                Anterior
              </button>
              <h2 className="text-xl font-bold dark:text-white">
                {months[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={handleNextMonth}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
              >
                Siguiente
              </button>
            </div>

            {/* Cabecera del calendario */}
            <div className="grid grid-cols-7 w-full gap-4 text-center font-semibold mb-4">
              {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((day) => (
                <div key={day} className="uppercase text-sm tracking-wider">
                  <p className="dark:text-white">{day}</p>
                </div>
              ))}
            </div>

            {/* Cuerpo del calendario */}
            <div className="grid grid-cols-7 gap-4">
              {/* Agregar celdas vacías para los días anteriores al inicio del mes */}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={index} className="bg-transparent" />
              ))}
              {daysArray.map((day, index) => {
                // Filtrar los eventos por mes y año actual
                const event = events.find(
                  (event) =>
                    event.date.getDate() === day &&
                    event.date.getMonth() === currentMonth &&
                    event.date.getFullYear() === currentYear
                );

                return event ? (
                  <div
                    key={index}
                    className={`${event.color} border-l-4 ${event.borderColor} rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer relative h-32 flex flex-col justify-between`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-gray-800 dark:text-white">{event.title}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">{event.time}</div>
                    </div>
                    <div className="text-xs text-right text-gray-600 flex items-center space-x-2">
                      {/* Avatares de participantes */}
                      {event.participants.map((participant, idx) => (
                        <img
                          key={idx}
                          className="w-6 h-6 rounded-full border border-white -ml-2"
                          src={`https://i.pravatar.cc/150?img=${idx + 1}`}
                          alt="avatar"
                        />
                      ))}
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
