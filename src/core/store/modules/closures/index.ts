import { createSlice } from '@reduxjs/toolkit';

import { TState } from 'src/core/models';

import { fetchClosuresResultList, addClosure, editClosure } from './thunks';
import { caseDefault, clears, caseDefaultRegister } from '..';
import { TClosures } from '../../../models/closures';

export type TError = { detail: string };

export type State = {
	list: TClosures[];
	error: TError;
};

const initialState: TState & State = {
	status: 'initial',
	error: {} as TError,
	list: [] as TClosures[],
};

const slice = createSlice({
	name: 'closures',
	initialState,
	reducers: {
		...clears(initialState)
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchClosuresResultList)
		caseDefaultRegister(addCase, addClosure, 'added')
		caseDefaultRegister(addCase, editClosure, 'edited')
	}
});

export default slice;
