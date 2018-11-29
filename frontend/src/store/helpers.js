import { months as m, weekDays as wd } from './constants';

export const cleanString = s => s.trim().toLowerCase()

export const numToMonth = num => m[Object.keys(m)[num]]
// export const numToDay = num => wd[Object.keys(wd)[num]]

// export const getCurrentMonth = () => new Date().getMonth();

export const getDaysForMonth = (year, month) => new Date(year, month+1, 0).getDate()

export const getNumArrayBetweenNums = (start, end) => {
  let arr = []
  for (let i = start; i < end; i++) {
    arr = [ ...arr, i]
  }
  return arr
}

export const dateIsBefore = (date, comparedTo) => {
  if (date === null || comparedTo === null) return false
  if (date.year > comparedTo.year) return false
  if (date.year < comparedTo.year) return true

  if (date.month > comparedTo.month) return false
  if (date.month < comparedTo.month) return true

  if (date.day > comparedTo.day) return false
  if (date.day < comparedTo.day) return true
}
