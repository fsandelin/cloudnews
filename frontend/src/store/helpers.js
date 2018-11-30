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

export const dateIsBefore = (date, comparedTo) => {
  if (date === null || comparedTo === null) return false
  if (date.year > comparedTo.year) return false
  if (date.year < comparedTo.year) return true

  if (date.month > comparedTo.month) return false
  if (date.month < comparedTo.month) return true

  if (date.day > comparedTo.day) return false
  if (date.day < comparedTo.day) return true
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
