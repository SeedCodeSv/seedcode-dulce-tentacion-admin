import { DateTime } from 'luxon';

const fechaActual = new Date();
const year = fechaActual.getFullYear();
const month = fechaActual.getMonth() + 1;
const day = fechaActual.getDate();
const monthString = month < 10 ? `0${month}` : `${month}`;
const dayString = day < 10 ? `0${day}` : `${day}`;
export const fechaEnFormatoDeseado = `${year}-${monthString}-${dayString}`;

// utils/date.js
export const fechaEnFormatoDeseado2 = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // Los meses empiezan desde 0
  const day = today.getDate();

  const monthString = month < 10 ? `0${month}` : `${month}`;
  const dayString = day < 10 ? `0${day}` : `${day}`;

  return `${year}-${monthString}-${dayString}`;
};

// moment.locale('es');
// export function completeDateFormat(fechaString: string, timezone: string = 'America/El_Salvador'): string {
//   const fecha = moment.tz(fechaString, timezone);
//   if (!fecha.isValid()) {
//     throw new Error('Fecha inválida');
//   }
//   return fecha.format('D [de] MMMM [de] YYYY');
// }

export function completeDateFormat(fechaString: string): string {
  const fecha = new Date(fechaString + 'T00:00:00');
  if (isNaN(fecha.getTime())) {
    throw new Error('Fecha inválida');
  }
  return fecha.toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

export const formattedStartDate = (startDate: string) => {
  const format = DateTime.fromISO(startDate, { zone: 'America/El_Salvador' });
  const formattedStartDate = format.toLocaleString(DateTime.DATE_FULL);
  return formattedStartDate;
};

export const formatDdMmYyyy = (startDate: string) => {
  const format = DateTime.fromISO(startDate, { zone: 'America/El_Salvador' });
  const formattedStartDate = format.toFormat('dd/MM/yyyy');
  return formattedStartDate;
};
