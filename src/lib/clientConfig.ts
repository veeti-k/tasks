import { object, parse, safeParse, string } from "valibot";

export const clientConfSchema = object({
	NEXT_PUBLIC_G_CLIENT_ID: string(),
	NEXT_PUBLIC_G_REDIRECT_URI: string(),
});

export const clientEnv = {
	NEXT_PUBLIC_G_CLIENT_ID: process.env.NEXT_PUBLIC_G_CLIENT_ID,
	NEXT_PUBLIC_G_REDIRECT_URI: process.env.NEXT_PUBLIC_G_REDIRECT_URI,
};

const clientRes = safeParse(clientConfSchema, clientEnv);
if (!clientRes.success) {
	console.error(clientRes.error);

	throw new Error(`Invalid client configuration ${clientRes.error}`);
}

export const clientConf = parse(clientConfSchema, clientEnv);
