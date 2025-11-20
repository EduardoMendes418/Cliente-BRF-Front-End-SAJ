import { createSlice } from '@reduxjs/toolkit';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';
import { addCircularizationOfficeResponsibleConfiguration, fetchCircularizationOfficeResponsibleConfiguration, fetchCircularizationOffices } from './thunks';

export type TError = {
	detail: string;
};

export type State = {
	list: any[];
	item: any;
	error: TError;
	listFilters: any;
	officesList: any[];
};

const initialState: TState & State = {
	status: 'initial',
	list: [] as any[],
	item: {} as any,
	error: {} as TError,
	listFilters: {} as any,
	officesList: [] as any[]
};

const slice = createSlice({
	name: 'circularizationOfficeResponsibleConfiguration',
	initialState,
	reducers: {
		...clears(initialState),

		setItem: (state, action) => {
			state.item = action.payload;
		},

		setFilters: (state, { payload }) => {
			state.listFilters = payload
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchCircularizationOfficeResponsibleConfiguration)
		caseDefaultRegister(addCase, addCircularizationOfficeResponsibleConfiguration, 'added')
		caseDefault(addCase, fetchCircularizationOffices, 'officesList')
	},
});

export default slice;