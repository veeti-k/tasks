import { Outlet } from "react-router-dom";

import classes from "./app-layout.module.scss";
import { Nav } from "./nav";

export function AppLayout() {
	return (
		<div className={classes.container}>
			<div className={classes.main}>
				<Outlet />
			</div>

			<Nav />
		</div>
	);
}
