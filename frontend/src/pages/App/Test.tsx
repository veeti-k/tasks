import { type AriaButtonProps, useButton } from "@react-aria/button";
import { FocusRing } from "@react-aria/focus";
import addSeconds from "date-fns/addSeconds";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { type ComponentProps, useRef, useState } from "react";
import { Outlet, Link as RRDLink, useLocation } from "react-router-dom";
import colors from "tailwindcss/colors";

import { Time } from "@/Ui/Counter";
import { Modal } from "@/Ui/Modal";
import { Button } from "@/Ui/NewButton";
import { LinkButton } from "@/Ui/NewLink";
import { type DbTask, db } from "@/db/db";
import { cn } from "@/utils/classNames";
import { createId } from "@/utils/createId";
import { sleep } from "@/utils/sleep";

import { TimerContextProvider, useTimerContext } from "./TimerContext";
import { WithAnimation } from "./WithAnimation";

const links = [
	{ id: "home", label: "home", href: "/app" },
	{ id: "stats", label: "stats", href: "/app/stats" },
	{ id: "tags", label: "tags", href: "/app/tags" },
	{ id: "settings", label: "settings", href: "/app/settings" },
];

export function Test() {
	return (
		<TimerContextProvider>
			<TestInner />
		</TimerContextProvider>
	);
}

function TestInner() {
	const location = useLocation();
	const activeLinkId = links.find((link) => link.href === location.pathname)?.id;

	return (
		<div className="fixed h-full w-full">
			<div className="flex h-full w-full flex-col items-center justify-center gap-2 p-1">
				<div className="h-full max-h-[500px] w-full max-w-[400px] overflow-hidden rounded-3xl border border-gray-800 bg-gray-900">
					<AnimatePresence initial={false}>
						<Outlet />
					</AnimatePresence>
				</div>

				<div className="flex w-full max-w-[320px] rounded-[30px] border border-gray-800 bg-gray-900 p-2">
					{links.map((l) => (
						<RRDLink
							key={l.id}
							to={l.href}
							className="relative flex w-full items-center justify-center rounded-full px-4 py-2"
						>
							{activeLinkId === l.id && (
								<motion.div
									layoutId="active-indicator"
									className="absolute inset-0 w-full rounded-full border border-gray-50/10 bg-gray-50/20"
									transition={{
										duration: 0.1,
										type: "spring",
										mass: 0.1,
									}}
								/>
							)}
							<span className="relative">{l.label}</span>
						</RRDLink>
					))}
				</div>
			</div>
		</div>
	);
}

export function Index() {
	const { selectedTagTime, selectedTag, dbTags } = useTimerContext();

	const [time, setTime] = useState(0);

	const isRunning = !!selectedTagTime;
	const isStartingDisabled = isRunning || time <= 0;

	function addTime(seconds: number) {
		setTime(time + seconds);
	}

	function subtractTime(seconds: number) {
		const newTime = time - seconds;

		if (newTime < 0) {
			setTime(0);
		} else {
			setTime(newTime);
		}
	}

	async function startTimer() {
		if (!selectedTag) return;

		const expires_at = addSeconds(new Date(), time);

		const task: DbTask = {
			id: createId(),
			tag_id: selectedTag.id,
			created_at: new Date(),
			updated_at: new Date(),
			expires_at,
			stopped_at: null,
			deleted_at: null,
		};

		await db.tasks.add(task);
	}

	function stopTimer() {
		if (!selectedTagTime) return;

		db.tasks.update(selectedTagTime.id, {
			stopped_at: new Date(),
			updated_at: new Date(),
		});
	}

	return (
		<WithAnimation>
			<div className="flex h-full w-full flex-col items-center justify-center gap-8">
				<h2 className="rounded-3xl border border-gray-800 bg-gray-950 p-4 font-bold text-gray-50">
					<Time seconds={isRunning ? selectedTagTime.timeUntilExpiry : time} />
				</h2>

				<div className="flex w-full max-w-[260px] gap-2">
					<div className="flex w-full flex-col gap-2 rounded-2xl border border-gray-800 bg-gray-950 p-2">
						<Button className="w-full p-2" onPress={() => addTime(1800)}>
							<Plus strokeWidth={1.8} className="h-[16px] w-[16px]" />{" "}
							<span>30 min</span>
						</Button>
						<Button className="w-full p-2" onPress={() => subtractTime(1800)}>
							<Minus strokeWidth={1.8} className="h-[16px] w-[16px]" /> 30 min
						</Button>
					</div>

					<div className="flex w-full flex-col gap-2 rounded-2xl border border-gray-800 bg-gray-950 p-2">
						<Button className="w-full p-2" onPress={() => addTime(1800)}>
							<Plus strokeWidth={1.8} className="h-[16px] w-[16px]" /> 5 min
						</Button>
						<Button className="w-full p-2" onPress={() => subtractTime(1800)}>
							<Minus strokeWidth={1.8} className="h-[16px] w-[16px]" /> 5 min
						</Button>
					</div>
				</div>

				{dbTags?.length ? (
					<SelectTag />
				) : isRunning ? null : (
					<LinkButton className="p-2" to={"/app/tags?create_tag=1"}>
						create a tag
					</LinkButton>
				)}

				{isRunning ? (
					<Button onPress={() => stopTimer()} className="px-[4rem] py-4">
						stop
					</Button>
				) : (
					<Button
						onPress={() => startTimer()}
						isDisabled={isStartingDisabled}
						className="px-[4rem] py-4"
					>
						start
					</Button>
				)}
			</div>
		</WithAnimation>
	);
}

function SelectTag() {
	const { selectedTag, setSelectedTagId, dbTags } = useTimerContext();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button className="px-6 py-2" onPress={() => setIsOpen(true)}>
				{selectedTag ? selectedTag.label : "select a tag"}
			</Button>

			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<div className="flex flex-col gap-4">
					<h1 className="text-2xl font-bold">select a tag</h1>

					<div className="flex w-full flex-col gap-2">
						{dbTags?.map((tag) => (
							<Tag
								key={tag.id}
								onPress={() => {
									setSelectedTagId(tag.id);
									setIsOpen(false);
								}}
							>
								{tag.label}
							</Tag>
						))}
					</div>
				</div>
			</Modal>
		</>
	);
}

function Tag(props: ComponentProps<"button"> & AriaButtonProps) {
	const ref = useRef<HTMLButtonElement | null>(null);
	const controls = useAnimation();

	const aria = useButton(
		{
			...props,
			onPress: async (e) => {
				controls.set({ backgroundColor: colors.neutral[800] });

				controls.start({
					backgroundColor: "rgb(10 10 10 / 0.5)",
					transition: { duration: 0.3 },
				});

				await sleep(200);

				props.onPress?.(e);
			},
			// @ts-expect-error undocumented prop
			preventFocusOnPress: true,
		},
		ref
	);

	return (
		<FocusRing focusRingClass="outline-gray-300">
			{/* @ts-expect-error dont know how to fix this */}
			<motion.button
				{...aria.buttonProps}
				ref={ref}
				animate={controls}
				className={cn(
					"w-full rounded-xl bg-gray-950/50 p-4 outline-none outline-2 outline-offset-2",
					props.className
				)}
			>
				{props.children}
			</motion.button>
		</FocusRing>
	);
}
