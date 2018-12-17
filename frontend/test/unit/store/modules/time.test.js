import store from '../../../../src/store'

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
      const date = new Date()
      const today = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
      expect(store.getters.startDate).toEqual(today)
    })
  })

  describe('getters.endDate', () => {
    test('Initial getters.endDate is null', () => {
      expect(store.getters.endDate).toEqual(null)
    })
  })

  describe('getters.newsStartDate', () => {
    test('Initial getters.newsStartDate is this today', () => {
      const date = new Date()
      const today = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
      expect(store.getters.newsStartDate).toEqual(today)
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
    // TODO: add tests
  })

  describe('getters.numToMonth', () => {
    test('Initial getters.numToMonth with null num is null', () => {
      expect(store.getters.numToMonth(null)).toEqual(null)
    })
  })

  describe('getters.getDaysToDisplay', () => {
    // TODO: add tests
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
