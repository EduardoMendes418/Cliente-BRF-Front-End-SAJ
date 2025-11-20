import { createSlice } from '@reduxjs/toolkit';
import { TState } from 'src/core/models';
import { caseDefault, caseDefaultRegister, clears } from '..';
import { createContact, editContact, fetchContactByFilterList, fetchContactById } from './thunks';


export type State = {
	item: any;
	list: any[];
	listFilters: any;
	enums?: {
		ContactPhoneType?: Record<string, string>;
		ContactType?: Record<string, string>;
		ContactEmailType?: Record<string, string>;
		ContactAddressType?: Record<string, string>;
		ContactGender?: Record<string, string>;
		[key: string]: any;
	};
};

const initialState: TState & State = {
	status: 'initial',
	error: '',
	item: {} as any,
	list: [] as any[],
	listFilters: {} as any,
	enums: {},
};

const slice = createSlice({
	name: 'contact',
	initialState,
	reducers: {
		...clears(initialState),

		setFilters: (state, { payload }) => {
			state.listFilters = payload
		},
		setEnums: (state, { payload }) => {
			state.enums = payload;
		},
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchContactByFilterList, 'list');
		caseDefault(addCase, fetchContactById, 'item')
		caseDefaultRegister(addCase, createContact, 'added')
		caseDefaultRegister(addCase, editContact, 'edited')
	},
});

export default slice;