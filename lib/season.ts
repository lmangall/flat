// On the Mediterranean coast the pine processionary caterpillars come down from
// the pines between January and May. Outside that window the warning is still
// worth reading, but the card steps back instead of shouting.
export const PROCESSIONARY_SEASON = { firstMonth: 1, lastMonth: 5 }

export function isProcessionarySeason(date: Date = new Date()): boolean {
  const month = date.getMonth() + 1
  return month >= PROCESSIONARY_SEASON.firstMonth && month <= PROCESSIONARY_SEASON.lastMonth
}
