import moment from 'moment-timezone';
import { format } from '@formkit/tempo';
import 'moment/locale/es';
import { DateTime } from 'luxon';

import { Employee } from '@/types/referal-note.types';
import { Employee as Employee2 } from '@/types/employees.types';

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

  parsedDate.tz('America/El_Salvador');

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


export const formatDateForReports = (startDate: string, endDate: string) => {
  const formatDate = (date: DateTime) => date.setLocale('es').toFormat("d 'de' LLLL 'de' yyyy");
  const formattedRange = `del ${formatDate(DateTime.fromISO(startDate))} al ${formatDate(DateTime.fromISO(endDate))}`;

  return formattedRange;
};

export function formatSimpleDate(date: string): string {
  if (!date) return '';
  const days = date.split('|')[0];
  const time = date.split('|')[1];
  const monts = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];
  const [year, month, day] = days.split('-');
  const [hour, minute] = time.split(':');
  const monthName = monts[Number(month) - 1];

  return `${day}-${monthName}-${year} ${hour}:${minute}`;
}


export function formatEmployee(value: Employee | Employee2) {
  const render =
    value?.firstName +
    ' ' +
    value?.secondName +
    ' ' +
    value?.firstLastName +
    ' ' +
    value?.secondLastName

  return render
}

export function typeNumDoc(value: Employee | Employee2) {
  const typeDoc = (value?.dui && '13') || (value?.nit && '36')

  return typeDoc as string
}

export function numbDocument(value: Employee | Employee2) {
  const numDoc = (value?.dui ?? 0) || (value?.nit ?? 0)

  return numDoc as number
}