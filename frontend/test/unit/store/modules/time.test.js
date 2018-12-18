import store from '../../../../src/store'

// const today
const today = new Date()
const todayObj = {
  year: today.getFullYear(),
  month: today.getMonth() + 1,
  day: today.getDate()
}

beforeEach(() => {
  store.commit('saveDates', {
    startDate: todayObj,
    endDate: null,
    newsStartDate: todayObj,
    newsEndDate: null,
    currentYear: todayObj.year,
    currentMonth: todayObj.month
  })
})

describe('time getters', () => {
  describe('getters.currentYear', () => {
    test('Initial getters.currentYear is this year', () => {
      expect(store.getters.currentYear).toEqual(new Date().getFullYear())
    })
  })

  describe('getters.currentMonth', () => {
    test('Initial getters.currentMonth is this month', () => {
      expect(store.getters.currentMonth).toEqual(new Date().getMonth() + 1)
    })
  })

  describe('getters.weekDays', () => {
    test('Initial getters.weekDays is this an array of the weekdays', () => {
      expect(store.getters.weekDays).toEqual(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
    })
  })

  describe('getters.startDate', () => {
    test('Initial getters.startDate is this today', () => {
      expect(store.getters.startDate).toEqual(todayObj)
    })
  })

  describe('getters.endDate', () => {
    test('Initial getters.endDate is null', () => {
      expect(store.getters.endDate).toEqual(null)
    })
  })

  describe('getters.newsStartDate', () => {
    test('Initial getters.newsStartDate is this today', () => {
      expect(store.getters.newsStartDate).toEqual(todayObj)
    })
  })

  describe('getters.newsEndDate', () => {
    test('Initial getters.newsEndDate is null', () => {
      expect(store.getters.newsEndDate).toEqual(null)
    })
  })

  describe('getters.hoverDate', () => {
    test('Initial getters.hoverDate is null', () => {
      expect(store.getters.hoverDate).toEqual(null)
    })
  })

  describe('getters.dateBetween', () => {
    test('Initial getters.dateBetween returns true when a date is between two dates', () => {
      const dateBefore = {
        year: 2017,
        month: 2,
        day: 28
      }
      const dateBetween = {
        year: 2017,
        month: 3,
        day: 1
      }
      const dateAfter = {
        year: 2018,
        month: 1,
        day: 1
      }
      expect(store.getters.dateBetween(dateBetween, dateBefore, dateAfter)).toEqual(true)
    })
  })

  describe('getters.numToMonth', () => {
    test('Initial getters.numToMonth with null num is null', () => {
      expect(store.getters.numToMonth(null)).toEqual(null)
    })
  })

  describe('getters.getDaysToDisplay', () => {
    test('Initial getters.getDaysToDisplay return 42 days', () => {
      expect(store.getters.getDaysToDisplay.length).toEqual(42)
    })

    test('getters.getDaysToDisplay for 2018-02-01: day numbers and months are correct', () => {
      const someDate = new Date('2018-02-01')
      const someDateObj = {
        year: someDate.getFullYear(),
        month: someDate.getMonth() + 1,
        day: someDate.getDate()
      }
      store.commit('saveDates', {
        startDate: someDateObj,
        endDate: null,
        newsStartDate: someDateObj,
        newsEndDate: null,
        currentYear: someDateObj.year,
        currentMonth: someDateObj.month
      })

      const dayNumbers = [29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

      store.getters.getDaysToDisplay.map((day, i) => {
        expect(day.day).toEqual(dayNumbers[i])
        if (i < 3) {
          expect(day.month).toEqual(1)
        } else if (i > 30) {
          expect(day.month).toEqual(3)
        } else {
          expect(day.month).toEqual(2)
        }
      })
    })
  })

  describe('getters.daysByRow', () => {
    // TODO: add tests
  })
})

describe('time actions', () => {
  describe('actions.moveCalendarToCurrentMonth', () => {
    // TODO: add tests
  })

  describe('actions.moveCalendarToDate', () => {
    // TODO: add tests
  })

  describe('actions.moveCalendarForwards', () => {
    // TODO: add tests
  })

  describe('actions.moveCalendarBackwards', () => {
    // TODO: add tests
  })

  describe('actions.selectDate', () => {
    // TODO: add tests
  })

  describe('actions.toggleHoverDate', () => {
    // TODO: add tests
  })

  describe('actions.saveNewDates', () => {
    // TODO: add tests
  })

  describe('actions.discardNewDates', () => {
    // TODO: add tests
  })
})

describe('time mutations', () => {
  describe('mutations.moveCalendar', () => {
    // TODO: add tests
  })

  describe('mutations.selectDate', () => {
    // TODO: add tests
  })

  describe('mutations.toggleHoverDate', () => {
    // TODO: add tests
  })

  describe('mutations.saveDates', () => {
    // TODO: add tests
  })
})
