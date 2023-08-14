import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
	return (
		<div className="flex w-full rounded-2xl border p-3">
			<ThemeToggle />
		</div>
	);
}
