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
    test('Initial getters.filterNewsSelectedCounty is an empty array', () => {
      expect(store.getters.filterNewsSelectedCounty).toEqual([])
    })
  })

  describe('getters.filterNewsSelectedMunicipality', () => {
    test('Initial getters.filterNewsSelectedMunicipality is an empty array', () => {
      expect(store.getters.filterNewsSelectedMunicipality).toEqual([])
    })
  })

  describe('getters.filterNewsSelectedCity', () => {
    test('Initial getters.filterNewsSelectedCity is an empty array', () => {
      expect(store.getters.filterNewsSelectedCity).toEqual([])
    })
  })

  describe('getters.newsByCounty', () => {
    test('Initial getters.newsByCounty is an empty array', () => {
      expect(store.getters.newsByCounty).toEqual([])
    })
  })

  describe('getters.newsByMunicipality', () => {
    test('Initial getters.newsByMunicipality is an empty array', () => {
      expect(store.getters.newsByMunicipality).toEqual([])
    })
  })

  describe('getters.newsByCity', () => {
    test('Initial getters.newsByCity is an empty array', () => {
      expect(store.getters.newsByCity).toEqual([])
    })
  })

  describe('getters.activeNewsItemId', () => {
    test('Initial getters.activeNewsItemId is null', () => {
      expect(store.getters.activeNewsItemId).toEqual(null)
    })
  })

  describe('getters.activeNewsItem', () => {
    test('Initial getters.activeNewsItem is null', () => {
      expect(store.getters.activeNewsItem).toEqual(null)
    })
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
