import { zodResolver } from "@hookform/resolvers/zod";
import { useButton } from "@react-aria/button";
import { FocusRing } from "@react-aria/focus";
import type { AriaButtonProps } from "@react-types/button";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Plus } from "lucide-react";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import colors from "tailwindcss/colors";
import { z } from "zod";

import { Error } from "@/Ui/Error";
import { Input } from "@/Ui/Input";
import { Label } from "@/Ui/Label";
import { Modal } from "@/Ui/Modal";
import { Button } from "@/Ui/NewButton";
import { Tag } from "@/Ui/shared/Tag";
import { type DbTag, addNotSynced, db } from "@/db/db";
import { cn } from "@/utils/classNames";
import { createId } from "@/utils/createId";
import { useForm } from "@/utils/useForm";

import { useTimerContext } from "../TimerContext";
import { WithAnimation } from "../WithAnimation";
import { ColorSelector, type TagColors, tagColors, zodTagColors } from "./ColorSelector";

export function AppTagsPage() {
	const { dbTags } = useTimerContext();

	const [tagInEdit, setTagInEdit] = useState<DbTag | null>(null);
	const [createdTag, setCreatedTag] = useState<DbTag | null>(null);

	return (
		<WithAnimation>
			<div className="flex h-full w-full flex-col gap-2">
				<div className="flex items-center justify-between gap-4">
					<div>
						<h1 className="px-4 pt-4 text-2xl font-bold">tags</h1>
					</div>

					<div className="px-4 pt-4">
						<NewTag setCreatedTag={setCreatedTag} />
					</div>
				</div>

				<div className="flex flex-col gap-2 overflow-auto p-4">
					{dbTags?.length ? (
						<AnimatePresence initial={false}>
							{dbTags?.map((tag) => (
								<Tag
									key={tag.id}
									tag={tag}
									onPress={() => setTagInEdit(tag)}
									isCreatedTag={tag.id === createdTag?.id}
									resetCreatedTag={() => setCreatedTag(null)}
								/>
							))}
						</AnimatePresence>
					) : (
						<div className="flex h-full flex-col items-center justify-center">
							<h2 className="w-full rounded-xl bg-gray-950/50 p-4 text-center outline-none outline-2 outline-offset-2">
								no tags
							</h2>
						</div>
					)}
				</div>

				{tagInEdit && (
					<EditTag tagInEdit={tagInEdit} setTagInEdit={setTagInEdit} dbTags={dbTags} />
				)}
			</div>
		</WithAnimation>
	);
}

const newTagFormSchema = z.object({
	label: z.string().nonempty(),
	color: zodTagColors,
});

function NewTag(props: { setCreatedTag: (tag: DbTag) => void }) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const newTagForm = useForm<z.infer<typeof newTagFormSchema>>({
		resolver: zodResolver(newTagFormSchema),
		defaultValues: {
			label: "",
			color: tagColors.at(2),
		},
		onSubmit: async (values) => {
			const newTag: DbTag = {
				id: createId(),
				label: values.label,
				color: values.color,
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};

			await Promise.all([db.tags.add(newTag), addNotSynced(newTag.id, "tag")]);

			newTagForm.reset();
			setIsModalOpen(false);
			props.setCreatedTag(newTag);
		},
	});

	useEffect(() => {
		(async () => {
			const createTagParam = new URLSearchParams(window.location.search).get("create_tag");

			if (createTagParam) {
				setIsModalOpen(true);
				window.history.replaceState({}, "", window.location.pathname);
			}
		})();
	}, []);

	return (
		<>
			<Button className="rounded-full p-2" onPress={() => setIsModalOpen(true)}>
				<Plus className="h-4 w-4" />
			</Button>

			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<form
					onSubmit={newTagForm.handleSubmit}
					className="flex h-full w-full flex-col justify-between gap-4"
				>
					<h1 className="text-2xl font-bold">new tag</h1>

					<Input label="label" required {...newTagForm.register("label")} />

					<div className="flex flex-col">
						<Label required>color</Label>

						<ColorSelector form={newTagForm} />

						<Error message={newTagForm.formState.errors.color?.message} />
					</div>

					<div className="flex w-full gap-2 pt-2">
						<Button
							onPress={() => setIsModalOpen(false)}
							className="flex-1 p-4"
							isSecondary
						>
							cancel
						</Button>
						<Button className="flex-1 p-4" type="submit">
							create
						</Button>
					</div>
				</form>
			</Modal>
		</>
	);
}

function EditTag(props: {
	tagInEdit: DbTag;
	setTagInEdit: (tag: DbTag | null) => void;
	dbTags?: DbTag[];
}) {
	const editTagFormSchema = z.object({
		label: z
			.string()
			.min(2, { message: "too short! must be at least 2 chars" })
			.refine(
				(label) =>
					!props.dbTags?.some(
						(tag) => tag.label === label && tag.id !== props.tagInEdit.id
					),
				"label in use! two tags can't have the same label"
			),
		color: zodTagColors,
	});

	const editTagForm = useForm<z.infer<typeof editTagFormSchema>>({
		resolver: zodResolver(editTagFormSchema),
		defaultValues: { label: props.tagInEdit.label, color: props.tagInEdit.color as TagColors },
		onSubmit: async (values) => {
			const newTag: DbTag = {
				...props.tagInEdit,
				label: values.label,
				color: values.color,
				updated_at: new Date(),
			};

            await Promise.all([db.tags.put(newTag), addNotSynced(newTag.id, "tag")])
			editTagForm.reset();
			props.setTagInEdit(null);
		},
	});

	return (
		<Modal isOpen={true} onClose={() => props.setTagInEdit(null)}>
			<form
				onSubmit={editTagForm.handleSubmit}
				className="flex h-full w-full flex-col justify-between gap-4"
			>
				<h1 className="text-2xl font-bold">edit tag</h1>

				<Input
					label="label"
					required
					error={editTagForm.formState.errors.label?.message}
					{...editTagForm.register("label")}
				/>

				<div className="flex flex-col">
					<Label required>color</Label>

					<ColorSelector form={editTagForm} />

					<Error message={editTagForm.formState.errors.color?.message} />
				</div>

				<div className="flex w-full gap-2">
					<Button
						onPress={() => props.setTagInEdit(null)}
						className="flex-1 p-4"
						isSecondary
					>
						cancel
					</Button>
					<Button className="flex-1 p-4" type="submit">
						save
					</Button>
				</div>
			</form>
		</Modal>
	);
}
