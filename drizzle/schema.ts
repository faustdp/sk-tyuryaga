import { sql } from 'drizzle-orm'
import {
  bigint,
  boolean,
  check,
  foreignKey,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core'

export const taskStatus = pgEnum('task_status', ['start', 'check', 'claim', 'done'])

export const wallets = pgTable(
  'wallets',
  {
    id: integer().generatedByDefaultAsIdentity({
      name: 'wallets_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    address: varchar({ length: 50 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    lastConnect: timestamp('last_connect', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.tgId],
      name: 'wallets_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)

export const messages = pgTable('messages', {
  id: integer().generatedByDefaultAsIdentity({
    name: 'messages_id_seq',
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 1,
  }),
  text: text().notNull(),
  photoUrl: varchar('photo_url', { length: 1024 }),
  buttons: jsonb(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
})

export const users = pgTable(
  'users',
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: 'users_id_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    tgId: bigint('tg_id', { mode: 'number' }).notNull(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    username: varchar({ length: 32 }),
    address: varchar({ length: 55 }),
    language: varchar({ length: 5 }),
    farmedAmount: integer('farmed_amount').default(0),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    lastVisit: timestamp('last_visit', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    invitedBy: bigint('invited_by', { mode: 'number' }),
    invites: integer().default(0).notNull(),
    farmCigs: integer('farm_cigs').default(0).notNull(),
    refCigs: integer('ref_cigs').default(0).notNull(),
    endTime: timestamp('end_time', { withTimezone: true, mode: 'string' }),
    claimFriends: timestamp('claim_friends', { withTimezone: true, mode: 'string' })
      .default(sql`(now() + '24:00:00'::interval)`)
      .notNull(),
    activityDays: integer('activity_days').default(0).notNull(),
    bonuses: smallint().array().default([]),
    selectedImages: smallint('selected_images').array().default([]),
    level: integer().default(0).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.invitedBy],
      foreignColumns: [table.tgId],
      name: 'users_invited_by_fkey',
    })
      .onUpdate('cascade')
      .onDelete('set null'),
    unique('users_tg_id_key').on(table.tgId),
    unique('users_first_name_key').on(table.firstName),
    check('level_check', sql`(level >= 0) AND (level <= 9)`),
  ],
)

export const invites = pgTable(
  'invites',
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: 'invites_id_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    inviter: bigint({ mode: 'number' }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    invitee: bigint({ mode: 'number' }),
  },
  (table) => [
    foreignKey({
      columns: [table.inviter],
      foreignColumns: [users.tgId],
      name: 'invites_inviter_fkey',
    })
      .onUpdate('cascade')
      .onDelete('set null'),
    foreignKey({
      columns: [table.invitee],
      foreignColumns: [users.tgId],
      name: 'invites_invitee_fkey',
    })
      .onUpdate('cascade')
      .onDelete('set null'),
  ],
)

export const tasks = pgTable(
  'tasks',
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: 'tasks_id_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    type: varchar({ length: 20 }).notNull(),
    position: integer().notNull(),
    reward: integer().notNull(),
    icon: varchar({ length: 1024 }).notNull(),
    link: varchar({ length: 1024 }),
    active: boolean().default(true).notNull(),
    language: varchar({ length: 5 }),
    delay: integer(),
    invites: integer(),
    codes: text().array(),
  },
  (table) => [
    check(
      'tasks_type_check',
      sql`(type)::text = ANY ((ARRAY['invite'::character varying, 'code'::character varying, 'subscribe'::character varying])::text[])`,
    ),
    check(
      'check_invites',
      sql`(((type)::text = 'invite'::text) AND (invites IS NOT NULL)) OR (((type)::text <> 'invite'::text) AND (invites IS NULL))`,
    ),
    check(
      'check_codes',
      sql`(((type)::text = 'code'::text) AND (codes IS NOT NULL)) OR (((type)::text <> 'code'::text) AND (codes IS NULL))`,
    ),
    check(
      'check_delay',
      sql`(((type)::text = 'subscribe'::text) AND (delay IS NOT NULL)) OR (((type)::text <> 'subscribe'::text) AND (delay IS NULL))`,
    ),
  ],
)

export const userTasks = pgTable(
  'user_tasks',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    taskId: integer('task_id').notNull(),
    status: taskStatus().default('start').notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.tgId],
      name: 'user_tasks_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.taskId],
      foreignColumns: [tasks.id],
      name: 'user_tasks_task_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    primaryKey({ columns: [table.userId, table.taskId], name: 'user_tasks_pkey' }),
  ],
)
