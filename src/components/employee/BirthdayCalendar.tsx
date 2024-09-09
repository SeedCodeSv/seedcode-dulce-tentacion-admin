import Layout from '@/layout/Layout';
import React, { useState } from 'react';

function BirthdayCalendar() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Datos de eventos
  const events = [
    {
      title: 'Project Continue',
      day: 1,
      time: '09:00 - 11:00',
      color: 'bg-green-100',
      borderColor: 'border-green-400',
      participants: ['avatar1', 'avatar2'],
    },
    {
      title: 'Finishing Project',
      day: 2,
      time: '08:30 - 09:30',
      color: 'bg-red-100',
      borderColor: 'border-red-400',
      participants: ['avatar1', 'avatar2', 'avatar3'],
    },
    {
      title: 'Consultation Project',
      day: 3,
      time: '11:30 - 12:30',
      color: 'bg-blue-100',
      borderColor: 'border-blue-400',
      participants: ['avatar1', 'avatar2', 'avatar3', 'avatar4'],
    },
    {
      title: 'Design System',
      day: 5,
      time: '14:00 - 15:00',
      color: 'bg-teal-100',
      borderColor: 'border-teal-400',
      participants: ['avatar1', 'avatar2'],
    },
    {
      title: 'Feedback Project',
      day: 6,
      time: '15:30 - 16:30',
      color: 'bg-orange-100',
      borderColor: 'border-orange-400',
      participants: ['avatar1'],
    },
    {
      title: 'Discuss Developer',
      day: 7,
      time: '09:00 - 11:00',
      color: 'bg-pink-100',
      borderColor: 'border-pink-400',
      participants: ['avatar1', 'avatar2'],
    },
  ];

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1); // Días del mes

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  return (
    <Layout title="Calendar">
      <div className=" w-full h-full xl:p-10 p-5 bg-white dark:bg-gray-900">
        <div className="w-full h-full border-white border p-5 overflow-y-auto custom-scrollbar1 bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="w-full">
            {/* Cabecera del calendario */}
            <div className="grid grid-cols-7 w-full gap-4 text-center font-semibold mb-4">
              {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((day) => (
                <div key={day} className="uppercase text-sm tracking-wider">
                  <p className="dark:text-white"> {day}</p>
                </div>
              ))}
            </div>

            {/* Cuerpo del calendario */}
            <div className="grid grid-cols-7 gap-4">
              {daysInMonth.map((day, index) => {
                const event = events.find((event) => event.day === day);

                return event ? (
                  <div
                    key={index}
                    className={`${event.color} border-l-4 ${event.borderColor} rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer relative`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold text-gray-800">{event.title}</div>
                      <div className="text-xs text-gray-600">{event.time}</div>
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
                    className="bg-gray-100 border-l-4 border-gray-300 rounded-lg p-4 shadow-sm text-gray-500 flex justify-center items-center"
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

//  <div className="flex items-center justify-between px-4 py-2 border-b">
//    <div className="flex items-center space-x-4">
//      <h1 className="text-xl font-semibold">December 2023</h1>
//      <div className="text-sm text-gray-500">12 Members · 38 Events</div>
//    </div>
//    <div className="flex space-x-4">
//      <button className="px-3 py-1 bg-gray-200 rounded-md">Filter</button>
//      <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
//        + New Event
//      </button>
//    </div>
//  </div>;
// {
//   /* Modal para editar/eliminar */
// }
// {
//   selectedEvent && (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//       <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
//         <h2 className="text-xl font-bold mb-4 text-gray-800">{selectedEvent.title}</h2>
//         <div className="flex items-center justify-between mb-4">
//           <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-300">
//             Editar
//           </button>
//           <button className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors duration-300">
//             Eliminar
//           </button>
//         </div>
//         <button
//           className="block w-full px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition-colors duration-300"
//           onClick={() => setSelectedEvent(null)}
//         >
//           Cerrar
//         </button>
//       </div>
//     </div>
//   );
// }
