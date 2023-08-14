import { getUserId } from "@/app/login/action";
import { db } from "@/lib/db/db";
import { tags, tasks } from "@/lib/db/schema";
import { createId, returnErr, returnSuccess } from "@/lib/utils";
import { and, eq, gte, isNull } from "drizzle-orm";
import { boolean, date, is, nullable, object, string, type Output } from "valibot";

export async function getActiveTask() {
	return db.query.tasks.findFirst();
}

const createTaskSchema = object({
	isManual: boolean(),
	start: date(),
	end: nullable(date()),
	expiry: date(),
	tagId: string(),
});

export async function createTask(newTask: Output<typeof createTaskSchema>) {
	const userId = await getUserId(true);

	if (!is(createTaskSchema, newTask)) {
		return returnErr("invalid data");
	}

	const tag = await db.query.tags.findFirst({
		where: and(eq(tags.id, newTask.tagId), eq(tags.userId, userId)),
	});

	if (!tag) {
		return returnErr("invalid tag");
	}

	await db.insert(tasks).values({
		...newTask,
		id: createId(),
		createdAt: new Date(),
		userId,
	});

	return returnSuccess();
}

export async function stopTask(taskId: string) {
	const userId = await getUserId(true);

	const now = new Date();

	const test = await db
		.update(tasks)
		.set({
			end: now,
		})
		.where(
			and(
				eq(tasks.id, taskId),
				eq(tasks.userId, userId),
				isNull(tasks.end),
				gte(tasks.expiry, now)
			)
		);

	console.log("stopTask response", test);

	return returnSuccess();
}
