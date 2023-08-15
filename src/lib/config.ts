import { merge, object, parse, safeParse, string } from "valibot";
import { clientConfSchema, clientEnv } from "./clientConfig";

const serverConfSchema = merge([
	clientConfSchema,
	object({
		DB_URL: string(),
		G_CLIENT_SECRET: string(),
		JWT_SECRET: string(),
	}),
]);

const serverEnv = {
	...clientEnv,
	DB_URL: process.env.DB_URL,
	G_CLIENT_SECRET: process.env.G_CLIENT_SECRET,
	JWT_SECRET: process.env.JWT_SECRET,
};

const serverRes = safeParse(serverConfSchema, serverEnv);
if (!serverRes.success) {
	console.error(serverRes.error);

	throw new Error(`Invalid server configuration ${serverRes.error}`);
}

export const serverConf = parse(serverConfSchema, serverEnv);
