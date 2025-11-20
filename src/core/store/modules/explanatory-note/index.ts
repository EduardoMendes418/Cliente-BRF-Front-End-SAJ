import { createSlice } from '@reduxjs/toolkit';
import {
	fetchExplanatoryNote,
	getExplanatoryNote,
	addExplanatoryNote,
	editExplanatoryNote,
} from './thunks';
import { TExplanatoryNoteFilter, TExplanatoryNote } from 'src/core/models/explanatory-note';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = {
	id?: number;
	error: { detail: string };
};

export type TExplanatoryNoteState = {
	list: TExplanatoryNote[];
	item?: TExplanatoryNote;
	listFilters: TExplanatoryNoteFilter;
};

const initialState: TState & TExplanatoryNoteState = {
	status: 'initial',
	list: [],
	item: {} as TExplanatoryNote,
	error: {} as TError,
	listFilters: {} as TExplanatoryNoteFilter,
};

const slice = createSlice({
	name: 'explanatoryNote',
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
		caseDefault(addCase, fetchExplanatoryNote)
		caseDefault(addCase, getExplanatoryNote, 'item')
		caseDefaultRegister(addCase, addExplanatoryNote, 'added')
		caseDefaultRegister(addCase, editExplanatoryNote, 'edited')
	},
});

export default slice;
