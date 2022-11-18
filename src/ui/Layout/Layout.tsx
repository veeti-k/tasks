import type { ReactNode } from "react";

import { NavBar } from "./Navbar";

type Props = {
	children: ReactNode;
};

export const Layout = ({ children }: Props) => {
	return (
		<>
			<NavBar />

			<main className="mx-auto max-w-page px-3 pb-[6rem] pt-[5rem] sm:pt-[7rem]">
				{children}
			</main>
		</>
	);
};
