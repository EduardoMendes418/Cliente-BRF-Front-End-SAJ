import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	addLegalDocPowerTypes,
	editLegalDocPowerTypes,
	fetchLegalDocPowerTypes,
	getLegalDocPowerTypes,
} from './thunks';
import { TLegalDocPowerType, TLegalDocPowerTypeFilter } from 'src/core/models/legal-document-power-types';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = { detail: string }

export type TLegalDocPowerTypesState = {
	list: TLegalDocPowerType[];
	item?: TLegalDocPowerType;
	listFilters: TLegalDocPowerTypeFilter;
	error?: TError
};

const initialState: TState & TLegalDocPowerTypesState = {
	status: 'initial',
	list: [],
	item: undefined,
	listFilters: {} as TLegalDocPowerTypeFilter,
};

const slice = createSlice({
	name: 'legalDocPowerTypes',
	initialState,
	reducers: {
		...clears(initialState),

		setItem: (state, action: PayloadAction<TLegalDocPowerType>) => {
			state.item = action.payload;
		},

		setFilters: (state, { payload }: PayloadAction<TLegalDocPowerTypeFilter>) => {
			state.listFilters = payload
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchLegalDocPowerTypes)
		caseDefault(addCase, getLegalDocPowerTypes, 'item')
		caseDefaultRegister(addCase, addLegalDocPowerTypes, 'added')
		caseDefaultRegister(addCase, editLegalDocPowerTypes, 'edited')
	},
});

export default slice;
