import { CreateTag, Tags } from "./Tags";
import { getTags } from "./tagActions";

export default async function Page() {
	const tags = await getTags();

	return (
		<div className="flex h-full min-h-main w-full flex-col gap-2">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-medium">tags</h2>

				<CreateTag />
			</div>

			<Tags tags={tags} />
		</div>
	);
}
