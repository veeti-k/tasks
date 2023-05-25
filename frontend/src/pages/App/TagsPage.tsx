import { useLiveQuery } from "dexie-react-hooks";

import { db } from "@/db/db";

import { NewTag } from "./TagsPage/NewTag";
import { Tag } from "./TagsPage/Tag";
import { WithAnimation } from "./WithAnimation";

export function TagsPage() {
	const tags = useLiveQuery(() => db.tags.toArray());

	const tasks = useLiveQuery(() => db.tasks.toArray());

	const tagsWithTaskAmount = tags?.map((tag) => ({
		...tag,
		taskAmount: tasks?.filter((t) => t.tag_id === tag.id).length,
	}));

	return (
		<WithAnimation>
			<div className="sticky top-0 flex items-center justify-between border-b-2 border-b-gray-800 bg-gray-900 p-2">
				<h1 className="text-xl font-bold">Tags</h1>
				<div>
					<NewTag />
				</div>
			</div>

			<div className="flex flex-col">
				{tagsWithTaskAmount?.map((tag) => (
					<Tag key={tag.id} tag={tag} />
				))}
			</div>
		</WithAnimation>
	);
}