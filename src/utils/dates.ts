import moment from 'moment-timezone';
import { format } from '@formkit/tempo';
import 'moment/locale/es';
import { DateTime } from 'luxon';

const l = 'es';

export const formatDateShort = (date: string) => {
  return format(new Date(date), 'MMMM DD YYYY', l);
};

export const formatDate = () => {
  const date = new Date();
  const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
  const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;

  return `${date.getFullYear()}-${month}-${day}`;
};
export const get_el_salvador_date = (dateString: string) => {
  const parsedDate = moment(dateString, 'YYYY-MM-DD');

  // Establece la zona horaria a El Salvador
  parsedDate.tz('America/El_Salvador');

  // Obtiene el objeto Date
  const dateObject = parsedDate.toDate();

  return dateObject;
};
export function getElSalvadorDateTime(): { fecEmi: string; horEmi: string } {
  const elSalvadorTimezone = 'America/El_Salvador';
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: elSalvadorTimezone,
  };

  const dateObj = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(dateObj);

  const [datePart, timePart] = formattedDate.split(', ');

  const [month, day, year] = datePart.split('/');

  const formattedDatePart = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

  return { fecEmi: formattedDatePart, horEmi: timePart };
}

export function getElSalvadorDateTimeParam(date: Date): { fecEmi: string; horEmi: string } {
  const elSalvadorTimezone = 'America/El_Salvador';
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: elSalvadorTimezone,
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date);

  // Split the formatted date into date and time parts
  const [datePart, timePart] = formattedDate.split(', ');

  // Split the date into its components (month, day, year)
  const [month, day, year] = datePart.split('/');

  // Reformat the date to yyyy-mm-dd format
  const formattedDatePart = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

  return { fecEmi: formattedDatePart, horEmi: timePart };
}

const fechaActual = new Date();
const year = fechaActual.getFullYear();
const month = fechaActual.getMonth() + 1;
const day = fechaActual.getDate();
const monthString = month < 10 ? `0${month}` : `${month}`;
const dayString = day < 10 ? `0${day}` : `${day}`;

export const fechaActualString = `${year}-${monthString}-${dayString}`;

export function shortMonth(numero: number): string {
  const meses: string[] = [
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

  if (numero >= 1 && numero <= 12) {
    return meses[numero - 1];
  } else {
    return 'Número inválido';
  }
}

const getFormattedDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getInitialAndEndDate = () => {
  const today = new Date();
  const initialDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = today;

  return {
    initial: getFormattedDate(initialDate),
    end: getFormattedDate(endDate),
  };
};

export function formatDateToMMDDYYYY(date: string) {
  return moment.tz(date, 'America/El_Salvador').format('MM/DD/YYYY');
}

export function formatDateMMDDYYYY(day: number, month: number, year?: number): string {
  const currentYear = new Date().getFullYear();
  const finalYear = year || currentYear;

  // Asegurar que el día y el mes tengan dos dígitos
  const formattedDay = day < 10 ? `0${day}` : day.toString();
  const formattedMonth = month < 10 ? `0${month}` : month.toString();

  return `${formattedMonth}/${formattedDay}/${finalYear}`;
}
// export function formatDateMMDDYYYY(day: number, month: number): string {
//   const date = new Date()
//   const year = date.getFullYear()

//   // Asegurar que el día y el mes tengan dos dígitos
//   const formattedDay = day < 10 ? `0${day}` : day.toString()
//   const formattedMonth = month < 10 ? `0${month}` : month.toString()

//   return `${formattedMonth}/${formattedDay}/${year}`
// }

export const formatDateForReports = (startDate: string, endDate: string) => {
  const formatDate = (date: DateTime) => date.setLocale('es').toFormat("d 'de' LLLL 'de' yyyy");
  const formattedRange = `del ${formatDate(DateTime.fromISO(startDate))} al ${formatDate(DateTime.fromISO(endDate))}`;

  return formattedRange;
};

export const formatDateToddLLLyyyy = (date: string) => {
  const fechaFormateada = DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ss', {
    locale: 'es',
  }).toFormat('dd LLL yyyy, hh:mm a');

  return fechaFormateada;
};
