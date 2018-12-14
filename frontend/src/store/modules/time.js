import {
  weekDays as wd,
  TOTAL_DAYS_TO_SHOW
} from '../../helpers/constants'
import {
  numToMonth,
  getDaysForMonth,
  getNumArrayBetweenNums,
  dateIsBefore,
  sameDates,
  prettifyDateObject
} from '../../helpers/misc'

const today = new Date()

const state = {
  today: prettifyDateObject({ year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() }),
  currentYear: today.getFullYear(),
  currentMonth: today.getMonth() + 1,
  weekDays: [ wd.MONDAY, wd.TUESDAY, wd.WEDNESDAY, wd.THURSDAY, wd.FRIDAY, wd.SATURDAY, wd.SUNDAY ],
  startDate: { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() },
  endDate: null,
  newsStartDate: { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() },
  newsEndDate: null,
  hoverDate: null
}

const getters = {
  currentYear: state => state.currentYear,
  currentMonth: state => state.currentMonth,
  weekDays: state => state.weekDays,
  startDate: state => state.startDate,
  endDate: state => state.endDate,
  newsStartDate: state => state.newsStartDate,
  newsEndDate: state => state.newsEndDate,
  hoverDate: state => state.hoverDate,
  dateBetween: _ => (date, edgeDate1, edgeDate2) => {
    return (dateIsBefore(edgeDate1, date) && dateIsBefore(date, edgeDate2)) ||
           (dateIsBefore(edgeDate2, date) && dateIsBefore(date, edgeDate1))
  },
  numToMonth: _ => num => numToMonth(num),
  getDaysToDisplay: state => {
    const daysForCurrentMonth = getDaysForMonth(state.currentYear, state.currentMonth)

    const currentDaysToFill = getNumArrayBetweenNums(1, daysForCurrentMonth + 1)
      .map(i => ({ year: state.currentYear, month: state.currentMonth, day: i }))

    const weekDay = new Date(state.currentYear, state.currentMonth - 1, 1).getDay()
    const numPreviousDaysToFill = weekDay === 0 ? 7 : weekDay

    const daysForPreviousMonth = state.currentMonth === 0
      ? getDaysForMonth(state.currentYear - 1, state.currentMonth + 11)
      : getDaysForMonth(state.currentYear, state.currentMonth - 1)

    const previousDaysToFill = getNumArrayBetweenNums(daysForPreviousMonth - numPreviousDaysToFill + 2, daysForPreviousMonth + 1)
      .map(i => ({ year: state.currentYear, month: state.currentMonth - 1, day: i }))

    const numNextDaysToFill = TOTAL_DAYS_TO_SHOW - (daysForCurrentMonth + numPreviousDaysToFill)

    const nextDaysToFill = getNumArrayBetweenNums(1, numNextDaysToFill + 2)
      .map(i => ({
        year: state.currentMonth === 12 ? state.currentYear + 1 : state.currentYear,
        month: state.currentMonth === 12 ? 1 : state.currentMonth + 1,
        day: i
      }))

    return [ ...previousDaysToFill, ...currentDaysToFill, ...nextDaysToFill ]
  },
  daysByRow: (state, getters) => {
    const dates = getters.getDaysToDisplay
    return Array.apply(null, Array(6)).map((_, i) => dates.slice(i * 7, i * 7 + 7))
  }
}

const actions = {
  moveCalendarToCurrentMonth: ({ dispatch }) => {
    dispatch('moveCalendarToDate', { year: today.getFullYear(), month: today.getMonth() + 1 })
  },
  moveCalendarToDate: ({ commit }, date) => {
    commit('moveCalendar', { month: date.month, year: date.year })
  },
  moveCalendarForwards: ({ state, commit }) => {
    if (state.currentMonth === 12) {
      commit('moveCalendar', { month: 1, year: state.currentYear + 1 })
    } else {
      commit('moveCalendar', { month: state.currentMonth + 1, year: state.currentYear })
    }
  },
  moveCalendarBackwards: ({ state, commit }) => {
    if (state.currentMonth === 1) {
      commit('moveCalendar', { month: 12, year: state.currentYear - 1 })
    } else {
      commit('moveCalendar', { month: state.currentMonth - 1 })
    }
  },
  selectDate: ({ state, commit }, date) => {
    if (sameDates(state.startDate, date)) {
      commit('selectDate', { startDate: state.endDate, endDate: null })
    } else if (sameDates(state.endDate, date)) {
      commit('selectDate', { endDate: null })
    } else if (state.startDate === null && state.endDate === null) {
      commit('selectDate', { startDate: date })
    } else if (dateIsBefore(date, state.startDate)) {
      if (state.endDate === null) {
        commit('selectDate', { startDate: date, endDate: state.startDate })
      } else {
        commit('selectDate', { startDate: date })
      }
    } else if (!dateIsBefore(date, state.startDate)) {
      commit('selectDate', { endDate: date })
    }
  },
  toggleHoverDate: ({ state, commit }, date) => {
    if (sameDates(state.hoverDate, date)) {
      commit('toggleHoverDate', null)
    } else {
      commit('toggleHoverDate', date)
    }
  },
  saveNewDates: ({ state, commit, dispatch }) => {
    commit('saveDates', {
      newsStartDate: state.startDate,
      newsEndDate: state.endDate,
      startDate: state.startDate,
      endDate: state.endDate,
      currentYear: state.newsStartDate.year,
      currentMonth: state.newsStartDate.month
    })
    const from = prettifyDateObject(state.startDate)
    const until = prettifyDateObject(state.endDate)
    dispatch('makeSocketTimeSpanRequest', { from, until })
  },
  discardNewDates: ({ state, commit }) => {
    commit('saveDates', {
      newsStartDate: state.newsStartDate,
      newsEndDate: state.newsEndDate,
      startDate: state.newsStartDate,
      endDate: state.newsEndDate,
      currentYear: state.newsStartDate.year,
      currentMonth: state.newsStartDate.month
    })
  }
}

const mutations = {
  moveCalendar (state, { month = state.currentMonth, year = state.currentYear }) {
    state.currentMonth = month
    state.currentYear = year
  },
  selectDate (state, { startDate = state.startDate, endDate = state.endDate }) {
    state.startDate = startDate
    state.endDate = endDate
  },
  toggleHoverDate (state, date) {
    state.hoverDate = date
  },
  saveDates (state, { startDate, endDate, newsStartDate, newsEndDate, currentYear, currentMonth }) {
    state.startDate = startDate
    state.endDate = endDate
    state.newsStartDate = newsStartDate
    state.newsEndDate = newsEndDate
    state.currentYear = currentYear
    state.currentMonth = currentMonth
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
