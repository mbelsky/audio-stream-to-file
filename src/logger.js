function getTime() {
  return new Date().toISOString()
}

export const logger = {
  error() {
    console.error(getTime(), 'err', ...arguments)
  },
  log() {
    console.log(getTime(), 'info', ...arguments)
  },
}
