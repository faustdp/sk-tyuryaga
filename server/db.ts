import { and, eq, sql } from 'drizzle-orm' //isNotNull, notEquals
import { drizzle } from 'drizzle-orm/node-postgres'

import type { CreateUser, DbTaskStatus, GetUser, Inviter, UpdateInvites } from '../database.types'
import * as schema from '../drizzle/schema'
import { dbUrl } from './config'

const { users, userTasks } = schema

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
      RETURNING tg_id, activity_days, username, first_name, invites, level, bonuses, end_time, ref_cigs, farm_cigs, language, farmed_amount, farmed_time, selected_images, claim_friends
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
      farmed_time: users.farmedTime,
      claim_friends: users.claimFriends,
      selected_images: users.selectedImages,
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

async function setTime(id: number, time: string, cigs: number, farmedTime: number) {
  try {
    const data = await db
      .update(users)
      .set({
        endTime: time,
        farmedAmount: cigs,
        farmedTime: farmedTime,
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
        farmedTime: 0,
      })
      .where(eq(users.tgId, id)) /* and(
        eq(users.tgId, id),
        isNotNull(users.endTime),
        notEquals(users.farmedAmount, 0)
      ) */
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

async function claimFriends(id: number, time: string, cigs: number) {
  try {
    const data = await db
      .update(users)
      .set({
        claimFriends: time,
        refCigs: sql`${users.refCigs} + ${cigs}`,
      })
      .where(eq(users.tgId, id))
    return { data }
  } catch (error) {
    return { error }
  }
}

async function selectImage(id: number, index: number, image: number) {
  try {
    await db.execute(sql`
      UPDATE users
      SET selected_images[${index + 1}] = ${image}
      WHERE tg_id = ${id}
  `)
  } catch (error) {
    console.log('db197', error)
    return { error }
  }
}

async function setAddress(id: number, address: string) {
  try {
    const data = await db.execute(sql`WITH upsert AS (
      INSERT INTO wallets (address, user_id)
      VALUES (${address}, ${id})
      ON CONFLICT (address) DO
        UPDATE SET last_connect = now()
        WHERE wallets.user_id = ${id}
        AND wallets.address = ${address}
      RETURNING *
    ),
    validation AS (
      SELECT CASE 
        WHEN NOT EXISTS (SELECT 1 FROM upsert) 
          AND EXISTS (SELECT 1 FROM wallets WHERE address = ${address})
        THEN (SELECT wallets.user_id FROM wallets WHERE address = ${address})
        ELSE NULL
      END AS conflicting_user_id
    )
    SELECT 
      CASE 
        WHEN conflicting_user_id IS NOT NULL 
        THEN NULL
        ELSE 'OK'
      END AS result,
      conflicting_user_id
    FROM validation;`)
    return data.rows[0].result !== null
  } catch (error) {
    return { error }
  }
}

interface FriendsUser {
  id: number
  tg_id: number
  first_name: string
  farm_cigs: number
  ref_cigs: number
  depth: number
  invitees?: FriendsUser[]
}

async function getFriendsList(id: number) {
  try {
    const data = await db.execute(sql`
      WITH RECURSIVE invite_tree AS (
        SELECT id, tg_id, first_name, farm_cigs, ref_cigs, invited_by, 1 AS depth
        FROM users
        WHERE invited_by = ${id}
        UNION ALL     
        SELECT u.id, u.tg_id, u.first_name, u.farm_cigs, u.ref_cigs, u.invited_by, it.depth + 1
        FROM users u
        JOIN invite_tree it ON u.invited_by = it.tg_id
        WHERE it.depth < 3
      )
      SELECT * FROM invite_tree
      ORDER BY depth, first_name;
    `)
    const inviteTree: FriendsUser[] = []
    const userMap = new Map<number, FriendsUser>()
    data.rows.forEach((user: any) => {
      const { id, tg_id, first_name, farm_cigs, ref_cigs, invited_by, depth } = user
      if (depth === 1) {
        const directInvitee: FriendsUser = { id, tg_id, first_name, farm_cigs, ref_cigs, depth, invitees: [] }
        inviteTree.push(directInvitee)
        userMap.set(tg_id, directInvitee)
      } else {
        const invitee: FriendsUser = { id, tg_id, first_name, farm_cigs, ref_cigs, depth }
        const inviter = userMap.get(invited_by)
        if (inviter) {
          inviter.invitees = inviter.invitees || []
          inviter.invitees.push(invitee)
        }
      }
    })
    return inviteTree
  } catch (error) {
    return { error }
  }
}

function parseCodeResponse(result: string): boolean {
  const [codesAmount, codesString] = result.slice(1, -1).split(',')
  const amount = parseInt(codesAmount, 10)
  const codes = codesString
    .slice(1, -1)
    .split(',')
    .map((code) => code.trim().replace(/"/g, ''))
  return codes.length >= amount
}

async function checkCode(id: number, task: number, code: string) {
  try {
    const data = await db.execute(sql`
      SELECT check_and_update_code(${id}, ${task}, ${code})
    `)
    console.log('db251', data)
    const isOk = data.rows.length > 0
    return { ok: isOk, done: isOk ? parseCodeResponse(data.rows[0].check_and_update_code as string) : false }
  } catch (error) {
    console.log('db197', error)
    return { error }
  }
}

async function taskStatus(id: number, task: number, status: DbTaskStatus) {
  try {
    const data = await db
      .update(userTasks)
      .set({
        status: status,
      })
      .where(and(eq(userTasks.userId, id), eq(userTasks.taskId, task)))
    console.log('db267', data)
    return { data }
  } catch (error) {
    console.log('db270', error)
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
  setAddress,
  checkCode,
  taskStatus,
  getFriendsList,
}
