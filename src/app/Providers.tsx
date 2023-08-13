"use client";

import { type ReactNode } from "react";
import { Toaster } from "sonner";

export function Providers(props: { children: ReactNode }) {
	return (
		<>
			<Toaster richColors position="top-center" />

			{props.children}
		</>
	);
}
