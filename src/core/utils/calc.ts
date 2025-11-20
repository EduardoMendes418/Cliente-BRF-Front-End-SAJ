import { toNumber } from "./func";

export const sum = (numbers: (string | number)[]) =>
	numbers.reduce((a: number, b) => a + toNumber(b), 0)

export const calcPercentage = (
	value: number | string,
	index: number | string
) => {
	const percentage = toNumber(index) / 100;
	const calc = toNumber(value) * percentage;
	return parseFloat(calc.toString()).toFixed(2);
};

export const calcBase = (
	value: number | string,
	index: number | string
) => {
	const percentage = toNumber(index) / 100;
	const calc = toNumber(value) / percentage;
	return parseFloat(calc.toString()).toFixed(2);
};
