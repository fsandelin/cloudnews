import store from '../../../../src/store'

describe('gui getters', () => {
  describe('getters.zoomValue', () => {
    test('Initial getters.zoomValue is 1', () => {
      expect(store.getters.zoomValue).toEqual(1)
    })
    test('Initial getters.showDatePicker is false', () => {
      expect(store.getters.showDatePicker).toEqual(false)
    })
    test('Initial getters.showAboutPage is false', () => {
      expect(store.getters.showAboutPage).toEqual(false)
    })
  })

  describe('getters.showDatePicker', () => {
    // TODO: add tests
  })

  describe('getters.showAboutPage', () => {
    // TODO: add tests
  })
})

describe('gui actions', () => {
  describe('actions.setZoomValue', () => {
    // TODO: add tests
  })

  describe('actions.toggleDatePicker', () => {
    // TODO: add tests
  })

  describe('actions.toggleAboutPage', () => {
    // TODO: add tests
  })

  describe('actions.toggleDrawer', () => {
    // TODO: add tests
  })

  describe('actions.toggleActive', () => {
    // TODO: add tests
  })
})

describe('gui mutations', () => {
  describe('mutations.setZoomValue', () => {
    // TODO: add tests
  })

  describe('mutations.toggleDatePicker', () => {
    // TODO: add tests
  })

  describe('mutations.toggleAboutPage', () => {
    // TODO: add tests
  })
})
