"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function ToastProvider() {
	const { theme } = useTheme();

	return (
		<>
			{/* @ts-expect-error no time for these */}
			<Toaster richColors theme={theme} position="top-center" />
		</>
	);
}
