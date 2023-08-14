import { useState } from "react";

export function useDialog(defaultOpen = false) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

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
