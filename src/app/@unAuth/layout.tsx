import { type ReactNode } from "react";

export default function Layout(props: { children: ReactNode }) {
	return (
		<main className="fixed h-full w-full">
			<div className="mx-auto flex h-full w-full max-w-[200px] flex-col items-center justify-center gap-6">
				<h1 className="text-2xl font-medium">tasks / login</h1>

				{props.children}
			</div>
		</main>
	);
}
