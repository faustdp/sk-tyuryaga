import { relations } from 'drizzle-orm/relations'
import {
  users,
  invites,
  wallets,
  payloadPreferences,
  payloadPreferencesRels,
  admins,
  payloadLockedDocuments,
  payloadLockedDocumentsRels,
  tasks,
  userTasks,
  messages,
  media,
} from './schema'

export const invitesRelations = relations(invites, ({ one, many }) => ({
  user_inviterId: one(users, {
    fields: [invites.inviterId],
    references: [users.id],
    relationName: 'invites_inviterId_users_id',
  }),
  user_inviteeId: one(users, {
    fields: [invites.inviteeId],
    references: [users.id],
    relationName: 'invites_inviteeId_users_id',
  }),
  payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}))

export const usersRelations = relations(users, ({ one, many }) => ({
  invites_inviterId: many(invites, {
    relationName: 'invites_inviterId_users_id',
  }),
  invites_inviteeId: many(invites, {
    relationName: 'invites_inviteeId_users_id',
  }),
  wallets: many(wallets),
  user: one(users, {
    fields: [users.invitedById],
    references: [users.id],
    relationName: 'users_invitedById_users_id',
  }),
  users: many(users, {
    relationName: 'users_invitedById_users_id',
  }),
  payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
  userTasks: many(userTasks),
}))

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, {
    fields: [wallets.userIdId],
    references: [users.id],
  }),
  payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}))

export const payloadPreferencesRelsRelations = relations(payloadPreferencesRels, ({ one }) => ({
  payloadPreference: one(payloadPreferences, {
    fields: [payloadPreferencesRels.parentId],
    references: [payloadPreferences.id],
  }),
  admin: one(admins, {
    fields: [payloadPreferencesRels.adminsId],
    references: [admins.id],
  }),
}))

export const payloadPreferencesRelations = relations(payloadPreferences, ({ many }) => ({
  payloadPreferencesRels: many(payloadPreferencesRels),
}))

export const adminsRelations = relations(admins, ({ many }) => ({
  payloadPreferencesRels: many(payloadPreferencesRels),
  payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}))

export const payloadLockedDocumentsRelsRelations = relations(payloadLockedDocumentsRels, ({ one }) => ({
  payloadLockedDocument: one(payloadLockedDocuments, {
    fields: [payloadLockedDocumentsRels.parentId],
    references: [payloadLockedDocuments.id],
  }),
  admin: one(admins, {
    fields: [payloadLockedDocumentsRels.adminsId],
    references: [admins.id],
  }),
  user: one(users, {
    fields: [payloadLockedDocumentsRels.usersId],
    references: [users.id],
  }),
  invite: one(invites, {
    fields: [payloadLockedDocumentsRels.invitesId],
    references: [invites.id],
  }),
  task: one(tasks, {
    fields: [payloadLockedDocumentsRels.tasksId],
    references: [tasks.id],
  }),
  userTask: one(userTasks, {
    fields: [payloadLockedDocumentsRels.userTasksId],
    references: [userTasks.id],
  }),
  wallet: one(wallets, {
    fields: [payloadLockedDocumentsRels.walletsId],
    references: [wallets.id],
  }),
  message: one(messages, {
    fields: [payloadLockedDocumentsRels.messagesId],
    references: [messages.id],
  }),
  media: one(media, {
    fields: [payloadLockedDocumentsRels.mediaId],
    references: [media.id],
  }),
}))

export const payloadLockedDocumentsRelations = relations(payloadLockedDocuments, ({ many }) => ({
  payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}))

export const tasksRelations = relations(tasks, ({ many }) => ({
  payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
  userTasks: many(userTasks),
}))

export const userTasksRelations = relations(userTasks, ({ one, many }) => ({
  payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
  user: one(users, {
    fields: [userTasks.userIdId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [userTasks.taskIdId],
    references: [tasks.id],
  }),
}))

export const messagesRelations = relations(messages, ({ many }) => ({
  payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}))

export const mediaRelations = relations(media, ({ many }) => ({
  payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}))
