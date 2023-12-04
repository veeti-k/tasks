import { type ComponentPropsWithoutRef, type ReactNode, forwardRef } from "react";

import { cn } from "@/lib/utils";

import classes from "./page-layout.module.scss";

export function PageLayout({ children }: { children: ReactNode }) {
	return <div className={classes.pageLayout}>{children}</div>;
}

const Title = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<"h1">>(
	({ className, ...props }, ref) => {
		return <h1 ref={ref} {...props} className={cn(className, classes.title)} />;
	}
);
Title.displayName = "Title";

const Footer = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
	({ className, ...props }, ref) => {
		return <div ref={ref} className={cn(classes.footer, className)} {...props} />;
	}
);
Footer.displayName = "Footer";

PageLayout.Title = Title;
PageLayout.Footer = Footer;
