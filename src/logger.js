function getTime() {
  return new Date().toISOString()
}

export const logger = {
  error() {
    console.error(getTime(), ...arguments)
  },
  log() {
    console.log(getTime(), ...arguments)
  },
}
