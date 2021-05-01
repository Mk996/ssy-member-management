export const generateDate = () => {
  const today = new Date()
  let date = ''
  if (String(today.getDate()).length === 1) {
    date += '0' + today.getDate()
  } else {
    date += today.getDate()
  }
  if (String(today.getMonth() + 1).length === 1) {
    date += '0' + (today.getMonth() + 1)
  } else {
    date += (today.getMonth() + 1)
  }
  date += today.getFullYear()
  return date
}
