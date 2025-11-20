import { createSlice } from '@reduxjs/toolkit';
import {
	fetchGuaranteeModality,
	getGuaranteeModality,
	addGuaranteeModality,
	editGuaranteeModality,
	TGuaranteeModalityParams,
} from './thunks';
import { TGuaranteeModality } from 'src/core/models/guarantee-modality';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = {
	detail: string;
};

export type State = {
	list: TGuaranteeModality[];
	item: TGuaranteeModality;
	error: TError;
	listFilters: TGuaranteeModalityParams
};

const initialState: TState & State = {
	status: 'initial',
	list: [] as TGuaranteeModality[],
	item: {} as TGuaranteeModality,
	error: {} as TError,
	listFilters: {} as TGuaranteeModalityParams,
};

const slice = createSlice({
	name: 'guaranteeModality',
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
		caseDefault(addCase, fetchGuaranteeModality)
		caseDefault(addCase, getGuaranteeModality, 'item')
		caseDefaultRegister(addCase, addGuaranteeModality, 'added')
		caseDefaultRegister(addCase, editGuaranteeModality, 'edited')
	},
});

export default slice;
