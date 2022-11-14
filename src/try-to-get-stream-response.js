import * as https from 'https'
import {getRetryTimeout} from './get-retry-timeout.js'
import {logger} from './logger.js'

/**
 *
 * @param {URL} url
 * @returns Promise<http.IncomingMessage>
 */
export async function tryToGetStreamResponse(url, runAttempt) {
  return tryToGetStreamResponseInternal(url, runAttempt, 0)
}

async function tryToGetStreamResponseInternal(url, runAttempt, tryAttempt) {
  try {
    const res = await getStreamResponse(url)

    return res
  } catch (e) {
    logger.error(e)
    logger.log('Wait to retry')

    return new Promise((resolve) => {
      const timeout = getRetryTimeout(runAttempt, tryAttempt)

      setTimeout(
        () =>
          resolve(
            tryToGetStreamResponseInternal(url, runAttempt, tryAttempt + 1),
          ),
        timeout,
      )
    })
  }
}

function getStreamResponse(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, (res) => {
      const {headers, statusCode} = res

      logger.log(`statusCode: ${statusCode}`)

      const {location} = headers
      const is3xxStatusCode = statusCode > 299 && statusCode < 400

      if (is3xxStatusCode && location) {
        return resolve(getStreamResponse(location))
      }

      const isStatusCodeOK = statusCode > 199 && statusCode < 300

      if (!isStatusCodeOK) {
        return reject(`invalid response status code: ${statusCode}`)
      }

      const contentType = headers['content-type']
      const isAudioContentType = contentType?.startsWith('audio/')

      if (!isAudioContentType) {
        return reject(`invalid response content type: ${contentType}`)
      }

      resolve(res)
    })

    req
      .on('error', (error) => {
        reject('Request error: ' + error)
      })
      .end()
  })
}
