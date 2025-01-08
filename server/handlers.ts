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
  const { id, time, cigs, farmedTime } = req.body
  if (
    typeof id !== 'number' ||
    typeof cigs !== 'number' ||
    typeof time !== 'string' ||
    typeof farmedTime !== 'number'
  ) {
    return res.status(400).json({ error: 'data_error' })
  }
  const data = await setTime(id, time, cigs, farmedTime)
  if (data.error) {
    return res.status(500).json({ error: 'inner_error' })
  }
  return res.status(200).json({ message: 'OK' })
}

export async function setFarmCigs(req: Request, res: Response) {
  const { id, cigs, fromFarm } = req.body
  if (typeof id !== 'number' || typeof cigs !== 'number' || typeof fromFarm !== 'boolean') {
    return res.status(400).json({ error: 'data_error' })
  }
  const data = await farmCigs(id, cigs, fromFarm)
  if (data.error) {
    return res.status(500).json({ error: 'inner_error' })
  }
  return res.status(200).json({ message: 'OK' })
}

export async function setAddBonus(req: Request, res: Response) {
  const { cigs, id, level, index } = req.body
  if (typeof id !== 'number' || typeof cigs !== 'number') {
    return res.status(400).json({ error: 'data_error' })
  }
  const data = await addBonus({ cigs, id, level, index })
  if (data.error) {
    return res.status(500).json({ error: 'inner_error' })
  }
  return res.status(200).json({ message: 'OK' })
}

export async function setClaimFriends(req: Request, res: Response) {
  const { id, time, cigs } = req.body
  if (typeof id !== 'number' || typeof cigs !== 'number' || typeof time !== 'string') {
    return res.status(400).json({ error: 'data_error' })
  }
  const data = await claimFriends(id, time, cigs)
  if (data.error) {
    return res.status(500).json({ error: 'inner_error' })
  }
  return res.status(200).json({ message: 'OK' })
}

export async function setSelectImage(req: Request, res: Response) {
  const { id, index, image }: { id: number; index: number; image: number } = req.body
  if (typeof id !== 'number' || typeof index !== 'number' || typeof image !== 'number') {
    return res.status(400).json({ error: 'data_error' })
  }
  const data = await selectImage(id, index, image)
  if (data.error) {
    return res.status(500).json({ error: 'inner_error' })
  }
  return res.status(200).json({ message: 'OK' })
}

export async function handleSetAddress(req: Request, res: Response) {
  const { id, address }: { id: number; address: string } = req.body
  if (typeof id !== 'number' || typeof address !== 'string') {
    return res.status(400).json({ error: 'data_error' })
  }
  const data = await setAddress(id, address)
  if (data.error) return res.status(500).json({ error: 'inner_error' })
  return res.status(200).json({ success: data.data })
}

export async function handleCheckSubscription(req: Request, res: Response) {
  try {
    const { id, name }: { id: number; name: string } = req.body
    if (typeof id !== 'number' || typeof name !== 'string') {
      return res.status(400).json({ error: 'data_error' })
    }
    const result = await bot.api.getChatMember(name, id)
    const isOk =
      result && (result.status === 'member' || result.status === 'creator' || result.status === 'administrator')
    return res.status(200).json({ ok: isOk })
  } catch {
    return res.status(500).json({ error: 'inner_error' })
  }
}

export async function handleCheckCode(req: Request, res: Response) {
  const { id, task, code }: { id: number; task: number; code: string } = req.body
  if (typeof id !== 'number' || typeof task !== 'number' || typeof code !== 'string') {
    return res.status(400).json({ error: 'data_error' })
  }
  const data = await checkCode(id, task, code)
  if (data.error) {
    return res.status(500).json({ error: 'inner_error' })
  }
  return res.status(200).json({ ok: data.ok, done: data.done })
}

export async function handleTaskStatus(req: Request, res: Response) {
  const { id, task, status }: { id: number; task: number; status: DbTaskStatus } = req.body
  if (typeof id !== 'number' || typeof task !== 'number' || typeof status !== 'string') {
    return res.status(400).json({ error: 'data_error' })
  }
  const data = await taskStatus(id, task, status)
  if (data.error) return res.status(500).json({ error: 'inner_error' })
  return res.status(200).json({ ok: data.data })
}

export async function handleGetFriends(req: Request, res: Response) {
  const { id }: { id: number } = req.body
  if (typeof id !== 'number') return res.status(400).json({ error: 'data_error' })
  const data = await getFriendsList(id)
  if (data.error) {
    return res.status(500).json({ error: 'inner_error' })
  }
  return res.status(200).json({ data: data.data })
}
