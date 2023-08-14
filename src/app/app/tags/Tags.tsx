"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { WithInitialAnimation } from "@/components/withIntialAnimation";
import { type Tag } from "@/lib/db/schema";
import { useAction } from "@/lib/useAction";
import { useDialog } from "@/lib/useDialog";
import { errorToast } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import { AnimatePresence } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createTag, deleteTag, editTag } from "./tagActions";

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

function Tag(props: { tag: Tag; isPreview?: boolean }) {
	const SurroundingElement = props.isPreview === true ? "div" : WithInitialAnimation;

	return (
		<SurroundingElement className="mt-2 flex items-center justify-between gap-2 rounded-lg border p-3">
			<div className="flex items-center gap-3">
				<div
					className="h-4 w-4 rounded-full"
					style={{ backgroundColor: props.tag.color }}
				/>

				<span>{props.tag.name}</span>
			</div>

			{props.isPreview !== true && <TagActions tag={props.tag} />}
		</SurroundingElement>
	);
}

function TagActions(props: { tag: Tag }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className="h-8 w-8 p-0">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<EditTag tag={props.tag} />
				<DeleteTag tag={props.tag} />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function DeleteTag(props: { tag: Tag }) {
	const dialog = useDialog();

	const deleteTagAction = useAction(deleteTag, {
		onSuccess: () => {
			toast.success("tag deleted");
			dialog.close();
		},
		onError: (res) => errorToast("failed to delete tag", res?.msg),
	});

	return (
		<Dialog {...dialog.props}>
			<DialogTrigger asChild>
				<DropdownMenuItem
					onSelect={(e) => {
						e.preventDefault();
						dialog.open();
					}}
				>
					delete tag
				</DropdownMenuItem>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>delete tag</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<p>are you sure you want to delete this tag?</p>

						<Tag tag={props.tag} isPreview />
					</div>

					<div className="flex justify-end gap-4">
						<DialogClose asChild>
							<Button variant="ghost">cancel</Button>
						</DialogClose>

						<Button
							type="submit"
							variant="destructive"
							onClick={() => deleteTagAction.trigger(props.tag.id)}
							disabled={deleteTagAction.isLoading}
						>
							{deleteTagAction.isLoading ? "deleting..." : "delete"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export function CreateTag() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const dialog = useDialog(!!searchParams.get("create-tag"));

	const searchParamName = searchParams.get("name");

	const createTagAction = useAction(createTag, {
		onSuccess: () => {
			toast.success("tag created");
			router.push("/app/tags");
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
					<DialogTitle>create tag</DialogTitle>
				</DialogHeader>

				<form action={createTagAction.trigger} className="flex flex-col gap-4">
					<label className="flex flex-col gap-1">
						<span className="text-sm">name</span>
						<Input
							name="name"
							autoComplete="off"
							defaultValue={searchParamName ?? ""}
						/>
					</label>

					<label className="flex flex-col gap-1">
						<span className="text-sm">color</span>
						<Input name="color" autoComplete="off" />
					</label>

					<div className="flex justify-end gap-4">
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

export function EditTag(props: { tag: Tag }) {
	const dialog = useDialog();

	const editTagAction = useAction(editTag, {
		onSuccess: () => {
			dialog.close();
		},
		onError: (res) => errorToast("failed to edit tag", res?.msg),
	});

	return (
		<Dialog {...dialog.props}>
			<DialogTrigger asChild>
				<DropdownMenuItem
					onSelect={(e) => {
						e.preventDefault();
						dialog.open();
					}}
				>
					edit tag
				</DropdownMenuItem>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>create tag</DialogTitle>
				</DialogHeader>

				<form action={editTagAction.trigger} className="flex flex-col gap-4">
					<input type="hidden" name="tagId" value={props.tag.id} />

					<label className="flex flex-col gap-1">
						<span className="text-sm">name</span>
						<Input name="name" defaultValue={props.tag.name} autoComplete="off" />
					</label>

					<label className="flex flex-col gap-1">
						<span className="text-sm">color</span>
						<Input name="color" defaultValue={props.tag.color} autoComplete="off" />
					</label>

					<div className="flex justify-end gap-4">
						<DialogClose asChild>
							<Button variant="ghost">cancel</Button>
						</DialogClose>

						<Button type="submit" disabled={editTagAction.isLoading}>
							{editTagAction.isLoading ? "saving..." : "save"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
