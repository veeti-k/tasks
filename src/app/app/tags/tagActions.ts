"use server";

import { getUser, getUserId } from "@/app/login/action";
import { db } from "@/lib/db/db";
import { tags } from "@/lib/db/schema";
import { createId, returnErr, returnSuccess } from "@/lib/utils";
import { and, desc, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { is, minLength, object, string } from "valibot";

export async function getTags() {
	const userId = await getUserId(true);

	return db.query.tags.findMany({
		orderBy: [desc(tags.createdAt)],
		where: eq(tags.userId, userId),
		limit: 50,
	});
}

const createTagSchema = object({
	name: string([minLength(1)]),
	color: string([minLength(1)]),
});

export async function createTag(formData: FormData) {
	const data = Object.fromEntries(formData.entries());

	const user = await getUser(true);

	if (!is(createTagSchema, data)) {
		return returnErr("invalid data");
	}

	try {
		await db.insert(tags).values({
			id: createId(),
			name: data.name,
			color: data.color,
			createdAt: new Date(),
			userId: user.id,
		});
	} catch (err) {
		console.error("failed to insert tag to db", err);

		return returnErr("unexpected error");
	}

	revalidateTag("/tags");

	return returnSuccess();
}

const editTagSchema = object({
	tagId: string([minLength(1)]),
	name: string([minLength(1)]),
	color: string([minLength(1)]),
});

export async function editTag(formData: FormData) {
	const data = Object.fromEntries(formData.entries());

	if (!is(editTagSchema, data)) {
		return returnErr("invalid data");
	}

	const userId = await getUserId(true);

	try {
		await db
			.update(tags)
			.set({
				name: data.name,
				color: data.color,
			})
			.where(and(eq(tags.id, data.tagId), eq(tags.userId, userId)));
	} catch (err) {
		console.error("failed to update tag in db", err);

		return returnErr("unexpected error");
	}

	revalidateTag("/tags");

	return returnSuccess();
}

export async function deleteTag(tagId: string) {
	const userId = await getUserId(true);

	try {
		await db.delete(tags).where(and(eq(tags.id, tagId), eq(tags.userId, userId)));
	} catch (err) {
		console.error(`failed to delete tag (tagId: '${tagId}') from db `, err);

		return returnErr("unexpected error");
	}

	revalidateTag("/tags");

	return returnSuccess();
}
