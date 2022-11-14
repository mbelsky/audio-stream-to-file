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

const GET_STREAM_RESPONSE_TIMEOUT = 1.5 * 60 * 60 * 1000

;['STREAM_URL', 'DEST_DIR'].forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Variable '${variable}' has to be defined`)
  }
})

const destDirPath = path.resolve(process.cwd(), process.env.DEST_DIR)
const url = new URL(process.env.STREAM_URL)

run()

async function run(attempt = 0) {
  logger.log(`run #${attempt}`)

  if (!isDestDirOk(destDirPath)) {
    throw new Error('dest dir is not valid')
  }

  let response

  try {
    const [timeoutPromise, timeoutPromiseId] = getTimeoutPromise()

    response = await Promise.race([
      tryToGetStreamResponse(url, attempt),
      timeoutPromise,
    ])

    clearTimeout(timeoutPromiseId)
  } catch (error) {
    logger.error(error)
    // After time out finish as a successful process
    process.exit()
    // Any succesful run should end here
  }

  if (!response) {
    throw new Error('response object is falsy')
  }

  const {headers} = response
  const contentType = headers['content-type']
  const [, audioFormat] = contentType.split('/')

  const filename = generateFilename(new Date().toISOString(), audioFormat)

  logger.log(`Resolve ${filename} path and create write stream`)

  const writeStreamPath = path.resolve(destDirPath, filename)

  const writeStream = fs.createWriteStream(writeStreamPath)

  try {
    await saveAudioStreamToFile(response, writeStream)
  } catch (e) {
    logger.error(e)
  }

  // After successful saveAudioStreamToFile execute `run` again in case stream is restarting.
  run(attempt + 1)
}

function getTimeoutPromise() {
  let id
  let promise = new Promise((_resolve, reject) => {
    id = setTimeout(() => {
      reject('tryToGetStreamResponse time out')
    }, GET_STREAM_RESPONSE_TIMEOUT)
  })

  return [promise, id]
}
