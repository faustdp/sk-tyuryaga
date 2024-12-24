import { eq, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'

import type { CreateUser, GetUser, Inviter, UpdateInvites } from '../database.types'
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
      RETURNING tg_id, activity_days, username, first_name, invites, level, bonuses, end_time, ref_cigs, farm_cigs, language, farmed_amount, claim_friends, address
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
      farmed_amount: users.farmedAmount,
      claim_friends: users.claimFriends,
      address: users.address,
      // farm: users.farm,
    })
    return { data: data as GetUser }
  } catch (error) {
    return { error }
  }
}

async function getInviter(id: number | string, isId: boolean) {
  try {
    const res = await db.execute(sql`
      SELECT tg_id, username, first_name, invited_by
      FROM users
      WHERE ${isId ? sql`tg_id` : sql`username`} = ${id};
    `)
    const data = res.rows[0] as unknown as Inviter
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
    return { data: result.rows[0] as unknown as UpdateInvites }
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
        endTime: null,
        farmedAmount: 0,
      })
      .where(eq(users.tgId, id))
    return { data }
  } catch (error) {
    return { error }
  }
}

async function addBonus({ cigs, id, level, index }: { cigs: number; id: number; level?: number; index?: number }) {
  try {
    const data = await db
      .update(users)
      .set({
        farmCigs: sql`${users.farmCigs} + ${cigs}`,
        bonuses: index ? sql`array_append(${users.bonuses}, ${index})` : sql`'{}'::smallint[]`,
        ...(level ? { level } : {}),
      })
      .where(eq(users.tgId, id))
    return { data }
  } catch (error) {
    return { error }
  }
}

async function claimFriends(id: number, time: string) {
  try {
    const data = await db
      .update(users)
      .set({
        claimFriends: time,
      })
      .where(eq(users.tgId, id))
    return { data }
  } catch (error) {
    return { error }
  }
}

async function selectImage(id: number, index: number, image: number) {
  try {
    const data = await db.execute(sql`
      UPDATE users
      SET selected_images[${index}] = ${image}
      WHERE tg_id = ${id}
  `)
    console.log('db195', data)
    return { data }
  } catch (error) {
    return { error }
  }
}

async function getFriends(id: number) {
  try {
    const data = await db
      .update(users)
      .set({
        // farmedAmount: cigs,
      })
      .where(eq(users.tgId, id))
    return { data }
  } catch (error) {
    return { error }
  }
}

export {
  getUser,
  createUser,
  getInviter,
  updateInvites,
  createInvite,
  setTime,
  farmCigs,
  addBonus,
  claimFriends,
  selectImage,
}
