import { and, eq, isNotNull, ne, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'

import type { CreateUser, DbTaskStatus, FriendsUser, GetUser, Inviter, UpdateInvites } from '../database.types'
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
      WHERE ${eq(users.tgId, String(id))}
      RETURNING id, tg_id, activity_days, username, first_name, invites, level, bonuses, end_time, ref_cigs, farm_cigs, language, farmed_amount, farmed_time, selected_images, claim_friends
    `)
    const data = res?.rows?.[0] as unknown as GetUser
    // if (data?.tg_id) {
    //   data.tg_id = Number(data.tg_id)
    // }
    return { data }
  } catch (err) {
    return { error: err as Error }
  }
}

async function createUser(insertUser: CreateUser) {
  try {
    const [data] = await db.insert(users).values(insertUser).returning({
      id: users.id,
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
      SELECT id, tg_id, username, first_name, invited_by_id
      FROM users
      WHERE ${isId ? sql`tg_id` : sql`username`} = ${id};
    `)
    const data = res.rows[0] as unknown as Inviter
    // if (data) {
    //   data.tg_id = Number(data.tg_id)
    // }
    return { data }
  } catch (err) {
    return { error: err as Error }
  }
}

async function updateInvites(id: number) {
  try {
    const result = await db
      .update(users)
      .set({
        invites: sql`${users.invites} + 1`,
      })
      .where(eq(users.id, id))
      .returning({
        invites: users.invites,
        invited_by_id: users.invitedById,
        tg_id: users.tgId,
      })
    return { data: result[0] as UpdateInvites }
  } catch (err) {
    return { error: err as Error }
  }
}

async function createInvite(inviter: number | string, invitee: number | string) {
  try {
    const query = sql`
      INSERT INTO invites (inviter_id, invitee_id)
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
        farmedAmount: String(cigs),
        farmedTime: String(farmedTime),
      })
      .where(eq(users.id, id))
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
        farmedAmount: String(0),
        farmedTime: String(0),
      })
      .where(and(eq(users.id, id), isNotNull(users.endTime), ne(users.farmedAmount, String(0))))
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
        bonuses:
          index != null
            ? sql`CASE 
          WHEN EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(COALESCE(${users.bonuses}::jsonb, '[]'::jsonb))
            WHERE value::integer = ${index}::integer
          ) THEN COALESCE(${users.bonuses}::jsonb, '[]'::jsonb)
          ELSE COALESCE(${users.bonuses}::jsonb, '[]'::jsonb) || to_jsonb(${index}::integer)
        END`
            : sql`'[]'::jsonb`,
        ...(level ? { level: String(level) } : {}),
      })
      .where(eq(users.id, id))
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
      .where(eq(users.id, id))
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
      WHERE id = ${id}
  `)
    return { data }
  } catch (error) {
    return { error }
  }
}

async function setAddress(id: number, address: string) {
  try {
    const data = await db.execute(sql`WITH upsert AS (
      INSERT INTO wallets (address, user_id_id)
      VALUES (${address}, ${id})
      ON CONFLICT (address) DO
        UPDATE SET last_connect = now()
        WHERE wallets.user_id_id = ${id}
        AND wallets.address = ${address}
      RETURNING *
    ),
    validation AS (
      SELECT CASE 
        WHEN NOT EXISTS (SELECT 1 FROM upsert) 
          AND EXISTS (SELECT 1 FROM wallets WHERE address = ${address})
        THEN (SELECT wallets.user_id_id FROM wallets WHERE address = ${address})
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
    return { data: data.rows[0].result !== null }
  } catch (error) {
    return { error }
  }
}

async function getFriendsList(id: number) {
  try {
    const data = await db.execute(sql`
      WITH RECURSIVE invite_tree AS (
        SELECT id, tg_id, first_name, farm_cigs, ref_cigs, invited_by_id, 1 AS depth
        FROM users
        WHERE invited_by_id = ${id}
        UNION ALL     
        SELECT u.id, u.tg_id, u.first_name, u.farm_cigs, u.ref_cigs, u.invited_by_id, it.depth + 1
        FROM users u
        JOIN invite_tree it ON u.invited_by_id = it.id
        WHERE it.depth < 3
      )
      SELECT * FROM invite_tree
      ORDER BY depth, first_name;
    `)
    const inviteTree: FriendsUser[] = []
    const userMap = new Map<number, FriendsUser>()
    data.rows.forEach((user: any) => {
      const { id, tg_id, first_name, farm_cigs, ref_cigs, invited_by_id, depth } = user
      if (depth === 1) {
        const directInvitee: FriendsUser = { id, tg_id, first_name, farm_cigs, ref_cigs, depth, invitees: [] }
        inviteTree.push(directInvitee)
        userMap.set(id, directInvitee)
      } else {
        const invitee: FriendsUser = { id, tg_id, first_name, farm_cigs, ref_cigs, depth }
        const inviter = userMap.get(invited_by_id)
        if (inviter) {
          inviter.invitees = inviter.invitees || []
          inviter.invitees.push(invitee)
        }
      }
    })
    return { data: inviteTree }
  } catch (error) {
    return { error }
  }
}

/* function parseCodeResponse(result: string): boolean {
  const [codesAmount, codesString] = result.slice(1, -1).split(',')
  const amount = parseInt(codesAmount, 10)
  const codes = codesString
    .slice(1, -1)
    .split(',')
    .map((code) => code.trim().replace(/"/g, ''))
  return codes.length >= amount
} */
function parseCodeResponse(result: { codes_amount: string; codes: string[] }): boolean {
  if (!result.codes_amount || !result.codes) {
    return false
  }
  const codes = Array.isArray(result.codes) ? result.codes : JSON.parse(result.codes)
  return codes.length >= Number(result.codes_amount)
}

/* const data = await db.execute(sql`
      SELECT check_and_update_code(${id}, ${task}, ${code})
    `) */
async function checkCode(id: number, task: number, code: string) {
  try {
    const data = await db.execute(sql`
      WITH code_check AS (
        SELECT EXISTS (
          SELECT 1
          FROM tasks
          WHERE id = ${task}::int AND ${code}::text = ANY(ARRAY(
            SELECT jsonb_array_elements_text(codes)
          ))
        ) AS code_exists
      ),
      current_codes AS (
        SELECT codes, codes_amount
        FROM user_tasks
        WHERE user_id_id = ${id}::int AND task_id_id = ${task}::int
      ),
      update_codes AS (
        UPDATE user_tasks
        SET 
          codes = CASE 
            WHEN (SELECT code_exists FROM code_check) THEN
              CASE
                WHEN codes IS NULL THEN jsonb_build_array(${code}::text)
                WHEN NOT (${code}::text IN (SELECT jsonb_array_elements_text(codes))) 
                THEN codes || jsonb_build_array(${code}::text)
                ELSE codes
              END
            ELSE codes
          END
        WHERE user_id_id = ${id}::int AND task_id_id = ${task}::int
        RETURNING codes_amount, codes
      )
      SELECT
        CASE
          WHEN (SELECT code_exists FROM code_check) THEN
            COALESCE(
              (SELECT codes_amount FROM update_codes),
              (SELECT codes_amount FROM current_codes)
            )
          ELSE NULL
        END AS codes_amount,
        CASE
          WHEN (SELECT code_exists FROM code_check) THEN
            COALESCE(
              (SELECT codes FROM update_codes),
              (SELECT codes FROM current_codes)
            )
          ELSE NULL
        END AS codes
    `)
    console.log('db251', data, data.rows[0]?.codes)
    const isOk = data.rows.length > 0 && data.rows[0].codes_amount !== null
    const isDone = isOk
      ? parseCodeResponse(
          data.rows[0] as { codes_amount: string; codes: string[] },
        ) /* parseCodeResponse(data.rows[0].check_and_update_code as string) */
      : false
    console.log('db365', isOk, isDone)
    return {
      ok: isOk,
      done: isDone,
    }
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
      .where(and(eq(userTasks.userIdId, id), eq(userTasks.taskIdId, task)))
    console.log('db267', data)
    return { data }
  } catch (error) {
    console.log('db270', error)
    return { error }
  }
}

//TODO FETCH AND CREATE USER_TASKS

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
