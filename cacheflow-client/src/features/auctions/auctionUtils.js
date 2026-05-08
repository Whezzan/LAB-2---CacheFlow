export function formatCurrency(amount) {
  return new Intl.NumberFormat('sv-SE', {
    style:    'currency',
    currency: 'SEK',
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatDate(dateString) {
  return new Intl.DateTimeFormat('sv-SE', {
    year:   'numeric',
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

export function formatTimeLeft(endDateString) {
  const now     = new Date()
  const endDate = new Date(endDateString)
  const diff    = endDate - now

  if (diff <= 0) return 'Avslutad'

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0)    return `${days}d ${hours}h kvar`
  if (hours > 0)   return `${hours}h ${minutes}m kvar`
  return `${minutes}m kvar`
}

export function toLocalDatetimeValue(dateString) {
  const date = new Date(dateString)
  const offset = date.getTimezoneOffset()
  const local  = new Date(date.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}
