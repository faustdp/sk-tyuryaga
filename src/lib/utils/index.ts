export async function w8(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms, true))
}

export function formatTime(ms: number) {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const remainingSeconds = seconds % 60
  const remainingMinutes = minutes % 60

  const padZero = (num: number) => num.toString().padStart(2, '0')

  return `${padZero(hours)}ч ${padZero(remainingMinutes)}м ${padZero(remainingSeconds)}с`
}

export function shortenAddress(addr: string) {
  if (addr.length < 10) return addr
  return `${addr.slice(0, 5)}...${addr.slice(-5)}`
}

export function logServer(data: any, file?: string) {
  fetch('/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...(file ? { file } : {}), data }),
  })
}
