import { createSlice } from '@reduxjs/toolkit';
import { fetchLogInterest } from './thunks';
import { TOptions, TState } from 'src/core/models';
import { caseDefault } from '..';

export type State = {
	list: TOptions[];
};

const initialState: State & TState = {
	status: 'initial',
	list: [],
	error: '',
};

const slice = createSlice({
	name: 'logInterest',
	initialState,
	reducers: {},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchLogInterest)
	},
});

export default slice;
