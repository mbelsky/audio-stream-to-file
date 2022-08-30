function getTime() {
  return new Date().toISOString()
}

export const logger = {
  debug() {
    console.log(getTime(), 'debug', ...arguments)
  },
  error() {
    console.error(getTime(), 'err', ...arguments)
  },
  log() {
    console.log(getTime(), 'info', ...arguments)
  },
}
