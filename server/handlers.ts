import type { Request, Response } from 'express'

import { farmCigs, setTime } from './db'

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

// export async function setFarmedCigs(req: Request, res: Response) {
//   try {
//     await farmedCigs(req.body.id, req.body.cigs)
//     return res.status(200).json({ message: 'OK' })
//   } catch {
//     // Bugsnag.notify(<Error>err)
//     return res.status(500).json({ error: 'inner_error' })
//   }
// }
