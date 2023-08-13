import { motion } from "framer-motion";
import { type ReactNode } from "react";

export function WithInitialAnimation(props: { children: ReactNode }) {
	return (
		<motion.div
			initial={{ height: 0, opacity: 0 }}
			animate={{ height: "auto", opacity: 1 }}
			exit={{ height: 0, opacity: 0 }}
			className="overflow-hidden"
		>
			<motion.div
				initial={{ backgroundColor: "rgba(210, 210, 210, 1)" }}
				animate={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
				transition={{ duration: 1.2 }}
			>
				{props.children}
			</motion.div>
		</motion.div>
	);
}
