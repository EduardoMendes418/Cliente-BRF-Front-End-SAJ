import { createSlice } from '@reduxjs/toolkit';
import { fetchLitigationActionAppealProceduralIssueType } from './thunks';
import { TOptions } from 'src/core/models';
import { caseDefault } from '..';

export type State = {
	list: TOptions[];
};

const initialState: State = {
	list: [],
};

const slice = createSlice({
	name: 'litigationActionAppealProceduralIssueType',
	initialState,
	reducers: {},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchLitigationActionAppealProceduralIssueType)
	},
});

export default slice;
