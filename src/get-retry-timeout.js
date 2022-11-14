const GET_RESPONSE_RETRY_TIMEOUT = 30

export function getRetryTimeout(runAttempt, tryAttempt) {
  let seconds

  switch (true) {
    case runAttempt === 0:
      seconds = GET_RESPONSE_RETRY_TIMEOUT
      break
    case tryAttempt < 5:
      seconds = 0.2
      break
    case tryAttempt < 15:
      seconds = 0.5
      break
    case tryAttempt < 38:
      seconds = 1
      break
    default:
      seconds = GET_RESPONSE_RETRY_TIMEOUT
  }

  return seconds * 1000
}
