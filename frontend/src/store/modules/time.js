import {
  weekDays as wd,
  TOTAL_DAYS_TO_SHOW
} from '../constants';
import {
  numToMonth,
  getDaysForMonth,
  getNumArrayBetweenNums,
  dateIsBefore,
  weekNumsForMonth
} from '../helpers';

const state = {
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  weekDays: [ wd.MONDAY, wd.TUESDAY, wd.WEDNESDAY, wd.THURSDAY, wd.FRIDAY, wd.SATURDAY, wd.SUNDAY ],
  weekNumbers: weekNumsForMonth(new Date().getFullYear(), new Date().getMonth()+1),
  startDate: null,
  endDate: null,
  hoverDate: null,
}

const getters = {
  currentYear: state => state.currentYear,
  currentMonth: state => state.currentMonth,
  weekDays: state => state.weekDays,
  weekNumbers: state => state.weekNumbers,
  startDate: state => state.startDate,
  endDate: state => state.endDate,
  hoverDate: state => state.hoverDate,
  dateBetween: _ => (date, edgeDate1, edgeDate2) => {
    return (dateIsBefore(edgeDate1, date) && dateIsBefore(date, edgeDate2)) ||
           (dateIsBefore(edgeDate2, date) && dateIsBefore(date, edgeDate1))
  },
  numToMonth: _ => num => numToMonth(num),
  getDaysToDisplay: state => {
    const daysForCurrentMonth = getDaysForMonth(state.currentYear, state.currentMonth)

    const currentDaysToFill = getNumArrayBetweenNums(1, daysForCurrentMonth+1)
      .map(i => ({ year: state.currentYear, month: state.currentMonth, day: i }))

    const weekDay = new Date(state.currentYear, state.currentMonth, 1).getDay();
    const numPreviousDaysToFill = weekDay === 0 ? 7 : weekDay;

    const daysForPreviousMonth = state.currentMonth === 0
      ? getDaysForMonth(state.currentYear-1, state.currentMonth+11)
      : getDaysForMonth(state.currentYear, state.currentMonth-1)

    const previousDaysToFill = getNumArrayBetweenNums(daysForPreviousMonth-numPreviousDaysToFill+2, daysForPreviousMonth+1)
      .map(i => ({ year: state.currentYear, month: state.currentMonth-1, day: i }))

    const numNextDaysToFill = TOTAL_DAYS_TO_SHOW - (daysForCurrentMonth+numPreviousDaysToFill)

    const nextDaysToFill = getNumArrayBetweenNums(1, numNextDaysToFill+1)
      .map(i => ({ year: state.currentYear, month: state.currentMonth+1, day: i }))

    return [ ...previousDaysToFill, ...currentDaysToFill, ...nextDaysToFill ]
  },
  daysByRow: (state, getters) => {
    const dates = getters.getDaysToDisplay
    return state.weekNumbers.map((_, i) => dates.slice(i*7, i*7+7))
  },
}

const actions = {
  moveCalendarForwards: ({ state, commit }) => {
    if (state.currentMonth === 11) {
      commit('moveCalendar', { month: 0, year: state.currentYear+1 })
    } else {
      commit('moveCalendar', { month: state.currentMonth+1, year: state.currentYear })
    }
  },
  moveCalendarBackwards: ({ state, commit }) => {
    if (state.currentMonth === 0) {
      commit('moveCalendar', { month: 11, year: state.currentYear-1 })
    } else {
      commit('moveCalendar', { month: state.currentMonth-1 })
    }
  },
  selectDate: ({ state, commit }, date) => {
    if (state.startDate === date) {
      commit('selectDate', { startDate: state.endDate, endDate: null })
    }
    else if (state.endDate === date) {
      commit('selectDate', { endDate: null })
    }
    else if (state.startDate === null && state.endDate === null) {
      commit('selectDate', { startDate: date })
    }
    else if (dateIsBefore(date, state.startDate)) {
      if (state.endDate === null) {
        commit('selectDate', { startDate: date, endDate: state.startDate })
      } else {
        commit('selectDate', { startDate: date })
      }
    }
    else if (!dateIsBefore(date, state.startDate)) {
      commit('selectDate', { endDate: date })
    }
  },
  toggleHoverDate: ({ state, commit }, date) => {
    if (state.hoverDate === date) {
      commit('toggleHoverDate', null)
    } else {
      commit('toggleHoverDate', date)
    }
  }
}

const mutations = {
  moveCalendar(state, { month = state.currentMonth, year = state.currentYear }) {
    state.currentMonth = month
    state.currentYear = year
    state.weekNumbers = weekNumsForMonth(state.currentYear, state.currentMonth+1)
  },
  selectDate(state, { startDate = state.startDate, endDate = state.endDate }) {
    state.startDate = startDate
    state.endDate = endDate
  },
  toggleHoverDate(state, date) {
    state.hoverDate = date
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
