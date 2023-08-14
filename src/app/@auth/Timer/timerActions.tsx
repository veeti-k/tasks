import { db } from "@/lib/db/db";

export async function getActiveTask() {
	return db.query.tasks.findFirst();
}
