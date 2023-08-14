"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useSeconds } from "./timerState";

export function TimeButtons() {
	const [, setTime] = useSeconds();

	function addTime(time: number) {
		setTime((t) => t + time);
	}

	function subtractTime(time: number) {
		if (time > time) return;

		setTime((t) => t - time);
	}

	return (
		<div className="flex w-full gap-2">
			<div className="flex w-full flex-col gap-2 rounded-2xl border p-2">
				<Button variant={"outline"} className="w-full p-2" onClick={() => addTime(1800)}>
					<Plus strokeWidth={1.8} className="h-[16px] w-[16px]" /> 30 min
				</Button>
				<Button
					variant={"outline"}
					className="w-full p-2"
					onClick={() => subtractTime(1800)}
				>
					<Minus strokeWidth={1.8} className="h-[16px] w-[16px]" /> 30 min
				</Button>
			</div>
			<div className="flex w-full flex-col gap-2 rounded-2xl border p-2">
				<Button variant={"outline"} className="w-full p-2" onClick={() => addTime(300)}>
					<Plus strokeWidth={1.8} className="h-[16px] w-[16px]" /> 5 min
				</Button>
				<Button
					variant={"outline"}
					className="w-full p-2"
					onClick={() => subtractTime(300)}
				>
					<Minus strokeWidth={1.8} className="h-[16px] w-[16px]" /> 5 min
				</Button>
			</div>
		</div>
	);
}
