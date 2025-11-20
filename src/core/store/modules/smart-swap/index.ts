import { createSlice } from '@reduxjs/toolkit';
import { TSmartSwapItem, TSmartSwapFilter, TSmartSwapChangingParamsForm } from 'src/core/models/smart-swap';
import { TState } from 'src/core/models';
import { fetchSmartSwap, updateSmartSwap, exportSmartSwap, reprocessSmartSwap } from './thunks'
import { caseDefault, caseDefaultRegister, clears } from '../';
import { TDataImportFeedbackLineError } from 'src/core/models/data-import';


export type TError = { detail: string };

export type State = {
	smartSwapId: string;
	list: TSmartSwapItem[];
	listFilters: TSmartSwapFilter;
	error: TError;
	lineErrorsFeedback: TDataImportFeedbackLineError[];
	editPanel?: TSmartSwapChangingParamsForm
};

const initialState: TState & State = {
	status: 'initial',
	smartSwapId: '',
	list: [] as TSmartSwapItem[],
	listFilters: {} as TSmartSwapFilter,
	error: {} as TError,
	lineErrorsFeedback: [],
};

const slice = createSlice({
	name: 'smartSwap',
	initialState,
	reducers: {
		...clears(initialState),

		setFilters(state, { payload }) {
			state.listFilters = payload ?? {};
		},
		setEditPanel(state, { payload }) {
			state.editPanel = payload;
		},
		clearList(state) {
			state.list = []
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchSmartSwap, (state, action) => {
			state.smartSwapId = action.payload.smartSwapId;
			state.list = action.payload.items;
		})
		caseDefaultRegister(addCase, exportSmartSwap, 'initial')

		addCase(updateSmartSwap.pending, (state: TState) => {
			state.status = 'saving';
		});
		addCase(updateSmartSwap.fulfilled, (state: any, action: any) => {
			state.status = 'imported';
			state.lineErrorsFeedback = action.payload?.logs ?? [];
		});
		addCase(updateSmartSwap.rejected, (state: TState & { lineErrorsFeedback: TDataImportFeedbackLineError[] }, action: any) => {
			state.status = 'failure';
			state.lineErrorsFeedback = action.payload?.logs;
			state.error = action.payload?.logs?.length > 0 ? undefined : action.payload;
		});
		
		addCase(reprocessSmartSwap.pending, (state: TState) => {
			state.status = 'saving';
		});
		addCase(reprocessSmartSwap.fulfilled, (state: any, action: any) => {
			state.status = 'imported';
			state.lineErrorsFeedback = action.payload?.logs ?? [];
		});
		addCase(reprocessSmartSwap.rejected, (state: TState & { lineErrorsFeedback: TDataImportFeedbackLineError[] }, action: any) => {
			state.status = 'failure';
			state.lineErrorsFeedback = action.payload?.logs;
			state.error = action.payload?.logs?.length > 0 ? undefined : action.payload;
		});
	},
});

export default slice;
