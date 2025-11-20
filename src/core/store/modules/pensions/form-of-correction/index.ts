import { createSlice } from '@reduxjs/toolkit';
import {
	fetchFormOfCorrection,
	editFormOfCorrection,
	deleteFormOfCorrection,
	addFormOfCorrection,
} from './thunks';
import { TFormOfCorrection } from 'src/core/models/pensions';
import { TState } from 'src/core/models';
import { caseDefault, caseDefaultRegister, clears } from '../..';

export type Error = {
	id?: number;
	error: { detail: string };
};

export type State = {
	list: TFormOfCorrection[];
	item: TFormOfCorrection;
};

const initialState: TState & State = {
	status: 'initial',
	list: [] as TFormOfCorrection[],
	item: {} as TFormOfCorrection,
	error: {} as Error,
};

const slice = createSlice({
	name: 'formOfCorrection',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, action) => {
			state.item = action.payload;
		},
	},
	extraReducers: ({ addCase }) => {

		caseDefault(addCase, fetchFormOfCorrection, (state, action) => {
			state.list = action.payload ?? [];
			state.item = action.payload.item ?? {};
			state.status = 'initial';
		});

		caseDefaultRegister(addCase, addFormOfCorrection, 'added')
		caseDefaultRegister(addCase, editFormOfCorrection, 'edited')
		caseDefaultRegister(addCase, deleteFormOfCorrection, 'deleted')

	},
});

export default slice;
