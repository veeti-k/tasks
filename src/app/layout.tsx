import { Inter } from "next/font/google";
import { type ReactNode } from "react";
import { Providers } from "./app/Providers/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout(props: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>{props.children}</Providers>
			</body>
		</html>
	);
}

export const runtime = "edge";
