"use server";

import { serverConf } from "@/lib/config";
import { db } from "@/lib/db/db";
import { users, type User } from "@/lib/db/schema";
import { createId, returnErr } from "@/lib/utils";
import { eq } from "drizzle-orm";
import * as jose from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function authenticate(code?: string) {
	if (!code) return returnErr("no code provided");

	const email = await googleAuth(code);

	if (!email) return returnErr("no email");

	let userId = null;

	const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });

	if (existingUser) {
		userId = existingUser.id;
	} else {
		const newUserId = createId();

		await db.insert(users).values({
			id: newUserId,
			email,
		});

		userId = newUserId;
	}

	const jwt = await new jose.SignJWT({ userId })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setIssuer("tasks")
		.setAudience("tasks")
		.setExpirationTime("30d")
		.sign(new TextEncoder().encode(serverConf.JWT_SECRET));

	cookies().set("token", jwt);

	redirect("/");
}

async function googleAuth(code: string) {
	const accessTokenRes = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			client_id: serverConf.NEXT_PUBLIC_G_CLIENT_ID,
			client_secret: serverConf.G_CLIENT_SECRET,
			code,
			redirect_uri: serverConf.NEXT_PUBLIC_G_REDIRECT_URI,
			grant_type: "authorization_code",
		}),
	});

	const accessToken = JSON.parse(await accessTokenRes.text()).access_token;

	const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	const userInfo = JSON.parse(await userInfoRes.text());

	return userInfo.email;
}

export async function getUserId<T extends boolean>(
	required: T = false as T
): Promise<T extends true ? string : string | null> {
	const jwt = cookies().get("token");

	if (!jwt || !jwt.value) {
		if (required) {
			throw new Error("failed to get user id - no jwt");
		}

		return null as T extends true ? string : string | null;
	}

	const jwtPayload = await jose.jwtVerify(
		jwt.value,
		new TextEncoder().encode(serverConf.JWT_SECRET),
		{
			audience: "tasks",
			issuer: "tasks",
		}
	);

	const userId = jwtPayload.payload.userId;

	if (!userId || typeof userId !== "string")
		return null as T extends true ? string : string | null;

	return userId;
}

export async function getUser<T extends boolean>(
	required: T = false as T
): Promise<T extends true ? User : User | null> {
	const userId = await getUserId(required);

	if (!userId) return null as T extends true ? User : User | null;

	const user = await db.query.users.findFirst({ where: eq(users.id, userId) });

	if (!user) return null as T extends true ? User : User | null;

	return user;
}
