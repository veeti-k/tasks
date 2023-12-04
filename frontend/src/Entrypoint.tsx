import { AnimatePresence, motion } from "framer-motion";

import classes from "./entrypoint.module.scss";
import { AuthenticatedApp } from "./pages/authenticated-app";
import { UnauthenticatedApp } from "./pages/unauthenticated-app";
import { useAuth } from "./utils/api/auth";

export function Entrypoint() {
	const auth = useAuth();

	if (auth.isLoading) {
		return null;
	}

	return (
		<AnimatePresence mode="wait">
			{auth.data ? (
				<motion.div
					key="app"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.7, ease: "easeInOut" }}
					className={classes.wrapper}
				>
					<AuthenticatedApp />
				</motion.div>
			) : (
				<motion.div
					key="auth"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0, transition: { duration: 0.5 } }}
					transition={{ duration: 0.7, ease: "easeInOut" }}
					className={classes.wrapper}
				>
					<UnauthenticatedApp />
				</motion.div>
			)}
		</AnimatePresence>
	);
}
