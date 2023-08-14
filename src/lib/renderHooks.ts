import { useEffect, useRef, useState } from "react";

export function useIsSecondRender() {
	useForceSecondRenderBecauseSSRIsStupid();
	const isInitialRender = useIsInitialRender();

	const isSecondRender = useRef(true);

	if (!isInitialRender && isSecondRender.current) {
		isSecondRender.current = false;
		return true;
	}

	return false;
}

export function useIsInitialRender() {
	const isFirstRender = useRef(true);

	if (isFirstRender.current) {
		isFirstRender.current = false;
		return true;
	}

	return false;
}

export function useIsBrowser() {
	const [isBrowser, setIsBrowser] = useState(false);

	useEffect(() => {
		setIsBrowser(true);
	}, []);

	return isBrowser;
}

export function useForceSecondRenderBecauseSSRIsStupid() {
	const [, setState] = useState(0);

	useEffect(() => {
		setState(1);
	}, []);
}
