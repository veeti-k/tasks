export function cn(...inputs: Array<string | number | boolean | null | undefined>) {
	return inputs.filter(Boolean).join(" ");
}
