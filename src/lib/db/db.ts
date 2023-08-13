import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import * as schema from "./schema";

const connection = connect({
	url: process.env.DB_URL,
});

export const db = drizzle(connection, { schema });
