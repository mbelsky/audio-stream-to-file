import * as fs from 'fs'
import * as path from 'path'
import {URL} from 'url'
import {logger} from './logger.js'
import {generateFilename} from './generate-filename.js'
import {
  isDestDirOk,
  saveAudioStreamToFile,
} from './save-audio-stream-to-file.js'
import {tryToGetStreamResponse} from './try-to-get-stream-response.js'

const GET_STREAM_RESPONSE_TIMEOUT = 2 * 60 * 60 * 1000

;['STREAM_URL', 'DEST_DIR'].forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Variable '${variable}' has to be defined`)
  }
})

const destDirPath = path.resolve(process.cwd(), process.env.DEST_DIR)

if (!isDestDirOk(destDirPath)) {
  throw new Error('dest dir is not valid')
}

const url = new URL(process.env.STREAM_URL)

let response

try {
  const [timeoutPromise, timeoutPromiseId] = getTimeoutPromise()

  response = await Promise.race([tryToGetStreamResponse(url), timeoutPromise])

  clearTimeout(timeoutPromiseId)
} catch (error) {
  logger.error(error)
  // After time out finish as a successful process
  process.exit()
}

if (!response) {
  throw new Error('response object is falsy')
}

const {headers} = response
const contentType = headers['content-type']
const [, audioFormat] = contentType.split('/')

const filename = generateFilename(new Date().toISOString(), audioFormat)

const writeStreamPath = path.resolve(destDirPath, filename)

const writeStream = fs.createWriteStream(writeStreamPath)

saveAudioStreamToFile(response, writeStream)

function getTimeoutPromise() {
  let id
  let promise = new Promise((_resolve, reject) => {
    id = setTimeout(() => {
      reject('tryToGetStreamResponse time out')
    }, GET_STREAM_RESPONSE_TIMEOUT)
  })

  return [promise, id]
}
