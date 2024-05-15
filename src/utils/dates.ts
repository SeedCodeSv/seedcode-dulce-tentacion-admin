import moment from "moment-timezone";

export const formatDate = () => {
  const date = new Date();
  const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
  const month =
    date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  return `${date.getFullYear()}-${month}-${day}`;
};
export const get_el_salvador_date = (dateString: string) => {
  const parsedDate = moment(dateString, "YYYY-MM-DD");

  // Establece la zona horaria a El Salvador
  parsedDate.tz("America/El_Salvador");

  // Obtiene el objeto Date
  const dateObject = parsedDate.toDate();

  return dateObject;
};
export function getElSalvadorDateTime(): { fecEmi: string; horEmi: string } {
  const elSalvadorTimezone = "America/El_Salvador";
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: elSalvadorTimezone,
  };

  const dateObj = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions).format(
    dateObj
  );

  const [datePart, timePart] = formattedDate.split(", ");

  const [month, day, year] = datePart.split("/");

  const formattedDatePart = `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}`;

  return { fecEmi: formattedDatePart, horEmi: timePart };


}

const fechaActual = new Date();
const year = fechaActual.getFullYear();
let month = fechaActual.getMonth() + 1;
let day = fechaActual.getDate();
const monthString = month < 10 ? `0${month}` : `${month}`;
const dayString = day < 10 ? `0${day}` : `${day}`;
export const
  fechaActualString = `${year}-${monthString}-${dayString}`;
