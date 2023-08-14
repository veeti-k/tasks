import { motion, type MotionProps } from "framer-motion";
import { useTheme } from "next-themes";
import { type HTMLAttributes } from "react";

export function WithInitialAnimation(props: MotionProps & HTMLAttributes<HTMLDivElement>) {
	const { forcedTheme } = useTheme();

	return (
		<motion.div
			initial={{ height: 0, opacity: 0 }}
			animate={{ height: "auto", opacity: 1 }}
			exit={{ height: 0, opacity: 0 }}
			className="overflow-hidden"
		>
			<motion.div
				initial={{
					backgroundColor:
						forcedTheme === "light" ? "rgba(210, 210, 210, 1)" : "rgba(50, 50, 50, 1)",
				}}
				animate={{
					backgroundColor:
						forcedTheme === "light" ? "rgba(255, 255, 255, 0)" : "rgba(0, 0, 0, 0)",
				}}
				transition={{ duration: 1.2 }}
				{...props}
			>
				{props.children}
			</motion.div>
		</motion.div>
	);
}
