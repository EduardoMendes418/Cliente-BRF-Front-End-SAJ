import { createSlice } from '@reduxjs/toolkit';

import { TState } from 'src/core/models';

import { fetchBusinessCombinationAccountingList } from './thunks';
import { caseDefault, clears } from '..';
import { TBusinessCombinationAccounting } from '../../../models/business-combination-accounting';

export type TError = { detail: string };

export type State = {
	list: TBusinessCombinationAccounting[];
	error: TError;
};

const initialState: TState & State = {
	status: 'initial',
	error: {} as TError,
	list: [] as TBusinessCombinationAccounting[],
};

const slice = createSlice({
	name: 'businessCombinationAccounting',
	initialState,
	reducers: {
		...clears(initialState)
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchBusinessCombinationAccountingList)
	}
});

export default slice;
