import { type ReactNode } from "react";
import { InitialAnimation } from "./Layout/Animation";
import { Nav } from "./Layout/Nav";
import { TopBar } from "./Layout/TopBar/TopBar";

export default function RootLayout(props: { children: ReactNode }) {
	return (
		<InitialAnimation>
			<main className="fixed h-full w-full">
				<div className="mx-auto flex h-full w-full max-w-[400px] flex-col items-center justify-center gap-2 p-4">
					<TopBar />

					<div className="h-full max-h-[500px] w-full overflow-hidden rounded-2xl border p-4">
						{props.children}
					</div>

					<Nav />
				</div>
			</main>
		</InitialAnimation>
	);
}
