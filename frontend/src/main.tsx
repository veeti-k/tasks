import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import { Entrypoint } from "./Entrypoint";
import { ApiProvider } from "./api";
import "./styles/fonts.scss";
import "./styles/misc.scss";
import "./styles/reset.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ApiProvider>
			<Toaster position="top-center" richColors theme="dark" />

			<BrowserRouter>
				<Entrypoint />
			</BrowserRouter>
		</ApiProvider>
	</React.StrictMode>
);
