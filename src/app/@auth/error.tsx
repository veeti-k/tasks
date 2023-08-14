"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function Error(props: { error: Error; reset: () => void }) {
	useEffect(() => {
		toast.error(props.error.message, { duration: 3000 });
		props.reset();
	}, []);
}
