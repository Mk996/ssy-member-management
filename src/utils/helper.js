export const generateDate = () => {
  const today = new Date()
  let date = ''
  if (String(today.getDate()).length === 1) {
    date += '0' + today.getDate()
  } else {
    date += today.getDate()
  }
  date += '-'
  if (String(today.getMonth() + 1).length === 1) {
    date += '0' + (today.getMonth() + 1)
  } else {
    date += (today.getMonth() + 1)
  }
  date += '-'
  date += today.getFullYear()
  return date
}

export const checkForAvailableId = (list, input) => {
  let result = false
  list.forEach(el => {
    if (el.ssyId.toUpperCase().indexOf(input) > -1) {
      result = true
    }
  })
  return result
}

export const showIds = (list) => {
  let result = ''
  list.forEach((el, index) => {
    if (index !== list.length - 1) {
      result += el.ssyId + ', '
    } else {
      result += el.ssyId
    }
  })
  return result
}

export const calculateAge = (dob) => {
  const diffMs = Date.now() - dob.getTime()
  const ageDt = new Date(diffMs)

  return Math.abs(ageDt.getUTCFullYear() - 1970)
}

export const getMemberKeys = () => [
  'ssyId',
  'name',
  'balance',
  'age',
  'representative',
  'contact',
  'dateOfBirth',
  'address'
]

export const getMemberHeaders = () => [
  'SSYId',
  'Name',
  'Balance',
  'Age',
  'Representative',
  'Contact',
  'DOB',
  'Address'
]
