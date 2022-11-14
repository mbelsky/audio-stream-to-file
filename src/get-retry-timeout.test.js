import {strict as assert} from 'node:assert'
import {it} from 'node:test'
import {getRetryTimeout} from './get-retry-timeout.js'
;[-10, 0, 4, 5, 15, 33, 38, 100].forEach((tryAttempt) => {
  it(`always returns highest timeout for 0 run, tryAttempt=${tryAttempt}`, () => {
    const result = getRetryTimeout(0, tryAttempt)

    assert.equal(result, 30000)
  })
})
;[-10, 0, 4].forEach((tryAttempt) => {
  it(`returns lowest timeout, tryAttempt=${tryAttempt}`, () => {
    const result = getRetryTimeout(-5, tryAttempt)

    assert.equal(result, 200)
  })
})
;[5, 14].forEach((tryAttempt) => {
  it(`returns lower timeout, tryAttempt=${tryAttempt}`, () => {
    const result = getRetryTimeout(1, tryAttempt)

    assert.equal(result, 500)
  })
})
;[15, 33].forEach((tryAttempt) => {
  it(`returns 1s timeout, tryAttempt=${tryAttempt}`, () => {
    const result = getRetryTimeout(1, tryAttempt)

    assert.equal(result, 1000)
  })
})
;[38, 100].forEach((tryAttempt) => {
  it(`returns default timeout, tryAttempt=${tryAttempt}`, () => {
    const result = getRetryTimeout(1, tryAttempt)

    assert.equal(result, 30000)
  })
})
