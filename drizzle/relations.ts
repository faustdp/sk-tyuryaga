import { relations } from "drizzle-orm/relations";
import { users, invites, wallets, userTasks, tasks } from "./schema";

export const usersRelations = relations(users, ({one, many}) => ({
	user: one(users, {
		fields: [users.invitedBy],
		references: [users.tgId],
		relationName: "users_invitedBy_users_tgId"
	}),
	users: many(users, {
		relationName: "users_invitedBy_users_tgId"
	}),
	invites_inviter: many(invites, {
		relationName: "invites_inviter_users_tgId"
	}),
	invites_invitee: many(invites, {
		relationName: "invites_invitee_users_tgId"
	}),
	wallets: many(wallets),
	userTasks: many(userTasks),
}));

export const invitesRelations = relations(invites, ({one}) => ({
	user_inviter: one(users, {
		fields: [invites.inviter],
		references: [users.tgId],
		relationName: "invites_inviter_users_tgId"
	}),
	user_invitee: one(users, {
		fields: [invites.invitee],
		references: [users.tgId],
		relationName: "invites_invitee_users_tgId"
	}),
}));

export const walletsRelations = relations(wallets, ({one}) => ({
	user: one(users, {
		fields: [wallets.userId],
		references: [users.tgId]
	}),
}));

export const userTasksRelations = relations(userTasks, ({one}) => ({
	user: one(users, {
		fields: [userTasks.userId],
		references: [users.tgId]
	}),
	task: one(tasks, {
		fields: [userTasks.taskId],
		references: [tasks.id]
	}),
}));

export const tasksRelations = relations(tasks, ({many}) => ({
	userTasks: many(userTasks),
}));