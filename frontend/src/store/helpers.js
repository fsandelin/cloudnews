import moment from 'moment'
import { months as m, weekDays as wd } from './constants';

export const cleanString = s => s.trim().toLowerCase()

export const numToMonth = num => m[Object.keys(m)[num]]

export const getDaysForMonth = (year, month) => new Date(year, month+1, 0).getDate()

export const getNumArrayBetweenNums = (start, end) => {
  let arr = []
  for (let i = start; i < end; i++) {
    arr = [ ...arr, i]
  }
  return arr
}

const convertDateItemsToInts = ({ year, month, day }) => {
  return {
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    day: parseInt(day, 10)
  }
}

export const dateIsBefore = (date, comparedTo) => {
  date = convertDateItemsToInts(date);
  comparedTo = convertDateItemsToInts(comparedTo);
  if (date === null || comparedTo === null) return false

  if (date.year === comparedTo.year) {
    if (date.month === comparedTo.month) {
      return date.day < comparedTo.day
    }
    return date.month < comparedTo.month
  }

  return date.year < comparedTo.year
}

export const weekNumsForMonth = (year, month) => {
  const startWeek = moment(`${year}-${month}-1`, "YYYY-MM-DD").isoWeek()
  let weeks = []
  for (let i = startWeek; i < startWeek+6; i++) {
    weeks = [ ...weeks, i === 53 ? 1 : i ]
  }
  return weeks
}

export const sameDates = (firstDate, secondDate) => {
  return firstDate !== null && secondDate !== null &&
         firstDate.year === secondDate.year &&
         firstDate.month === secondDate.month &&
         firstDate.day === secondDate.day
}

export const prettifyDateObject = (dateObj = '????-??-??') => {
  if (dateObj === null) return '????-??-??'
  return `${dateObj.year}-${dateObj.month}-${dateObj.day}`
}
