export type TRange = {
	initialValue: number;
	finalValue: number;
	aliquot: number;
	portion: number;
}

export type TIncomeTaxRates = {
	id?: number;
	initialDate: string | null;
	finalDate: string | null;
	incomeTaxRateValues: TRange[]
}

export type TIncomeTaxRatesFilters = {
	initialDate?: string | null;
	finalDate?: string | null;
	searchPeriodDate?: string | null;
}