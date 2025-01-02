import crypto from 'crypto'
import { Request, Response } from 'express'

import type { CreateUser, Inviter, UserForDb } from '../database.types'
import { bot, token } from './config'
import { createInvite, createUser, getInviter, getUser, updateInvites } from './db'

// interface GenericError {
//   message: string
//   stack: string
//   name: string
//   statusCode?: number
// }

/* interface ClientError {
  message: string
  component: string
  info: string
  userAgent: string
  stack?: string
}

function escapeMarkdown(text: string) {
  return text.replace(/([._*[\]()~`>#+\-=|{}!?\\])/g, '\\$1')
}

async function handleErrorLog(err: ClientError | GenericError) {
  if (!process.env.VITE_ADMIN_CHAT_ID) return

  const errorMessage = `
      ${'info' in err ? '*Vuejs Error Report*' : '*Generic Error Report*'}
      *Message:* ${err.message}
      ${'name' in err ? `*Name:* ${err.name}\n` : ''}
      ${'hint' in err ? `*Hint:* ${err.hint}\n` : ''}
      ${'details' in err ? `*Details:* ${err.details}\n` : ''}
      ${'component' in err ? `*Component:* ${err.component}\n` : ''}
      ${'statusCode' in err ? `*Status Code:* ${err.statusCode}\n` : ''}
      ${'info' in err ? `*Info:* ${err.info}\n` : ''}  
      *Stack Trace:*\`\`\`
      ${err.stack || 'No stack trace available'}
      \`\`\`
    `.trim()

  await bot.telegram.sendMessage(process.env.VITE_ADMIN_CHAT_ID, escapeMarkdown(errorMessage), {
    parse_mode: 'MarkdownV2',
  })
} */

function validateTgWebAppData(params: URLSearchParams) {
  const hash = params.get('hash')
  params.delete('hash')

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(token).digest()

  const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

  return calculatedHash === hash
}

export async function meHandler(req: Request, res: Response) {
  try {
    const initData: string | undefined = req.body.initData

    if (!initData) {
      return res.status(400).json({ valid: false, error: 'telegram_error' })
    }

    const params = new URLSearchParams(initData)
    // const isValid = validateTgWebAppData(params)

    // if (!isValid) return res.status(200).json({ valid: false, error: 'data_error' })

    // const authDate = params.get('auth_date')
    // const currentTimestamp = Math.floor(Date.now() / 1000)
    // const MAX_AGE = 3600

    // if (authDate && currentTimestamp - parseInt(authDate) > MAX_AGE) {
    //   return res.status(200).json({ valid: false, error: 'outdated_error' })
    // }

    const userData: UserForDb = JSON.parse(params.get('user') || '{}')

    if (!userData.id) return res.status(500).json({ error: 'inner_error' })

    const { data, error } = await getUser(userData.id)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    if (data) {
      return res.status(200).json({ valid: true, userData: data })
    }

    const startParam = params.get('start_param')
    const userForSb: CreateUser = Object.assign(
      {},
      {
        tgId: String(userData.id),
        firstName: userData.first_name,
        // invitedBy: null,
        ...(userData.language_code && { language: userData.language_code }),
        ...(userData.username && { username: userData.username }),
      },
    )
    let inviter: Inviter | undefined = undefined

    if (startParam) {
      const parsed = parseInt(startParam, 10)
      const isNumber = !isNaN(parsed) && String(parsed) === startParam
      const { data: inviterData } = await getInviter(isNumber ? parsed : startParam.trim(), isNumber)
      inviter = inviterData
    }

    const inviterId = inviter?.id ?? null
    if (inviterId) {
      userForSb.invitedById = inviterId
    }
    const { data: createdData, error: createdError } = await createUser(userForSb)

    if (createdError || !createdData) {
      return res.status(500).json({
        valid: false,
        error: createdError ? createdError.message : 'create_error',
      })
    }

    if (inviterId) {
      await Promise.all([
        updateInvites(inviterId),
        createInvite(inviterId, createdData.id),
        // sendToUser(inviterId, {
        //   firstName: createdData.first_name,
        //   username: createdData.username,
        //   depth: 1,
        // }),
      ])
    }

    return res.status(200).json({ valid: true, userData: createdData })
  } catch (_err) {
    console.log('me135', _err)
    // Bugsnag.notify(<GenericError>err)
    return res.status(500).json({ error: 'inner_error' })
  }
}
