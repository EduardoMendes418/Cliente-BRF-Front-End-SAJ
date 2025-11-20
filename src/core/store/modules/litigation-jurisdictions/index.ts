import { createSlice } from '@reduxjs/toolkit';

import { TComarca } from 'src/core/models/litigation-jurisdictions'

import { caseDefault } from '..';
import { TState } from 'src/core/models';
import { fetchComarca } from './thunks';

export type State = {
	list: TComarca[];
};

const initialState: TState & State = {
	status: 'initial',
	list: [],
};

const slice = createSlice({
	name: 'litigationJurisdictions',
	initialState,
	reducers: {
		reset: () => initialState,
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchComarca)
	},
});

export default slice;
