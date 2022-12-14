import addWeeks from "date-fns/addWeeks";
import format from "date-fns/format";
import subWeeks from "date-fns/subWeeks";
import { useState } from "react";

import { StatsWeekly } from "~components/StatsPage/StatsWeekly/StatsWeekly";
import { Button } from "~ui/Button";
import { Card } from "~ui/Card";
import { ChevronLeft } from "~ui/Icons/ChevronLeft";
import { ChevronRight } from "~ui/Icons/ChevronRight";
import { Layout } from "~ui/Layout/Layout";
import type { Page } from "~utils/PageType";

const StatsPage: Page = () => {
	const [selectedWeek, setSelectedWeek] = useState(new Date());

	return (
		<Layout title="Stats">
			<h1 className="pb-10 text-4xl font-bold">Stats</h1>

			<Card className="rounded-xl">
				<div className="flex w-full flex-col p-2">
					<div className="flex justify-between gap-2">
						<Button onClick={() => setSelectedWeek(subWeeks(selectedWeek, 1))}>
							<ChevronLeft />
						</Button>
						<Button className="w-full text-sm">Week {format(selectedWeek, "I")}</Button>
						<Button onClick={() => setSelectedWeek(addWeeks(selectedWeek, 1))}>
							<ChevronRight />
						</Button>
					</div>

					<StatsWeekly selectedWeek={selectedWeek} />
				</div>
			</Card>
		</Layout>
	);
};

StatsPage.requireAuth = true;
StatsPage.requireAdmin = false;

export default StatsPage;
