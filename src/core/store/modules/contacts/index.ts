import { createSlice } from '@reduxjs/toolkit';

import { TState } from 'src/core/models';
import { TContact, TContactOption, TContactWithoutIncludes } from 'src/core/models/contacts';

import { fetchContacts, fetchContactsWithLike, fetchContactsWithLikeWithoutIncludes, fetchLikeAndCpfWithoutIncludes } from './thunks';
import { clears, caseDefault } from '..';

export type State = {
	list: TContact[];
	item: TContact;
	filter: string;
	multipleList: { [field: string]: TContactOption[] }
	withoutIncludes: TContactWithoutIncludes[]
};

const initialState: TState & State = {
	status: 'initial',
	error: '',
	list: [] as TContact[],
	item: {} as TContact,
	filter: '',
	multipleList: {} as { [field: string]: TContactOption[] },
	withoutIncludes: []
};

const slice = createSlice({
	name: 'contacts',
	initialState,
	reducers: {
		...clears(initialState),

		clearList(state, action) {
			if (action.payload)
				state.multipleList[action.payload] = [] as TContactOption[];
			else
				state.list = [] as TContact[];
		},

		changeFilter(state, action) {
			state.filter = action.payload;
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchContacts)
		caseDefault(addCase, fetchContactsWithLike)
		caseDefault(addCase, fetchContactsWithLikeWithoutIncludes, (state, action) => {
			const { field, items } = action.payload ?? {};
			state.multipleList[field] = items ?? [];
		})
		caseDefault(addCase, fetchLikeAndCpfWithoutIncludes, "withoutIncludes")
	},
});

export default slice;
