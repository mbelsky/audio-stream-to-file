import * as fs from 'fs'
import * as path from 'path'
import {saveAudioStreamToFile} from './save-audio-stream-to-file.js'
import {tryToGetStreamResponse} from './try-to-get-stream-response.js'
;['STREAM_URL', 'DEST_DIR'].forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Variable '${variable}' has to be defined`)
  }
})

const res = await tryToGetStreamResponse(process.env.STREAM_URL)

if (!res) {
  throw new Error('response object is falsy')
}

const {headers} = res
const contentType = headers['content-type']
const [, audioFormat] = contentType.split('/')
const filename = new Date().toISOString()

const writeStreamPath = path.resolve(
  process.cwd(),
  process.env.DEST_DIR,
  `${filename}.${audioFormat}`,
)

const writeStream = fs.createWriteStream(writeStreamPath)

saveAudioStreamToFile(res, writeStream)
