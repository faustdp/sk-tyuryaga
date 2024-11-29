import { SIXTY, taskStatus } from '@utils/const'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function w8(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms, true))
}

export const noop = () => {}

export function formatTime(ms: number, withoutSeconds = false) {
  const seconds = Math.trunc(ms / 1000)
  const minutes = Math.trunc(seconds / SIXTY)
  const hours = Math.trunc(minutes / SIXTY)

  const remainingSeconds = seconds % SIXTY
  const remainingMinutes = minutes % SIXTY

  const padZero = (num: number) => num.toString().padStart(2, '0')

  const language = navigator.language || navigator.languages[0] //TODO Change to PARAGLIDE
  const isEnglish = language.startsWith('en')
  const result = `${padZero(hours)}${isEnglish ? 'h' : 'ч'} ${padZero(remainingMinutes)}${isEnglish ? 'm' : 'м'}`

  if (withoutSeconds) return result

  return `${result} ${padZero(remainingSeconds)}${isEnglish ? 's' : 'с'}`
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

export const getImgUrl = (img: number, level: number) => `/imgs/${img}/${level + 1}.webp`

export function getFirstLetter(name: string): string {
  const firstLetterMatch = name.match(/[a-zA-Z]/)
  return firstLetterMatch ? firstLetterMatch[0].toUpperCase() : '?'
}
