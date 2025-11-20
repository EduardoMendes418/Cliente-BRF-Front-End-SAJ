import { createSlice } from '@reduxjs/toolkit';
import {
	fetchUsers,
	getUsers,
	addUsers,
	editUsers,
	switchUsers,
	fetchActivesUsers,
	fetchUsersList
} from './thunks';
import { TUserRequest, TUserFilters } from 'src/core/models/users';
import { TState } from 'src/core/models';
import { clears, caseDefaultRegister, caseDefault } from '..';

export type TError = { detail: string };
export type TMultipleList = { [field: string]: TUserRequest[] };

export type State = {
	list: TUserRequest[];
	listActives: TUserRequest[];
	item: TUserRequest;
	listFilters: TUserFilters;
	error: TError;
	multipleLists: TMultipleList
};

export const initialState: TState & State = {
	status: 'initial',
	list: [] as TUserRequest[],
	listActives: [] as TUserRequest[],
	item: {} as TUserRequest,
	listFilters: {} as TUserFilters,
	error: {} as TError,
	multipleLists: {} as TMultipleList
};

const slice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		...clears(initialState),
		setItem: (state, { payload }) => {
			state.item = payload ?? {} as TUserRequest
		},

		setFilters(state, { payload }) {
			state.listFilters = payload ?? {} as TUserFilters
		},

		clearList(state, action) {
			state.list = []
			
			if(action?.payload)
				state.multipleLists[action.payload] = []
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchUsers, (state, action) => {
			const {field, values} = action.payload ?? {field: null, values: []};
			state.list = values;
			
			if(field) {
				state.multipleLists[field] = values;
			}
		})
		caseDefault(addCase, fetchUsersList, (state, action) => {
			const {field, values} = action.payload ?? {field: null, values: []};
			state.list = values;
			
			if(field) {
				state.multipleLists[field] = values;
			}
		})
		caseDefault(addCase, fetchActivesUsers, 'listActives')
		caseDefault(addCase, getUsers, 'item')
		caseDefaultRegister(addCase, addUsers, 'added')
		caseDefaultRegister(addCase, editUsers, 'edited')
		caseDefaultRegister(addCase, switchUsers, 'edited')
	},
});

export default slice;
