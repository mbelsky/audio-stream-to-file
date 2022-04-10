import * as fs from 'fs'
import * as path from 'path'
import {URL} from 'url'
import {logger} from './logger.js'
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
  process.exit(1)
}

const url = new URL(process.env.STREAM_URL)

try {
  const response = await Promise.race([
    tryToGetStreamResponse(url),
    getTimeoutPromise(),
  ])

  if (!response) {
    throw new Error('response object is falsy')
  }

  const {headers} = response
  const contentType = headers['content-type']
  const [, audioFormat] = contentType.split('/')

  const filename = new Date().toISOString()

  const writeStreamPath = path.resolve(
    destDirPath,
    `${filename}.${audioFormat}`,
  )

  const writeStream = fs.createWriteStream(writeStreamPath)

  saveAudioStreamToFile(response, writeStream)
} catch {
  // well we've tried.
  process.exit(0)
}

function getTimeoutPromise() {
  return new Promise((_resolve, reject) => {
    setTimeout(() => {
      logger.error('tryToGetStreamResponse time out')

      reject()
    }, GET_STREAM_RESPONSE_TIMEOUT)
  })
}
