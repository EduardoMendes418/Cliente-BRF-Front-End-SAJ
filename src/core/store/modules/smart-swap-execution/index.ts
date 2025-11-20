import { createSlice } from '@reduxjs/toolkit';
import {
	fetchsmartSwapExecution,
	fetstatusExecutionSmartSwap,
	fetstatusstatusProcessSmartSwap
} from './thunks';
import { TState } from 'src/core/models';
import { clears, caseDefault } from '..';
import { SmartSwapChangesParameters, SmartSwapChangesResponse, SmartSwapExecution, StatusExecutionSmartSwap } from 'src/core/models/smart-swap-execution';

export type TError = { detail: string };

export type State = {
	list: SmartSwapExecution[];
	listFilters: SmartSwapChangesParameters;
	error: TError;
	execution: StatusExecutionSmartSwap[];
	process: StatusExecutionSmartSwap[];
};


export const initialState: TState & State = {
	status: 'initial',
	list: [] as SmartSwapExecution[],
	listFilters: {} as SmartSwapChangesParameters,
	error: {} as TError,
	execution: [] as StatusExecutionSmartSwap[],
	process: [] as StatusExecutionSmartSwap[]
};

const slice = createSlice({
	name: 'smartSwapExecution',
	initialState,
	reducers: {
		...clears(initialState),
		setFilters(state, { payload }) {
			state.listFilters = payload ?? {} as SmartSwapChangesParameters
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchsmartSwapExecution)
		caseDefault(addCase, fetstatusExecutionSmartSwap, "execution")
		caseDefault(addCase, fetstatusstatusProcessSmartSwap, "process")
	},
});

export default slice;
