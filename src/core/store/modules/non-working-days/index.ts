import { createSlice } from '@reduxjs/toolkit';
import {
	fetchNonWorkingDays,
	fetchMonthNonWorkingDays,
	getNonWorkingDays,
	addNonWorkingDays,
	editNonWorkingDays,
	deleteNonWorkingDays,
} from './thunks';
import { TNonWorkingDays, TNonWorkingDaysFilters } from 'src/core/models/non-working-days';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';
import moment from 'moment';

export type TError = {
	detail: string;
};

export type State = {
	list: TNonWorkingDays[];
	listMonth: TNonWorkingDays[];
	currenYearMonth: [number, number];
	item: TNonWorkingDays;
	listFilters: TNonWorkingDaysFilters;
	error: TError
};

const m = moment()
const year = m.year()
const month = m.month() + 1

export const initialState: TState & State = {
	status: 'initial',
	list: [] as TNonWorkingDays[],
	listMonth: [] as TNonWorkingDays[],
	currenYearMonth: [year, month],
	item: {} as TNonWorkingDays,
	listFilters: { year, month } as TNonWorkingDaysFilters,
	error: {} as TError
};

const slice = createSlice({
	name: 'nonWorkingDays',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, { payload }) => {
			state.item = payload ?? {} as TNonWorkingDays
		},

		setFilters(state, { payload }) {
			state.listFilters = payload ?? {} as TNonWorkingDaysFilters
		},

		setCurrentYearMonth(state, { payload }) {
			state.currenYearMonth = payload ?? [year, month]
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchNonWorkingDays)
		caseDefault(addCase, fetchMonthNonWorkingDays, { listMonth: 'items' })
		caseDefault(addCase, getNonWorkingDays, 'item')
		caseDefaultRegister(addCase, addNonWorkingDays, 'added')
		caseDefaultRegister(addCase, editNonWorkingDays, 'edited')
		caseDefaultRegister(addCase, deleteNonWorkingDays, 'deleted')
	},
});

export default slice;
