import * as helpers from '../../../src/store/helpers'

test('getWeek gets the correct week', () => {
  expect(helpers.getWeek(new Date(2018, 11, 10, 12, 0, 0, 0))).toBe(50)
  expect(helpers.getWeek(new Date(2019, 11, 10, 12, 0, 0, 0))).toBe(50)
  expect(helpers.getWeek(new Date(2045, 5, 13, 12, 0, 0, 0))).toBe(24)
  expect(helpers.getWeek(new Date(2018, 3, 1, 12, 0, 0, 0))).toBe(14)
  expect(helpers.getWeek(new Date(1990, 11, 24, 12, 0, 0, 0))).toBe(52)
  expect(helpers.getWeek(new Date(2019, 1, 6, 12, 0, 0, 0))).toBe(6)
  expect(helpers.getWeek(new Date(2019, 0, 7, 12, 0, 0, 0))).toBe(2)
  expect(helpers.getWeek(new Date(2019, 0, 1, 12, 0, 0, 0))).toBe(1)
})

test('clearnString cleans strings correctly', () => {
  expect(helpers.cleanString(' kiruna KoMmun  ')).toBe('kiruna kommun')
  expect(helpers.cleanString('         ')).toBe('')
  expect(helpers.cleanString('kiruna')).toBe('kiruna')
  expect(helpers.cleanString('             K       K        ')).toBe('k       k')
  expect(helpers.cleanString(' 9pwkmanNF')).toBe('9pwkmannf')
  expect(helpers.cleanString(' ¨09()/¤""#¤%&12qwdq ')).toBe('¨09()/¤""#¤%&12qwdq')
})

test('numToMonth gets correct month', () => {
  expect(helpers.numToMonth(1)).toBe('January')
  expect(helpers.numToMonth(2)).toBe('February')
  expect(helpers.numToMonth(3)).toBe('March')
  expect(helpers.numToMonth(4)).toBe('April')
  expect(helpers.numToMonth(5)).toBe('May')
  expect(helpers.numToMonth(6)).toBe('June')
  expect(helpers.numToMonth(7)).toBe('July')
  expect(helpers.numToMonth(8)).toBe('August')
  expect(helpers.numToMonth(9)).toBe('September')
  expect(helpers.numToMonth(10)).toBe('October')
  expect(helpers.numToMonth(11)).toBe('November')
  expect(helpers.numToMonth(12)).toBe('December')
})
