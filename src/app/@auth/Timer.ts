import { type Tag, type Task } from "@/lib/db/schema";
import { atom, useAtom } from "jotai";

const selectedTag = atom<Tag | null>(null);
export function useSelectedTag() {
	return useAtom(selectedTag);
}

const activeTask = atom<Task | null>(null);
export function useActiveTask() {
	return useAtom(activeTask);
}

export function useTimer() {
	const [selectedTag, setSelectedTag] = useSelectedTag();
	const [activeTask, setActiveTask] = useActiveTask();
}
