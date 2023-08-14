import { Inter } from "next/font/google";
import { type ReactNode } from "react";
import { Providers } from "./Providers/Providers";
import { Nav } from "./RootLayout/Nav";
import { TopBar } from "./RootLayout/TopBar/TopBar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout(props: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>
					<main className="fixed h-full w-full">
						<div className="mx-auto flex h-full w-full max-w-[400px] flex-col items-center justify-center gap-2 p-4">
							<TopBar />

							<div className="h-full max-h-[500px] w-full overflow-hidden rounded-2xl border p-4">
								{props.children}
							</div>

							<Nav />
						</div>
					</main>
				</Providers>
			</body>
		</html>
	);
}

export const runtime = "edge";
