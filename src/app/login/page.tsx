"use client";

import { Button } from "@/components/ui/button";
import { clientConf } from "@/lib/clientConfig";
import { useAction } from "@/lib/useAction";
import { useEffect } from "react";
import { authenticate } from "./action";

export default function Page(props: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const action = useAction(authenticate);

	const code = props.searchParams.code as string | undefined;

	useEffect(() => {
		if (code) {
			action.trigger(code);
		}
	}, [code]);

	return (
		<>
			{action.isLoading && <span>logging in...</span>}

			<Button asChild>
				<a href={getGoogleUrl()}>login with google</a>
			</Button>
		</>
	);
}

function getGoogleUrl() {
	const params = new URLSearchParams({
		client_id: clientConf.NEXT_PUBLIC_G_CLIENT_ID,
		redirect_uri: clientConf.NEXT_PUBLIC_G_REDIRECT_URI,
		response_type: "code",
		scope: "email",
		prompt: "select_account",
	});

	return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
