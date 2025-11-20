import { createSlice } from '@reduxjs/toolkit';
import { TAgreementAuthorization } from 'src/core/models/agreement-authorization';
import { TState } from 'src/core/models';
import { clears, caseDefault, caseDefaultRegister } from '..';
import { fetchAgreementAuthorization, addAgreementAuthorization, getAgreementAuthorization } from './thunks';

export type State = {
	list: TAgreementAuthorization[];
	listFilters: { folderNumber: string };
	item: TAgreementAuthorization;
};

const initialState: TState & State = {
	list: [] as TAgreementAuthorization[],
	listFilters: {} as { folderNumber: string },
	item: {} as TAgreementAuthorization,
	status: 'initial',
	error: '',
};

const slice = createSlice({
	name: 'agreementAuthorization',
	initialState,
	reducers: {
		...clears(initialState),

		setFilters(state, { payload }) {
			state.listFilters = payload;
		},

		setItem: (state, action) => {
			state.item = action.payload;
		},

	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchAgreementAuthorization)
		caseDefault(addCase, getAgreementAuthorization, 'item')
		caseDefaultRegister(addCase, addAgreementAuthorization, 'added')
	},
});

export default slice;
