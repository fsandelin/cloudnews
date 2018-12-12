import * as helpers from '../../../src/store/helpers'

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
