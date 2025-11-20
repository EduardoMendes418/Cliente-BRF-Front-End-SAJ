import { createSlice } from '@reduxjs/toolkit';

import { TStatus } from 'src/core/models';

import { fetchEqualizationResultList } from './thunks';
import { clears } from '..';
import { TEqualizationResultList } from '../../../models/equalization-result';

export type TError = { detail: string };

export type State = {
	list: { equalized: TEqualizationResultList, notEqualized: TEqualizationResultList };
	status: { equalized: TStatus, notEqualized: TStatus };
	error: TError;
};

const initialState: State = {
	list: {} as { equalized: TEqualizationResultList, notEqualized: TEqualizationResultList },
	status: { equalized: 'initial', notEqualized: 'initial' },
	error: {} as TError,
};

const getPropName = (action: any) => action.meta.arg.equalization ? 'equalized' : 'notEqualized';

const slice = createSlice({
	name: 'equalizationResult',
	initialState,
	reducers: {
		...clears(initialState)
	},
	extraReducers: ({ addCase }) => {
		addCase(fetchEqualizationResultList.pending, (state, action) => {
			const name = getPropName(action);
			state.status[name] = 'fetching';
		});

		addCase(fetchEqualizationResultList.fulfilled, (state, action) => {
			const name = getPropName(action);
			state.list[name] = action.payload ?? {};
			state.status[name] = 'initial';
		});

		addCase(fetchEqualizationResultList.rejected, (state, action) => {
			const name = getPropName(action);
			state.status[name] = 'failure';
			state.error = action.payload as TError;
		});
	}
});

export default slice;
