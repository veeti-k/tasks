"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type Tag } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TagSelector(props: { tags: Tag[] }) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");
	const [search, setSearch] = useState("");

	const router = useRouter();

	const tags = props.tags.map((tag) => ({ label: tag.name, value: tag.id, color: tag.color }));

	const filtered = tags.filter(
		(tag) => tag.label.toLowerCase().indexOf(search.toLowerCase()) !== -1
	);

	const showCreate = search.length && !filtered.length;
	const selectedTag = tags.find((tag) => tag.value === value);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{selectedTag ? (
						<div className="flex items-center gap-4">
							<div
								className="h-3.5 w-3.5 rounded-full"
								style={{ backgroundColor: selectedTag.color }}
							/>
							<span>{selectedTag.label}</span>
						</div>
					) : (
						"select tag"
					)}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command shouldFilter={false}>
					<CommandInput
						placeholder="search tag..."
						value={search}
						onValueChange={setSearch}
					/>
					<CommandEmpty
						onSelect={() => {
							console.log("no tag found");
						}}
					>
						no tag found
					</CommandEmpty>
					<CommandGroup>
						{(search.length ? filtered : tags).map((tag) => (
							<CommandItem
								key={tag.value}
								value={tag.value}
								onSelect={(currentValue) => {
									setValue(currentValue);
									setOpen(false);
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										value === tag.value ? "opacity-100" : "opacity-0"
									)}
								/>
								<div className="flex items-center gap-3">
									<div
										className="h-3.5 w-3.5 rounded-full"
										style={{ backgroundColor: tag.color }}
									/>
									<span>{tag.label}</span>
								</div>
							</CommandItem>
						))}

						{!!showCreate && (
							<CommandItem
								onSelect={() => {
									router.push(`/app/tags?create-tag=1&name=${search}`);
								}}
								className="truncate"
							>
								{`create "${search}"`}
							</CommandItem>
						)}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
