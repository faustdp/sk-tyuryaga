import { eq, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'

import type { CreateUser, GetUser, Inviters, UpdateInvites } from '../database.types'
import * as schema from '../drizzle/schema'
import { dbUrl } from './config'

const { users } = schema

let db = drizzle(dbUrl, { schema })

db.$client.on('error', (err: Error & { code?: string }) => {
  console.error('Unexpected error on idle client', err)
  if (['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT'].includes(err.code || '')) {
    handleRetry(5)
  } else {
    process.exit(1)
  }
})

function handleRetry(retryCount: number): void {
  if (retryCount < 5) {
    const delay = Math.pow(2, retryCount) * 1000
    console.log(`Retrying to connect in ${delay / 1000} seconds...`)
    setTimeout(() => {
      db = drizzle(dbUrl, { schema })
    }, delay)
  } else {
    console.error('Max retries reached. Exiting...')
    process.exit(1)
  }
}

async function getUser(id: number) {
  try {
    const res = await db.execute(sql`
      UPDATE ${users}
      SET
        activity_days = CASE 
          WHEN last_visit >= CURRENT_DATE AND last_visit < CURRENT_DATE + INTERVAL '1 day' 
          THEN 0
          WHEN last_visit >= CURRENT_DATE - INTERVAL '1 day' AND last_visit < CURRENT_DATE 
          THEN activity_days + 1
          ELSE 0
        END,
        last_visit = NOW()
      WHERE ${eq(users.tgId, id)}
      RETURNING tg_id, activity_days, username, first_name, invites, level, bonuses, end_time, ref_cigs, farm_cigs, language, farm, farmed_amount, address
    `)
    const data = res?.rows?.[0] as unknown as GetUser
    if (data?.tg_id) {
      data.tg_id = Number(data.tg_id)
    }
    return { data }
  } catch (err) {
    return { error: err as Error }
  }
}

async function createUser(insertUser: CreateUser) {
  try {
    const [data] = await db.insert(users).values(insertUser).returning({
      tg_id: users.tgId,
      first_name: users.firstName,
      language: users.language,
      username: users.username,
      activity_days: users.activityDays,
      invites: users.invites,
      level: users.level,
      bonuses: users.bonuses,
      end_time: users.endTime,
      ref_cigs: users.refCigs,
      farm_cigs: users.farmCigs,
      farm: users.farm,
    })
    return { data }
  } catch (error) {
    return { error }
  }
}

async function getInviters(id: number | string, isId: boolean) {
  try {
    const res = await db.execute(sql`
      SELECT tg_id, username, first_name, invited_by
      FROM users
      WHERE ${isId ? sql`tg_id` : sql`username`} = ${id};
    `)
    const data = res.rows[0] as unknown as Inviters
    if (data) {
      data.tg_id = Number(data.tg_id)
    }
    return { data }
  } catch (err) {
    return { error: err as Error }
  }
}

async function updateInvites(id: number) {
  try {
    const result = await db.execute(sql`
      SELECT * FROM update_invites(${id})
    `)
    return { data: result.rows as unknown as UpdateInvites[] }
  } catch (err) {
    return { error: err as Error }
  }
}

async function createInvite(inviter: number | string, invitee: number | string) {
  try {
    const query = sql`
      INSERT INTO invites (inviter, invitee)
      VALUES (${inviter}, ${invitee})
    `
    await db.execute(query)
    return {}
  } catch (err) {
    return { error: err as Error }
  }
}

async function setTime(id: number, time: string, cigs: number) {
  try {
    const data = await db
      .update(users)
      .set({
        endTime: time,
        farmedAmount: cigs,
        farm: 'farming',
      })
      .where(eq(users.tgId, id))
    return { data }
  } catch (error) {
    return { error }
  }
}

async function farmCigs(id: number, cigs: number) {
  try {
    const data = await db
      .update(users)
      .set({
        farmCigs: sql`${users.farmCigs} + ${cigs}`,
        farm: 'claimed',
      })
      .where(eq(users.tgId, id))
    return { data }
  } catch (error) {
    return { error }
  }
}

// async function farmedCigs(id: number, cigs: number) {
//   try {
//     const data = await db
//       .update(users)
//       .set({
//         farmedAmount: cigs,
//         farm: 'farmed',
//       })
//       .where(eq(users.tgId, id))
//     return { data }
//   } catch (error) {
//     return { error }
//   }
// }

export { getUser, createUser, getInviters, updateInvites, createInvite, setTime, farmCigs }
