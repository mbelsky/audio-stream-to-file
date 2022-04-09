import {logger} from './logger.js'

export function saveAudioStreamToFile(res, writeStream) {
  res
    .on('data', (data) => {
      writeStream.write(data)
    })
    .on('error', (...args) => {
      writeStream.end()

      logger.error(`EVENT error, VALUE: `, safeStringify(args))
      process.exit(1)
    })
  ;['close', 'end'].forEach((event) => {
    res.on(event, () => {
      writeStream.end()

      logger.log(`EVENT ${event}`)

      if (!res.complete) {
        logger.error(
          `The connection was terminated while the message was still being sent`,
        )
        process.exit(1)
      }
    })
  })
}

function safeStringify(data) {
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return `failed to stringify ` + data
  }
}
