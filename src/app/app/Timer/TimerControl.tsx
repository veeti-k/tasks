"use client";
import { addSeconds } from "date-fns";

import { Button } from "@/components/ui/button";
import { type Task } from "@/lib/db/schema";
import { useAction } from "@/lib/useAction";
import { toast } from "sonner";
import { createTask, stopTask } from "./timerActions";
import { useSeconds, useSelectedTag } from "./timerState";

export function TimerControl(props: { activeTask?: Task }) {
	const [seconds] = useSeconds();
	const [selectedTag] = useSelectedTag();

	const createTaskAction = useAction(createTask);
	const stopTaskAction = useAction(stopTask);

	function start() {
		if (!seconds) return toast.error("add some time first");
		if (!selectedTag) return toast.error("select a tag first");

		const now = new Date();

		createTaskAction.trigger({
			start: now,
			end: null,
			expiry: addSeconds(now, seconds),
			isManual: false,
			tagId: selectedTag.id,
		});
	}

	function stop() {
		if (!props.activeTask) return toast.error("no active task");

		stopTaskAction.trigger(props.activeTask.id);
	}

	return props.activeTask ? (
		<Button size="xl" className="w-full" onClick={stop}>
			stop
		</Button>
	) : (
		<Button size="xl" className="w-full" onClick={start}>
			start
		</Button>
	);
}
