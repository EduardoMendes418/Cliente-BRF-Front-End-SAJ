import { createSlice } from '@reduxjs/toolkit';
import { TState } from 'src/core/models';
import { TParameterization } from 'src/core/models/parameterization';
import { caseDefault, caseDefaultRegister, clears } from '..';
import { fetchParameterization, editParameterization } from './thunks';

export type Error = {
	detail: string;
};

export type State = {
	items: TParameterization[];
	error: Error;
};

const initialState: TState & State = {
	status: 'initial',
	items: [] as TParameterization[],
	error: {} as Error,
};

const modalSlice = createSlice({
	name: 'parameterization',
	initialState,
	reducers: clears(initialState),
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchParameterization, 'items')
		caseDefaultRegister(addCase, editParameterization, 'edited')
	},
});

export default modalSlice;
