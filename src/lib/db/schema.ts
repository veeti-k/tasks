import { relations, type InferModel } from "drizzle-orm";
import { datetime, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
	id: varchar("id", { length: 26 }).primaryKey(),
	email: varchar("email", { length: 255 }).unique(),
	createdAt: datetime("created_at"),
});

export type User = InferModel<typeof users, "select">;

export const usersRelations = relations(users, ({ many }) => ({
	tags: many(tags),
	tasks: many(tasks),
	notificationSubscriptions: many(notificationSubscriptions),
	notifications: many(notifications),
}));

export const tags = mysqlTable("tags", {
	id: varchar("id", { length: 26 }).primaryKey(),
	name: varchar("name", { length: 255 }),
	color: varchar("color", { length: 7 }),
	createdAt: datetime("created_at"),

	userId: varchar("user_id", { length: 26 }),
});

export type Tag = InferModel<typeof tags, "select">;

export const tagsRelations = relations(tags, ({ one, many }) => ({
	user: one(users, {
		fields: [tags.userId],
		references: [users.id],
	}),
	tasks: many(tasks),
}));

export const tasks = mysqlTable("tasks", {
	id: varchar("id", { length: 26 }).primaryKey(),
	isManual: varchar("is_manual", { length: 1 }),
	start: datetime("start"),
	end: datetime("end"),
	expiry: datetime("expiry"),
	createdAt: datetime("created_at"),

	userId: varchar("user_id", { length: 26 }),
	tagId: varchar("tag_id", { length: 26 }),
});

export type Task = InferModel<typeof tasks, "select">;

export const tasksRelations = relations(tasks, ({ one }) => ({
	user: one(users, {
		fields: [tasks.userId],
		references: [users.id],
	}),
	tag: one(tags, {
		fields: [tasks.tagId],
		references: [tags.id],
	}),
	notification: one(notifications, {
		fields: [tasks.id],
		references: [notifications.taskId],
	}),
}));

export const notificationSubscriptions = mysqlTable("notification_subscriptions", {
	id: varchar("id", { length: 26 }).primaryKey(),
	endpoint: varchar("endpoint", { length: 255 }),
	p256dh: varchar("p256dh", { length: 255 }),
	auth: varchar("auth", { length: 255 }),
	createdAt: datetime("created_at"),
});

export type NotificationSubscription = InferModel<typeof notificationSubscriptions, "select">;

export const notificationSubscriptionsRelations = relations(
	notificationSubscriptions,
	({ one }) => ({
		user: one(users, {
			fields: [notificationSubscriptions.id],
			references: [users.id],
		}),
	})
);

export const notifications = mysqlTable("notifications", {
	id: varchar("id", { length: 26 }).primaryKey(),
	title: varchar("title", { length: 255 }),
	body: varchar("body", { length: 255 }),
	createdAt: datetime("created_at"),

	taskId: varchar("task_id", { length: 26 }),
});

export type Notification = InferModel<typeof notifications, "select">;

export const notificationsRelations = relations(notifications, ({ one }) => ({
	user: one(users, {
		fields: [notifications.id],
		references: [users.id],
	}),
	task: one(tasks, {
		fields: [notifications.taskId],
		references: [tasks.id],
	}),
}));
