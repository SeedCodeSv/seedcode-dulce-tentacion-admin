const fechaActual = new Date()
const year = fechaActual.getFullYear()
const month = fechaActual.getMonth() + 1
const day = fechaActual.getDate()
const monthString = month < 10 ? `0${month}` : `${month}`
const dayString = day < 10 ? `0${day}` : `${day}`
export const fechaEnFormatoDeseado = `${year}-${monthString}-${dayString}`

// utils/date.js
export const fechaEnFormatoDeseado2 = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1 // Los meses empiezan desde 0
  const day = today.getDate()

  const monthString = month < 10 ? `0${month}` : `${month}`
  const dayString = day < 10 ? `0${day}` : `${day}`

  return `${year}-${monthString}-${dayString}`
}
