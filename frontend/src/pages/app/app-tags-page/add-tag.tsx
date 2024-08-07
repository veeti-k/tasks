import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import { SpinnerButton } from "@/components/spinner-button";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAddTag } from "@/lib/api/tags";
import { getTagColorName, tagColors } from "@/lib/api/types";
import { errorToast } from "@/lib/error-toast";
import { useDialog } from "@/lib/hooks/use-dialog";

const newTagFormSchema = v.object({
	label: v.pipe(v.string(), v.minLength(1, "required")),
	color: v.picklist(tagColors, "required"),
});

export function AddTag() {
	const dialog = useDialog();

	return (
		<Dialog {...dialog.props}>
			<DialogTrigger asChild>
				<Button className="w-full">add tag</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogTitle>add tag</DialogTitle>

				<AddTagForm onSuccess={dialog.close} />
			</DialogContent>
		</Dialog>
	);
}

function AddTagForm({ onSuccess }: { onSuccess: () => void }) {
	const mutation = useAddTag();

	const form = useForm<v.InferOutput<typeof newTagFormSchema>>({
		resolver: valibotResolver(newTagFormSchema),
		defaultValues: { label: "" },
	});

	function onSubmit(values: v.InferOutput<typeof newTagFormSchema>) {
		mutation.mutateAsync(values, { onSuccess }).catch(errorToast("error adding tag"));
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="label"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel required>label</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="color"
					render={({ field }) => (
						<FormItem>
							<FormLabel required>color</FormLabel>

							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="select a color" />
									</SelectTrigger>
								</FormControl>

								<SelectContent>
									{tagColors.map((color) => (
										<SelectItem key={color} value={color}>
											<div className="space-x-2 flex items-center">
												<div
													aria-hidden
													className={`w-3 h-3 rounded-full`}
													style={{ backgroundColor: color }}
												/>
												<p>{getTagColorName(color)}</p>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="float-right space-x-3">
					<DialogClose asChild>
						<Button variant="ghost">cancel</Button>
					</DialogClose>

					<SpinnerButton type="submit" spin={mutation.isPending}>
						add
					</SpinnerButton>
				</div>
			</form>
		</Form>
	);
}
