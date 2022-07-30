import * as fs from 'fs'
import {logger} from './logger.js'

export function isDestDirOk(destDirPath) {
  try {
    fs.accessSync(destDirPath, fs.constants.W_OK)
  } catch (e) {
    logger.error(`dest dir is not accessible`, e)
    return false
  }

  try {
    const fileStats = fs.lstatSync(destDirPath)

    return fileStats.isDirectory()
  } catch (e) {
    logger.error(`dest dir lstat failed`, e)
    return false
  }
}

/**
 * @returns Promise<void>
 */
export function saveAudioStreamToFile(response, writeStream) {
  let resolve, reject

  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  response
    .on('data', (data) => {
      writeStream.write(data)
    })
    .on('error', (...args) => {
      writeStream.end()

      reject(`EVENT error, VALUE: ` + safeStringify(args))
    })
  ;['close', 'end'].forEach((event) => {
    response.on(event, () => {
      writeStream.end()

      logger.log(`EVENT ${event}`)

      if (!response.complete) {
        const message = `The connection was terminated while the message was still being sent`

        logger.error(message)

        reject(message)
      }

      resolve()
    })
  })

  return promise
}

function safeStringify(data) {
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return `failed to stringify ` + data
  }
}
