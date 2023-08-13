import { CreateTag, Tags } from "./Tags";
import { getTags } from "./tagActions";

export default async function Page() {
	const tags = await getTags();

	return (
		<div className="flex flex-col gap-3">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-medium">tags</h2>

				<CreateTag />
			</div>

			<Tags tags={tags} />
		</div>
	);
}
