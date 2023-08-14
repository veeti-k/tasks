"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

export function InitialAnimation(props: { children: ReactNode }) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.8, ease: "easeInOut" }}
		>
			{props.children}
		</motion.div>
	);
}
