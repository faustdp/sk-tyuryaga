import data from '@/messages.json'

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
} as const

export const IMG_INDEXES: Record<BoostValue, BonusIndexes[]> = {
  [TIME]: [5, 6, 7],
  [AMOUNT]: [1, 3, 4],
  [COMBO]: [0, 2, 8],
} as const

export const IMG_NAMES: Images[] = [
  {
    type: COMBO,
    idx: 0,
    name: data.images_1,
    desc: data.images_desc,
    class: 'img-1',
    width: '90',
  },
  {
    type: AMOUNT,
    idx: 1,
    name: data.images_2,
    desc: data.images_desc,
    class: 'img-2',
    width: '85',
  },
  {
    type: COMBO,
    idx: 2,
    name: data.images_3,
    desc: data.images_desc,
    class: 'img-3 trans-z-40',
    width: '80',
  },
  {
    type: AMOUNT,
    idx: 3,
    name: data.images_4,
    desc: data.images_desc,
    class: 'img-4',
    width: '110',
  },
  {
    type: AMOUNT,
    idx: 4,
    name: data.images_5,
    desc: data.images_desc,
    class: 'img-5 z-20',
    width: '100',
  },
  {
    type: TIME,
    idx: 5,
    name: data.images_6,
    desc: data.images_desc,
    class: 'img-6',
    width: '100',
  },
  {
    type: TIME,
    idx: 6,
    name: data.images_7,
    desc: data.images_desc,
    class: 'img-7',
    width: '90',
  },
  {
    type: TIME,
    idx: 7,
    name: data.images_8,
    desc: data.images_desc,
    class: 'img-8',
    width: '60',
  },
  {
    type: COMBO,
    idx: 8,
    name: data.images_9,
    desc: data.images_desc,
    class: 'img-9 trans-z-40',
    width: '60',
  },
] as const

// export const baseTime = 2
// export const baseAmount = 1

// export const russianLanguages = ['ru', 'be', 'uk', 'kk', 'ky', 'uz', 'tg', 'tk', 'hy', 'az', 'ka', 'lv', 'lt', 'et']

interface LevelsType {
  [AMOUNT]: number
  [COMBO]: number
  [TIME]: number
  baseTime: number
  baseAmount: number
  tasks?: number
  invites?: number
  streak?: number
}

export const LEVELS: LevelsType[] = [
  {
    baseTime: 2,
    baseAmount: 1,
    // next: 69,
    [AMOUNT]: 10,
    [COMBO]: 8,
    [TIME]: 5,
    streak: 10,
  },
  {
    baseTime: 4,
    baseAmount: 10,
    // next: 690,
    [AMOUNT]: 100,
    [COMBO]: 80,
    [TIME]: 50,
    tasks: 3,
    invites: 2,
  },
  {
    baseTime: 8,
    baseAmount: 19,
    // next: 3450,
    [AMOUNT]: 500,
    [COMBO]: 400,
    [TIME]: 250,
  },
  {
    baseTime: 15,
    baseAmount: 28,
    // next: 10350,
    [AMOUNT]: 1500,
    [COMBO]: 1200,
    [TIME]: 750,
  },
  {
    baseTime: 30,
    baseAmount: 37,
    // next: 31050,
    [AMOUNT]: 4500,
    [COMBO]: 3600,
    [TIME]: 2250,
  },
  {
    baseTime: 60,
    baseAmount: 46,
    // next: 93150,
    [AMOUNT]: 13500,
    [COMBO]: 10800,
    [TIME]: 6750,
  },
  {
    baseTime: 120,
    baseAmount: 55,
    // next: 279450,
    [AMOUNT]: 40500,
    [COMBO]: 32400,
    [TIME]: 20250,
  },
  {
    baseTime: 240,
    baseAmount: 64,
    // next: 838350,
    [AMOUNT]: 121500,
    [COMBO]: 97200,
    [TIME]: 60750,
  },
  {
    baseTime: 480,
    baseAmount: 73,
    // next: 1676700,
    [AMOUNT]: 243000,
    [COMBO]: 194400,
    [TIME]: 121500,
  },
  {
    baseTime: 960,
    baseAmount: 82,
    // next: 2850390,
    [AMOUNT]: 413100,
    [COMBO]: 330480,
    [TIME]: 206550,
  },
  // {
  //   baseTime: 1440,
  //   baseAmount: 91,
  //   next: 4275585,
  //   [AMOUNT]: 619650,
  //   [COMBO]: 495720,
  //   [TIME]: 309825,
  // },
] as const

export const taskStatus = {
  start: 0,
  loading: 1,
  check: 2,
  claim: 3,
  done: 4,
} as const

export const TASK_INVITE = 'invite'
export const TASK_CODE = 'code'
export const TASK_SUBSCRIBE = 'subscribe'
export const TASK_CTX = 'task_ctx'
export const SECOND = 1000
export const SIXTY = 60
export const MINUTE = SECOND * SIXTY
export const HOUR = MINUTE * SIXTY
export const DAY = HOUR * 24
