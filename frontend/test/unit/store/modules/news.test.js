import store from '../../../../src/store'

describe('news getters', () => {
  describe('getters.newsList', () => {
    test('Initial getters.newsList is an empty array', () => {
      expect(store.getters.newsList).toEqual([])
    })
  })

  describe('getters.filteredNewsList', () => {
    test('Initial getters.filteredNewsList is an empty array', () => {
      expect(store.getters.filteredNewsList).toEqual([])
    })
  })

  describe('getters.filterNewsSelectedCounty', () => {
    // TODO: add tests
  })

  describe('getters.filterNewsSelectedMunicipality', () => {
    // TODO: add tests
  })

  describe('getters.filterNewsSelectedCity', () => {
    // TODO: add tests
  })

  describe('getters.newsByCounty', () => {
    // TODO: add tests
  })

  describe('getters.newsByMunicipality', () => {
    // TODO: add tests
  })

  describe('getters.newsByCity', () => {
    // TODO: add tests
  })

  describe('getters.activeNewsItemId', () => {
    // TODO: add tests
  })

  describe('getters.activeNewsItem', () => {
    // TODO: add tests
  })
})

describe('news actions', () => {
  describe('actions.addNews', () => {
    // TODO: add tests
  })

  describe('actions.addNewsList', () => {
    // TODO: add tests
  })

  describe('actions.setActiveNewsItemId', () => {
    // TODO: add tests
  })
})

describe('news mutations', () => {
  describe('mutations.addNews', () => {
    // TODO: add tests
  })

  describe('mutations.setActiveNewsItemId', () => {
    // TODO: add tests
  })

  describe('mutations.openDrawer', () => {
    // TODO: add tests
  })

  describe('mutations.closeDrawer', () => {
    // TODO: add tests
  })

  describe('mutations.toggleActive', () => {
    // TODO: add tests
  })
})
