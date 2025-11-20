import { createSlice } from '@reduxjs/toolkit';
import { TRequisition, TRequisitionsFilters } from 'src/core/models/requisitions';
import { TDataImportFeedbackLineError } from 'src/core/models/data-import';
import { TState } from 'src/core/models';
import {
	fetchRequisitions,
	getRequisitions,
	addRequisitions,
	editRequisitions,
	getDeadlineDateRequisitions,
	cancelRequisition,
	getRequisitionForServiceById,
	rollbackRequisitionStatusIfNeeded
} from './thunks'
import { caseDefault, caseDefaultRegister, clears } from '../';

export type TError = { detail: string, logs?: TDataImportFeedbackLineError[] };

export type State = {
	list: TRequisition[];
	item: TRequisition;
	listFilters: { [page: string]: TRequisitionsFilters };
	error: TError;
	deadlineDate: string;
	rollbackStatusIfCancel?: boolean;
};

const initialState: TState & State = {
	status: 'initial',
	list: [] as TRequisition[],
	item: {} as TRequisition,
	listFilters: {} as { [page: string]: TRequisitionsFilters},
	error: {} as TError,
	deadlineDate: '',
	rollbackStatusIfCancel: false
};

const slice = createSlice({
	name: 'requisitions',
	initialState,
	reducers: {
		...clears(initialState),
		
		cleanFilter(state) {
			state.listFilters = initialState.listFilters;
		},

		setFilters(state, { payload }) {
			state.listFilters[payload.page] = payload.filters;
		},
		
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchRequisitions)
		caseDefault(addCase, getRequisitions, 'item')
		caseDefault(addCase, getRequisitionForServiceById, 'item')
		caseDefaultRegister(addCase, addRequisitions, 'added')
		caseDefaultRegister(addCase, editRequisitions, 'edited')
		caseDefaultRegister(addCase, cancelRequisition, 'edited')
		caseDefault(addCase, getDeadlineDateRequisitions, (state, action) => {
			state.deadlineDate = action.payload ?? '';
		})
		addCase(rollbackRequisitionStatusIfNeeded.pending, (state) => {
			state.rollbackStatusIfCancel =  true;
		});
		addCase(rollbackRequisitionStatusIfNeeded.fulfilled, (state, action) => {
			state.rollbackStatusIfCancel = false;
		});
		addCase(rollbackRequisitionStatusIfNeeded.rejected, (state, action) => {
			state.rollbackStatusIfCancel = false;
		});
	},
});

export default slice;
