export type TRange = {
	initialValue: number;
	finalValue: number;
	aliquot: number;
}

export type TTaxRatesINSS = {
	id?: number;
	initialDate: string | null;
	finalDate: string | null;
	taxRatesINSSValues: TRange[];
}

export type TTaxRatesINSSFilters = {
	initialDate?: string | null;
	finalDate?: string | null;
	searchPeriodDate?: string | null;
}