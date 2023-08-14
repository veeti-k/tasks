"use client";

import { useTransition } from "react";
import { type returnMsg } from "./utils";

export function useAction<TActionProps>(
	action: (actionProps: TActionProps) => Promise<ReturnType<typeof returnMsg> | undefined>,
	opts?: {
		onSuccess?: (res: ReturnType<typeof returnMsg>) => void;
		onError?: (res: ReturnType<typeof returnMsg> | undefined) => void;
	}
) {
	const [isPending, startTransition] = useTransition();

	return {
		trigger: (actionProps: TActionProps) => {
			startTransition(async () => {
				const res = await action(actionProps);

				if (res?.type === "success") {
					opts?.onSuccess?.(res);
				} else {
					opts?.onError?.(res);
				}
			});
		},
		isLoading: isPending,
	};
}
