import { useEffect } from "react";
import { toast } from "sonner";

import { SpinnerButton } from "@/components/spinner-button";
import { useTags } from "@/lib/api/tags";
import { useStartTask, useStopOnGoingTask } from "@/lib/api/tasks";
import { errorToast } from "@/lib/error-toast";

import { useTimerContext } from "../timer-context";

export function TaskControls() {
	const { onGoingTask } = useTimerContext();

	return onGoingTask ? <StopTask /> : <StartTask />;
}

export function StartTask() {
	const { form } = useTimerContext();
	const mutation = useStartTask();
	const tags = useTags();

	function startTask() {
		const { seconds, tagId } = form.getValues();

		if (!seconds) return toast.error("add some time first");
		if (!tagId) return toast.error("select a tag first");

		mutation
			.mutateAsync({
				tag_id: tagId,
				seconds,
			})
			.then(() => form.reset())
			.catch(errorToast("error starting task"));
	}

	useEffect(() => {
		function onPress(e: KeyboardEvent) {
			if (e.key === "l") {
				const firstTag = tags.data?.[0];

				if (!firstTag) {
					return;
				}

				form.setValue("tagId", firstTag.id);
				form.setValue("seconds", 2);

				startTask();
			}
		}
		document.addEventListener("keydown", onPress);

		return () => {
			document.removeEventListener("keydown", onPress);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form, tags.data]);

	return (
		<SpinnerButton spin={mutation.isPending} className="mt-8 px-10 py-7" onClick={startTask}>
			start
		</SpinnerButton>
	);
}

export function StopTask() {
	const mutation = useStopOnGoingTask();

	function stopTask() {
		mutation.mutateAsync().catch(errorToast("error stopping task"));
	}

	return (
		<SpinnerButton spin={mutation.isPending} className="mt-8 px-10 py-7" onClick={stopTask}>
			stop
		</SpinnerButton>
	);
}
