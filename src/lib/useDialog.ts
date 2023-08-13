import { useState } from "react";

export function useDialog() {
	const [isOpen, setIsOpen] = useState(false);

	function open() {
		setIsOpen(true);
	}

	function close() {
		setIsOpen(false);
	}

	return {
		props: {
			open: isOpen,
			onOpenChange: setIsOpen,
		},
		open,
		close,
	};
}
