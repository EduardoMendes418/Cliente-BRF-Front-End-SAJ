import { createSlice } from '@reduxjs/toolkit';
import { fetchSapHierarchy } from './thunks';
import { TSapHierarchy } from '../../../models/hierarchy';
import { TState } from 'src/core/models';
import { caseDefault, clears } from '..';

export type Error = {
	id?: number;
	error: string;
};

export type State = {
	item: TSapHierarchy;
	error: Error;
};

const initialState: TState & State = {
	status: 'initial',
	item: {} as TSapHierarchy,
	error: {} as Error,
};

const slice = createSlice({
	name: 'sapHierarchy',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, action) => {
			state.item = action.payload;
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchSapHierarchy, 'item')
	},
});

export default slice;
