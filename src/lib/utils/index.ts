import { taskStatus } from '@utils/const'

export async function w8(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms, true))
}

export const noop = () => {}

export function formatTime(ms: number) {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const remainingSeconds = seconds % 60
  const remainingMinutes = minutes % 60

  const padZero = (num: number) => num.toString().padStart(2, '0')

  const language = navigator.language || navigator.languages[0] // Change to PARAGLIDE
  const isEnglish = language.startsWith('en')

  return `${padZero(hours)}${isEnglish ? 'h' : 'ч'} ${padZero(remainingMinutes)}${isEnglish ? 'm' : 'м'} ${padZero(remainingSeconds)}${isEnglish ? 's' : 'с'}`
}

export function shortenAddress(addr: string) {
  if (addr.length < 10) return addr
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`
}

export function logServer(data: any, file?: string) {
  fetch('/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...(file ? { file } : {}), data }),
  })
}

export function sortTasks(tasks: SocialItem[]) {
  return tasks.sort((a, b) => (b.status === taskStatus.done && a.status !== taskStatus.done ? -1 : 0))
}
