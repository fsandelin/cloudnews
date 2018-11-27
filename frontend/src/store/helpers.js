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
