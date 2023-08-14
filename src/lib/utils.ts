import { createId as createCuid } from "@paralleldrive/cuid2";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function createId() {
	return createCuid();
}

export function returnMsg(msg: string | null, type: "error" | "success") {
	return {
		msg,
		type,
	};
}

export function returnErr(msg: string | null) {
	return returnMsg(msg, "error");
}

export function returnSuccess(msg: string | null) {
	return returnMsg(msg, "success");
}

export function errorToast(msg: string, errorMsg?: string | null) {
	toast.error(`${msg}${errorMsg ? ` - ${errorMsg}` : ""}`);
}
