import { Counter } from "@/components/counter";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui2/button";

import { useTimerContext } from "../timer-context";
import classes from "./app-index-page.module.scss";
import { SelectTag } from "./select-tag";
import { TaskControls } from "./task-controls";
import { TimeControls } from "./time-controls";

export function AppIndexPage() {
	const { form, onGoingSeconds } = useTimerContext();

	return (
		<PageLayout>
			<main className={classes.main}>
				<span className={classes.counterWrapper}>
					<Counter seconds={onGoingSeconds ? onGoingSeconds : form.watch("seconds")} />
				</span>

				<TimeControls />

				<SelectTag />

				<TaskControls />

				<Button>test</Button>
			</main>
		</PageLayout>
	);
}
