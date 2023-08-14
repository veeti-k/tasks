"use client";

import { type ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./ThemeProvider";

export function Providers(props: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<Toaster richColors position="top-center" />

			{props.children}
		</ThemeProvider>
	);
}
