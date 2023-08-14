"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";

export function Providers(props: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<ToastProvider />

			{props.children}
		</ThemeProvider>
	);
}
