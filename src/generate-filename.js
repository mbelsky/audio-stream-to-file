export function generateFilename(dateIsoString, audioFormat) {
  return `${dateIsoString}.${audioFormat}`.replace(/[^a-z0-9-.]/gi, '.')
}
