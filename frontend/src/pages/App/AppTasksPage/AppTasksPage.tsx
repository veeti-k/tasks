import { useButton } from "@react-aria/button";
import { FocusRing } from "@react-aria/focus";
import type { AriaButtonProps } from "@react-types/button";
import addHours from "date-fns/addHours";
import { motion, useAnimation } from "framer-motion";
import { ChevronsUpDown, Plus } from "lucide-react";
import { type ComponentProps, useRef, useState } from "react";
import colors from "tailwindcss/colors";
import { z } from "zod";

import { Input } from "@/Ui/Input";
import { Label } from "@/Ui/Label";
import { Modal } from "@/Ui/Modal";
import { Button, SelectButton } from "@/Ui/NewButton";
import { db } from "@/db/db";
import { cn } from "@/utils/classNames";
import { createId } from "@/utils/createId";
import { sleep } from "@/utils/sleep";
import { useForm } from "@/utils/useForm";

import { useTimerContext } from "../TimerContext";
import { WithAnimation } from "../WithAnimation";

export function AppTasksPage() {
	return (
		<WithAnimation>
			<div className=" flex h-full w-full flex-col gap-2">
				<div className="flex items-center justify-between gap-4">
					<div>
						<h1 className="px-4 pt-4 text-2xl font-bold">tasks</h1>
					</div>

					<div className="px-4 pt-4">
						<NewTask />
					</div>
				</div>
			</div>
		</WithAnimation>
	);
}

const addTasksFormSchema = z.object({
	start: z.string(),
	duration: z.number(),
	tagId: z.string(),
});

function NewTask() {
	const [isOpen, setIsOpen] = useState(false);

	const addTasksForm = useForm<z.infer<typeof addTasksFormSchema>>({
		defaultValues: {
			start: "",
			duration: 0,
			tagId: "",
		},
		onSubmit: async (values) => {
			const startDate = new Date(values.start);
			const endDate = addHours(startDate, values.duration);

			await db.tasks.add({
				id: createId(),
				tag_id: values.tagId,
				started_at: startDate,
				expires_at: endDate,
				stopped_at: null,
				deleted_at: null,
				updated_at: new Date(),
				created_at: new Date(),
			});

			addTasksForm.reset();
			setIsOpen(false);
		},
	});

	return (
		<>
			<Button className="rounded-full p-2" onPress={() => setIsOpen(true)}>
				<Plus className="h-4 w-4" />
			</Button>

			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<div className="flex flex-col gap-4">
					<h1 className="text-2xl font-bold">new task</h1>

					<form onSubmit={addTasksForm.handleSubmit} className="flex flex-col gap-4">
						<Input type="datetime-local" label="start" required />

						<Input type="number" label="(h) duration" required />

						<div className="flex flex-col gap-1">
							<Label id="select-tag" required>
								tag
							</Label>

							<NewTaskSelectTag
								selectedTagId={addTasksForm.watch("tagId")}
								onSelect={(tagId) => addTasksForm.setValue("tagId", tagId)}
							/>
						</div>

						<div className="flex w-full gap-3 pt-2">
							<Button
								onPress={() => setIsOpen(false)}
								className="flex-1 p-4"
								isSecondary
							>
								cancel
							</Button>
							<Button className="flex-1 p-4" type="submit">
								add
							</Button>
						</div>
					</form>
				</div>
			</Modal>
		</>
	);
}

function NewTaskSelectTag(props: { selectedTagId: string; onSelect: (id: string) => void }) {
	const [isOpen, setIsOpen] = useState(false);
	const { dbTags } = useTimerContext();

	const selectedTag = dbTags?.find((tag) => tag.id === props.selectedTagId);

	return (
		<>
			<SelectButton onPress={() => setIsOpen(true)}>
				{selectedTag ? (
					<div className="flex items-center gap-3">
						<div
							className="h-3 w-3 rounded-full"
							style={{ backgroundColor: selectedTag.color }}
						/>

						<span>{selectedTag.label}</span>
					</div>
				) : (
					"select a tag"
				)}

				<ChevronsUpDown className="h-4 w-4 text-gray-200" />
			</SelectButton>

			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<div className="flex flex-col gap-4">
					<h1 className="text-2xl font-bold">select a tag</h1>

					<div className="flex w-full flex-col gap-2">
						{dbTags?.map((tag) => (
							<Tag
								key={tag.id}
								onPress={() => {
									props.onSelect(tag.id);
									setIsOpen(false);
								}}
							>
								<div
									className="h-3 w-3 rounded-full"
									style={{ backgroundColor: tag.color }}
								/>

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
					"flex w-full cursor-default items-center gap-4 rounded-xl bg-gray-950/50 p-4 outline-none outline-2 outline-offset-2",
					props.className
				)}
			>
				{props.children}
			</motion.button>
		</FocusRing>
	);
}