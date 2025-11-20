import { TDataImportFeedbackLineError } from "src/core/models/data-import";
import { clears, caseDefault } from '..';
import { createSlice } from '@reduxjs/toolkit';
import {fetchProvisionAccounting} from "./thunks"

export type State = {
	lineErrorsFeedback: TDataImportFeedbackLineError[] | any; 
	status: 'initial' | 'saving' | 'imported' | 'failure' | 'fetching';
	error: string;
	listFilters: any
	list: any
}

const initialState: State = {
	status: 'initial',
	lineErrorsFeedback: [],
	listFilters: {},
	error: '',
	list: [] as any[]
};


const slice = createSlice({
	name: 'provisionAccounting',
	initialState,
	reducers: {
		...clears(initialState),
		setLineErrorsFeedback (state, {payload}) {
			state.lineErrorsFeedback = payload
		},
		setFilters(state, { payload }) {
			state.listFilters = payload;
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchProvisionAccounting)
	},
});

export default slice;