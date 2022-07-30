import {strict as assert} from 'node:assert'
import {it} from 'node:test'
import {generateFilename} from './generate-filename.js'

it('replaces columns in dateIsoString', () => {
  const result = generateFilename('2022-07-23T22:20:17.923Z', 'mp3')

  assert.equal(result, '2022-07-23T22.20.17.923Z.mp3')
})

it('replaces columns in audioFormat', () => {
  const result = generateFilename('2022-07-23T22.20.17.923Z', 'mp:3')

  assert.equal(result, '2022-07-23T22.20.17.923Z.mp.3')
})
