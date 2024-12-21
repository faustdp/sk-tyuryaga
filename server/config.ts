import 'dotenv/config'

// import Bugsnag from '@bugsnag/js'
// import BugsnagPluginExpress from '@bugsnag/plugin-express'
// import crypto from 'crypto'
// import type { ErrorRequestHandler, RequestHandler } from 'express'
import { Bot } from 'grammy'
// import { type FilteredContext } from "grammy/types";
// import type { WebSocket } from 'ws'

export const sitePort = Number(process.env.PUBLIC_SITE_PORT) || 8828 // 5773 front
export const apiPath = '/api'
export const mePath = '/me'
export const healthPath = '/health'
export const endTimePath = '/end-time'
export const farmCigsPath = '/farm-cigs'
// export const farmedCigsPath = '/farmed-cigs'
export const botPath = '/bot'

export const token = process.env.BOT_TOKEN!
export const secretToken = process.env.SETUP_SECRET
export const siteUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.PUBLIC_SITE_URL
    : `http://localhost:${process.env.PUBLIC_SITE_PORT}`

// export const redisUrl =
//   process.env.REDIS_URL ||
//   `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
export const dbUrl =
  process.env.DATABASE_URL ||
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`
// export const mimeTypes = {
//   js: 'application/javascript; charset=UTF-8',
//   css: 'text/css',
//   html: 'text/html',
//   svg: 'image/svg+xml',
// }
// export const sources = {
//   self: "'self'",
//   tg: 'https://telegram.org',
//   tag: 'https://www.googletagmanager.com',
//   anal: 'https://www.google-analytics.com',
//   analeu: 'https://region1.google-analytics.com',
//   ya: 'https://mc.yandex.ru',
//   yaeu: 'https://mc.yandex.com',
//   inline: "'unsafe-inline'",
//   font: 'https://fonts.googleapis.com/',
//   data: 'data:',
//   bug1: 'https://sessions.bugsnag.com',
//   bug2: 'https://otlp.bugsnag.com',
//   bug3: 'https://notify.bugsnag.com',
// }
// export const serverId = crypto.randomBytes(10).toString('hex')
// export const PUBSUB_CHANNEL = 'websocket_broadcast'
// export const localConnections: Map<string, WebSocket> = new Map()

export const w8 = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const bot = new Bot(token)

export async function setupBot() {
  if (!token) {
    console.error('Bot token not found in environment variables')
    process.exit(1)
  }

  bot.on('message', async (ctx) => {
    console.log('config98', ctx.update.message.from)
    try {
      handleBotStart(ctx.update.message.from.id)
    } catch (error) {
      console.log(error)
    }
  })

  if (!bot.isRunning()) {
    bot.start()
  }
  // try {
  //   // await bot.telegram.deleteWebhook({ drop_pending_updates: true })
  //   const webhook = await bot.telegram.getWebhookInfo()
  //   if (webhook.url !== '' && webhook.url === `${siteUrl}${apiPath}${botPath}`) return

  //   await bot.launch({
  //     webhook: {
  //       domain: siteUrl,
  //       path: `${apiPath}${botPath}`,
  //       secretToken,
  //     },
  //   })
  // } catch (err) {
  //   console.error('Error setting Telegram Bot WebHook:', err)
  // }
}

// export function escapeMarkdown(text: string) {
//   return text.replace(/([.[\]()~`>#+\-=|{}!?\\])/g, '\\$1')
// }

export async function handleBotStart(chatId: string | number, _firstName?: string) {
  //   const photoUrl = 'https://imgur.com/a/HYJ1vDX'
  //   const inlineKeyboard = [
  //     [
  //       {
  //         text: 'Запустить игру',
  //         web_app: {
  //           url: siteUrl,
  //         },
  //       },
  //     ],
  //     [
  //       {
  //         text: 'Залетай в хату',
  //         url: 'https://t.me/PrisonTONx',
  //       },
  //     ],
  //   ]
  //   let caption = escapeMarkdown(
  //     `Эй, браток! Ты в "Тюряге", а тут мы по понятиям живем. Делись реферальной малявой и поднимай свой статус. Скоро тут начнется реальный кипиш с NFT и прочей делюгой. Не тупи, начинай двигаться!`,
  //   )

  //   if (firstName) {
  //     caption = caption.replace('браток', `браток, ${firstName.replace(/([_.!{}|\-()+~*>[\]#=`])/g, '\\$1')}`)
  //   }

  //   return bot.telegram.sendPhoto(chatId, photoUrl, {
  //     caption,
  //     reply_markup: { inline_keyboard: inlineKeyboard },
  //     parse_mode: 'MarkdownV2',
  //   })
  return bot.api.sendMessage(chatId, 'Hi') //5416188878
}

// export async function handleLevelUp(chatId: number, level: number) {
//   const msg =
//     level === 10
//       ? `Вот и по масти тебя короновали, братан! 👑\n\nТеперь ты в полном авторитете, держись ровно. Отметка пройдена — жди движуху, свои приколы скоро подъедут. Ты сделал своё дело, теперь все на тебя смотрят.🖤\n\nПродолжай гнуть свою линию, жизнь по понятиям только начинается.`
//       : `Твой персонаж достиг ${level}-го уровня!\n\nКентов подтянул - уважение в хате повысил.\nТеперь ты на шаг ближе к воровскому. Продолжай двигаться дальше по ровней дороге!\nИ кентов поблагодари - кто поддержал, они с тобой будут до талого!`
//   return bot.telegram.sendMessage(chatId, msg)
// }

// Bugsnag.start({
//   apiKey: process.env.BUGSNAG_KEY_NODE || '',
//   plugins: [BugsnagPluginExpress],
//   autoTrackSessions: false,
//   logger: null,
// })

// interface BugsnagPluginExpressResult {
//   errorHandler: ErrorRequestHandler
//   requestHandler: RequestHandler
//   runInContext: RequestHandler
// }

// const bugSnagMiddleware = Bugsnag.getPlugin('express') as BugsnagPluginExpressResult

// export { Bugsnag, bugSnagMiddleware }
