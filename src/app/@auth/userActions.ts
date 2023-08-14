"use server";

import { prisma } from "@/lib/prisma";
import { createId, returnMsg } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { email, is, object, string } from "valibot";

export async function deleteUser(id: string) {
	try {
		await prisma.user.delete({
			where: { id },
		});
	} catch (err) {
		const msg = "Failed to delete user";

		console.error(msg, err);

		return returnMsg(msg, "error");
	}

	revalidatePath("/");

	return null;
}

const userSchema = object({
	email: string([email()]),
});

export async function addUser(formData: FormData) {
	const data = Object.fromEntries(formData.entries());

	if (!is(userSchema, data)) {
		return returnMsg("Invalid data", "error");
	}

	let existingUser;

	try {
		existingUser = await prisma.user.findFirst({
			where: { email: data.email },
		});
	} catch (err) {
		const msg = "Failed to check if user exists";

		console.error(msg, err);

		return returnMsg(msg, "error");
	}

	if (existingUser) {
		return returnMsg("User already exists", "error");
	}

	try {
		await prisma.user.create({
			data: {
				id: createId(),
				email: createId(),
			},
		});
	} catch (err) {
		const msg = "Failed to insert user to database";

		console.error(msg, err);

		return returnMsg(msg, "error");
	}

	revalidatePath("/");

	return null;
}
