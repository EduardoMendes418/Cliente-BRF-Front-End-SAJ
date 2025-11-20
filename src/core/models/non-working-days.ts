import { TSystemDate } from "."

export type TNonWorkingDays = {
	id?: number;
	description: string;
	date: TSystemDate;
}

export type TNonWorkingDaysFilters = {
	date?: TSystemDate;
	description?: string;
	year?: number;
	month?: number;
}