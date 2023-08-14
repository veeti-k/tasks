"use client";

import { Button } from "@/components/ui/button";
import { type Task } from "@/lib/db/schema";
import { Time } from "./Timer/Time";
import { TimeButtons } from "./Timer/TimeButtons";

export function TimePage(props: { activeTask: Task }) {
	return (
		<div className="flex flex-col items-center justify-center p-10">
			<h2 className="rounded-lg border font-medium tabular-nums leading-none">
				<Time />
			</h2>

			{!props.activeTask && (
				<div className="mt-10 w-full px-2">
					<TimeButtons />
				</div>
			)}

			{props.activeTask ? (
				<Button size="xl" className="mt-10 w-full">
					stop
				</Button>
			) : (
				<Button size="xl" className="mt-10 w-full">
					start
				</Button>
			)}
		</div>
	);
}
