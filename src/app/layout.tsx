import { Inter } from "next/font/google";
import { type ReactNode } from "react";
import { Providers } from "./Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout(props: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>
					<main className="max-w-md mx-auto mt-12">{props.children}</main>
				</Providers>
			</body>
		</html>
	);
}

export const runtime = "edge";
