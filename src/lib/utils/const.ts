export const FARM_TIME = 4000
export const TEST_ADDRESS = 'EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST'
export const TON_KEY = 'TON_CONNECT'
export const cubicOut = 'cubic-bezier(0.22, 0.61, 0.36, 1)'
export const quadInOut = 'cubic-bezier(0.455, 0.03, 0.515, 0.955)'
export const FARMING = 'farming'
export const FARMED = 'farmed'
export const CLAIMED = 'claimed'
export const meUrl = '/api/me'
export const coefAmount = 0.434
export const coefTime = 0.219
export const coefAmountTime = 0.347

export const levels = [
  {
    time: 2,
    amount: 1,
    next: 69,
    bonusT: 10,
    bonusA: 8,
    bonusAT: 5,
  },
  {
    time: 4,
    amount: 10,
    next: 690,
    bonusT: 100,
    bonusA: 80,
    bonusAT: 50,
  },
  {
    time: 8,
    amount: 19,
    next: 3450,
    bonusT: 500,
    bonusA: 400,
    bonusAT: 250,
  },
  {
    time: 15,
    amount: 28,
    next: 10350,
    bonusT: 1500,
    bonusA: 1200,
    bonusAT: 750,
  },
  {
    time: 30,
    amount: 37,
    next: 31050,
    bonusT: 4500,
    bonusA: 3600,
    bonusAT: 2250,
  },
  {
    time: 60,
    amount: 46,
    next: 93150,
    bonusT: 13500,
    bonusA: 10800,
    bonusAT: 6750,
  },
  {
    time: 120,
    amount: 55,
    next: 279450,
    bonusT: 40500,
    bonusA: 32400,
    bonusAT: 20250,
  },
  {
    time: 240,
    amount: 64,
    next: 838350,
    bonusT: 121500,
    bonusA: 97200,
    bonusAT: 60750,
  },
  {
    time: 480,
    amount: 73,
    next: 1676700,
    bonusT: 243000,
    bonusA: 194400,
    bonusAT: 121500,
  },
  {
    time: 960,
    amount: 82,
    next: 2850390,
    bonusT: 413100,
    bonusA: 330480,
    bonusAT: 206550,
  },
  {
    time: 1440,
    amount: 91,
    next: 4275585,
    bonusT: 619650,
    bonusA: 495720,
    bonusAT: 309825,
  },
] as const

export const taskStatus = {
  start: 0,
  loading: 1,
  claim: 2,
  done: 3,
} as const

export const TASK_CTX = 'task'

export const BOOST = ['time', 'income', 'combo'] as const

export type ShopTabs = 0 | 1 | 2
