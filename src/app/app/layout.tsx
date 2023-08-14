import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { getUserId } from "../login/action";
import { InitialAnimation } from "./Layout/Animation";
import { Nav } from "./Layout/Nav";
import { TopBar } from "./Layout/TopBar/TopBar";

export default async function RootLayout(props: { children: ReactNode }) {
	const userId = await getUserId();

	if (!userId) {
		redirect("/login");

		return null;
	}

	return (
		<InitialAnimation>
			<main className="fixed flex h-full w-full items-center justify-center">
				<div className="flex w-full max-w-[400px] flex-col items-center justify-center gap-2 p-4">
					<TopBar />

					<div className="w-full overflow-hidden rounded-2xl border p-4">
						{props.children}
					</div>

					<Nav />
				</div>
			</main>
		</InitialAnimation>
	);
}
