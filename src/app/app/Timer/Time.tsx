"use client";

import { AnimatePresence, motion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect } from "react";
import { useSeconds } from "./timerState";

const fontSize = 80;
const height = fontSize;

function getMinutesAndSeconds(seconds: number) {
	return {
		minutes: Math.floor(seconds / 60),
		seconds: seconds % 60,
	};
}

export function Time() {
	const [seconds] = useSeconds();

	const time = getMinutesAndSeconds(seconds);

	return (
		<div
			style={{ fontSize }}
			className="flex items-center justify-center overflow-hidden leading-none"
		>
			<AnimatePresence initial={false}>
				{time.minutes >= 100 && (
					<motion.div
						className="overflow-hidden"
						initial={{ opacity: 0, width: 0 }}
						animate={{ opacity: 1, width: "auto" }}
						exit={{ opacity: 0, width: 0 }}
					>
						<Digit place={100} value={time.minutes} />
					</motion.div>
				)}
			</AnimatePresence>

			<Digit place={10} value={time.minutes} />
			<Digit place={1} value={time.minutes} />
			<span>:</span>
			<Digit place={10} value={time.seconds} />
			<Digit place={1} value={time.seconds} />
		</div>
	);
}

export function Digit(props: { place: number; value: number }) {
	const valueRoundedToPlace = Math.floor(props.value / props.place);
	const animatedValue = useSpring(valueRoundedToPlace, { duration: 150, mass: 0.05 });

	useEffect(() => {
		animatedValue.set(valueRoundedToPlace);
	}, [animatedValue, valueRoundedToPlace]);

	return (
		<div style={{ height }} className="relative w-[1ch] tabular-nums">
			{[...Array(10).keys()].map((i) => (
				<Number key={i} mv={animatedValue} number={i} />
			))}
		</div>
	);
}

function Number(props: { mv: MotionValue; number: number }) {
	const y = useTransform(props.mv, (latest) => {
		const placeValue = latest % 10;
		const offset = (10 + props.number - placeValue) % 10;

		let memo = offset * height;

		if (offset > 5) {
			memo -= 10 * height;
		}

		return memo;
	});

	return (
		<motion.span style={{ y }} className="absolute inset-0 flex items-center justify-center">
			{props.number}
		</motion.span>
	);
}
