import * as https from 'https'
import {logger} from './logger.js'

const GET_RESPONSE_RETRY_TIMEOUT = 1 * 30 * 1000

/**
 *
 * @param {string} url
 * @returns Promise<http.IncomingMessage>
 */
export async function tryToGetStreamResponse(url) {
  try {
    const res = await getStreamResponse(url)

    return res
  } catch (e) {
    logger.error(e)
    logger.log('Wait to retry')

    return new Promise((resolve) => {
      setTimeout(
        () => resolve(tryToGetStreamResponse(url)),
        GET_RESPONSE_RETRY_TIMEOUT,
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
