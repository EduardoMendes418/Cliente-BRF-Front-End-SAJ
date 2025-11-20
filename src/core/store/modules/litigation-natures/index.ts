import { createSlice } from '@reduxjs/toolkit';
import { fetchLitigationNatures } from './thunks';
import { TOptions } from 'src/core/models';
import { caseDefault } from '..';

export type State = {
	list: TOptions[];
};

const initialState: State = {
	list: [],
};

const slice = createSlice({
	name: 'litigationNatures',
	initialState,
	reducers: {},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchLitigationNatures)
	},
});

export default slice;
