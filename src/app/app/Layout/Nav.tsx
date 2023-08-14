"use client";

import { useIsBrowser, useIsSecondRender } from "@/lib/renderHooks";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
	{ id: "home", label: "home", href: "/app" },
	{ id: "stats", label: "stats", href: "/app/stats" },
	{ id: "tags", label: "tags", href: "/app/tags" },
	{ id: "tasks", label: "tasks", href: "/app/tasks" },
];

export function Nav() {
	const location = usePathname();
	const isBrowser = useIsBrowser();
	const isSecondRender = useIsSecondRender();

	const activeLinkId = isBrowser && links.find((link) => location === link.href)?.id;

	return (
		<div className="flex w-max rounded-2xl border p-2">
			{links.map((l) => (
				<Link
					key={l.id}
					href={l.href}
					className={cn(
						"relative flex h-10 w-full items-center justify-center rounded-lg px-4 py-2 outline-none outline-2 outline-offset-2 transition-[outline,opacity] duration-200 focus-visible:outline-gray-300"
					)}
				>
					<AnimatePresence>
						{activeLinkId === l.id && (
							<motion.div
								layoutId="active-indicator"
								className="absolute inset-0 w-full rounded-lg border-4"
								transition={{
									duration: 0.1,
									type: "spring",
									mass: 0.1,

									opacity: { duration: 0.5 },
								}}
								initial={{ opacity: isSecondRender ? 0 : 1 }}
								animate={{ opacity: 1 }}
							/>
						)}
					</AnimatePresence>

					<span className="relative text-sm">{l.label}</span>
				</Link>
			))}
		</div>
	);
}
