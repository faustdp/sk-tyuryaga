import { pgTable, index, serial, varchar, jsonb, timestamp, foreignKey, integer, uniqueIndex, numeric, boolean, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const enumTasksIconIconName = pgEnum("enum_tasks_icon_icon_name", ['inst', 'tg', 'tiktok', 'vk', 'youtube', 'twitter', 'discord'])
export const enumTasksIconIconType = pgEnum("enum_tasks_icon_icon_type", ['predefined', 'custom'])
export const enumTasksType = pgEnum("enum_tasks_type", ['invite', 'code', 'subscribe'])
export const enumUserTasksStatus = pgEnum("enum_user_tasks_status", ['start', 'check', 'claim', 'done'])


export const messages = pgTable("messages", {
	id: serial().primaryKey().notNull(),
	text: varchar().notNull(),
	photoUrl: varchar("photo_url"),
	buttons: jsonb(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("messages_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("messages_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const invites = pgTable("invites", {
	id: serial().primaryKey().notNull(),
	inviterId: integer("inviter_id").notNull(),
	inviteeId: integer("invitee_id").notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("invites_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("invites_invitee_1_idx").using("btree", table.inviteeId.asc().nullsLast().op("int4_ops")),
	index("invites_inviter_1_idx").using("btree", table.inviterId.asc().nullsLast().op("int4_ops")),
	index("invites_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.inviterId],
			foreignColumns: [users.id],
			name: "invites_inviter_id_users_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.inviteeId],
			foreignColumns: [users.id],
			name: "invites_invitee_id_users_id_fk"
		}).onDelete("set null"),
]);

export const wallets = pgTable("wallets", {
	id: serial().primaryKey().notNull(),
	userIdId: integer("user_id_id").notNull(),
	address: varchar().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	lastConnect: timestamp("last_connect", { precision: 3, withTimezone: true, mode: 'string' }).default('2025-01-04 09:10:05.329+00').notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("wallets_address_1_idx").using("btree", table.address.asc().nullsLast().op("text_ops")),
	index("wallets_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("wallets_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	index("wallets_user_id_1_idx").using("btree", table.userIdId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userIdId],
			foreignColumns: [users.id],
			name: "wallets_user_id_id_users_id_fk"
		}).onDelete("set null"),
]);

export const admins = pgTable("admins", {
	id: serial().primaryKey().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	email: varchar().notNull(),
	resetPasswordToken: varchar("reset_password_token"),
	resetPasswordExpiration: timestamp("reset_password_expiration", { precision: 3, withTimezone: true, mode: 'string' }),
	salt: varchar(),
	hash: varchar(),
	loginAttempts: numeric("login_attempts").default('0'),
	lockUntil: timestamp("lock_until", { precision: 3, withTimezone: true, mode: 'string' }),
}, (table) => [
	index("admins_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	uniqueIndex("admins_email_1_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("admins_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const media = pgTable("media", {
	id: serial().primaryKey().notNull(),
	alt: varchar().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	url: varchar(),
	thumbnailURL: varchar("thumbnail_u_r_l"),
	filename: varchar(),
	mimeType: varchar("mime_type"),
	filesize: numeric(),
	width: numeric(),
	height: numeric(),
	focalX: numeric("focal_x"),
	focalY: numeric("focal_y"),
}, (table) => [
	index("media_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	uniqueIndex("media_filename_1_idx").using("btree", table.filename.asc().nullsLast().op("text_ops")),
	index("media_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const tasks = pgTable("tasks", {
	id: serial().primaryKey().notNull(),
	type: enumTasksType().notNull(),
	position: numeric().default('0'),
	reward: numeric().notNull(),
	link: varchar(),
	active: boolean().default(true),
	language: varchar(),
	delay: numeric(),
	invites: numeric(),
	codes: jsonb(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	iconIconType: enumTasksIconIconType("icon_icon_type").default('predefined').notNull(),
	iconIconName: enumTasksIconIconName("icon_icon_name"),
	iconIconUrl: varchar("icon_icon_url"),
	name: varchar().notNull(),
}, (table) => [
	index("tasks_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("tasks_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	tgId: numeric("tg_id").notNull(),
	firstName: varchar("first_name").notNull(),
	username: varchar(),
	language: varchar(),
	farmedAmount: numeric("farmed_amount").default('0'),
	farmedTime: numeric("farmed_time").default('0'),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).default('2025-01-04 09:10:05.329+00').notNull(),
	lastVisit: timestamp("last_visit", { precision: 3, withTimezone: true, mode: 'string' }).default('2025-01-04 09:10:05.329+00'),
	invitedById: integer("invited_by_id"),
	invites: numeric().default('0').notNull(),
	farmCigs: numeric("farm_cigs").default('0').notNull(),
	refCigs: numeric("ref_cigs").default('0').notNull(),
	endTime: timestamp("end_time", { precision: 3, withTimezone: true, mode: 'string' }),
	claimFriends: timestamp("claim_friends", { precision: 3, withTimezone: true, mode: 'string' }).default('2025-01-05 09:10:05.329+00').notNull(),
	activityDays: numeric("activity_days").default('0').notNull(),
	bonuses: jsonb().default([]),
	selectedImages: jsonb("selected_images").default([-1,-1,-1,-1,-1,-1,-1,-1,-1]),
	level: numeric().default('0').notNull(),
}, (table) => [
	uniqueIndex("users_first_name_1_idx").using("btree", table.firstName.asc().nullsLast().op("text_ops")),
	index("users_invited_by_1_idx").using("btree", table.invitedById.asc().nullsLast().op("int4_ops")),
	uniqueIndex("users_tg_id_1_idx").using("btree", table.tgId.asc().nullsLast().op("numeric_ops")),
	foreignKey({
			columns: [table.invitedById],
			foreignColumns: [table.id],
			name: "users_invited_by_id_users_id_fk"
		}).onDelete("set null"),
]);

export const payloadPreferences = pgTable("payload_preferences", {
	id: serial().primaryKey().notNull(),
	key: varchar(),
	value: jsonb(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("payload_preferences_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("payload_preferences_key_1_idx").using("btree", table.key.asc().nullsLast().op("text_ops")),
	index("payload_preferences_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const payloadPreferencesRels = pgTable("payload_preferences_rels", {
	id: serial().primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull(),
	path: varchar().notNull(),
	adminsId: integer("admins_id"),
}, (table) => [
	index("payload_preferences_rels_admins_id_1_idx").using("btree", table.adminsId.asc().nullsLast().op("int4_ops")),
	index("payload_preferences_rels_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
	index("payload_preferences_rels_parent_idx").using("btree", table.parentId.asc().nullsLast().op("int4_ops")),
	index("payload_preferences_rels_path_idx").using("btree", table.path.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [payloadPreferences.id],
			name: "payload_preferences_rels_parent_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.adminsId],
			foreignColumns: [admins.id],
			name: "payload_preferences_rels_admins_fk"
		}).onDelete("cascade"),
]);

export const payloadMigrations = pgTable("payload_migrations", {
	id: serial().primaryKey().notNull(),
	name: varchar(),
	batch: numeric(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("payload_migrations_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("payload_migrations_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const payloadLockedDocuments = pgTable("payload_locked_documents", {
	id: serial().primaryKey().notNull(),
	globalSlug: varchar("global_slug"),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("payload_locked_documents_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("payload_locked_documents_global_slug_1_idx").using("btree", table.globalSlug.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const payloadLockedDocumentsRels = pgTable("payload_locked_documents_rels", {
	id: serial().primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull(),
	path: varchar().notNull(),
	adminsId: integer("admins_id"),
	usersId: integer("users_id"),
	invitesId: integer("invites_id"),
	tasksId: integer("tasks_id"),
	userTasksId: integer("user_tasks_id"),
	walletsId: integer("wallets_id"),
	messagesId: integer("messages_id"),
	mediaId: integer("media_id"),
}, (table) => [
	index("payload_locked_documents_rels_admins_id_1_idx").using("btree", table.adminsId.asc().nullsLast().op("int4_ops")),
	index("payload_locked_documents_rels_invites_id_1_idx").using("btree", table.invitesId.asc().nullsLast().op("int4_ops")),
	index("payload_locked_documents_rels_media_id_1_idx").using("btree", table.mediaId.asc().nullsLast().op("int4_ops")),
	index("payload_locked_documents_rels_messages_id_1_idx").using("btree", table.messagesId.asc().nullsLast().op("int4_ops")),
	index("payload_locked_documents_rels_order_idx").using("btree", table.order.asc().nullsLast().op("int4_ops")),
	index("payload_locked_documents_rels_parent_idx").using("btree", table.parentId.asc().nullsLast().op("int4_ops")),
	index("payload_locked_documents_rels_path_idx").using("btree", table.path.asc().nullsLast().op("text_ops")),
	index("payload_locked_documents_rels_tasks_id_1_idx").using("btree", table.tasksId.asc().nullsLast().op("int4_ops")),
	index("payload_locked_documents_rels_user_tasks_id_1_idx").using("btree", table.userTasksId.asc().nullsLast().op("int4_ops")),
	index("payload_locked_documents_rels_users_id_1_idx").using("btree", table.usersId.asc().nullsLast().op("int4_ops")),
	index("payload_locked_documents_rels_wallets_id_1_idx").using("btree", table.walletsId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [payloadLockedDocuments.id],
			name: "payload_locked_documents_rels_parent_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.adminsId],
			foreignColumns: [admins.id],
			name: "payload_locked_documents_rels_admins_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.usersId],
			foreignColumns: [users.id],
			name: "payload_locked_documents_rels_users_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.invitesId],
			foreignColumns: [invites.id],
			name: "payload_locked_documents_rels_invites_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tasksId],
			foreignColumns: [tasks.id],
			name: "payload_locked_documents_rels_tasks_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userTasksId],
			foreignColumns: [userTasks.id],
			name: "payload_locked_documents_rels_user_tasks_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.walletsId],
			foreignColumns: [wallets.id],
			name: "payload_locked_documents_rels_wallets_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.messagesId],
			foreignColumns: [messages.id],
			name: "payload_locked_documents_rels_messages_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.mediaId],
			foreignColumns: [media.id],
			name: "payload_locked_documents_rels_media_fk"
		}).onDelete("cascade"),
]);

export const userTasks = pgTable("user_tasks", {
	id: serial().primaryKey().notNull(),
	userIdId: integer("user_id_id").notNull(),
	taskIdId: integer("task_id_id").notNull(),
	status: enumUserTasksStatus().default('start').notNull(),
	codes: jsonb().default([]),
	codesAmount: numeric("codes_amount"),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("user_tasks_created_at_1_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("user_tasks_task_id_1_idx").using("btree", table.taskIdId.asc().nullsLast().op("int4_ops")),
	index("user_tasks_updated_at_1_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	index("user_tasks_user_id_1_idx").using("btree", table.userIdId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userIdId],
			foreignColumns: [users.id],
			name: "user_tasks_user_id_id_users_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.taskIdId],
			foreignColumns: [tasks.id],
			name: "user_tasks_task_id_id_tasks_id_fk"
		}).onDelete("set null"),
]);
