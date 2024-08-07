import { SpinnerButton } from "@/components/spinner-button";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { type ApiTaskWithTag, useDeleteTask } from "@/lib/api/tasks";
import { errorToast } from "@/lib/error-toast";
import { useDialog } from "@/lib/hooks/use-dialog";

import { BaseTask } from "./base-task";

export function DeleteTask({ task, onSuccess }: { task: ApiTaskWithTag; onSuccess: () => void }) {
	const dialog = useDialog();
	const mutation = useDeleteTask();

	function onConfirm() {
		mutation
			.mutateAsync(
				{ taskId: task.id },
				{
					onSuccess: () => {
						dialog.close();
						onSuccess();
					},
				}
			)
			.catch(errorToast("error deleting task"));
	}

	return (
		<Dialog {...dialog.props}>
			<DialogTrigger asChild>
				<DropdownMenuItem
					onSelect={(e) => {
						e.preventDefault();
						dialog.open();
					}}
				>
					delete
				</DropdownMenuItem>
			</DialogTrigger>

			<DialogContent>
				<DialogTitle>delete task</DialogTitle>

				<div className="space-y-3">
					<DialogDescription>
						are you sure you want to delete this task?
					</DialogDescription>

					<div className="flex gap-3 p-3 items-center border rounded-md bg-card-item">
						<BaseTask task={task} />
					</div>
				</div>

				<div className="flex justify-end gap-3">
					<DialogClose asChild>
						<Button variant="ghost">cancel</Button>
					</DialogClose>

					<SpinnerButton
						type="submit"
						variant="destructive"
						spin={mutation.isPending}
						onClick={onConfirm}
					>
						delete
					</SpinnerButton>
				</div>
			</DialogContent>
		</Dialog>
	);
}
