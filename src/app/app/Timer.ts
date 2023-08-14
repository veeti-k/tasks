import { type Tag, type Task } from "@/lib/db/schema";
import { useSetInterval } from "@/lib/useSetInterval";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const selectedTag = atom<Tag | null>(null);
export function useSelectedTag() {
	return useAtom(selectedTag);
}

const activeTask = atom<Task | null>(null);
export function useActiveTask() {
	return useAtom(activeTask);
}

export function useTimerLoop() {
	const [selectedTag, setSelectedTag] = useSelectedTag();
	const [activeTask, setActiveTask] = useActiveTask();

	function updateTime() {}

	useEffect(updateTime, []);
	useSetInterval(updateTime, activeTask ? 1000 : null);
}
