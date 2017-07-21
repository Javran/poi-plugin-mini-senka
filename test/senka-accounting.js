import { computeAccountingInfo } from '../senka-accounting'

const assert = require('assert')

const spec = it

describe('computeAccountingInfo', () => {
  spec('tests', () => {
    const test = (timeStr, expectedStr) =>
      assert.equal(
        computeAccountingInfo(timeStr).label,
        expectedStr)

    test('2017-06-20T00:00:00+09:00', '2017-06-20|02')
    test('2017-06-20T01:59:00+09:00', '2017-06-20|02')
    test('2017-06-20T02:20:00+09:00', '2017-06-20|14')
    test('2017-06-20T13:20:00+09:00', '2017-06-20|14')
    test('2017-06-20T22:20:00+09:00', '2017-06-21|02')
    test('2017-06-20T23:10:00+09:00', '2017-06-21|02')

    test('2017-06-30T00:00:00+09:00', '2017-06-30|02')
    test('2017-06-30T01:59:00+09:00', '2017-06-30|02')
    test('2017-06-30T02:20:00+09:00', '2017-06-30|14')
    test('2017-06-30T13:20:00+09:00', '2017-06-30|14')
    test('2017-06-30T22:20:00+09:00', '2017-07-01|02')
    test('2017-06-30T23:10:00+09:00', '2017-07-01|02')
  })
})
