import { Navigate, Route, Routes } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

import { AppLayout } from "./App/AppLayout";
import { AppPage } from "./App/AppPage";
import { AppSettingsPage } from "./App/AppSettings/AppSettings";
import { StatsPage } from "./App/StatsPage/StatsPage";
import { TagsPage } from "./App/TagsPage";

export function AuthenticatedApp() {
	return (
		<div className="fixed h-full w-full">
			<AppRoutes />
		</div>
	);
}

function AppRoutes() {
	return (
		<Routes>
			<Route path="/app" element={<AppLayout />}>
				<Route index element={<AppPage />} />
				<Route path="stats" element={<StatsPage />} />
				<Route path="tags" element={<TagsPage />} />
				<Route path="settings" element={<AppSettingsPage />} />
			</Route>

			<Route path="*" element={<Navigate to="/app" />} />
		</Routes>
	);
}

if ("serviceWorker" in navigator) {
	registerSW();
}