import type { NextPage } from "next";

export type Page = NextPage & {
	requireAuth: boolean;
	requireAdmin: boolean;
};
