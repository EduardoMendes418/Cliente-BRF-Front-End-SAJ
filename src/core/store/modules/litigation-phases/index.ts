import { createSlice } from '@reduxjs/toolkit';
import { fetchLitigationPhases } from './thunks';
import { TOptions } from 'src/core/models';
import { caseDefault } from '..';

export type State = {
	list: TOptions[];
};

const initialState: State = {
	list: [],
};

const slice = createSlice({
	name: 'litigationPhases',
	initialState,
	reducers: {},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchLitigationPhases)
	},
});

export default slice;
