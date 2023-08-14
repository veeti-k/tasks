"use client";

import { type Tag } from "@/lib/db/schema";
import { atom, useAtom } from "jotai";

const secondsAtom = atom(0);
export function useSeconds() {
	return useAtom(secondsAtom);
}

export const selectedTagAtom = atom<Tag | null>(null);
export function useSelectedTag() {
	return useAtom(selectedTagAtom);
}
