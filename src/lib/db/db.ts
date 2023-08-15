import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { serverConf } from "../config";
import * as schema from "./schema";

const connection = connect({
	url: serverConf.DB_URL,
});

export const db = drizzle(connection, { schema });
