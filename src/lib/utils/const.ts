export const TEST_ADDRESS = 'EQChHpu8-rFBQyVCXJtT1aTwODTBc1dFUAEatbYy11ZLcBST'
export const TON_KEY = 'TON_CONNECT'
export const cubicOut = 'cubic-bezier(0.22, 0.61, 0.36, 1)'
export const quadInOut = 'cubic-bezier(0.455, 0.03, 0.515, 0.955)'
export const FARMING = 'farming'
export const FARMED = 'farmed'
export const CLAIMED = 'claimed'
export const meUrl = '/api/me'
export const TIME = 'time'
export const AMOUNT = 'amount'
export const COMBO = 'combo'

export const BONUSES = {
  [TIME]: [27, 54, 93, 200, 400, 800, 1600, 3200, 6400, 6400],
  [AMOUNT]: 2,
  [COMBO]: {
    [TIME]: [13, 26, 47, 100, 200, 400, 800, 1600, 3200, 3200],
    [AMOUNT]: 1,
  },
}

interface Images {
  name: string[]
  type: BoostValue
}

export const imgs: Images[] = [
  {
    type: COMBO,
    name: ['Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест'],
  },
  {
    type: AMOUNT,
    name: ['Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест'],
  },
  {
    type: COMBO,
    name: ['Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест'],
  },
  {
    type: AMOUNT,
    name: ['Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест'],
  },
  {
    type: AMOUNT,
    name: ['Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест'],
  },
  {
    type: TIME,
    name: ['Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест'],
  },
  {
    type: TIME,
    name: ['Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест'],
  },
  {
    type: TIME,
    name: ['Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест'],
  },
  {
    type: COMBO,
    name: ['Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест', 'Тест'],
  },
]

export const LEVELS = [
  {
    baseTime: 2,
    baseAmount: 1,
    next: 69,
    priceTime: 10,
    priceAmount: 8,
    priceAmountTime: 5,
  },
  {
    baseTime: 4,
    baseAmount: 10,
    next: 690,
    priceTime: 100,
    priceAmount: 80,
    priceAmountTime: 50,
  },
  {
    baseTime: 8,
    baseAmount: 19,
    next: 3450,
    priceTime: 500,
    priceAmount: 400,
    priceAmountTime: 250,
  },
  {
    baseTime: 15,
    baseAmount: 28,
    next: 10350,
    priceTime: 1500,
    priceAmount: 1200,
    priceAmountTime: 750,
  },
  {
    baseTime: 30,
    baseAmount: 37,
    next: 31050,
    priceTime: 4500,
    priceAmount: 3600,
    priceAmountTime: 2250,
  },
  {
    baseTime: 60,
    baseAmount: 46,
    next: 93150,
    priceTime: 13500,
    priceAmount: 10800,
    priceAmountTime: 6750,
  },
  {
    baseTime: 120,
    baseAmount: 55,
    next: 279450,
    priceTime: 40500,
    priceAmount: 32400,
    priceAmountTime: 20250,
  },
  {
    baseTime: 240,
    baseAmount: 64,
    next: 838350,
    priceTime: 121500,
    priceAmount: 97200,
    priceAmountTime: 60750,
  },
  {
    baseTime: 480,
    baseAmount: 73,
    next: 1676700,
    priceTime: 243000,
    priceAmount: 194400,
    priceAmountTime: 121500,
  },
  {
    baseTime: 960,
    baseAmount: 82,
    next: 2850390,
    priceTime: 413100,
    priceAmount: 330480,
    priceAmountTime: 206550,
  },
  {
    baseTime: 1440,
    baseAmount: 91,
    next: 4275585,
    priceTime: 619650,
    priceAmount: 495720,
    priceAmountTime: 309825,
  },
] as const

export const taskStatus = {
  start: 0,
  loading: 1,
  check: 2,
  claim: 3,
  done: 4,
} as const

export const TASK_CTX = 'task'
export const SECOND = 1000
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24
