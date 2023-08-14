import { db } from "@/lib/db/db";
import { tasks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserId } from "../login/action";
import { TagSelector } from "./TagSelector";
import { Time } from "./Timer/Time";
import { TimeButtons } from "./Timer/TimeButtons";
import { TimerControl } from "./Timer/TimerControl";

export default async function Page() {
	const userId = await getUserId();

	const activeTask = await db.query.tasks.findFirst({
		where: eq(tasks.userId, userId as string),
	});

	const tags = await db.query.tags.findMany({
		where: eq(tasks.userId, userId as string),
	});

	return (
		<div className="flex h-full min-h-main w-full flex-col items-center justify-center p-6">
			<h2 className="rounded-lg border p-4 font-medium tabular-nums leading-none">
				<Time />
			</h2>

			{!activeTask && (
				<div className="mt-8 w-full px-6">
					<TimeButtons />
				</div>
			)}

			<div className="mt-8 flex w-full justify-center">
				<TagSelector tags={tags} />
			</div>

			<div className="mt-8 flex w-full justify-center px-5">
				<TimerControl activeTask={activeTask} />
			</div>
		</div>
	);
}
