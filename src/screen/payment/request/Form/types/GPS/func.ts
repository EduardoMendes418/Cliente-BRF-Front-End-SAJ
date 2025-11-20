import { TRange } from 'src/core/models/tax-rates-inss';

const getCapValue = (ranges: TRange[]): number => {
	const finalValues = ranges.map(range => range.finalValue)
	return Math.max(...finalValues)
}

const getRangeByMaximumAliquot = (ranges: TRange[]): TRange => {
	const range = ranges.reduce((previousRange, currentRange) => currentRange.aliquot > previousRange.aliquot ? currentRange : previousRange, ranges[0])
	return range
}

const getRangeByCalculationBaseValue = (ranges: TRange[], calculationBaseValue: number): TRange => {
	const range = ranges.find(range => calculationBaseValue >= range.initialValue && calculationBaseValue <= range.finalValue)
	return range ?? getRangeByMaximumAliquot(ranges)
}

export const calculateComplainantINSSValue = (calculationBaseValue: number, ranges: TRange[]): number => {
	if (!ranges) return 0
	const range = getRangeByCalculationBaseValue(ranges, calculationBaseValue)
	const capValue = getCapValue(ranges)
	return (calculationBaseValue > capValue ? capValue : calculationBaseValue) * range.aliquot / 100
}

export const calculateClaimedINSSValue = (calculationBaseValue: number, mainPercentage: number, rat: number, adjustedRat: number) => {
	return calculationBaseValue * (mainPercentage / 100 + rat / 100 * adjustedRat)
}

export const calculateBaseValue = (complainantINSSValue: number, mainPercentage: number, rat: number, adjustedRat: number ) => {
	return complainantINSSValue / (mainPercentage / 100 + rat / 100 * adjustedRat)
}

export const getAliquotByCalculationBaseValue = (ranges: TRange[], calculationBaseValue: number) => {
	if (!ranges) return 0
	const range = getRangeByCalculationBaseValue(ranges, calculationBaseValue)
	return range.aliquot
}