import { type Request, type Response } from 'express'
import { InlineKeyboard } from 'grammy'
import { type Message, type Update } from 'grammy/types'

import { bot, Bugsnag, handleBotStart } from './config' //Bugsnag

async function handleMessage(msg: Message) {
  if (!msg.text) return
  const text = msg.text
  if (!text.startsWith('/')) return
  const [command, _ref] = text.slice(1).split(' ')
  const chatId = msg.chat.id
  const { first_name } = msg.from ?? {}
  try {
    switch (command) {
      case 'start':
        await handleBotStart(chatId, first_name)
        break
      case 'community':
        await bot.api.sendMessage(chatId, 'Залетай в хату', {
          reply_markup: new InlineKeyboard().url('ТГ группа', 'https://t.me/PrisonTONx'),
        })
        break
    }
  } catch (error) {
    console.error('Error from Telegram bot sending message to user ', error)
  }
}

export default async function (req: Request, res: Response) {
  // const ph = await bot.telegram.getUserProfilePhotos(req.body.message.chat.id)
  // console.log('bot49', ph.photos[0][0]?.file_unique_id, req.body.message)
  try {
    const update: Update = req.body
    // console.log('bot36', update)
    // await bot.handleUpdate(update) if you need to invoke bot.on('callback_query') etc, => update.callback_query={from={},message={}},data='help_command'
    if ('message' in update) {
      await handleMessage(update.message as Message)
    }

    return res.status(200).json({ message: 'OK' })
  } catch (err) {
    Bugsnag.notify(<Error>err)
    return res.status(500).json({ error: 'Внутрення ошибка' })
  }
}
