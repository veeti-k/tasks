"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { WithInitialAnimation } from "@/components/withIntialAnimation";
import { Tag } from "@/lib/db/schema";
import { useAction } from "@/lib/useAction";
import { useDialog } from "@/lib/useDialog";
import { errorToast } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import { AnimatePresence } from "framer-motion";
import { createTag, deleteTag } from "./tagActions";

export function Tags(props: { tags: Tag[] }) {
	return (
		<div className="flex flex-col">
			<AnimatePresence initial={false}>
				{props.tags.map((t) => (
					<Tag key={t.id} tag={t} />
				))}
			</AnimatePresence>
		</div>
	);
}

function Tag(props: { tag: Tag }) {
	const deleteTagAction = useAction(deleteTag, {
		toasts: false,
	});

	return (
		<WithInitialAnimation>
			<div className="flex justify-between items-center border rounded-lg p-3 gap-2 mt-2">
				<span>{props.tag.name}</span>

				<Button
					disabled={deleteTagAction.isLoading}
					onClick={() => deleteTagAction.trigger(props.tag.id)}
				>
					{deleteTagAction.isLoading ? "deleting..." : "delete"}
				</Button>
			</div>
		</WithInitialAnimation>
	);
}

export function CreateTag() {
	const dialog = useDialog();

	const createTagAction = useAction(createTag, {
		onSuccess: () => {
			dialog.close();
		},
		onError: (res) => errorToast("failed to create tag", res?.msg),
	});

	return (
		<Dialog {...dialog.props}>
			<DialogTrigger asChild>
				<Button>create tag</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>create a tag</DialogTitle>
				</DialogHeader>

				<form action={createTagAction.trigger} className="flex flex-col gap-3">
					<label className="flex flex-col gap-1 ">
						<span className="text-sm">name</span>
						<Input name="name" autoComplete="off" />
					</label>

					<label className="flex flex-col gap-1 ">
						<span className="text-sm">color</span>
						<Input name="color" autoComplete="off" />
					</label>

					<div className="flex justify-end gap-3">
						<DialogClose asChild>
							<Button variant="ghost">cancel</Button>
						</DialogClose>

						<Button type="submit" disabled={createTagAction.isLoading}>
							{createTagAction.isLoading ? "creating..." : "create"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
