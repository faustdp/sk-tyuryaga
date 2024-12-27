import type { Request, Response } from 'express'

import { DbTaskStatus } from '../database.types'
import { bot } from './config'
import {
  addBonus,
  checkCode,
  claimFriends,
  farmCigs,
  getFriendsList,
  selectImage,
  setAddress,
  setTime,
  taskStatus,
} from './db'

export async function setEndTime(req: Request, res: Response) {
  try {
    const { id, time, cigs } = req.body
    await setTime(id, time, cigs)
    return res.status(200).json({ message: 'OK' })
  } catch {
    // Bugsnag.notify(<Error>err)
    return res.status(500).json({ error: 'inner_error' })
  }
}

export async function setFarmCigs(req: Request, res: Response) {
  try {
    await farmCigs(req.body.id, req.body.cigs)
    return res.status(200).json({ message: 'OK' })
  } catch {
    // Bugsnag.notify(<Error>err)
    return res.status(500).json({ error: 'inner_error' })
  }
}

export async function setAddBonus(req: Request, res: Response) {
  try {
    const { cigs, id, level, index } = req.body
    await addBonus({ cigs, id, level, index })
    return res.status(200).json({ message: 'OK' })
  } catch {
    // Bugsnag.notify(<Error>err)
    return res.status(500).json({ error: 'inner_error' })
  }
}

export async function setClaimFriends(req: Request, res: Response) {
  try {
    const { id, time } = req.body
    await claimFriends(id, time)
    return res.status(200).json({ message: 'OK' })
  } catch {
    // Bugsnag.notify(<Error>err)
    return res.status(500).json({ error: 'inner_error' })
  }
}

export async function setSelectImage(req: Request, res: Response) {
  try {
    const { id, index, image }: { id: number; index: number; image: number } = req.body
    await selectImage(id, index, image)
    return res.status(200).json({ message: 'OK' })
  } catch {
    // Bugsnag.notify(<Error>err)
    return res.status(500).json({ error: 'inner_error' })
  }
}

export async function handleSetAddress(req: Request, res: Response) {
  const { id, address }: { id: number; address: string } = req.body
  const result = await setAddress(id, address)
  if (typeof result === 'object' && result.error) return res.status(500).json({ error: 'inner_error' })
  return res.status(200).json({ success: result })
}

export async function handleCheckSubscription(req: Request, res: Response) {
  try {
    const { id, name }: { id: number; name: string } = req.body
    const result = await bot.api.getChatMember(name, id)
    const isOk =
      result && (result.status === 'member' || result.status === 'creator' || result.status === 'administrator')
    return res.status(200).json({ ok: isOk })
  } catch (error) {
    // Bugsnag.notify(<Error>err)
    console.log('handlers83', error)
    return res.status(500).json({ error: 'inner_error' })
  }
}

export async function handleCheckCode(req: Request, res: Response) {
  try {
    const { id, task, code }: { id: number; task: number; code: string } = req.body
    const result = await checkCode(id, task, code)
    return res.status(200).json({ ok: result.ok, done: result.done })
  } catch (err) {
    console.log('handlers65', err)
    // Bugsnag.notify(<Error>err)
    return res.status(500).json({ error: 'inner_error' })
  }
}

export async function handleTaskStatus(req: Request, res: Response) {
  const { id, task, status }: { id: number; task: number; status: DbTaskStatus } = req.body
  const result = await taskStatus(id, task, status)
  if (result.error) return res.status(500).json({ error: 'inner_error' })
  return res.status(200).json({ ok: result })
}

export async function handleGetFriends(req: Request, res: Response) {
  const { id }: { id: number } = req.body
  const result = await getFriendsList(id)
  if ('error' in result) return res.status(500).json({ error: 'inner_error' })
  return res.status(200).json({ data: result })
}
