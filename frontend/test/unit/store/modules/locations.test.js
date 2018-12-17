import store from '../../../../src/store'

describe('locations getters', () => {
  describe('getters.countries', () => {
    test('Initial getters.countries has length of 50', () => {
      expect(store.getters.countries.length).toEqual(50)
    })
    test('Initial getters.counties has length of 21', () => {
      expect(store.getters.counties.length).toEqual(21)
    })
    test('Initial getters.municipalities has length of 290', () => {
      expect(store.getters.municipalities.length).toEqual(290)
    })
    test('Initial getters.cities has length of 1976', () => {
      expect(store.getters.cities.length).toEqual(1976)
    })
    test('Initial getters.mapCities is an empty array', () => {
      expect(store.getters.mapCities).toEqual([])
    })
    test('Initial getters.selectedCounty is null', () => {
      expect(store.getters.selectedCounty).toEqual(null)
    })
    test('Initial getters.selectedMunicipality is null', () => {
      expect(store.getters.selectedMunicipality).toEqual(null)
    })
    test('Initial getters.selectedCity is null', () => {
      expect(store.getters.selectedCity).toEqual(null)
    })
    test('getters.countyByName with null name is undefined', () => {
      expect(store.getters.countyByName(null)).toEqual(undefined)
    })
    test('getters.countyById with null id is null', () => {
      expect(store.getters.countyById(null)).toEqual(null)
    })
    test('Initial getters.municipalityByName with null name is undefined', () => {
      expect(store.getters.municipalityByName(null)).toEqual(undefined)
    })
    test('getters.municipalityById with null id is null', () => {
      expect(store.getters.municipalityById(null)).toEqual(null)
    })
    test('Initial getters.cityByName with null name is undefined', () => {
      expect(store.getters.cityByName(null)).toEqual(undefined)
    })
    test('getters.cityById with null id is null', () => {
      expect(store.getters.cityById(null)).toEqual(null)
    })
  })

  describe('getters.counties', () => {
    // TODO: add tests
  })

  describe('getters.municipalities', () => {
    // TODO: add tests
  })

  describe('getters.cities', () => {
    // TODO: add tests
  })

  describe('getters.mapCities', () => {
    // TODO: add tests
  })

  describe('getters.selectedCounty', () => {
    // TODO: add tests
  })

  describe('getters.selectedMunicipality', () => {
    // TODO: add tests
  })

  describe('getters.selectedCity', () => {
    // TODO: add tests
  })

  describe('getters.countyByName', () => {
    // TODO: add tests
  })

  describe('getters.countyById', () => {
    // TODO: add tests
  })

  describe('getters.municipalityByName', () => {
    // TODO: add tests
  })

  describe('getters.municipalityById', () => {
    // TODO: add tests
  })

  describe('getters.cityByName', () => {
    // TODO: add tests
  })

  describe('getters.cityById', () => {
    // TODO: add tests
  })
})

describe('locations actions', () => {
  describe('actions.selectCounty', () => {
    // TODO: add tests
  })

  describe('actions.selectMunicipality', () => {
    // TODO: add tests
  })

  describe('actions.selectCity', () => {
    // TODO: add tests
  })

  describe('actions.setActiveMapCitiesBasedOnPopulation', () => {
    // TODO: add tests
  })

  describe('actions.countyClick', () => {
    // TODO: add tests
  })

  describe('actions.municipalityClick', () => {
    // TODO: add tests
  })

  describe('actions.cityClick', () => {
    // TODO: add tests
  })
})

describe('locations mutations', () => {
  describe('mutations.selectCounty', () => {
    // TODO: add tests
  })

  describe('mutations.selectMunicipality', () => {
    // TODO: add tests
  })

  describe('mutations.selectCity', () => {
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

  describe('mutations.setActiveMapCitiesBasedOnPopulation', () => {
    // TODO: add tests
  })
})
