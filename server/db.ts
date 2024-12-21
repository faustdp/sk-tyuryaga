import { eq, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'

import type { CreateUser, GetUser, Inviters } from '../database.types'
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
      RETURNING tg_id, activity_days, username, first_name, invites
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
    const data = await db.insert(users).values(insertUser).returning({
      tg_id: users.tgId,
      first_name: users.firstName,
      language: users.language,
    })
    return { data: data[0] }
  } catch (err) {
    return { error: err as Error }
  }
}

async function getInviters(id: number | string, isId: boolean) {
  try {
    const res = await db.execute(sql`WITH RECURSIVE inviter_chain AS (
        SELECT tg_id, username, first_name, invited_by, 1 AS level
        FROM users
        WHERE ${isId ? sql`tg_id` : sql`username`} = ${id}
        UNION ALL
        SELECT u.tg_id, u.username, u.first_name, u.invited_by, ic.level + 1
        FROM users u
        JOIN inviter_chain ic ON u.tg_id = ic.invited_by
        WHERE ic.level < 3 AND ic.invited_by IS NOT NULL
      )
      SELECT * FROM inviter_chain
      ORDER BY level;
    `)
    const data = res.rows as unknown as Inviters[]
    data.forEach((row) => {
      row.tg_id = Number(row.tg_id)
    })
    return { data }
  } catch (err) {
    return { error: err as Error }
  }
}

export { getUser, createUser, getInviters }
